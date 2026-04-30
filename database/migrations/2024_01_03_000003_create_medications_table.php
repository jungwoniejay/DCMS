<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_assessment_id')->constrained()->cascadeOnDelete();
            $table->string('medication_name');
            $table->enum('type', ['prescription', 'non-prescription']);
            $table->string('dosage')->nullable();
            $table->string('frequency')->nullable();
            $table->text('purpose')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
