import { useState, useRef, useEffect } from 'react';
import { useTranslation, LANGUAGES, Language } from '@/lib/i18n';
import { ChevronDown } from 'lucide-react';

export default function LanguageSwitcher({ mini = false }: { mini?: boolean }) {
    const { lang, setLang } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const current = LANGUAGES.find(l => l.code === lang)!;

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                title={mini ? current.label : undefined}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/60 border border-white/80 text-slate-600 hover:bg-white hover:shadow-sm transition-all text-xs font-semibold ${mini ? 'justify-center' : ''}`}
            >
                <span>{current.flag}</span>
                {!mini && <span>{current.label}</span>}
                {!mini && <ChevronDown className="w-3 h-3 text-slate-400" />}
            </button>

            {open && (
                <div className="absolute bottom-full mb-1 left-0 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 min-w-[130px]">
                    {LANGUAGES.map(l => (
                        <button
                            key={l.code}
                            onClick={() => { setLang(l.code as Language); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors ${
                                lang === l.code
                                    ? 'bg-teal-50 text-teal-700 font-bold'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span className="text-base">{l.flag}</span>
                            <span>{l.label}</span>
                            {lang === l.code && <span className="ml-auto text-teal-500">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
