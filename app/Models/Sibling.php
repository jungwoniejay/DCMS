<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sibling extends Model
{
    protected $fillable = ['child_id', 'age', 'sex', 'education_status'];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}
