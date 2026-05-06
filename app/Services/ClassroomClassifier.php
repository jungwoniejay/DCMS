<?php

namespace App\Services;

use App\Models\Child;
use Carbon\Carbon;

class ClassroomClassifier
{
    /**
     * DepEd/DSWD Day Care classification by age:
     *   Infants      : 0 – 11 months
     *   Toddlers     : 1 – 2 years
     *   Nursery      : 3 years
     *   Kindergarten : 4 years
     *   Prep         : 5 – 6 years
     */
    public static function classify(Child $child): string
    {
        $months = Carbon::parse($child->birthdate)->diffInMonths(now());

        if ($months < 12) return 'Infants';
        if ($months < 36) return 'Toddlers';
        if ($months < 48) return 'Nursery';
        if ($months < 60) return 'Kindergarten';
        return 'Prep';
    }

    public static function assign(Child $child): void
    {
        $child->classroom = self::classify($child);
        $child->save();
    }

    public static function reclassifyAll(): int
    {
        $children = Child::where('registration_status', 'Approved')
            ->whereNotNull('birthdate')
            ->get();

        foreach ($children as $child) {
            $child->classroom = self::classify($child);
            $child->save();
        }

        return $children->count();
    }
}
