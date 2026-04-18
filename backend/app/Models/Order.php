<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'school_id',
        'status',
        'total_price',
        'payment_method',
        'payment_status',
        'delivery_address',
    ];
}
