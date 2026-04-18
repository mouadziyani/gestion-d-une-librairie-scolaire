<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'school_id' => 'nullable|integer|exists:schools,id',
            'status' => 'required|string|in:pending,processing,completed,cancelled',
            'total_price' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string|max:50',
            'payment_status' => 'required|string|in:unpaid,paid,failed',
            'delivery_address' => 'nullable|string|max:255',
        ];
    }
}
