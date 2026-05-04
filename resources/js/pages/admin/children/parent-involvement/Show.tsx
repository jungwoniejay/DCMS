import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ParentInvolvementShow({ child, parentInvolvement }: any) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this parent involvement information?')) {
            router.delete(route('admin.children.parent-involvement.destroy', child.id));
        }
    };

    const hasData = parentInvolvement !== null;

    return (
        <AdminLayout>
            <Head title={`Parent Involvement - ${child.first_name} ${child.last_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href={route('admin.children.show', child.id)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Parent Involvement
                            </h1>
                            <p className="text-gray-600 mt-1">Family support and involvement records</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasData ? (
                            <>
                                <Link href={route('admin.children.parent-involvement.edit', child.id)}>
                                    <Button>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button onClick={handleDelete} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <Link href={route('admin.children.parent-involvement.edit', child.id)}>
                                <Button className="bg-green-600 hover:bg-green-700">
                                    Add Parent Involvement
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {hasData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Parent Information */}
                        <Section icon={<Users />} title="Parent/Guardian Information">
                            <InfoGrid>
                                <InfoItem label="Name" value={parentInvolvement.parent_name} />
                                <InfoItem label="Relationship" value={parentInvolvement.parent_relationship} />
                                <InfoItem label="Contact" value={parentInvolvement.parent_contact} />
                                <InfoItem label="Email" value={parentInvolvement.parent_email} />
                            </InfoGrid>
                        </Section>

                        {/* Support Roles */}
                        <Section icon={<Users />} title="Support Roles">
                            {parentInvolvement.support_roles && parentInvolvement.support_roles.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {parentInvolvement.support_roles.map((role: string, index: number) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No support roles selected</p>
                            )}
                        </Section>

                        {/* Additional Notes */}
                        {parentInvolvement.additional_notes && (
                            <div className="lg:col-span-2">
                                <Section icon={<Users />} title="Additional Notes">
                                    <p className="text-sm text-gray-700 leading-relaxed">{parentInvolvement.additional_notes}</p>
                                </Section>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Parent Involvement Data</h3>
                        <p className="text-gray-600 mb-6">There is no parent involvement information recorded for this child yet.</p>
                        <Link href={route('admin.children.parent-involvement.edit', child.id)}>
                            <Button className="bg-green-600 hover:bg-green-700">
                                Add Parent Involvement
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function Section({ icon, title, children }: any) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">{icon}</div>
                <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function InfoGrid({ children }: any) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function InfoItem({ label, value }: any) {
    return (
        <div className="bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
            <p className="text-sm font-medium text-gray-900 mt-1">{value || 'N/A'}</p>
        </div>
    );
}