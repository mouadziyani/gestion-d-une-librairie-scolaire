<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\DashboardRequest;
use App\Models\Category;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Payments;
use App\Models\Product;
use App\Models\SpecialOrder;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function index(DashboardRequest $request)
    {
        $user = $request->user();
        $roleSlug = strtolower($user?->role?->slug ?? '');

        return response()->json([
            'success' => true,
            'data' => $this->buildPayloadForRole($roleSlug, $user?->id),
            'message' => 'The operation was successful',
        ]);
    }

    private function buildPayloadForRole(string $roleSlug, ?int $userId): array
    {
        return match ($roleSlug) {
            'client' => $this->buildClientPayload($userId),
            'moderator' => $this->buildModeratorPayload(),
            default => $this->buildAdminPayload(),
        };
    }

    private function buildAdminPayload(): array
    {
        $hasPaymentsTable = Schema::hasTable('payments');

        return [
            'role' => 'admin',
            'stats' => [
                'total_users' => User::count(),
                'total_products' => Product::count(),
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'low_stock' => Product::query()->whereColumn('stock', '<=', 'min_stock')->count(),
                'total_revenue' => $hasPaymentsTable ? Payments::where('payment_status', 'paid')->sum('amount') : 0,
                'pending_special_orders' => SpecialOrder::where('status', 'pending')->count(),
                'categories' => Category::count(),
            ],
            'recent_orders' => Order::with(['user.role', 'school'])
                ->latest()
                ->take(5)
                ->get(),
            'recent_products' => Product::with(['category', 'supplier'])
                ->latest()
                ->take(5)
                ->get(),
            'low_stock_products' => Product::with(['category', 'supplier'])
                ->whereColumn('stock', '<=', 'min_stock')
                ->latest()
                ->take(5)
                ->get(),
            'recent_special_orders' => SpecialOrder::with(['user.role', 'school', 'category'])
                ->latest()
                ->take(5)
                ->get(),
        ];
    }

    private function buildModeratorPayload(): array
    {
        $hasPaymentsTable = Schema::hasTable('payments');

        return [
            'role' => 'moderator',
            'stats' => [
                'pending_orders' => Order::where('status', 'pending')->count(),
                'processed_orders' => Order::whereIn('status', ['processing', 'shipped', 'delivered'])->count(),
                'low_stock' => Product::query()->whereColumn('stock', '<=', 'min_stock')->count(),
                'pending_special_orders' => SpecialOrder::where('status', 'pending')->count(),
                'pending_payments' => $hasPaymentsTable ? Payments::where('payment_status', 'pending')->count() : 0,
            ],
            'recent_orders' => Order::with(['user.role', 'school'])
                ->latest()
                ->take(5)
                ->get(),
            'recent_special_orders' => SpecialOrder::with(['user.role', 'school', 'category'])
                ->latest()
                ->take(5)
                ->get(),
            'low_stock_products' => Product::with(['category', 'supplier'])
                ->whereColumn('stock', '<=', 'min_stock')
                ->latest()
                ->take(5)
                ->get(),
        ];
    }

    private function buildClientPayload(?int $userId): array
    {
        $hasPaymentsTable = Schema::hasTable('payments');
        $ordersQuery = Order::with(['school', 'orderItems.product'])
            ->where('user_id', $userId)
            ->latest();

        $invoicesQuery = Invoice::whereHas('order', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->latest();

        $specialOrdersQuery = SpecialOrder::with(['school', 'category'])
            ->where('user_id', $userId)
            ->latest();

        return [
            'role' => 'client',
            'stats' => [
                'current_orders' => (clone $ordersQuery)->whereIn('status', ['pending', 'processing', 'shipped'])->count(),
                'pending_invoices' => (clone $invoicesQuery)->where('status', 'unpaid')->count(),
                'total_spent' => $hasPaymentsTable
                    ? Payments::where('user_id', $userId)
                        ->where('payment_status', 'paid')
                        ->sum('amount')
                    : 0,
                'pending_special_orders' => (clone $specialOrdersQuery)->where('status', 'pending')->count(),
            ],
            'recent_orders' => $ordersQuery->take(5)->get(),
            'recent_invoices' => $invoicesQuery->take(5)->get(),
            'recent_special_orders' => $specialOrdersQuery->take(5)->get(),
        ];
    }
}
