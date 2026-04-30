import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save, User, Users, Home, Heart, Apple, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function ChildEdit({ child, puroks }: any) {
    const [activeTab, setActiveTab] = useState('basic');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        child.profile_picture ? `/storage/${child.profile_picture}` : null
    );
    
    const { data, setData, put, processing, errors } = useForm({
        // Basic Info
        last_name: child.last_name || '',
        first_name: child.first_name || '',
        middle_name: child.middle_name || '',
        sex: child.sex || 'Male',
        birthdate: child.birthdate ? child.birthdate.split('T')[0] : '',
        age: child.age || 0,
        address: child.address || '',
        first_language: child.first_language || '',
        second_language: child.second_language || '',
        registration_status: child.registration_status ? child.registration_status.toLowerCase() : 'pending',
        
        // Guardians
        guardians: child.guardians || [],
        emergency_contacts: child.emergency_contacts || [],
        
        // Father Profile
        father: child.father_profile || {},
        
        // Mother Profile
        mother: child.mother_profile || {},
        
        // Family Profile
        family: child.family_profile || {},
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Add all basic fields
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
        
        // Add complex fields as JSON
        formData.append('guardians', JSON.stringify(data.guardians));
        formData.append('emergency_contacts', JSON.stringify(data.emergency_contacts));
        formData.append('father', JSON.stringify(data.father));
        formData.append('mother', JSON.stringify(data.mother));
        formData.append('family', JSON.stringify(data.family));
        
        // Add profile picture if selected
        if (profilePicture) {
            formData.append('profile_picture', profilePicture);
        }
        
        router.post(route('admin.children.update.post', child.id), formData, {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.children.show', child.id)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Child Information</h1>
                            <p className="text-gray-600 mt-1">
                                Update basic information for {child.first_name} {child.last_name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Info Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                {/* Profile Picture */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Profile"
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <User className="w-16 h-16 text-gray-400" />
                                                </div>
                                            )}
                                            <label
                                                htmlFor="profile_picture"
                                                className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors"
                                            >
                                                <Camera className="w-4 h-4" />
                                            </label>
                                            <input
                                                id="profile_picture"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Upload a profile picture</p>
                                            <p className="text-xs text-gray-500">JPG, PNG or GIF (max. 2MB)</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="last_name">Last Name *</Label>
                                            <Input
                                                id="last_name"
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                className={errors.last_name ? 'border-red-500' : ''}
                                            />
                                            {errors.last_name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="first_name">First Name *</Label>
                                            <Input
                                                id="first_name"
                                                value={data.first_name}
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                className={errors.first_name ? 'border-red-500' : ''}
                                            />
                                            {errors.first_name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="middle_name">Middle Name</Label>
                                            <Input
                                                id="middle_name"
                                                value={data.middle_name}
                                                onChange={(e) => setData('middle_name', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Birth Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="sex">Sex *</Label>
                                            <select
                                                id="sex"
                                                value={data.sex}
                                                onChange={(e) => setData('sex', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>

                                        <div>
                                            <Label htmlFor="birthdate">Birthdate *</Label>
                                            <Input
                                                id="birthdate"
                                                type="date"
                                                value={data.birthdate}
                                                onChange={(e) => setData('birthdate', e.target.value)}
                                                className={errors.birthdate ? 'border-red-500' : ''}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="age">Age *</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                value={data.age}
                                                onChange={(e) => setData('age', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Address & Language</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="address">Address *</Label>
                                            <Input
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="first_language">First Language *</Label>
                                                <Input
                                                    id="first_language"
                                                    value={data.first_language}
                                                    onChange={(e) => setData('first_language', e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="second_language">Second Language</Label>
                                                <Input
                                                    id="second_language"
                                                    value={data.second_language}
                                                    onChange={(e) => setData('second_language', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Registration Status</h2>
                                    <div>
                                        <Label htmlFor="registration_status">Status</Label>
                                        <select
                                            id="registration_status"
                                            value={data.registration_status.toLowerCase()}
                                            onChange={(e) => setData('registration_status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Guardians Tab */}
                        {activeTab === 'guardians' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Guardians</h2>
                                    {data.guardians.map((guardian: any, index: number) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Name</Label>
                                                    <Input
                                                        value={guardian.name || ''}
                                                        onChange={(e) => {
                                                            const newGuardians = [...data.guardians];
                                                            newGuardians[index].name = e.target.value;
                                                            setData('guardians', newGuardians);
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Relationship</Label>
                                                    <Input
                                                        value={guardian.relationship || ''}
                                                        onChange={(e) => {
                                                            const newGuardians = [...data.guardians];
                                                            newGuardians[index].relationship = e.target.value;
                                                            setData('guardians', newGuardians);
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Email</Label>
                                                    <Input
                                                        type="email"
                                                        value={guardian.email || ''}
                                                        onChange={(e) => {
                                                            const newGuardians = [...data.guardians];
                                                            newGuardians[index].email = e.target.value;
                                                            setData('guardians', newGuardians);
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Mobile Phone</Label>
                                                    <Input
                                                        value={guardian.mobile_phone || ''}
                                                        onChange={(e) => {
                                                            const newGuardians = [...data.guardians];
                                                            newGuardians[index].mobile_phone = e.target.value;
                                                            setData('guardians', newGuardians);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contacts</h2>
                                    {data.emergency_contacts.map((contact: any, index: number) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Name</Label>
                                                    <Input
                                                        value={contact.name || ''}
                                                        onChange={(e) => {
                                                            const newContacts = [...data.emergency_contacts];
                                                            newContacts[index].name = e.target.value;
                                                            setData('emergency_contacts', newContacts);
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Relationship</Label>
                                                    <Input
                                                        value={contact.relationship || ''}
                                                        onChange={(e) => {
                                                            const newContacts = [...data.emergency_contacts];
                                                            newContacts[index].relationship = e.target.value;
                                                            setData('emergency_contacts', newContacts);
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Mobile Phone</Label>
                                                    <Input
                                                        value={contact.mobile_phone || ''}
                                                        onChange={(e) => {
                                                            const newContacts = [...data.emergency_contacts];
                                                            newContacts[index].mobile_phone = e.target.value;
                                                            setData('emergency_contacts', newContacts);
                                                        }}
                                                    />
                                                </div>
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
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Father's Profile</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>First Name</Label>
                                            <Input
                                                value={data.father.first_name || ''}
                                                onChange={(e) => setData('father', { ...data.father, first_name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Last Name</Label>
                                            <Input
                                                value={data.father.last_name || ''}
                                                onChange={(e) => setData('father', { ...data.father, last_name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Age</Label>
                                            <Input
                                                type="number"
                                                value={data.father.age || ''}
                                                onChange={(e) => setData('father', { ...data.father, age: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Occupation</Label>
                                            <Input
                                                value={data.father.occupational_status || ''}
                                                onChange={(e) => setData('father', { ...data.father, occupational_status: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Mother's Profile</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>First Name</Label>
                                            <Input
                                                value={data.mother.first_name || ''}
                                                onChange={(e) => setData('mother', { ...data.mother, first_name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Last Name</Label>
                                            <Input
                                                value={data.mother.last_name || ''}
                                                onChange={(e) => setData('mother', { ...data.mother, last_name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Age</Label>
                                            <Input
                                                type="number"
                                                value={data.mother.age || ''}
                                                onChange={(e) => setData('mother', { ...data.mother, age: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label>Occupation</Label>
                                            <Input
                                                value={data.mother.occupational_status || ''}
                                                onChange={(e) => setData('mother', { ...data.mother, occupational_status: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Family Tab */}
                        {activeTab === 'family' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Family Profile</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Home Ownership</Label>
                                            <select
                                                value={data.family.home_ownership || ''}
                                                onChange={(e) => setData('family', { ...data.family, home_ownership: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="">Select...</option>
                                                <option value="Owned">Owned</option>
                                                <option value="Rented">Rented</option>
                                                <option value="Living with relatives">Living with relatives</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Zone/Purok</Label>
                                            <select
                                                value={data.family.purok_zone || ''}
                                                onChange={(e) => setData('family', { ...data.family, purok_zone: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="">Select Purok...</option>
                                                {puroks?.map((p: string) => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Materials</Label>
                                            <Input
                                                value={data.family.home_materials || ''}
                                                onChange={(e) => setData('family', { ...data.family, home_materials: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.family.electricity || false}
                                                    onChange={(e) => setData('family', { ...data.family, electricity: e.target.checked })}
                                                    className="mr-2"
                                                />
                                                Electricity
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.family.running_water || false}
                                                    onChange={(e) => setData('family', { ...data.family, running_water: e.target.checked })}
                                                    className="mr-2"
                                                />
                                                Running Water
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.family.internet || false}
                                                    onChange={(e) => setData('family', { ...data.family, internet: e.target.checked })}
                                                    className="mr-2"
                                                />
                                                Internet
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t">
                            <Link href={route('admin.children.show', child.id)}>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
