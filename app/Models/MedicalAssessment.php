<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MedicalAssessment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'health_assessment_id',
        'diagnosed_conditions',
        'emergency_action_conditions',
        'allergy_status',
        'allergy_notes',
        'asthma_status',
        'asthma_notes',
        'adhd_status',
        'adhd_notes',
        'bowel_bladder_status',
        'bowel_bladder_notes',
        'cardiac_status',
        'cardiac_notes',
        'dental_status',
        'dental_notes',
        'endocrine_status',
        'endocrine_notes',
        'ent_status',
        'ent_notes',
        'hearing_status',
        'hearing_notes',
        'musculoskeletal_status',
        'musculoskeletal_notes',
        'neurological_status',
        'neurological_notes',
        'nutrition_status',
        'nutrition_notes',
        'physical_illness_status',
        'physical_illness_notes',
        'respiratory_status',
        'respiratory_notes',
        'skin_status',
        'skin_notes',
        'speech_status',
        'speech_notes',
        'vision_status',
        'vision_notes',
        'dpt_date',
        'bcg_date',
        'polio_date',
        'mmr_date',
        'hepa_b_date',
        'measles_date',
        'current_medications',
        'special_treatments',
        'serious_accidents_history',
        'practitioner_name',
        'practitioner_signature',
        'assessment_date',
    ];

    protected $casts = [
        'dpt_date' => 'date',
        'bcg_date' => 'date',
        'polio_date' => 'date',
        'mmr_date' => 'date',
        'hepa_b_date' => 'date',
        'measles_date' => 'date',
        'assessment_date' => 'date',
    ];

    public function healthAssessment()
    {
        return $this->belongsTo(HealthAssessment::class);
    }
}
