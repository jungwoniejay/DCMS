<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parent_involvements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Parent/Guardian information
            $table->string('parent_name')->nullable();
            $table->string('parent_relationship')->nullable(); // Mother, Father, Guardian
            $table->string('parent_contact')->nullable();
            $table->string('parent_email')->nullable();
            
            // Support roles (stored as JSON array)
            $table->json('support_roles')->nullable(); // Array of selected support roles
            
            // Additional involvement information
            $table->text('additional_notes')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_involvements');
    }
};