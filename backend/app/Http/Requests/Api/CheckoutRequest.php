<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'delivery_address' => 'required|string|max:255',
            'school_id' => 'nullable|integer|exists:schools,id',
            'payment_method' => 'required|string|in:cash,stripe',
            'stripe_payment_intent_id' => 'nullable|string|max:255',
            'stripe_payment_status' => 'nullable|string|max:50',
            'note' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }
}
