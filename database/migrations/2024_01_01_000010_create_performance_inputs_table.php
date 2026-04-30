<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('performance_inputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained()->onDelete('cascade');
            $table->string('learns_at_home_with')->nullable();
            $table->enum('play_older_siblings', ['Always', 'Sometimes', 'Rarely', 'Never'])->nullable();
            $table->enum('play_younger_siblings', ['Always', 'Sometimes', 'Rarely', 'Never'])->nullable();
            $table->enum('play_neighbors', ['Always', 'Sometimes', 'Rarely', 'Never'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_inputs');
    }
};
