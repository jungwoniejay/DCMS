import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import DaycareLogo from '@/components/daycare-logo';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const ic = 'w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all';

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen flex">
                {/* Left panel */}
                <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-10 rounded-full -ml-40 -mb-40" />
                    <div className="relative z-10 text-white max-w-lg">
                        <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
                        <p className="text-green-50 text-lg mb-8">
                            Create your account and start managing child development records efficiently and securely.
                        </p>
                        <div className="space-y-4">
                            {['Quick and easy registration', 'Secure parent portal access', "Track your child's progress"].map(t => (
                                <div key={t} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                                    <span>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="flex-1 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md">
                        <Link href={route('welcome')} className="flex items-center gap-3 mb-8">
                            <DaycareLogo className="w-12 h-12" />
                            <span className="text-2xl font-bold text-gray-900">KidCare Hinoba-an</span>
                        </Link>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                            <p className="text-gray-600">Sign up as a parent / guardian to get started</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input id="name" type="text" required autoFocus value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Juan Dela Cruz" className={ic} />
                                </div>
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input id="email" type="email" required value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="your@email.com" className={ic} />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input id="password" type="password" required value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••" className={ic} />
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input id="password_confirmation" type="password" required value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••" className={ic} />
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6">
                                {processing ? (
                                    <><LoaderCircle className="w-5 h-5 animate-spin" /> Creating account...</>
                                ) : (
                                    <>Create Account <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link href={route('login')} className="text-green-600 hover:text-green-700 font-semibold">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
