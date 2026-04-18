<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\OrderRequest;
use App\Models\Order;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Order::all(),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(OrderRequest $request)
    {
        $order = Order::create($request->validated());

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'The operation was successful',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => Order::findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(OrderRequest $request, string $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $order->fresh(),
            'message' => 'The operation was successful',
        ]);
    }

    public function destroy(string $id)
    {
        Order::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'The operation was successful',
        ]);
    }
}
