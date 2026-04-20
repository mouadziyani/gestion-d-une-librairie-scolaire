<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AdminUserRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class AdminUserController extends Controller
{
    private function generateTemporaryPassword(int $length = 10): string
    {
        $letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $numbers = '0123456789';
        $characters = $letters.$numbers;
        $password = [
            $letters[random_int(0, strlen($letters) - 1)],
            $numbers[random_int(0, strlen($numbers) - 1)],
        ];

        while (count($password) < $length) {
            $password[] = $characters[random_int(0, strlen($characters) - 1)];
        }

        shuffle($password);

        return implode('', $password);
    }

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => User::with('role')->latest()->get(),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(AdminUserRequest $request)
    {
        $data = $request->validated();
        $roleSlug = $data['role_slug'] === 'user' ? 'client' : $data['role_slug'];
        $data['role_id'] = Role::where('slug', $roleSlug)->valueOrFail('id');
        unset($data['role_slug']);

        $plainPassword = $this->generateTemporaryPassword();
        $data['password'] = Hash::make($plainPassword);

        $user = DB::transaction(function () use ($data, $plainPassword) {
            $user = User::create($data);
            $user->load('role');

            Mail::send(
                ['html' => 'emails.auth.admin-created-user', 'text' => 'emails.auth.admin-created-user-text'],
                [
                    'userName' => $user->name,
                    'email' => $user->email,
                    'password' => $plainPassword,
                    'roleName' => $user->role?->name,
                    'loginUrl' => rtrim(config('app.frontend_url'), '/').'/login',
                    'logoUrl' => rtrim(config('app.url'), '/').'/images/library.png',
                ],
                function ($message) use ($user) {
                    $message
                        ->to($user->email, $user->name)
                        ->subject('Your Library BOUGDIM account is ready');
                }
            );

            return $user;
        });

        return response()->json([
            'success' => true,
            'data' => $user->fresh()->load('role'),
            'message' => 'User created successfully and password email sent.',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => User::with('role')->findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(AdminUserRequest $request, string $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validated();

        if (!filled($data['password'] ?? null)) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }

            $data['profile_photo'] = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'data' => $user->fresh()->load('role'),
            'message' => 'The operation was successful',
        ]);
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'The operation was successful',
        ]);
    }
}
