<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SupplierCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_manage_supplier_crud(): void
    {
        $adminRole = Role::create(['name' => 'Admin', 'slug' => 'admin']);
        $admin = User::factory()->create(['role_id' => $adminRole->id]);

        Sanctum::actingAs($admin);

        $createResponse = $this->postJson('/api/suppliers', [
            'name' => 'Atlas School Supply',
            'code' => 'ATL-001',
            'status' => 'active',
            'email' => 'contact@atlas.test',
            'phone' => '+212600000000',
            'address' => 'Casablanca',
            'company_name' => 'Atlas SARL',
        ]);

        $createResponse
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.code', 'ATL-001');

        $supplierId = $createResponse->json('data.id');

        $this->getJson('/api/suppliers?search=Atlas')
            ->assertOk()
            ->assertJsonPath('data.data.0.name', 'Atlas School Supply');

        $this->getJson("/api/suppliers/{$supplierId}")
            ->assertOk()
            ->assertJsonPath('data.email', 'contact@atlas.test');

        $this->putJson("/api/suppliers/{$supplierId}", [
            'name' => 'Atlas Updated',
            'code' => 'ATL-002',
            'status' => 'inactive',
            'email' => 'updated@atlas.test',
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Atlas Updated')
            ->assertJsonPath('data.status', 'inactive');

        $this->deleteJson("/api/suppliers/{$supplierId}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertSame(0, Supplier::count());
    }
}
