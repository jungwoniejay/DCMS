import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Send, MessageCircle, User } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Messages({ conversations, messages, activeParent }: any) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { data, setData, post, processing, reset } = useForm({ body: '' });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.body.trim() || !activeParent) return;
        post(route('admin.messages.send', activeParent.id), { onSuccess: () => reset() });
    };

    const fmt = (d: string) => new Date(d).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const fmtShort = (d: string) => new Date(d).toLocaleString('en-PH', { month: 'short', day: 'numeric' });

    return (
        <AdminLayout>
            <Head title="Messages" />
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
                    <p className="text-slate-500 text-sm mt-1">Conversations with parents</p>
                </div>

                <div className="flex gap-4" style={{ height: '72vh' }}>
                    {/* Conversation List */}
                    <div className="w-72 shrink-0 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Conversations</p>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                    <MessageCircle className="w-10 h-10 text-slate-200 mb-2" />
                                    <p className="text-slate-400 text-sm">No conversations yet</p>
                                </div>
                            ) : (
                                conversations.map((c: any) => (
                                    <button key={c.id} onClick={() => router.get(route('admin.messages.show', c.id))}
                                        className={`w-full flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left ${activeParent?.id === c.id ? 'bg-blue-50/60' : ''}`}>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-sm">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <p className="text-sm font-semibold text-slate-700 truncate">{c.name}</p>
                                                {c.last_at && <p className="text-[10px] text-slate-400 shrink-0">{fmtShort(c.last_at)}</p>}
                                            </div>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">{c.last_message ?? 'No messages yet'}</p>
                                        </div>
                                        {c.unread > 0 && (
                                            <span className="shrink-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {c.unread > 9 ? '9+' : c.unread}
                                            </span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Panel */}
                    <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                        {!activeParent ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <MessageCircle className="w-14 h-14 text-slate-200 mb-3" />
                                <p className="text-slate-400 font-medium">Select a conversation</p>
                                <p className="text-slate-300 text-sm mt-1">Choose a parent from the list to start messaging</p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{activeParent.name}</p>
                                        <p className="text-xs text-slate-400">Parent</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                                    {messages?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <p className="text-slate-400 text-sm">No messages yet. Say hello!</p>
                                        </div>
                                    ) : (
                                        messages?.map((msg: any) => {
                                            const isMe = msg.sender?.role === 'admin';
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                                        isMe
                                                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-br-sm'
                                                            : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                                                    }`}>
                                                        <p className="leading-relaxed">{msg.body}</p>
                                                        <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>{fmt(msg.created_at)}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-slate-100 flex items-end gap-3">
                                    <textarea
                                        value={data.body}
                                        onChange={e => setData('body', e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                                        placeholder="Type a message... (Enter to send)"
                                        rows={1}
                                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                    />
                                    <button type="submit" disabled={processing || !data.body.trim()}
                                        className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow hover:shadow-md transition-all disabled:opacity-40">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
