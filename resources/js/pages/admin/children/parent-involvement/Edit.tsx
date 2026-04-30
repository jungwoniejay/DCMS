import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const relationshipOptions = ['Mother', 'Father', 'Guardian'];

const supportRoleOptions = [
    'Volunteer in classroom',
    'Help with field trips',
    'Assist with events',
    'Share cultural traditions',
    'Read to children',
    'Help with crafts',
    'Support fundraising',
    'Attend parent meetings',
    'Provide materials/supplies',
    'Share professional expertise',
    'Help with gardening',
    'Assist with meals',
    'Other'
];

export default function ParentInvolvementEdit({ child, parentInvolvement }: any) {
    const { data, setData, post, put, processing, errors } = useForm({
        child_id: child.id,
        parent_name: parentInvolvement?.parent_name || '',
        parent_relationship: parentInvolvement?.parent_relationship || '',
        parent_contact: parentInvolvement?.parent_contact || '',
        parent_email: parentInvolvement?.parent_email || '',
        support_roles: parentInvolvement?.support_roles || [],
        additional_notes: parentInvolvement?.additional_notes || '',
    });

    const isEditing = parentInvolvement !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.children.parent-involvement.update', child.id));
        } else {
            post(route('admin.children.parent-involvement.store', child.id));
        }
    };

    const handleRoleToggle = (role: string) => {
        const current = data.support_roles || [];
        if (current.includes(role)) {
            setData('support_roles', current.filter((r: string) => r !== role));
        } else {
            setData('support_roles', [...current, role]);
        }
    };

    return (
        <AdminLayout>
            <Head title={`${isEditing ? 'Edit' : 'Add'} Parent Involvement - ${child.first_name} ${child.last_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href={route('admin.children.parent-involvement.show', child.id)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isEditing ? 'Edit' : 'Add'} Parent Involvement
                            </h1>
                            <p className="text-gray-600 mt-1">For: {child.first_name} {child.last_name}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Parent Information */}
                        <Section icon={<Users />} title="Parent/Guardian Information">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Parent/Guardian Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.parent_name}
                                        onChange={(e) => setData('parent_name', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                        placeholder="Enter parent or guardian name"
                                    />
                                    {errors.parent_name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.parent_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Relationship to Child
                                    </label>
                                    <select
                                        value={data.parent_relationship}
                                        onChange={(e) => setData('parent_relationship', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                    >
                                        <option value="">Select relationship</option>
                                        {relationshipOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    {errors.parent_relationship && (
                                        <p className="text-sm text-red-600 mt-1">{errors.parent_relationship}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.parent_contact}
                                        onChange={(e) => setData('parent_contact', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                        placeholder="Enter contact number"
                                    />
                                    {errors.parent_contact && (
                                        <p className="text-sm text-red-600 mt-1">{errors.parent_contact}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.parent_email}
                                        onChange={(e) => setData('parent_email', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                        placeholder="Enter email address"
                                    />
                                    {errors.parent_email && (
                                        <p className="text-sm text-red-600 mt-1">{errors.parent_email}</p>
                                    )}
                                </div>
                            </div>
                        </Section>

                        {/* Support Roles */}
                        <Section icon={<Users />} title="Support Roles">
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 mb-2">
                                    Select all roles the parent/guardian is willing to support:
                                </p>
                                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                                    {supportRoleOptions.map((role) => (
                                        <label key={role} className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                                            <input
                                                type="checkbox"
                                                checked={data.support_roles?.includes(role) || false}
                                                onChange={() => handleRoleToggle(role)}
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-700">{role}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.support_roles && (
                                    <p className="text-sm text-red-600 mt-1">{errors.support_roles}</p>
                                )}
                            </div>
                        </Section>

                        {/* Additional Notes */}
                        <div className="lg:col-span-2">
                            <Section icon={<Users />} title="Additional Notes">
                                <textarea
                                    value={data.additional_notes}
                                    onChange={(e) => setData('additional_notes', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                    rows={4}
                                    placeholder="Enter any additional notes about parent involvement..."
                                />
                            </Section>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-4 mt-6">
                        <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            {isEditing ? 'Update' : 'Save'} Parent Involvement
                        </Button>
                        <Link href={route('admin.children.parent-involvement.show', child.id)}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function Section({ icon, title, children }: any) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="text-green-600">{icon}</div>
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>
            {children}
        </div>
    );
}