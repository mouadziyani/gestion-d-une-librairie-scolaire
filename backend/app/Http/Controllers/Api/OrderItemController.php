<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\OrderItemRequest;
use App\Models\OrderItem;

class OrderItemController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => OrderItem::all(),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(OrderItemRequest $request)
    {
        $orderItem = OrderItem::create($request->validated());

        return response()->json([
            'success' => true,
            'data' => $orderItem,
            'message' => 'The operation was successful',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => OrderItem::findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(OrderItemRequest $request, string $id)
    {
        $orderItem = OrderItem::findOrFail($id);
        $orderItem->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $orderItem->fresh(),
            'message' => 'The operation was successful',
        ]);
    }

    public function destroy(string $id)
    {
        OrderItem::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'The operation was successful',
        ]);
    }
}
