import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, MapPin } from 'lucide-react';

export default function Puroks({ puroks }: { puroks: { id: number; name: string }[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const addForm = useForm({ name: '' });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('admin.settings.puroks.store'), {
            onSuccess: () => addForm.reset(),
        });
    };

    const startEdit = (purok: { id: number; name: string }) => {
        setEditingId(purok.id);
        setEditName(purok.name);
    };

    const saveEdit = (id: number) => {
        router.put(route('admin.settings.puroks.update', id), { name: editName }, {
            onSuccess: () => setEditingId(null),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this purok?')) {
            router.delete(route('admin.settings.puroks.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Purok Database" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Purok Database</h1>
                    <p className="text-gray-600 mt-1 text-sm">Manage puroks/zones used across the system</p>
                </div>

                {/* Add New Purok */}
                <div className="bg-white rounded-lg shadow p-5">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-green-600" />
                        Add New Purok
                    </h2>
                    <form onSubmit={handleAdd} className="flex gap-3">
                        <input
                            type="text"
                            value={addForm.data.name}
                            onChange={(e) => addForm.setData('name', e.target.value)}
                            placeholder="e.g. Purok 1, Purok Mabuhay..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            type="submit"
                            disabled={addForm.processing}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </form>
                    {addForm.errors.name && (
                        <p className="text-red-500 text-xs mt-2">{addForm.errors.name}</p>
                    )}
                </div>

                {/* Puroks List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600">{puroks.length} purok{puroks.length !== 1 ? 's' : ''} registered</p>
                    </div>

                    {puroks.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No puroks added yet</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {puroks.map((purok) => (
                                <li key={purok.id} className="flex items-center gap-3 px-5 py-3">
                                    <MapPin className="w-4 h-4 text-green-500 shrink-0" />

                                    {editingId === purok.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="flex-1 px-2 py-1 border border-green-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                                autoFocus
                                            />
                                            <button onClick={() => saveEdit(purok.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-sm font-medium text-gray-800">{purok.name}</span>
                                            <button onClick={() => startEdit(purok)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(purok.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
