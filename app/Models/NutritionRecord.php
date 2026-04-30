<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NutritionRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'child_id',
        'height_first',
        'weight_first',
        'date_first',
        'height_second',
        'weight_second',
        'date_second',
        'nutritional_status_result',
        'officer_name',
        'officer_position',
        'assessment_date',
    ];

    protected $casts = [
        'height_first' => 'decimal:2',
        'weight_first' => 'decimal:2',
        'date_first' => 'date',
        'height_second' => 'decimal:2',
        'weight_second' => 'decimal:2',
        'date_second' => 'date',
        'assessment_date' => 'date',
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }
}
