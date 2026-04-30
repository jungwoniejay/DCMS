<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained()->onDelete('cascade');
            $table->boolean('has_meal_before_school')->default(false);
            $table->json('food_normally_eaten')->nullable();
            $table->boolean('has_baon')->default(false);
            $table->integer('travel_time_dcc_mins')->nullable();
            $table->string('travel_mode_dcc')->nullable();
            $table->integer('travel_time_ncdc_mins')->nullable();
            $table->string('travel_mode_ncdc')->nullable();
            $table->string('public_transportation')->nullable();
            $table->string('goes_to_school_with')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logistics');
    }
};
