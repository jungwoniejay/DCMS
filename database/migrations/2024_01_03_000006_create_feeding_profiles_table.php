<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feeding_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained()->cascadeOnDelete();
            $table->text('food_allergies')->nullable();
            $table->text('usual_foods_given')->nullable();
            $table->text('eating_habits')->nullable();
            $table->boolean('uses_bottle')->default(false);
            $table->string('bottle_frequency')->nullable();
            $table->time('breakfast_time')->nullable();
            $table->time('lunch_time')->nullable();
            $table->time('dinner_time')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feeding_profiles');
    }
};
