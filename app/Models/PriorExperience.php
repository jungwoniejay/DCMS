<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriorExperience extends Model
{
    protected $fillable = ['child_id', 'nursery_type', 'kindergarten_type', 'preparatory_type'];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}
