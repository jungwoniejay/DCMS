<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('child_care_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Feeding information
            $table->json('feeding_food_selection')->nullable(); // JSON array of selected foods
            $table->string('feeding_appetite')->nullable(); // Good, Fair, Poor
            $table->text('feeding_custom')->nullable(); // Custom feeding notes
            
            // Sleeping information
            $table->string('sleeping_duration')->nullable(); // Hours of sleep
            $table->string('sleeping_quality')->nullable(); // Good, Fair, Poor
            $table->text('sleeping_custom')->nullable(); // Custom sleeping notes
            
            // Bathing information
            $table->string('bathing_frequency')->nullable(); // Daily, Weekly, etc.
            $table->string('bathing_assistance')->nullable(); // Independent, Assisted
            $table->text('bathing_custom')->nullable(); // Custom bathing notes
            
            // Toileting information
            $table->string('toileting_frequency')->nullable(); // Regular, Irregular
            $table->string('toileting_assistance')->nullable(); // Independent, Assisted
            $table->text('toileting_custom')->nullable(); // Custom toileting notes
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('child_care_information');
    }
};