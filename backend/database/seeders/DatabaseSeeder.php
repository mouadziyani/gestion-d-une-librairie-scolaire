<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. First: seed roles (IMPORTANT)
        $this->call([
            RoleSeeder::class,
        ]);

        // 2. Get admin role safely (no hardcoded ID)
        $adminRole = DB::table('roles')->where('slug', 'admin')->first();

        if (! $adminRole) {
            throw new \RuntimeException('Admin role was not seeded.');
        }

        // 3. Create test user
        User::query()->updateOrCreate(
            ['email' => 'contact@mouadziyani.com'],
            [
                'name' => 'Mouad Ziyani',
                'password' => Hash::make('02122023M'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
            ]
        );
    }
} 
