<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            [
                'name' => 'Admin',
                'slug' => 'admin',
            ],
            [
                'name' => 'Client',
                'slug' => 'client',
            ],
            [
                'name' => 'Moderator',
                'slug' => 'moderator',
            ],
        ]);
    }
}