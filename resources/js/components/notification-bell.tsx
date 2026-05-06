import { usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, XCircle, X, CheckCheck } from 'lucide-react';
import axios from 'axios';

interface NotificationItem {
    id: number;
    type: string;
    title: string;
    message: string;
    read_at: string | null;
    created_at: string;
}

export default function NotificationBell() {
    const { props } = usePage();
    const count = (props as any).notifications_count ?? 0;
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/parent/notifications');
            setNotifications(res.data.data ?? res.data);
        } catch {}
        setLoading(false);
    };

    const handleOpen = () => {
        setOpen(prev => !prev);
        if (!open) fetchNotifications();
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
        if (type === 'enrollment_approved') return <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />;
        if (type === 'enrollment_rejected') return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
        return <Bell className="w-4 h-4 text-blue-500 shrink-0" />;
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-white/80 transition-colors"
            >
                <Bell className="w-5 h-5" />
                {count > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="absolute left-0 top-12 w-80 rounded-2xl shadow-xl z-50 overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.9)' }}
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-slate-800">Notifications</p>
                        <div className="flex items-center gap-2">
                            {notifications.some(n => !n.read_at) && (
                                <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium">
                                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                                </button>
                            )}
                            <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="text-center py-8 text-sm text-slate-400">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-8">
                                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.read_at && markRead(n.id)}
                                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-purple-50/50 transition-colors ${!n.read_at ? 'bg-purple-50/30' : ''}`}
                                >
                                    <div className="mt-0.5">{typeIcon(n.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs text-slate-800 ${!n.read_at ? 'font-bold' : 'font-semibold'}`}>{n.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                                    </div>
                                    {!n.read_at && <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
