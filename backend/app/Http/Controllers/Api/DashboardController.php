<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\DashboardRequest;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    public function index(DashboardRequest $request)
    {
        $lowStockCount = Product::query()
            ->whereColumn('stock', '<=', 'min_stock')
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_users' => User::count(),
                    'active_orders' => Order::where('status', 'pending')->count(),
                    'low_stock' => $lowStockCount,
                ],
                'recent_products' => Product::latest()->take(5)->get(),
                'recent_orders' => Order::latest()->take(5)->get(),
            ],
            'message' => 'The operation was successful',
        ]);
    }
}
