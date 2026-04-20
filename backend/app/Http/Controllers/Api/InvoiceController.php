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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'school_id' => ['nullable', 'integer', 'exists:schools,id'],
            'invoice_number' => ['nullable', 'string', 'max:80', Rule::unique('invoices', 'invoice_number')],
            'issued_at' => ['nullable', 'date'],
            'status' => ['required', 'string', 'in:draft,pending,unpaid,paid,cancelled'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.name' => ['required', 'string', 'max:160'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
        ]);

        $total = collect($validated['items'])->sum(function (array $item) {
            return (int) $item['quantity'] * (float) $item['price'];
        });

        if ($total <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice total must be greater than zero.',
            ], 422);
        }

        $paymentStatus = match ($validated['status']) {
            'paid' => 'paid',
            'cancelled' => 'failed',
            default => 'pending',
        };

        $orderStatus = match ($validated['status']) {
            'paid' => 'completed',
            'cancelled' => 'cancelled',
            default => 'pending',
        };

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
                'invoice_number' => $validated['invoice_number'] ?: 'INV-'.Str::upper(Str::random(10)),
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
                'invoice' => $invoice->fresh('items'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $result,
            'message' => 'Invoice created successfully.',
        ], 201);
    }
}
