<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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
        $adminRole = DB::table('roles')
            ->where('slug', 'admin')
            ->first();

        // 3. Create test user
        User::factory()->create([
            'name' => 'Mouad Ziyani',
            'email' => 'contact@mouadziyani.com',
            'password' => bcrypt('02122023M'),
            'role_id' => $adminRole?->id,
        ]);
    }
} 