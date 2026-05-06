import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Send, MessageCircle, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function initials(name: string) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function DateSeparator({ date }: { date: string }) {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let label = d.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
    if (d.toDateString() === today.toDateString()) label = 'Today';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    return (
        <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2">{label}</span>
            <div className="flex-1 h-px bg-slate-100" />
        </div>
    );
}

export default function Messages({ conversations, messages, activeParent }: any) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { data, setData, post, processing, reset } = useForm({ body: '' });
    const [search, setSearch] = useState('');

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.body.trim() || !activeParent) return;
        post(route('admin.messages.send', activeParent.id), { onSuccess: () => reset() });
    };

    const fmt = (d: string) => new Date(d).toLocaleString('en-PH', { hour: '2-digit', minute: '2-digit' });
    const fmtShort = (d: string) => {
        const date = new Date(d);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return new Date(d).toLocaleString('en-PH', { hour: '2-digit', minute: '2-digit' });
        return new Date(d).toLocaleString('en-PH', { month: 'short', day: 'numeric' });
    };

    const filtered = conversations.filter((c: any) => c.name.toLowerCase().includes(search.toLowerCase()));

    // Group messages by date
    const grouped: { date: string; msgs: any[] }[] = [];
    (messages ?? []).forEach((msg: any) => {
        const day = new Date(msg.created_at).toDateString();
        const last = grouped[grouped.length - 1];
        if (last && last.date === day) last.msgs.push(msg);
        else grouped.push({ date: day, msgs: [msg] });
    });

    return (
        <AdminLayout>
            <Head title="Messages" />
            <div className="flex flex-col gap-1 mb-4">
                <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
                <p className="text-slate-500 text-sm">Conversations with parents</p>
            </div>

            <div className="flex gap-4" style={{ height: '74vh' }}>
                {/* Sidebar */}
                <div className="w-72 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-4 pt-4 pb-3 border-b border-slate-100 space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Conversations</p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search parents..."
                                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                <MessageCircle className="w-10 h-10 text-slate-200 mb-2" />
                                <p className="text-slate-400 text-sm">No conversations yet</p>
                            </div>
                        ) : (
                            filtered.map((c: any) => {
                                const isActive = activeParent?.id === c.id;
                                return (
                                    <button key={c.id} onClick={() => router.get(route('admin.messages.show', c.id))}
                                        className={`w-full flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left ${isActive ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white shadow-sm ${isActive ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-slate-400 to-slate-500'}`}>
                                            {initials(c.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <p className={`text-sm truncate ${isActive ? 'font-bold text-blue-700' : 'font-semibold text-slate-700'}`}>{c.name}</p>
                                                {c.last_at && <p className="text-[10px] text-slate-400 shrink-0">{fmtShort(c.last_at)}</p>}
                                            </div>
                                            <p className={`text-xs truncate mt-0.5 ${c.unread > 0 ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                                                {c.last_message ?? 'No messages yet'}
                                            </p>
                                        </div>
                                        {c.unread > 0 && (
                                            <span className="shrink-0 min-w-[20px] h-5 px-1 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {c.unread > 9 ? '9+' : c.unread}
                                            </span>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Panel */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    {!activeParent ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                                <MessageCircle className="w-10 h-10 text-slate-300" />
                            </div>
                            <div>
                                <p className="text-slate-600 font-semibold">No conversation selected</p>
                                <p className="text-slate-400 text-sm mt-1">Choose a parent from the list to start messaging</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3 bg-white">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow text-sm font-bold text-white">
                                        {initials(activeParent.name)}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800">{activeParent.name}</p>
                                    <p className="text-xs text-emerald-500 font-medium">Active</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-slate-50/40">
                                {grouped.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <p className="text-slate-400 text-sm">No messages yet. Say hello! 👋</p>
                                    </div>
                                ) : (
                                    grouped.map(group => (
                                        <div key={group.date}>
                                            <DateSeparator date={group.msgs[0].created_at} />
                                            <div className="space-y-1.5">
                                                {group.msgs.map((msg: any, i: number) => {
                                                    const isMe = msg.sender?.role === 'admin';
                                                    const showAvatar = !isMe && (i === 0 || group.msgs[i - 1]?.sender?.role === 'admin');
                                                    return (
                                                        <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                            {!isMe && (
                                                                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white ${showAvatar ? 'bg-gradient-to-br from-slate-400 to-slate-500' : 'opacity-0'}`}>
                                                                    {initials(activeParent.name)}
                                                                </div>
                                                            )}
                                                            <div className={`max-w-[70%] group`}>
                                                                <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                                                    isMe
                                                                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-br-none'
                                                                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                                                }`}>
                                                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                                                                </div>
                                                                <p className={`text-[10px] mt-1 px-1 ${isMe ? 'text-right text-slate-400' : 'text-slate-400'}`}>{fmt(msg.created_at)}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-slate-100 bg-white flex items-end gap-3">
                                <textarea
                                    value={data.body}
                                    onChange={e => setData('body', e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                                    placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                                    rows={1}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white resize-none transition-colors"
                                />
                                <button type="submit" disabled={processing || !data.body.trim()}
                                    className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow hover:shadow-md hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100">
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
