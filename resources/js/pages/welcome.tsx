import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users, Heart, TrendingUp, Shield, CheckCircle, ArrowRight, Baby, BookOpen, Activity, Sparkles, X } from 'lucide-react';
import DaycareLogo from '@/components/daycare-logo';
import CookieConsent from '@/components/cookie-consent';
import { useState } from 'react';

interface WelcomeContent {
    id: number;
    key: string;
    value: string;
    type: string;
}

interface Props extends SharedData {
    contents: Record<string, WelcomeContent>;
}

export default function Welcome() {
    const { auth, contents } = usePage<Props>().props;
    const [showAuthModal, setShowAuthModal] = useState(false);

    const getContent = (key: string, fallback: string = '') => {
        return contents?.[key]?.value || fallback;
    };

    return (
        <>
            <Head title="Welcome to Brgy2DMS">
                <meta name="description" content="Barangay Child Development Data Management System — digitizing CDC records for better child care in your barangay." />
                <meta name="keywords" content="barangay, child development, CDC, daycare, health monitoring, nutrition tracking" />
                <meta property="og:title" content="Brgy2DMS — Child Development Management" />
                <meta property="og:description" content="A comprehensive digital platform for managing Child Development Center records, health monitoring, and family profiles." />
            </Head>
            <div className="min-h-screen bg-white">
                {/* Navigation */}
                <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <DaycareLogo className="w-10 h-10" />
                            <span className="text-2xl font-display font-bold text-gray-900">Brgy2DMS</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold text-sm shadow-lg shadow-green-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold text-sm shadow-lg shadow-green-200"
                                >
                                    Sign Up
                                </button>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="animate-fade-in-up">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-sm font-semibold mb-6 border border-green-200">
                                    <Sparkles className="w-4 h-4" />
                                    Child Development Management System
                                </div>
                                <h1 className="text-6xl font-display font-bold text-gray-900 mb-6 leading-tight">
                                    {getContent('hero_title', 'Empowering Child Development in Your Barangay')}
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    {getContent('hero_subtitle', 'A comprehensive digital platform for managing Child Development Center records, health monitoring, and family profiles with ease and efficiency.')}
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowAuthModal(true)}
                                        className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-xl shadow-green-200 flex items-center gap-2 transform hover:scale-105"
                                    >
                                        Get Started
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                            <div className="relative animate-fade-in-right">
                                {/* Main Illustration Card */}
                                <div className="relative w-full h-[500px] bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 rounded-3xl shadow-2xl overflow-hidden">
                                    {/* Decorative Grid */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="grid grid-cols-8 grid-rows-8 h-full">
                                            {[...Array(64)].map((_, i) => (
                                                <div key={i} className="border border-green-300"></div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Floating Icons */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-64 h-64">
                                            {/* Center Icon */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center animate-float">
                                                <Baby className="w-16 h-16 text-green-500" />
                                            </div>
                                            
                                            {/* Orbiting Icons */}
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-float animation-delay-1000">
                                                <Heart className="w-10 h-10 text-red-400" />
                                            </div>
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-float animation-delay-2000">
                                                <Activity className="w-10 h-10 text-blue-400" />
                                            </div>
                                            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-float animation-delay-3000">
                                                <BookOpen className="w-10 h-10 text-purple-400" />
                                            </div>
                                            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-float animation-delay-4000">
                                                <TrendingUp className="w-10 h-10 text-yellow-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Decorative Elements */}
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl shadow-xl animate-pulse"></div>
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl shadow-xl animate-bounce-slow"></div>
                                <div className="absolute top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl shadow-lg animate-spin-slow"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                                Features
                            </div>
                            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
                                Comprehensive Features
                            </h2>
                            <p className="text-xl text-gray-600">
                                Everything you need to manage child development programs
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Users, title: getContent('feature_1_title', 'Child Registration'), desc: getContent('feature_1_description', 'Complete profile management with guardian information'), color: 'from-blue-400 to-blue-600' },
                                { icon: Heart, title: getContent('feature_2_title', 'Health Monitoring'), desc: getContent('feature_2_description', 'Track vaccinations, health assessments, and medical records'), color: 'from-red-400 to-pink-600' },
                                { icon: TrendingUp, title: getContent('feature_3_title', 'Growth Tracking'), desc: getContent('feature_3_description', 'Monitor nutrition status and developmental progress'), color: 'from-green-400 to-emerald-600' },
                                { icon: Shield, title: 'Secure & Private', desc: 'Role-based access with data protection', color: 'from-purple-400 to-indigo-600' },
                            ].map((feature, idx) => (
                                <div key={idx} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 px-6 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                    </div>
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
                                    Why Choose Us
                                </div>
                                <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                                    Why Choose Brgy2DMS?
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        'Digitize paper-based CDC forms',
                                        'Real-time health and nutrition monitoring',
                                        'Automated vaccination tracking',
                                        'Secure parent portal access',
                                        'Comprehensive reporting and analytics',
                                        'Easy enrollment management',
                                    ].map((benefit, idx) => (
                                        <div key={idx} className="flex items-center gap-3 group">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                                                <CheckCircle className="w-5 h-5 text-green-500 group-hover:text-white transition-colors duration-300" />
                                            </div>
                                            <span className="text-lg text-gray-700 group-hover:text-green-600 transition-colors duration-300">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden">
                                    {/* Decorative circles */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                            <Sparkles className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-display font-bold mb-6">Ready to Get Started?</h3>
                                        <p className="text-green-50 text-lg mb-8">
                                            Join us in transforming child development management in your barangay.
                                        </p>
                                        <button
                                            onClick={() => setShowAuthModal(true)}
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold shadow-xl transform hover:scale-105"
                                        >
                                            Create Account
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white">
                    <div className="h-16 bg-gradient-to-b from-white to-gray-900" />

                    <div className="max-w-7xl mx-auto px-6 pb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">

                            {/* Brand */}
                            <div className="lg:col-span-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <DaycareLogo className="w-10 h-10" />
                                    <span className="text-xl font-bold text-white">Brgy2DMS</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {getContent('footer_tagline', 'Barangay Child Development Data Management System — digitizing CDC records for better child care.')}
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Links</p>
                                <ul className="space-y-2.5">
                                    {[
                                        { label: 'Home', href: '/' },
                                        { label: 'Sign In', href: route('login') },
                                        { label: 'Register', href: route('register') },
                                    ].map((l) => (
                                        <li key={l.label}>
                                            <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group">
                                                <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors duration-200" />
                                                {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Legal & Privacy</p>
                                <ul className="space-y-2.5">
                                    {[
                                        { label: 'Privacy Policy', href: '/privacy-policy' },
                                        { label: 'Terms & Conditions', href: '/privacy-policy#terms' },
                                        { label: 'Cookie Policy', href: '/privacy-policy#cookies' },
                                    ].map((l) => (
                                        <li key={l.label}>
                                            <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group">
                                                <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-purple-400 transition-colors duration-200" />
                                                {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Contact</p>
                                <ul className="space-y-3">
                                    {[
                                        { icon: '📍', text: getContent('footer_address', '') },
                                        { icon: '📞', text: getContent('footer_phone', '') },
                                        { icon: '✉️', text: getContent('footer_email', '') },
                                        { icon: '🕐', text: getContent('footer_hours', '') },
                                    ].filter(c => c.text).map((c) => (
                                        <li key={c.text} className="flex items-start gap-2.5">
                                            <span className="text-base shrink-0 mt-0.5">{c.icon}</span>
                                            <span className="text-sm text-gray-400">{c.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-500">
                                {getContent('footer_copyright', `© ${new Date().getFullYear()} Brgy2DMS. All rights reserved.`)}
                            </p>
                            <div className="flex items-center gap-6">
                                <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-white transition-colors duration-200">Privacy Policy</Link>
                                <Link href="/privacy-policy#terms" className="text-xs text-gray-500 hover:text-white transition-colors duration-200">Terms of Service</Link>
                                <Link href="/privacy-policy#cookies" className="text-xs text-gray-500 hover:text-white transition-colors duration-200">Cookie Policy</Link>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* Cookie Consent */}
                <CookieConsent />

                {/* Auth Modal */}
                {showAuthModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in-up">
                            <div className="flex flex-col md:flex-row">
                                {/* Left Side - Login */}
                                <div className="flex-1 p-8 md:p-12 border-r border-gray-100">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                                            <p className="text-gray-600 text-sm">Sign in to your account</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAuthModal(false)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    
                                    <Link
                                        href={route('login')}
                                        className="block w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-center shadow-lg shadow-blue-200"
                                    >
                                        Sign In
                                    </Link>
                                    
                                    <div className="mt-6">
                                        <p className="text-sm text-gray-600 mb-4">Sign in to access:</p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="w-3 h-3 text-blue-600" />
                                                </div>
                                                <span>Your dashboard and profile</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="w-3 h-3 text-blue-600" />
                                                </div>
                                                <span>Child development records</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="w-3 h-3 text-blue-600" />
                                                </div>
                                                <span>Health and nutrition tracking</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Register */}
                                <div className="flex-1 p-8 md:p-12 bg-gradient-to-br from-green-50 to-emerald-50">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                                        <p className="text-gray-600 text-sm">Join our community today</p>
                                    </div>
                                    
                                    <Link
                                        href={route('register')}
                                        className="block w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold text-center shadow-lg shadow-green-200"
                                    >
                                        Sign Up
                                    </Link>
                                    
                                    <div className="mt-6">
                                        <p className="text-sm text-gray-600 mb-4">Create an account to:</p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                                </div>
                                                <span>Enroll your children</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                                </div>
                                                <span>Track growth and development</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                                </div>
                                                <span>Access health records</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                                </div>
                                                <span>Receive important updates</span>
                                            </div>
                                        </div>
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
