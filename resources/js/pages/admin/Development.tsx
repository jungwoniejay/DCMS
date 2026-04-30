import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { BookOpen, Users, Home } from 'lucide-react';

export default function Development({ prior_schooling, social_interaction, home_learning }: any) {
    const schoolingCards = [
        { label: 'Attended Nursery', value: prior_schooling?.nursery || 0 },
        { label: 'Attended Kindergarten', value: prior_schooling?.kindergarten || 0 },
        { label: 'Attended Preparatory', value: prior_schooling?.preparatory || 0 },
    ];
    const socialCards = [
        { label: 'Play with Older Siblings', value: social_interaction?.with_older_siblings || 0 },
        { label: 'Play with Younger Siblings', value: social_interaction?.with_younger_siblings || 0 },
        { label: 'Play with Neighbors', value: social_interaction?.with_neighbors || 0 },
    ];

    return (
        <AdminLayout>
            <Head title="Developmental Background" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Developmental Background</h1>
                    <p className="text-gray-500 mt-1 text-sm">Prior experiences and social development</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Prior Schooling */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600" /> Prior Schooling Experience
                        </h2>
                        <div className="space-y-2">
                            {schoolingCards.map((c) => (
                                <div key={c.label} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <span className="text-sm text-gray-700">{c.label}</span>
                                    <span className="font-bold text-blue-700 text-lg">{c.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Interaction */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-600" /> Social Interaction Patterns
                        </h2>
                        <div className="space-y-2">
                            {socialCards.map((c) => (
                                <div key={c.label} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <span className="text-sm text-gray-700">{c.label}</span>
                                    <span className="font-bold text-purple-700 text-lg">{c.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Home Learning */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Home className="w-4 h-4 text-green-600" /> Home Learning Environment
                    </h2>
                    {home_learning?.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {home_learning.map((learning: any) => (
                                <div key={learning.learns_at_home_with} className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-2xl font-bold text-green-700">{learning.count}</p>
                                    <p className="text-xs text-gray-500 mt-1">{learning.learns_at_home_with}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-400 text-center py-6">No home learning data available</p>}
                </div>
            </div>
        </AdminLayout>
    );
}
