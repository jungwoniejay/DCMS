<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChildCareInformation extends Model
{
    protected $fillable = [
        'child_id',
        'user_id',
        'feeding_food_selection',
        'feeding_appetite',
        'feeding_custom',
        'sleeping_duration',
        'sleeping_quality',
        'sleeping_custom',
        'bathing_frequency',
        'bathing_assistance',
        'bathing_custom',
        'toileting_frequency',
        'toileting_assistance',
        'toileting_custom',
    ];

    protected $casts = [
        'feeding_food_selection' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}