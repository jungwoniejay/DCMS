import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Edit, Trash2, Utensils, Moon, Droplets, Toilet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChildCareShow({ child, careInfo }: any) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this care information?')) {
            router.delete(route('admin.children.care.destroy', child.id));
        }
    };

    const hasData = careInfo !== null;

    return (
        <AdminLayout>
            <Head title={`Care Information - ${child.first_name} ${child.last_name}`} />

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
                                Care Information - {child.first_name} {child.last_name}
                            </h1>
                            <p className="text-gray-600 mt-1">Daily care records and routines</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasData ? (
                            <>
                                <Link href={route('admin.children.care.edit', child.id)}>
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
                            <Link href={route('admin.children.care.edit', child.id)}>
                                <Button className="bg-green-600 hover:bg-green-700">
                                    Add Care Information
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {hasData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Feeding Information */}
                        <Section icon={<Utensils />} title="Feeding Information">
                            <InfoGrid>
                                <InfoItem label="Appetite" value={careInfo.feeding_appetite} />
                                <InfoItem 
                                    label="Food Selection" 
                                    value={careInfo.feeding_food_selection?.join(', ') || 'N/A'} 
                                />
                            </InfoGrid>
                            {careInfo.feeding_custom && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">{careInfo.feeding_custom}</p>
                                </div>
                            )}
                        </Section>

                        {/* Sleeping Information */}
                        <Section icon={<Moon />} title="Sleeping Information">
                            <InfoGrid>
                                <InfoItem label="Duration" value={careInfo.sleeping_duration ? `${careInfo.sleeping_duration} hours` : null} />
                                <InfoItem label="Quality" value={careInfo.sleeping_quality} />
                            </InfoGrid>
                            {careInfo.sleeping_custom && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">{careInfo.sleeping_custom}</p>
                                </div>
                            )}
                        </Section>

                        {/* Bathing Information */}
                        <Section icon={<Droplets />} title="Bathing Information">
                            <InfoGrid>
                                <InfoItem label="Frequency" value={careInfo.bathing_frequency} />
                                <InfoItem label="Assistance" value={careInfo.bathing_assistance} />
                            </InfoGrid>
                            {careInfo.bathing_custom && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">{careInfo.bathing_custom}</p>
                                </div>
                            )}
                        </Section>

                        {/* Toileting Information */}
                        <Section icon={<Toilet />} title="Toileting Information">
                            <InfoGrid>
                                <InfoItem label="Frequency" value={careInfo.toileting_frequency} />
                                <InfoItem label="Assistance" value={careInfo.toileting_assistance} />
                            </InfoGrid>
                            {careInfo.toileting_custom && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">{careInfo.toileting_custom}</p>
                                </div>
                            )}
                        </Section>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Care Information</h3>
                        <p className="text-gray-600 mb-6">There is no care information recorded for this child yet.</p>
                        <Link href={route('admin.children.care.edit', child.id)}>
                            <Button className="bg-green-600 hover:bg-green-700">
                                Add Care Information
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
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="text-green-600">{icon}</div>
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function InfoGrid({ children }: any) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function InfoItem({ label, value }: any) {
    return (
        <div>
            <span className="text-sm font-medium text-gray-500">{label}:</span>
            <p className="text-sm text-gray-900 mt-1">{value || 'N/A'}</p>
        </div>
    );
}