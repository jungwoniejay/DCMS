<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    /**
     * Display the activity monitoring dashboard
     */
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->get('search'),
            'user_id' => $request->get('user_id'),
            'action' => $request->get('action'),
            'action_type' => $request->get('action_type'),
            'is_suspicious' => $request->get('is_suspicious'),
            'date_from' => $request->get('date_from'),
            'date_to' => $request->get('date_to'),
        ];

        $perPage = min((int) $request->get('per_page', 25), 100);
        $page = $request->get('page', 1);

        // Build query
        $query = ActivityLog::with('user')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($filters['search']) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%")
                  ->orWhere('user_agent', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($filters['user_id']) {
            $query->where('user_id', $filters['user_id']);
        }

        if ($filters['action']) {
            $query->where('action', $filters['action']);
        }

        if ($filters['action_type']) {
            $query->where('action_type', $filters['action_type']);
        }

        if ($filters['is_suspicious'] !== null && $filters['is_suspicious'] !== '') {
            $query->where('is_suspicious', filter_var($filters['is_suspicious'], FILTER_VALIDATE_BOOLEAN));
        }

        if ($filters['date_from']) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if ($filters['date_to']) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        $activityLogs = $query->paginate($perPage)->withQueryString();

        // Get statistics
        $stats = $this->getStatistics();

        // Get suspicious activity trends (last 7 days)
        $suspiciousTrends = $this->getSuspiciousTrends();

        // Get action type distribution
        $actionDistribution = $this->getActionDistribution();

        // Get recent suspicious activities
        $recentSuspicious = ActivityLog::suspicious()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get unique users for filter dropdown
        $users = User::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        // Get unique actions for filter dropdown
        $actions = ActivityLog::select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action');

        // Get unique action types for filter dropdown
        $actionTypes = ActivityLog::select('action_type')
            ->distinct()
            ->orderBy('action_type')
            ->pluck('action_type')
            ->filter()
            ->values();

        return Inertia::render('admin/ActivityMonitoring', [
            'activityLogs' => $activityLogs,
            'filters' => $filters,
            'stats' => $stats,
            'suspiciousTrends' => $suspiciousTrends,
            'actionDistribution' => $actionDistribution,
            'recentSuspicious' => $recentSuspicious,
            'users' => $users,
            'actions' => $actions,
            'actionTypes' => $actionTypes,
        ]);
    }

    /**
     * Get activity statistics
     */
    private function getStatistics(): array
    {
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();

        return [
            'total_activities' => ActivityLog::count(),
            'suspicious_activities' => ActivityLog::suspicious()->count(),
            'today_activities' => ActivityLog::whereDate('created_at', '>=', $today)->count(),
            'today_suspicious' => ActivityLog::suspicious()->whereDate('created_at', '>=', $today)->count(),
            'unique_users_today' => ActivityLog::whereDate('created_at', '>=', $today)
                ->distinct('user_id')
                ->count('user_id'),
            'failed_logins_today' => ActivityLog::ofAction('failed_login')
                ->whereDate('created_at', '>=', $today)
                ->count(),
            'yesterday_activities' => ActivityLog::whereBetween('created_at', [$yesterday, $today])->count(),
            'activity_growth' => $this->calculateGrowth($today),
        ];
    }

    /**
     * Calculate activity growth percentage
     */
    private function calculateGrowth($today): float
    {
        $todayCount = ActivityLog::whereDate('created_at', '>=', $today)->count();
        $yesterdayCount = ActivityLog::whereDate('created_at', '>=', now()->subDay()->startOfDay())
            ->whereDate('created_at', '<', $today)
            ->count();

        if ($yesterdayCount == 0) {
            return $todayCount > 0 ? 100 : 0;
        }

        return round((($todayCount - $yesterdayCount) / $yesterdayCount) * 100, 1);
    }

    /**
     * Get suspicious activity trends for the last 7 days
     */
    private function getSuspiciousTrends(): array
    {
        $trends = [];
        $endDate = now()->endOfDay();
        $startDate = now()->subDays(6)->startOfDay();

        $dailyStats = ActivityLog::selectRaw('DATE(created_at) as date, 
                    COUNT(*) as total,
                    SUM(CASE WHEN is_suspicious THEN 1 ELSE 0 END) as suspicious')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Fill in all 7 days
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayData = $dailyStats->firstWhere('date', $date);
            
            $trends[] = [
                'date' => now()->subDays($i)->format('M d'),
                'total' => $dayData ? (int)$dayData->total : 0,
                'suspicious' => $dayData ? (int)$dayData->suspicious : 0,
            ];
        }

        return $trends;
    }

    /**
     * Get action type distribution
     */
    private function getActionDistribution(): array
    {
        return ActivityLog::selectRaw('action, COUNT(*) as count')
            ->whereDate('created_at', '>=', now()->subDays(7))
            ->groupBy('action')
            ->orderByDesc('count')
            ->get()
            ->map(function($item) {
                return [
                    'action' => $item->action,
                    'count' => (int)$item->count,
                ];
            })
            ->toArray();
    }

    /**
     * Export activity logs
     */
    public function export(Request $request)
    {
        $validated = $request->validate([
            'format' => 'required|in:csv,json',
            'filters' => 'nullable|array',
        ]);

        $filters = $validated['filters'] ?? [];
        $format = $validated['format'];

        // Build query with filters
        $query = ActivityLog::with('user')->orderBy('created_at', 'desc');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        $logs = $query->limit(10000)->get();

        $timestamp = date('Y-m-d_H-i-s');

        if ($format === 'csv') {
            return $this->exportAsCsv($logs, $timestamp);
        } else {
            return $this->exportAsJson($logs, $timestamp);
        }
    }

    /**
     * Export as CSV
     */
    private function exportAsCsv($logs, $timestamp)
    {
        $filename = 'activity_logs_' . $timestamp . '.csv';

        $rows = [];
        $rows[] = implode(',', ['ID','User','Action','Action Type','Description','IP Address','Browser','OS','Device Type','Is Suspicious','Suspicion Reason','Created At']);

        foreach ($logs as $log) {
            $rows[] = implode(',', array_map(fn($v) => '"' . str_replace('"', '""', (string)$v) . '"', [
                $log->id,
                $log->user ? $log->user->name : 'N/A',
                $log->action,
                $log->action_type,
                $log->description,
                $log->ip_address,
                $log->browser,
                $log->os,
                $log->device_type,
                $log->is_suspicious ? 'Yes' : 'No',
                $log->suspicion_reason,
                $log->created_at->toDateTimeString(),
            ]));
        }

        return response(implode("\n", $rows), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Export as JSON
     */
    private function exportAsJson($logs, $timestamp)
    {
        $filename = 'activity_logs_' . $timestamp . '.json';

        $exportData = [
            'export_date' => date('Y-m-d H:i:s'),
            'total_records' => $logs->count(),
            'logs' => $logs->map(fn($log) => [
                'id' => $log->id,
                'user' => $log->user ? ['id' => $log->user->id, 'name' => $log->user->name, 'email' => $log->user->email] : null,
                'action' => $log->action,
                'action_type' => $log->action_type,
                'description' => $log->description,
                'ip_address' => $log->ip_address,
                'browser' => $log->browser,
                'os' => $log->os,
                'device_type' => $log->device_type,
                'is_suspicious' => $log->is_suspicious,
                'suspicion_reason' => $log->suspicion_reason,
                'created_at' => $log->created_at->toDateTimeString(),
            ]),
        ];

        return response()->json($exportData, 200, [
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Show details of a specific activity log
     */
    public function show($id)
    {
        $log = ActivityLog::with('user')->findOrFail($id);
        
        return response()->json([
            'log' => $log,
            'device_info' => $log->device_info,
            'location_info' => $log->location_info,
        ]);
    }
}