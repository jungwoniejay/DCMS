import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Apple, Weight } from 'lucide-react';

export default function Nutrition({ status_distribution, average_measurements, food_allergies }: any) {
    const measurements = [
        { label: 'Height 1st (cm)', value: average_measurements?.height_first?.toFixed(1) || 0 },
        { label: 'Weight 1st (kg)', value: average_measurements?.weight_first?.toFixed(1) || 0 },
        { label: 'Height 2nd (cm)', value: average_measurements?.height_second?.toFixed(1) || 0 },
        { label: 'Weight 2nd (kg)', value: average_measurements?.weight_second?.toFixed(1) || 0 },
    ];

    return (
        <AdminLayout>
            <Head title="Nutrition Monitoring" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Nutrition Monitoring</h1>
                    <p className="text-gray-500 mt-1 text-sm">Nutritional status and feeding data</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Apple className="w-4 h-4 text-green-600" /> Nutritional Status Distribution
                        </h2>
                        {Object.keys(status_distribution || {}).length > 0 ? (
                            <div className="space-y-2">
                                {Object.entries(status_distribution).map(([status, count]: any) => (
                                    <div key={status} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                        <span className="text-sm text-gray-700">{status}</span>
                                        <span className="font-bold text-green-700 text-lg">{count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-400 text-center py-6">No status data available</p>}
                    </div>

                    {/* Average Measurements */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Weight className="w-4 h-4 text-blue-600" /> Average Measurements
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {measurements.map((m) => (
                                <div key={m.label} className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-2xl font-bold text-blue-700">{m.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{m.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Food Allergies */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">Food Allergies</h2>
                    {food_allergies?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {food_allergies.map((allergy: any) => (
                                <div key={allergy.id} className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <p className="font-semibold text-gray-800 text-sm">{allergy.child?.first_name} {allergy.child?.last_name}</p>
                                    <p className="text-sm text-gray-600 mt-1">{allergy.food_allergies}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-400 text-center py-6">No food allergies recorded</p>}
                </div>
            </div>
        </AdminLayout>
    );
}
