<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StripePaymentIntentRequest;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class StripePaymentController extends Controller
{
    public function createIntent(StripePaymentIntentRequest $request)
    {
        $validated = $request->validated();
        $items = collect($validated['items']);

        $summary = DB::transaction(function () use ($items) {
            $products = Product::whereIn('id', $items->pluck('product_id')->all())
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $subtotal = 0;

            foreach ($items as $item) {
                $product = $products->get($item['product_id']);

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => 'One of the selected products no longer exists.',
                    ]);
                }

                $quantity = (int) $item['quantity'];

                if ($quantity < 1) {
                    throw ValidationException::withMessages([
                        'items' => 'Invalid product quantity.',
                    ]);
                }

                if ((int) $product->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Not enough stock available for {$product->name}.",
                    ]);
                }

                $subtotal += (float) $product->price * $quantity;
            }

            return [
                'subtotal' => $subtotal,
                'amount' => (int) round($subtotal * 100),
            ];
        });

        $secret = config('services.stripe.secret');

        if (! $secret) {
            return response()->json([
                'success' => false,
                'message' => 'Stripe is not configured on the server.',
            ], 422);
        }

        Stripe::setApiKey($secret);

        $intent = PaymentIntent::create([
            'amount' => $summary['amount'],
            'currency' => 'mad',
            'automatic_payment_methods' => ['enabled' => true],
            'metadata' => [
                'user_id' => (string) ($request->user()?->id ?? ''),
                'school_id' => (string) ($validated['school_id'] ?? ''),
                'items_count' => (string) $items->sum('quantity'),
            ],
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'client_secret' => $intent->client_secret,
                'payment_intent_id' => $intent->id,
                'amount' => $summary['subtotal'],
                'currency' => 'MAD',
            ],
            'message' => 'Stripe payment intent created successfully.',
        ]);
    }
}
