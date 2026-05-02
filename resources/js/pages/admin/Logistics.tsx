import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Truck, Clock, Users, UtensilsCrossed } from 'lucide-react';

export default function Logistics({ transportation_modes, travel_times, accompaniment, meal_security }: any) {
    const mealCards = [
        { label: 'Has Meal', value: meal_security?.has_meal || 0, color: 'bg-green-50 border-green-100 text-green-700' },
        { label: 'No Meal', value: meal_security?.no_meal || 0, color: 'bg-red-50 border-red-100 text-red-700' },
        { label: 'Has Baon', value: meal_security?.has_baon || 0, color: 'bg-green-50 border-green-100 text-green-700' },
        { label: 'No Baon', value: meal_security?.no_baon || 0, color: 'bg-red-50 border-red-100 text-red-700' },
    ];

    return (
        <AdminLayout>
            <Head title="Logistics & Access" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Logistics & Access</h1>
                    <p className="text-slate-500 mt-1 text-sm">Transportation and meal security data</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Transportation */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-indigo-600" /> Transportation Modes
                        </h2>
                        {transportation_modes?.length > 0 ? (
                            <div className="space-y-2">
                                {transportation_modes.map((mode: any) => (
                                    <div key={mode.travel_mode_dcc} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <span className="text-sm text-gray-700">{mode.travel_mode_dcc}</span>
                                        <div className="text-right">
                                            <span className="font-bold text-indigo-700">{mode.count}</span>
                                            <p className="text-xs text-gray-400">avg {mode.avg_time?.toFixed(1) || 0} mins</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-400 text-center py-6">No transportation data</p>}
                    </div>

                    {/* Travel Times */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" /> Average Travel Times
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-2xl font-bold text-blue-700">{travel_times?.average_dcc?.toFixed(1) || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">To DCC (mins)</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-2xl font-bold text-blue-700">{travel_times?.average_ncdc?.toFixed(1) || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">To NCDC (mins)</p>
                            </div>
                        </div>
                    </div>

                    {/* Accompaniment */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-600" /> Accompaniment Data
                        </h2>
                        {accompaniment?.length > 0 ? (
                            <div className="space-y-2">
                                {accompaniment.map((acc: any) => (
                                    <div key={acc.goes_to_school_with} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                                        <span className="text-sm text-gray-700">{acc.goes_to_school_with}</span>
                                        <span className="font-bold text-purple-700">{acc.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-400 text-center py-6">No accompaniment data</p>}
                    </div>

                    {/* Meal Security */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <UtensilsCrossed className="w-4 h-4 text-orange-600" /> Meal Security
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {mealCards.map((m) => (
                                <div key={m.label} className={`text-center p-4 rounded-xl border ${m.color}`}>
                                    <p className="text-2xl font-bold">{m.value}</p>
                                    <p className="text-xs mt-1 opacity-80">{m.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
