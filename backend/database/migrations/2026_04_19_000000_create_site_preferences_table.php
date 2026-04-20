<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_preferences', function (Blueprint $table) {
            $table->id();
            $table->json('general')->nullable();
            $table->json('public_pages')->nullable();
            $table->json('landing_sections')->nullable();
            $table->json('footer')->nullable();
            $table->json('system')->nullable();
            $table->json('role_pages')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_preferences');
    }
};
