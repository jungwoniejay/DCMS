import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Clock, CheckCircle, XCircle, User, MapPin, Trash2, X, CheckCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface EnrollmentRequest {
    id: number;
    child_first_name: string;
    child_middle_name: string;
    child_last_name: string;
    child_sex: string;
    child_birthdate: string;
    child_age: number;
    child_address: string;
    child_first_language: string;
    child_second_language: string;
    child_photo: string | null;
    child_photo_url: string | null;
    purok_zone: string;
    father_name: string;
    father_occupation: string;
    mother_name: string;
    mother_occupation: string;
    guardian_contact: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    status: string;
    rejection_reason: string | null;
    created_at: string;
    reviewed_at: string | null;
    parent: { name: string; email: string };
    reviewer: { name: string } | null;
}

interface Props {
    requests: { data: EnrollmentRequest[]; current_page: number; last_page: number };
    stats: { pending: number; approved: number; rejected: number };
}

const statusMap: Record<string, { label: string; dot: string; text: string; bg: string }> = {
    Pending:  { label: 'Pending',  dot: 'bg-amber-400',   text: 'text-amber-700',  bg: 'bg-amber-50'  },
    Approved: { label: 'Approved', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    Rejected: { label: 'Rejected', dot: 'bg-red-500',     text: 'text-red-700',    bg: 'bg-red-50'    },
};

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm text-slate-700">{value || '—'}</p>
        </div>
    );
}

export default function Enrollments({ requests, stats }: Props) {
    const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequest | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const { data, setData, post, processing } = useForm({ rejection_reason: '' });

    const handleApprove = (id: number) => {
        if (confirm('Approve this enrollment request? A new child record will be created.')) {
            router.post(route('admin.enrollments.approve', id));
        }
    };

    const handleReject = (request: EnrollmentRequest) => {
        setSelectedRequest(request);
        setShowRejectModal(true);
    };

    const submitRejection = () => {
        if (!selectedRequest) return;
        post(route('admin.enrollments.reject', selectedRequest.id), {
            onSuccess: () => {
                setShowRejectModal(false);
                setData('rejection_reason', '');
                setSelectedRequest(null);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Enrollment Requests" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Enrollment Requests</h1>
                        <p className="text-slate-500 mt-1 text-sm">Review and process parent enrollment submissions</p>
                    </div>
                    {stats.pending > 0 && (
                        <button
                            onClick={() => {
                                if (confirm(`Clear all ${stats.pending} pending enrollment request(s)? This cannot be undone.`)) {
                                    router.delete(route('admin.enrollments.clear-pending'));
                                }
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-all shadow-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All Pending
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                        { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                        { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
                    ].map(s => (
                        <div key={s.label} className={`bg-white/80 backdrop-blur-sm rounded-2xl border ${s.border} shadow-sm p-5 flex items-center gap-4`}>
                            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Requests */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {requests.data.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-7 h-7 text-slate-400" />
                            </div>
                            <p className="font-semibold text-slate-600">No enrollment requests</p>
                            <p className="text-sm text-slate-400 mt-1">New requests from parents will appear here</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {requests.data.map((req) => {
                                const st = statusMap[req.status] ?? statusMap.Pending;
                                const isExpanded = expandedId === req.id;
                                return (
                                    <div key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* Main Row */}
                                        <div
                                            className="flex items-center gap-4 px-6 py-4 cursor-pointer"
                                            onClick={() => setExpandedId(isExpanded ? null : req.id)}
                                        >
                                            {/* Photo */}
                                            {req.child_photo_url ? (
                                                <img src={req.child_photo_url} alt={req.child_first_name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
                                                    <User className="w-5 h-5 text-slate-400" />
                                                </div>
                                            )}

                                            {/* Name & Meta */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-800 text-sm">
                                                    {req.child_last_name}, {req.child_first_name} {req.child_middle_name}
                                                </p>
                                                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                                    <span className="text-xs text-slate-500">{req.child_age} yrs • {req.child_sex}</span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                                        <MapPin className="w-3 h-3" />{req.purok_zone}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        by {req.parent.name}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Date */}
                                            <p className="text-xs text-slate-400 shrink-0 hidden md:block">
                                                {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>

                                            {/* Status */}
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${st.bg} ${st.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                {st.label}
                                            </div>

                                            {/* Expand chevron */}
                                            <svg className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <div className="px-6 pb-5 border-t border-slate-50">
                                                <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <InfoRow label="Birthdate" value={req.child_birthdate} />
                                                    <InfoRow label="Address" value={req.child_address} />
                                                    <InfoRow label="First Language" value={req.child_first_language} />
                                                    <InfoRow label="Second Language" value={req.child_second_language || '—'} />
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pt-3 border-t border-slate-50">
                                                    <InfoRow label="Father" value={req.father_name ? `${req.father_name}${req.father_occupation ? ` · ${req.father_occupation}` : ''}` : '—'} />
                                                    <InfoRow label="Mother" value={req.mother_name ? `${req.mother_name}${req.mother_occupation ? ` · ${req.mother_occupation}` : ''}` : '—'} />
                                                    <InfoRow label="Guardian Contact" value={req.guardian_contact} />
                                                    <InfoRow label="Emergency Contact" value={`${req.emergency_contact_name} · ${req.emergency_contact_phone}`} />
                                                </div>

                                                <div className="pt-3 border-t border-slate-50">
                                                    <InfoRow label="Submitted by" value={`${req.parent.name} (${req.parent.email})`} />
                                                </div>

                                                {/* Status banners */}
                                                {req.status === 'Rejected' && req.rejection_reason && (
                                                    <div className="mt-4 flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                                                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-red-700">Rejection Reason</p>
                                                            <p className="text-xs text-red-600 mt-0.5">{req.rejection_reason}</p>
                                                            {req.reviewer && <p className="text-xs text-red-400 mt-1">by {req.reviewer.name} · {new Date(req.reviewed_at!).toLocaleDateString()}</p>}
                                                        </div>
                                                    </div>
                                                )}

                                                {req.status === 'Approved' && req.reviewer && (
                                                    <div className="mt-4 flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                                        <p className="text-xs text-emerald-700 font-medium">
                                                            Approved by {req.reviewer.name} on {new Date(req.reviewed_at!).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                {req.status === 'Pending' && (
                                                    <div className="mt-4 flex items-center gap-3">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                                                        >
                                                            <CheckCheck className="w-3.5 h-3.5" />
                                                            Approve & Create Record
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleReject(req); }}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-all"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-800">Reject Enrollment</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {selectedRequest.child_first_name} {selectedRequest.child_last_name}
                                </p>
                            </div>
                            <button onClick={() => setShowRejectModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2">Reason for rejection *</label>
                        <textarea
                            value={data.rejection_reason}
                            onChange={e => setData('rejection_reason', e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                            rows={4}
                            placeholder="e.g., Incomplete information, age requirement not met..."
                        />
                        <div className="flex gap-2 mt-4 justify-end">
                            <button
                                onClick={() => { setShowRejectModal(false); setData('rejection_reason', ''); }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitRejection}
                                disabled={processing || !data.rejection_reason}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-all"
                            >
                                <X className="w-3.5 h-3.5" />
                                {processing ? 'Rejecting...' : 'Confirm Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
