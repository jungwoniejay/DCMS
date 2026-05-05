import AdminLayout from '@/layouts/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Clock, CheckCircle, XCircle, User, MapPin, Trash2, X, CheckCheck, AlertCircle, Baby, Users, Heart, Activity, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface EnrollmentRequest {
    id: number;
    child_first_name: string; child_middle_name: string; child_last_name: string;
    child_sex: string; child_birthdate: string; child_age: number;
    child_address: string; child_first_language: string; child_second_language: string;
    child_photo: string | null; child_photo_url: string | null; purok_zone: string;
    guardian_name: string; guardian_relationship: string; guardian_email: string; guardian_contact: string;
    emergency_contact_name: string; emergency_contact_phone: string; emergency_home: string; emergency_work: string;
    father_data: any; mother_data: any; family_data: any;
    child_profile_data: any; health_data: any; nutrition_data: any;
    status: string; rejection_reason: string | null; created_at: string; reviewed_at: string | null;
    parent: { name: string; email: string };
    reviewer: { name: string } | null;
}

interface Props {
    requests: { data: EnrollmentRequest[]; current_page: number; last_page: number };
    stats: { pending: number; approved: number; rejected: number };
}

const statusMap: Record<string, { label: string; dot: string; text: string; bg: string }> = {
    Pending:  { label: 'Pending',  dot: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50'   },
    Approved: { label: 'Approved', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    Rejected: { label: 'Rejected', dot: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50'     },
};

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm text-slate-700">{value || <span className="text-slate-300 italic">—</span>}</p>
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 pt-3 border-t border-slate-100">
                {icon} {title}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{children}</div>
        </div>
    );
}

function RejectModal({ show, request, onClose }: { show: boolean; request: EnrollmentRequest | null; onClose: () => void }) {
    const { data, setData, post, processing, reset } = useForm({ rejection_reason: '' });
    if (!show || !request) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Reject Enrollment</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-sm text-slate-500">{request.child_first_name} {request.child_last_name}</p>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Reason for rejection *</label>
                    <textarea
                        value={data.rejection_reason}
                        onChange={e => setData('rejection_reason', e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                        rows={4} placeholder="e.g., Incomplete information, age requirement not met..."
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <button onClick={() => { onClose(); reset(); }} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancel</button>
                    <button
                        onClick={() => post(route('admin.enrollments.reject', request.id), { onSuccess: () => { onClose(); reset(); } })}
                        disabled={processing || !data.rejection_reason}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
                    >
                        <X className="w-3.5 h-3.5" /> {processing ? 'Rejecting...' : 'Confirm Rejection'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Enrollments({ requests, stats }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<Record<number, string>>({});
    const [rejectTarget, setRejectTarget] = useState<EnrollmentRequest | null>(null);

    const getTab = (id: number) => activeTab[id] ?? 'child';
    const setTab = (id: number, tab: string) => setActiveTab(prev => ({ ...prev, [id]: tab }));

    const handleApprove = (id: number) => {
        if (confirm('Approve this enrollment? A new child record will be created.')) {
            router.post(route('admin.enrollments.approve', id));
        }
    };

    const TABS = [
        { key: 'child',      label: 'Form 1',     icon: <Baby className="w-3 h-3" /> },
        { key: 'parents',    label: 'Form 1A/1B',  icon: <Users className="w-3 h-3" /> },
        { key: 'family',     label: 'Form 1C',     icon: <User className="w-3 h-3" /> },
        { key: 'profile',    label: 'Form 2',      icon: <Heart className="w-3 h-3" /> },
        { key: 'nutrition',  label: 'Form 3',      icon: <Activity className="w-3 h-3" /> },
    ];

    return (
        <AdminLayout>
            <Head title="Enrollment Requests" />
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Enrollment Requests</h1>
                        <p className="text-slate-500 mt-1 text-sm">Review and process parent enrollment submissions</p>
                    </div>
                    {stats.pending > 0 && (
                        <button onClick={() => { if (confirm(`Clear all ${stats.pending} pending requests?`)) router.delete(route('admin.enrollments.clear-pending')); }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 shadow-sm">
                            <Trash2 className="w-4 h-4" /> Clear All Pending
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Pending Review', value: stats.pending,  icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100'   },
                        { label: 'Approved',        value: stats.approved, icon: CheckCircle,  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                        { label: 'Rejected',        value: stats.rejected, icon: XCircle,      color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-100'     },
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

                {/* List */}
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
                                const tab = getTab(req.id);
                                const f = req.father_data ?? {};
                                const m = req.mother_data ?? {};
                                const fam = req.family_data ?? {};
                                const cp = req.child_profile_data ?? {};
                                const h = req.health_data ?? {};
                                const n = req.nutrition_data ?? {};

                                return (
                                    <div key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* Row */}
                                        <div className="flex items-center gap-4 px-6 py-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : req.id)}>
                                            {req.child_photo_url
                                                ? <img src={req.child_photo_url} alt={req.child_first_name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0" />
                                                : <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0"><User className="w-5 h-5 text-slate-400" /></div>
                                            }
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-800 text-sm">{req.child_last_name}, {req.child_first_name} {req.child_middle_name}</p>
                                                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                                    <span className="text-xs text-slate-500">{req.child_age} yrs • {req.child_sex}</span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="w-3 h-3" />{req.purok_zone}</span>
                                                    <span className="text-xs text-slate-400">by {req.parent.name}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-400 shrink-0 hidden md:block">
                                                {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${st.bg} ${st.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} /> {st.label}
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>

                                        {/* Expanded */}
                                        {isExpanded && (
                                            <div className="px-6 pb-6 border-t border-slate-100">
                                                {/* Tabs */}
                                                <div className="flex gap-1 mt-4 mb-4 flex-wrap">
                                                    {TABS.map(t => (
                                                        <button key={t.key} onClick={() => setTab(req.id, t.key)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                                                ${tab === t.key ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                                            {t.icon} {t.label}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Form 1 — Child */}
                                                {tab === 'child' && (
                                                    <div className="space-y-4">
                                                        <Section title="Child Information" icon={<Baby className="w-3.5 h-3.5 text-sky-500" />}>
                                                            <InfoRow label="Last Name" value={req.child_last_name} />
                                                            <InfoRow label="First Name" value={req.child_first_name} />
                                                            <InfoRow label="Middle Name" value={req.child_middle_name} />
                                                            <InfoRow label="Sex" value={req.child_sex} />
                                                            <InfoRow label="Birthdate" value={req.child_birthdate} />
                                                            <InfoRow label="Age" value={req.child_age} />
                                                            <InfoRow label="Address" value={req.child_address} />
                                                            <InfoRow label="Purok / Zone" value={req.purok_zone} />
                                                            <InfoRow label="First Language" value={req.child_first_language} />
                                                            <InfoRow label="Second Language" value={req.child_second_language} />
                                                        </Section>
                                                        <Section title="Guardian" icon={<User className="w-3.5 h-3.5 text-teal-500" />}>
                                                            <InfoRow label="Name" value={req.guardian_name} />
                                                            <InfoRow label="Relationship" value={req.guardian_relationship} />
                                                            <InfoRow label="Email" value={req.guardian_email} />
                                                            <InfoRow label="Contact" value={req.guardian_contact} />
                                                        </Section>
                                                        <Section title="Emergency Contact" icon={<AlertCircle className="w-3.5 h-3.5 text-red-400" />}>
                                                            <InfoRow label="Name" value={req.emergency_contact_name} />
                                                            <InfoRow label="Phone" value={req.emergency_contact_phone} />
                                                            <InfoRow label="Home" value={req.emergency_home} />
                                                            <InfoRow label="Work" value={req.emergency_work} />
                                                        </Section>
                                                    </div>
                                                )}

                                                {/* Form 1A/1B — Parents */}
                                                {tab === 'parents' && (
                                                    <div className="space-y-4">
                                                        <Section title="Father's Profile (Form 1A)" icon={<User className="w-3.5 h-3.5 text-blue-500" />}>
                                                            <InfoRow label="Last Name" value={f.last_name} />
                                                            <InfoRow label="First Name" value={f.first_name} />
                                                            <InfoRow label="Middle Initial" value={f.middle_name} />
                                                            <InfoRow label="Birthdate" value={f.birthdate} />
                                                            <InfoRow label="Age" value={f.age} />
                                                            <InfoRow label="Civil Status" value={f.civil_status} />
                                                            <InfoRow label="District" value={f.district} />
                                                            <InfoRow label="Purok" value={f.purok} />
                                                            <InfoRow label="Mother Tongue" value={f.mother_tongue} />
                                                            <InfoRow label="Education" value={f.education} />
                                                            <InfoRow label="Occupation Status" value={f.occupation_status} />
                                                            <InfoRow label="Occupation" value={f.occupation} />
                                                            <InfoRow label="Contact Home" value={f.contact_home} />
                                                            <InfoRow label="Contact Work" value={f.contact_work} />
                                                        </Section>
                                                        <Section title="Mother's Profile (Form 1B)" icon={<User className="w-3.5 h-3.5 text-pink-400" />}>
                                                            <InfoRow label="Last Name" value={m.last_name} />
                                                            <InfoRow label="First Name" value={m.first_name} />
                                                            <InfoRow label="Middle Initial" value={m.middle_name} />
                                                            <InfoRow label="Birthdate" value={m.birthdate} />
                                                            <InfoRow label="Age" value={m.age} />
                                                            <InfoRow label="Pregnant" value={m.pregnant} />
                                                            <InfoRow label="Civil Status" value={m.civil_status} />
                                                            <InfoRow label="District" value={m.district} />
                                                            <InfoRow label="Mother Tongue" value={m.mother_tongue} />
                                                            <InfoRow label="Education" value={m.education} />
                                                            <InfoRow label="Occupation Status" value={m.occupation_status} />
                                                            <InfoRow label="Occupation" value={m.occupation} />
                                                            <InfoRow label="Contact Home" value={m.contact_home} />
                                                            <InfoRow label="Contact Work" value={m.contact_work} />
                                                            <InfoRow label="Daycare Age Interest" value={m.daycare_age_interest} />
                                                        </Section>
                                                    </div>
                                                )}

                                                {/* Form 1C — Family */}
                                                {tab === 'family' && (
                                                    <Section title="Family Profile (Form 1C)" icon={<Users className="w-3.5 h-3.5 text-teal-500" />}>
                                                        <InfoRow label="Home Ownership" value={fam.home_ownership} />
                                                        <InfoRow label="Home Material" value={fam.home_material} />
                                                        <InfoRow label="Home Nature" value={fam.home_nature} />
                                                        <InfoRow label="Monthly Income" value={fam.monthly_income} />
                                                        <InfoRow label="No. of Siblings" value={fam.no_of_siblings} />
                                                        <InfoRow label="Utilities" value={Array.isArray(fam.home_utilities) ? fam.home_utilities.join(', ') : fam.home_utilities} />
                                                        <InfoRow label="Learning & Recreation" value={Array.isArray(fam.home_learning) ? fam.home_learning.join(', ') : fam.home_learning} />
                                                        <InfoRow label="Household Members" value={Array.isArray(fam.home_household_members) ? fam.home_household_members.join(', ') : fam.home_household_members} />
                                                    </Section>
                                                )}

                                                {/* Form 2 — Child Profile + Health */}
                                                {tab === 'profile' && (
                                                    <div className="space-y-4">
                                                        <Section title="Children's Profile (Form 2)" icon={<Baby className="w-3.5 h-3.5 text-sky-500" />}>
                                                            <InfoRow label="Birth Order" value={cp.birth_order} />
                                                            <InfoRow label="Registered" value={cp.registered} />
                                                            <InfoRow label="Born At" value={cp.born_at} />
                                                            <InfoRow label="Height (cm)" value={cp.height_cm} />
                                                            <InfoRow label="Weight (kg)" value={cp.weight_kg} />
                                                            <InfoRow label="Left Handed" value={cp.left_handed} />
                                                            <InfoRow label="Mother Tongue" value={cp.mother_tongue} />
                                                            <InfoRow label="Other Dialects" value={cp.other_dialects} />
                                                            <InfoRow label="Meal Before School" value={cp.meal_before_school} />
                                                            <InfoRow label="Has Baon" value={cp.has_baon} />
                                                            <InfoRow label="Travel to DCC" value={cp.travel_time_dcc ? `${cp.travel_time_dcc} mins (${cp.travel_mode_dcc})` : null} />
                                                            <InfoRow label="Travel to NCDC" value={cp.travel_time_ncdc ? `${cp.travel_time_ncdc} mins (${cp.travel_mode_ncdc})` : null} />
                                                        </Section>
                                                        <Section title="Health Assessment (Form 2)" icon={<Heart className="w-3.5 h-3.5 text-red-400" />}>
                                                            <InfoRow label="Routine Hospital" value={h.routine_hospital} />
                                                            <InfoRow label="Phone" value={h.routine_phone} />
                                                            <InfoRow label="Last Check-up" value={h.last_checkup_date} />
                                                            <InfoRow label="Last Hospital" value={h.last_checkup_hospital} />
                                                            <InfoRow label="Takes Medication" value={h.takes_medication} />
                                                            <InfoRow label="Medication" value={h.medication_description} />
                                                            <InfoRow label="Special Treatment" value={h.special_treatment} />
                                                            <InfoRow label="Serious Accident" value={h.serious_accident} />
                                                        </Section>
                                                    </div>
                                                )}

                                                {/* Form 3 — Nutrition */}
                                                {tab === 'nutrition' && (
                                                    <Section title="Nutrition Status (Form 3)" icon={<Activity className="w-3.5 h-3.5 text-emerald-500" />}>
                                                        <InfoRow label="Height 1st (cm)" value={n.height_1} />
                                                        <InfoRow label="Height 2nd (cm)" value={n.height_2} />
                                                        <InfoRow label="Weight 1st (kg)" value={n.weight_1} />
                                                        <InfoRow label="Weight 2nd (kg)" value={n.weight_2} />
                                                        <InfoRow label="Status 1st" value={n.nutritional_status_1} />
                                                        <InfoRow label="Status 2nd" value={n.nutritional_status_2} />
                                                        <InfoRow label="Date 1st" value={n.date_1} />
                                                        <InfoRow label="Date 2nd" value={n.date_2} />
                                                        <InfoRow label="Food Allergies" value={n.food_allergies} />
                                                        <InfoRow label="Usual Food" value={n.usual_food} />
                                                        <InfoRow label="Eating Habit" value={n.eating_habit} />
                                                        <InfoRow label="Uses Bottle" value={n.uses_bottle} />
                                                        <InfoRow label="Breakfast Time" value={n.breakfast_time} />
                                                        <InfoRow label="Lunch Time" value={n.lunch_time} />
                                                    </Section>
                                                )}

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
                                                        <button onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all">
                                                            <CheckCheck className="w-3.5 h-3.5" /> Approve & Create Record
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); setRejectTarget(req); }}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-all">
                                                            <X className="w-3.5 h-3.5" /> Reject
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

            <RejectModal show={!!rejectTarget} request={rejectTarget} onClose={() => setRejectTarget(null)} />
        </AdminLayout>
    );
}
