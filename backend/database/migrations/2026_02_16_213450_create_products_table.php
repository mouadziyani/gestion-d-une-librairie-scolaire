<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug')->unique();
        $table->text('description')->nullable();
        $table->decimal('price', 8, 2);
        $table->integer('stock')->default(0);
        $table->string('image')->nullable();
        $table->boolean('is_available')->default(true);
        $table->foreignId('category_id')
            ->constrained('categories')
            ->onDelete('cascade');
        $table->foreignId('supplier_id')
            ->nullable()
            ->constrained('suppliers')
            ->onDelete('set null');
        $table->string('reference')->unique()->nullable();
        $table->integer('min_stock')->default(5);
        $table->string('status')->default('active');
        $table->decimal('discount', 8, 2)->nullable();
        $table->string('level')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
