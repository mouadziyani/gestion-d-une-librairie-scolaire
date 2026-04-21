<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InvoiceCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_manage_invoice_crud(): void
    {
        $adminRole = Role::create(['name' => 'Admin', 'slug' => 'admin']);
        $clientRole = Role::create(['name' => 'Client', 'slug' => 'client']);

        $admin = User::factory()->create(['role_id' => $adminRole->id]);
        $client = User::factory()->create(['role_id' => $clientRole->id]);

        Sanctum::actingAs($admin);

        $createResponse = $this->postJson('/api/invoices', [
            'user_id' => $client->id,
            'invoice_number' => 'INV-TEST-001',
            'status' => 'pending',
            'items' => [
                ['name' => 'Manual school pack', 'quantity' => 2, 'price' => 75],
            ],
        ]);

        $createResponse
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.invoice.invoice_number', 'INV-TEST-001')
            ->assertJsonPath('data.invoice.total_amount', 150);

        $invoiceId = $createResponse->json('data.invoice.id');

        $this->getJson('/api/invoices')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.data.0.invoice_number', 'INV-TEST-001');

        $this->getJson("/api/invoices/{$invoiceId}")
            ->assertOk()
            ->assertJsonPath('data.invoice_number', 'INV-TEST-001');

        $this->putJson("/api/invoices/{$invoiceId}", [
            'status' => 'paid',
            'items' => [
                ['name' => 'Manual school pack', 'quantity' => 3, 'price' => 75],
            ],
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'paid')
            ->assertJsonPath('data.total_amount', 225)
            ->assertJsonPath('data.order.payment_status', 'paid');

        $this->deleteJson("/api/invoices/{$invoiceId}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('invoices', ['id' => $invoiceId]);
        $this->assertSame(0, Invoice::count());
    }
}
