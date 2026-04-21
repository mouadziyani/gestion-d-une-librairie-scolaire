<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CheckoutRequest;
use App\Http\Requests\Api\OrderRequest;
use App\Models\Invoice;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payments;
use App\Models\Product;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Order::with(['user.role', 'school', 'orderItems.product', 'invoice.items', 'payments.invoice.items', 'payments.user'])
                ->latest()
                ->paginate(10),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(OrderRequest $request)
    {
        $order = Order::create($request->validated());

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'The operation was successful',
        ], 201);
    }

    public function checkout(CheckoutRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();
        $items = collect($validated['items']);

        $result = DB::transaction(function () use ($user, $validated, $items) {
            $products = Product::whereIn('id', $items->pluck('product_id')->all())
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $normalizedItems = [];
            $totalPrice = 0;

            foreach ($items as $item) {
                $product = $products->get($item['product_id']);

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => 'One of the selected products no longer exists.',
                    ]);
                }

                $quantity = (int) $item['quantity'];

                if ($quantity < 1) {
                    throw ValidationException::withMessages([
                        'items' => 'Invalid product quantity.',
                    ]);
                }

                if ((int) $product->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Not enough stock available for {$product->name}.",
                    ]);
                }

                $linePrice = (float) $product->price * $quantity;
                $totalPrice += $linePrice;

                $normalizedItems[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'price' => (float) $product->price,
                    'line_price' => $linePrice,
                ];
            }

            $isStripePaid = $this->checkStripePayment($validated, $totalPrice);

            $order = Order::create([
                'user_id' => $user?->id,
                'school_id' => $validated['school_id'] ?? null,
                'status' => 'pending',
                'total_price' => $totalPrice,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $isStripePaid ? 'paid' : 'unpaid',
                'delivery_address' => $validated['delivery_address'],
            ]);

            foreach ($normalizedItems as $line) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $line['product']->id,
                    'quantity' => $line['quantity'],
                    'price' => $line['price'],
                ]);

                $line['product']->stock = max(0, (int) $line['product']->stock - $line['quantity']);
                $line['product']->is_available = $line['product']->stock > 0;
                $line['product']->save();

                Stock::create([
                    'product_id' => $line['product']->id,
                    'quantity' => -1 * $line['quantity'],
                    'type' => 'sale',
                    'note' => "Order #{$order->id}",
                ]);
            }

            $payment = Payments::create([
                'order_id' => $order->id,
                'invoice_id' => null,
                'user_id' => $user?->id,
                'amount' => $totalPrice,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $isStripePaid ? 'paid' : ($validated['payment_method'] === 'stripe' ? 'pending' : 'pending'),
                'stripe_payment_intent_id' => $validated['stripe_payment_intent_id'] ?? null,
                'reference' => $validated['stripe_payment_intent_id'] ?? ('ORD-' . Str::upper(Str::random(10))),
                'paid_at' => null,
                'note' => $validated['note'] ?? null,
            ]);

            if ($isStripePaid) {
                $payment->paid_at = now();
                $payment->save();
            }

            $invoice = Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => 'INV-' . Str::upper(Str::random(10)),
                'total_amount' => $totalPrice,
                'status' => $isStripePaid ? 'paid' : 'unpaid',
                'issued_at' => now()->toDateString(),
            ]);

            $payment->invoice_id = $invoice->id;
            $payment->save();

            Notification::create([
                'user_id' => $user?->id,
                'type' => 'order',
                'message' => "Your order #{$order->id} has been placed successfully.",
                'is_read' => false,
                'order_id' => $order->id,
            ]);

            return [
                'order' => $order->load(['orderItems.product', 'payments.invoice', 'school']),
                'payment' => $payment->load(['invoice']),
                'invoice' => $invoice,
                'items' => $normalizedItems,
                'summary' => [
                    'subtotal' => $totalPrice,
                    'total' => $totalPrice,
                    'item_count' => $items->sum('quantity'),
                ],
            ];
        });

        $this->notifyStaffAboutNewOrder($result['order'], $user);

        return response()->json([
            'success' => true,
            'data' => $result,
            'message' => 'Your order has been validated successfully.',
        ], 201);
    }

    private function checkStripePayment(array $validated, float $totalPrice): bool
    {
        if ($validated['payment_method'] !== 'stripe') {
            return false;
        }

        if (empty($validated['stripe_payment_intent_id'])) {
            throw ValidationException::withMessages([
                'payment_method' => 'Stripe payment is missing.',
            ]);
        }

        $secret = config('services.stripe.secret');

        if (! $secret) {
            throw ValidationException::withMessages([
                'payment_method' => 'Stripe is not configured on the server.',
            ]);
        }

        try {
            Stripe::setApiKey($secret);
            $intent = PaymentIntent::retrieve($validated['stripe_payment_intent_id']);
        } catch (\Throwable $throwable) {
            throw ValidationException::withMessages([
                'payment_method' => 'Stripe payment could not be verified.',
            ]);
        }

        $expectedAmount = (int) round($totalPrice * 100);

        if ($intent->status !== 'succeeded' || (int) $intent->amount < $expectedAmount) {
            throw ValidationException::withMessages([
                'payment_method' => 'Stripe payment is not completed.',
            ]);
        }

        return true;
    }

    private function notifyStaffAboutNewOrder(Order $order, ?User $customer): void
    {
        $order->loadMissing(['school', 'orderItems.product', 'payments']);

        $staffUsers = User::query()
            ->whereHas('role', function ($query) {
                $query->whereIn('slug', ['admin', 'moderator']);
            })
            ->get();

        if ($staffUsers->isEmpty()) {
            return;
        }

        $customerName = $customer?->name ?: 'A customer';
        $total = number_format((float) $order->total_price, 2);
        $message = "{$customerName} placed order #{$order->id} for {$total} DH.";

        foreach ($staffUsers as $staffUser) {
            Notification::create([
                'user_id' => $staffUser->id,
                'type' => 'new_order',
                'message' => $message,
                'is_read' => false,
                'order_id' => $order->id,
            ]);

            $this->sendStaffOrderEmail($staffUser, $order, $customerName);
        }
    }

    private function sendStaffOrderEmail(User $staffUser, Order $order, string $customerName): void
    {
        try {
            $items = $order->orderItems
                ->map(function (OrderItem $item) {
                    $productName = $item->product?->name ?: "Product #{$item->product_id}";
                    $lineTotal = number_format((float) $item->price * (int) $item->quantity, 2);

                    return "- {$productName} x {$item->quantity}: {$lineTotal} DH";
                })
                ->implode("\n");

            $body = implode("\n", [
                "Hello {$staffUser->name},",
                '',
                "A new order has been placed on Library BOUGDIM.",
                '',
                "Order: #{$order->id}",
                "Customer: {$customerName}",
                "Total: " . number_format((float) $order->total_price, 2) . ' DH',
                "Payment method: {$order->payment_method}",
                "Payment status: {$order->payment_status}",
                "Delivery address: {$order->delivery_address}",
                $order->school ? "School: {$order->school->name}" : null,
                '',
                "Items:",
                $items ?: '- No items found',
                '',
                'Please check the admin dashboard for full details.',
            ]);

            Mail::raw($body, function ($message) use ($staffUser, $order) {
                $message
                    ->to($staffUser->email, $staffUser->name)
                    ->subject("New order #{$order->id} - Library BOUGDIM");
            });
        } catch (\Throwable $throwable) {
            Log::warning('Failed to email staff about new order.', [
                'order_id' => $order->id,
                'staff_user_id' => $staffUser->id,
                'error' => $throwable->getMessage(),
            ]);
        }
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => Order::with(['user.role', 'school', 'orderItems.product', 'invoice.items', 'payments.invoice.items', 'payments.user'])->findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function mine(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => Order::with(['school', 'orderItems.product', 'payments.invoice'])
                ->where('user_id', $user?->id)
                ->latest()
                ->get(),
            'message' => 'The operation was successful',
        ]);
    }

    public function mineShow(Request $request, string $id)
    {
        $user = $request->user();

        $order = Order::with(['school', 'orderItems.product', 'payments'])
            ->where('user_id', $user?->id)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'The operation was successful',
        ]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'nullable|string|in:unpaid,paid,failed,pending',
        ]);

        $order = Order::with('payments.invoice')->findOrFail($id);
        $order->status = $validated['status'];

        if (array_key_exists('payment_status', $validated) && $validated['payment_status'] !== null) {
            $order->payment_status = $validated['payment_status'];

            $payment = $order->payments->sortByDesc('id')->first();
            if ($payment) {
                $payment->payment_status = $validated['payment_status'];
                if ($validated['payment_status'] === 'paid') {
                    $payment->paid_at = now();
                }
                $payment->save();
            }

            if ($order->invoice) {
                $order->invoice->status = $validated['payment_status'];
                $order->invoice->save();
            }
        }

        $order->save();

        if ($order->user_id) {
            Notification::create([
                'user_id' => $order->user_id,
                'type' => 'order',
                'message' => "Your order #{$order->id} status changed to {$order->status}.",
                'is_read' => false,
                'order_id' => $order->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $order->fresh(['user.role', 'school', 'orderItems.product', 'payments.invoice', 'payments.user']),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(OrderRequest $request, string $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $order->fresh(),
            'message' => 'The operation was successful',
        ]);
    }

    public function destroy(string $id)
    {
        Order::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'The operation was successful',
        ]);
    }
}
