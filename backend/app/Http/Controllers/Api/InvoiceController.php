<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Payments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::query()
            ->with(['order.user.role', 'order.school', 'items', 'payments.user'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('user_id')) {
            $query->whereHas('order', fn ($orderQuery) => $orderQuery->where('user_id', $request->query('user_id')));
        }

        if ($request->filled('school_id')) {
            $query->whereHas('order', fn ($orderQuery) => $orderQuery->where('school_id', $request->query('school_id')));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($builder) use ($search) {
                $builder->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('order.user', fn ($userQuery) => $userQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%"))
                    ->orWhereHas('order.school', fn ($schoolQuery) => $schoolQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%"));
            });
        }

        $perPage = min((int) $request->query('per_page', 10), 50);

        return response()->json([
            'success' => true,
            'data' => $query->paginate($perPage),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);

        $total = $this->calculateTotal($validated['items']);

        if ($total <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice total must be greater than zero.',
            ], 422);
        }

        $paymentStatus = $this->paymentStatusFromInvoice($validated['status']);
        $orderStatus = $this->orderStatusFromInvoice($validated['status']);

        $result = DB::transaction(function () use ($validated, $total, $paymentStatus, $orderStatus) {
            $order = Order::create([
                'user_id' => $validated['user_id'],
                'school_id' => $validated['school_id'] ?? null,
                'status' => $orderStatus,
                'total_price' => $total,
                'payment_method' => 'manual',
                'payment_status' => $paymentStatus,
                'delivery_address' => 'Manual invoice created by admin.',
            ]);

            $invoice = Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => ($validated['invoice_number'] ?? null) ?: 'INV-'.Str::upper(Str::random(10)),
                'total_amount' => $total,
                'status' => $validated['status'],
                'issued_at' => $validated['issued_at'] ?? now()->toDateString(),
            ]);

            $invoice->items()->createMany(collect($validated['items'])->map(fn (array $item) => [
                'name' => $item['name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ])->all());

            Payments::create([
                'order_id' => $order->id,
                'invoice_id' => $invoice->id,
                'user_id' => $validated['user_id'],
                'amount' => $total,
                'payment_method' => 'manual',
                'payment_status' => $paymentStatus,
                'reference' => $invoice->invoice_number,
                'paid_at' => $paymentStatus === 'paid' ? now() : null,
                'note' => collect($validated['items'])
                    ->map(fn (array $item) => "{$item['name']} x {$item['quantity']}")
                    ->implode(', '),
            ]);

            return [
                'order' => $order->fresh(['user.role', 'school', 'payments.invoice.items']),
                'invoice' => $invoice->fresh(['order.user.role', 'order.school', 'items', 'payments.user']),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $result,
            'message' => 'Invoice created successfully.',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => Invoice::with(['order.user.role', 'order.school', 'items', 'payments.user'])->findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(Request $request, string $id)
    {
        $invoice = Invoice::with(['order.payments', 'items'])->findOrFail($id);
        $validated = $this->validatePayload($request, $invoice->id, true);

        if (array_key_exists('items', $validated)) {
            $total = $this->calculateTotal($validated['items']);

            if ($total <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice total must be greater than zero.',
                ], 422);
            }
        }

        $result = DB::transaction(function () use ($invoice, $validated) {
            $order = $invoice->order;

            if (array_key_exists('user_id', $validated)) {
                $order->user_id = $validated['user_id'];
            }

            if (array_key_exists('school_id', $validated)) {
                $order->school_id = $validated['school_id'];
            }

            if (array_key_exists('status', $validated)) {
                $invoice->status = $validated['status'];
                $order->status = $this->orderStatusFromInvoice($validated['status']);
                $order->payment_status = $this->paymentStatusFromInvoice($validated['status']);
            }

            if (array_key_exists('items', $validated)) {
                $total = $this->calculateTotal($validated['items']);
                $invoice->total_amount = $total;
                $order->total_price = $total;
                $invoice->items()->delete();
                $invoice->items()->createMany(collect($validated['items'])->map(fn (array $item) => [
                    'name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ])->all());
            }

            if (array_key_exists('invoice_number', $validated) && $validated['invoice_number']) {
                $invoice->invoice_number = $validated['invoice_number'];
            }

            if (array_key_exists('issued_at', $validated)) {
                $invoice->issued_at = $validated['issued_at'];
            }

            $order->save();
            $invoice->save();

            $paymentStatus = $this->paymentStatusFromInvoice($invoice->status);
            $order->payments()
                ->where('invoice_id', $invoice->id)
                ->update([
                    'user_id' => $order->user_id,
                    'amount' => $invoice->total_amount,
                    'payment_status' => $paymentStatus,
                    'reference' => $invoice->invoice_number,
                    'paid_at' => $paymentStatus === 'paid' ? now() : null,
                ]);

            return $invoice->fresh(['order.user.role', 'order.school', 'items', 'payments.user']);
        });

        return response()->json([
            'success' => true,
            'data' => $result,
            'message' => 'Invoice updated successfully.',
        ]);
    }

    public function destroy(string $id)
    {
        $invoice = Invoice::with(['order.orderItems'])->findOrFail($id);

        DB::transaction(function () use ($invoice) {
            $order = $invoice->order;
            $isManualInvoiceOrder = $order
                && $order->payment_method === 'manual'
                && $order->orderItems->isEmpty();

            if ($isManualInvoiceOrder) {
                $order->delete();
                return;
            }

            Payments::where('invoice_id', $invoice->id)->update(['invoice_id' => null]);
            $invoice->delete();
        });

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'Invoice deleted successfully.',
        ]);
    }

    private function validatePayload(Request $request, ?int $invoiceId = null, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'user_id' => [$required, 'integer', 'exists:users,id'],
            'school_id' => ['sometimes', 'nullable', 'integer', 'exists:schools,id'],
            'invoice_number' => [
                'sometimes',
                'nullable',
                'string',
                'max:80',
                Rule::unique('invoices', 'invoice_number')->ignore($invoiceId),
            ],
            'issued_at' => ['sometimes', 'nullable', 'date'],
            'status' => [$required, 'string', 'in:draft,pending,unpaid,paid,cancelled'],
            'items' => [$required, 'array', 'min:1'],
            'items.*.name' => ['required_with:items', 'string', 'max:160'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
            'items.*.price' => ['required_with:items', 'numeric', 'min:0'],
        ]);
    }

    private function calculateTotal(array $items): float
    {
        return (float) collect($items)->sum(function (array $item) {
            return (int) $item['quantity'] * (float) $item['price'];
        });
    }

    private function paymentStatusFromInvoice(string $status): string
    {
        return match ($status) {
            'paid' => 'paid',
            'cancelled' => 'failed',
            default => 'pending',
        };
    }

    private function orderStatusFromInvoice(string $status): string
    {
        return match ($status) {
            'paid' => 'completed',
            'cancelled' => 'cancelled',
            default => 'pending',
        };
    }
}
