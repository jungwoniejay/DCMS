<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    // Parent: view inbox / conversation with admin
    public function parentIndex()
    {
        $admin = User::where('role', 'admin')->first();
        $userId = auth()->id();

        $messages = Message::where(function ($q) use ($userId, $admin) {
                $q->where('sender_id', $userId)->where('receiver_id', $admin?->id);
            })->orWhere(function ($q) use ($userId, $admin) {
                $q->where('sender_id', $admin?->id)->where('receiver_id', $userId);
            })
            ->with('sender:id,name,role')
            ->orderBy('created_at')
            ->get();

        // Mark admin messages as read
        Message::where('sender_id', $admin?->id)
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return Inertia::render('parent/Messages', [
            'messages' => $messages,
            'admin'    => $admin ? ['id' => $admin->id, 'name' => $admin->name] : null,
        ]);
    }

    // Parent: send message to admin
    public function parentSend(Request $request)
    {
        $request->validate(['body' => 'required|string|max:1000']);
        $admin = User::where('role', 'admin')->first();
        if (!$admin) return back()->with('error', 'No admin found.');

        Message::create([
            'sender_id'   => auth()->id(),
            'receiver_id' => $admin->id,
            'body'        => $request->body,
        ]);

        return back();
    }

    // Admin: list all parent conversations
    public function adminIndex()
    {
        $adminId = auth()->id();

        $conversations = User::where('role', 'parent')
            ->whereHas('sentMessages', fn($q) => $q->where('receiver_id', $adminId))
            ->orWhereHas('receivedMessages', fn($q) => $q->where('sender_id', $adminId))
            ->get()
            ->map(function ($parent) use ($adminId) {
                $last = Message::where(function ($q) use ($parent, $adminId) {
                        $q->where('sender_id', $parent->id)->where('receiver_id', $adminId);
                    })->orWhere(function ($q) use ($parent, $adminId) {
                        $q->where('sender_id', $adminId)->where('receiver_id', $parent->id);
                    })
                    ->latest()
                    ->first();

                $unread = Message::where('sender_id', $parent->id)
                    ->where('receiver_id', $adminId)
                    ->whereNull('read_at')
                    ->count();

                return [
                    'id'         => $parent->id,
                    'name'       => $parent->name,
                    'last_message' => $last?->body,
                    'last_at'    => $last?->created_at,
                    'unread'     => $unread,
                ];
            })
            ->sortByDesc('last_at')
            ->values();

        return Inertia::render('admin/Messages', [
            'conversations' => $conversations,
        ]);
    }

    // Admin: view conversation with a parent
    public function adminShow($parentId)
    {
        $adminId = auth()->id();

        $messages = Message::where(function ($q) use ($parentId, $adminId) {
                $q->where('sender_id', $parentId)->where('receiver_id', $adminId);
            })->orWhere(function ($q) use ($parentId, $adminId) {
                $q->where('sender_id', $adminId)->where('receiver_id', $parentId);
            })
            ->with('sender:id,name,role')
            ->orderBy('created_at')
            ->get();

        // Mark parent messages as read
        Message::where('sender_id', $parentId)
            ->where('receiver_id', $adminId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $parent = User::findOrFail($parentId);

        return Inertia::render('admin/Messages', [
            'conversations' => $this->getConversations($adminId),
            'messages'      => $messages,
            'activeParent'  => ['id' => $parent->id, 'name' => $parent->name],
        ]);
    }

    // Admin: send message to parent
    public function adminSend(Request $request, $parentId)
    {
        $request->validate(['body' => 'required|string|max:1000']);

        Message::create([
            'sender_id'   => auth()->id(),
            'receiver_id' => $parentId,
            'body'        => $request->body,
        ]);

        return back();
    }

    private function getConversations($adminId)
    {
        return User::where('role', 'parent')
            ->where(function ($q) use ($adminId) {
                $q->whereHas('sentMessages', fn($q2) => $q2->where('receiver_id', $adminId))
                  ->orWhereHas('receivedMessages', fn($q2) => $q2->where('sender_id', $adminId));
            })
            ->get()
            ->map(function ($parent) use ($adminId) {
                $last = Message::where(function ($q) use ($parent, $adminId) {
                        $q->where('sender_id', $parent->id)->where('receiver_id', $adminId);
                    })->orWhere(function ($q) use ($parent, $adminId) {
                        $q->where('sender_id', $adminId)->where('receiver_id', $parent->id);
                    })->latest()->first();

                return [
                    'id'           => $parent->id,
                    'name'         => $parent->name,
                    'last_message' => $last?->body,
                    'last_at'      => $last?->created_at,
                    'unread'       => Message::where('sender_id', $parent->id)->where('receiver_id', $adminId)->whereNull('read_at')->count(),
                ];
            })
            ->sortByDesc('last_at')
            ->values();
    }
}
