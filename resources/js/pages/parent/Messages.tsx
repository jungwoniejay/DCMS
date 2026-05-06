import ParentLayout from '@/layouts/parent-layout';
import { Head, useForm } from '@inertiajs/react';
import { Send, MessageCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Messages({ messages, admin }: any) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { data, setData, post, processing, reset } = useForm({ body: '' });
    const me = (window as any).__page?.props?.auth?.user?.id;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.body.trim()) return;
        post(route('parent.messages.send'), { onSuccess: () => reset() });
    };

    const fmt = (d: string) => new Date(d).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <ParentLayout>
            <Head title="Messages" />
            <div className="max-w-2xl mx-auto space-y-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
                    <p className="text-slate-500 text-sm mt-1">Direct conversation with the Day Care admin</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm flex flex-col" style={{ height: '65vh' }}>
                    {/* Header */}
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center shadow">
                            <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{admin?.name ?? 'Day Care Admin'}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <MessageCircle className="w-12 h-12 text-slate-200 mb-3" />
                                <p className="text-slate-400 text-sm font-medium">No messages yet</p>
                                <p className="text-slate-300 text-xs mt-1">Send a message to the admin below</p>
                            </div>
                        ) : (
                            messages.map((msg: any) => {
                                const isMe = msg.sender_id !== admin?.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                            isMe
                                                ? 'bg-gradient-to-br from-sky-500 to-teal-500 text-white rounded-br-sm'
                                                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                                        }`}>
                                            <p className="leading-relaxed">{msg.body}</p>
                                            <p className={`text-[10px] mt-1 ${isMe ? 'text-sky-100' : 'text-slate-400'}`}>{fmt(msg.created_at)}</p>
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
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                        />
                        <button type="submit" disabled={processing || !data.body.trim()}
                            className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white flex items-center justify-center shadow hover:shadow-md transition-all disabled:opacity-40">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </ParentLayout>
    );
}
