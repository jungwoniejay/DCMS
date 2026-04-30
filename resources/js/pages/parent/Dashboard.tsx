import ParentLayout from '@/layouts/parent-layout';
import { Head, Link } from '@inertiajs/react';
import { Users, Clock, CheckCircle, AlertTriangle, Baby, Calendar, Plus, ArrowRight, User, Activity, Apple } from 'lucide-react';

interface Child {
    id: number;
    name: string;
    first_name: string;
    age: number;
    sex: string;
    status: string;
    zone: string;
    profile_picture: string | null;
    has_emergency_alert: boolean;
    nutritional_status: string;
    height: number | null;
    weight: number | null;
}

interface Stats {
    total_children: number;
    pending_registrations: number;
    approved_children: number;
    health_alerts: number;
}

interface Props {
    children: Child[];
    stats: Stats;
    recentAppointments: any[];
    pendingEnrollments: number;
}

export default function Dashboard({ children, stats, recentAppointments, pendingEnrollments }: Props) {
    const statCards = [
        { label: 'My Children', value: stats.total_children, icon: Users, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50 border-blue-100 text-blue-700' },
        { label: 'Pending', value: stats.pending_registrations, icon: Clock, color: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
        { label: 'Approved', value: stats.approved_children, icon: CheckCircle, color: 'from-green-400 to-emerald-500', bg: 'bg-green-50 border-green-100 text-green-700' },
        { label: 'Health Alerts', value: stats.health_alerts, icon: AlertTriangle, color: 'from-red-400 to-rose-500', bg: 'bg-red-50 border-red-100 text-red-700' },
    ];

    const statusColor = (status: string) =>
        status?.toLowerCase() === 'approved'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700';

    const appointmentStatus: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        scheduled: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <ParentLayout>
            <Head title="My Dashboard" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Dashboard</h1>
                        <p className="text-gray-500 mt-1 text-sm">Welcome back! Here's an overview of your children.</p>
                    </div>
                    <Link
                        href="/parent/enroll"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Enroll New Child
                    </Link>
                </div>

                {/* Pending enrollment notice */}
                {pendingEnrollments > 0 && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-50 border border-yellow-200">
                        <Clock className="w-5 h-5 text-yellow-500 shrink-0" />
                        <p className="text-sm text-yellow-800 font-medium">
                            You have <span className="font-bold">{pendingEnrollments}</span> pending enrollment request{pendingEnrollments > 1 ? 's' : ''} awaiting admin approval.
                        </p>
                        <Link href="/parent/enrollment-requests" className="ml-auto text-xs text-yellow-700 font-semibold hover:underline shrink-0">
                            View →
                        </Link>
                    </div>
                )}

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {statCards.map((s) => (
                        <div key={s.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${s.bg}`}>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm shrink-0`}>
                                <s.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{s.value}</p>
                                <p className="text-xs font-medium opacity-80">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Children Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                <Baby className="w-4 h-4 text-pink-500" /> My Children
                            </h2>
                            <Link href="/parent/my-children" className="text-xs text-purple-600 hover:underline font-medium flex items-center gap-1">
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {children.length === 0 ? (
                            <div className="bg-white/70 backdrop-blur rounded-2xl border border-white/80 p-10 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
                                    <Baby className="w-8 h-8 text-purple-400" />
                                </div>
                                <p className="text-gray-500 font-medium">No children registered yet</p>
                                <p className="text-gray-400 text-sm mt-1">Click "Enroll New Child" to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {children.map((child) => (
                                    <div key={child.id} className="bg-white/70 backdrop-blur rounded-2xl border border-white/80 shadow-sm p-4 hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            {child.profile_picture ? (
                                                <img src={`/storage/${child.profile_picture}`} alt={child.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow shrink-0" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow shrink-0">
                                                    <User className="w-7 h-7 text-white" />
                                                </div>
                                            )}

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-semibold text-gray-900 truncate">{child.name}</p>
                                                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor(child.status)}`}>
                                                        {child.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">{child.age} yrs • {child.sex} • {child.zone}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Apple className="w-3 h-3 text-green-500" /> {child.nutritional_status}
                                                    </span>
                                                    {child.height && (
                                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Activity className="w-3 h-3 text-blue-500" /> {child.height}cm / {child.weight}kg
                                                        </span>
                                                    )}
                                                    {child.has_emergency_alert && (
                                                        <span className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                                                            <AlertTriangle className="w-3 h-3" /> Alert
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <Link
                                                href={`/parent/my-children/${child.id}`}
                                                className="shrink-0 p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Recent Appointments */}
                        <div className="bg-white/70 backdrop-blur rounded-2xl border border-white/80 shadow-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" /> Recent Appointments
                                </h2>
                                <Link href="/parent/appointments" className="text-xs text-purple-600 hover:underline font-medium">
                                    View all
                                </Link>
                            </div>
                            {recentAppointments.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-4">No appointments yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {recentAppointments.map((apt: any) => (
                                        <div key={apt.id} className="flex items-center justify-between p-2.5 bg-white/60 rounded-xl border border-white/80">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-800">{apt.child?.first_name}</p>
                                                <p className="text-xs text-gray-400 capitalize">{apt.appointment_type?.replace('_', ' ')}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${appointmentStatus[apt.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/70 backdrop-blur rounded-2xl border border-white/80 shadow-sm p-4">
                            <h2 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h2>
                            <div className="space-y-2">
                                {[
                                    { label: 'Enroll a Child', href: '/parent/enroll', color: 'from-pink-400 to-purple-500', icon: Plus },
                                    { label: 'Request Appointment', href: '/parent/appointments', color: 'from-blue-400 to-blue-600', icon: Calendar },
                                    { label: 'View Health Records', href: '/parent/health', color: 'from-green-400 to-emerald-500', icon: Activity },
                                    { label: 'Enrollment Requests', href: '/parent/enrollment-requests', color: 'from-yellow-400 to-orange-500', icon: Clock },
                                ].map((action) => (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-all group"
                                    >
                                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}>
                                            <action.icon className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">{action.label}</span>
                                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-400 ml-auto transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
