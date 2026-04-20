<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SitePreference;
use Illuminate\Http\Request;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SitePreferenceController extends Controller
{
    public function show()
    {
        $this->ensureTableExists();
        $preferences = $this->currentPreferences();

        return response()->json([
            'success' => true,
            'data' => $preferences,
            'message' => 'The operation was successful',
        ]);
    }

    public function update(Request $request)
    {
        $this->ensureTableExists();
        $roleSlug = strtolower($request->user()?->role?->slug ?? '');
        $allowed = $roleSlug === 'admin'
            ? ['general', 'publicPages', 'landingSections', 'footer', 'system', 'rolePages']
            : ['landingSections', 'footer'];

        $validated = $request->validate(array_filter([
            'general' => in_array('general', $allowed, true) ? 'sometimes|array' : null,
            'publicPages' => in_array('publicPages', $allowed, true) ? 'sometimes|array' : null,
            'landingSections' => in_array('landingSections', $allowed, true) ? 'sometimes|array' : null,
            'footer' => in_array('footer', $allowed, true) ? 'sometimes|array' : null,
            'system' => in_array('system', $allowed, true) ? 'sometimes|array' : null,
            'rolePages' => in_array('rolePages', $allowed, true) ? 'sometimes|array' : null,
        ]));

        $preferences = SitePreference::query()->firstOrCreate(
            ['id' => 1],
            $this->defaultPreferences()
        );

        $payload = $preferences->toArray();

        foreach ($allowed as $key) {
            if (array_key_exists($key, $validated)) {
                $payload[$this->mapKey($key)] = $validated[$key];
            }
        }

        $payload = array_merge($this->defaultPreferences(), $payload);
        $preferences->fill($this->normalizePayload($payload));
        $preferences->save();

        return response()->json([
            'success' => true,
            'data' => $this->formatPreferences($preferences->fresh()),
            'message' => 'The operation was successful',
        ]);
    }

    private function currentPreferences(): array
    {
        if (! Schema::hasTable('site_preferences')) {
            return $this->defaultPreferences();
        }

        $preferences = SitePreference::query()->first();

        if (! $preferences) {
            return $this->defaultPreferences();
        }

        return $this->formatPreferences($preferences);
    }

    private function formatPreferences(SitePreference $preferences): array
    {
        return $this->normalizePayload(array_merge($this->defaultPreferences(), $preferences->toArray()));
    }

    private function normalizePayload(array $payload): array
    {
        return [
            'general' => $payload['general'] ?? [],
            'public_pages' => $payload['publicPages'] ?? $payload['public_pages'] ?? [],
            'landing_sections' => $payload['landingSections'] ?? $payload['landing_sections'] ?? [],
            'footer' => $payload['footer'] ?? [],
            'system' => $payload['system'] ?? [],
            'role_pages' => $payload['rolePages'] ?? $payload['role_pages'] ?? [],
        ];
    }

    private function mapKey(string $key): string
    {
        return match ($key) {
            'publicPages' => 'publicPages',
            'landingSections' => 'landingSections',
            'rolePages' => 'rolePages',
            default => $key,
        };
    }

    private function defaultPreferences(): array
    {
        return [
            'general' => [
                'storeName' => 'Library BOUGDIM',
                'legalName' => 'S.A.R.L. Bougdim & Co',
                'address' => 'BD HASSAN II NR 07 ELAIOUN SIDI MELLOUK',
                'email' => 'contact@bougdim.com',
                'phone' => '+212 536 XX XX XX',
            ],
            'publicPages' => [
                'home' => true,
                'products' => true,
                'categories' => true,
                'specialOrder' => true,
                'about' => true,
                'contact' => true,
                'support' => true,
                'login' => true,
                'register' => true,
            ],
            'landingSections' => [
                'hero' => true,
                'features' => true,
                'featuredEssentials' => true,
                'discountBanner' => true,
                'bestSellers' => true,
                'categoryHighlights' => true,
                'brandStory' => true,
                'schoolPartners' => true,
                'callToAction' => true,
            ],
            'footer' => [
                'enabled' => true,
                'brandTitle' => 'BOUGDIM.',
                'brandDescription' => 'Your trusted library for school books, scientific equipment, and office supplies. Empowering education since 2026.',
                'columns' => [
                    'explore' => true,
                    'support' => true,
                    'office' => true,
                ],
                'columnLabels' => [
                    'explore' => 'Explore',
                    'support' => 'Support',
                    'office' => 'Office',
                ],
                'publicPages' => [
                    'home' => true,
                    'products' => true,
                    'categories' => true,
                    'specialOrder' => true,
                    'about' => true,
                    'contact' => true,
                    'support' => true,
                    'login' => true,
                ],
            ],
            'system' => [
                'registration' => true,
                'maintenance' => false,
                'twoFactor' => false,
            ],
            'rolePages' => [
                'client' => ['dashboard', 'shop', 'cart', 'checkout', 'orders', 'invoices', 'wishlist', 'profile'],
                'moderator' => ['dashboard', 'products', 'stock', 'orders', 'schools', 'invoices', 'specialOrder', 'reports'],
                'admin' => [
                    'dashboard',
                    'analytics',
                    'products',
                    'addProduct',
                    'categories',
                    'stock',
                    'orders',
                    'addUser',
                    'users',
                    'schools',
                    'suppliers',
                    'invoices',
                    'specialOrder',
                    'reports',
                    'rolesPermissions',
                    'settings',
                    'systemConfig',
                ],
            ],
        ];
    }

    private function ensureTableExists(): void
    {
        if (Schema::hasTable('site_preferences')) {
            return;
        }

        Schema::create('site_preferences', function (Blueprint $table) {
            $table->id();
            $table->json('general')->nullable();
            $table->json('public_pages')->nullable();
            $table->json('landing_sections')->nullable();
            $table->json('footer')->nullable();
            $table->json('system')->nullable();
            $table->json('role_pages')->nullable();
            $table->timestamps();
        });
    }
}
