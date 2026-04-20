<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderItemController;
use App\Http\Controllers\Api\PaymentsController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StripePaymentController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\Api\SalesReportController;
use App\Models\Role;
use App\Http\Controllers\Api\StockController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\SpecialOrderController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\SitePreferenceController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', PasswordResetLinkController::class);
Route::post('/reset-password', NewPasswordController::class);
Route::post('/contact-messages', [ContactMessageController::class, 'store']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/schools', [SchoolController::class, 'index']);
Route::get('/schools/{id}', [SchoolController::class, 'show']);
Route::get('/site-preferences', [SitePreferenceController::class, 'show']);
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::delete('/profile', [AuthController::class, 'destroyProfile']);

    Route::middleware('role:client,admin,moderator')->group(function () {
        Route::post('/checkout', [OrderController::class, 'checkout']);
        Route::post('/special-orders', [SpecialOrderController::class, 'store']);
        Route::post('/stripe/payment-intent', [StripePaymentController::class, 'createIntent']);
        Route::get('/orders/mine', [OrderController::class, 'mine']);
        Route::get('/orders/mine/{id}', [OrderController::class, 'mineShow']);
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    });

    Route::middleware('role:admin,moderator,client')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
    });

    Route::middleware('role:admin,moderator')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        Route::get('/stocks', [StockController::class, 'index']);
        Route::get('/stocks/history', [StockController::class, 'history']);
        Route::get('/stocks/periodic', [StockController::class, 'periodic']);
        Route::get('/stocks/{id}', [StockController::class, 'show']);
        Route::post('/stocks', [StockController::class, 'store']);
        Route::put('/stocks/{id}', [StockController::class, 'update']);
        Route::delete('/stocks/{id}', [StockController::class, 'destroy']);

        Route::post('/schools', [SchoolController::class, 'store']);
        Route::put('/schools/{id}', [SchoolController::class, 'update']);
        Route::delete('/schools/{id}', [SchoolController::class, 'destroy']);

        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::put('/orders/{id}', [OrderController::class, 'update']);
        Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

        Route::get('/order-items', [OrderItemController::class, 'index']);
        Route::post('/order-items', [OrderItemController::class, 'store']);
        Route::get('/order-items/{id}', [OrderItemController::class, 'show']);
        Route::put('/order-items/{id}', [OrderItemController::class, 'update']);
        Route::delete('/order-items/{id}', [OrderItemController::class, 'destroy']);

        Route::get('/special-orders', [SpecialOrderController::class, 'index']);
        Route::get('/special-orders/{id}', [SpecialOrderController::class, 'show']);
        Route::put('/special-orders/{id}', [SpecialOrderController::class, 'update']);
        Route::delete('/special-orders/{id}', [SpecialOrderController::class, 'destroy']);

        Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        Route::post('/payments', [PaymentsController::class, 'store']);
        Route::get('/payments', [PaymentsController::class, 'index']);
        Route::get('/payments/{id}', [PaymentsController::class, 'show']);
        Route::put('/payments/{id}', [PaymentsController::class, 'update']);
        Route::delete('/payments/{id}', [PaymentsController::class, 'destroy']);

        Route::get('/reports/sales', [SalesReportController::class, 'index']);
        Route::get('/reports/sales/export', [SalesReportController::class, 'export']);
        Route::get('/reports/sales/pdf', [SalesReportController::class, 'exportPdf']);

        Route::post('/invoices', [InvoiceController::class, 'store']);
    });

    Route::middleware('role:admin')->prefix('admin/users')->group(function () {
        Route::get('/', [AdminUserController::class, 'index']);
        Route::post('/', [AdminUserController::class, 'store']);
        Route::get('/{id}', [AdminUserController::class, 'show']);
        Route::put('/{id}', [AdminUserController::class, 'update']);
        Route::delete('/{id}', [AdminUserController::class, 'destroy']);
    });

    Route::middleware('role:admin')->get('/roles', function () {
        return response()->json([
            'success' => true,
            'data' => Role::query()->orderBy('name')->get(),
            'message' => 'The operation was successful',
        ]);
    });

    Route::middleware('role:admin,moderator')->group(function () {
        Route::put('/site-preferences', [SitePreferenceController::class, 'update']);
    });
});
