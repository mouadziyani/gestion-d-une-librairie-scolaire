<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Requests\Api\UpdateProfileRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\LogoutRequest;
use App\Http\Requests\Api\MeRequest;
use App\Models\Role;
use App\Models\User;

class AuthController extends Controller
{
    private function tokenResponse(User $user, string $message, int $status = 200)
    {
        $user->load('role');
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
            'message' => $message,
        ], $status);
    }

    public function register(RegisterRequest $request)
    {
        $clientRole = Role::firstOrCreate(
            ['slug' => 'client'],
            ['name' => 'Client']
        );

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $clientRole->id,
        ]);

        return $this->tokenResponse($user, 'The operation was successful', 201);
    }

    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email or password is incorrect.',
            ], 401);
        }

        return $this->tokenResponse($user, 'The operation was successful');
    }

    public function logout(LogoutRequest $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'data' => (object)[],
            'message' => 'The operation was successful'
        ]);
    }

    public function me(MeRequest $request)
    {
        $user = $request->user();
        $user?->load('role');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user
            ],
            'message' => 'The operation was successful'
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = $request->user();

        if ($request->filled('password')) {
            if (!$request->filled('current_password') || !Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect.',
                ], 422);
            }

            $user->password = Hash::make($request->password);
        }

        $data = $request->only('name', 'email', 'phone', 'address');

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }

            $data['profile_photo'] = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        $user->fill($data);
        $user->save();
        $user->load('role');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->fresh()->load('role'),
            ],
            'message' => 'The operation was successful',
        ]);
    }

    public function destroyProfile(MeRequest $request)
    {
        $user = $request->user();

        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $user->currentAccessToken()?->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'Profile deleted successfully.',
        ]);
    }
}
