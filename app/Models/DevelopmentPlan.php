<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevelopmentPlan extends Model
{
    protected $fillable = [
        'child_id',
        'plan_type',
        'current_status',
        'goals',
        'activities',
        'resources_needed',
        'target_date',
        'progress_notes',
        'status',
        'created_by',
    ];

    protected $casts = [
        'target_date' => 'date',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
