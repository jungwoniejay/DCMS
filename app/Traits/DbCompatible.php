<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

trait DbCompatible
{
    /**
     * Returns a raw SQL expression for formatting a datetime column as 'YYYY-MM'.
     * Works on both SQLite and PostgreSQL.
     */
    protected function yearMonthExpr(string $column = 'created_at'): \Illuminate\Database\Query\Expression
    {
        if (DB::getDriverName() === 'pgsql') {
            return DB::raw("TO_CHAR({$column}, 'YYYY-MM') as month");
        }
        return DB::raw("strftime('%Y-%m', {$column}) as month");
    }

    /**
     * Returns a raw SQL expression for extracting just the date part.
     * Works on both SQLite and PostgreSQL.
     */
    protected function dateExpr(string $column = 'created_at'): \Illuminate\Database\Query\Expression
    {
        if (DB::getDriverName() === 'pgsql') {
            return DB::raw("DATE({$column}) as date");
        }
        return DB::raw("DATE({$column}) as date");
    }

    /**
     * Returns a raw SQL WHERE expression for age group filtering from a birthdate column.
     * Works on both SQLite and PostgreSQL.
     */
    protected function ageRawExpr(string $column = 'birthdate'): string
    {
        if (DB::getDriverName() === 'pgsql') {
            return "EXTRACT(YEAR FROM AGE(CURRENT_DATE, {$column}))";
        }
        return "CAST((julianday('now') - julianday({$column})) / 365.25 AS INTEGER)";
    }
}
