import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Shield, Cookie, FileText, Users, Lock, Bell, ChevronRight, ArrowLeft } from 'lucide-react';
import DaycareLogo from '@/components/daycare-logo';

const sections = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'data-collection', label: 'Data We Collect', icon: Users },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
    { id: 'data-use', label: 'How We Use Data', icon: Shield },
    { id: 'data-security', label: 'Data Security', icon: Lock },
    { id: 'your-rights', label: 'Your Rights', icon: Bell },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
];

export default function PrivacyPolicy() {
    const [active, setActive] = useState('overview');

    const scrollTo = (id: string) => {
        setActive(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <Head title="Privacy Policy & Terms — Brgy2DMS" />
            <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}>

                {/* Top Nav */}
                <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
                    style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.8)' }}>
                    <div className="flex items-center gap-3">
                        <DaycareLogo className="w-8 h-8" />
                        <span className="font-bold text-slate-800">Brgy2DMS</span>
                    </div>
                    <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </nav>

                <div className="max-w-6xl mx-auto px-4 py-10 flex gap-8">

                    {/* Sticky Sidebar */}
                    <aside className="hidden lg:block w-56 shrink-0">
                        <div className="sticky top-24 rounded-2xl p-4 space-y-1"
                            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 24px rgba(99,102,241,0.06)' }}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Contents</p>
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => scrollTo(s.id)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 text-left ${
                                        active === s.id
                                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-semibold'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                                    }`}
                                >
                                    <s.icon className={`w-3.5 h-3.5 shrink-0 ${active === s.id ? 'text-blue-500' : 'text-slate-400'}`} />
                                    {s.label}
                                    {active === s.id && <ChevronRight className="w-3 h-3 ml-auto text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 space-y-8">

                        {/* Hero */}
                        <div className="rounded-3xl p-8 text-white relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 60%, #f472b6 100%)' }}>
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">Privacy Policy & Terms</h1>
                                        <p className="text-white/70 text-sm">Last updated: March 2026</p>
                                    </div>
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed max-w-xl">
                                    We are committed to protecting your privacy and the privacy of the children in our care.
                                    This document explains how we collect, use, and protect your information.
                                </p>
                            </div>
                        </div>

                        {/* Section: Overview */}
                        <Section id="overview" icon={FileText} title="Overview" color="blue">
                            <p>Brgy2DMS (Barangay Child Development Data Management System) is committed to protecting the personal information of children, parents, and guardians registered in our system.</p>
                            <p className="mt-3">This Privacy Policy applies to all users of the Brgy2DMS platform, including administrators, parents, and guardians. By using our system, you agree to the collection and use of information in accordance with this policy.</p>
                            <InfoBox color="blue" text="This system is operated by the Barangay Child Development Center (CDC) and is intended solely for the management of child development records within the barangay." />
                        </Section>

                        {/* Section: Data Collection */}
                        <Section id="data-collection" icon={Users} title="Data We Collect" color="purple">
                            <p>We collect the following types of information to provide our services:</p>
                            <BulletList items={[
                                'Child information: name, birthdate, sex, address, languages spoken',
                                'Parent/guardian information: names, contact details, occupations',
                                'Health records: vaccinations, medical assessments, health conditions',
                                'Nutrition data: height, weight, nutritional status measurements',
                                'Family profile: home ownership, utilities, household composition',
                                'Account credentials: email address and encrypted password',
                            ]} color="purple" />
                            <InfoBox color="purple" text="We only collect information that is necessary for the operation of the Child Development Center program. All data is stored securely and accessed only by authorized personnel." />
                        </Section>

                        {/* Section: Cookies */}
                        <Section id="cookies" icon={Cookie} title="Cookie Policy" color="pink">
                            <p>We use cookies to improve your experience on our platform. Here is a breakdown of the cookies we use:</p>
                            <div className="mt-4 space-y-3">
                                {[
                                    { name: 'Essential Cookies', desc: 'Required for authentication, session management, and basic site functionality. These cannot be disabled.', badge: 'Always Active', badgeColor: 'bg-blue-100 text-blue-700' },
                                    { name: 'Analytics Cookies', desc: 'Help us understand how users interact with the system so we can improve performance and usability.', badge: 'Optional', badgeColor: 'bg-purple-100 text-purple-700' },
                                    { name: 'Optional Cookies', desc: 'Used for personalization features and enhanced user experience settings.', badge: 'Optional', badgeColor: 'bg-pink-100 text-pink-700' },
                                ].map((c) => (
                                    <div key={c.name} className="p-4 rounded-2xl bg-white/60 border border-white/80">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badgeColor}`}>{c.badge}</span>
                                        </div>
                                        <p className="text-sm text-slate-500">{c.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Section: Data Use */}
                        <Section id="data-use" icon={Shield} title="How We Use Your Data" color="blue">
                            <p>The information we collect is used exclusively for the following purposes:</p>
                            <BulletList items={[
                                'Managing child enrollment and registration in the CDC program',
                                'Tracking health, nutrition, and developmental progress',
                                'Generating reports for barangay health and development programs',
                                'Communicating important updates to parents and guardians',
                                'Improving the quality of our services and platform',
                            ]} color="blue" />
                            <InfoBox color="blue" text="We do not sell, trade, or transfer your personal information to outside parties. Data is shared only with authorized CDC staff and relevant government health agencies as required by law." />
                        </Section>

                        {/* Section: Security */}
                        <Section id="data-security" icon={Lock} title="Data Security" color="purple">
                            <p>We implement industry-standard security measures to protect your information:</p>
                            <BulletList items={[
                                'All passwords are encrypted using bcrypt hashing',
                                'Role-based access control (admin vs. parent accounts)',
                                'HTTPS encryption for all data transmission',
                                'Regular database backups and security audits',
                                'Session management with automatic timeout',
                            ]} color="purple" />
                        </Section>

                        {/* Section: Rights */}
                        <Section id="your-rights" icon={Bell} title="Your Rights" color="pink">
                            <p>As a user of Brgy2DMS, you have the following rights regarding your personal data:</p>
                            <BulletList items={[
                                'Right to access: Request a copy of the data we hold about you',
                                'Right to correction: Request correction of inaccurate information',
                                'Right to deletion: Request deletion of your account and data',
                                'Right to portability: Request your data in a portable format',
                                'Right to object: Object to certain types of data processing',
                            ]} color="pink" />
                            <InfoBox color="pink" text="To exercise any of these rights, please contact your Barangay CDC administrator or the system administrator directly." />
                        </Section>

                        {/* Section: Terms */}
                        <Section id="terms" icon={FileText} title="Terms & Conditions" color="blue">
                            <p>By using Brgy2DMS, you agree to the following terms:</p>
                            <BulletList items={[
                                'You will provide accurate and truthful information during registration',
                                'You will not share your account credentials with unauthorized persons',
                                'You will use the system only for its intended purpose',
                                'You understand that data entered is subject to review by CDC staff',
                                'You will notify the administrator of any unauthorized account access',
                                'The barangay reserves the right to update these terms at any time',
                            ]} color="blue" />
                            <InfoBox color="blue" text="Continued use of the system after any changes to these terms constitutes acceptance of the new terms." />
                        </Section>

                        {/* Footer note */}
                        <div className="text-center py-6 text-sm text-slate-400">
                            <p>© 2026 Brgy2DMS — Barangay Child Development Data Management System</p>
                            <p className="mt-1">For questions, contact your Barangay CDC Administrator</p>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

function Section({ id, icon: Icon, title, color, children }: any) {
    const colors: Record<string, string> = {
        blue: 'from-blue-400 to-blue-600',
        purple: 'from-purple-400 to-purple-600',
        pink: 'from-pink-400 to-rose-500',
    };
    return (
        <div id={id} className="rounded-3xl p-6 scroll-mt-24"
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 24px rgba(99,102,241,0.05)' }}>
            <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-md`}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            </div>
            <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
        </div>
    );
}

function BulletList({ items, color }: { items: string[]; color: string }) {
    const dots: Record<string, string> = {
        blue: 'bg-blue-400',
        purple: 'bg-purple-400',
        pink: 'bg-pink-400',
    };
    return (
        <ul className="mt-3 space-y-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${dots[color]} mt-1.5 shrink-0`} />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function InfoBox({ text, color }: { text: string; color: string }) {
    const styles: Record<string, string> = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        pink: 'bg-pink-50 border-pink-200 text-pink-700',
    };
    return (
        <div className={`mt-4 p-4 rounded-2xl border text-sm ${styles[color]}`}>
            <Shield className="w-4 h-4 inline mr-2 opacity-70" />
            {text}
        </div>
    );
}
