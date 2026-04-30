import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Users, UserCheck, Heart, Apple, AlertTriangle, TrendingUp, Baby } from 'lucide-react';

export default function Dashboard({ stats }: any) {
    const statCards = [
        { title: 'Total Children', value: stats?.total_children ?? 0, icon: Users, color: 'bg-green-500', light: 'bg-green-50 text-green-700' },
        { title: 'Male', value: stats?.gender_distribution?.Male ?? 0, icon: UserCheck, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700' },
        { title: 'Female', value: stats?.gender_distribution?.Female ?? 0, icon: UserCheck, color: 'bg-pink-500', light: 'bg-pink-50 text-pink-700' },
        { title: 'Health Alerts', value: stats?.health_alerts?.length ?? 0, icon: AlertTriangle, color: 'bg-red-500', light: 'bg-red-50 text-red-700' },
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1 text-sm">Overview of Child Development Center</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((s) => (
                        <div key={s.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${s.color}`}>
                                <s.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">{s.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Age Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Baby className="w-4 h-4 text-green-600" /> Age Group Distribution
                        </h2>
                        {Object.keys(stats?.age_groups ?? {}).length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(stats.age_groups).map(([age, count]: any) => (
                                    <div key={age} className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                                        <p className="text-2xl font-bold text-green-700">{count}</p>
                                        <p className="text-xs text-gray-500 mt-1">{age} years</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-400 text-center py-6">No data available</p>}
                    </div>

                    {/* Nutritional Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Apple className="w-4 h-4 text-emerald-600" /> Nutritional Status
                        </h2>
                        {Object.keys(stats?.nutritional_status ?? {}).length > 0 ? (
                            <div className="space-y-2">
                                {Object.entries(stats.nutritional_status).map(([status, count]: any) => (
                                    <div key={status} className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                                        <span className="text-sm text-gray-700">{status}</span>
                                        <span className="font-bold text-emerald-700">{count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-400 text-center py-6">No nutritional data</p>}
                    </div>

                    {/* Vaccination */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-purple-600" /> Vaccination Completion
                        </h2>
                        {Object.keys(stats?.vaccination_completion ?? {}).length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(stats.vaccination_completion).map(([vaccine, count]: any) => (
                                    <div key={vaccine} className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                                        <p className="text-xl font-bold text-purple-700">{count}</p>
                                        <p className="text-xs text-gray-500 uppercase mt-1">{vaccine}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-400 text-center py-6">No vaccination data</p>}
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" /> Monthly Enrollment Trend
                        </h2>
                        {stats?.monthly_enrollment_trend?.length > 0 ? (
                            <div className="space-y-2">
                                {stats.monthly_enrollment_trend.map((item: any) => (
                                    <div key={item.month} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                        <span className="text-sm text-gray-700">{item.month}</span>
                                        <span className="font-bold text-blue-700">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-gray-400 text-center py-6">No trend data</p>}
                    </div>
                </div>

                {/* Recent Enrollments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Enrollments</h2>
                    {stats?.recent_enrollments?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead><tr>
                                    {['Name','Sex','Age','Enrolled'].map(h => (
                                        <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                                    ))}
                                </tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {stats.recent_enrollments.map((child: any) => (
                                        <tr key={child.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                <Link href={route('admin.children.show', child.id)} className="hover:text-green-600">
                                                    {child.first_name} {child.last_name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{child.sex}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{child.age}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{new Date(child.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-sm text-gray-400 text-center py-6">No recent enrollments</p>}
                </div>
            </div>
        </AdminLayout>
    );
}
