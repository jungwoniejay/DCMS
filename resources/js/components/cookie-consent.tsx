import { useState, useEffect } from 'react';
import { Cookie, Shield, BarChart3, Settings2, ChevronDown, ChevronUp, X, ExternalLink } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface CookiePrefs {
    essential: boolean;
    analytics: boolean;
    optional: boolean;
}

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);
    const [showPrefs, setShowPrefs] = useState(false);
    const [prefs, setPrefs] = useState<CookiePrefs>({
        essential: true,
        analytics: false,
        optional: false,
    });

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
    }, []);

    const save = (accepted: boolean) => {
        setVisible(false);
    };

    const saveCustom = () => {
        setVisible(false);
    };

    if (!visible) return null;

    const cookieTypes = [
        {
            key: 'essential' as keyof CookiePrefs,
            icon: Shield,
            label: 'Essential Cookies',
            desc: 'Required for the website to function. Cannot be disabled.',
            locked: true,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            key: 'analytics' as keyof CookiePrefs,
            icon: BarChart3,
            label: 'Analytics Cookies',
            desc: 'Help us understand how visitors interact with our site.',
            locked: false,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
        },
        {
            key: 'optional' as keyof CookiePrefs,
            icon: Settings2,
            label: 'Optional Cookies',
            desc: 'Enhance your experience with personalized features.',
            locked: false,
            color: 'text-pink-500',
            bg: 'bg-pink-50',
        },
    ];

    return (
        <div className="fixed inset-0 z-[999] flex items-end justify-center p-4 sm:p-6 pointer-events-none">
            <div
                className="w-full max-w-2xl pointer-events-auto animate-slide-up"
                style={{
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 8px 40px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                }}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-5 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-md shadow-purple-200">
                            <Cookie className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800">We use cookies 🍪</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Your privacy matters to us</p>
                        </div>
                    </div>
                    <button
                        onClick={() => save(false)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Divider */}
                <div className="mx-5 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                {/* Body */}
                <div className="p-5 pt-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        We use cookies to improve your experience on Brgy2DMS, analyze site usage, and provide personalized features.
                        Your data is handled with care and never sold to third parties.{' '}
                        <Link
                            href="/privacy-policy"
                            className="inline-flex items-center gap-1 text-blue-500 hover:text-purple-600 font-medium transition-colors duration-200 underline underline-offset-2"
                        >
                            View Privacy Policy <ExternalLink className="w-3 h-3" />
                        </Link>
                    </p>

                    {/* Customize Preferences Toggle */}
                    <button
                        onClick={() => setShowPrefs(!showPrefs)}
                        className="flex items-center gap-2 mt-3 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors duration-200 group"
                    >
                        <Settings2 className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                        Customize Preferences
                        {showPrefs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Cookie Preferences Panel */}
                    {showPrefs && (
                        <div className="mt-3 space-y-2 animate-fade-in">
                            {cookieTypes.map((type) => (
                                <div
                                    key={type.key}
                                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all duration-200"
                                    style={{ background: 'rgba(255,255,255,0.6)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-xl ${type.bg} flex items-center justify-center shrink-0`}>
                                            <type.icon className={`w-4 h-4 ${type.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-700">{type.label}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{type.desc}</p>
                                        </div>
                                    </div>
                                    {/* Toggle */}
                                    <button
                                        disabled={type.locked}
                                        onClick={() => setPrefs(p => ({ ...p, [type.key]: !p[type.key] }))}
                                        className={`relative shrink-0 w-10 h-5.5 rounded-full transition-all duration-300 focus:outline-none ${
                                            type.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                                        } ${prefs[type.key] ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-slate-200'}`}
                                        style={{ width: '40px', height: '22px' }}
                                    >
                                        <span
                                            className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                                                prefs[type.key] ? 'left-[18px]' : 'left-0.5'
                                            }`}
                                            style={{ width: '18px', height: '18px', top: '2px' }}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 flex flex-col sm:flex-row gap-2.5">
                    {/* Accept All */}
                    <button
                        onClick={() => save(true)}
                        className="flex-1 py-2.5 px-5 text-sm font-semibold text-white rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.45)')}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)')}
                    >
                        Accept All Cookies
                    </button>

                    {/* Save Custom / Reject */}
                    {showPrefs ? (
                        <button
                            onClick={saveCustom}
                            className="flex-1 py-2.5 px-5 text-sm font-semibold text-purple-600 rounded-2xl border border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                        >
                            Save My Preferences
                        </button>
                    ) : (
                        <button
                            onClick={() => save(false)}
                            className="flex-1 py-2.5 px-5 text-sm font-semibold text-slate-500 rounded-2xl border border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition-all duration-200"
                        >
                            Reject Non-Essential
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
