<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerformanceInput extends Model
{
    protected $fillable = [
        'child_id', 'learns_at_home_with', 'play_older_siblings',
        'play_younger_siblings', 'play_neighbors'
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}
