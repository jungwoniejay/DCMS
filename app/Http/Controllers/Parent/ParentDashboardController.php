<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\EnrollmentRequest;
use App\Models\CheckupAppointment;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ParentDashboardController extends Controller
{
    public function index()
    {
        $parentId = auth()->id();

        $children = Child::where('guardian_id', $parentId)
            ->with(['familyProfile', 'healthAssessment.medicalAssessment', 'nutritionRecord'])
            ->get()
            ->map(function ($child) {
                $latestNutrition = DB::table('nutrition_records')
                    ->where('child_id', $child->id)
                    ->orderBy('assessment_date', 'desc')
                    ->first();

                return [
                    'id'                  => $child->id,
                    'name'                => "{$child->first_name} {$child->last_name}",
                    'first_name'          => $child->first_name,
                    'age'                 => $child->age,
                    'sex'                 => $child->sex,
                    'status'              => $child->registration_status ?? 'Pending',
                    'zone'                => $child->familyProfile?->purok_zone ?? 'N/A',
                    'profile_picture'     => $child->profile_picture,
                    'has_emergency_alert' => !empty($child->healthAssessment?->medicalAssessment?->emergency_action_conditions),
                    'nutritional_status'  => $latestNutrition?->nutritional_status_result ?? 'Not assessed',
                    'height'              => $latestNutrition?->height_first ?? null,
                    'weight'              => $latestNutrition?->weight_first ?? null,
                ];
            });

        $stats = [
            'total_children'        => $children->count(),
            'pending_registrations' => $children->where('status', 'Pending')->count(),
            'approved_children'     => $children->where('status', 'Approved')->count(),
            'health_alerts'         => $children->where('has_emergency_alert', true)->count(),
        ];

        $recentAppointments = CheckupAppointment::where('requested_by', $parentId)
            ->with('child')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $pendingEnrollments = EnrollmentRequest::where('parent_id', $parentId)
            ->where('status', 'Pending')
            ->count();

        $announcements = \App\Models\Notification::where('user_id', $parentId)
            ->where('type', 'admin_announcement')
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->where(function ($q) {
                $q->whereNull('scheduled_at')->orWhere('scheduled_at', '<=', now());
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'title', 'message', 'read_at', 'created_at', 'expires_at', 'data'])
            ->map(function ($n) {
                $data = $n->data ?? [];
                return [
                    'id'               => $n->id,
                    'title'            => $n->title,
                    'message'          => $n->message,
                    'read_at'          => $n->read_at,
                    'created_at'       => $n->created_at,
                    'expires_at'       => $n->expires_at,
                    'display_minutes'  => (int) ($data['display_minutes'] ?? 5),
                ];
            });

        return Inertia::render('parent/Dashboard', [
            'children'           => $children,
            'stats'              => $stats,
            'recentAppointments' => $recentAppointments,
            'pendingEnrollments' => $pendingEnrollments,
            'announcements'      => $announcements,
        ]);
    }
}
