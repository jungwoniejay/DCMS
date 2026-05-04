import ParentLayout from '@/layouts/parent-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

const ic = 'w-full px-3 py-2 border border-purple-100 rounded-xl bg-white/80 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all';
const lc = 'block text-sm font-medium text-slate-600 mb-1';
const card = 'bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-5 space-y-4';

function Field({ label, children, span }: { label: string; children: React.ReactNode; span?: string }) {
    return <div className={span}><label className={lc}>{label}</label>{children}</div>;
}

export default function NutritionForm({ child, record }: { child: any; record: any }) {
    const { data, setData, post, processing } = useForm<any>({
        height_1: record?.height_1 ?? '',
        height_2: record?.height_2 ?? '',
        weight_1: record?.weight_1 ?? '',
        weight_2: record?.weight_2 ?? '',
        nutritional_status_1: record?.nutritional_status_1 ?? '',
        nutritional_status_2: record?.nutritional_status_2 ?? '',
        date_1: record?.date_1 ?? '',
        date_2: record?.date_2 ?? '',
        food_allergies: record?.food_allergies ?? '',
        usual_food: record?.usual_food ?? '',
        eating_habit: record?.eating_habit ?? '',
        uses_bottle: record?.uses_bottle ?? '',
        bottle_frequency: record?.bottle_frequency ?? '',
        breakfast_time: record?.breakfast_time ?? '',
        lunch_time: record?.lunch_time ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('parent.children.nutrition.store', child.id));
    };

    return (
        <ParentLayout>
            <Head title="Form 3 — Nutrition Status" />
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route('parent.children.show', child.id)} className="text-slate-400 hover:text-purple-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Form 3 — Nutrition Status & Self Help</h1>
                        <p className="text-slate-500 text-sm mt-1">{child.child_first_name} {child.child_last_name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Measurements */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Nutrition Measurements</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-slate-600">
                                <thead>
                                    <tr className="text-xs text-slate-400 uppercase">
                                        <th className="text-left pb-2">Measurement</th>
                                        <th className="pb-2">1st Result</th>
                                        <th className="pb-2">2nd Result</th>
                                        <th className="pb-2">1st Date</th>
                                        <th className="pb-2">2nd Date</th>
                                    </tr>
                                </thead>
                                <tbody className="space-y-2">
                                    <tr>
                                        <td className="pr-4 py-1 font-medium">Height (cm)</td>
                                        <td className="px-2 py-1"><input type="number" value={data.height_1} onChange={e => setData('height_1', e.target.value)} className={ic} /></td>
                                        <td className="px-2 py-1"><input type="number" value={data.height_2} onChange={e => setData('height_2', e.target.value)} className={ic} /></td>
                                        <td className="px-2 py-1"><input type="date" value={data.date_1} onChange={e => setData('date_1', e.target.value)} className={ic} /></td>
                                        <td className="px-2 py-1"><input type="date" value={data.date_2} onChange={e => setData('date_2', e.target.value)} className={ic} /></td>
                                    </tr>
                                    <tr>
                                        <td className="pr-4 py-1 font-medium">Weight (kg)</td>
                                        <td className="px-2 py-1"><input type="number" value={data.weight_1} onChange={e => setData('weight_1', e.target.value)} className={ic} /></td>
                                        <td className="px-2 py-1"><input type="number" value={data.weight_2} onChange={e => setData('weight_2', e.target.value)} className={ic} /></td>
                                        <td></td><td></td>
                                    </tr>
                                    <tr>
                                        <td className="pr-4 py-1 font-medium">Nutritional Status</td>
                                        <td className="px-2 py-1"><input type="text" value={data.nutritional_status_1} onChange={e => setData('nutritional_status_1', e.target.value)} className={ic} /></td>
                                        <td className="px-2 py-1"><input type="text" value={data.nutritional_status_2} onChange={e => setData('nutritional_status_2', e.target.value)} className={ic} /></td>
                                        <td></td><td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Feeding */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Feeding / Eating</h2>
                        <Field label="Does your child have any food allergies?">
                            <input type="text" value={data.food_allergies} onChange={e => setData('food_allergies', e.target.value)} className={ic} placeholder="Describe if any" />
                        </Field>
                        <Field label="What food do you usually give your child?">
                            <input type="text" value={data.usual_food} onChange={e => setData('usual_food', e.target.value)} className={ic} />
                        </Field>
                        <Field label="What is your child's eating habit? (bottle food, finger food, fruits, cereal, etc.)">
                            <input type="text" value={data.eating_habit} onChange={e => setData('eating_habit', e.target.value)} className={ic} />
                        </Field>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Is your child using a bottle?">
                                <select value={data.uses_bottle} onChange={e => setData('uses_bottle', e.target.value)} className={ic}>
                                    <option value="">—</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </Field>
                            {data.uses_bottle === 'Yes' && (
                                <Field label="How often?">
                                    <input type="text" value={data.bottle_frequency} onChange={e => setData('bottle_frequency', e.target.value)} className={ic} />
                                </Field>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Usual Breakfast Time">
                                <input type="time" value={data.breakfast_time} onChange={e => setData('breakfast_time', e.target.value)} className={ic} />
                            </Field>
                            <Field label="Usual Lunch Time">
                                <input type="time" value={data.lunch_time} onChange={e => setData('lunch_time', e.target.value)} className={ic} />
                            </Field>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" /> {processing ? 'Saving...' : 'Save Nutrition Record'}
                        </button>
                        <Link href={route('parent.children.show', child.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 border border-purple-100 text-slate-600 text-sm font-semibold hover:bg-white transition-all">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </ParentLayout>
    );
}
