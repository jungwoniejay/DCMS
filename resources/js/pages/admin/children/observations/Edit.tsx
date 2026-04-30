import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

const observationCountOptions = ['1st', '2nd', '3rd', '4th'];

export default function ChildObservationEdit({ child, observation }: any) {
    const { data, setData, put, processing, errors } = useForm({
        behavior_name: observation.behavior_name,
        observation_count: observation.observation_count,
        comment: observation.comment || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.children.observations.update', [child.id, observation.id]));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Observation - ${child.first_name} ${child.last_name}`} />

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
                                Edit Observation
                            </h1>
                            <p className="text-gray-600 mt-1">For: {child.first_name} {child.last_name}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Behavior Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.behavior_name}
                                    onChange={(e) => setData('behavior_name', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                    placeholder="e.g., Sharing with peers, Following instructions"
                                />
                                {errors.behavior_name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.behavior_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Observation Count <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.observation_count}
                                    onChange={(e) => setData('observation_count', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                >
                                    <option value="">Select observation count</option>
                                    {observationCountOptions.map((option) => (
                                        <option key={option} value={option}>{option} observation</option>
                                    ))}
                                </select>
                                {errors.observation_count && (
                                    <p className="text-sm text-red-600 mt-1">{errors.observation_count}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comment / Assessment
                                </label>
                                <textarea
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                    rows={4}
                                    placeholder="Enter observation details, including min/max/independent assessment..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Include details about the behavior and whether the child demonstrates minimum, maximum, or independent performance.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-4 mt-6">
                        <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            Update Observation
                        </Button>
                        <Link href={route('admin.children.observations.index', child.id)}>
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