import ParentLayout from '@/layouts/parent-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Baby, Users, Phone, ArrowLeft, Send } from 'lucide-react';

const ic = 'w-full px-3 py-2 border border-purple-100 rounded-xl bg-white/80 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all';
const lc = 'block text-sm font-medium text-slate-600 mb-1';

export default function EnrollChild({ puroks }: { puroks: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
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
    });

    const handleBirthdateChange = (birthdate: string) => {
        setData(prev => ({
            ...prev,
            child_birthdate: birthdate,
            child_age: birthdate
                ? String(Math.floor((Date.now() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
                : '',
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to submit this enrollment request?')) return;
        post(route('parent.enroll.store'));
    };

    return (
        <ParentLayout>
            <Head title="Enroll New Child" />
            <div className="space-y-6 max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('parent.enrollment.index')} className="text-slate-400 hover:text-purple-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Enroll New Child</h1>
                        <p className="text-slate-500 mt-1 text-sm">Submit an enrollment request. Admin approval is required.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Child Information */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-5 space-y-4">
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                            <Baby className="w-4 h-4" /> Child Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={lc}>Last Name *</label>
                                <input type="text" value={data.child_last_name} onChange={e => setData('child_last_name', e.target.value)} className={ic} required />
                                {errors.child_last_name && <p className="text-red-500 text-xs mt-1">{errors.child_last_name}</p>}
                            </div>
                            <div>
                                <label className={lc}>First Name *</label>
                                <input type="text" value={data.child_first_name} onChange={e => setData('child_first_name', e.target.value)} className={ic} required />
                                {errors.child_first_name && <p className="text-red-500 text-xs mt-1">{errors.child_first_name}</p>}
                            </div>
                            <div>
                                <label className={lc}>Middle Name</label>
                                <input type="text" value={data.child_middle_name} onChange={e => setData('child_middle_name', e.target.value)} className={ic} />
                            </div>
                            <div>
                                <label className={lc}>Sex *</label>
                                <select value={data.child_sex} onChange={e => setData('child_sex', e.target.value)} className={ic} required>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className={lc}>Birthdate *</label>
                                <input type="date" value={data.child_birthdate} onChange={e => handleBirthdateChange(e.target.value)} className={ic} required />
                            </div>
                            <div>
                                <label className={lc}>Age</label>
                                <input type="number" value={data.child_age} readOnly className={`${ic} bg-purple-50 cursor-not-allowed`} placeholder="Auto-calculated" />
                            </div>
                            <div className="md:col-span-3">
                                <label className={lc}>Address *</label>
                                <textarea value={data.child_address} onChange={e => setData('child_address', e.target.value)} className={`${ic} resize-none`} rows={2} required />
                            </div>
                            <div>
                                <label className={lc}>First Language *</label>
                                <input type="text" value={data.child_first_language} onChange={e => setData('child_first_language', e.target.value)} className={ic} required />
                            </div>
                            <div>
                                <label className={lc}>Second Language</label>
                                <input type="text" value={data.child_second_language} onChange={e => setData('child_second_language', e.target.value)} className={ic} />
                            </div>
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
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-5 space-y-4">
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                            <Users className="w-4 h-4" /> Parent Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={lc}>Father's Name</label>
                                <input type="text" value={data.father_name} onChange={e => setData('father_name', e.target.value)} className={ic} />
                            </div>
                            <div>
                                <label className={lc}>Father's Occupation</label>
                                <input type="text" value={data.father_occupation} onChange={e => setData('father_occupation', e.target.value)} className={ic} />
                            </div>
                            <div>
                                <label className={lc}>Mother's Name</label>
                                <input type="text" value={data.mother_name} onChange={e => setData('mother_name', e.target.value)} className={ic} />
                            </div>
                            <div>
                                <label className={lc}>Mother's Occupation</label>
                                <input type="text" value={data.mother_occupation} onChange={e => setData('mother_occupation', e.target.value)} className={ic} />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-5 space-y-4">
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                            <Phone className="w-4 h-4" /> Contact Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={lc}>Guardian Contact *</label>
                                <input type="text" value={data.guardian_contact} onChange={e => setData('guardian_contact', e.target.value)} className={ic} required />
                            </div>
                            <div>
                                <label className={lc}>Emergency Contact Name *</label>
                                <input type="text" value={data.emergency_contact_name} onChange={e => setData('emergency_contact_name', e.target.value)} className={ic} required />
                            </div>
                            <div>
                                <label className={lc}>Emergency Contact Phone *</label>
                                <input type="text" value={data.emergency_contact_phone} onChange={e => setData('emergency_contact_phone', e.target.value)} className={ic} required />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                            {processing ? 'Submitting...' : 'Submit Enrollment Request'}
                        </button>
                        <Link
                            href={route('parent.enrollment.index')}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/80 border border-purple-100 text-slate-600 text-sm font-semibold hover:bg-white transition-all"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </ParentLayout>
    );
}
