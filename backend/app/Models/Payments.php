<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    protected $fillable = [
        'order_id',
        'invoice_id',
        'user_id',
        'amount',
        'payment_method',
        'payment_status',
        'reference',
        'paid_at',
        'note',
    ];
}
