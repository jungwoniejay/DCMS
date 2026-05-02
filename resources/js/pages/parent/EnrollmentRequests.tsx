import ParentLayout from '@/layouts/parent-layout';
import { Head, Link } from '@inertiajs/react';
import { Clock, CheckCircle, XCircle, Plus, ClipboardList, MapPin, Calendar } from 'lucide-react';

interface EnrollmentRequest {
    id: number;
    child_first_name: string;
    child_last_name: string;
    child_age: number;
    child_sex: string;
    child_photo: string | null;
    purok_zone: string;
    status: string;
    rejection_reason: string | null;
    created_at: string;
    reviewed_at: string | null;
}

const statusMap: Record<string, { label: string; dot: string; text: string; bg: string; icon: any }> = {
    Pending:  { label: 'Pending Review', dot: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50',   icon: Clock         },
    Approved: { label: 'Approved',       dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle   },
    Rejected: { label: 'Rejected',       dot: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50',     icon: XCircle       },
};

export default function EnrollmentRequests({ requests }: { requests: EnrollmentRequest[] }) {
    return (
        <ParentLayout>
            <Head title="Enrollment Requests" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Enrollment Requests</h1>
                        <p className="text-slate-500 mt-1 text-sm">Track the status of your submitted enrollment requests</p>
                    </div>
                    <Link
                        href={route('parent.enroll.create')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Enroll New Child
                    </Link>
                </div>

                {requests.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-16 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                            <ClipboardList className="w-7 h-7 text-purple-400" />
                        </div>
                        <p className="font-semibold text-slate-700">No enrollment requests yet</p>
                        <p className="text-sm text-slate-400 mt-1">Click "Enroll New Child" to submit your first request</p>
                        <Link
                            href={route('parent.enroll.create')}
                            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                            <Plus className="w-4 h-4" /> Enroll Now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {requests.map((req) => {
                            const st = statusMap[req.status] ?? statusMap.Pending;
                            const Icon = st.icon;
                            return (
                                <div key={req.id} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm overflow-hidden">
                                    {/* Top accent line based on status */}
                                    <div className={`h-0.5 w-full ${req.status === 'Approved' ? 'bg-emerald-400' : req.status === 'Rejected' ? 'bg-red-400' : 'bg-amber-400'}`} />

                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 min-w-0">
                                                {/* Photo or avatar */}
                                                {req.child_photo ? (
                                                    <img src={`/storage/${req.child_photo}`} alt={req.child_first_name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shrink-0">
                                                        <Icon className={`w-5 h-5 ${st.text}`} />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 text-sm">
                                                        {req.child_first_name} {req.child_last_name}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                                        <span className="text-xs text-slate-500">{req.child_age} yrs · {req.child_sex}</span>
                                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                                            <MapPin className="w-3 h-3" />{req.purok_zone}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                                            <Calendar className="w-3 h-3" />
                                                            Submitted {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        {req.reviewed_at && (
                                                            <span className="text-xs text-slate-400">
                                                                · Reviewed {new Date(req.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status badge */}
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${st.bg} ${st.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                {st.label}
                                            </div>
                                        </div>

                                        {/* Status messages */}
                                        {req.status === 'Rejected' && req.rejection_reason && (
                                            <div className="mt-3 flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl">
                                                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-semibold text-red-700">Reason for rejection</p>
                                                    <p className="text-xs text-red-600 mt-0.5">{req.rejection_reason}</p>
                                                </div>
                                            </div>
                                        )}

                                        {req.status === 'Approved' && (
                                            <div className="mt-3 flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                                <p className="text-xs text-emerald-700 font-medium">
                                                    Your child has been added to the system. Check <strong>My Children</strong> to view their profile.
                                                </p>
                                            </div>
                                        )}

                                        {req.status === 'Pending' && (
                                            <div className="mt-3 flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                                                <p className="text-xs text-amber-700 font-medium">
                                                    Under review. You'll be notified once the admin processes your request.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}
