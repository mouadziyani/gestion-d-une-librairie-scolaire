<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SpecialOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'nullable|integer|exists:users,id',
            'school_id' => 'nullable|integer|exists:schools,id',
            'item_name' => 'required|string|max:255',
            'category_id' => 'nullable|integer|exists:categories,id',
            'quantity' => 'required|integer|min:1',
            'details' => 'nullable|string',
            'status' => 'nullable|string|in:pending,approved,rejected,completed',
            'admin_note' => 'nullable|string',
        ];
    }
}
