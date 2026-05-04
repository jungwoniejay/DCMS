import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save, User, Camera } from 'lucide-react';
import { useState } from 'react';

const ic = 'w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400';
const lc = 'block text-sm font-medium text-slate-600 mb-1';

const Section = ({ title, subtitle, children }: any) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {children}
    </div>
);

const CheckGroup = ({ label, name, checked, onChange }: any) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-400" />
        <span className="text-sm text-slate-700">{label}</span>
    </label>
);

const RadioGroup = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex flex-wrap gap-4">
        {options.map(o => (
            <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={value === o} onChange={() => onChange(o)}
                    className="w-4 h-4 border-slate-300 text-blue-500 focus:ring-blue-400" />
                <span className="text-sm text-slate-700">{o}</span>
            </label>
        ))}
    </div>
);

export default function ChildCreate({ puroks }: { puroks: string[] }) {
    const [processing, setProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    // Form 1 - Registration
    const [form, setForm] = useState({
        last_name: '', first_name: '', middle_name: '',
        sex: 'Male', birthdate: '', age: '',
        address: '', first_language: 'Filipino', second_language: '',
        registration_status: 'Approved', purok_zone: '',
        guardian_name: '', guardian_relationship: 'Guardian',
        guardian_mobile: '', guardian_email: '',
        accomplished_by: '', accomplished_date: '',
        reviewed_by: '', reviewed_date: '',
        // Emergency contact
        emergency_name: '', emergency_relationship: '',
        emergency_home: '', emergency_work: '',
    });

    // Form 1A - Father's Profile
    const [father, setFather] = useState({
        last_name: '', first_name: '', middle_initial: '',
        date_of_birth: '', age: '',
        civil_status: 'Married',
        district: '', purok_zone: '',
        mother_tongue: 'Tagalog', other_dialects: '',
        educational_attainment: 'Elementary',
        occupational_status: 'Employed',
        occupation: '', address: '',
        contact_home: '', contact_work: '',
    });

    // Form 1B - Mother's Profile
    const [mother, setMother] = useState({
        last_name: '', first_name: '', middle_initial: '',
        date_of_birth: '', age: '',
        pregnant: false,
        civil_status: 'Married',
        district: '', purok_zone: '',
        mother_tongue: 'Tagalog', other_dialects: '',
        educational_attainment: 'Elementary',
        occupational_status: 'Employed',
        occupation: '', address: '',
        contact_home: '', contact_work: '',
        age_interest_daycare: '3yr',
    });

    // Form 1C - Family Profile
    const [family, setFamily] = useState({
        ownership: 'Owned', materials: 'Concrete',
        one_room: false, multiple_rooms: false,
        has_toilet: false, has_bedroom: false, has_dining: false,
        has_sala: false, has_kitchen: false, open_play_area: false,
        running_water: false, electricity: false, aircon: false,
        mobile_phone: false, computer: false, internet: false,
        cd_dvd: false, tv: false, radio: false,
        magazines: false, books: false, newspapers: false,
        storybooks: false, board_games: false, puzzles: false,
        pets: false, toys: false,
    });

    const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
    const setF = (key: string, value: any) => setFather(prev => ({ ...prev, [key]: value }));
    const setM = (key: string, value: any) => setMother(prev => ({ ...prev, [key]: value }));
    const setFam = (key: string, value: any) => setFamily(prev => ({ ...prev, [key]: value }));

    const handleBirthdateChange = (birthdate: string) => {
        const age = birthdate ? String(Math.floor((Date.now() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))) : '';
        setForm(prev => ({ ...prev, birthdate, age }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        formData.append('father', JSON.stringify(father));
        formData.append('mother', JSON.stringify(mother));
        formData.append('family', JSON.stringify(family));
        if (profilePicture) formData.append('profile_picture', profilePicture);
        router.post(route('admin.children.store'), formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Add New Child" />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.children.index')} className="text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Registration Form</h1>
                        <p className="text-slate-500 mt-1 text-sm">Form 1 — Child Development Center Registration</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Profile Picture */}
                    <Section title="Profile Picture">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow">
                                        <User className="w-12 h-12 text-white" />
                                    </div>
                                )}
                                <label htmlFor="profile_picture" className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-600 shadow">
                                    <Camera className="w-3.5 h-3.5" />
                                </label>
                                <input id="profile_picture" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Upload a profile photo</p>
                                <p className="text-xs text-slate-400 mt-1">JPG, PNG or GIF (max 2MB)</p>
                            </div>
                        </div>
                    </Section>

                    {/* FORM 1 - Child Basic Info */}
                    <Section title="Form 1 — Child Information" subtitle="To be filled up by the parent/guardian upon enrolment">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className={lc}>Last Name *</label><input value={form.last_name} onChange={e => set('last_name', e.target.value)} required className={ic} /></div>
                            <div><label className={lc}>First Name *</label><input value={form.first_name} onChange={e => set('first_name', e.target.value)} required className={ic} /></div>
                            <div><label className={lc}>Middle Name</label><input value={form.middle_name} onChange={e => set('middle_name', e.target.value)} className={ic} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className={lc}>Sex *</label>
                                <select value={form.sex} onChange={e => set('sex', e.target.value)} className={ic}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div><label className={lc}>Birthday *</label><input type="date" value={form.birthdate} onChange={e => handleBirthdateChange(e.target.value)} required className={ic} /></div>
                            <div><label className={lc}>Age</label><input type="number" value={form.age} readOnly className={`${ic} bg-slate-50 cursor-not-allowed`} placeholder="Auto-calculated" /></div>
                            <div>
                                <label className={lc}>Registered</label>
                                <select value={form.registration_status} onChange={e => set('registration_status', e.target.value)} className={ic}>
                                    <option value="Approved">Yes</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Rejected">No</option>
                                </select>
                            </div>
                        </div>
                        <div><label className={lc}>Address *</label><input value={form.address} onChange={e => set('address', e.target.value)} required className={ic} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={lc}>Purok / Zone</label>
                                <select value={form.purok_zone} onChange={e => set('purok_zone', e.target.value)} className={ic}>
                                    <option value="">Select Purok...</option>
                                    {puroks.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div><label className={lc}>Email Address</label><input type="email" value={form.guardian_email} onChange={e => set('guardian_email', e.target.value)} className={ic} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={lc}>Child's First Language *</label><input value={form.first_language} onChange={e => set('first_language', e.target.value)} required className={ic} /></div>
                            <div><label className={lc}>Second Language</label><input value={form.second_language} onChange={e => set('second_language', e.target.value)} className={ic} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={lc}>Guardian Name</label><input value={form.guardian_name} onChange={e => set('guardian_name', e.target.value)} className={ic} /></div>
                            <div>
                                <label className={lc}>Relationship</label>
                                <select value={form.guardian_relationship} onChange={e => set('guardian_relationship', e.target.value)} className={ic}>
                                    {['Father','Mother','Guardian','Grandparent','Other'].map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>
                        <div><label className={lc}>Guardian Mobile</label><input value={form.guardian_mobile} onChange={e => set('guardian_mobile', e.target.value)} className={ic} /></div>
                    </Section>

                    {/* Emergency Contact */}
                    <Section title="In Case of Emergency">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={lc}>Name</label><input value={form.emergency_name} onChange={e => set('emergency_name', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Relationship</label><input value={form.emergency_relationship} onChange={e => set('emergency_relationship', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Home Number</label><input value={form.emergency_home} onChange={e => set('emergency_home', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Work Number</label><input value={form.emergency_work} onChange={e => set('emergency_work', e.target.value)} className={ic} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                            <div><label className={lc}>Accomplished by</label><input value={form.accomplished_by} onChange={e => set('accomplished_by', e.target.value)} className={ic} placeholder="Name of parent/guardian" /></div>
                            <div><label className={lc}>Date</label><input type="date" value={form.accomplished_date} onChange={e => set('accomplished_date', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Reviewed by (CDT)</label><input value={form.reviewed_by} onChange={e => set('reviewed_by', e.target.value)} className={ic} placeholder="Name of CDT" /></div>
                            <div><label className={lc}>Date</label><input type="date" value={form.reviewed_date} onChange={e => set('reviewed_date', e.target.value)} className={ic} /></div>
                        </div>
                    </Section>

                    {/* FORM 1A - Father's Profile */}
                    <Section title="Form 1A — Father's Profile">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">1. Personal Information</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div><label className={lc}>Last Name</label><input value={father.last_name} onChange={e => setF('last_name', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>First Name</label><input value={father.first_name} onChange={e => setF('first_name', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Middle Initial</label><input value={father.middle_initial} onChange={e => setF('middle_initial', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Date of Birth</label><input type="date" value={father.date_of_birth} onChange={e => setF('date_of_birth', e.target.value)} className={ic} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className={lc}>Age</label><input type="number" value={father.age} onChange={e => setF('age', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Occupation</label><input value={father.occupation} onChange={e => setF('occupation', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Address</label><input value={father.address} onChange={e => setF('address', e.target.value)} className={ic} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={lc}>Home Number</label><input value={father.contact_home} onChange={e => setF('contact_home', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Work Number</label><input value={father.contact_work} onChange={e => setF('contact_work', e.target.value)} className={ic} /></div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">2. Civil Status</p>
                            <RadioGroup options={['Single','Married','Separated','Widower','Live-in']} value={father.civil_status} onChange={v => setF('civil_status', v)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={lc}>3. District</label><input value={father.district} onChange={e => setF('district', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Purok/Zone</label><input value={father.purok_zone} onChange={e => setF('purok_zone', e.target.value)} className={ic} /></div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">4. Mother Tongue</p>
                            <RadioGroup options={['Tagalog','Visayan','Ilocano','Bicolnon','Others']} value={father.mother_tongue} onChange={v => setF('mother_tongue', v)} />
                        </div>
                        <div><label className={lc}>5. Other Dialects Spoken at Home</label><input value={father.other_dialects} onChange={e => setF('other_dialects', e.target.value)} className={ic} /></div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">6. Educational Attainment</p>
                            <RadioGroup options={['Elementary','High School','College','Tech-Voc','Masteral','Doctoral']} value={father.educational_attainment} onChange={v => setF('educational_attainment', v)} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">7. Occupational Status</p>
                            <RadioGroup options={['Employed','Unemployed','Retired','OFW','Others']} value={father.occupational_status} onChange={v => setF('occupational_status', v)} />
                        </div>
                    </Section>

                    {/* FORM 1B - Mother's Profile */}
                    <Section title="Form 1B — Mother's Profile">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">1. Personal Information</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div><label className={lc}>Last Name</label><input value={mother.last_name} onChange={e => setM('last_name', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>First Name</label><input value={mother.first_name} onChange={e => setM('first_name', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Middle Initial</label><input value={mother.middle_initial} onChange={e => setM('middle_initial', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Date of Birth</label><input type="date" value={mother.date_of_birth} onChange={e => setM('date_of_birth', e.target.value)} className={ic} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className={lc}>Age</label><input type="number" value={mother.age} onChange={e => setM('age', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Occupation</label><input value={mother.occupation} onChange={e => setM('occupation', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Address</label><input value={mother.address} onChange={e => setM('address', e.target.value)} className={ic} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={lc}>Home Number</label><input value={mother.contact_home} onChange={e => setM('contact_home', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Work Number</label><input value={mother.contact_work} onChange={e => setM('contact_work', e.target.value)} className={ic} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={lc}>District</label><input value={mother.district} onChange={e => setM('district', e.target.value)} className={ic} /></div>
                            <div><label className={lc}>Purok/Zone</label><input value={mother.purok_zone} onChange={e => setM('purok_zone', e.target.value)} className={ic} /></div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">2. Pregnant?</p>
                            <RadioGroup options={['Yes','No']} value={mother.pregnant ? 'Yes' : 'No'} onChange={v => setM('pregnant', v === 'Yes')} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">3. Civil Status</p>
                            <RadioGroup options={['Single','Married','Separated','Widow','Live-in']} value={mother.civil_status} onChange={v => setM('civil_status', v)} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">4. Mother Tongue</p>
                            <RadioGroup options={['Tagalog','Visayan','Ilocano','Bicolnon','Others']} value={mother.mother_tongue} onChange={v => setM('mother_tongue', v)} />
                        </div>
                        <div><label className={lc}>5. Other Dialects Spoken at Home</label><input value={mother.other_dialects} onChange={e => setM('other_dialects', e.target.value)} className={ic} /></div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">6. Educational Attainment</p>
                            <RadioGroup options={['Elementary','High School','College','Tech-Voc','Masteral','Doctoral']} value={mother.educational_attainment} onChange={v => setM('educational_attainment', v)} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">7. Occupational Status</p>
                            <RadioGroup options={['Employed','Unemployed','Retired','OFW','Others']} value={mother.occupational_status} onChange={v => setM('occupational_status', v)} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">At what age are you interested to put your child in a Day Care Center?</p>
                            <RadioGroup options={['Below 1yr','1yr','2yr','3yr','4yr']} value={mother.age_interest_daycare} onChange={v => setM('age_interest_daycare', v)} />
                        </div>
                    </Section>

                    {/* FORM 1C - Family Profile */}
                    <Section title="Form 1C — Family Profile">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">A. Home Ownership</p>
                            <RadioGroup options={['Owned','Rented','With Parents','With Relatives']} value={family.ownership} onChange={v => setFam('ownership', v)} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Materials</p>
                            <RadioGroup options={['Nipa','Wood','Concrete','Make Shift']} value={family.materials} onChange={v => setFam('materials', v)} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Nature of Home</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    ['one_room','One Room'],['multiple_rooms','Multiple Rooms'],
                                    ['has_toilet','With Toilet'],['has_bedroom','With Bedroom'],
                                    ['has_dining','With Dining Room'],['has_sala','With Sala'],
                                    ['has_kitchen','With Kitchen'],['open_play_area','Open Play Area'],
                                ].map(([k,l]) => <CheckGroup key={k} label={l} name={k} checked={(family as any)[k]} onChange={(v: boolean) => setFam(k, v)} />)}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Utilities & Appliances</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    ['running_water','Running Water'],['electricity','Electricity'],
                                    ['aircon','Aircon'],['mobile_phone','Mobile Phone'],
                                    ['computer','Computer'],['internet','Internet'],
                                    ['cd_dvd','CD/DVD Player'],['tv','Television'],['radio','Radio'],
                                ].map(([k,l]) => <CheckGroup key={k} label={l} name={k} checked={(family as any)[k]} onChange={(v: boolean) => setFam(k, v)} />)}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Learning & Recreation</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    ['magazines','Magazines/Comics'],['books','Books'],
                                    ['newspapers','Newspaper'],['storybooks','Story/Picture Books'],
                                    ['board_games','Board Games'],['puzzles','Puzzle'],
                                    ['pets','Pets'],['toys','Toys'],
                                ].map(([k,l]) => <CheckGroup key={k} label={l} name={k} checked={(family as any)[k]} onChange={(v: boolean) => setFam(k, v)} />)}
                            </div>
                        </div>
                    </Section>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {processing ? 'Saving...' : 'Create Child Record'}
                        </button>
                        <Link href={route('admin.children.index')}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
