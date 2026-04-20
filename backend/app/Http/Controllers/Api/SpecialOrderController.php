<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SpecialOrderRequest;
use App\Models\Notification;
use App\Models\SpecialOrder;

class SpecialOrderController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => SpecialOrder::with(['user.role', 'school', 'category'])->latest()->get(),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(SpecialOrderRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();
        $role = strtolower($user?->role?->slug ?? '');

        if ($role === 'client' || empty($data['user_id'])) {
            $data['user_id'] = $user->id;
        }

        $data['status'] = $data['status'] ?? 'pending';

        $specialOrder = SpecialOrder::create($data);

        Notification::create([
            'user_id' => $specialOrder->user_id,
            'type' => 'special_order',
            'message' => "Your special order #{$specialOrder->id} has been submitted successfully.",
            'is_read' => false,
            'order_id' => null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $specialOrder->load(['user.role', 'school', 'category']),
            'message' => 'The operation was successful',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => SpecialOrder::with(['user.role', 'school', 'category'])->findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(SpecialOrderRequest $request, string $id)
    {
        $specialOrder = SpecialOrder::findOrFail($id);
        $specialOrder->update($request->validated());

        Notification::create([
            'user_id' => $specialOrder->user_id,
            'type' => 'special_order',
            'message' => "Your special order #{$specialOrder->id} status changed to {$specialOrder->status}.",
            'is_read' => false,
            'order_id' => null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $specialOrder->fresh(['user.role', 'school', 'category']),
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
