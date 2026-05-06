import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, ArrowRight, Eye, EyeOff, Baby, Heart, Activity, Shield } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';
import DaycareLogo from '@/components/daycare-logo';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPw, setShowPw] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: (page) => {
                window.location.href = (page.props.auth as any)?.user?.role === 'admin'
                    ? '/admin/dashboard' : '/parent/dashboard';
            },
        });
    };

    return (
        <>
            <Head title="Sign In" />
            <div className="min-h-screen flex bg-slate-50">

                {/* ── Left illustrated panel ── */}
                <div className="hidden lg:flex w-[52%] relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 50%, #10b981 100%)' }}>

                    {/* Blobs */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/5" />

                    <div className="relative z-10 flex flex-col justify-center px-16 py-12 w-full">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-16">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <DaycareLogo className="w-8 h-8" />
                            </div>
                            <span className="text-white font-bold text-xl">KidCare Hinoba-an</span>
                        </div>

                        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
                            Caring for<br />every child,<br />
                            <span className="text-white/70">every day.</span>
                        </h1>
                        <p className="text-white/70 text-lg mb-12 max-w-sm">
                            A complete day care management system for Barangay 2 Hinoba-an.
                        </p>

                        {/* Floating stat cards */}
                        <div className="space-y-3 max-w-xs">
                            {[
                                { icon: Baby,     color: 'bg-sky-400/30',   label: 'Children Enrolled',   value: 'Tracked & Monitored' },
                                { icon: Heart,    color: 'bg-teal-400/30',  label: 'Health Records',       value: 'Always Up to Date'   },
                                { icon: Activity, color: 'bg-emerald-400/30', label: 'Growth & Nutrition', value: 'Visualized Clearly'  },
                                { icon: Shield,   color: 'bg-cyan-400/30',  label: 'Secure & Private',     value: 'Data Protected'      },
                            ].map(({ icon: Icon, color, label, value }) => (
                                <div key={label} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold">{label}</p>
                                        <p className="text-white/60 text-xs">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right form panel ── */}
                <div className="flex-1 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md">

                        {/* Mobile logo */}
                        <Link href={route('welcome')} className="flex items-center gap-3 mb-10 lg:hidden">
                            <DaycareLogo className="w-10 h-10" />
                            <span className="text-xl font-bold text-slate-800">KidCare Hinoba-an</span>
                        </Link>

                        <div className="mb-8">
                            <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-2">Welcome back</p>
                            <h2 className="text-3xl font-bold text-slate-800">Sign in to your account</h2>
                            <p className="text-slate-500 mt-2 text-sm">Enter your credentials to access the portal</p>
                        </div>

                        {status && (
                            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                    <input id="email" type="email" required autoFocus
                                        value={data.email} onChange={e => setData('email', e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white focus:border-transparent transition-all text-sm" />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="text-xs text-teal-600 hover:text-teal-700 font-semibold">
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                    <input id="password" type={showPw ? 'text' : 'password'} required
                                        value={data.password} onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-11 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white focus:border-transparent transition-all text-sm" />
                                    <button type="button" onClick={() => setShowPw(p => !p)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Remember */}
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input type="checkbox" checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-teal-500 focus:ring-teal-400 accent-teal-500" />
                                <span className="text-sm text-slate-600">Remember me for 30 days</span>
                            </label>

                            <button type="submit" disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 mt-2">
                                {processing
                                    ? <><LoaderCircle className="w-5 h-5 animate-spin" /> Signing in...</>
                                    : <>Sign In <ArrowRight className="w-4 h-4" /></>
                                }
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="text-teal-600 hover:text-teal-700 font-semibold">
                                Create one free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
