import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Heart, AlertTriangle, Syringe } from 'lucide-react';

export default function Health({ vaccination_coverage, health_conditions, emergency_plans }: any) {
    return (
        <AdminLayout>
            <Head title="Health Intelligence" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Health Intelligence</h1>
                    <p className="text-gray-500 mt-1 text-sm">Consolidated health and medical data</p>
                </div>

                {/* Vaccination Coverage */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Syringe className="w-4 h-4 text-purple-600" /> Vaccination Coverage
                    </h2>
                    {Object.keys(vaccination_coverage || {}).length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {Object.entries(vaccination_coverage).map(([vaccine, data]: any) => (
                                <div key={vaccine} className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <p className="text-2xl font-bold text-purple-700">{data.rate}%</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase mt-1">{vaccine}</p>
                                    <p className="text-xs text-gray-400">{data.completed}/{data.total}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-400 text-center py-6">No vaccination data available</p>}
                </div>

                {/* Health Conditions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" /> Health Conditions Prevalence
                    </h2>
                    {Object.keys(health_conditions || {}).length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {Object.entries(health_conditions).map(([condition, data]: any) => (
                                <div key={condition} className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                                    <p className="text-2xl font-bold text-red-600">{data.cases}</p>
                                    <p className="text-xs font-medium text-gray-600 capitalize mt-1">{condition}</p>
                                    <p className="text-xs text-gray-400">{data.prevalence}%</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-400 text-center py-6">No health conditions data</p>}
                </div>

                {/* Emergency Plans */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" /> Emergency Action Plans
                    </h2>
                    {emergency_plans?.length > 0 ? (
                        <div className="space-y-3">
                            {emergency_plans.map((plan: any) => (
                                <div key={plan.id} className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
                                    <p className="font-semibold text-gray-800 text-sm">{plan.health_assessment?.child?.first_name} {plan.health_assessment?.child?.last_name}</p>
                                    <p className="text-sm text-gray-600 mt-1">{plan.emergency_action_conditions}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-400 text-center py-6">No emergency plans on record</p>}
                </div>
            </div>
        </AdminLayout>
    );
}
