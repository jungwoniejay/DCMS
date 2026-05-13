import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Users, UserCheck, AlertTriangle, TrendingUp, Baby, Apple, Calendar, ClipboardList } from 'lucide-react';

// ── Bar Chart ─────────────────────────────────────────────────────────────────
function BarChart({ data, color = '#3b82f6', label }: { data: { label: string; value: number }[]; color?: string; label?: string }) {
    if (!data.length) return <p className="text-xs text-slate-400 text-center py-6">No data available</p>;
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="space-y-2">
            {data.map(d => (
                <div key={d.label} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-24 shrink-0 truncate">{d.label}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                        <div className="h-full rounded-full flex items-center px-2 transition-all duration-500"
                            style={{ width: `${Math.max((d.value / max) * 100, 4)}%`, background: color }}>
                            <span className="text-[10px] text-white font-bold">{d.value}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
    const total = segments.reduce((s, d) => s + d.value, 0);
    if (!total) return <p className="text-xs text-slate-400 text-center py-6">No data available</p>;
    const R = 55, cx = 70, cy = 70, stroke = 24;
    const circ = 2 * Math.PI * R;
    let offset = 0;
    return (
        <div className="flex items-center gap-4">
            <svg viewBox="0 0 140 140" className="w-32 shrink-0">
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
                {segments.filter(s => s.value > 0).map(seg => {
                    const dash = (seg.value / total) * circ;
                    const el = (
                        <circle key={seg.label} cx={cx} cy={cy} r={R} fill="none"
                            stroke={seg.color} strokeWidth={stroke}
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={-offset}
                            transform={`rotate(-90 ${cx} ${cy})`} />
                    );
                    offset += dash;
                    return el;
                })}
                <text x={cx} y={cy - 5} textAnchor="middle" fontSize="18" fontWeight="700" fill="#1e293b">{total}</text>
                <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#94a3b8">Total</text>
            </svg>
            <div className="space-y-1.5 flex-1">
                {segments.map(s => (
                    <div key={s.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                            <span className="text-xs text-slate-600">{s.label}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Line Chart ────────────────────────────────────────────────────────────────
function LineChart({ data }: { data: { month: string; count: number }[] }) {
    if (!data.length) return <p className="text-xs text-slate-400 text-center py-6">No data available</p>;
    const W = 500, H = 140, PL = 30, PR = 10, PT = 16, PB = 28;
    const cW = W - PL - PR, cH = H - PT - PB;
    const max = Math.max(...data.map(d => d.count), 1);
    const xOf = (i: number) => PL + (data.length > 1 ? (i / (data.length - 1)) * cW : cW / 2);
    const yOf = (v: number) => PT + cH - (v / max) * cH;
    const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yOf(d.count)}`).join(' ');
    const area = `${path} L${xOf(data.length - 1)},${PT + cH} L${xOf(0)},${PT + cH} Z`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: 'inherit' }}>
            <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
            </defs>
            {[0, 0.5, 1].map((t, i) => {
                const y = PT + cH - t * cH;
                return <line key={i} x1={PL} y1={y} x2={W - PR} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
            })}
            <path d={area} fill="url(#lg)" />
            <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {data.map((d, i) => (
                <g key={i}>
                    <circle cx={xOf(i)} cy={yOf(d.count)} r="3.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                    <text x={xOf(i)} y={PT + cH + 14} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.month.split(' ')[0]}</text>
                </g>
            ))}
        </svg>
    );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ title, icon, children, className = '' }: any) {
    return (
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-5 ${className}`}>
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">{icon}{title}</h2>
            {children}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Dashboard({ stats }: any) {
    const nutritionColors: Record<string, string> = {
        'Normal': '#10b981', 'Underweight': '#f59e0b',
        'Severely Underweight': '#ef4444', 'Overweight': '#f97316',
    };
    const nutritionSegments = Object.entries(stats?.nutritional_status ?? {}).map(([label, value]: any) => ({
        label, value, color: nutritionColors[label] ?? '#94a3b8',
    }));

    const classroomColors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444'];
    const classroomData = Object.entries(stats?.classroom_distribution ?? {}).map(([label, value]: any, i) => ({
        label, value, color: classroomColors[i % classroomColors.length],
    }));

    const devPlanColors: Record<string, string> = { active: '#3b82f6', completed: '#10b981', on_hold: '#f59e0b', pending: '#94a3b8' };
    const devPlanSegments = Object.entries(stats?.dev_plan_status ?? {}).map(([label, value]: any) => ({
        label: label.replace('_', ' '), value, color: devPlanColors[label] ?? '#94a3b8',
    }));

    const enrollmentTrend = (stats?.monthly_enrollment_trend ?? []).map((d: any) => ({
        month: d.month, count: d.count,
    }));

    const statCards = [
        { title: 'Total Children',   value: stats?.total_children ?? 0,                          icon: Users,         color: 'from-blue-500 to-indigo-500',   bg: 'bg-blue-50 text-blue-700' },
        { title: 'Male',             value: stats?.gender_distribution?.Male ?? 0,               icon: UserCheck,     color: 'from-sky-400 to-blue-500',      bg: 'bg-sky-50 text-sky-700' },
        { title: 'Female',           value: stats?.gender_distribution?.Female ?? 0,             icon: UserCheck,     color: 'from-pink-400 to-rose-500',     bg: 'bg-pink-50 text-pink-700' },
        { title: 'Health Alerts',    value: stats?.health_alerts?.length ?? 0,                   icon: AlertTriangle, color: 'from-red-400 to-rose-500',      bg: 'bg-red-50 text-red-700' },
        { title: 'Appointments',     value: stats?.total_appointments ?? 0,                      icon: Calendar,      color: 'from-violet-400 to-purple-500', bg: 'bg-violet-50 text-violet-700' },
        { title: 'Dev. Plans',       value: Object.values(stats?.dev_plan_status ?? {}).reduce((a: any, b: any) => a + b, 0), icon: ClipboardList, color: 'from-teal-400 to-emerald-500', bg: 'bg-teal-50 text-teal-700' },
        { title: 'Pending Appts',    value: stats?.pending_appointments ?? 0,                    icon: AlertTriangle, color: 'from-amber-400 to-orange-500',  bg: 'bg-amber-50 text-amber-700' },
        { title: 'Completed Appts',  value: stats?.completed_appointments ?? 0,                  icon: TrendingUp,    color: 'from-emerald-400 to-teal-500',  bg: 'bg-emerald-50 text-emerald-700' },
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500 mt-1 text-sm">Overview of KidCare Hinoba-an Daycare Center</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {statCards.map(s => (
                        <div key={s.title} className={`rounded-2xl border p-3 flex flex-col gap-1 ${s.bg} border-transparent`}>
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                                <s.icon className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-xl font-bold mt-1">{s.value}</p>
                            <p className="text-[10px] font-semibold opacity-70 leading-tight">{s.title}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <Card title="Nutritional Status" icon={<Apple className="w-4 h-4 text-emerald-500" />} className="lg:col-span-1">
                        <DonutChart segments={nutritionSegments} />
                    </Card>

                    <Card title="Monthly Enrollment Trend" icon={<TrendingUp className="w-4 h-4 text-blue-500" />} className="lg:col-span-2">
                        <LineChart data={enrollmentTrend} />
                    </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <Card title="Classroom Distribution" icon={<Baby className="w-4 h-4 text-violet-500" />}>
                        <DonutChart segments={classroomData} />
                    </Card>

                    <Card title="Age Group Distribution" icon={<Users className="w-4 h-4 text-sky-500" />}>
                        <BarChart
                            data={Object.entries(stats?.age_groups ?? {}).map(([label, value]: any) => ({ label: `${label} yrs`, value }))}
                            color="#0ea5e9"
                        />
                    </Card>

                    <Card title="Development Plan Status" icon={<ClipboardList className="w-4 h-4 text-teal-500" />}>
                        <DonutChart segments={devPlanSegments} />
                    </Card>
                </div>

                {/* Growth Trend */}
                {stats?.growth_trend_monthly?.length > 0 && (
                    <Card title="Average Growth Trend (This Year)" icon={<TrendingUp className="w-4 h-4 text-teal-500" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-blue-600 mb-2">Avg Height (cm)</p>
                                <BarChart
                                    data={stats.growth_trend_monthly.map((d: any) => ({ label: d.month, value: d.avg_height }))}
                                    color="#3b82f6"
                                />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-emerald-600 mb-2">Avg Weight (kg)</p>
                                <BarChart
                                    data={stats.growth_trend_monthly.map((d: any) => ({ label: d.month, value: d.avg_weight }))}
                                    color="#10b981"
                                />
                            </div>
                        </div>
                    </Card>
                )}

                {/* Recent Enrollments */}
                <Card title="Recent Enrollments" icon={<Users className="w-4 h-4 text-slate-500" />}>
                    {stats?.recent_enrollments?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100">
                                <thead>
                                    <tr className="bg-slate-50">
                                        {['Name','Sex','Age','Status','Enrolled'].map(h => (
                                            <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {stats.recent_enrollments.map((child: any) => (
                                        <tr key={child.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                                                <Link href={route('admin.children.show', child.id)} className="hover:text-blue-600 transition-colors">
                                                    {child.first_name} {child.last_name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{child.sex}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{child.age} yrs</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                                    child.registration_status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                    child.registration_status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>{child.registration_status}</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{new Date(child.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-sm text-slate-400 text-center py-6">No recent enrollments</p>}
                </Card>
            </div>
        </AdminLayout>
    );
}
