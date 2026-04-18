<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SchoolRequest;
use App\Models\School;

class SchoolController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => School::all(),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(SchoolRequest $request)
    {
        $school = School::create($request->validated());

        return response()->json([
            'success' => true,
            'data' => $school,
            'message' => 'The operation was successful',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => School::findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(SchoolRequest $request, string $id)
    {
        $school = School::findOrFail($id);
        $school->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $school->fresh(),
            'message' => 'The operation was successful',
        ]);
    }

    public function destroy(string $id)
    {
        School::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'The operation was successful',
        ]);
    }
}
