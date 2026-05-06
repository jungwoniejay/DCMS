import { usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Bell, CheckCircle, XCircle, X, CheckCheck, Megaphone } from 'lucide-react';
import axios from 'axios';

interface NotificationItem {
    id: number;
    type: string;
    title: string;
    message: string;
    read_at: string | null;
    created_at: string;
}

interface Pos { top: number; right: number; }

export default function NotificationBell() {
    const { props } = usePage();
    const count = (props as any).notifications_count ?? 0;
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<Pos>({ top: 0, right: 0 });
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                btnRef.current && !btnRef.current.contains(e.target as Node) &&
                dropRef.current && !dropRef.current.contains(e.target as Node)
            ) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // Reposition on scroll/resize
    const updatePos = useCallback(() => {
        if (!btnRef.current) return;
        const r = btnRef.current.getBoundingClientRect();
        setPos({
            top: r.bottom + 8,
            right: window.innerWidth - r.right,
        });
    }, []);

    useEffect(() => {
        if (!open) return;
        updatePos();
        window.addEventListener('scroll', updatePos, true);
        window.addEventListener('resize', updatePos);
        return () => {
            window.removeEventListener('scroll', updatePos, true);
            window.removeEventListener('resize', updatePos);
        };
    }, [open, updatePos]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/parent/notifications');
            setNotifications(res.data.data ?? res.data);
        } catch {}
        setLoading(false);
    };

    const handleOpen = () => {
        const next = !open;
        setOpen(next);
        if (next) {
            updatePos();
            fetchNotifications();
        }
    };

    const markRead = async (id: number) => {
        await axios.post(`/parent/notifications/${id}/read`);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        router.reload({ only: ['notifications_count'] });
    };

    const markAllRead = async () => {
        await axios.post('/parent/notifications/read-all');
        setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        router.reload({ only: ['notifications_count'] });
    };

    const typeIcon = (type: string) => {
        if (type === 'enrollment_approved') return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
        if (type === 'enrollment_rejected') return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
        if (type === 'admin_announcement') return <Megaphone className="w-4 h-4 text-sky-500 shrink-0" />;
        return <Bell className="w-4 h-4 text-violet-500 shrink-0" />;
    };

    const dropdown = open ? (
        <div
            ref={dropRef}
            style={{
                position: 'fixed',
                top: pos.top,
                right: pos.right,
                zIndex: 9999,
                width: 320,
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(226,232,240,1)',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
        >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-800">Notifications</p>
                        {count > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">{count}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {notifications.some(n => !n.read_at) && (
                            <button onClick={markAllRead}
                                className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold transition-colors">
                                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                            </button>
                        )}
                        <button onClick={() => setOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="max-h-72 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-slate-400">Loading...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <Bell className="w-8 h-8 text-slate-200" />
                            <p className="text-sm text-slate-400">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id}
                                onClick={() => !n.read_at && markRead(n.id)}
                                className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 transition-colors ${
                                    !n.read_at ? 'bg-violet-50/40 hover:bg-violet-50 cursor-pointer' : 'hover:bg-slate-50 cursor-default'
                                }`}>
                                <div className="mt-0.5 shrink-0">{typeIcon(n.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs text-slate-800 leading-snug ${!n.read_at ? 'font-bold' : 'font-medium'}`}>{n.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {new Date(n.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                {!n.read_at && <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-1.5" />}
                            </div>
                        ))
                    )}
                </div>
        </div>
    ) : null;

    return (
        <>
            <button ref={btnRef} onClick={handleOpen}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-white/80 transition-colors">
                <Bell className="w-5 h-5" />
                {count > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>
            {typeof document !== 'undefined' && createPortal(dropdown, document.body)}
        </>
    );
}
