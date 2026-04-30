<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HealthProblem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'health_assessment_id',
        'allergies',
        'allergies_comment',
        'asthma',
        'asthma_comment',
        'bleeding',
        'bleeding_comment',
        'bowels',
        'bowels_comment',
        'coughing',
        'coughing_comment',
        'diabetes',
        'diabetes_comment',
        'ears',
        'ears_comment',
        'eyes',
        'eyes_comment',
        'other',
        'other_comment',
    ];

    protected $casts = [
        'allergies' => 'boolean',
        'asthma' => 'boolean',
        'bleeding' => 'boolean',
        'bowels' => 'boolean',
        'coughing' => 'boolean',
        'diabetes' => 'boolean',
        'ears' => 'boolean',
        'eyes' => 'boolean',
        'other' => 'boolean',
    ];

    public function healthAssessment()
    {
        return $this->belongsTo(HealthAssessment::class);
    }
}
