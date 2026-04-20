<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payments;
use App\Models\Product;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesReportController extends Controller
{
    public function index(Request $request)
    {
        $period = $this->resolvePeriod($request);
        $ordersQuery = $this->buildOrdersQuery($period['from'], $period['to']);
        $orders = $ordersQuery->with(['user.role', 'school', 'payments', 'orderItems.product'])->latest()->get();

        $stats = [
            'total_orders' => $orders->count(),
            'completed_orders' => $orders->where('status', 'delivered')->count(),
            'pending_orders' => $orders->where('status', 'pending')->count(),
            'cancelled_orders' => $orders->where('status', 'cancelled')->count(),
            'total_revenue' => (float) $orders->sum(function ($order) {
                return (float) ($order->payment_status === 'paid' ? $order->total_price : 0);
            }),
            'average_order_value' => $orders->count() ? (float) $orders->avg('total_price') : 0,
        ];

        $topProducts = OrderItem::query()
            ->select('product_id', DB::raw('SUM(quantity) as quantity_sold'), DB::raw('SUM(quantity * price) as revenue'))
            ->whereHas('order', fn ($query) => $this->applyPeriod($query, $period['from'], $period['to']))
            ->with('product.category')
            ->groupBy('product_id')
            ->orderByDesc('quantity_sold')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'period' => $period,
                'stats' => $stats,
                'recent_orders' => $orders->take(10)->values(),
                'top_products' => $topProducts,
            ],
            'message' => 'The operation was successful',
        ]);
    }

    public function export(Request $request)
    {
        $period = $this->resolvePeriod($request);
        $format = $request->query('format') === 'excel' ? 'excel' : 'csv';
        $orders = $this->buildOrdersQuery($period['from'], $period['to'])
            ->with(['user', 'school', 'payments'])
            ->latest()
            ->get();

        $extension = $format === 'excel' ? 'xls' : 'csv';
        $contentType = $format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv';
        $filename = sprintf(
            'sales-report-%s-to-%s.%s',
            optional($period['from'])->format('Y-m-d') ?? 'all-time',
            optional($period['to'])->format('Y-m-d') ?? 'now',
            $extension
        );

        return response()->streamDownload(function () use ($orders) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Order ID', 'Customer', 'School', 'Status', 'Payment', 'Total', 'Created At']);

            foreach ($orders as $order) {
                fputcsv($handle, [
                    $order->id,
                    $order->user?->name ?? '-',
                    $order->school?->name ?? '-',
                    $order->status,
                    $order->payment_status,
                    number_format((float) $order->total_price, 2, '.', ''),
                    optional($order->created_at)->toDateTimeString(),
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => $contentType,
        ]);
    }

    public function exportPdf(Request $request)
    {
        $period = $this->resolvePeriod($request);
        $orders = $this->buildOrdersQuery($period['from'], $period['to'])
            ->with(['user', 'school', 'payments'])
            ->latest()
            ->get();

        $pdf = Pdf::loadView('reports.sales-pdf', [
            'orders' => $orders,
            'period' => $period,
        ]);

        $filename = sprintf(
            'sales-report-%s-to-%s.pdf',
            optional($period['from'])->format('Y-m-d') ?? 'all-time',
            optional($period['to'])->format('Y-m-d') ?? 'now'
        );

        return $pdf->download($filename);
    }

    private function resolvePeriod(Request $request): array
    {
        $from = $request->query('from');
        $to = $request->query('to');

        return [
            'from' => $from ? Carbon::parse($from)->startOfDay() : null,
            'to' => $to ? Carbon::parse($to)->endOfDay() : null,
        ];
    }

    private function buildOrdersQuery(?Carbon $from, ?Carbon $to)
    {
        $query = Order::query();
        $this->applyPeriod($query, $from, $to);

        return $query;
    }

    private function applyPeriod($query, ?Carbon $from, ?Carbon $to)
    {
        if ($from) {
            $query->where('created_at', '>=', $from);
        }

        if ($to) {
            $query->where('created_at', '<=', $to);
        }

        return $query;
    }
}
