<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siblings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained()->onDelete('cascade');
            $table->integer('age');
            $table->enum('sex', ['Male', 'Female']);
            $table->enum('education_status', ['In School', 'Out of School']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siblings');
    }
};
