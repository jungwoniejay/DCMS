import ParentLayout from '@/layouts/parent-layout';
import { Head, useForm } from '@inertiajs/react';
import { Send, MessageCircle, ShieldCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';

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

export default function Messages({ messages, admin }: any) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { data, setData, post, processing, reset } = useForm({ body: '' });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.body.trim()) return;
        post(route('parent.messages.send'), { onSuccess: () => reset() });
    };

    const fmt = (d: string) => new Date(d).toLocaleString('en-PH', { hour: '2-digit', minute: '2-digit' });

    // Group messages by date
    const grouped: { date: string; msgs: any[] }[] = [];
    (messages ?? []).forEach((msg: any) => {
        const day = new Date(msg.created_at).toDateString();
        const last = grouped[grouped.length - 1];
        if (last && last.date === day) last.msgs.push(msg);
        else grouped.push({ date: day, msgs: [msg] });
    });

    const adminName = admin?.name ?? 'Day Care Admin';

    return (
        <ParentLayout>
            <Head title="Messages" />
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
                    <p className="text-slate-500 text-sm mt-1">Direct conversation with the Day Care admin</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden" style={{ height: '68vh' }}>
                    {/* Header */}
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-sky-50 to-teal-50">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow text-sm font-bold text-white">
                                {initials(adminName)}
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                                <p className="text-sm font-bold text-slate-800">{adminName}</p>
                                <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                            </div>
                            <p className="text-xs text-emerald-500 font-medium">Active · Administrator</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 bg-slate-50/40">
                        {grouped.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                    <MessageCircle className="w-8 h-8 text-slate-300" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">No messages yet</p>
                                    <p className="text-slate-400 text-xs mt-1">Send a message to the admin below 👇</p>
                                </div>
                            </div>
                        ) : (
                            grouped.map(group => (
                                <div key={group.date}>
                                    <DateSeparator date={group.msgs[0].created_at} />
                                    <div className="space-y-1.5">
                                        {group.msgs.map((msg: any, i: number) => {
                                            const isMe = msg.sender_id !== admin?.id;
                                            const showAvatar = !isMe && (i === 0 || group.msgs[i - 1]?.sender_id === admin?.id);
                                            return (
                                                <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    {!isMe && (
                                                        <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white ${showAvatar ? 'bg-gradient-to-br from-sky-500 to-teal-500' : 'opacity-0'}`}>
                                                            {initials(adminName)}
                                                        </div>
                                                    )}
                                                    <div className="max-w-[70%]">
                                                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                                            isMe
                                                                ? 'bg-gradient-to-br from-sky-500 to-teal-500 text-white rounded-br-none'
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
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white resize-none transition-colors"
                        />
                        <button type="submit" disabled={processing || !data.body.trim()}
                            className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white flex items-center justify-center shadow hover:shadow-md hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </ParentLayout>
    );
}
