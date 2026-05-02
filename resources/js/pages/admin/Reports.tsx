import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { FileText, Download, TrendingUp, Users, Heart, Apple } from 'lucide-react';

function StatCard({ icon, title, value, color }: any) {
    const colors: Record<string, string> = {
        blue:   'bg-blue-100 text-blue-600',
        green:  'bg-green-100 text-green-600',
        red:    'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600',
    };
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5">
            <div className={`inline-flex p-3 rounded-xl ${colors[color]}`}>{icon}</div>
            <p className="text-slate-500 text-xs mt-3 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
    );
}

export default function Reports({ reports }: any) {
    const handleExport = (type: string) => {
        window.location.href = route('admin.reports.export', type);
    };

    return (
        <AdminLayout>
            <Head title="Reports & Analytics" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Reports & Analytics</h1>
                    <p className="text-slate-500 mt-1 text-sm">Generate and export comprehensive reports</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<Users className="w-5 h-5" />} title="Total Children" value={reports?.overview?.total_children || 0} color="blue" />
                    <StatCard icon={<Users className="w-5 h-5" />} title="Total Families" value={reports?.overview?.total_families || 0} color="green" />
                    <StatCard icon={<Heart className="w-5 h-5" />} title="Health Assessments" value={reports?.overview?.total_health_assessments || 0} color="red" />
                    <StatCard icon={<Apple className="w-5 h-5" />} title="Nutrition Records" value={reports?.overview?.total_nutrition_records || 0} color="yellow" />
                </div>

                {/* Demographics */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" /> Demographics Report
                        </h2>
                        <button onClick={() => handleExport('children')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all">
                            <Download className="w-3.5 h-3.5" /> Export CSV
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Gender Distribution', data: reports?.demographics?.gender_distribution, suffix: '' },
                            { title: 'Age Distribution', data: reports?.demographics?.age_distribution, suffix: ' years' },
                            { title: 'Zone Distribution', data: reports?.demographics?.zone_distribution, suffix: '' },
                        ].map(({ title, data, suffix }) => (
                            <div key={title}>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    {Object.entries(data || {}).map(([k, v]: any) => (
                                        <div key={k} className="flex justify-between items-center py-1 border-b border-gray-50">
                                            <span className="text-sm text-gray-600">{k}{suffix}</span>
                                            <span className="font-semibold text-sm">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Health Summary */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" /> Health Summary
                        </h2>
                        <button onClick={() => handleExport('health')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all">
                            <Download className="w-3.5 h-3.5" /> Export CSV
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Vaccination Rates</h3>
                            <div className="space-y-2">
                                {Object.entries(reports?.health_summary?.vaccination_rates || {}).map(([vaccine, rate]: any) => (
                                    <div key={vaccine} className="flex items-center gap-3">
                                        <span className="text-xs text-gray-600 w-16 uppercase">{vaccine}</span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${rate}%` }} />
                                        </div>
                                        <span className="text-xs font-semibold w-10 text-right">{rate}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Health Conditions</h3>
                            <div className="space-y-1">
                                {Object.entries(reports?.health_summary?.health_conditions || {}).map(([condition, count]: any) => (
                                    <div key={condition} className="flex justify-between items-center py-1 border-b border-gray-50">
                                        <span className="text-sm text-gray-600 capitalize">{condition}</span>
                                        <span className="font-semibold text-sm">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nutrition Summary */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                            <Apple className="w-4 h-4 text-green-600" /> Nutrition Summary
                        </h2>
                        <button onClick={() => handleExport('nutrition')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all">
                            <Download className="w-3.5 h-3.5" /> Export CSV
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Nutritional Status</h3>
                            <div className="space-y-1">
                                {Object.entries(reports?.nutrition_summary?.status_distribution || {}).map(([status, count]: any) => (
                                    <div key={status} className="flex justify-between items-center py-1 border-b border-gray-50">
                                        <span className="text-sm text-gray-600">{status}</span>
                                        <span className="font-semibold text-sm">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Average Measurements</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Average Height</span>
                                    <span className="font-semibold text-sm">{reports?.nutrition_summary?.average_height?.toFixed(1) || 0} cm</span>
                                </div>
                                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm text-gray-600">Average Weight</span>
                                    <span className="font-semibold text-sm">{reports?.nutrition_summary?.average_weight?.toFixed(1) || 0} kg</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Trend */}
                {reports?.overview?.registration_by_month?.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" /> Monthly Enrollment Trend
                        </h2>
                        <div className="space-y-2">
                            {reports.overview.registration_by_month.map((item: any) => (
                                <div key={item.month} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                                    <span className="text-sm text-gray-700">{item.month}</span>
                                    <span className="font-bold text-blue-700">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
