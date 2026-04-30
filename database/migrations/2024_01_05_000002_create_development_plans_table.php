<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('development_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained()->onDelete('cascade');
            $table->string('plan_type'); // cognitive, physical, social, emotional, language
            $table->text('current_status');
            $table->text('goals');
            $table->text('activities');
            $table->text('resources_needed')->nullable();
            $table->date('target_date')->nullable();
            $table->text('progress_notes')->nullable();
            $table->string('status')->default('active'); // active, completed, on_hold
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('development_plans');
    }
};
