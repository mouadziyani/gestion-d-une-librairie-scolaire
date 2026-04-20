<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StockRequest;
use App\Models\Product;
use App\Models\Stock;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockController extends Controller
{
    private function syncProduct(Product $product, ?string $forcedStatus = null): void
    {
        $totalQuantity = (int) Stock::where('product_id', $product->id)->sum('quantity');
        $status = $forcedStatus ?: ($totalQuantity > 0 ? 'active' : 'inactive');

        $product->update([
            'stock' => $totalQuantity,
            'is_available' => $status === 'active' && $totalQuantity > 0,
            'status' => $status,
        ]);
    }

    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $status = strtolower((string) $request->query('status', 'all'));

        $productsQuery = Product::with(['category'])
            ->withCount('stocks');

        if ($search !== '') {
            $productsQuery->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($categoryQuery) use ($search) {
                        $categoryQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if (in_array($status, ['active', 'inactive'], true)) {
            $productsQuery->where('status', $status);
        }

        $products = $productsQuery->orderBy('name')->get()->map(function (Product $product) {
            $latestStock = $product->stocks()->latest()->first();

            return [
                'id' => $product->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'code' => $product->reference ?: $product->slug,
                'quantity' => (int) $product->stock,
                'status' => $product->status === 'active' && (int) $product->is_available !== 0 ? 'active' : 'inactive',
                'category' => $product->category?->name,
                'low_stock' => (int) $product->stock <= (int) $product->min_stock,
                'stocks_count' => (int) ($product->stocks_count ?? 0),
                'latest_stock_id' => $latestStock?->id,
                'latest_stock_type' => $latestStock?->type,
                'latest_stock_quantity' => $latestStock?->quantity,
                'updated_at' => $product->updated_at?->toDateTimeString(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $products,
                'stats' => [
                    'total_items' => Product::count(),
                    'low_stock_alerts' => Product::query()->whereColumn('stock', '<=', 'min_stock')->count(),
                    'out_of_stock' => Product::query()->where('stock', '<=', 0)->count(),
                ],
            ],
            'message' => 'The operation was successful',
        ]);
    }

    public function history(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $action = trim((string) $request->query('action', ''));
        $productId = $request->query('product_id');

        $query = Stock::with(['product.category'])->latest();

        if ($search !== '') {
            $query->whereHas('product', function ($productQuery) use ($search) {
                $productQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($categoryQuery) use ($search) {
                        $categoryQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($action !== '') {
            $query->where('type', $action);
        }

        if ($productId !== null && $productId !== '') {
            $query->where('product_id', $productId);
        }

        $logs = $query->take(100)->get()->map(function (Stock $stock) {
            $quantity = (int) $stock->quantity;

            return [
                'id' => $stock->id,
                'date' => $stock->created_at?->format('Y-m-d'),
                'item' => $stock->product?->name,
                'action' => $stock->type,
                'change' => $quantity > 0 ? "+{$quantity}" : (string) $quantity,
                'user' => 'System',
                'note' => $stock->note,
                'product_id' => $stock->product_id,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $logs,
            'message' => 'The operation was successful',
        ]);
    }

    public function periodic(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        $query = Stock::query();

        if ($from) {
            $query->whereDate('created_at', '>=', Carbon::parse($from)->startOfDay());
        }

        if ($to) {
            $query->whereDate('created_at', '<=', Carbon::parse($to)->endOfDay());
        }

        $items = $query->with('product.category')->get();

        $periods = $items
            ->groupBy(function (Stock $stock) {
                return $stock->created_at?->format('Y-m');
            })
            ->map(function ($group, $period) {
                return [
                    'period' => $period,
                    'movements' => $group->count(),
                    'restock' => $group->where('type', 'restock')->count(),
                    'sale' => $group->where('type', 'sale')->count(),
                    'damage' => $group->where('type', 'damage')->count(),
                    'return' => $group->where('type', 'return')->count(),
                    'adjustment' => $group->where('type', 'adjustment')->count(),
                    'total_quantity' => (int) $group->sum('quantity'),
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'periods' => $periods,
                'summary' => [
                    'total_movements' => $items->count(),
                    'total_quantity' => (int) $items->sum('quantity'),
                ],
            ],
            'message' => 'The operation was successful',
        ]);
    }

    public function show(string $id)
    {
        $stock = Stock::with(['product.category'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $stock->id,
                'product_id' => $stock->product_id,
                'quantity' => (int) $stock->quantity,
                'type' => $stock->type,
                'note' => $stock->note,
                'created_at' => $stock->created_at?->toDateTimeString(),
                'product' => $stock->product,
            ],
            'message' => 'The operation was successful',
        ]);
    }

    public function store(StockRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $product = Product::findOrFail($data['product_id']);
            $delta = (int) $data['quantity'];
            $forcedStatus = $data['status'] ?? null;
            unset($data['status']);

            if ((int) $product->stock + $delta < 0) {
                throw ValidationException::withMessages([
                    'quantity' => 'Stock quantity cannot go below zero.',
                ]);
            }

            $stock = Stock::create($data);
            $this->syncProduct($product, $forcedStatus);

            return response()->json([
                'success' => true,
                'data' => [
                    'stock' => $stock->load(['product.category']),
                    'product' => $product->fresh(['category']),
                ],
                'message' => 'The operation was successful',
            ], 201);
        });
    }

    public function update(StockRequest $request, string $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $data = $request->validated();
            $stock = Stock::findOrFail($id);
            $oldProduct = Product::findOrFail($stock->product_id);
            $newProduct = Product::findOrFail($data['product_id']);
            $delta = (int) $data['quantity'];
            $forcedStatus = $data['status'] ?? null;
            unset($data['status']);

            if ($oldProduct->id === $newProduct->id) {
                $newTotal = (int) $oldProduct->stock - (int) $stock->quantity + $delta;
                if ($newTotal < 0) {
                    throw ValidationException::withMessages([
                        'quantity' => 'Stock quantity cannot go below zero.',
                    ]);
                }
            } else {
                $oldTotal = (int) $oldProduct->stock - (int) $stock->quantity;
                $newTotal = (int) $newProduct->stock + $delta;

                if ($oldTotal < 0 || $newTotal < 0) {
                    throw ValidationException::withMessages([
                        'quantity' => 'Stock quantity cannot go below zero.',
                    ]);
                }
            }

            $stock->update($data);
            $this->syncProduct($oldProduct);

            if ($newProduct->id !== $oldProduct->id) {
                $this->syncProduct($newProduct, $forcedStatus);
            } else {
                $this->syncProduct($newProduct, $forcedStatus);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'stock' => $stock->fresh()->load(['product.category']),
                    'product' => $newProduct->fresh(['category']),
                ],
                'message' => 'The operation was successful',
            ]);
        });
    }

    public function destroy(string $id)
    {
        return DB::transaction(function () use ($id) {
            $stock = Stock::findOrFail($id);
            $product = Product::findOrFail($stock->product_id);

            if ((int) $product->stock - (int) $stock->quantity < 0) {
                throw ValidationException::withMessages([
                    'quantity' => 'Stock quantity cannot go below zero.',
                ]);
            }

            $stock->delete();
            $this->syncProduct($product);

            return response()->json([
                'success' => true,
                'data' => (object) [],
                'message' => 'The operation was successful',
            ]);
        });
    }
}
