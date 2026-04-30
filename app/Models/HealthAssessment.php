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
        'hospital_center_name',
        'hospital_center_address',
        'last_checkup_date',
        'general_notes',
    ];

    protected $casts = [
        'last_checkup_date' => 'date',
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
