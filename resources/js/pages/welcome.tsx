import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users, Heart, TrendingUp, Shield, CheckCircle, ArrowRight, Baby, BookOpen, Activity, Sparkles, X, MessageCircle, ClipboardList } from 'lucide-react';
import DaycareLogo from '@/components/daycare-logo';
import CookieConsent from '@/components/cookie-consent';
import { useState } from 'react';

interface Props extends SharedData {
    contents: Record<string, { value: string }>;
}

export default function Welcome() {
    const { auth, contents } = usePage<Props>().props;
    const [showModal, setShowModal] = useState(false);

    const c = (key: string, fallback = '') => contents?.[key]?.value || fallback;

    return (
        <>
            <Head title="KidCare Hinoba-an — Child Development Management">
                <meta name="description" content="Barangay Child Development Data Management System — digitizing CDC records for better child care." />
            </Head>

            <div className="min-h-screen bg-white">

                {/* ── Nav ── */}
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <DaycareLogo className="w-9 h-9" />
                            <span className="text-xl font-bold text-slate-800">KidCare Hinoba-an</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link href={route('dashboard')}
                                    className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-teal-200 hover:shadow-lg transition-all">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}
                                        className="px-5 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors">
                                        Sign In
                                    </Link>
                                    <button onClick={() => setShowModal(true)}
                                        className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-teal-200 hover:shadow-lg hover:scale-105 transition-all">
                                        Get Started
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ── Hero ── */}
                <section className="pt-32 pb-24 px-6 relative overflow-hidden"
                    style={{ background: 'linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 40%, #f0fdf4 100%)' }}>
                    {/* Blobs */}
                    <div className="absolute top-10 left-10 w-80 h-80 bg-sky-200 rounded-full blur-3xl opacity-40 animate-blob" />
                    <div className="absolute top-32 right-10 w-72 h-72 bg-teal-200 rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000" />
                    <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-blob animation-delay-4000" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left copy */}
                            <div className="animate-fade-in-up">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-full text-sm font-semibold mb-6 border border-sky-200">
                                    <Sparkles className="w-4 h-4" />
                                    Barangay 2 Hinoba-an · Day Care Management
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                                    {c('hero_title', 'Empowering Child Development in Your Barangay')}
                                </h1>
                                <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
                                    {c('hero_subtitle', 'A comprehensive digital platform for managing Child Development Center records, health monitoring, and family profiles with ease and efficiency.')}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button onClick={() => setShowModal(true)}
                                        className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-2xl font-semibold shadow-xl shadow-teal-200 hover:shadow-2xl hover:scale-105 transition-all">
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <Link href={route('login')}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold border border-slate-200 hover:border-teal-300 hover:text-teal-600 shadow-sm hover:shadow-md transition-all">
                                        Sign In
                                    </Link>
                                </div>
                            </div>

                            {/* Right illustration */}
                            <div className="relative animate-fade-in-right">
                                <div className="relative w-full h-[480px] rounded-3xl overflow-hidden shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 50%, #10b981 100%)' }}>
                                    {/* Grid overlay */}
                                    <div className="absolute inset-0 opacity-10"
                                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                                    {/* Floating cards */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-72 h-72">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-float z-10">
                                                <Baby className="w-14 h-14 text-teal-500" />
                                            </div>
                                            {[
                                                { icon: Heart,     color: 'text-rose-400',   pos: 'top-0 left-1/2 -translate-x-1/2',   delay: 'animation-delay-1000' },
                                                { icon: Activity,  color: 'text-sky-400',    pos: 'bottom-0 left-1/2 -translate-x-1/2', delay: 'animation-delay-2000' },
                                                { icon: BookOpen,  color: 'text-violet-400', pos: 'top-1/2 left-0 -translate-y-1/2',    delay: 'animation-delay-3000' },
                                                { icon: TrendingUp,color: 'text-amber-400',  pos: 'top-1/2 right-0 -translate-y-1/2',   delay: 'animation-delay-4000' },
                                            ].map(({ icon: Icon, color, pos, delay }) => (
                                                <div key={color} className={`absolute ${pos} w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-float ${delay}`}>
                                                    <Icon className={`w-8 h-8 ${color}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom stat strip */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20 px-6 py-4 flex justify-around">
                                        {[
                                            { label: 'Children', value: 'Enrolled' },
                                            { label: 'Health', value: 'Monitored' },
                                            { label: 'Families', value: 'Connected' },
                                        ].map(s => (
                                            <div key={s.label} className="text-center">
                                                <p className="text-white font-bold text-sm">{s.value}</p>
                                                <p className="text-white/60 text-xs">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Decorative accents */}
                                <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl shadow-xl animate-float animation-delay-1000" />
                                <div className="absolute -top-5 -right-5 w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl shadow-xl animate-bounce-slow" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Features ── */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-4 border border-teal-100">Features</span>
                            <h2 className="text-4xl font-bold text-slate-800 mb-4">Everything you need</h2>
                            <p className="text-slate-500 text-lg max-w-xl mx-auto">A complete toolkit for managing child development programs in your barangay</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Users,         title: c('feature_1_title', 'Child Registration'),  desc: c('feature_1_description', 'Complete profile management with guardian information'),          grad: 'from-sky-400 to-blue-500'     },
                                { icon: Heart,         title: c('feature_2_title', 'Health Monitoring'),   desc: c('feature_2_description', 'Track vaccinations, health assessments, and medical records'),    grad: 'from-rose-400 to-pink-500'    },
                                { icon: TrendingUp,    title: c('feature_3_title', 'Growth Tracking'),     desc: c('feature_3_description', 'Monitor nutrition status and developmental progress'),             grad: 'from-teal-400 to-emerald-500' },
                                { icon: Shield,        title: 'Secure & Private',                          desc: 'Role-based access control with full data protection',                                        grad: 'from-violet-400 to-indigo-500' },
                            ].map((f, i) => (
                                <div key={i} className="group bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${f.grad} rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                                        <f.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Benefits ── */}
                <section className="py-24 px-6" style={{ background: 'linear-gradient(160deg, #f8fafc 0%, #f0f9ff 100%)' }}>
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-sky-50 text-sky-700 rounded-full text-sm font-semibold mb-6 border border-sky-100">Why KidCare</span>
                                <h2 className="text-4xl font-bold text-slate-800 mb-8">Built for barangay day care centers</h2>
                                <div className="space-y-4">
                                    {[
                                        'Digitize paper-based CDC forms instantly',
                                        'Real-time health and nutrition monitoring',
                                        'Automated vaccination tracking',
                                        'Secure parent portal access',
                                        'Comprehensive reporting and analytics',
                                        'Easy enrollment management',
                                    ].map((b, i) => (
                                        <div key={i} className="flex items-center gap-3 group">
                                            <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 group-hover:bg-teal-500 transition-colors">
                                                <CheckCircle className="w-4 h-4 text-teal-500 group-hover:text-white transition-colors" />
                                            </div>
                                            <span className="text-slate-600 group-hover:text-teal-700 transition-colors">{b}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA card */}
                            <div className="relative">
                                <div className="rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 60%, #10b981 100%)' }}>
                                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full" />
                                    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full" />
                                    <div className="relative z-10">
                                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                            <Sparkles className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
                                        <p className="text-white/70 text-lg mb-8">
                                            Join us in transforming child development management in your barangay.
                                        </p>
                                        <button onClick={() => setShowModal(true)}
                                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-teal-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                            Create Free Account <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="bg-slate-900 text-white">
                    <div className="h-12 bg-gradient-to-b from-slate-50 to-slate-900" />
                    <div className="max-w-7xl mx-auto px-6 pb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
                            <div className="lg:col-span-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <DaycareLogo className="w-9 h-9" />
                                    <span className="text-lg font-bold">KidCare Hinoba-an</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {c('footer_tagline', 'Barangay Child Development Data Management System — digitizing CDC records for better child care.')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Links</p>
                                <ul className="space-y-2.5">
                                    {[{ label: 'Home', href: '/' }, { label: 'Sign In', href: route('login') }, { label: 'Register', href: route('register') }].map(l => (
                                        <li key={l.label}>
                                            <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                                                <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-teal-400 transition-colors" />{l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Legal</p>
                                <ul className="space-y-2.5">
                                    {[{ label: 'Privacy Policy', href: '/privacy-policy' }, { label: 'Terms & Conditions', href: '/privacy-policy#terms' }, { label: 'Cookie Policy', href: '/privacy-policy#cookies' }].map(l => (
                                        <li key={l.label}>
                                            <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                                                <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-violet-400 transition-colors" />{l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Contact</p>
                                <ul className="space-y-3">
                                    {[
                                        { icon: '📍', text: c('footer_address', '') },
                                        { icon: '📞', text: c('footer_phone', '') },
                                        { icon: '✉️', text: c('footer_email', '') },
                                        { icon: '🕐', text: c('footer_hours', '') },
                                    ].filter(x => x.text).map(x => (
                                        <li key={x.text} className="flex items-start gap-2.5">
                                            <span className="shrink-0 mt-0.5">{x.icon}</span>
                                            <span className="text-sm text-slate-400">{x.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-slate-500">
                                {c('footer_copyright', `© ${new Date().getFullYear()} KidCare Hinoba-an. All rights reserved.`)}
                            </p>
                            <div className="flex items-center gap-6">
                                {[{ label: 'Privacy Policy', href: '/privacy-policy' }, { label: 'Terms', href: '/privacy-policy#terms' }].map(l => (
                                    <Link key={l.label} href={l.href} className="text-xs text-slate-500 hover:text-white transition-colors">{l.label}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>

                <CookieConsent />

                {/* ── Auth Modal ── */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-fade-in-up">
                            <div className="flex flex-col md:flex-row">
                                {/* Sign In side */}
                                <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-slate-100">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
                                            <p className="text-slate-500 text-sm">Sign in to your account</p>
                                        </div>
                                        <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <Link href={route('login')}
                                        className="block w-full py-3 text-center bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl font-semibold shadow-md shadow-teal-200 hover:shadow-lg hover:scale-[1.02] transition-all">
                                        Sign In
                                    </Link>
                                    <div className="mt-6 space-y-2.5">
                                        {['Your dashboard and profile', 'Child development records', 'Health and nutrition tracking'].map(t => (
                                            <div key={t} className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />{t}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Register side */}
                                <div className="flex-1 p-8 md:p-10 bg-gradient-to-br from-sky-50 to-teal-50">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-1">Create account</h2>
                                        <p className="text-slate-500 text-sm">Join our community today</p>
                                    </div>
                                    <Link href={route('register')}
                                        className="block w-full py-3 text-center bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold shadow-md shadow-emerald-200 hover:shadow-lg hover:scale-[1.02] transition-all">
                                        Sign Up Free
                                    </Link>
                                    <div className="mt-6 space-y-2.5">
                                        {['Enroll your children', 'Track growth and development', 'Access health records', 'Receive important updates'].map(t => (
                                            <div key={t} className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />{t}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
