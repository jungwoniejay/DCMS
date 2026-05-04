import ParentLayout from '@/layouts/parent-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Baby, User, Users, Phone, ArrowLeft, ArrowRight, Send, Camera, CheckCircle } from 'lucide-react';

const ic = 'w-full px-3 py-2 border border-purple-100 rounded-xl bg-white/80 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all';
const lc = 'block text-sm font-medium text-slate-600 mb-1';

const STEPS = ['Child Info', 'Father', 'Mother', 'Family & Contact', 'Review'];

function StepIndicator({ current }: { current: number }) {
    return (
        <div className="flex items-center gap-1 mb-6">
            {STEPS.map((label, i) => (
                <div key={i} className="flex items-center gap-1 flex-1 last:flex-none">
                    <div className={`flex flex-col items-center`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                            ${i < current ? 'bg-purple-600 text-white' : i === current ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' : 'bg-purple-100 text-purple-400'}`}>
                            {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-[10px] mt-0.5 font-medium ${i === current ? 'text-purple-600' : 'text-slate-400'}`}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mb-3 rounded ${i < current ? 'bg-purple-600' : 'bg-purple-100'}`} />}
                </div>
            ))}
        </div>
    );
}

function Field({ label, error, children, span }: { label: string; error?: string; children: React.ReactNode; span?: string }) {
    return (
        <div className={span}>
            <label className={lc}>{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function EnrollChild({ puroks }: { puroks: string[] }) {
    const [step, setStep] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<any>({
        // Form 1 — Child
        child_last_name: '', child_first_name: '', child_middle_name: '',
        child_sex: 'Male', child_birthdate: '', child_age: '',
        child_address: '', child_first_language: 'Tagalog',
        child_second_language: '', purok_zone: '', child_photo: null as File | null,
        // Form 1A — Father
        father_last_name: '', father_first_name: '', father_middle_name: '',
        father_birthdate: '', father_age: '', father_occupation: '',
        father_education: '', father_contact: '',
        // Form 1B — Mother
        mother_last_name: '', mother_first_name: '', mother_middle_name: '',
        mother_birthdate: '', mother_age: '', mother_occupation: '',
        mother_education: '', mother_contact: '',
        // Form 1C — Family & Contact
        monthly_income: '', no_of_siblings: '',
        guardian_contact: '', emergency_contact_name: '', emergency_contact_phone: '',
    });

    const calcAge = (birthdate: string) =>
        birthdate ? String(Math.floor((Date.now() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))) : '';

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('child_photo', file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!confirm('Submit this enrollment request?')) return;
        post(route('parent.enroll.store'), { forceFormData: true });
    };

    const card = 'bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-5 space-y-4';
    const nav = (
        <div className="flex items-center gap-3 pt-2">
            {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 border border-purple-100 text-slate-600 text-sm font-semibold hover:bg-white transition-all">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            )}
            {step < STEPS.length - 1 ? (
                <button type="button" onClick={() => setStep(s => s + 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                    Next <ArrowRight className="w-4 h-4" />
                </button>
            ) : (
                <button type="submit" disabled={processing}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                    <Send className="w-4 h-4" /> {processing ? 'Submitting...' : 'Submit Enrollment'}
                </button>
            )}
            <Link href={route('parent.enrollment.index')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 border border-purple-100 text-slate-600 text-sm font-semibold hover:bg-white transition-all">
                Cancel
            </Link>
        </div>
    );

    return (
        <ParentLayout>
            <Head title="Enroll New Child" />
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route('parent.enrollment.index')} className="text-slate-400 hover:text-purple-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Enroll New Child</h1>
                        <p className="text-slate-500 mt-1 text-sm">Submit an enrollment request. Admin approval is required.</p>
                    </div>
                </div>

                <StepIndicator current={step} />

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Step 0 — Form 1: Child Info */}
                    {step === 0 && (
                        <div className={card}>
                            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                                <Baby className="w-4 h-4" /> Form 1 — Child Information
                            </h2>
                            {/* Photo */}
                            <div>
                                <label className={lc}>Child Photo <span className="text-slate-400 font-normal">(optional)</span></label>
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        {previewUrl
                                            ? <img src={previewUrl} alt="Preview" className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-100 shadow" />
                                            : <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center border-2 border-dashed border-purple-200"><Camera className="w-7 h-7 text-purple-300" /></div>
                                        }
                                        <label htmlFor="child_photo" className="absolute -bottom-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-1.5 rounded-full cursor-pointer hover:shadow-md transition-all">
                                            <Camera className="w-3 h-3" />
                                        </label>
                                        <input id="child_photo" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Upload a photo of your child</p>
                                        <p className="text-xs text-slate-400 mt-0.5">JPG, PNG or GIF (max 2MB)</p>
                                        {previewUrl && (
                                            <button type="button" onClick={() => { setPreviewUrl(null); setData('child_photo', null); }} className="text-xs text-red-400 hover:text-red-600 mt-1">Remove photo</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Last Name *" error={errors.child_last_name}>
                                    <input type="text" value={data.child_last_name} onChange={e => setData('child_last_name', e.target.value)} className={ic} required />
                                </Field>
                                <Field label="First Name *" error={errors.child_first_name}>
                                    <input type="text" value={data.child_first_name} onChange={e => setData('child_first_name', e.target.value)} className={ic} required />
                                </Field>
                                <Field label="Middle Name">
                                    <input type="text" value={data.child_middle_name} onChange={e => setData('child_middle_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Sex *">
                                    <select value={data.child_sex} onChange={e => setData('child_sex', e.target.value)} className={ic} required>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </Field>
                                <Field label="Birthdate *" error={errors.child_birthdate}>
                                    <input type="date" value={data.child_birthdate} onChange={e => setData((p: any) => ({ ...p, child_birthdate: e.target.value, child_age: calcAge(e.target.value) }))} className={ic} required />
                                </Field>
                                <Field label="Age">
                                    <input type="number" value={data.child_age} readOnly className={`${ic} bg-purple-50 cursor-not-allowed`} placeholder="Auto-calculated" />
                                </Field>
                                <Field label="Address *" error={errors.child_address} span="md:col-span-3">
                                    <textarea value={data.child_address} onChange={e => setData('child_address', e.target.value)} className={`${ic} resize-none`} rows={2} required />
                                </Field>
                                <Field label="First Language *">
                                    <input type="text" value={data.child_first_language} onChange={e => setData('child_first_language', e.target.value)} className={ic} required />
                                </Field>
                                <Field label="Second Language">
                                    <input type="text" value={data.child_second_language} onChange={e => setData('child_second_language', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Purok / Zone *" error={errors.purok_zone}>
                                    <select value={data.purok_zone} onChange={e => setData('purok_zone', e.target.value)} className={ic} required>
                                        <option value="">Select Purok/Zone...</option>
                                        {puroks.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </Field>
                            </div>
                        </div>
                    )}

                    {/* Step 1 — Form 1A: Father */}
                    {step === 1 && (
                        <div className={card}>
                            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                                <User className="w-4 h-4" /> Form 1A — Father's Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Last Name">
                                    <input type="text" value={data.father_last_name} onChange={e => setData('father_last_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="First Name">
                                    <input type="text" value={data.father_first_name} onChange={e => setData('father_first_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Middle Name">
                                    <input type="text" value={data.father_middle_name} onChange={e => setData('father_middle_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Birthdate">
                                    <input type="date" value={data.father_birthdate} onChange={e => setData((p: any) => ({ ...p, father_birthdate: e.target.value, father_age: calcAge(e.target.value) }))} className={ic} />
                                </Field>
                                <Field label="Age">
                                    <input type="number" value={data.father_age} readOnly className={`${ic} bg-purple-50 cursor-not-allowed`} placeholder="Auto-calculated" />
                                </Field>
                                <Field label="Occupation">
                                    <input type="text" value={data.father_occupation} onChange={e => setData('father_occupation', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Highest Education">
                                    <input type="text" value={data.father_education} onChange={e => setData('father_education', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Contact Number">
                                    <input type="text" value={data.father_contact} onChange={e => setData('father_contact', e.target.value)} className={ic} />
                                </Field>
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Form 1B: Mother */}
                    {step === 2 && (
                        <div className={card}>
                            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                                <User className="w-4 h-4" /> Form 1B — Mother's Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Last Name">
                                    <input type="text" value={data.mother_last_name} onChange={e => setData('mother_last_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="First Name">
                                    <input type="text" value={data.mother_first_name} onChange={e => setData('mother_first_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Middle Name">
                                    <input type="text" value={data.mother_middle_name} onChange={e => setData('mother_middle_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Birthdate">
                                    <input type="date" value={data.mother_birthdate} onChange={e => setData((p: any) => ({ ...p, mother_birthdate: e.target.value, mother_age: calcAge(e.target.value) }))} className={ic} />
                                </Field>
                                <Field label="Age">
                                    <input type="number" value={data.mother_age} readOnly className={`${ic} bg-purple-50 cursor-not-allowed`} placeholder="Auto-calculated" />
                                </Field>
                                <Field label="Occupation">
                                    <input type="text" value={data.mother_occupation} onChange={e => setData('mother_occupation', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Highest Education">
                                    <input type="text" value={data.mother_education} onChange={e => setData('mother_education', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Contact Number">
                                    <input type="text" value={data.mother_contact} onChange={e => setData('mother_contact', e.target.value)} className={ic} />
                                </Field>
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Form 1C: Family & Contact */}
                    {step === 3 && (
                        <div className={card}>
                            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                                <Users className="w-4 h-4" /> Form 1C — Family & Contact
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Monthly Income">
                                    <input type="number" value={data.monthly_income} onChange={e => setData('monthly_income', e.target.value)} className={ic} />
                                </Field>
                                <Field label="No. of Siblings">
                                    <input type="number" value={data.no_of_siblings} onChange={e => setData('no_of_siblings', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Guardian Contact *" error={errors.guardian_contact}>
                                    <input type="text" value={data.guardian_contact} onChange={e => setData('guardian_contact', e.target.value)} className={ic} required />
                                </Field>
                                <Field label="Emergency Contact Name *" error={errors.emergency_contact_name}>
                                    <input type="text" value={data.emergency_contact_name} onChange={e => setData('emergency_contact_name', e.target.value)} className={ic} required />
                                </Field>
                                <Field label="Emergency Contact Phone *" error={errors.emergency_contact_phone}>
                                    <input type="text" value={data.emergency_contact_phone} onChange={e => setData('emergency_contact_phone', e.target.value)} className={ic} required />
                                </Field>
                            </div>
                        </div>
                    )}

                    {/* Step 4 — Review */}
                    {step === 4 && (
                        <div className="space-y-4">
                            {[
                                {
                                    title: 'Child Information', icon: <Baby className="w-4 h-4" />, rows: [
                                        ['Name', `${data.child_last_name}, ${data.child_first_name} ${data.child_middle_name}`],
                                        ['Sex', data.child_sex], ['Birthdate', data.child_birthdate], ['Age', data.child_age],
                                        ['Address', data.child_address], ['Languages', `${data.child_first_language}${data.child_second_language ? ', ' + data.child_second_language : ''}`],
                                        ['Purok/Zone', data.purok_zone],
                                    ]
                                },
                                {
                                    title: "Father's Info", icon: <User className="w-4 h-4" />, rows: [
                                        ['Name', `${data.father_last_name}, ${data.father_first_name} ${data.father_middle_name}`],
                                        ['Birthdate', data.father_birthdate], ['Age', data.father_age],
                                        ['Occupation', data.father_occupation], ['Education', data.father_education], ['Contact', data.father_contact],
                                    ]
                                },
                                {
                                    title: "Mother's Info", icon: <User className="w-4 h-4" />, rows: [
                                        ['Name', `${data.mother_last_name}, ${data.mother_first_name} ${data.mother_middle_name}`],
                                        ['Birthdate', data.mother_birthdate], ['Age', data.mother_age],
                                        ['Occupation', data.mother_occupation], ['Education', data.mother_education], ['Contact', data.mother_contact],
                                    ]
                                },
                                {
                                    title: 'Family & Contact', icon: <Users className="w-4 h-4" />, rows: [
                                        ['Monthly Income', data.monthly_income], ['No. of Siblings', data.no_of_siblings],
                                        ['Guardian Contact', data.guardian_contact],
                                        ['Emergency Contact', data.emergency_contact_name], ['Emergency Phone', data.emergency_contact_phone],
                                    ]
                                },
                            ].map(section => (
                                <div key={section.title} className={card}>
                                    <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide flex items-center gap-2">
                                        {section.icon} {section.title}
                                    </h2>
                                    <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                                        {section.rows.map(([k, v]) => v ? (
                                            <div key={k}>
                                                <dt className="text-xs text-slate-400">{k}</dt>
                                                <dd className="text-sm text-slate-700 font-medium">{v}</dd>
                                            </div>
                                        ) : null)}
                                    </dl>
                                </div>
                            ))}
                        </div>
                    )}

                    {nav}
                </form>
            </div>
        </ParentLayout>
    );
}
