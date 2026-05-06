import { useEffect, useRef, useState } from 'react';
import { Megaphone, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Announcement {
    id: number;
    title: string;
    message: string;
    read_at: string | null;
    created_at: string;
    expires_at: string | null;
    display_minutes: number;
}

interface Props {
    announcements: Announcement[];
}

// Per-session dismissed set (survives re-renders, resets on page reload)
const sessionDismissed = new Set<number>();

export default function AnnouncementBanner({ announcements }: Props) {
    const [index, setIndex] = useState(0);
    const [dismissed, setDismissed] = useState<Set<number>>(new Set(sessionDismissed));
    const [timeLeft, setTimeLeft] = useState<Record<number, number>>({});
    const tickerRef = useRef<HTMLDivElement>(null);

    // Filter: not dismissed, not expired
    const active = announcements.filter(a =>
        !dismissed.has(a.id) &&
        (!a.expires_at || new Date(a.expires_at) > new Date())
    );

    // Initialise countdown timers
    useEffect(() => {
        const initial: Record<number, number> = {};
        active.forEach(a => {
            if (!(a.id in timeLeft)) {
                initial[a.id] = (a.display_minutes ?? 5) * 60;
            }
        });
        if (Object.keys(initial).length) {
            setTimeLeft(prev => ({ ...prev, ...initial }));
        }
    }, [active.length]);

    // Tick every second
    useEffect(() => {
        if (!active.length) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const next = { ...prev };
                active.forEach(a => {
                    if ((next[a.id] ?? 0) > 0) {
                        next[a.id] = (next[a.id] ?? 0) - 1;
                    } else {
                        // Auto-dismiss when timer hits 0
                        handleDismiss(a.id, false);
                    }
                });
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [active.length]);

    // Cycle through announcements every 8s if multiple
    useEffect(() => {
        if (active.length <= 1) return;
        const t = setInterval(() => setIndex(i => (i + 1) % active.length), 8000);
        return () => clearInterval(t);
    }, [active.length]);

    // Keep index in bounds
    useEffect(() => {
        if (index >= active.length && active.length > 0) setIndex(active.length - 1);
    }, [active.length]);

    const handleDismiss = (id: number, markRead = true) => {
        sessionDismissed.add(id);
        setDismissed(new Set(sessionDismissed));
        if (markRead) {
            router.post(`/parent/notifications/${id}/read`, {}, { preserveScroll: true });
        }
    };

    if (!active.length) return null;

    const current = active[Math.min(index, active.length - 1)];
    if (!current) return null;

    const secs = timeLeft[current.id] ?? 0;
    const mins = Math.floor(secs / 60);
    const sec  = secs % 60;
    const pct  = Math.max(0, (secs / ((current.display_minutes ?? 5) * 60)) * 100);

    return (
        <div className="sticky top-0 z-50 no-print">
            {/* Progress bar */}
            <div className="h-0.5 bg-sky-100">
                <div
                    className="h-full bg-gradient-to-r from-sky-400 to-teal-400 transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500 shadow-md">
                <div className="flex items-center gap-3 px-4 py-2.5">
                    {/* Icon */}
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                        <Megaphone className="w-3.5 h-3.5 text-white" />
                    </div>

                    {/* Label */}
                    <span className="shrink-0 text-[10px] font-bold text-white/80 uppercase tracking-widest hidden sm:block">
                        Announcement
                    </span>

                    {/* Divider */}
                    <div className="shrink-0 w-px h-4 bg-white/30 hidden sm:block" />

                    {/* Scrolling ticker */}
                    <div className="flex-1 overflow-hidden relative">
                        <div
                            ref={tickerRef}
                            key={current.id}
                            className="whitespace-nowrap text-sm font-semibold text-white animate-ticker"
                        >
                            <span className="text-white/90 font-bold mr-3">{current.title}:</span>
                            {current.message}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className="text-white/90 font-bold mr-3">{current.title}:</span>
                            {current.message}
                        </div>
                    </div>

                    {/* Timer */}
                    <span className="shrink-0 text-[10px] font-mono text-white/70 hidden sm:block tabular-nums">
                        {mins}:{sec.toString().padStart(2, '0')}
                    </span>

                    {/* Nav arrows (multiple announcements) */}
                    {active.length > 1 && (
                        <div className="shrink-0 flex items-center gap-1">
                            <button onClick={() => setIndex(i => (i - 1 + active.length) % active.length)}
                                className="p-1 rounded text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] text-white/60 tabular-nums">{index + 1}/{active.length}</span>
                            <button onClick={() => setIndex(i => (i + 1) % active.length)}
                                className="p-1 rounded text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    {/* Dismiss */}
                    <button onClick={() => handleDismiss(current.id)}
                        className="shrink-0 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
