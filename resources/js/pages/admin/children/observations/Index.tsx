import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Plus, Edit, Trash2, ClipboardList, X, Save } from 'lucide-react';
import { useState } from 'react';

const ic = 'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all';
const lc = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5';

const COUNT_OPTIONS = ['1st', '2nd', '3rd', '4th'];

const countColor: Record<string, string> = {
    '1st': 'bg-blue-100 text-blue-700',
    '2nd': 'bg-violet-100 text-violet-700',
    '3rd': 'bg-amber-100 text-amber-700',
    '4th': 'bg-emerald-100 text-emerald-700',
};

export default function ChildObservationsIndex({ child, observations }: any) {
    const [modal, setModal] = useState<'add' | 'edit' | null>(null);
    const [editing, setEditing] = useState<any>(null);

    const addForm = useForm({ behavior_name: '', observation_count: '', comment: '' });
    const editForm = useForm({ behavior_name: '', observation_count: '', comment: '' });

    const openAdd = () => {
        addForm.reset();
        setModal('add');
    };

    const openEdit = (obs: any) => {
        setEditing(obs);
        editForm.setData({ behavior_name: obs.behavior_name, observation_count: obs.observation_count, comment: obs.comment || '' });
        setModal('edit');
    };

    const closeModal = () => { setModal(null); setEditing(null); };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('admin.children.observations.store', child.id), { onSuccess: closeModal });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('admin.children.observations.update', [child.id, editing.id]), { onSuccess: closeModal });
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this observation?')) {
            router.delete(route('admin.children.observations.destroy', [child.id, id]));
        }
    };

    return (
        <AdminLayout>
            <Head title={`Observations — ${child.first_name} ${child.last_name}`} />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.children.show', child.id)}
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Observations</h1>
                            <p className="text-slate-500 text-sm mt-0.5">
                                {child.first_name} {child.last_name} · {observations.length} record{observations.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <button onClick={openAdd}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                        <Plus className="w-4 h-4" /> Add Observation
                    </button>
                </div>

                {/* Content */}
                {observations.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="bg-slate-50">
                                    {['Behavior', 'Count', 'Comment', 'Date', ''].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {observations.map((obs: any) => (
                                    <tr key={obs.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm font-semibold text-slate-700">{obs.behavior_name}</p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${countColor[obs.observation_count] ?? 'bg-slate-100 text-slate-600'}`}>
                                                {obs.observation_count}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 max-w-xs">
                                            <p className="text-sm text-slate-500 truncate">{obs.comment || <span className="italic text-slate-300">—</span>}</p>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <p className="text-xs text-slate-400">{new Date(obs.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(obs)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all">
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(obs.id)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <ClipboardList className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-1">No observations yet</h3>
                        <p className="text-slate-400 text-sm mb-6">Start recording behavioral observations for this child.</p>
                        <button onClick={openAdd}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                            <Plus className="w-4 h-4" /> Add First Observation
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">{modal === 'add' ? 'Add Observation' : 'Edit Observation'}</h3>
                            <button onClick={closeModal} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={modal === 'add' ? handleAdd : handleEdit} className="p-5 space-y-4">
                            <div>
                                <label className={lc}>Behavior Name <span className="text-red-400 normal-case font-normal">*</span></label>
                                <input type="text"
                                    value={modal === 'add' ? addForm.data.behavior_name : editForm.data.behavior_name}
                                    onChange={e => modal === 'add' ? addForm.setData('behavior_name', e.target.value) : editForm.setData('behavior_name', e.target.value)}
                                    className={ic} placeholder="e.g. Sharing with peers"
                                />
                                {(modal === 'add' ? addForm.errors.behavior_name : editForm.errors.behavior_name) && (
                                    <p className="text-xs text-red-500 mt-1">{modal === 'add' ? addForm.errors.behavior_name : editForm.errors.behavior_name}</p>
                                )}
                            </div>

                            <div>
                                <label className={lc}>Observation Count <span className="text-red-400 normal-case font-normal">*</span></label>
                                <div className="flex gap-2">
                                    {COUNT_OPTIONS.map(opt => {
                                        const val = modal === 'add' ? addForm.data.observation_count : editForm.data.observation_count;
                                        const active = val === opt;
                                        return (
                                            <button key={opt} type="button"
                                                onClick={() => modal === 'add' ? addForm.setData('observation_count', opt) : editForm.setData('observation_count', opt)}
                                                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${active ? `${countColor[opt]} border-current` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                                {(modal === 'add' ? addForm.errors.observation_count : editForm.errors.observation_count) && (
                                    <p className="text-xs text-red-500 mt-1">{modal === 'add' ? addForm.errors.observation_count : editForm.errors.observation_count}</p>
                                )}
                            </div>

                            <div>
                                <label className={lc}>Comment</label>
                                <textarea
                                    value={modal === 'add' ? addForm.data.comment : editForm.data.comment}
                                    onChange={e => modal === 'add' ? addForm.setData('comment', e.target.value) : editForm.setData('comment', e.target.value)}
                                    className={ic} rows={3}
                                    placeholder="Enter observation details..."
                                />
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button type="submit"
                                    disabled={modal === 'add' ? addForm.processing : editForm.processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all">
                                    <Save className="w-4 h-4" />
                                    {modal === 'add' ? (addForm.processing ? 'Saving...' : 'Save') : (editForm.processing ? 'Updating...' : 'Update')}
                                </button>
                                <button type="button" onClick={closeModal}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
