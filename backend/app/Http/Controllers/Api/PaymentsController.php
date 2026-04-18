<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\PaymentsRequest;
use App\Models\Payments;

class PaymentsController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Payments::all(),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(PaymentsRequest $request)
    {
        $payment = Payments::create($request->validated());

        return response()->json([
            'success' => true,
            'data' => $payment,
            'message' => 'The operation was successful',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => Payments::findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(PaymentsRequest $request, string $id)
    {
        $payment = Payments::findOrFail($id);
        $payment->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $payment->fresh(),
            'message' => 'The operation was successful',
        ]);
    }

    public function destroy(string $id)
    {
        Payments::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'The operation was successful',
        ]);
    }
}
