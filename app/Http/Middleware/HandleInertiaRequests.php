<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return null;
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? [
                    'id'    => $request->user()->id,
                    'name'  => $request->user()->name,
                    'email' => $request->user()->email,
                    'role'  => $request->user()->role,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info'    => $request->session()->get('info'),
            ],
            'notifications_count' => rescue(fn() => $request->user()
                ? \App\Models\Notification::where('user_id', $request->user()->id)
                    ->whereNull('read_at')
                    ->count()
                : 0, 0),
            'pending_enrollments' => rescue(fn() => \App\Models\EnrollmentRequest::where('status', 'Pending')->count(), 0),
            'pending_appointments' => rescue(fn() => \App\Models\CheckupAppointment::where('status', 'Pending')->count(), 0),
            'unread_messages' => rescue(function () use ($request) {
                if (!$request->user()) return 0;
                $user = $request->user();
                if ($user->role === 'admin') {
                    return \App\Models\Message::where('receiver_id', $user->id)->whereNull('read_at')->count();
                }
                $adminId = \App\Models\User::where('role', 'admin')->value('id');
                return $adminId
                    ? \App\Models\Message::where('sender_id', $adminId)->where('receiver_id', $user->id)->whereNull('read_at')->count()
                    : 0;
            }, 0),
            'barangay' => rescue(fn() => \App\Models\BarangaySetting::allKeyed(), []),
            'ai_children' => rescue(function () use ($request) {
                if (!$request->user() || $request->user()->role !== 'parent') return [];
                return \App\Models\Child::where('guardian_id', $request->user()->id)
                    ->get(['id', 'first_name', 'last_name', 'age', 'sex'])
                    ->map(fn($c) => [
                        'id'   => $c->id,
                        'name' => "{$c->first_name} {$c->last_name}",
                        'age'  => $c->age,
                        'sex'  => $c->sex,
                    ])->values();
            }, []),
            'announcements' => rescue(function () use ($request) {
                if (!$request->user() || $request->user()->role !== 'parent') return [];
                return \App\Models\Notification::where('user_id', $request->user()->id)
                    ->where('type', 'admin_announcement')
                    ->whereNull('read_at')
                    ->where(function ($q) { $q->whereNull('expires_at')->orWhere('expires_at', '>', now()); })
                    ->where(function ($q) { $q->whereNull('scheduled_at')->orWhere('scheduled_at', '<=', now()); })
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(['id', 'title', 'message', 'read_at', 'created_at', 'expires_at', 'data'])
                    ->map(fn($n) => [
                        'id'              => $n->id,
                        'title'           => $n->title,
                        'message'         => $n->message,
                        'read_at'         => $n->read_at,
                        'created_at'      => $n->created_at,
                        'expires_at'      => $n->expires_at,
                        'display_minutes' => (int) (($n->data ?? [])['display_minutes'] ?? 5),
                    ])->values();
            }, []),
        ]);
    }
}
