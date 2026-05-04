import ParentLayout from '@/layouts/parent-layout';
import { Head, useForm } from '@inertiajs/react';
import { Clock, CheckCircle, XCircle, Plus, ClipboardList, MapPin, Calendar, Baby, Users, Phone, Camera, Send, X } from 'lucide-react';
import { useState } from 'react';

interface EnrollmentRequest {
    id: number;
    child_first_name: string;
    child_last_name: string;
    child_age: number;
    child_sex: string;
    child_photo: string | null;
    child_photo_url: string | null;
    purok_zone: string;
    status: string;
    rejection_reason: string | null;
    created_at: string;
    reviewed_at: string | null;
}

const statusMap: Record<string, { label: string; dot: string; text: string; bg: string; icon: any }> = {
    Pending:  { label: 'Pending Review', dot: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50',   icon: Clock       },
    Approved: { label: 'Approved',       dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle },
    Rejected: { label: 'Rejected',       dot: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50',     icon: XCircle     },
};

const ic = 'w-full px-3 py-2 border border-purple-100 rounded-xl bg-white/80 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all';
const lc = 'block text-sm font-medium text-slate-600 mb-1';

export default function EnrollmentRequests({ requests, puroks }: { requests: EnrollmentRequest[]; puroks: string[] }) {
    const [showModal, setShowModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<any>({
        child_last_name: '',
        child_first_name: '',
        child_middle_name: '',
        child_sex: 'Male',
        child_birthdate: '',
        child_age: '',
        child_address: '',
        child_first_language: 'Tagalog',
        child_second_language: '',
        purok_zone: '',
        father_name: '',
        father_occupation: '',
        mother_name: '',
        mother_occupation: '',
        guardian_contact: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        child_photo: null as File | null,
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('child_photo', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleBirthdateChange = (birthdate: string) => {
        setData((prev: any) => ({
            ...prev,
            child_birthdate: birthdate,
            child_age: birthdate
                ? String(Math.floor((Date.now() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
                : '',
        }));
    };

    const closeModal = () => {
        setShowModal(false);
        setPreviewUrl(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('parent.enroll.store'), {
            forceFormData: true,
            onSuccess: () => closeModal(),
        });
    };

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
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Enroll New Child
                    </button>
                </div>

                {requests.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-16 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                            <ClipboardList className="w-7 h-7 text-purple-400" />
                        </div>
                        <p className="font-semibold text-slate-700">No enrollment requests yet</p>
                        <p className="text-sm text-slate-400 mt-1">Click "Enroll New Child" to submit your first request</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                            <Plus className="w-4 h-4" /> Enroll Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {requests.map((req) => {
                            const st = statusMap[req.status] ?? statusMap.Pending;
                            const Icon = st.icon;
                            return (
                                <div key={req.id} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm overflow-hidden">
                                    <div className={`h-0.5 w-full ${req.status === 'Approved' ? 'bg-emerald-400' : req.status === 'Rejected' ? 'bg-red-400' : 'bg-amber-400'}`} />
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 min-w-0">
                                                {req.child_photo_url ? (
                                                    <img src={req.child_photo_url} alt={req.child_first_name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shrink-0">
                                                        <Icon className={`w-5 h-5 ${st.text}`} />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 text-sm">{req.child_first_name} {req.child_last_name}</p>
                                                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                                        <span className="text-xs text-slate-500">{req.child_age} yrs · {req.child_sex}</span>
                                                        <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="w-3 h-3" />{req.purok_zone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                                            <Calendar className="w-3 h-3" />
                                                            Submitted {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        {req.reviewed_at && <span className="text-xs text-slate-400">· Reviewed {new Date(req.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${st.bg} ${st.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                {st.label}
                                            </div>
                                        </div>

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
                                                <p className="text-xs text-emerald-700 font-medium">Your child has been added to the system. Check <strong>My Children</strong> to view their profile.</p>
                                            </div>
                                        )}
                                        {req.status === 'Pending' && (
                                            <div className="mt-3 flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                                                <p className="text-xs text-amber-700 font-medium">Under review. You'll be notified once the admin processes your request.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Enroll Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white rounded-t-2xl flex items-center justify-between px-6 py-4 border-b border-slate-100 z-10">
                            <div>
                                <h2 className="text-base font-bold text-slate-800">Enroll New Child</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Submit an enrollment request for admin approval</p>
                            </div>
                            <button onClick={closeModal} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Child Information */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                                    <Baby className="w-3.5 h-3.5" /> Child Information
                                </h3>

                                {/* Photo */}
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border-2 border-purple-100 shadow" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center border-2 border-dashed border-purple-200">
                                                <Camera className="w-5 h-5 text-purple-300" />
                                            </div>
                                        )}
                                        <label htmlFor="modal_child_photo" className="absolute -bottom-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-1 rounded-full cursor-pointer hover:shadow-md transition-all">
                                            <Camera className="w-2.5 h-2.5" />
                                        </label>
                                        <input id="modal_child_photo" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Child Photo <span className="text-slate-400 text-xs">(optional)</span></p>
                                        {previewUrl && <button type="button" onClick={() => { setPreviewUrl(null); setData('child_photo', null); }} className="text-xs text-red-400 hover:text-red-600 mt-0.5">Remove</button>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div><label className={lc}>Last Name *</label><input type="text" value={data.child_last_name} onChange={e => setData('child_last_name', e.target.value)} className={ic} required />{errors.child_last_name && <p className="text-red-500 text-xs mt-1">{errors.child_last_name}</p>}</div>
                                    <div><label className={lc}>First Name *</label><input type="text" value={data.child_first_name} onChange={e => setData('child_first_name', e.target.value)} className={ic} required />{errors.child_first_name && <p className="text-red-500 text-xs mt-1">{errors.child_first_name}</p>}</div>
                                    <div><label className={lc}>Middle Name</label><input type="text" value={data.child_middle_name} onChange={e => setData('child_middle_name', e.target.value)} className={ic} /></div>
                                    <div>
                                        <label className={lc}>Sex *</label>
                                        <select value={data.child_sex} onChange={e => setData('child_sex', e.target.value)} className={ic} required>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div><label className={lc}>Birthdate *</label><input type="date" value={data.child_birthdate} onChange={e => handleBirthdateChange(e.target.value)} className={ic} required /></div>
                                    <div><label className={lc}>Age</label><input type="number" value={data.child_age} readOnly className={`${ic} bg-purple-50 cursor-not-allowed`} placeholder="Auto-calculated" /></div>
                                    <div className="sm:col-span-3"><label className={lc}>Address *</label><textarea value={data.child_address} onChange={e => setData('child_address', e.target.value)} className={`${ic} resize-none`} rows={2} required /></div>
                                    <div><label className={lc}>First Language *</label><input type="text" value={data.child_first_language} onChange={e => setData('child_first_language', e.target.value)} className={ic} required /></div>
                                    <div><label className={lc}>Second Language</label><input type="text" value={data.child_second_language} onChange={e => setData('child_second_language', e.target.value)} className={ic} /></div>
                                    <div>
                                        <label className={lc}>Purok / Zone *</label>
                                        <select value={data.purok_zone} onChange={e => setData('purok_zone', e.target.value)} className={ic} required>
                                            <option value="">Select Purok/Zone...</option>
                                            {puroks.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        {errors.purok_zone && <p className="text-red-500 text-xs mt-1">{errors.purok_zone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Parent Information */}
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5" /> Parent Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div><label className={lc}>Father's Name</label><input type="text" value={data.father_name} onChange={e => setData('father_name', e.target.value)} className={ic} /></div>
                                    <div><label className={lc}>Father's Occupation</label><input type="text" value={data.father_occupation} onChange={e => setData('father_occupation', e.target.value)} className={ic} /></div>
                                    <div><label className={lc}>Mother's Name</label><input type="text" value={data.mother_name} onChange={e => setData('mother_name', e.target.value)} className={ic} /></div>
                                    <div><label className={lc}>Mother's Occupation</label><input type="text" value={data.mother_occupation} onChange={e => setData('mother_occupation', e.target.value)} className={ic} /></div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" /> Contact Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div><label className={lc}>Guardian Contact *</label><input type="text" value={data.guardian_contact} onChange={e => setData('guardian_contact', e.target.value)} className={ic} required /></div>
                                    <div><label className={lc}>Emergency Contact Name *</label><input type="text" value={data.emergency_contact_name} onChange={e => setData('emergency_contact_name', e.target.value)} className={ic} required /></div>
                                    <div><label className={lc}>Emergency Contact Phone *</label><input type="text" value={data.emergency_contact_phone} onChange={e => setData('emergency_contact_phone', e.target.value)} className={ic} required /></div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2 border-t border-slate-100">
                                <button type="submit" disabled={processing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                                    <Send className="w-4 h-4" />
                                    {processing ? 'Submitting...' : 'Submit Request'}
                                </button>
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ParentLayout>
    );
}
