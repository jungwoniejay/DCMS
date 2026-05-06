<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class AdminAnnouncementController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'message'      => 'required|string|max:1000',
            'scheduled_at' => 'nullable|date',
            'expires_at'   => 'nullable|date|after:now',
        ]);

        $parents = User::where('role', 'parent')->pluck('id');

        foreach ($parents as $parentId) {
            Notification::send(
                $parentId,
                'admin_announcement',
                $request->title,
                $request->message,
                ['from' => 'admin'],
                $request->scheduled_at ?: null,
                $request->expires_at   ?: null,
            );
        }

        return back()->with('success', "Announcement sent to {$parents->count()} parent(s).");
    }
}
