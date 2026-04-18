<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $roles)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $allowedRoles = array_values(array_filter(array_map(
            fn ($role) => strtolower(trim($role)),
            explode(',', $roles)
        )));

        $userRole = strtolower($user->role?->slug ?? '');

        if ($userRole === '' || !in_array($userRole, $allowedRoles, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access.',
            ], 403);
        }

        return $next($request);
    }
}
