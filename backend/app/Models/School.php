<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class School extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
        'phone',
        'email',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function specialOrders(): HasMany
    {
        return $this->hasMany(SpecialOrder::class);
    }
}
