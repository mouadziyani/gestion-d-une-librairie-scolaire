<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Payments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $secret = config('services.stripe.webhook_secret');

        if (! $secret) {
            return response()->json([
                'success' => false,
                'message' => 'Stripe webhook secret is not configured.',
            ], 422);
        }

        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent($payload, $signature, $secret);
        } catch (\Throwable $throwable) {
            Log::warning('Stripe webhook verification failed', [
                'error' => $throwable->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid Stripe webhook signature.',
            ], 400);
        }

        if ($event->type === 'payment_intent.succeeded' || $event->type === 'payment_intent.payment_failed') {
            $paymentIntent = $event->data->object;
            $payment = Payments::where('stripe_payment_intent_id', $paymentIntent->id)->first();

            if ($payment) {
                $status = $event->type === 'payment_intent.succeeded' ? 'paid' : 'failed';
                $payment->payment_status = $status;
                $payment->paid_at = $status === 'paid' ? now() : null;
                $payment->save();

                if ($payment->order) {
                    $payment->order->payment_status = $status;
                    $payment->order->save();
                }

                if ($payment->invoice) {
                    $payment->invoice->status = $status;
                    $payment->invoice->save();
                }
            } else {
                $order = Order::whereHas('payments', function ($query) use ($paymentIntent) {
                    $query->where('stripe_payment_intent_id', $paymentIntent->id);
                })->first();

                if ($order) {
                    $order->payment_status = $event->type === 'payment_intent.succeeded' ? 'paid' : 'failed';
                    $order->save();
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Webhook processed successfully.',
        ]);
    }
}
