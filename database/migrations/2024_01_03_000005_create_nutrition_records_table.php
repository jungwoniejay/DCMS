<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nutrition_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained()->cascadeOnDelete();
            
            // First recording
            $table->decimal('height_first', 5, 2)->nullable();
            $table->decimal('weight_first', 5, 2)->nullable();
            $table->date('date_first')->nullable();
            
            // Second recording
            $table->decimal('height_second', 5, 2)->nullable();
            $table->decimal('weight_second', 5, 2)->nullable();
            $table->date('date_second')->nullable();
            
            $table->string('nutritional_status_result')->nullable();
            $table->string('officer_name')->nullable();
            $table->string('officer_position')->nullable();
            $table->date('assessment_date')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nutrition_records');
    }
};
