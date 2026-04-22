<?php

namespace App\Http\Requests\Api;

use App\Rules\StrongPassword;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($this->user()->id),
            ],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'profile_photo' => 'nullable|file|mimes:jpg,jpeg,png,webp,gif|max:10240',
            'current_password' => 'nullable|required_with:password',
            'password' => ['nullable', 'confirmed', new StrongPassword()],
        ];
    }
}
