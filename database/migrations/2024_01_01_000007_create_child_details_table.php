<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('child_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained()->onDelete('cascade');
            $table->integer('birth_order')->nullable();
            $table->boolean('registered')->default(false);
            $table->enum('born_at', ['Hospital', 'Health Center', 'Home'])->nullable();
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->boolean('eccd_card')->default(false);
            $table->boolean('mother_child_book')->default(false);
            $table->string('other_documents')->nullable();
            $table->enum('bcg', ['Yes', 'No', 'Do not Know'])->nullable();
            $table->enum('dpt', ['Yes', 'No', 'Do not Know'])->nullable();
            $table->enum('oral_polio', ['Yes', 'No', 'Do not Know'])->nullable();
            $table->enum('hepa_b', ['Yes', 'No', 'Do not Know'])->nullable();
            $table->enum('measles', ['Yes', 'No', 'Do not Know'])->nullable();
            $table->boolean('hare_lip')->default(false);
            $table->boolean('cross_eyed')->default(false);
            $table->boolean('deaf')->default(false);
            $table->boolean('blind')->default(false);
            $table->boolean('disabled_leg')->default(false);
            $table->boolean('disabled_arm')->default(false);
            $table->boolean('finger_toe_deformity')->default(false);
            $table->boolean('behavior_problems')->default(false);
            $table->boolean('speaking_problems')->default(false);
            $table->boolean('hearing_problems')->default(false);
            $table->boolean('vision_problems')->default(false);
            $table->boolean('left_handed')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('child_details');
    }
};
