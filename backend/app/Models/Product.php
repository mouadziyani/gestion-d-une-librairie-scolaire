<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'image',
        'is_available',
        'category_id',
        'supplier_id',
        'reference',
        'min_stock',
        'status',
        'discount',
        'level',
    ];
}
