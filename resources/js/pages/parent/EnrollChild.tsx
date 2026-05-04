import ParentLayout from '@/layouts/parent-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Baby, User, Users, Phone, ArrowLeft, ArrowRight, Send, Camera, CheckCircle } from 'lucide-react';

const ic = 'w-full px-3 py-2 border border-sky-100 rounded-xl bg-white/80 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all';
const lc = 'block text-sm font-medium text-slate-600 mb-1';

const STEPS = ['Child Info', 'Father', 'Mother', 'Family', 'Child Profile', 'Health', 'Nutrition', 'Review'];

function StepIndicator({ current }: { current: number }) {
    return (
        <div className="flex items-center gap-1 mb-6">
            {STEPS.map((label, i) => (
                <div key={i} className="flex items-center gap-1 flex-1 last:flex-none">
                    <div className={`flex flex-col items-center`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                            ${i < current ? 'bg-teal-600 text-white' : i === current ? 'bg-gradient-to-r from-sky-500 to-teal-600 text-white shadow-md' : 'bg-sky-100 text-sky-400'}`}>
                            {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-[10px] mt-0.5 font-medium ${i === current ? 'text-teal-600' : 'text-slate-400'}`}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mb-3 rounded ${i < current ? 'bg-teal-600' : 'bg-sky-100'}`} />}
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

function CheckGroup({ label, options, value, onChange, span }: {
    label: string; options: string[]; value: string; onChange: (v: string) => void; span?: string;
}) {
    return (
        <div className={span}>
            <label className={lc}>{label}</label>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {options.map(o => (
                    <label key={o} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                        <input type="radio" name={label} value={o} checked={value === o} onChange={() => onChange(o)} className="accent-teal-500" />
                        {o}
                    </label>
                ))}
            </div>
        </div>
    );
}

function MultiCheck({ label, options, value, onChange, span }: {
    label: string; options: string[]; value: string[]; onChange: (v: string[]) => void; span?: string;
}) {
    const toggle = (o: string) => onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
    return (
        <div className={span}>
            <label className={lc}>{label}</label>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {options.map(o => (
                    <label key={o} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                        <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)} className="accent-teal-500" />
                        {o}
                    </label>
                ))}
            </div>
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
        // Form 1 — Guardian
        guardian_name: '', guardian_relationship: '', guardian_email: '',
        guardian_contact: '',
        // Form 1 — Emergency
        emergency_contact_name: '', emergency_contact_phone: '',
        emergency_home: '', emergency_work: '',
        // Form 1A — Father
        father_last_name: '', father_first_name: '', father_middle_name: '',
        father_birthdate: '', father_age: '',
        father_civil_status: '',
        father_district: '', father_purok: '',
        father_mother_tongue: '', father_other_dialects: '',
        father_education: '',
        father_occupation_status: '', father_occupation: '',
        father_contact_home: '', father_contact_work: '',
        // Form 1B — Mother
        mother_last_name: '', mother_first_name: '', mother_middle_name: '',
        mother_birthdate: '', mother_age: '',
        mother_pregnant: '',
        mother_civil_status: '',
        mother_district: '', mother_purok: '',
        mother_mother_tongue: '', mother_other_dialects: '',
        mother_education: '',
        mother_occupation_status: '', mother_occupation: '',
        mother_contact_home: '', mother_contact_work: '',
        mother_daycare_age_interest: '',
        // Form 1C — Family Profile
        home_ownership: '', home_material: '', home_nature: '',
        home_utilities: [] as string[],
        home_learning: [] as string[],
        home_household_members: [] as string[],
        monthly_income: '', no_of_siblings: '',
        // Form 2 — Child Profile
        birth_order: '', registered: '', born_at: '',
        child2_mother_tongue: '', other_dialects: '',
        height_cm: '', weight_kg: '',
        eccd_card: false, mother_child_book: false,
        vaccinations: {} as Record<string, string>,
        physical_deformity: [] as string[],
        problems_with: [] as string[],
        left_handed: '',
        siblings: [{ age: '', sex: '', in_school: '' }] as any[],
        prior_experiences: {} as Record<string, string>,
        learns_at_home_with: [] as string[],
        plays_older_siblings: '', plays_younger_siblings: '', plays_neighbors: '',
        meal_before_school: '',
        food_normally_eaten: [] as string[],
        has_baon: '',
        travel_time_dcc: '', travel_mode_dcc: '',
        travel_time_ncdc: '', travel_mode_ncdc: '',
        transport_type: [] as string[],
        goes_to_school_with: [] as string[],
        // Form 2 Health
        routine_hospital: '', routine_address: '', routine_phone: '',
        last_checkup_date: '', last_checkup_hospital: '',
        health_problems: {} as Record<string, any>,
        takes_medication: '', medication_description: '',
        special_treatment: '', treatment_type: '',
        serious_accident: '', accident_description: '',
        immunizations: {} as Record<string, string>,
        on_medication: '', medication_nature: '',
        // Form 3 — Nutrition
        height_1: '', height_2: '', weight_1: '', weight_2: '',
        nutritional_status_1: '', nutritional_status_2: '',
        date_1: '', date_2: '',
        food_allergies: '', usual_food: '', eating_habit: '',
        uses_bottle: '', bottle_frequency: '',
        breakfast_time: '', lunch_time: '',
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

    // Form 2 helpers
    const VACCINES = ['ECG','DPT','Oral Polio','Hepa B','Measles','Others'];
    const DEFORMITIES = ['Hare Lip','Cross-Eyed','Deaf','Blind','Disabled Leg','Disabled Arm/Hand','Deformity in Fingers/Toes'];
    const PROBLEMS = ['Behavior','Speaking','Hearing','Vision'];
    const PRIOR_TYPES = ['Nursery','Kindergarten','Preparatory'];
    const PRIOR_OPTIONS = ['Private Pre-School','Public Pre-School','Private Day Care','Public Day Care','Church Based','Home Based','Others'];
    const LEARNS_WITH = ['Nobody','Mother/Father/Both','Siblings','Relatives','Househelp/Maid','Tutor','Others'];
    const FREQ = ['Always','Sometimes','Rarely','Never'];
    const FOODS = ['Vegetable','Pork','Chicken','Beef','Fish','Rice','Noodle','Soup','Bread','Fruits','Cereals','Fruit Juice','Milk'];
    const BAON = ['Money','Food','Both','None',"Don't Know"];
    const TRANSPORT = ['School Bus','Tricycle','Father','Relatives','Bus','Habal-Habal','Banca','Calesa','Others'];
    const GOES_WITH = ['Mother','Father','Both Parents','Grandparents','Relatives','Maid','None'];
    const HEALTH_PROBLEMS = ['Allergies','Asthma','Bleeding','Bowels','Coughing','Diabetes','Ears or Deafness','Eyes or Vision','Other'];
    const IMMUNIZATIONS = ['DPT','BCG','Polio','MMR','Hepa B','Measles','Others'];

    const addSibling = () => setData('siblings', [...data.siblings, { age: '', sex: '', in_school: '' }]);
    const updateSibling = (i: number, key: string, val: string) => {
        const updated = [...data.siblings];
        updated[i] = { ...updated[i], [key]: val };
        setData('siblings', updated);
    };
    const setVaccine = (v: string, val: string) => setData('vaccinations', { ...data.vaccinations, [v]: val });
    const setPrior = (type: string, val: string) => setData('prior_experiences', { ...data.prior_experiences, [type]: val });
    const setHealthProblem = (p: string, key: string, val: string) =>
        setData('health_problems', { ...data.health_problems, [p]: { ...(data.health_problems[p] ?? {}), [key]: val } });
    const setImmunization = (v: string, val: string) => setData('immunizations', { ...data.immunizations, [v]: val });

    const card = 'bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-5 space-y-4';
    const nav = (
        <div className="flex items-center gap-3 pt-2">
            {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 border border-sky-100 text-slate-600 text-sm font-semibold hover:bg-white transition-all">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            )}
            {step < STEPS.length - 1 ? (
                <button type="button" onClick={() => setStep(s => s + 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                    Next <ArrowRight className="w-4 h-4" />
                </button>
            ) : (
                <button type="submit" disabled={processing}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                    <Send className="w-4 h-4" /> {processing ? 'Submitting...' : 'Submit Enrollment'}
                </button>
            )}
            <Link href={route('parent.enrollment.index')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 border border-sky-100 text-slate-600 text-sm font-semibold hover:bg-white transition-all">
                Cancel
            </Link>
        </div>
    );

    return (
        <ParentLayout>
            <Head title="Enroll New Child" />
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route('parent.enrollment.index')} className="text-slate-400 hover:text-teal-600 transition-colors">
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
                            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wide flex items-center gap-2">
                                <Baby className="w-4 h-4" /> Form 1 — Child Information
                            </h2>
                            {/* Photo */}
                            <div>
                                <label className={lc}>Child Photo <span className="text-slate-400 font-normal">(optional)</span></label>
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        {previewUrl
                                            ? <img src={previewUrl} alt="Preview" className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-100 shadow" />
                                            : <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 flex items-center justify-center border-2 border-dashed border-sky-200"><Camera className="w-7 h-7 text-sky-300" /></div>
                                        }
                                        <label htmlFor="child_photo" className="absolute -bottom-1 -right-1 bg-gradient-to-r from-sky-500 to-teal-600 text-white p-1.5 rounded-full cursor-pointer hover:shadow-md transition-all">
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
                                    <input type="number" value={data.child_age} readOnly className={`${ic} bg-sky-50 cursor-not-allowed`} placeholder="Auto-calculated" />
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

                            {/* Guardian */}
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">Guardian Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Guardian Name">
                                    <input type="text" value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Relationship">
                                    <input type="text" value={data.guardian_relationship} onChange={e => setData('guardian_relationship', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Email Address">
                                    <input type="email" value={data.guardian_email} onChange={e => setData('guardian_email', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Contact Number *" error={errors.guardian_contact}>
                                    <input type="text" value={data.guardian_contact} onChange={e => setData('guardian_contact', e.target.value)} className={ic} />
                                </Field>
                            </div>

                            {/* Emergency */}
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">In Case of Emergency</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Contact Name *" error={errors.emergency_contact_name}>
                                    <input type="text" value={data.emergency_contact_name} onChange={e => setData('emergency_contact_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Relationship">
                                    <input type="text" value={data.emergency_contact_phone} onChange={e => setData('emergency_contact_phone', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Home Number">
                                    <input type="text" value={data.emergency_home} onChange={e => setData('emergency_home', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Work Number">
                                    <input type="text" value={data.emergency_work} onChange={e => setData('emergency_work', e.target.value)} className={ic} />
                                </Field>
                            </div>
                        </div>
                    )}

                    {/* Step 1 — Form 1A: Father */}
                    {step === 1 && (
                        <div className={card}>
                            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wide flex items-center gap-2">
                                <User className="w-4 h-4" /> Form 1A — Father's Profile
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Last Name">
                                    <input type="text" value={data.father_last_name} onChange={e => setData('father_last_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="First Name">
                                    <input type="text" value={data.father_first_name} onChange={e => setData('father_first_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Middle Initial">
                                    <input type="text" value={data.father_middle_name} onChange={e => setData('father_middle_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Date of Birth">
                                    <input type="date" value={data.father_birthdate} onChange={e => setData((p: any) => ({ ...p, father_birthdate: e.target.value, father_age: calcAge(e.target.value) }))} className={ic} />
                                </Field>
                                <Field label="Age">
                                    <input type="number" value={data.father_age} readOnly className={`${ic} bg-sky-50 cursor-not-allowed`} placeholder="Auto-calculated" />
                                </Field>
                                <Field label="District">
                                    <input type="text" value={data.father_district} onChange={e => setData('father_district', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Purok / Zone">
                                    <input type="text" value={data.father_purok} onChange={e => setData('father_purok', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Contact (Home)">
                                    <input type="text" value={data.father_contact_home} onChange={e => setData('father_contact_home', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Contact (Work)">
                                    <input type="text" value={data.father_contact_work} onChange={e => setData('father_contact_work', e.target.value)} className={ic} />
                                </Field>
                            </div>
                            <CheckGroup label="Civil Status" options={['Single','Married','Separated','Widower','Live-in']} value={data.father_civil_status} onChange={v => setData('father_civil_status', v)} />
                            <CheckGroup label="Mother Tongue" options={['Tagalog','Visayan','Ilocano','Bicolnon','Others']} value={data.father_mother_tongue} onChange={v => setData('father_mother_tongue', v)} />
                            <Field label="Other Dialects Spoken at Home">
                                <input type="text" value={data.father_other_dialects} onChange={e => setData('father_other_dialects', e.target.value)} className={ic} />
                            </Field>
                            <CheckGroup label="Educational Attainment" options={['Elem./Graduate','Highschool/Graduate','College/Graduate','Technical/Vocational','Masteral Unit/Degree','Doctoral Unit/Degree']} value={data.father_education} onChange={v => setData('father_education', v)} />
                            <CheckGroup label="Occupational Status" options={['Employed','Unemployed','Retired','OFW','Others']} value={data.father_occupation_status} onChange={v => setData('father_occupation_status', v)} />
                            <Field label="Occupation / Specify">
                                <input type="text" value={data.father_occupation} onChange={e => setData('father_occupation', e.target.value)} className={ic} />
                            </Field>
                        </div>
                    )}

                    {/* Step 2 — Form 1B: Mother */}
                    {step === 2 && (
                        <div className={card}>
                            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wide flex items-center gap-2">
                                <User className="w-4 h-4" /> Form 1B — Mother's Profile
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Last Name">
                                    <input type="text" value={data.mother_last_name} onChange={e => setData('mother_last_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="First Name">
                                    <input type="text" value={data.mother_first_name} onChange={e => setData('mother_first_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Middle Initial">
                                    <input type="text" value={data.mother_middle_name} onChange={e => setData('mother_middle_name', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Date of Birth">
                                    <input type="date" value={data.mother_birthdate} onChange={e => setData((p: any) => ({ ...p, mother_birthdate: e.target.value, mother_age: calcAge(e.target.value) }))} className={ic} />
                                </Field>
                                <Field label="Age">
                                    <input type="number" value={data.mother_age} readOnly className={`${ic} bg-sky-50 cursor-not-allowed`} placeholder="Auto-calculated" />
                                </Field>
                                <Field label="District">
                                    <input type="text" value={data.mother_district} onChange={e => setData('mother_district', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Purok / Zone">
                                    <input type="text" value={data.mother_purok} onChange={e => setData('mother_purok', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Contact (Home)">
                                    <input type="text" value={data.mother_contact_home} onChange={e => setData('mother_contact_home', e.target.value)} className={ic} />
                                </Field>
                                <Field label="Contact (Work)">
                                    <input type="text" value={data.mother_contact_work} onChange={e => setData('mother_contact_work', e.target.value)} className={ic} />
                                </Field>
                            </div>
                            <CheckGroup label="Pregnant?" options={['Yes','No']} value={data.mother_pregnant} onChange={v => setData('mother_pregnant', v)} />
                            <CheckGroup label="Civil Status" options={['Single','Married','Separated','Widower','Live-in']} value={data.mother_civil_status} onChange={v => setData('mother_civil_status', v)} />
                            <CheckGroup label="Mother Tongue" options={['Tagalog','Visayan','Ilocano','Bicolnon','Others']} value={data.mother_mother_tongue} onChange={v => setData('mother_mother_tongue', v)} />
                            <Field label="Other Dialects Spoken at Home">
                                <input type="text" value={data.mother_other_dialects} onChange={e => setData('mother_other_dialects', e.target.value)} className={ic} />
                            </Field>
                            <CheckGroup label="Educational Attainment" options={['Elem./Graduate','Highschool/Graduate','College/Graduate','Technical/Vocational','Masteral Unit/Degree','Doctoral Unit/Degree']} value={data.mother_education} onChange={v => setData('mother_education', v)} />
                            <CheckGroup label="Occupational Status" options={['Employed','Unemployed','Retired','OFW','Others']} value={data.mother_occupation_status} onChange={v => setData('mother_occupation_status', v)} />
                            <Field label="Occupation / Specify">
                                <input type="text" value={data.mother_occupation} onChange={e => setData('mother_occupation', e.target.value)} className={ic} />
                            </Field>
                            <CheckGroup label="At what age are you interested to put your child in a Day Care Center?" options={['Below 1 year old','1 year old','2 years old','3 years old','4 years old']} value={data.mother_daycare_age_interest} onChange={v => setData('mother_daycare_age_interest', v)} />
                        </div>
                    )}

                    {/* Step 3 — Form 1C: Family & Contact */}
                    {step === 3 && (
                        <div className={card}>
                            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wide flex items-center gap-2">
                                <Users className="w-4 h-4" /> Form 1C — Family Profile
                            </h2>
                            <CheckGroup label="Home Ownership" options={['Owned','Rented','With Parents','With Relatives']} value={data.home_ownership} onChange={v => setData('home_ownership', v)} />
                            <CheckGroup label="Home Materials" options={['Nipa','Wood','Concrete','Make Shift']} value={data.home_material} onChange={v => setData('home_material', v)} />
                            <CheckGroup label="Home Nature" options={['One Room','Multiple Rooms']} value={data.home_nature} onChange={v => setData('home_nature', v)} />
                            <MultiCheck
                                label="Utilities & Appliances"
                                options={['Running water','Electricity','Aircon','Mobile phone','Computer','Internet','CD/DVD player','Television','Radio']}
                                value={data.home_utilities}
                                onChange={v => setData('home_utilities', v)}
                            />
                            <MultiCheck
                                label="Learning & Recreation"
                                options={['Magazine/comics','Newspaper','Pets','Books','Story/picture books','Toys','Board Games','Puzzle']}
                                value={data.home_learning}
                                onChange={v => setData('home_learning', v)}
                            />
                            <MultiCheck
                                label="Persons in Same Household"
                                options={['Immediate Family (Father, Mother, Siblings)','Relatives (Aunts, Uncles, Cousins, Grandparents)','Non-Relatives (Househelp/Nanny)']}
                                value={data.home_household_members}
                                onChange={v => setData('home_household_members', v)}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                <Field label="Monthly Income">
                                    <input type="number" value={data.monthly_income} onChange={e => setData('monthly_income', e.target.value)} className={ic} />
                                </Field>
                                <Field label="No. of Siblings">
                                    <input type="number" value={data.no_of_siblings} onChange={e => setData('no_of_siblings', e.target.value)} className={ic} />
                                </Field>
                            </div>
                        </div>
                    )}

                    {/* Step 4 — Form 2: Child Profile */}
                    {step === 4 && (
                        <div className={card}>
                            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wide flex items-center gap-2">
                                <Baby className="w-4 h-4" /> Form 2 — Children's Profile
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Birth Order"><input type="number" value={data.birth_order} onChange={e => setData('birth_order', e.target.value)} className={ic} /></Field>
                                <Field label="Height (cm)"><input type="number" value={data.height_cm} onChange={e => setData('height_cm', e.target.value)} className={ic} /></Field>
                                <Field label="Weight (kg)"><input type="number" value={data.weight_kg} onChange={e => setData('weight_kg', e.target.value)} className={ic} /></Field>
                            </div>
                            <CheckGroup label="Registered" options={['Yes','No']} value={data.registered} onChange={v => setData('registered', v)} />
                            <CheckGroup label="Born At" options={['Hospital','Health Center','Home']} value={data.born_at} onChange={v => setData('born_at', v)} />
                            <CheckGroup label="Mother Tongue" options={['Tagalog','Visayan','Ilocano','Bicolnon','Others']} value={data.child2_mother_tongue} onChange={v => setData('child2_mother_tongue', v)} />
                            <Field label="Other Dialects"><input type="text" value={data.other_dialects} onChange={e => setData('other_dialects', e.target.value)} className={ic} /></Field>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <input type="checkbox" checked={data.eccd_card} onChange={e => setData('eccd_card', e.target.checked)} className="accent-teal-500" /> ECCD Card
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <input type="checkbox" checked={data.mother_child_book} onChange={e => setData('mother_child_book', e.target.checked)} className="accent-teal-500" /> Mother & Child Book
                                </label>
                            </div>
                            <CheckGroup label="Left Handed" options={['Yes','No']} value={data.left_handed} onChange={v => setData('left_handed', v)} />
                            {/* Vaccinations */}
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">Vaccination & Health Data</h3>
                            <div className="space-y-2">
                                {VACCINES.map(v => (
                                    <div key={v} className="flex items-center gap-4">
                                        <span className="text-sm text-slate-600 w-24">{v}</span>
                                        {['Yes','No',"Don't Know"].map(opt => (
                                            <label key={opt} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                                                <input type="radio" checked={data.vaccinations[v] === opt} onChange={() => setVaccine(v, opt)} className="accent-teal-500" /> {opt}
                                            </label>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            {/* Physical */}
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">Physical Attributes</h3>
                            <MultiCheck label="Physical Deformity" options={DEFORMITIES} value={data.physical_deformity} onChange={v => setData('physical_deformity', v)} />
                            <MultiCheck label="Problems With" options={PROBLEMS} value={data.problems_with} onChange={v => setData('problems_with', v)} />
                            {/* Siblings */}
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">Siblings</h3>
                            {data.siblings.map((s: any, i: number) => (
                                <div key={i} className="grid grid-cols-3 gap-3">
                                    <Field label="Age"><input type="number" value={s.age} onChange={e => updateSibling(i,'age',e.target.value)} className={ic} /></Field>
                                    <Field label="Sex"><select value={s.sex} onChange={e => updateSibling(i,'sex',e.target.value)} className={ic}><option value="">—</option><option>Male</option><option>Female</option></select></Field>
                                    <Field label="In School"><select value={s.in_school} onChange={e => updateSibling(i,'in_school',e.target.value)} className={ic}><option value="">—</option><option>In School</option><option>Out of School</option></select></Field>
                                </div>
                            ))}
                            <button type="button" onClick={addSibling} className="text-sm text-teal-600 hover:underline">+ Add sibling</button>
                            {/* Prior Experiences */}
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">Prior Early Childhood Experiences</h3>
                            {PRIOR_TYPES.map(type => (
                                <div key={type}>
                                    <p className="text-xs font-semibold text-slate-500 mb-1">{type}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                        {PRIOR_OPTIONS.map(o => (
                                            <label key={o} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                                                <input type="radio" checked={data.prior_experiences[type] === o} onChange={() => setPrior(type, o)} className="accent-teal-500" /> {o}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {/* Performance */}
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">Performance & Logistics</h3>
                            <MultiCheck label="Learns at Home With" options={LEARNS_WITH} value={data.learns_at_home_with} onChange={v => setData('learns_at_home_with', v)} />
                            <CheckGroup label="Plays with Older Siblings" options={FREQ} value={data.plays_older_siblings} onChange={v => setData('plays_older_siblings', v)} />
                            <CheckGroup label="Plays with Younger Siblings" options={FREQ} value={data.plays_younger_siblings} onChange={v => setData('plays_younger_siblings', v)} />
                            <CheckGroup label="Plays with Neighbors" options={FREQ} value={data.plays_neighbors} onChange={v => setData('plays_neighbors', v)} />
                            <CheckGroup label="Meal Before School" options={FREQ} value={data.meal_before_school} onChange={v => setData('meal_before_school', v)} />
                            <MultiCheck label="Food Normally Eaten" options={FOODS} value={data.food_normally_eaten} onChange={v => setData('food_normally_eaten', v)} />
                            <CheckGroup label="Has Baon" options={BAON} value={data.has_baon} onChange={v => setData('has_baon', v)} />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Field label="Travel Time to DCC (mins)"><input type="text" value={data.travel_time_dcc} onChange={e => setData('travel_time_dcc', e.target.value)} className={ic} /></Field>
                                <Field label="Mode to DCC"><select value={data.travel_mode_dcc} onChange={e => setData('travel_mode_dcc', e.target.value)} className={ic}><option value="">—</option><option>Walking</option><option>Private Vehicle</option><option>Public Transportation</option></select></Field>
                                <Field label="Travel Time to NCDC (mins)"><input type="text" value={data.travel_time_ncdc} onChange={e => setData('travel_time_ncdc', e.target.value)} className={ic} /></Field>
                                <Field label="Mode to NCDC"><select value={data.travel_mode_ncdc} onChange={e => setData('travel_mode_ncdc', e.target.value)} className={ic}><option value="">—</option><option>Walking</option><option>Private Vehicle</option><option>Public Transportation</option></select></Field>
                            </div>
                            <MultiCheck label="Transport Type" options={TRANSPORT} value={data.transport_type} onChange={v => setData('transport_type', v)} />
                            <MultiCheck label="Goes to School With" options={GOES_WITH} value={data.goes_to_school_with} onChange={v => setData('goes_to_school_with', v)} />
                        </div>
                    )}

                    {/* Step 5 — Form 2 Health Assessment */}
                    {step === 5 && (
                        <div className={card}>
                            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wide flex items-center gap-2">
                                <User className="w-4 h-4" /> Form 2 — Health Assessment
                            </h2>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Routine Care</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Hospital / Center" span="md:col-span-2"><input type="text" value={data.routine_hospital} onChange={e => setData('routine_hospital', e.target.value)} className={ic} /></Field>
                                <Field label="Phone"><input type="text" value={data.routine_phone} onChange={e => setData('routine_phone', e.target.value)} className={ic} /></Field>
                                <Field label="Address" span="md:col-span-3"><input type="text" value={data.routine_address} onChange={e => setData('routine_address', e.target.value)} className={ic} /></Field>
                                <Field label="Last Check-up Date"><input type="date" value={data.last_checkup_date} onChange={e => setData('last_checkup_date', e.target.value)} className={ic} /></Field>
                                <Field label="Last Check-up Hospital" span="md:col-span-2"><input type="text" value={data.last_checkup_hospital} onChange={e => setData('last_checkup_hospital', e.target.value)} className={ic} /></Field>
                            </div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">Health Problems</h3>
                            <div className="space-y-2">
                                {HEALTH_PROBLEMS.map(p => (
                                    <div key={p} className="grid grid-cols-3 gap-3 items-start">
                                        <span className="text-sm text-slate-600">{p}</span>
                                        <div className="flex gap-4">
                                            {['Yes','No'].map(opt => (
                                                <label key={opt} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                                                    <input type="radio" checked={data.health_problems[p]?.answer === opt} onChange={() => setHealthProblem(p,'answer',opt)} className="accent-teal-500" /> {opt}
                                                </label>
                                            ))}
                                        </div>
                                        <input type="text" placeholder="Comments" value={data.health_problems[p]?.comment ?? ''} onChange={e => setHealthProblem(p,'comment',e.target.value)} className={ic} />
                                    </div>
                                ))}
                            </div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">Medication & Treatment</h3>
                            <CheckGroup label="Takes medication?" options={['Yes','No']} value={data.takes_medication} onChange={v => setData('takes_medication', v)} />
                            {data.takes_medication === 'Yes' && <Field label="Describe"><input type="text" value={data.medication_description} onChange={e => setData('medication_description', e.target.value)} className={ic} /></Field>}
                            <CheckGroup label="Special treatment? (nebulizer, etc.)" options={['Yes','No']} value={data.special_treatment} onChange={v => setData('special_treatment', v)} />
                            {data.special_treatment === 'Yes' && <Field label="Type"><input type="text" value={data.treatment_type} onChange={e => setData('treatment_type', e.target.value)} className={ic} /></Field>}
                            <CheckGroup label="Serious accident?" options={['Yes','No']} value={data.serious_accident} onChange={v => setData('serious_accident', v)} />
                            {data.serious_accident === 'Yes' && <Field label="Describe"><input type="text" value={data.accident_description} onChange={e => setData('accident_description', e.target.value)} className={ic} /></Field>}
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">Immunizations</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {IMMUNIZATIONS.map(v => (
                                    <Field key={v} label={v}><input type="text" placeholder="Date" value={data.immunizations[v] ?? ''} onChange={e => setImmunization(v, e.target.value)} className={ic} /></Field>
                                ))}
                            </div>
                            <CheckGroup label="On medication?" options={['Yes','No']} value={data.on_medication} onChange={v => setData('on_medication', v)} />
                            {data.on_medication === 'Yes' && <Field label="Nature and duration"><input type="text" value={data.medication_nature} onChange={e => setData('medication_nature', e.target.value)} className={ic} /></Field>}
                        </div>
                    )}

                    {/* Step 6 — Form 3: Nutrition */}
                    {step === 6 && (
                        <div className={card}>
                            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wide flex items-center gap-2">
                                <Users className="w-4 h-4" /> Form 3 — Nutrition Status
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-slate-600">
                                    <thead><tr className="text-xs text-slate-400 uppercase">
                                        <th className="text-left pb-2">Measurement</th>
                                        <th className="pb-2">1st Result</th><th className="pb-2">2nd Result</th>
                                        <th className="pb-2">1st Date</th><th className="pb-2">2nd Date</th>
                                    </tr></thead>
                                    <tbody>
                                        <tr>
                                            <td className="pr-4 py-1 font-medium">Height (cm)</td>
                                            <td className="px-2 py-1"><input type="number" value={data.height_1} onChange={e => setData('height_1', e.target.value)} className={ic} /></td>
                                            <td className="px-2 py-1"><input type="number" value={data.height_2} onChange={e => setData('height_2', e.target.value)} className={ic} /></td>
                                            <td className="px-2 py-1"><input type="date" value={data.date_1} onChange={e => setData('date_1', e.target.value)} className={ic} /></td>
                                            <td className="px-2 py-1"><input type="date" value={data.date_2} onChange={e => setData('date_2', e.target.value)} className={ic} /></td>
                                        </tr>
                                        <tr>
                                            <td className="pr-4 py-1 font-medium">Weight (kg)</td>
                                            <td className="px-2 py-1"><input type="number" value={data.weight_1} onChange={e => setData('weight_1', e.target.value)} className={ic} /></td>
                                            <td className="px-2 py-1"><input type="number" value={data.weight_2} onChange={e => setData('weight_2', e.target.value)} className={ic} /></td>
                                            <td></td><td></td>
                                        </tr>
                                        <tr>
                                            <td className="pr-4 py-1 font-medium">Nutritional Status</td>
                                            <td className="px-2 py-1"><input type="text" value={data.nutritional_status_1} onChange={e => setData('nutritional_status_1', e.target.value)} className={ic} /></td>
                                            <td className="px-2 py-1"><input type="text" value={data.nutritional_status_2} onChange={e => setData('nutritional_status_2', e.target.value)} className={ic} /></td>
                                            <td></td><td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide pt-2">Feeding / Eating</h3>
                            <Field label="Food allergies?"><input type="text" value={data.food_allergies} onChange={e => setData('food_allergies', e.target.value)} className={ic} placeholder="Describe if any" /></Field>
                            <Field label="Usual food given"><input type="text" value={data.usual_food} onChange={e => setData('usual_food', e.target.value)} className={ic} /></Field>
                            <Field label="Eating habit (bottle food, finger food, etc.)"><input type="text" value={data.eating_habit} onChange={e => setData('eating_habit', e.target.value)} className={ic} /></Field>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Uses bottle?">
                                    <select value={data.uses_bottle} onChange={e => setData('uses_bottle', e.target.value)} className={ic}>
                                        <option value="">—</option><option>Yes</option><option>No</option>
                                    </select>
                                </Field>
                                {data.uses_bottle === 'Yes' && <Field label="How often?"><input type="text" value={data.bottle_frequency} onChange={e => setData('bottle_frequency', e.target.value)} className={ic} /></Field>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Breakfast Time"><input type="time" value={data.breakfast_time} onChange={e => setData('breakfast_time', e.target.value)} className={ic} /></Field>
                                <Field label="Lunch Time"><input type="time" value={data.lunch_time} onChange={e => setData('lunch_time', e.target.value)} className={ic} /></Field>
                            </div>
                        </div>
                    )}
                    {step === 7 && (
                        <div className="space-y-4">
                            {[
                                {
                                    title: 'Child Information', icon: <Baby className="w-4 h-4" />, rows: [
                                        ['Name', `${data.child_last_name}, ${data.child_first_name} ${data.child_middle_name}`],
                                        ['Sex', data.child_sex], ['Birthdate', data.child_birthdate], ['Age', data.child_age],
                                        ['Address', data.child_address],
                                        ['Languages', `${data.child_first_language}${data.child_second_language ? ', ' + data.child_second_language : ''}`],
                                        ['Purok/Zone', data.purok_zone],
                                        ['Guardian', data.guardian_name], ['Relationship', data.guardian_relationship],
                                        ['Guardian Email', data.guardian_email], ['Guardian Contact', data.guardian_contact],
                                        ['Emergency Contact', data.emergency_contact_name],
                                        ['Emergency Home', data.emergency_home], ['Emergency Work', data.emergency_work],
                                    ]
                                },
                                {
                                    title: "Father's Profile", icon: <User className="w-4 h-4" />, rows: [
                                        ['Name', `${data.father_last_name}, ${data.father_first_name} ${data.father_middle_name}`],
                                        ['Birthdate', data.father_birthdate], ['Age', data.father_age],
                                        ['Civil Status', data.father_civil_status],
                                        ['District', data.father_district], ['Purok', data.father_purok],
                                        ['Mother Tongue', data.father_mother_tongue],
                                        ['Other Dialects', data.father_other_dialects],
                                        ['Education', data.father_education],
                                        ['Occupation Status', data.father_occupation_status],
                                        ['Occupation', data.father_occupation],
                                        ['Contact Home', data.father_contact_home], ['Contact Work', data.father_contact_work],
                                    ]
                                },
                                {
                                    title: "Mother's Profile", icon: <User className="w-4 h-4" />, rows: [
                                        ['Name', `${data.mother_last_name}, ${data.mother_first_name} ${data.mother_middle_name}`],
                                        ['Birthdate', data.mother_birthdate], ['Age', data.mother_age],
                                        ['Pregnant', data.mother_pregnant],
                                        ['Civil Status', data.mother_civil_status],
                                        ['District', data.mother_district], ['Purok', data.mother_purok],
                                        ['Mother Tongue', data.mother_mother_tongue],
                                        ['Other Dialects', data.mother_other_dialects],
                                        ['Education', data.mother_education],
                                        ['Occupation Status', data.mother_occupation_status],
                                        ['Occupation', data.mother_occupation],
                                        ['Contact Home', data.mother_contact_home], ['Contact Work', data.mother_contact_work],
                                        ['Daycare Age Interest', data.mother_daycare_age_interest],
                                    ]
                                },
                                {
                                    title: 'Family Profile', icon: <Users className="w-4 h-4" />, rows: [
                                        ['Home Ownership', data.home_ownership],
                                        ['Home Material', data.home_material],
                                        ['Home Nature', data.home_nature],
                                        ['Utilities', data.home_utilities?.join(', ')],
                                        ['Learning & Recreation', data.home_learning?.join(', ')],
                                        ['Household Members', data.home_household_members?.join(', ')],
                                        ['Monthly Income', data.monthly_income],
                                        ['No. of Siblings', data.no_of_siblings],
                                    ]
                                },
                            ].map(section => (
                                <div key={section.title} className={card}>
                                    <h2 className="text-sm font-bold text-teal-600 uppercase tracking-wide flex items-center gap-2">
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
