<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailToken extends Model
{
    protected $fillable = [
        'user_id',
        'token',
        'type',
        'expires_at',
        'is_used',
    ];
}
