<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('child_observations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            
            $table->string('behavior_name'); // Name of the behavior being observed
            $table->string('observation_count'); // 1st, 2nd, 3rd, 4th observation
            $table->string('comment')->nullable(); // Comment with min/max/independent assessment
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('child_observations');
    }
};