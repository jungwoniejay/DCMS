import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save, Utensils, Moon, Droplets, Toilet } from 'lucide-react';

const foodOptions = [
    'Rice', 'Bread', 'Eggs', 'Fruit', 'Vegetables', 'Meat', 'Fish',
    'Milk', 'Cheese', 'Yogurt', 'Cereal', 'Pasta', 'Soup', 'Other',
];

const ic = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all';
const lc = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5';

export default function ChildCareEdit({ child, careInfo }: any) {
    const { data, setData, post, put, processing, errors } = useForm({
        child_id: child.id,
        feeding_food_selection: careInfo?.feeding_food_selection || [],
        feeding_appetite: careInfo?.feeding_appetite || '',
        feeding_custom: careInfo?.feeding_custom || '',
        sleeping_duration: careInfo?.sleeping_duration || '',
        sleeping_quality: careInfo?.sleeping_quality || '',
        sleeping_custom: careInfo?.sleeping_custom || '',
        bathing_frequency: careInfo?.bathing_frequency || '',
        bathing_assistance: careInfo?.bathing_assistance || '',
        bathing_custom: careInfo?.bathing_custom || '',
        toileting_frequency: careInfo?.toileting_frequency || '',
        toileting_assistance: careInfo?.toileting_assistance || '',
        toileting_custom: careInfo?.toileting_custom || '',
    });

    const isEditing = careInfo !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.children.care.update', child.id));
        } else {
            post(route('admin.children.care.store', child.id));
        }
    };

    const handleFoodToggle = (food: string) => {
        const current = data.feeding_food_selection || [];
        setData('feeding_food_selection', current.includes(food)
            ? current.filter((f: string) => f !== food)
            : [...current, food]
        );
    };

    return (
        <AdminLayout>
            <Head title={`${isEditing ? 'Edit' : 'Add'} Care Information — ${child.first_name} ${child.last_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('admin.children.care.show', child.id)}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isEditing ? 'Edit' : 'Add'} Care Information
                        </h1>
                        <p className="text-slate-500 text-sm mt-0.5">{child.first_name} {child.last_name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {/* Feeding */}
                        <Section icon={<Utensils className="w-4 h-4" />} title="Feeding" color="emerald">
                            <div className="space-y-4">
                                <div>
                                    <label className={lc}>Food Selection</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {foodOptions.map((food) => (
                                            <label key={food} className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm ${
                                                data.feeding_food_selection?.includes(food)
                                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}>
                                                <input type="checkbox"
                                                    checked={data.feeding_food_selection?.includes(food) || false}
                                                    onChange={() => handleFoodToggle(food)}
                                                    className="accent-emerald-500 shrink-0"
                                                />
                                                {food}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.feeding_food_selection && <p className="text-xs text-red-500 mt-1">{errors.feeding_food_selection}</p>}
                                </div>

                                <div>
                                    <label className={lc}>Appetite</label>
                                    <div className="flex gap-3">
                                        {['Good', 'Fair', 'Poor'].map((opt) => (
                                            <label key={opt} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm ${
                                                data.feeding_appetite === opt
                                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}>
                                                <input type="radio" name="feeding_appetite" value={opt}
                                                    checked={data.feeding_appetite === opt}
                                                    onChange={(e) => setData('feeding_appetite', e.target.value)}
                                                    className="accent-emerald-500"
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.feeding_appetite && <p className="text-xs text-red-500 mt-1">{errors.feeding_appetite}</p>}
                                </div>

                                <div>
                                    <label className={lc}>Additional Notes</label>
                                    <textarea value={data.feeding_custom}
                                        onChange={(e) => setData('feeding_custom', e.target.value)}
                                        className={ic} rows={2}
                                        placeholder="Enter any additional feeding notes..."
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Sleeping */}
                        <Section icon={<Moon className="w-4 h-4" />} title="Sleeping" color="indigo">
                            <div className="space-y-4">
                                <div>
                                    <label className={lc}>Sleep Duration (hours)</label>
                                    <input type="text" value={data.sleeping_duration}
                                        onChange={(e) => setData('sleeping_duration', e.target.value)}
                                        className={ic} placeholder="e.g., 8-10"
                                    />
                                    {errors.sleeping_duration && <p className="text-xs text-red-500 mt-1">{errors.sleeping_duration}</p>}
                                </div>

                                <div>
                                    <label className={lc}>Sleep Quality</label>
                                    <div className="flex gap-3">
                                        {['Good', 'Fair', 'Poor'].map((opt) => (
                                            <label key={opt} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm ${
                                                data.sleeping_quality === opt
                                                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}>
                                                <input type="radio" name="sleeping_quality" value={opt}
                                                    checked={data.sleeping_quality === opt}
                                                    onChange={(e) => setData('sleeping_quality', e.target.value)}
                                                    className="accent-indigo-500"
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.sleeping_quality && <p className="text-xs text-red-500 mt-1">{errors.sleeping_quality}</p>}
                                </div>

                                <div>
                                    <label className={lc}>Additional Notes</label>
                                    <textarea value={data.sleeping_custom}
                                        onChange={(e) => setData('sleeping_custom', e.target.value)}
                                        className={ic} rows={2}
                                        placeholder="Enter any additional sleeping notes..."
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Bathing */}
                        <Section icon={<Droplets className="w-4 h-4" />} title="Bathing" color="sky">
                            <div className="space-y-4">
                                <div>
                                    <label className={lc}>Bathing Frequency</label>
                                    <select value={data.bathing_frequency}
                                        onChange={(e) => setData('bathing_frequency', e.target.value)}
                                        className={ic}>
                                        <option value="">Select frequency</option>
                                        {['Daily', 'Every other day', 'Weekly', 'As needed'].map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.bathing_frequency && <p className="text-xs text-red-500 mt-1">{errors.bathing_frequency}</p>}
                                </div>

                                <div>
                                    <label className={lc}>Assistance Level</label>
                                    <div className="flex gap-3">
                                        {['Independent', 'Assisted'].map((opt) => (
                                            <label key={opt} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm ${
                                                data.bathing_assistance === opt
                                                    ? 'bg-sky-50 border-sky-300 text-sky-700 font-semibold'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}>
                                                <input type="radio" name="bathing_assistance" value={opt}
                                                    checked={data.bathing_assistance === opt}
                                                    onChange={(e) => setData('bathing_assistance', e.target.value)}
                                                    className="accent-sky-500"
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.bathing_assistance && <p className="text-xs text-red-500 mt-1">{errors.bathing_assistance}</p>}
                                </div>

                                <div>
                                    <label className={lc}>Additional Notes</label>
                                    <textarea value={data.bathing_custom}
                                        onChange={(e) => setData('bathing_custom', e.target.value)}
                                        className={ic} rows={2}
                                        placeholder="Enter any additional bathing notes..."
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Toileting */}
                        <Section icon={<Toilet className="w-4 h-4" />} title="Toileting" color="amber">
                            <div className="space-y-4">
                                <div>
                                    <label className={lc}>Toileting Frequency</label>
                                    <select value={data.toileting_frequency}
                                        onChange={(e) => setData('toileting_frequency', e.target.value)}
                                        className={ic}>
                                        <option value="">Select frequency</option>
                                        {['Regular', 'Irregular', 'As needed'].map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.toileting_frequency && <p className="text-xs text-red-500 mt-1">{errors.toileting_frequency}</p>}
                                </div>

                                <div>
                                    <label className={lc}>Assistance Level</label>
                                    <div className="flex gap-3">
                                        {['Independent', 'Assisted'].map((opt) => (
                                            <label key={opt} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm ${
                                                data.toileting_assistance === opt
                                                    ? 'bg-amber-50 border-amber-300 text-amber-700 font-semibold'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}>
                                                <input type="radio" name="toileting_assistance" value={opt}
                                                    checked={data.toileting_assistance === opt}
                                                    onChange={(e) => setData('toileting_assistance', e.target.value)}
                                                    className="accent-amber-500"
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.toileting_assistance && <p className="text-xs text-red-500 mt-1">{errors.toileting_assistance}</p>}
                                </div>

                                <div>
                                    <label className={lc}>Additional Notes</label>
                                    <textarea value={data.toileting_custom}
                                        onChange={(e) => setData('toileting_custom', e.target.value)}
                                        className={ic} rows={2}
                                        placeholder="Enter any additional toileting notes..."
                                    />
                                </div>
                            </div>
                        </Section>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {processing ? 'Saving...' : `${isEditing ? 'Update' : 'Save'} Care Information`}
                        </button>
                        <Link href={route('admin.children.care.show', child.id)}
                            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

const colorMap: Record<string, { header: string; icon: string }> = {
    emerald: { header: 'text-emerald-600', icon: 'bg-emerald-100 text-emerald-600' },
    indigo:  { header: 'text-indigo-600',  icon: 'bg-indigo-100 text-indigo-600'  },
    sky:     { header: 'text-sky-600',     icon: 'bg-sky-100 text-sky-600'        },
    amber:   { header: 'text-amber-600',   icon: 'bg-amber-100 text-amber-600'    },
};

function Section({ icon, title, color = 'emerald', children }: any) {
    const c = colorMap[color] ?? colorMap.emerald;
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.icon}`}>{icon}</div>
                <h2 className={`text-sm font-bold ${c.header}`}>{title}</h2>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}
