import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, User, ArrowRight, Eye, EyeOff, Baby, ClipboardList, MessageCircle, CheckCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';
import DaycareLogo from '@/components/daycare-logo';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const ic = 'w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white focus:border-transparent transition-all text-sm';

    return (
        <>
            <Head title="Create Account" />
            <div className="min-h-screen flex bg-slate-50">

                {/* ── Left form panel ── */}
                <div className="flex-1 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md">

                        {/* Mobile logo */}
                        <Link href={route('welcome')} className="flex items-center gap-3 mb-10 lg:hidden">
                            <DaycareLogo className="w-10 h-10" />
                            <span className="text-xl font-bold text-slate-800">KidCare Hinoba-an</span>
                        </Link>

                        <div className="mb-8">
                            <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-2">Parent Portal</p>
                            <h2 className="text-3xl font-bold text-slate-800">Create your account</h2>
                            <p className="text-slate-500 mt-2 text-sm">Register as a parent or guardian to enroll your child</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input id="name" type="text" required autoFocus
                                        value={data.name} onChange={e => setData('name', e.target.value)}
                                        placeholder="Juan Dela Cruz" className={ic} />
                                </div>
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input id="email" type="email" required
                                        value={data.email} onChange={e => setData('email', e.target.value)}
                                        placeholder="your@email.com" className={ic} />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input id="password" type={showPw ? 'text' : 'password'} required
                                        value={data.password} onChange={e => setData('password', e.target.value)}
                                        placeholder="Min. 8 characters"
                                        className={ic.replace('pr-4', 'pr-11')} />
                                    <button type="button" onClick={() => setShowPw(p => !p)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input id="password_confirmation" type={showConfirm ? 'text' : 'password'} required
                                        value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="Re-enter your password"
                                        className={ic.replace('pr-4', 'pr-11')} />
                                    <button type="button" onClick={() => setShowConfirm(p => !p)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 mt-2">
                                {processing
                                    ? <><LoaderCircle className="w-5 h-5 animate-spin" /> Creating account...</>
                                    : <>Create Account <ArrowRight className="w-4 h-4" /></>
                                }
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-teal-600 hover:text-teal-700 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* ── Right illustrated panel ── */}
                <div className="hidden lg:flex w-[52%] relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 50%, #6366f1 100%)' }}>

                    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col justify-center px-16 py-12 w-full">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <DaycareLogo className="w-8 h-8" />
                            </div>
                            <span className="text-white font-bold text-xl">KidCare Hinoba-an</span>
                        </div>

                        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
                            Your child's<br />journey starts<br />
                            <span className="text-white/70">here.</span>
                        </h1>
                        <p className="text-white/70 text-lg mb-12 max-w-sm">
                            Join hundreds of parents already tracking their children's health and development.
                        </p>

                        <div className="space-y-3 max-w-xs">
                            {[
                                { icon: Baby,          color: 'bg-teal-400/30',   label: 'Enroll Your Child',       value: 'Simple online process'     },
                                { icon: ClipboardList, color: 'bg-sky-400/30',    label: 'Track Development',       value: 'Health & growth records'   },
                                { icon: MessageCircle, color: 'bg-indigo-400/30', label: 'Stay Connected',          value: 'Message the day care admin' },
                                { icon: CheckCircle,   color: 'bg-emerald-400/30', label: 'Get Notified',           value: 'Appointments & updates'    },
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
            </div>
        </>
    );
}
