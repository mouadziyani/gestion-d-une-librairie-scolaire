<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SpecialOrderRequest;
use App\Models\SpecialOrder;

class SpecialOrderController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => SpecialOrder::all(),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(SpecialOrderRequest $request)
    {
        $specialOrder = SpecialOrder::create($request->validated());

        return response()->json([
            'success' => true,
            'data' => $specialOrder,
            'message' => 'The operation was successful',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => SpecialOrder::findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(SpecialOrderRequest $request, string $id)
    {
        $specialOrder = SpecialOrder::findOrFail($id);
        $specialOrder->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $specialOrder->fresh(),
            'message' => 'The operation was successful',
        ]);
    }

    public function destroy(string $id)
    {
        SpecialOrder::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'The operation was successful',
        ]);
    }
}
