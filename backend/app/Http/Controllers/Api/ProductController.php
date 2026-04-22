<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier'])->withCount('orderItems');

        if ($search = trim((string) $request->query('search', ''))) {
            $terms = collect(preg_split('/[\s\-]+/u', $search, -1, PREG_SPLIT_NO_EMPTY))
                ->map(fn ($term) => trim($term))
                ->filter()
                ->unique()
                ->values();

            $query->where(function ($builder) use ($search, $terms) {
                $this->applyProductSearchTerm($builder, $search);

                if ($terms->count() > 1) {
                    $builder->orWhere(function ($termQuery) use ($terms) {
                        $terms->each(function ($term) use ($termQuery) {
                            $termQuery->where(function ($termBuilder) use ($term) {
                                $this->applyProductSearchTerm($termBuilder, $term);
                            });
                        });
                    });
                }
            });
        }

        $category = strtolower(trim((string) $request->query('category', 'all')));
        if ($category !== '' && $category !== 'all') {
            $query->where(function ($builder) use ($category) {
                if (is_numeric($category)) {
                    $builder->where('category_id', (int) $category);
                }

                $builder->orWhereHas('category', function ($categoryQuery) use ($category) {
                    $categoryQuery
                        ->where('slug', $category)
                        ->orWhere('name', $category);
                });
            });
        }

        $status = strtolower(trim((string) $request->query('status', 'all')));
        if ($status !== '' && $status !== 'all') {
            if ($status === 'available') {
                $query->where('status', 'active')->where('is_available', true)->where('stock', '>', 0);
            } else {
                $query->where('status', $status);
            }
        }

        match (strtolower((string) $request->query('sort', 'featured'))) {
            'price-asc' => $query->orderBy('price'),
            'price-desc' => $query->orderByDesc('price'),
            'best-sellers' => $query->orderByDesc('order_items_count'),
            'discount' => $query->orderByDesc('discount'),
            default => $query->latest('id'),
        };

        $perPage = min(max((int) $request->query('per_page', 12), 1), 60);

        return response()->json([
            'success' => true,
            'data' => $query->paginate($perPage)->withQueryString(),
            'message' => 'The operation was successful',
        ]);
    }

    public function store(ProductRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        if ($request->hasFile('image_file')) {
            $data['image'] = $request->file('image_file')->store('products', 'public');
        } elseif (array_key_exists('image', $data) && $data['image'] === null) {
            unset($data['image']);
        }

        unset($data['image_file']);

        $product = Product::create($data);

        return response()->json([
            'success' => true,
            'data' => $product,
            'message' => 'The operation was successful',
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'success' => true,
            'data' => Product::with(['category', 'supplier'])->withCount('orderItems')->findOrFail($id),
            'message' => 'The operation was successful',
        ]);
    }

    public function update(ProductRequest $request, string $id)
    {
        $product = Product::findOrFail($id);
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        if ($request->hasFile('image_file')) {
            if ($product->image && str_starts_with($product->image, 'products/')) {
                Storage::disk('public')->delete($product->image);
            }

            $data['image'] = $request->file('image_file')->store('products', 'public');
        } elseif (array_key_exists('image', $data) && $data['image'] === null) {
            unset($data['image']);
        }

        unset($data['image_file']);

        $product->update($data);

        return response()->json([
            'success' => true,
            'data' => $product->fresh(),
            'message' => 'The operation was successful',
        ]);
    }

    public function destroy(string $id)
    {
        Product::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'data' => (object) [],
            'message' => 'The operation was successful',
        ]);
    }

    private function applyProductSearchTerm($query, string $term): void
    {
        $query
            ->where('name', 'like', "%{$term}%")
            ->orWhere('slug', 'like', "%{$term}%")
            ->orWhere('reference', 'like', "%{$term}%")
            ->orWhere('description', 'like', "%{$term}%")
            ->orWhere('level', 'like', "%{$term}%")
            ->orWhereHas('category', function ($categoryQuery) use ($term) {
                $categoryQuery
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('slug', 'like', "%{$term}%");
            })
            ->orWhereHas('supplier', function ($supplierQuery) use ($term) {
                $supplierQuery
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('company_name', 'like', "%{$term}%")
                    ->orWhere('code', 'like', "%{$term}%");
            });
    }
}
