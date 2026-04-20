<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id');
        $isUpdate = (bool) $userId;

        return [
            'name' => 'required|string|max:50',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'role_id' => $isUpdate ? 'required|integer|exists:roles,id' : 'nullable|integer|exists:roles,id',
            'role_slug' => $isUpdate ? 'prohibited' : 'required|string|in:client,user,moderator',
            'password' => 'nullable|confirmed|min:8',
            'profile_photo' => 'nullable|file|mimes:jpg,jpeg,png,webp,gif|max:10240',
        ];
    }
}
