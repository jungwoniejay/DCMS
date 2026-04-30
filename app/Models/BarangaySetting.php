<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangaySetting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, string $default = ''): string
    {
        return static::where('key', $key)->value('value') ?? $default;
    }

    public static function set(string $key, string $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    public static function allKeyed(): array
    {
        return static::all()->pluck('value', 'key')->toArray();
    }
}
