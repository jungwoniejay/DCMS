import ParentLayout from '@/layouts/parent-layout';
import { Head, useForm } from '@inertiajs/react';
import { Send, MessageCircle, ShieldCheck, Paperclip, Image, X, FileText, Smile } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const EMOJIS = ['😊','😂','❤️','👍','🙏','😢','😮','🎉','🔥','👏','😍','🤔','😅','💪','✅','🙌','😭','💯','🥰','😁'];

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [preview, setPreview] = useState<{ url: string; type: 'image' | 'file'; name: string } | null>(null);
    const [dragging, setDragging] = useState(false);

    const { data, setData, post, processing, reset } = useForm<any>({ body: '', attachment: null as File | null });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Close emoji picker on outside click
    useEffect(() => {
        if (!showEmoji) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('#emoji-panel') && !target.closest('#emoji-btn')) setShowEmoji(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showEmoji]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.body.trim() && !data.attachment) return;
        post(route('parent.messages.send'), {
            forceFormData: true,
            onSuccess: () => { reset(); setPreview(null); },
        });
    };

    const attachFile = (file: File) => {
        setData('attachment', file);
        const isImage = file.type.startsWith('image/');
        if (isImage) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview({ url: reader.result as string, type: 'image', name: file.name });
            reader.readAsDataURL(file);
        } else {
            setPreview({ url: '', type: 'file', name: file.name });
        }
    };

    const removeAttachment = () => { setData('attachment', null); setPreview(null); };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) attachFile(file);
    };

    const insertEmoji = (emoji: string) => {
        const ta = textareaRef.current;
        if (!ta) { setData('body', data.body + emoji); return; }
        const start = ta.selectionStart ?? data.body.length;
        const end = ta.selectionEnd ?? data.body.length;
        const newVal = data.body.slice(0, start) + emoji + data.body.slice(end);
        setData('body', newVal);
        setTimeout(() => { ta.focus(); ta.setSelectionRange(start + emoji.length, start + emoji.length); }, 0);
    };

    const fmt = (d: string) => new Date(d).toLocaleString('en-PH', { hour: '2-digit', minute: '2-digit' });

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

                <div
                    className={`bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-colors ${dragging ? 'border-sky-400 bg-sky-50/40' : 'border-slate-100'}`}
                    style={{ height: '72vh' }}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                >
                    {/* Header */}
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-sky-50 to-teal-50 shrink-0">
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

                    {/* Drag overlay hint */}
                    {dragging && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                            <div className="bg-sky-500/90 text-white px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg flex items-center gap-2">
                                <Paperclip className="w-4 h-4" /> Drop file to attach
                            </div>
                        </div>
                    )}

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
                                                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-gradient-to-br from-sky-500 to-teal-500 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'}`}>
                                                            {msg.body && <p className="leading-relaxed whitespace-pre-wrap">{msg.body}</p>}
                                                            {msg.attachment_url && msg.attachment_type === 'image' && (
                                                                <a href={msg.attachment_url} target="_blank" rel="noreferrer" className={msg.body ? 'mt-2 block' : ''}>
                                                                    <img src={msg.attachment_url} alt="attachment" className="max-w-[220px] rounded-xl border border-white/20 shadow" />
                                                                </a>
                                                            )}
                                                            {msg.attachment_url && msg.attachment_type === 'file' && (
                                                                <a href={msg.attachment_url} target="_blank" rel="noreferrer"
                                                                    className={`flex items-center gap-2 mt-1 px-3 py-2 rounded-xl text-xs font-medium ${isMe ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} transition-colors`}>
                                                                    <FileText className="w-4 h-4 shrink-0" />
                                                                    <span className="truncate max-w-[160px]">{msg.attachment.split('/').pop()}</span>
                                                                </a>
                                                            )}
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

                    {/* Attachment preview */}
                    {preview && (
                        <div className="px-4 pt-2 pb-0 bg-white border-t border-slate-100 shrink-0">
                            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 w-fit max-w-full">
                                {preview.type === 'image'
                                    ? <img src={preview.url} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                                    : <div className="w-12 h-12 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center"><FileText className="w-5 h-5 text-sky-500" /></div>
                                }
                                <span className="text-xs text-slate-600 font-medium truncate max-w-[180px]">{preview.name}</span>
                                <button type="button" onClick={removeAttachment} className="ml-1 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
                        <div className="flex items-end gap-2">
                            {/* Attachment buttons */}
                            <div className="flex gap-1 pb-1">
                                <button type="button" onClick={() => imageInputRef.current?.click()}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"
                                    title="Send image">
                                    <Image className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => fileInputRef.current?.click()}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"
                                    title="Attach file">
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                {/* Emoji button */}
                                <div className="relative">
                                    <button id="emoji-btn" type="button" onClick={() => setShowEmoji(v => !v)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
                                        title="Emoji">
                                        <Smile className="w-4 h-4" />
                                    </button>
                                    {showEmoji && (
                                        <div id="emoji-panel" className="absolute bottom-10 left-0 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-56">
                                            <div className="grid grid-cols-5 gap-1">
                                                {EMOJIS.map(e => (
                                                    <button key={e} type="button" onClick={() => insertEmoji(e)}
                                                        className="text-xl hover:bg-slate-100 rounded-lg p-1 transition-colors leading-none">
                                                        {e}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <textarea
                                ref={textareaRef}
                                value={data.body}
                                onChange={e => setData('body', e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                                placeholder="Type a message… (Enter to send)"
                                rows={1}
                                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white resize-none transition-colors"
                            />
                            <button type="submit" disabled={processing || (!data.body.trim() && !data.attachment)}
                                className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white flex items-center justify-center shadow hover:shadow-md hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100 pb-1">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Hidden file inputs */}
                        <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) attachFile(f); e.target.value = ''; }} />
                        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) attachFile(f); e.target.value = ''; }} />
                    </form>
                </div>
            </div>
        </ParentLayout>
    );
}
