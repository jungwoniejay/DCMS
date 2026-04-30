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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action'); // e.g., 'login', 'logout', 'create', 'update', 'delete', 'view'
            $table->string('action_type')->nullable(); // e.g., 'child', 'health_record', 'user'
            $table->string('model_type')->nullable(); // e.g., 'App\Models\Child'
            $table->unsignedBigInteger('model_id')->nullable(); // ID of the affected model
            $table->string('description')->nullable();
            $table->text('properties')->nullable(); // JSON data with additional info
            $table->text('old_values')->nullable(); // JSON data for updates
            $table->text('new_values')->nullable(); // JSON data for updates
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->string('device_type')->nullable(); // 'desktop', 'mobile', 'tablet'
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->boolean('is_suspicious')->default(false);
            $table->string('suspicion_reason')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            // Indexes for efficient querying
            $table->index('user_id');
            $table->index('action');
            $table->index('action_type');
            $table->index('is_suspicious');
            $table->index('created_at');
            $table->index(['user_id', 'created_at']);
            $table->index(['is_suspicious', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};