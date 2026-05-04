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

function RadioGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <label className={lc}>{label}</label>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {options.map(o => (
                    <label key={o} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                        <input type="radio" value={o} checked={value === o} onChange={() => onChange(o)} className="accent-purple-500" />
                        {o}
                    </label>
                ))}
            </div>
        </div>
    );
}

const HEALTH_PROBLEMS = [
    'Allergies (Food, Insects, Medicine)',
    'Asthma', 'Bleeding', 'Bowels', 'Coughing',
    'Diabetes', 'Ears or Deafness', 'Eyes or Vision', 'Other',
];

const IMMUNIZATIONS = ['DPT', 'BCG', 'Polio', 'MMR', 'Hepa B', 'Measles', 'Others'];

export default function HealthAssessment({ child, assessment }: { child: any; assessment: any }) {
    const { data, setData, post, processing } = useForm<any>({
        routine_hospital: assessment?.routine_hospital ?? '',
        routine_address: assessment?.routine_address ?? '',
        routine_phone: assessment?.routine_phone ?? '',
        last_checkup_date: assessment?.last_checkup_date ?? '',
        last_checkup_hospital: assessment?.last_checkup_hospital ?? '',
        health_problems: assessment?.health_problems ?? {},
        takes_medication: assessment?.takes_medication ?? '',
        medication_description: assessment?.medication_description ?? '',
        special_treatment: assessment?.special_treatment ?? '',
        treatment_type: assessment?.treatment_type ?? '',
        serious_accident: assessment?.serious_accident ?? '',
        accident_description: assessment?.accident_description ?? '',
        immunizations: assessment?.immunizations ?? {},
        on_medication: assessment?.on_medication ?? '',
        medication_nature: assessment?.medication_nature ?? '',
    });

    const setHealthProblem = (p: string, key: string, val: string) =>
        setData('health_problems', { ...data.health_problems, [p]: { ...(data.health_problems[p] ?? {}), [key]: val } });

    const setImmunization = (v: string, val: string) =>
        setData('immunizations', { ...data.immunizations, [v]: val });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('parent.children.health.store', child.id));
    };

    return (
        <ParentLayout>
            <Head title="Form 2 — Health Assessment" />
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route('parent.children.show', child.id)} className="text-slate-400 hover:text-purple-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Form 2 — Health Assessment</h1>
                        <p className="text-slate-500 text-sm mt-1">{child.child_first_name} {child.child_last_name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Routine Care */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Routine Care</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Hospital / Center Name" span="md:col-span-2">
                                <input type="text" value={data.routine_hospital} onChange={e => setData('routine_hospital', e.target.value)} className={ic} />
                            </Field>
                            <Field label="Phone">
                                <input type="text" value={data.routine_phone} onChange={e => setData('routine_phone', e.target.value)} className={ic} />
                            </Field>
                            <Field label="Address" span="md:col-span-3">
                                <input type="text" value={data.routine_address} onChange={e => setData('routine_address', e.target.value)} className={ic} />
                            </Field>
                            <Field label="Last Check-up Date">
                                <input type="date" value={data.last_checkup_date} onChange={e => setData('last_checkup_date', e.target.value)} className={ic} />
                            </Field>
                            <Field label="Last Check-up Hospital" span="md:col-span-2">
                                <input type="text" value={data.last_checkup_hospital} onChange={e => setData('last_checkup_hospital', e.target.value)} className={ic} />
                            </Field>
                        </div>
                    </div>

                    {/* Health Problems */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Assessment of Child Health</h2>
                        <p className="text-xs text-slate-400">Has your child had any problem with the following?</p>
                        <div className="space-y-2">
                            {HEALTH_PROBLEMS.map(p => (
                                <div key={p} className="grid grid-cols-3 gap-3 items-start">
                                    <span className="text-sm text-slate-600 col-span-1">{p}</span>
                                    <div className="flex gap-4">
                                        {['Yes', 'No'].map(opt => (
                                            <label key={opt} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                                                <input type="radio" checked={data.health_problems[p]?.answer === opt} onChange={() => setHealthProblem(p, 'answer', opt)} className="accent-purple-500" /> {opt}
                                            </label>
                                        ))}
                                    </div>
                                    <input type="text" placeholder="Comments" value={data.health_problems[p]?.comment ?? ''} onChange={e => setHealthProblem(p, 'comment', e.target.value)} className={ic} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Medication */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Medication & Treatment</h2>
                        <RadioGroup label="Does your child take medication?" options={['Yes', 'No']} value={data.takes_medication} onChange={v => setData('takes_medication', v)} />
                        {data.takes_medication === 'Yes' && (
                            <Field label="Describe medication">
                                <input type="text" value={data.medication_description} onChange={e => setData('medication_description', e.target.value)} className={ic} />
                            </Field>
                        )}
                        <RadioGroup label="Does your child receive special treatment? (nebulizer, etc.)" options={['Yes', 'No']} value={data.special_treatment} onChange={v => setData('special_treatment', v)} />
                        {data.special_treatment === 'Yes' && (
                            <Field label="Type of treatment">
                                <input type="text" value={data.treatment_type} onChange={e => setData('treatment_type', e.target.value)} className={ic} />
                            </Field>
                        )}
                        <RadioGroup label="Has your child ever had a serious accident?" options={['Yes', 'No']} value={data.serious_accident} onChange={v => setData('serious_accident', v)} />
                        {data.serious_accident === 'Yes' && (
                            <Field label="Describe accident">
                                <input type="text" value={data.accident_description} onChange={e => setData('accident_description', e.target.value)} className={ic} />
                            </Field>
                        )}
                    </div>

                    {/* Immunizations */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Records of Immunizations</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {IMMUNIZATIONS.map(v => (
                                <Field key={v} label={v}>
                                    <input type="text" placeholder="Date" value={data.immunizations[v] ?? ''} onChange={e => setImmunization(v, e.target.value)} className={ic} />
                                </Field>
                            ))}
                        </div>
                        <RadioGroup label="Is the child on medication?" options={['Yes', 'No']} value={data.on_medication} onChange={v => setData('on_medication', v)} />
                        {data.on_medication === 'Yes' && (
                            <Field label="Nature and duration">
                                <input type="text" value={data.medication_nature} onChange={e => setData('medication_nature', e.target.value)} className={ic} />
                            </Field>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" /> {processing ? 'Saving...' : 'Save Health Assessment'}
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
