import ParentLayout from '@/layouts/parent-layout';
import { TrendingUp, Ruler, Weight, X, Calendar, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface HistoryRecord { date: string; height: number; weight: number; status: string; }
interface NutritionData {
    child_id: number; child_name: string; age: number; sex: string;
    current_status: string; current_height: number | null; current_weight: number | null;
    last_measured: string | null; history: HistoryRecord[];
    food_allergies: string | null; eating_habits: string | null;
}

const statusStyle: Record<string, { badge: string; dot: string }> = {
    'Normal':               { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    'Underweight':          { badge: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500'   },
    'Severely Underweight': { badge: 'bg-red-100 text-red-700',         dot: 'bg-red-500'     },
    'Overweight':           { badge: 'bg-orange-100 text-orange-700',   dot: 'bg-orange-500'  },
    'Not assessed':         { badge: 'bg-slate-100 text-slate-500',     dot: 'bg-slate-400'   },
};
const getStyle = (s: string) => statusStyle[s] ?? statusStyle['Not assessed'];

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

function GrowthChart({ history }: { history: HistoryRecord[] }) {
    if (history.length === 0) return null;

    const W = 700, H = 280, PL = 55, PR = 20, PT = 20, PB = 50;
    const chartW = W - PL - PR;
    const chartH = H - PT - PB;

    const heights = history.map(r => Number(r.height));
    const weights = history.map(r => Number(r.weight));
    const allVals = [...heights, ...weights];
    const minV = Math.floor(Math.min(...allVals) * 0.9);
    const maxV = Math.ceil(Math.max(...allVals) * 1.1);

    const xStep = history.length > 1 ? chartW / (history.length - 1) : chartW / 2;
    const toX = (i: number) => PL + (history.length > 1 ? i * xStep : chartW / 2);
    const toY = (v: number) => PT + chartH - ((v - minV) / (maxV - minV)) * chartH;

    const hPath = heights.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');
    const wPath = weights.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');

    const yTicks = 5;
    const yStep = (maxV - minV) / yTicks;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: 'inherit' }}>
            {/* Grid */}
            {Array.from({ length: yTicks + 1 }, (_, i) => {
                const val = minV + i * yStep;
                const y = toY(val);
                return (
                    <g key={i}>
                        <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                        <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{Math.round(val)}</text>
                    </g>
                );
            })}

            {/* Axes */}
            <line x1={PL} y1={PT} x2={PL} y2={PT + chartH} stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1={PL} y1={PT + chartH} x2={W - PR} y2={PT + chartH} stroke="#cbd5e1" strokeWidth="1.5" />

            {/* X labels */}
            {history.map((r, i) => (
                <text key={i} x={toX(i)} y={PT + chartH + 16} textAnchor="middle" fontSize="9" fill="#94a3b8">
                    {new Date(r.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                </text>
            ))}

            {/* Height line */}
            <path d={hPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {heights.map((v, i) => (
                <circle key={i} cx={toX(i)} cy={toY(v)} r="4" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
            ))}

            {/* Weight line */}
            <path d={wPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {weights.map((v, i) => (
                <circle key={i} cx={toX(i)} cy={toY(v)} r="4" fill="#10b981" stroke="white" strokeWidth="1.5" />
            ))}

            {/* Legend */}
            <circle cx={PL + 10} cy={PT - 6} r="4" fill="#3b82f6" />
            <text x={PL + 18} y={PT - 2} fontSize="10" fill="#475569">Height (cm)</text>
            <circle cx={PL + 100} cy={PT - 6} r="4" fill="#10b981" />
            <text x={PL + 108} y={PT - 2} fontSize="10" fill="#475569">Weight (kg)</text>
        </svg>
    );
}

export default function Nutrition({ nutritionData }: { nutritionData: NutritionData[] }) {
    const [selected, setSelected] = useState<NutritionData | null>(null);

    return (
        <ParentLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Growth & Development</h1>
                    <p className="text-slate-500 text-sm mt-1">Track your children's growth, nutrition status, and feeding habits</p>
                </div>

                {nutritionData.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">No growth data available yet.</p>
                        <p className="text-slate-400 text-sm mt-1">Data will appear once the admin records measurements.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {nutritionData.map((data) => {
                            const s = getStyle(data.current_status);
                            return (
                                <div key={data.child_id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    {/* Card header */}
                                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">{data.child_name}</h2>
                                            <p className="text-slate-500 text-sm mt-0.5">{data.age} years old • {data.sex}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                            {data.current_status}
                                        </span>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Ruler className="w-4 h-4 text-blue-500" />
                                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Height</span>
                                                </div>
                                                <p className="text-2xl font-bold text-blue-700">
                                                    {data.current_height ? `${data.current_height}` : '—'}
                                                </p>
                                                <p className="text-xs text-blue-500 mt-0.5">{data.current_height ? 'cm' : 'Not recorded'}</p>
                                            </div>

                                            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Weight className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Weight</span>
                                                </div>
                                                <p className="text-2xl font-bold text-emerald-700">
                                                    {data.current_weight ? `${data.current_weight}` : '—'}
                                                </p>
                                                <p className="text-xs text-emerald-500 mt-0.5">{data.current_weight ? 'kg' : 'Not recorded'}</p>
                                            </div>

                                            <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="w-4 h-4 text-violet-500" />
                                                    <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">Last Measured</span>
                                                </div>
                                                <p className="text-sm font-bold text-violet-700 leading-tight">
                                                    {data.last_measured ? fmtDate(data.last_measured) : '—'}
                                                </p>
                                                <p className="text-xs text-violet-400 mt-0.5">{data.last_measured ? '' : 'No record'}</p>
                                            </div>
                                        </div>

                                        {/* Allergies / Eating habits */}
                                        {(data.food_allergies || data.eating_habits) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {data.food_allergies && (
                                                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                                                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">Food Allergies</p>
                                                            <p className="text-sm text-red-700">{data.food_allergies}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {data.eating_habits && (
                                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Eating Habits</p>
                                                        <p className="text-sm text-slate-600">{data.eating_habits}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Growth history table */}
                                        {data.history.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Growth History</p>
                                                <div className="rounded-xl border border-slate-100 overflow-hidden">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-slate-50">
                                                                {['Date', 'Height (cm)', 'Weight (kg)', 'Status'].map(h => (
                                                                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-50">
                                                            {data.history.map((r, i) => {
                                                                const rs = getStyle(r.status);
                                                                return (
                                                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                                        <td className="px-4 py-3 text-slate-600">{fmtDate(r.date)}</td>
                                                                        <td className="px-4 py-3 font-semibold text-blue-600">{r.height}</td>
                                                                        <td className="px-4 py-3 font-semibold text-emerald-600">{r.weight}</td>
                                                                        <td className="px-4 py-3">
                                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${rs.badge}`}>
                                                                                <span className={`w-1.5 h-1.5 rounded-full ${rs.dot}`} />
                                                                                {r.status}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        <button onClick={() => setSelected(data)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                                            <TrendingUp className="w-4 h-4" /> View Growth Chart
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Growth Chart Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
                            <div>
                                <h3 className="font-bold text-slate-800">Growth Chart</h3>
                                <p className="text-slate-500 text-sm">{selected.child_name}</p>
                            </div>
                            <button onClick={() => setSelected(null)}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Summary pills */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Age', value: `${selected.age} yrs`, color: 'bg-blue-50 text-blue-700 border-blue-100' },
                                    { label: 'Sex', value: selected.sex, color: 'bg-violet-50 text-violet-700 border-violet-100' },
                                    { label: 'Status', value: selected.current_status, color: `${getStyle(selected.current_status).badge} border-transparent` },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className={`rounded-2xl border p-4 ${color}`}>
                                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">{label}</p>
                                        <p className="text-lg font-bold">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Chart */}
                            {selected.history.length > 0 ? (
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Growth Visualization</p>
                                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                                        <GrowthChart history={selected.history} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-sm">No growth records to chart yet.</div>
                            )}

                            {/* History table in modal */}
                            {selected.history.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Growth History</p>
                                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-slate-50">
                                                    {['Date', 'Height (cm)', 'Weight (kg)', 'Status'].map(h => (
                                                        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {selected.history.map((r, i) => {
                                                    const rs = getStyle(r.status);
                                                    return (
                                                        <tr key={i} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 text-slate-600">{fmtDate(r.date)}</td>
                                                            <td className="px-4 py-3 font-semibold text-blue-600">{r.height}</td>
                                                            <td className="px-4 py-3 font-semibold text-emerald-600">{r.weight}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${rs.badge}`}>
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${rs.dot}`} />
                                                                    {r.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button onClick={() => window.print()}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                                    Print Chart
                                </button>
                                <button onClick={() => setSelected(null)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-all">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ParentLayout>
    );
}
