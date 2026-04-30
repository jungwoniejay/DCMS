import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, MapPin, Building2, ChevronDown, ChevronRight } from 'lucide-react';

interface Province { id: number; name: string; cities_count: number; }
interface City     { id: number; name: string; province_id: number; province?: { name: string }; }

export default function Locations({ provinces, cities }: { provinces: Province[]; cities: City[] }) {
    const [activeTab, setActiveTab] = useState<'provinces' | 'cities'>('provinces');
    const [expandedProvince, setExpandedProvince] = useState<number | null>(null);

    // Province state
    const [editingProvinceId, setEditingProvinceId] = useState<number | null>(null);
    const [editProvinceName, setEditProvinceName] = useState('');
    const addProvinceForm = useForm({ name: '' });

    // City state
    const [editingCityId, setEditingCityId] = useState<number | null>(null);
    const [editCityName, setEditCityName] = useState('');
    const [editCityProvinceId, setEditCityProvinceId] = useState('');
    const addCityForm = useForm({ name: '', province_id: '' });

    const inputClass = 'flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400';
    const selectClass = 'px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400';

    // Province handlers
    const handleAddProvince = (e: React.FormEvent) => {
        e.preventDefault();
        addProvinceForm.post(route('admin.settings.provinces.store'), { onSuccess: () => addProvinceForm.reset() });
    };
    const saveProvince = (id: number) => {
        router.put(route('admin.settings.provinces.update', id), { name: editProvinceName }, { onSuccess: () => setEditingProvinceId(null) });
    };
    const deleteProvince = (id: number) => {
        if (confirm('Delete this province? All its cities will also be removed.')) {
            router.delete(route('admin.settings.provinces.destroy', id));
        }
    };

    // City handlers
    const handleAddCity = (e: React.FormEvent) => {
        e.preventDefault();
        addCityForm.post(route('admin.settings.cities.store'), { onSuccess: () => addCityForm.reset() });
    };
    const saveCity = (id: number) => {
        router.put(route('admin.settings.cities.update', id), { name: editCityName, province_id: editCityProvinceId }, { onSuccess: () => setEditingCityId(null) });
    };
    const deleteCity = (id: number) => {
        if (confirm('Delete this city/municipality?')) {
            router.delete(route('admin.settings.cities.destroy', id));
        }
    };

    const citiesForProvince = (provinceId: number) => cities.filter(c => c.province_id === provinceId);

    return (
        <AdminLayout>
            <Head title="City & Province Database" />
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">City & Province Database</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage provinces and cities/municipalities used across the system</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{provinces.length}</p>
                            <p className="text-xs text-gray-500">Provinces</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{cities.length}</p>
                            <p className="text-xs text-gray-500">Cities / Municipalities</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200">
                    {(['provinces', 'cities'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Provinces Tab */}
                {activeTab === 'provinces' && (
                    <div className="space-y-4">
                        {/* Add Province */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-blue-500" /> Add New Province
                            </h2>
                            <form onSubmit={handleAddProvince} className="flex gap-2">
                                <input type="text" value={addProvinceForm.data.name} onChange={e => addProvinceForm.setData('name', e.target.value)}
                                    placeholder="e.g. Cebu, Batangas..." className={inputClass} />
                                <button type="submit" disabled={addProvinceForm.processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </form>
                            {addProvinceForm.errors.name && <p className="text-red-500 text-xs mt-1">{addProvinceForm.errors.name}</p>}
                        </div>

                        {/* Province List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100">
                                <p className="text-xs text-gray-500">{provinces.length} province{provinces.length !== 1 ? 's' : ''}</p>
                            </div>
                            {provinces.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">No provinces added yet</div>
                            ) : (
                                <ul className="divide-y divide-gray-50">
                                    {provinces.map(province => (
                                        <li key={province.id}>
                                            <div className="flex items-center gap-3 px-5 py-3">
                                                <button onClick={() => setExpandedProvince(expandedProvince === province.id ? null : province.id)}
                                                    className="text-gray-400 hover:text-gray-600">
                                                    {expandedProvince === province.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                </button>
                                                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                                                {editingProvinceId === province.id ? (
                                                    <>
                                                        <input value={editProvinceName} onChange={e => setEditProvinceName(e.target.value)}
                                                            className={inputClass} autoFocus />
                                                        <button onClick={() => saveProvince(province.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
                                                        <button onClick={() => setEditingProvinceId(null)} className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg"><X className="w-4 h-4" /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="flex-1 text-sm font-medium text-gray-800">{province.name}</span>
                                                        <span className="text-xs text-gray-400 mr-2">{province.cities_count} cities</span>
                                                        <button onClick={() => { setEditingProvinceId(province.id); setEditProvinceName(province.name); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                                                        <button onClick={() => deleteProvince(province.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                    </>
                                                )}
                                            </div>
                                            {expandedProvince === province.id && (
                                                <div className="ml-12 pb-2 pr-4 space-y-1">
                                                    {citiesForProvince(province.id).length === 0 ? (
                                                        <p className="text-xs text-gray-400 py-1">No cities yet</p>
                                                    ) : citiesForProvince(province.id).map(city => (
                                                        <div key={city.id} className="flex items-center gap-2 py-1 text-xs text-gray-600">
                                                            <Building2 className="w-3 h-3 text-purple-400 shrink-0" />
                                                            <span>{city.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* Cities Tab */}
                {activeTab === 'cities' && (
                    <div className="space-y-4">
                        {/* Add City */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-purple-500" /> Add New City / Municipality
                            </h2>
                            <form onSubmit={handleAddCity} className="flex flex-col sm:flex-row gap-2">
                                <input type="text" value={addCityForm.data.name} onChange={e => addCityForm.setData('name', e.target.value)}
                                    placeholder="City/Municipality name..." className={inputClass} />
                                <select value={addCityForm.data.province_id} onChange={e => addCityForm.setData('province_id', e.target.value)}
                                    className={selectClass} required>
                                    <option value="">Select Province...</option>
                                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <button type="submit" disabled={addCityForm.processing}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1 shrink-0">
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </form>
                        </div>

                        {/* City List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100">
                                <p className="text-xs text-gray-500">{cities.length} cities/municipalities</p>
                            </div>
                            {cities.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">No cities added yet</div>
                            ) : (
                                <ul className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                                    {cities.map(city => (
                                        <li key={city.id} className="flex items-center gap-3 px-5 py-3">
                                            <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                                            {editingCityId === city.id ? (
                                                <>
                                                    <input value={editCityName} onChange={e => setEditCityName(e.target.value)} className={inputClass} autoFocus />
                                                    <select value={editCityProvinceId} onChange={e => setEditCityProvinceId(e.target.value)} className={selectClass}>
                                                        {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                    </select>
                                                    <button onClick={() => saveCity(city.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
                                                    <button onClick={() => setEditingCityId(null)} className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg"><X className="w-4 h-4" /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-800">{city.name}</p>
                                                        <p className="text-xs text-gray-400">{city.province?.name}</p>
                                                    </div>
                                                    <button onClick={() => { setEditingCityId(city.id); setEditCityName(city.name); setEditCityProvinceId(String(city.province_id)); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => deleteCity(city.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
