<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guardian extends Model
{
    protected $fillable = [
        'child_id', 'name', 'relationship', 'email', 'occupation',
        'address', 'home_phone', 'work_phone', 'mobile_phone'
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}
