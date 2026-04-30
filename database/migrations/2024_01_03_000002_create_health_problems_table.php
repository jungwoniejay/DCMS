<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health_problems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_assessment_id')->constrained()->cascadeOnDelete();
            $table->boolean('allergies')->default(false);
            $table->text('allergies_comment')->nullable();
            $table->boolean('asthma')->default(false);
            $table->text('asthma_comment')->nullable();
            $table->boolean('bleeding')->default(false);
            $table->text('bleeding_comment')->nullable();
            $table->boolean('bowels')->default(false);
            $table->text('bowels_comment')->nullable();
            $table->boolean('coughing')->default(false);
            $table->text('coughing_comment')->nullable();
            $table->boolean('diabetes')->default(false);
            $table->text('diabetes_comment')->nullable();
            $table->boolean('ears')->default(false);
            $table->text('ears_comment')->nullable();
            $table->boolean('eyes')->default(false);
            $table->text('eyes_comment')->nullable();
            $table->boolean('other')->default(false);
            $table->text('other_comment')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_problems');
    }
};
