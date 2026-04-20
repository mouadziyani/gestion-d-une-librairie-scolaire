<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class PaymentsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'order_id' => 'required|integer|exists:orders,id',
            'invoice_id' => 'nullable|integer|exists:invoices,id',
            'user_id' => 'required|integer|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:cash,bank_transfer,stripe',
            'payment_status' => 'required|string|in:pending,paid,failed',
            'reference' => 'nullable|string',
            'paid_at' => 'nullable|date',
            'note' => 'nullable|string',
        ];
    }
}
