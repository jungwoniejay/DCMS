<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Child;
use App\Models\BarangaySetting;
use App\Models\FamilyProfile;
use App\Models\HealthRecord;
use App\Models\NutritionRecord;
use App\Services\ClassroomClassifier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminSystemController extends Controller
{
    public function index()
    {
        $systemData = [
            'users' => User::orderBy('created_at', 'desc')->paginate(15),
            'stats' => [
                'total_users' => User::count(),
                'admin_users' => User::where('role', 'admin')->count(),
                'parent_users' => User::where('role', 'parent')->count(),
                'total_records' => Child::count(),
                'database_size' => $this->getDatabaseSize(),
            ],
            'tables' => $this->getDatabaseTables(),
        ];
        
        return Inertia::render('admin/System', array_merge($systemData, [
            'barangay_settings' => BarangaySetting::allKeyed(),
            'provinces'         => \App\Models\Province::orderBy('name')->get(['id', 'name']),
            'cities'            => \App\Models\City::orderBy('name')->get(['id', 'name', 'province_id']),
        ]));
    }
    
    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,parent',
        ]);
        
        $validated['password'] = Hash::make($validated['password']);
        
        User::create($validated);
        
        return back()->with('success', 'User created successfully!');
    }
    
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|in:admin,parent',
        ]);
        
        if ($request->filled('password')) {
            $request->validate(['password' => 'string|min:8']);
            $validated['password'] = Hash::make($request->password);
        }
        
        $user->update($validated);
        
        return back()->with('success', 'User updated successfully!');
    }
    
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account!');
        }
        
        $user->delete();
        
        return back()->with('success', 'User deleted successfully!');
    }
    
    public function saveBarangaySettings(Request $request)
    {
        $validated = $request->validate([
            'barangay_name'     => 'required|string|max:255',
            'city_municipality' => 'required|string|max:255',
            'province'          => 'required|string|max:255',
            'cdc_name'          => 'required|string|max:255',
            'system_name'       => 'required|string|max:255',
            'contact_phone'     => 'nullable|string|max:50',
            'contact_email'     => 'nullable|email|max:255',
            'contact_address'   => 'nullable|string|max:500',
            'office_hours'      => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            BarangaySetting::set($key, $value ?? '');
        }

        return back()->with('success', 'Barangay settings saved successfully!');
    }

    public function exportDatabase(Request $request)
    {
        $validated = $request->validate([
            'format' => 'required|in:csv,sql,json',
            'tables' => 'nullable|array',
            'tables.*' => 'string',
        ]);

        $format = $validated['format'];
        $allowedTables = $this->getDatabaseTables();
        $requestedTables = $validated['tables'] ?? [];

        // Whitelist: only allow tables that actually exist in the database
        $selectedTables = empty($requestedTables)
            ? $allowedTables
            : array_values(array_intersect($requestedTables, $allowedTables));

        if (empty($selectedTables)) {
            return back()->with('error', 'No valid tables selected for export.');
        }

        try {
            $timestamp = date('Y-m-d_H-i-s');
            
            switch ($format) {
                case 'csv':
                    return $this->exportAsCsv($selectedTables, $timestamp);
                case 'sql':
                    return $this->exportAsSql($selectedTables, $timestamp);
                case 'json':
                    return $this->exportAsJson($selectedTables, $timestamp);
                default:
                    return back()->with('error', 'Invalid export format!');
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Export failed: ' . $e->getMessage());
        }
    }

    private function exportAsCsv($tables, $timestamp)
    {
        $timestamp = preg_replace('/[^a-zA-Z0-9_-]/', '', $timestamp);
        $zip = new \ZipArchive();
        $zipFilename = 'database_export_' . $timestamp . '.zip';
        $zipPath = storage_path('app/temp/' . basename($zipFilename));
        
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }
        
        if ($zip->open($zipPath, \ZipArchive::CREATE) !== true) {
            return back()->with('error', 'Failed to create export file!');
        }

        foreach ($tables as $table) {
            $data = DB::table($table)->get();
            if ($data->isEmpty()) continue;
            
            $csvContent = fopen('php://temp', 'r+');
            
            // Add headers
            $headers = array_keys((array)$data->first());
            fputcsv($csvContent, $headers);
            
            // Add data rows
            foreach ($data as $row) {
                fputcsv($csvContent, (array)$row);
            }
            
            rewind($csvContent);
            $csvData = stream_get_contents($csvContent);
            fclose($csvContent);
            
            $zip->addFromString($table . '.csv', $csvData);
        }

        $zip->close();
        
        return response()->download($zipPath, $zipFilename)->deleteFileAfterSend(true);
    }

    private function exportAsSql($tables, $timestamp)
    {
        $timestamp = preg_replace('/[^a-zA-Z0-9_-]/', '', $timestamp);
        $sqlContent = "-- Database Export\n";
        $sqlContent .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
        $sqlContent .= "-- Tables: " . implode(', ', $tables) . "\n\n";

        foreach ($tables as $table) {
            $data = DB::table($table)->get();
            if ($data->isEmpty()) continue;
            
            $sqlContent .= "-- Table: {$table}\n";
            $sqlContent .= "-- Records: " . $data->count() . "\n\n";
            
            foreach ($data as $row) {
                $columns = array_keys((array)$row);
                $values = array_map(function($val) {
                    if ($val === null) return 'NULL';
                    return DB::connection()->getPdo()->quote((string)$val);
                }, (array)$row);
                
                $sqlContent .= "INSERT INTO {$table} (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $values) . ");\n";
            }
            
            $sqlContent .= "\n";
        }

        $filename = 'database_export_' . $timestamp . '.sql';
        $path = storage_path('app/temp/' . basename($filename));
        
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }
        
        file_put_contents($path, $sqlContent);
        
        return response()->download($path, $filename)->deleteFileAfterSend(true);
    }

    private function exportAsJson($tables, $timestamp)
    {
        $timestamp = preg_replace('/[^a-zA-Z0-9_-]/', '', $timestamp);
        $exportData = [
            'export_date' => date('Y-m-d H:i:s'),
            'tables' => [],
        ];

        foreach ($tables as $table) {
            $data = DB::table($table)->get();
            $exportData['tables'][$table] = [
                'record_count' => $data->count(),
                'records' => $data->toArray(),
            ];
        }

        $filename = 'database_export_' . $timestamp . '.json';
        $path = storage_path('app/temp/' . basename($filename));
        
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }
        
        file_put_contents($path, json_encode($exportData, JSON_PRETTY_PRINT));
        
        return response()->download($path, $filename)->deleteFileAfterSend(true);
    }

    private function getDatabaseTables()
    {
        $driver = DB::getDriverName();
        
        if ($driver === 'sqlite') {
            $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
            return array_column($tables, 'name');
        } elseif ($driver === 'pgsql') {
            $tables = DB::select("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename");
            return array_column($tables, 'tablename');
        } elseif ($driver === 'mysql') {
            $tables = DB::select("SHOW TABLES");
            return array_map(function($table) {
                return reset($table);
            }, $tables);
        }
        
        return [];
    }
    
    public function reclassifyClassrooms()
    {
        $count = ClassroomClassifier::reclassifyAll();
        return back()->with('success', "{$count} children have been automatically classified into classrooms.");
    }

    public function clearCache()
    {
        try {
            \Artisan::call('cache:clear');
            \Artisan::call('config:clear');
            \Artisan::call('route:clear');
            \Artisan::call('view:clear');
            
            return back()->with('success', 'Cache cleared successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to clear cache: ' . $e->getMessage());
        }
    }
    
    public function getDatabaseSize()
    {
        $driver = DB::getDriverName();
        
        if ($driver === 'sqlite') {
            $dbPath = database_path('database.sqlite');
            if (file_exists($dbPath)) {
                $size = filesize($dbPath);
                return $this->formatBytes($size);
            }
        } elseif ($driver === 'pgsql') {
            $result = DB::select("SELECT pg_database_size(current_database()) as size");
            if (isset($result[0])) {
                return $this->formatBytes($result[0]->size);
            }
        } elseif ($driver === 'mysql') {
            $result = DB::select("SELECT SUM(data_length + index_length) as size FROM information_schema.tables WHERE table_schema = DATABASE()");
            if (isset($result[0])) {
                return $this->formatBytes($result[0]->size);
            }
        }
        
        return 'Unknown';
    }
    
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
