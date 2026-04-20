<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CategoryRequest;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Category::withCount('products')->get(),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(CategoryRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $category = Category::create($data);

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'The operation was successful',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => Category::withCount('products')->findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(CategoryRequest $request, string $id)
    {
        $category = Category::findOrFail($id);
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $category->update($data);

        return response()->json([
            'success' => true,
            'data' => $category->fresh(),
            'message' => 'The operation was successful',
        ]);
    }

    public function destroy(string $id)
    {
        Category::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'The operation was successful',
        ]);
    }
}
