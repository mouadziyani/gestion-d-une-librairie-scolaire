<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SitePreference extends Model
{
    protected $fillable = [
        'general',
        'public_pages',
        'landing_sections',
        'footer',
        'system',
        'role_pages',
    ];

    protected $casts = [
        'general' => 'array',
        'public_pages' => 'array',
        'landing_sections' => 'array',
        'footer' => 'array',
        'system' => 'array',
        'role_pages' => 'array',
    ];
}
