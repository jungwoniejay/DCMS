<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeedingProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'child_id',
        'food_allergies',
        'usual_foods_given',
        'eating_habits',
        'uses_bottle',
        'bottle_frequency',
        'breakfast_time',
        'lunch_time',
        'dinner_time',
    ];

    protected $casts = [
        'uses_bottle' => 'boolean',
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }
}
