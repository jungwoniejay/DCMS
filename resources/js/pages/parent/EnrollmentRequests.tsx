import ParentLayout from '@/layouts/parent-layout';
import { Head, Link } from '@inertiajs/react';
import { Clock, CheckCircle, XCircle, Plus, ClipboardList } from 'lucide-react';

interface EnrollmentRequest {
    id: number;
    child_first_name: string;
    child_last_name: string;
    child_age: number;
    child_sex: string;
    purok_zone: string;
    status: string;
    rejection_reason: string | null;
    created_at: string;
    reviewed_at: string | null;
}

export default function EnrollmentRequests({ requests }: { requests: EnrollmentRequest[] }) {
    const statusConfig: Record<string, { color: string; icon: any; bg: string }> = {
        Pending:  { color: 'bg-yellow-100 text-yellow-800', icon: Clock,         bg: 'bg-yellow-50 border-yellow-200' },
        Approved: { color: 'bg-green-100 text-green-800',  icon: CheckCircle,    bg: 'bg-green-50 border-green-200' },
        Rejected: { color: 'bg-red-100 text-red-800',      icon: XCircle,        bg: 'bg-red-50 border-red-200' },
    };

    return (
        <ParentLayout>
            <Head title="Enrollment Requests" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Enrollment Requests</h1>
                        <p className="text-slate-500 mt-1 text-sm">Track the status of your enrollment submissions</p>
                    </div>
                    <Link
                        href="/parent/enroll"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Enroll New Child
                    </Link>
                </div>

                {requests.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur rounded-2xl border border-white/80 p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
                            <ClipboardList className="w-8 h-8 text-purple-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No enrollment requests yet</p>
                        <p className="text-gray-400 text-sm mt-1">Click "Enroll New Child" to submit your first request</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {requests.map((req) => {
                            const cfg = statusConfig[req.status] ?? statusConfig['Pending'];
                            const Icon = cfg.icon;
                            return (
                                <div key={req.id} className="bg-white/70 backdrop-blur rounded-2xl border border-white/80 shadow-sm p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} border`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {req.child_first_name} {req.child_last_name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {req.child_age} yrs • {req.child_sex} • {req.purok_zone}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Submitted: {new Date(req.created_at).toLocaleDateString()}
                                                    {req.reviewed_at && ` • Reviewed: ${new Date(req.reviewed_at).toLocaleDateString()}`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                                            {req.status}
                                        </span>
                                    </div>

                                    {req.status === 'Rejected' && req.rejection_reason && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                                            <p className="text-xs font-semibold text-red-800">Reason for rejection:</p>
                                            <p className="text-xs text-red-700 mt-0.5">{req.rejection_reason}</p>
                                        </div>
                                    )}

                                    {req.status === 'Approved' && (
                                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                            <p className="text-xs text-green-800 font-medium">
                                                ✓ Your child has been successfully added to the system. Check "My Children" to view their profile.
                                            </p>
                                        </div>
                                    )}

                                    {req.status === 'Pending' && (
                                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                                            <p className="text-xs text-yellow-800 font-medium">
                                                ⏳ Your request is being reviewed by the admin. You will be notified once it's processed.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}
