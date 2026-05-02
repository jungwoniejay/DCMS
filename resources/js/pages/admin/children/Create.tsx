import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ChildCreate({ puroks }: { puroks: string[] }) {
    const [processing, setProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const [form, setForm] = useState({
        last_name: '', first_name: '', middle_name: '',
        sex: 'Male', birthdate: '', age: '',
        address: '', first_language: 'Filipino', second_language: '',
        registration_status: 'Approved',
        purok_zone: '',
        guardian_name: '', guardian_relationship: 'Guardian',
        guardian_mobile: '', guardian_email: '',
    });

    const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

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
        if (profilePicture) formData.append('profile_picture', profilePicture);

        router.post(route('admin.children.store'), formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400';
    const labelClass = 'block text-sm font-medium text-slate-600 mb-1';

    return (
        <AdminLayout>
            <Head title="Add New Child" />
            <div className="space-y-6 max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('admin.children.index')} className="text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Add New Child</h1>
                        <p className="text-slate-500 mt-1 text-sm">Create a new child record directly</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Profile Picture */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5">
                        <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">Profile Picture</h2>
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow" />
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

                    {/* Basic Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
                        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className={labelClass}>Last Name *</label><input value={form.last_name} onChange={e => set('last_name', e.target.value)} required className={inputClass} /></div>
                            <div><label className={labelClass}>First Name *</label><input value={form.first_name} onChange={e => set('first_name', e.target.value)} required className={inputClass} /></div>
                            <div><label className={labelClass}>Middle Name</label><input value={form.middle_name} onChange={e => set('middle_name', e.target.value)} className={inputClass} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Sex *</label>
                                <select value={form.sex} onChange={e => set('sex', e.target.value)} className={inputClass}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div><label className={labelClass}>Birthdate *</label><input type="date" value={form.birthdate} onChange={e => set('birthdate', e.target.value)} required className={inputClass} /></div>
                            <div><label className={labelClass}>Age *</label><input type="number" min="0" max="20" value={form.age} onChange={e => set('age', e.target.value)} required className={inputClass} /></div>
                        </div>
                        <div><label className={labelClass}>Address *</label><input value={form.address} onChange={e => set('address', e.target.value)} required className={inputClass} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={labelClass}>First Language *</label><input value={form.first_language} onChange={e => set('first_language', e.target.value)} required className={inputClass} /></div>
                            <div><label className={labelClass}>Second Language</label><input value={form.second_language} onChange={e => set('second_language', e.target.value)} className={inputClass} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Purok / Zone</label>
                                <select value={form.purok_zone} onChange={e => set('purok_zone', e.target.value)} className={inputClass}>
                                    <option value="">Select Purok...</option>
                                    {puroks.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Registration Status *</label>
                                <select value={form.registration_status} onChange={e => set('registration_status', e.target.value)} className={inputClass}>
                                    <option value="Approved">Approved</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Guardian Info */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
                        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Guardian Information <span className="text-slate-400 font-normal normal-case">(optional)</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={labelClass}>Guardian Name</label><input value={form.guardian_name} onChange={e => set('guardian_name', e.target.value)} className={inputClass} /></div>
                            <div>
                                <label className={labelClass}>Relationship</label>
                                <select value={form.guardian_relationship} onChange={e => set('guardian_relationship', e.target.value)} className={inputClass}>
                                    <option value="Father">Father</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Guardian">Guardian</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div><label className={labelClass}>Mobile Phone</label><input value={form.guardian_mobile} onChange={e => set('guardian_mobile', e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Email</label><input type="email" value={form.guardian_email} onChange={e => set('guardian_email', e.target.value)} className={inputClass} /></div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Saving...' : 'Create Child Record'}
                        </Button>
                        <Link href={route('admin.children.index')}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
