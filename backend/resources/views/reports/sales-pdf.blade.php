<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sales Report</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #222;
        }

        h1 {
            font-size: 22px;
            margin-bottom: 6px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>Sales Report</h1>
    <p>
        Period:
        {{ optional($period['from'])->format('Y-m-d') ?? 'All time' }}
        to
        {{ optional($period['to'])->format('Y-m-d') ?? 'Now' }}
    </p>

    <table>
        <thead>
            <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>School</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Created At</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($orders as $order)
                <tr>
                    <td>#{{ $order->id }}</td>
                    <td>{{ $order->user?->name ?? '-' }}</td>
                    <td>{{ $order->school?->name ?? '-' }}</td>
                    <td>{{ $order->status }}</td>
                    <td>{{ $order->payment_status }}</td>
                    <td>{{ number_format((float) $order->total_price, 2) }} MAD</td>
                    <td>{{ optional($order->created_at)->format('Y-m-d H:i') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7">No sales data available.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
