import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'ai';
    text: string;
    time: string;
}

const SUGGESTIONS = [
    "Are there any health risks?",
    "How is my child growing?",
    "What is the nutritional status?",
    "Give me a progress report",
    "What are the development plans?",
    "When is the next appointment?",
    "Any development tips?",
    "Show behavioral observations",
];

function formatText(text: string) {
    // Convert **bold** and bullet points to styled elements
    return text
        .split('\n')
        .map((line, i) => {
            const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            const withBullet = bold.startsWith('* ') || bold.startsWith('- ')
                ? `<span class="flex gap-1.5"><span class="text-teal-500 shrink-0">•</span><span>${bold.slice(2)}</span></span>`
                : bold;
            return `<p key="${i}" class="mb-1 last:mb-0">${withBullet}</p>`;
        })
        .join('');
}

export default function AiAssistant({ childId }: { childId?: number }) {
    const [open, setOpen]         = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            text: "Hi! I'm KidCare AI 👋 I can help you track your child's growth, development, and give personalized insights. What would you like to know?",
            time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
        }
    ]);
    const [input, setInput]       = useState('');
    const [loading, setLoading]   = useState(false);
    const [showSugg, setShowSugg] = useState(true);
    const bottomRef               = useRef<HTMLDivElement>(null);
    const inputRef                = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 300);
    }, [open]);

    const send = async (text: string) => {
        if (!text.trim() || loading) return;
        const userMsg: Message = {
            role: 'user',
            text: text.trim(),
            time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(m => [...m, userMsg]);
        setInput('');
        setShowSugg(false);
        setLoading(true);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const res = await fetch('/parent/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ message: text.trim(), child_id: childId ?? null }),
            });
            const json = await res.json();
            setMessages(m => [...m, {
                role: 'ai',
                text: json.reply ?? "I couldn't generate a response.",
                time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
            }]);
        } catch {
            setMessages(m => [...m, {
                role: 'ai',
                text: "Sorry, I couldn't connect right now. Please try again.",
                time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-sky-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
                    title="KidCare AI Assistant"
                >
                    <Sparkles className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {open && (
                <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                    style={{ height: '520px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.9)' }}>

                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-teal-500 to-sky-500 shrink-0">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white">KidCare AI</p>
                            <p className="text-[10px] text-teal-100">Powered by Gemini · Always here to help</p>
                        </div>
                        <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center shrink-0 mt-0.5">
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-br from-teal-500 to-sky-500 text-white rounded-tr-sm'
                                            : 'bg-slate-100 text-slate-700 rounded-tl-sm'
                                    }`}>
                                        {msg.role === 'ai' ? (
                                            <div dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                    <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="px-3 py-2 bg-slate-100 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                                    <Loader2 className="w-3.5 h-3.5 text-teal-500 animate-spin" />
                                    <span className="text-xs text-slate-500">Thinking...</span>
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Suggestions */}
                    {showSugg && (
                        <div className="px-4 pb-2 shrink-0">
                            <p className="text-[10px] text-slate-400 mb-1.5 font-semibold uppercase tracking-wide">Quick questions</p>
                            <div className="flex flex-wrap gap-1.5">
                                {SUGGESTIONS.map(s => (
                                    <button key={s} onClick={() => send(s)}
                                        className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 transition-colors font-medium">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-3 pb-3 pt-2 border-t border-slate-100 shrink-0">
                        <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask about your child..."
                                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                            />
                            <button type="submit" disabled={!input.trim() || loading}
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 text-white flex items-center justify-center shadow-sm hover:shadow-md transition-all disabled:opacity-40 shrink-0">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
