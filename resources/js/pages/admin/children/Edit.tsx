import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save, User, Users, Home, Camera } from 'lucide-react';
import { useState } from 'react';

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

const CheckGroup = ({ label, checked, onChange }: any) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-400" />
        <span className="text-sm text-slate-700">{label}</span>
    </label>
);

const ic = 'w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const lc = 'block text-sm font-medium text-slate-600 mb-1';

export default function ChildEdit({ child, puroks }: any) {
    const [activeTab, setActiveTab] = useState('basic');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        child.profile_picture ? `/storage/${child.profile_picture}` : null
    );
    const [processing, setProcessing] = useState(false);

    const fp = child.father_profile || {};
    const mp = child.mother_profile || {};
    const fam = child.family_profile || {};
    const g = child.guardians?.[0] || {};
    const ec = child.emergency_contacts?.[0] || {};

    const [data, setData] = useState({
        last_name: child.last_name || '',
        first_name: child.first_name || '',
        middle_name: child.middle_name || '',
        sex: child.sex || 'Male',
        birthdate: child.birthdate ? child.birthdate.split('T')[0] : '',
        age: child.age || 0,
        address: child.address || '',
        first_language: child.first_language || '',
        second_language: child.second_language || '',
        registration_status: child.registration_status || 'Pending',
        purok_zone: child.purok_zone || '',
        guardian_name: g.name || '',
        guardian_relationship: g.relationship || 'Guardian',
        guardian_mobile: g.mobile_phone || '',
        guardian_email: g.email || '',
        emergency_name: ec.name || '',
        emergency_relationship: ec.relationship || '',
        emergency_home: ec.home_phone || '',
        emergency_work: ec.work_phone || '',
        accomplished_by: child.accomplished_by || '',
        accomplished_date: child.accomplished_date || '',
        reviewed_by: child.reviewed_by || '',
        reviewed_date: child.reviewed_date || '',
    });

    const [father, setFather] = useState({
        last_name: fp.last_name || '', first_name: fp.first_name || '', middle_initial: fp.middle_initial || '',
        date_of_birth: fp.date_of_birth ? fp.date_of_birth.split('T')[0] : '', age: fp.age || '',
        civil_status: fp.civil_status || 'Married', district: fp.district || '', purok_zone: fp.purok_zone || '',
        mother_tongue: fp.mother_tongue || 'Tagalog', other_dialects: fp.other_dialects || '',
        educational_attainment: fp.educational_attainment || 'Elementary',
        occupational_status: fp.occupational_status || 'Employed',
        occupation: fp.occupation || '', address: fp.address || '',
        contact_home: fp.contact_home || '', contact_work: fp.contact_work || '',
    });

    const [mother, setMother] = useState({
        last_name: mp.last_name || '', first_name: mp.first_name || '', middle_initial: mp.middle_initial || '',
        date_of_birth: mp.date_of_birth ? mp.date_of_birth.split('T')[0] : '', age: mp.age || '',
        pregnant: mp.pregnant || false, civil_status: mp.civil_status || 'Married',
        district: mp.district || '', purok_zone: mp.purok_zone || '',
        mother_tongue: mp.mother_tongue || 'Tagalog', other_dialects: mp.other_dialects || '',
        educational_attainment: mp.educational_attainment || 'Elementary',
        occupational_status: mp.occupational_status || 'Employed',
        occupation: mp.occupation || '', address: mp.address || '',
        contact_home: mp.contact_home || '', contact_work: mp.contact_work || '',
        age_interest_daycare: mp.age_interest_daycare || '3yr',
    });

    const [family, setFamily] = useState({
        ownership: fam.home_ownership || 'Owned', materials: fam.home_materials || 'Concrete',
        one_room: fam.one_room || false, multiple_rooms: fam.multiple_rooms || false,
        has_toilet: fam.has_toilet || false, has_bedroom: fam.has_bedroom || false,
        has_dining: fam.has_dining || false, has_sala: fam.has_sala || false,
        has_kitchen: fam.has_kitchen || false, open_play_area: fam.open_play_area || false,
        running_water: fam.running_water || false, electricity: fam.electricity || false,
        aircon: fam.aircon || false, mobile_phone: fam.mobile_phone || false,
        computer: fam.computer || false, internet: fam.internet || false,
        cd_dvd: fam.cd_dvd || false, tv: fam.tv || false, radio: fam.radio || false,
        magazines: fam.magazines || false, books: fam.books || false,
        newspapers: fam.newspapers || false, storybooks: fam.storybooks || false,
        board_games: fam.board_games || false, puzzles: fam.puzzles || false,
        pets: fam.pets || false, toys: fam.toys || false,
        purok_zone: fam.purok_zone || '',
    });

    const set = (key: string, value: any) => setData(prev => ({ ...prev, [key]: value }));
    const setF = (key: string, value: any) => setFather(prev => ({ ...prev, [key]: value }));
    const setM = (key: string, value: any) => setMother(prev => ({ ...prev, [key]: value }));
    const setFam = (key: string, value: any) => setFamily(prev => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)));
        formData.append('father', JSON.stringify(father));
        formData.append('mother', JSON.stringify(mother));
        formData.append('family', JSON.stringify(family));
        if (profilePicture) formData.append('profile_picture', profilePicture);
        router.post(route('admin.children.update.post', child.id), formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
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

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: User },
        { id: 'parents', label: 'Parents', icon: Users },
        { id: 'family', label: 'Family', icon: Home },
    ];

    return (
        <AdminLayout>
            <Head title={`Edit ${child.first_name} ${child.last_name}`} />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('admin.children.show', child.id)} className="text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Edit Child Information</h1>
                        <p className="text-slate-500 mt-1 text-sm">Update information for {child.first_name} {child.last_name}</p>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Info Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                {/* Profile Picture */}
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Profile Picture</h2>
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow" />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow">
                                                    <User className="w-12 h-12 text-white" />
                                                </div>
                                            )}
                                            <label htmlFor="profile_picture" className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow">
                                                <Camera className="w-3.5 h-3.5" />
                                            </label>
                                            <input id="profile_picture" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Upload a profile photo</p>
                                            <p className="text-xs text-slate-400 mt-1">JPG, PNG or GIF (max 2MB)</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Child Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div><label className={lc}>Last Name *</label><input value={data.last_name} onChange={e => set('last_name', e.target.value)} required className={ic} /></div>
                                        <div><label className={lc}>First Name *</label><input value={data.first_name} onChange={e => set('first_name', e.target.value)} required className={ic} /></div>
                                        <div><label className={lc}>Middle Name</label><input value={data.middle_name} onChange={e => set('middle_name', e.target.value)} className={ic} /></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                        <div>
                                            <label className={lc}>Sex *</label>
                                            <select value={data.sex} onChange={e => set('sex', e.target.value)} className={ic}>
                                                <option>Male</option><option>Female</option>
                                            </select>
                                        </div>
                                        <div><label className={lc}>Birthday *</label><input type="date" value={data.birthdate} onChange={e => set('birthdate', e.target.value)} required className={ic} /></div>
                                        <div><label className={lc}>Age</label><input type="number" value={data.age} onChange={e => set('age', e.target.value)} className={ic} /></div>
                                        <div>
                                            <label className={lc}>Status</label>
                                            <select value={data.registration_status} onChange={e => set('registration_status', e.target.value)} className={ic}>
                                                <option value="Approved">Approved</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div><label className={lc}>Address *</label><input value={data.address} onChange={e => set('address', e.target.value)} required className={ic} /></div>
                                        <div>
                                            <label className={lc}>Purok / Zone</label>
                                            <select value={data.purok_zone} onChange={e => set('purok_zone', e.target.value)} className={ic}>
                                                <option value="">Select Purok...</option>
                                                {puroks?.map((p: string) => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                        <div><label className={lc}>First Language *</label><input value={data.first_language} onChange={e => set('first_language', e.target.value)} required className={ic} /></div>
                                        <div><label className={lc}>Second Language</label><input value={data.second_language} onChange={e => set('second_language', e.target.value)} className={ic} /></div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Guardian</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className={lc}>Guardian Name</label><input value={data.guardian_name} onChange={e => set('guardian_name', e.target.value)} className={ic} /></div>
                                        <div>
                                            <label className={lc}>Relationship</label>
                                            <select value={data.guardian_relationship} onChange={e => set('guardian_relationship', e.target.value)} className={ic}>
                                                {['Father','Mother','Guardian','Grandparent','Other'].map(r => <option key={r}>{r}</option>)}
                                            </select>
                                        </div>
                                        <div><label className={lc}>Mobile</label><input value={data.guardian_mobile} onChange={e => set('guardian_mobile', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Email</label><input type="email" value={data.guardian_email} onChange={e => set('guardian_email', e.target.value)} className={ic} /></div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">In Case of Emergency</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className={lc}>Name</label><input value={data.emergency_name} onChange={e => set('emergency_name', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Relationship</label><input value={data.emergency_relationship} onChange={e => set('emergency_relationship', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Home Number</label><input value={data.emergency_home} onChange={e => set('emergency_home', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Work Number</label><input value={data.emergency_work} onChange={e => set('emergency_work', e.target.value)} className={ic} /></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                                        <div><label className={lc}>Accomplished by</label><input value={data.accomplished_by} onChange={e => set('accomplished_by', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Date</label><input type="date" value={data.accomplished_date} onChange={e => set('accomplished_date', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Reviewed by (CDT)</label><input value={data.reviewed_by} onChange={e => set('reviewed_by', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Date</label><input type="date" value={data.reviewed_date} onChange={e => set('reviewed_date', e.target.value)} className={ic} /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Guardians Tab - removed, merged into basic */}

                        {/* Parents Tab - Form 1A + 1B */}
                        {activeTab === 'parents' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Form 1A — Father's Profile</h2>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">1. Personal Information</p>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div><label className={lc}>Last Name</label><input value={father.last_name} onChange={e => setF('last_name', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>First Name</label><input value={father.first_name} onChange={e => setF('first_name', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Middle Initial</label><input value={father.middle_initial} onChange={e => setF('middle_initial', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Date of Birth</label><input type="date" value={father.date_of_birth} onChange={e => setF('date_of_birth', e.target.value)} className={ic} /></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div><label className={lc}>Age</label><input type="number" value={father.age} onChange={e => setF('age', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Occupation</label><input value={father.occupation} onChange={e => setF('occupation', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Address</label><input value={father.address} onChange={e => setF('address', e.target.value)} className={ic} /></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div><label className={lc}>Home Number</label><input value={father.contact_home} onChange={e => setF('contact_home', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Work Number</label><input value={father.contact_work} onChange={e => setF('contact_work', e.target.value)} className={ic} /></div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">2. Civil Status</p>
                                        <RadioGroup options={['Single','Married','Separated','Widower','Live-in']} value={father.civil_status} onChange={v => setF('civil_status', v)} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div><label className={lc}>3. District</label><input value={father.district} onChange={e => setF('district', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Purok/Zone</label><input value={father.purok_zone} onChange={e => setF('purok_zone', e.target.value)} className={ic} /></div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">4. Mother Tongue</p>
                                        <RadioGroup options={['Tagalog','Visayan','Ilocano','Bicolnon','Others']} value={father.mother_tongue} onChange={v => setF('mother_tongue', v)} />
                                    </div>
                                    <div className="mt-4"><label className={lc}>5. Other Dialects</label><input value={father.other_dialects} onChange={e => setF('other_dialects', e.target.value)} className={ic} /></div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">6. Educational Attainment</p>
                                        <RadioGroup options={['Elementary','High School','College','Tech-Voc','Masteral','Doctoral']} value={father.educational_attainment} onChange={v => setF('educational_attainment', v)} />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">7. Occupational Status</p>
                                        <RadioGroup options={['Employed','Unemployed','Retired','OFW','Others']} value={father.occupational_status} onChange={v => setF('occupational_status', v)} />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Form 1B — Mother's Profile</h2>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">1. Personal Information</p>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div><label className={lc}>Last Name</label><input value={mother.last_name} onChange={e => setM('last_name', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>First Name</label><input value={mother.first_name} onChange={e => setM('first_name', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Middle Initial</label><input value={mother.middle_initial} onChange={e => setM('middle_initial', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Date of Birth</label><input type="date" value={mother.date_of_birth} onChange={e => setM('date_of_birth', e.target.value)} className={ic} /></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div><label className={lc}>Age</label><input type="number" value={mother.age} onChange={e => setM('age', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Occupation</label><input value={mother.occupation} onChange={e => setM('occupation', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Address</label><input value={mother.address} onChange={e => setM('address', e.target.value)} className={ic} /></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div><label className={lc}>Home Number</label><input value={mother.contact_home} onChange={e => setM('contact_home', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Work Number</label><input value={mother.contact_work} onChange={e => setM('contact_work', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>District</label><input value={mother.district} onChange={e => setM('district', e.target.value)} className={ic} /></div>
                                        <div><label className={lc}>Purok/Zone</label><input value={mother.purok_zone} onChange={e => setM('purok_zone', e.target.value)} className={ic} /></div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">2. Pregnant?</p>
                                        <RadioGroup options={['Yes','No']} value={mother.pregnant ? 'Yes' : 'No'} onChange={v => setM('pregnant', v === 'Yes')} />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">3. Civil Status</p>
                                        <RadioGroup options={['Single','Married','Separated','Widow','Live-in']} value={mother.civil_status} onChange={v => setM('civil_status', v)} />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">4. Mother Tongue</p>
                                        <RadioGroup options={['Tagalog','Visayan','Ilocano','Bicolnon','Others']} value={mother.mother_tongue} onChange={v => setM('mother_tongue', v)} />
                                    </div>
                                    <div className="mt-4"><label className={lc}>5. Other Dialects</label><input value={mother.other_dialects} onChange={e => setM('other_dialects', e.target.value)} className={ic} /></div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">6. Educational Attainment</p>
                                        <RadioGroup options={['Elementary','High School','College','Tech-Voc','Masteral','Doctoral']} value={mother.educational_attainment} onChange={v => setM('educational_attainment', v)} />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">7. Occupational Status</p>
                                        <RadioGroup options={['Employed','Unemployed','Retired','OFW','Others']} value={mother.occupational_status} onChange={v => setM('occupational_status', v)} />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">At what age are you interested to put your child in a Day Care Center?</p>
                                        <RadioGroup options={['Below 1yr','1yr','2yr','3yr','4yr']} value={mother.age_interest_daycare} onChange={v => setM('age_interest_daycare', v)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Family Tab - Form 1C */}
                        {activeTab === 'family' && (
                            <div className="space-y-5">
                                <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Form 1C — Family Profile</h2>
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
                                        {[['one_room','One Room'],['multiple_rooms','Multiple Rooms'],['has_toilet','With Toilet'],['has_bedroom','With Bedroom'],['has_dining','With Dining Room'],['has_sala','With Sala'],['has_kitchen','With Kitchen'],['open_play_area','Open Play Area']]
                                            .map(([k,l]) => <CheckGroup key={k} label={l} checked={(family as any)[k]} onChange={(v: boolean) => setFam(k, v)} />)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Utilities & Appliances</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[['running_water','Running Water'],['electricity','Electricity'],['aircon','Aircon'],['mobile_phone','Mobile Phone'],['computer','Computer'],['internet','Internet'],['cd_dvd','CD/DVD Player'],['tv','Television'],['radio','Radio']]
                                            .map(([k,l]) => <CheckGroup key={k} label={l} checked={(family as any)[k]} onChange={(v: boolean) => setFam(k, v)} />)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Learning & Recreation</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[['magazines','Magazines/Comics'],['books','Books'],['newspapers','Newspaper'],['storybooks','Story/Picture Books'],['board_games','Board Games'],['puzzles','Puzzle'],['pets','Pets'],['toys','Toys']]
                                            .map(([k,l]) => <CheckGroup key={k} label={l} checked={(family as any)[k]} onChange={(v: boolean) => setFam(k, v)} />)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                            <button type="submit" disabled={processing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link href={route('admin.children.show', child.id)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
