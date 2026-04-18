<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecialOrder extends Model
{
    protected $fillable = [
        'user_id',
        'school_id',
        'item_name',
        'category_id',
        'quantity',
        'details',
        'status',
        'admin_note',
    ];
}
