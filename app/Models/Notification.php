<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = ['user_id', 'type', 'title', 'message', 'data', 'read_at', 'scheduled_at', 'expires_at'];

    protected $casts = [
        'data'         => 'array',
        'read_at'      => 'datetime',
        'scheduled_at' => 'datetime',
        'expires_at'   => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public static function send(int $userId, string $type, string $title, string $message, array $data = [], ?string $scheduledAt = null, ?string $expiresAt = null): self
    {
        return self::create([
            'user_id'      => $userId,
            'type'         => $type,
            'title'        => $title,
            'message'      => $message,
            'data'         => $data,
            'scheduled_at' => $scheduledAt,
            'expires_at'   => $expiresAt,
        ]);
    }
}
