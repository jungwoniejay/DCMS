import { router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { X, TrendingUp, Brain, Utensils, ClipboardList, Users, Trash2, Edit, Save } from 'lucide-react';
import Modal from '@/components/Modal';

type ModalType = 'growth' | 'development' | 'care' | 'observations' | 'parent-involvement' | null;

interface Props {
    child: any;
    type: ModalType;
    onClose: () => void;
}

const ic = 'w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const lc = 'block text-sm font-medium text-slate-600 mb-1';

// ── Growth Data Modal ──────────────────────────────────────────────────────────
function GrowthModal({ child, onClose }: { child: any; onClose: () => void }) {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { data, setData, post, processing, reset } = useForm({
        date_taken: new Date().toISOString().split('T')[0],
        height: '', weight: '', nutritional_status: 'Normal',
    });

    useEffect(() => {
        fetch(route('admin.growth-data', child.id), { headers: { 'X-Inertia': 'true', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r.json()).then(d => { setRecords(d.props?.records || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('admin.growth-data.store', child.id), data as any, {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    const statusColor = (s: string) => ({ Normal: 'bg-green-100 text-green-700', Underweight: 'bg-yellow-100 text-yellow-700', 'Severely Underweight': 'bg-red-100 text-red-700', Overweight: 'bg-orange-100 text-orange-700' }[s] || 'bg-gray-100 text-gray-600');

    return (
        <div className="space-y-5">
            <form onSubmit={submit} className="grid grid-cols-2 gap-3">
                <div><label className={lc}>Date</label><input type="date" value={data.date_taken} onChange={e => setData('date_taken', e.target.value)} className={ic} /></div>
                <div>
                    <label className={lc}>Status</label>
                    <select value={data.nutritional_status} onChange={e => setData('nutritional_status', e.target.value)} className={ic}>
                        {['Normal','Underweight','Severely Underweight','Overweight'].map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div><label className={lc}>Height (cm)</label><input type="number" step="0.1" value={data.height} onChange={e => setData('height', e.target.value)} placeholder="e.g. 105.5" className={ic} /></div>
                <div><label className={lc}>Weight (kg)</label><input type="number" step="0.1" value={data.weight} onChange={e => setData('weight', e.target.value)} placeholder="e.g. 18.5" className={ic} /></div>
                <div className="col-span-2 flex gap-2">
                    <button type="submit" disabled={processing} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"><Save className="w-3.5 h-3.5" />Save</button>
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancel</button>
                </div>
            </form>
            {!loading && records.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">History</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="bg-slate-50">{['Date','Height','Weight','Status'].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>)}</tr></thead>
                            <tbody className="divide-y divide-slate-50">
                                {records.map((r: any) => (
                                    <tr key={r.id} className="hover:bg-slate-50">
                                        <td className="px-3 py-2 text-slate-600">{r.assessment_date}</td>
                                        <td className="px-3 py-2 text-slate-600">{r.height_first} cm</td>
                                        <td className="px-3 py-2 text-slate-600">{r.weight_first} kg</td>
                                        <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(r.nutritional_status_result)}`}>{r.nutritional_status_result}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Development Plans Modal ────────────────────────────────────────────────────
function DevelopmentModal({ child, onClose }: { child: any; onClose: () => void }) {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { data, setData, processing, reset } = useForm({
        plan_type: 'cognitive', current_status: '', goals: '', activities: '', resources_needed: '', target_date: '',
    });

    useEffect(() => {
        fetch(route('admin.development-plans', child.id), { headers: { 'X-Inertia': 'true', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r.json()).then(d => { setPlans(d.props?.plans || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('admin.development-plans.store', child.id), data as any, {
            onSuccess: () => { reset(); setShowForm(false); onClose(); },
        });
    };

    const statusColor = (s: string) => ({ active: 'bg-green-100 text-green-700', completed: 'bg-blue-100 text-blue-700', on_hold: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-gray-100 text-gray-600');

    return (
        <div className="space-y-4">
            <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
                <Plus className="w-3.5 h-3.5" /> Add Plan
            </button>
            {showForm && (
                <form onSubmit={submit} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                        <label className={lc}>Plan Type</label>
                        <select value={data.plan_type} onChange={e => setData('plan_type', e.target.value)} className={ic}>
                            {['cognitive','physical','social','emotional','language'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)} Development</option>)}
                        </select>
                    </div>
                    <div><label className={lc}>Current Status *</label><textarea value={data.current_status} onChange={e => setData('current_status', e.target.value)} className={`${ic} resize-none`} rows={2} required /></div>
                    <div><label className={lc}>Goals *</label><textarea value={data.goals} onChange={e => setData('goals', e.target.value)} className={`${ic} resize-none`} rows={2} required /></div>
                    <div><label className={lc}>Activities *</label><textarea value={data.activities} onChange={e => setData('activities', e.target.value)} className={`${ic} resize-none`} rows={2} required /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className={lc}>Resources (optional)</label><input value={data.resources_needed} onChange={e => setData('resources_needed', e.target.value)} className={ic} /></div>
                        <div><label className={lc}>Target Date (optional)</label><input type="date" value={data.target_date} onChange={e => setData('target_date', e.target.value)} className={ic} /></div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" disabled={processing} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50">Create Plan</button>
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Cancel</button>
                    </div>
                </form>
            )}
            {!loading && plans.length > 0 && (
                <div className="space-y-3">
                    {plans.map((p: any) => (
                        <div key={p.id} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-slate-800 capitalize">{p.plan_type} Development</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(p.status)}`}>{p.status?.replace('_',' ')}</span>
                            </div>
                            <p className="text-xs text-slate-500">{p.goals}</p>
                        </div>
                    ))}
                </div>
            )}
            {!loading && plans.length === 0 && !showForm && <p className="text-sm text-slate-400 text-center py-4">No development plans yet.</p>}
        </div>
    );
}

// ── Care Info Modal ────────────────────────────────────────────────────────────
function CareModal({ child, onClose }: { child: any; onClose: () => void }) {
    const [careInfo, setCareInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(route('admin.children.care.show', child.id), { headers: { 'X-Inertia': 'true', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r.json()).then(d => { setCareInfo(d.props?.careInfo || null); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const Row = ({ label, value }: any) => (
        <div className="flex justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-xs font-medium text-slate-500">{label}</span>
            <span className="text-xs text-slate-700 font-medium">{value || '—'}</span>
        </div>
    );

    if (loading) return <p className="text-sm text-slate-400 text-center py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <a href={route('admin.children.care.edit', child.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700">
                    <Edit className="w-3.5 h-3.5" /> {careInfo ? 'Edit' : 'Add'} Care Info
                </a>
            </div>
            {careInfo ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { title: '🍽 Feeding', rows: [['Appetite', careInfo.feeding_appetite], ['Food Selection', careInfo.feeding_food_selection?.join(', ')], ['Notes', careInfo.feeding_custom]] },
                        { title: '🌙 Sleeping', rows: [['Duration', careInfo.sleeping_duration ? `${careInfo.sleeping_duration} hrs` : null], ['Quality', careInfo.sleeping_quality], ['Notes', careInfo.sleeping_custom]] },
                        { title: '🚿 Bathing', rows: [['Frequency', careInfo.bathing_frequency], ['Assistance', careInfo.bathing_assistance], ['Notes', careInfo.bathing_custom]] },
                        { title: '🚽 Toileting', rows: [['Frequency', careInfo.toileting_frequency], ['Assistance', careInfo.toileting_assistance], ['Notes', careInfo.toileting_custom]] },
                    ].map(s => (
                        <div key={s.title} className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm font-semibold text-slate-700 mb-2">{s.title}</p>
                            {s.rows.map(([l, v]) => <Row key={l} label={l} value={v} />)}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-slate-400 text-center py-8">No care information recorded yet.</p>
            )}
        </div>
    );
}

// ── Observations Modal ─────────────────────────────────────────────────────────
function ObservationsModal({ child, onClose }: { child: any; onClose: () => void }) {
    const [observations, setObservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(true);
    const { data, setData, processing, reset } = useForm({ behavior_name: '', observation_count: '', comment: '' });

    const load = () => {
        fetch(route('admin.children.observations.index', child.id), { headers: { 'X-Inertia': 'true', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r.json()).then(d => { setObservations(d.props?.observations || []); setLoading(false); })
            .catch(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('admin.children.observations.store', child.id), data as any, {
            onSuccess: () => { reset(); setShowForm(false); load(); },
        });
    };

    const del = (obsId: number) => {
        if (confirm('Delete this observation?')) {
            router.delete(route('admin.children.observations.destroy', [child.id, obsId]), { onSuccess: () => load() });
        }
    };

    return (
        <div className="space-y-4">
            {showForm && (
                <form onSubmit={submit} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div><label className={lc}>Behavior Name *</label><input value={data.behavior_name} onChange={e => setData('behavior_name', e.target.value)} className={ic} required placeholder="e.g. Sharing with peers" /></div>
                    <div>
                        <label className={lc}>Observation Count *</label>
                        <select value={data.observation_count} onChange={e => setData('observation_count', e.target.value)} className={ic} required>
                            <option value="">Select...</option>
                            {['1st','2nd','3rd','4th'].map(o => <option key={o} value={o}>{o} observation</option>)}
                        </select>
                    </div>
                    <div><label className={lc}>Comment</label><textarea value={data.comment} onChange={e => setData('comment', e.target.value)} className={`${ic} resize-none`} rows={3} /></div>
                    <div className="flex gap-2">
                        <button type="submit" disabled={processing} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold disabled:opacity-50">Save</button>
                    </div>
                </form>
            )}
            {!loading && observations.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="bg-slate-50">{['Behavior','Count','Comment','Date',''].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-slate-50">
                            {observations.map((o: any) => (
                                <tr key={o.id} className="hover:bg-slate-50">
                                    <td className="px-3 py-2 text-slate-700 font-medium">{o.behavior_name}</td>
                                    <td className="px-3 py-2"><span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700 font-medium">{o.observation_count}</span></td>
                                    <td className="px-3 py-2 text-slate-500 text-xs max-w-[150px] truncate">{o.comment || '—'}</td>
                                    <td className="px-3 py-2 text-slate-400 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td className="px-3 py-2"><button onClick={() => del(o.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!loading && observations.length === 0 && !showForm && <p className="text-sm text-slate-400 text-center py-4">No observations recorded yet.</p>}
        </div>
    );
}

// ── Parent Involvement Modal ───────────────────────────────────────────────────
function ParentInvolvementModal({ child, onClose }: { child: any; onClose: () => void }) {
    const [pi, setPi] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(route('admin.children.parent-involvement.show', child.id), { headers: { 'X-Inertia': 'true', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(r => r.json()).then(d => { setPi(d.props?.parentInvolvement || null); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-sm text-slate-400 text-center py-8">Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <a href={route('admin.children.parent-involvement.edit', child.id)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600">
                    <Edit className="w-3.5 h-3.5" /> {pi ? 'Edit' : 'Add'} Parent Involvement
                </a>
            </div>
            {pi ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl">
                        {[['Name', pi.parent_name], ['Relationship', pi.parent_relationship], ['Contact', pi.parent_contact], ['Email', pi.parent_email]].map(([l, v]) => (
                            <div key={l}>
                                <p className="text-xs font-medium text-slate-400">{l}</p>
                                <p className="text-sm text-slate-700 font-medium mt-0.5">{v || '—'}</p>
                            </div>
                        ))}
                    </div>
                    {pi.support_roles?.length > 0 && (
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Support Roles</p>
                            <div className="flex flex-wrap gap-2">
                                {pi.support_roles.map((r: string) => <span key={r} className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700 font-medium">{r}</span>)}
                            </div>
                        </div>
                    )}
                    {pi.additional_notes && (
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Notes</p>
                            <p className="text-sm text-slate-600">{pi.additional_notes}</p>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-sm text-slate-400 text-center py-8">No parent involvement data recorded yet.</p>
            )}
        </div>
    );
}

// ── Main Export ────────────────────────────────────────────────────────────────
const modalConfig: Record<string, { title: string; icon: any; maxWidth: any }> = {
    growth:             { title: 'Add Growth Data',      icon: TrendingUp,   maxWidth: 'lg' },
    development:        { title: 'Development Plans',    icon: Brain,        maxWidth: 'xl' },
    care:               { title: 'Care Information',     icon: Utensils,     maxWidth: 'xl' },
    observations:       { title: 'Observations',         icon: ClipboardList, maxWidth: 'xl' },
    'parent-involvement': { title: 'Parent Involvement', icon: Users,        maxWidth: 'lg' },
};

export default function ChildActionsModal({ child, type, onClose }: Props) {
    if (!type || !child) return null;
    const config = modalConfig[type];
    const Icon = config.icon;

    return (
        <Modal
            show={true}
            onClose={onClose}
            title={`${config.title} — ${child.first_name} ${child.last_name}`}
            maxWidth={config.maxWidth}
        >
            {type === 'growth'               && <GrowthModal child={child} onClose={onClose} />}
            {type === 'development'          && <DevelopmentModal child={child} onClose={onClose} />}
            {type === 'care'                 && <CareModal child={child} onClose={onClose} />}
            {type === 'observations'         && <ObservationsModal child={child} onClose={onClose} />}
            {type === 'parent-involvement'   && <ParentInvolvementModal child={child} onClose={onClose} />}
        </Modal>
    );
}
