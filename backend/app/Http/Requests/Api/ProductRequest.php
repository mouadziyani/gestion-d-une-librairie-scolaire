<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($this->route('id')),
            ],
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|string|max:255',
            'is_available' => 'required|boolean',
            'category_id' => 'required|integer|exists:categories,id',
            'supplier_id' => 'nullable|integer|exists:suppliers,id',
            'reference' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('products', 'reference')->ignore($this->route('id')),
            ],
            'min_stock' => 'required|integer|min:0',
            'status' => 'required|string|in:active,inactive',
            'discount' => 'nullable|numeric|min:0',
            'level' => 'nullable|string|max:255',
        ];
    }
}
