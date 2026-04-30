<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_assessment_id')->constrained()->cascadeOnDelete();
            $table->text('diagnosed_conditions')->nullable();
            $table->text('emergency_action_conditions')->nullable();
            
            // Physical examination findings
            $table->enum('allergy_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('allergy_notes')->nullable();
            $table->enum('asthma_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('asthma_notes')->nullable();
            $table->enum('adhd_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('adhd_notes')->nullable();
            $table->enum('bowel_bladder_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('bowel_bladder_notes')->nullable();
            $table->enum('cardiac_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('cardiac_notes')->nullable();
            $table->enum('dental_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('dental_notes')->nullable();
            $table->enum('endocrine_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('endocrine_notes')->nullable();
            $table->enum('ent_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('ent_notes')->nullable();
            $table->enum('hearing_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('hearing_notes')->nullable();
            $table->enum('musculoskeletal_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('musculoskeletal_notes')->nullable();
            $table->enum('neurological_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('neurological_notes')->nullable();
            $table->enum('nutrition_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('nutrition_notes')->nullable();
            $table->enum('physical_illness_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('physical_illness_notes')->nullable();
            $table->enum('respiratory_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('respiratory_notes')->nullable();
            $table->enum('skin_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('skin_notes')->nullable();
            $table->enum('speech_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('speech_notes')->nullable();
            $table->enum('vision_status', ['Normal', 'Abnormal', 'Not Evaluated'])->default('Not Evaluated');
            $table->text('vision_notes')->nullable();
            
            // Immunization records
            $table->date('dpt_date')->nullable();
            $table->date('bcg_date')->nullable();
            $table->date('polio_date')->nullable();
            $table->date('mmr_date')->nullable();
            $table->date('hepa_b_date')->nullable();
            $table->date('measles_date')->nullable();
            
            $table->text('current_medications')->nullable();
            $table->text('special_treatments')->nullable();
            $table->text('serious_accidents_history')->nullable();
            
            $table->string('practitioner_name')->nullable();
            $table->string('practitioner_signature')->nullable();
            $table->date('assessment_date')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_assessments');
    }
};
