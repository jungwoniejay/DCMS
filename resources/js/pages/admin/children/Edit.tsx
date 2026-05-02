import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save, User, Users, Home, Camera } from 'lucide-react';
import { useState } from 'react';

const ic = 'w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const lc = 'block text-sm font-medium text-slate-600 mb-1';

export default function ChildEdit({ child, puroks }: any) {
    const [activeTab, setActiveTab] = useState('basic');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        child.profile_picture ? `/storage/${child.profile_picture}` : null
    );
    const [processing, setProcessing] = useState(false);

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
        guardians: child.guardians || [],
        emergency_contacts: child.emergency_contacts || [],
        father: child.father_profile || {},
        mother: child.mother_profile || {},
        family: child.family_profile || {},
    });

    const set = (key: string, value: any) => setData(prev => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData();
        formData.append('last_name', data.last_name);
        formData.append('first_name', data.first_name);
        formData.append('middle_name', data.middle_name || '');
        formData.append('sex', data.sex);
        formData.append('birthdate', data.birthdate);
        formData.append('age', data.age.toString());
        formData.append('address', data.address);
        formData.append('first_language', data.first_language);
        formData.append('second_language', data.second_language || '');
        formData.append('registration_status', data.registration_status);
        formData.append('guardians', JSON.stringify(data.guardians));
        formData.append('emergency_contacts', JSON.stringify(data.emergency_contacts));
        formData.append('father', JSON.stringify(data.father));
        formData.append('mother', JSON.stringify(data.mother));
        formData.append('family', JSON.stringify(data.family));
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
        { id: 'guardians', label: 'Guardians', icon: Users },
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
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Personal Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div><label className={lc}>Last Name *</label><input value={data.last_name} onChange={e => set('last_name', e.target.value)} required className={ic} /></div>
                                        <div><label className={lc}>First Name *</label><input value={data.first_name} onChange={e => set('first_name', e.target.value)} required className={ic} /></div>
                                        <div><label className={lc}>Middle Name</label><input value={data.middle_name} onChange={e => set('middle_name', e.target.value)} className={ic} /></div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Birth Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className={lc}>Sex *</label>
                                            <select value={data.sex} onChange={e => set('sex', e.target.value)} className={ic}>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div><label className={lc}>Birthdate *</label><input type="date" value={data.birthdate} onChange={e => set('birthdate', e.target.value)} required className={ic} /></div>
                                        <div><label className={lc}>Age *</label><input type="number" value={data.age} onChange={e => set('age', parseInt(e.target.value))} className={ic} /></div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Address & Language</h2>
                                    <div className="space-y-4">
                                        <div><label className={lc}>Address *</label><input value={data.address} onChange={e => set('address', e.target.value)} required className={ic} /></div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><label className={lc}>First Language *</label><input value={data.first_language} onChange={e => set('first_language', e.target.value)} required className={ic} /></div>
                                            <div><label className={lc}>Second Language</label><input value={data.second_language} onChange={e => set('second_language', e.target.value)} className={ic} /></div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Registration Status</h2>
                                    <div className="max-w-xs">
                                        <label className={lc}>Status</label>
                                        <select value={data.registration_status} onChange={e => set('registration_status', e.target.value)} className={ic}>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Guardians Tab */}
                        {activeTab === 'guardians' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Guardians</h2>
                                    {data.guardians.length === 0 && <p className="text-sm text-slate-400">No guardians on record.</p>}
                                    {data.guardians.map((guardian: any, index: number) => (
                                        <div key={index} className="p-4 border border-slate-100 rounded-xl mb-4 bg-slate-50/50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div><label className={lc}>Name</label><input value={guardian.name || ''} onChange={e => { const g = [...data.guardians]; g[index].name = e.target.value; set('guardians', g); }} className={ic} /></div>
                                                <div><label className={lc}>Relationship</label><input value={guardian.relationship || ''} onChange={e => { const g = [...data.guardians]; g[index].relationship = e.target.value; set('guardians', g); }} className={ic} /></div>
                                                <div><label className={lc}>Email</label><input type="email" value={guardian.email || ''} onChange={e => { const g = [...data.guardians]; g[index].email = e.target.value; set('guardians', g); }} className={ic} /></div>
                                                <div><label className={lc}>Mobile Phone</label><input value={guardian.mobile_phone || ''} onChange={e => { const g = [...data.guardians]; g[index].mobile_phone = e.target.value; set('guardians', g); }} className={ic} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Emergency Contacts</h2>
                                    {data.emergency_contacts.length === 0 && <p className="text-sm text-slate-400">No emergency contacts on record.</p>}
                                    {data.emergency_contacts.map((contact: any, index: number) => (
                                        <div key={index} className="p-4 border border-slate-100 rounded-xl mb-4 bg-slate-50/50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div><label className={lc}>Name</label><input value={contact.name || ''} onChange={e => { const c = [...data.emergency_contacts]; c[index].name = e.target.value; set('emergency_contacts', c); }} className={ic} /></div>
                                                <div><label className={lc}>Relationship</label><input value={contact.relationship || ''} onChange={e => { const c = [...data.emergency_contacts]; c[index].relationship = e.target.value; set('emergency_contacts', c); }} className={ic} /></div>
                                                <div><label className={lc}>Mobile Phone</label><input value={contact.mobile_phone || ''} onChange={e => { const c = [...data.emergency_contacts]; c[index].mobile_phone = e.target.value; set('emergency_contacts', c); }} className={ic} /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Parents Tab */}
                        {activeTab === 'parents' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Father's Profile</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className={lc}>First Name</label><input value={data.father.first_name || ''} onChange={e => set('father', { ...data.father, first_name: e.target.value })} className={ic} /></div>
                                        <div><label className={lc}>Last Name</label><input value={data.father.last_name || ''} onChange={e => set('father', { ...data.father, last_name: e.target.value })} className={ic} /></div>
                                        <div><label className={lc}>Age</label><input type="number" value={data.father.age || ''} onChange={e => set('father', { ...data.father, age: e.target.value })} className={ic} /></div>
                                        <div><label className={lc}>Occupation</label><input value={data.father.occupational_status || ''} onChange={e => set('father', { ...data.father, occupational_status: e.target.value })} className={ic} /></div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">Mother's Profile</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className={lc}>First Name</label><input value={data.mother.first_name || ''} onChange={e => set('mother', { ...data.mother, first_name: e.target.value })} className={ic} /></div>
                                        <div><label className={lc}>Last Name</label><input value={data.mother.last_name || ''} onChange={e => set('mother', { ...data.mother, last_name: e.target.value })} className={ic} /></div>
                                        <div><label className={lc}>Age</label><input type="number" value={data.mother.age || ''} onChange={e => set('mother', { ...data.mother, age: e.target.value })} className={ic} /></div>
                                        <div><label className={lc}>Occupation</label><input value={data.mother.occupational_status || ''} onChange={e => set('mother', { ...data.mother, occupational_status: e.target.value })} className={ic} /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Family Tab */}
                        {activeTab === 'family' && (
                            <div className="space-y-4">
                                <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Family Profile</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={lc}>Home Ownership</label>
                                        <select value={data.family.home_ownership || ''} onChange={e => set('family', { ...data.family, home_ownership: e.target.value })} className={ic}>
                                            <option value="">Select...</option>
                                            <option value="Owned">Owned</option>
                                            <option value="Rented">Rented</option>
                                            <option value="Living with relatives">Living with relatives</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={lc}>Zone/Purok</label>
                                        <select value={data.family.purok_zone || ''} onChange={e => set('family', { ...data.family, purok_zone: e.target.value })} className={ic}>
                                            <option value="">Select Purok...</option>
                                            {puroks?.map((p: string) => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div><label className={lc}>Home Materials</label><input value={data.family.home_materials || ''} onChange={e => set('family', { ...data.family, home_materials: e.target.value })} className={ic} /></div>
                                    <div className="flex items-center gap-6 pt-6">
                                        {[['electricity', 'Electricity'], ['running_water', 'Running Water'], ['internet', 'Internet']].map(([key, label]) => (
                                            <label key={key} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                                <input type="checkbox" checked={data.family[key] || false} onChange={e => set('family', { ...data.family, [key]: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-blue-500" />
                                                {label}
                                            </label>
                                        ))}
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
