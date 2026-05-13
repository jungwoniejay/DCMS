import ParentLayout from '@/layouts/parent-layout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Brain, ClipboardCheck, ChevronDown, ChevronUp, User, RefreshCw, Download } from 'lucide-react';

interface GrowthPoint { date: string; height: number; weight: number; status: string; }
interface ObsPoint { month: string; label: string; avg_score: number; count: number; behaviors: string[]; }
interface PlanSummary {
    total: number; completed: number; in_progress: number; pending: number;
    recent: { plan_type: string; status: string; target_date: string | null; progress_notes: string | null }[];
}
interface DevelopmentData {
    child_id: number; child_name: string; age: number; sex: string;
    growth_history: GrowthPoint[];
    observations: ObsPoint[];
    plan_summary: PlanSummary;
}

// ─── Growth Chart ────────────────────────────────────────────────────────────
function GrowthChart({ history }: { history: GrowthPoint[] }) {
    if (history.length === 0) return <Empty text="No growth records yet." />;

    const W = 680, H = 260, PL = 50, PR = 16, PT = 24, PB = 44;
    const cW = W - PL - PR, cH = H - PT - PB;

    const heights = history.map(r => r.height);
    const weights = history.map(r => r.weight);
    const all = [...heights, ...weights].filter(Boolean);
    const minV = Math.floor(Math.min(...all) * 0.92);
    const maxV = Math.ceil(Math.max(...all) * 1.08);

    const xOf = (i: number) => PL + (history.length > 1 ? (i / (history.length - 1)) * cW : cW / 2);
    const yOf = (v: number) => PT + cH - ((v - minV) / (maxV - minV)) * cH;

    const hPath = heights.map((v, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yOf(v)}`).join(' ');
    const wPath = weights.map((v, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yOf(v)}`).join(' ');

    const ticks = 5;
    const step = (maxV - minV) / ticks;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: 'inherit' }}>
            {Array.from({ length: ticks + 1 }, (_, i) => {
                const val = minV + i * step;
                const y = yOf(val);
                return (
                    <g key={i}>
                        <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                        <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{Math.round(val)}</text>
                    </g>
                );
            })}
            <line x1={PL} y1={PT} x2={PL} y2={PT + cH} stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1={PL} y1={PT + cH} x2={W - PR} y2={PT + cH} stroke="#cbd5e1" strokeWidth="1.5" />

            {history.map((r, i) => (
                <text key={i} x={xOf(i)} y={PT + cH + 14} textAnchor="middle" fontSize="8" fill="#94a3b8">
                    {new Date(r.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                </text>
            ))}

            {/* Height */}
            <path d={hPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {heights.map((v, i) => (
                <g key={i}>
                    <circle cx={xOf(i)} cy={yOf(v)} r="4" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                    <text x={xOf(i)} y={yOf(v) - 8} textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="600">{v}</text>
                </g>
            ))}

            {/* Weight */}
            <path d={wPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {weights.map((v, i) => (
                <g key={i}>
                    <circle cx={xOf(i)} cy={yOf(v)} r="4" fill="#10b981" stroke="white" strokeWidth="1.5" />
                    <text x={xOf(i)} y={yOf(v) - 8} textAnchor="middle" fontSize="8" fill="#10b981" fontWeight="600">{v}</text>
                </g>
            ))}

            {/* Legend */}
            <circle cx={PL + 8} cy={PT - 10} r="4" fill="#3b82f6" />
            <text x={PL + 16} y={PT - 6} fontSize="9" fill="#475569">Height (cm)</text>
            <circle cx={PL + 100} cy={PT - 10} r="4" fill="#10b981" />
            <text x={PL + 108} y={PT - 6} fontSize="9" fill="#475569">Weight (kg)</text>
        </svg>
    );
}

// ─── Milestone Bar Chart ──────────────────────────────────────────────────────
function MilestoneChart({ observations }: { observations: ObsPoint[] }) {
    if (observations.length === 0) return <Empty text="No behavioral observations recorded yet." />;

    const W = 680, H = 220, PL = 50, PR = 16, PT = 20, PB = 44;
    const cW = W - PL - PR, cH = H - PT - PB;
    const maxScore = 4;
    const barW = Math.min(40, (cW / observations.length) * 0.6);

    const xOf = (i: number) => PL + (i + 0.5) * (cW / observations.length);
    const yOf = (v: number) => PT + cH - (v / maxScore) * cH;
    const barH = (v: number) => (v / maxScore) * cH;

    const scoreLabel = (s: number) => s >= 3.5 ? 'Independent' : s >= 2.5 ? 'Maximum' : s >= 1.5 ? 'Moderate' : 'Minimum';
    const barColor = (s: number) => s >= 3.5 ? '#10b981' : s >= 2.5 ? '#3b82f6' : s >= 1.5 ? '#f59e0b' : '#f87171';

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: 'inherit' }}>
            {[1, 2, 3, 4].map(tick => {
                const y = yOf(tick);
                return (
                    <g key={tick}>
                        <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={tick < 4 ? '4 3' : '0'} />
                        <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{tick}</text>
                    </g>
                );
            })}
            <line x1={PL} y1={PT} x2={PL} y2={PT + cH} stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1={PL} y1={PT + cH} x2={W - PR} y2={PT + cH} stroke="#cbd5e1" strokeWidth="1.5" />

            {observations.map((obs, i) => {
                const x = xOf(i);
                const bh = barH(obs.avg_score);
                const by = yOf(obs.avg_score);
                const color = barColor(obs.avg_score);
                return (
                    <g key={obs.month}>
                        <rect x={x - barW / 2} y={by} width={barW} height={bh} rx="4" fill={color} opacity="0.85" />
                        <text x={x} y={by - 5} textAnchor="middle" fontSize="8" fill={color} fontWeight="700">{obs.avg_score.toFixed(1)}</text>
                        <text x={x} y={PT + cH + 13} textAnchor="middle" fontSize="8" fill="#94a3b8">{obs.label.split(' ')[0]}</text>
                        <text x={x} y={PT + cH + 24} textAnchor="middle" fontSize="8" fill="#94a3b8">{obs.label.split(' ')[1]}</text>
                    </g>
                );
            })}

            {/* Legend */}
            {[['#f87171', 'Minimum (1)'], ['#f59e0b', 'Moderate (2)'], ['#3b82f6', 'Maximum (3)'], ['#10b981', 'Independent (4)']].map(([color, label], i) => (
                <g key={label}>
                    <rect x={PL + i * 140} y={PT - 14} width="10" height="10" rx="2" fill={color} />
                    <text x={PL + i * 140 + 14} y={PT - 5} fontSize="8" fill="#475569">{label}</text>
                </g>
            ))}
        </svg>
    );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ summary }: { summary: PlanSummary }) {
    if (summary.total === 0) return <Empty text="No development plans assigned yet." />;

    const segments = [
        { label: 'Completed',   value: summary.completed,   color: '#10b981' },
        { label: 'In Progress', value: summary.in_progress, color: '#3b82f6' },
        { label: 'Pending',     value: summary.pending,     color: '#f59e0b' },
    ].filter(s => s.value > 0);

    const R = 60, cx = 90, cy = 80, stroke = 28;
    const circ = 2 * Math.PI * R;
    let offset = 0;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <svg viewBox="0 0 180 160" className="w-40 shrink-0" style={{ fontFamily: 'inherit' }}>
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
                {segments.map((seg) => {
                    const dash = (seg.value / summary.total) * circ;
                    const gap = circ - dash;
                    const el = (
                        <circle key={seg.label} cx={cx} cy={cy} r={R}
                            fill="none" stroke={seg.color} strokeWidth={stroke}
                            strokeDasharray={`${dash} ${gap}`}
                            strokeDashoffset={-offset}
                            transform={`rotate(-90 ${cx} ${cy})`}
                            strokeLinecap="butt"
                        />
                    );
                    offset += dash;
                    return el;
                })}
                <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">{summary.total}</text>
                <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#94a3b8">Total Plans</text>
            </svg>

            <div className="space-y-2 flex-1">
                {segments.map(seg => (
                    <div key={seg.label} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
                            <span className="text-sm text-slate-600">{seg.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${(seg.value / summary.total) * 100}%`, background: seg.color }} />
                            </div>
                            <span className="text-sm font-bold text-slate-700 w-4 text-right">{seg.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Empty({ text }: { text: string }) {
    return <p className="text-sm text-slate-400 text-center py-6">{text}</p>;
}

const statusBadge: Record<string, string> = {
    completed:   'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-blue-100 text-blue-700',
    pending:     'bg-amber-100 text-amber-700',
};

// ─── Child Card ───────────────────────────────────────────────────────────────
function ChildCard({ data }: { data: DevelopmentData }) {
    const [tab, setTab] = useState<'growth' | 'milestones' | 'plans'>('growth');
    const [expanded, setExpanded] = useState(true);

    const tabs = [
        { key: 'growth',     label: 'Growth',      icon: TrendingUp },
        { key: 'milestones', label: 'Milestones',   icon: Brain },
        { key: 'plans',      label: 'Dev. Plans',   icon: ClipboardCheck },
    ] as const;

    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setExpanded(e => !e)}
                className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 hover:bg-white/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center shadow-sm">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-slate-800">{data.child_name}</p>
                        <p className="text-xs text-slate-500">{data.age} yrs old • {data.sex}</p>
                    </div>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expanded && (
                <div className="p-5 space-y-4">
                    {/* Download Report Button */}
                    <a
                        href={`/parent/children/${data.child_id}/report`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                    >
                        <Download className="w-3.5 h-3.5" /> Download Progress Report (PDF)
                    </a>
                    {/* Tabs */}
                    <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                        {tabs.map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                                    tab === t.key
                                        ? 'bg-white text-teal-700 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}>
                                <t.icon className="w-3.5 h-3.5" />
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {tab === 'growth' && (
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Height & Weight Over Time</p>
                            <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                                <GrowthChart history={data.growth_history} />
                            </div>
                            {data.growth_history.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    {[
                                        { label: 'Latest Height', value: `${data.growth_history.at(-1)?.height ?? '—'} cm`, color: 'text-blue-600' },
                                        { label: 'Latest Weight', value: `${data.growth_history.at(-1)?.weight ?? '—'} kg`, color: 'text-emerald-600' },
                                        { label: 'Status',        value: data.growth_history.at(-1)?.status ?? '—',          color: 'text-violet-600' },
                                    ].map(s => (
                                        <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-3">
                                            <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {tab === 'milestones' && (
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Behavioral Milestones by Month</p>
                            <p className="text-[11px] text-slate-400">Score: 1 = Minimum &nbsp;•&nbsp; 2 = Moderate &nbsp;•&nbsp; 3 = Maximum &nbsp;•&nbsp; 4 = Independent</p>
                            <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                                <MilestoneChart observations={data.observations} />
                            </div>
                            {data.observations.length > 0 && (
                                <div className="space-y-2">
                                    {data.observations.slice(-3).reverse().map(obs => (
                                        <div key={obs.month} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">{obs.label}</p>
                                                <p className="text-xs text-slate-400">{obs.count} observation{obs.count !== 1 ? 's' : ''}</p>
                                            </div>
                                            <span className="text-sm font-bold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
                                                {obs.avg_score.toFixed(1)} / 4
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {tab === 'plans' && (
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Development Plan Progress</p>
                            <DonutChart summary={data.plan_summary} />
                            {data.plan_summary.recent.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Recent Plans</p>
                                    {data.plan_summary.recent.map((plan, i) => (
                                        <div key={i} className="flex items-start justify-between gap-3 p-3 bg-white rounded-xl border border-slate-100">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-700 capitalize">{plan.plan_type?.replace(/_/g, ' ')}</p>
                                                {plan.progress_notes && (
                                                    <p className="text-xs text-slate-400 mt-0.5 truncate">{plan.progress_notes}</p>
                                                )}
                                                {plan.target_date && (
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Target: {new Date(plan.target_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                )}
                                            </div>
                                            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${statusBadge[plan.status] ?? 'bg-slate-100 text-slate-500'}`}>
                                                {plan.status?.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ChildDevelopment({ developmentData }: { developmentData: DevelopmentData[] }) {
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const refresh = useCallback(() => {
        setRefreshing(true);
        router.reload({
            only: ['developmentData'],
            onFinish: () => {
                setRefreshing(false);
                setLastUpdated(new Date());
            },
        });
    }, []);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(refresh, 30000);
        return () => clearInterval(interval);
    }, [refresh]);

    return (
        <ParentLayout>
            <Head title="Child Development" />
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Child Development</h1>
                        <p className="text-slate-500 text-sm mt-1">Track your child's growth, behavioral milestones, and development plan progress over time.</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <button
                            onClick={refresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-white hover:shadow-sm transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <p className="text-[10px] text-slate-400">Updated {lastUpdated.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>

                {developmentData.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="w-8 h-8 text-teal-400" />
                        </div>
                        <p className="text-slate-500 font-medium">No approved children found.</p>
                        <p className="text-slate-400 text-sm mt-1">Development data will appear once your child's enrollment is approved.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {developmentData.map(data => (
                            <ChildCard key={data.child_id} data={data} />
                        ))}
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}
