<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HealthAssessment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'child_id',
        'routine_hospital', 'routine_address', 'routine_phone',
        'last_checkup_date', 'last_checkup_hospital',
        'health_problems', 'takes_medication', 'medication_description',
        'special_treatment', 'treatment_type',
        'serious_accident', 'accident_description',
        'immunizations', 'on_medication', 'medication_nature',
    ];

    protected $casts = [
        'last_checkup_date' => 'date',
        'health_problems'   => 'array',
        'immunizations'     => 'array',
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }

    public function healthProblems()
    {
        return $this->hasOne(HealthProblem::class);
    }

    public function medications()
    {
        return $this->hasMany(Medication::class);
    }

    public function medicalAssessment()
    {
        return $this->hasOne(MedicalAssessment::class);
    }
}
