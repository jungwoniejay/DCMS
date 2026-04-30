import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Edit, Trash2, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChildObservationShow({ child, observation }: any) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this observation?')) {
            router.delete(route('admin.children.observations.destroy', [child.id, observation.id]));
        }
    };

    return (
        <AdminLayout>
            <Head title={`Observation - ${observation.behavior_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href={route('admin.children.observations.index', child.id)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Observation Details
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {child.first_name} {child.last_name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={route('admin.children.observations.edit', [child.id, observation.id])}>
                            <Button>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        <Button onClick={handleDelete} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Observation Details */}
                <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                    <div className="space-y-6">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Behavior Name</span>
                            <p className="text-lg text-gray-900 mt-1">{observation.behavior_name}</p>
                        </div>

                        <div>
                            <span className="text-sm font-medium text-gray-500">Observation Count</span>
                            <div className="mt-1">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    {observation.observation_count} Observation
                                </span>
                            </div>
                        </div>

                        {observation.comment && (
                            <div>
                                <span className="text-sm font-medium text-gray-500">Comment / Assessment</span>
                                <p className="text-gray-900 mt-1 p-4 bg-gray-50 rounded-lg">
                                    {observation.comment}
                                </p>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-200">
                            <span className="text-sm font-medium text-gray-500">Date Recorded</span>
                            <p className="text-gray-900 mt-1">
                                {new Date(observation.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}