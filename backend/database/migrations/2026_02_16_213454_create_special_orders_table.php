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
        Schema::create('special_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                    ->constrained('users')
                    ->onDelete('cascade');
            $table->foreignId('school_id')
                    ->nullable()
                    ->constrained('schools')
                    ->onDelete('set null');
            $table->string('item_name');
            $table->foreignId('category_id')
                    ->nullable()
                    ->constrained('categories')
                    ->onDelete('set null');
            $table->integer('quantity')->default(1);
            $table->text('details')->nullable(); 
            $table->string('status')->default('pending');
            $table->text('admin_note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('special_orders');
    }
};
