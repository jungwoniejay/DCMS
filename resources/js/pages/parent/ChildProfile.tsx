import ParentLayout from '@/layouts/parent-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

const ic = 'w-full px-3 py-2 border border-purple-100 rounded-xl bg-white/80 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all';
const lc = 'block text-sm font-medium text-slate-600 mb-1';
const card = 'bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-5 space-y-4';
const sec = 'text-xs font-bold text-slate-500 uppercase tracking-wide pt-2';

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

function MultiCheck({ label, options, value, onChange, cols = 3 }: { label: string; options: string[]; value: string[]; onChange: (v: string[]) => void; cols?: number }) {
    const toggle = (o: string) => onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
    return (
        <div>
            <label className={lc}>{label}</label>
            <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-x-4 gap-y-1 mt-1`}>
                {options.map(o => (
                    <label key={o} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                        <input type="checkbox" checked={value.includes(o)} onChange={() => toggle(o)} className="accent-purple-500" />
                        {o}
                    </label>
                ))}
            </div>
        </div>
    );
}

const VACCINES = ['ECG', 'DPT', 'Oral Polio', 'Hepa B', 'Measles', 'Others'];
const DEFORMITIES = ['Hare Lip', 'Cross-Eyed', 'Deaf', 'Blind', 'Disabled Leg', 'Disabled Arm/Hand', 'Deformity in Fingers/Toes'];
const PROBLEMS = ['Behavior', 'Speaking', 'Hearing', 'Vision'];
const PRIOR_TYPES = ['Nursery', 'Kindergarten', 'Preparatory'];
const PRIOR_OPTIONS = ['Private Pre-School', 'Public Pre-School', 'Private Day Care', 'Public Day Care', 'Church Based', 'Home Based', 'Others'];
const LEARNS_WITH = ['Nobody', 'Mother/Father/Both', 'Siblings', 'Relatives', 'Househelp/Maid', 'Tutor', 'Others'];
const FREQ = ['Always', 'Sometimes', 'Rarely', 'Never'];
const FOODS = ['Vegetable', 'Pork', 'Chicken', 'Beef', 'Fish', 'Rice', 'Noodle', 'Soup', 'Bread', 'Fruits', 'Cereals', 'Fruit Juice', 'Milk'];
const BAON = ['Money', 'Food', 'Both', 'None', "Don't Know"];
const TRANSPORT = ['School Bus', 'Tricycle', 'Father', 'Relatives', 'Bus', 'Habal-Habal', 'Banca', 'Calesa', 'Others'];
const GOES_WITH = ['Mother', 'Father', 'Both Parents', 'Grandparents', 'Relatives', 'Maid', 'None'];

export default function ChildProfile({ child, detail }: { child: any; detail: any }) {
    const { data, setData, post, processing } = useForm<any>({
        birth_order: detail?.birth_order ?? '',
        registered: detail?.registered ?? '',
        born_at: detail?.born_at ?? '',
        mother_tongue: detail?.mother_tongue ?? '',
        other_dialects: detail?.other_dialects ?? '',
        height_cm: detail?.height_cm ?? '',
        weight_kg: detail?.weight_kg ?? '',
        eccd_card: detail?.eccd_card ?? false,
        mother_child_book: detail?.mother_child_book ?? false,
        vaccinations: detail?.vaccinations ?? {},
        physical_deformity: detail?.physical_deformity ?? [],
        problems_with: detail?.problems_with ?? [],
        left_handed: detail?.left_handed ?? '',
        siblings: detail?.siblings ?? [{ age: '', sex: '', in_school: '' }],
        prior_experiences: detail?.prior_experiences ?? {},
        learns_at_home_with: detail?.learns_at_home_with ?? [],
        plays_older_siblings: detail?.plays_older_siblings ?? '',
        plays_younger_siblings: detail?.plays_younger_siblings ?? '',
        plays_neighbors: detail?.plays_neighbors ?? '',
        meal_before_school: detail?.meal_before_school ?? '',
        food_normally_eaten: detail?.food_normally_eaten ?? [],
        has_baon: detail?.has_baon ?? '',
        travel_time_dcc: detail?.travel_time_dcc ?? '',
        travel_mode_dcc: detail?.travel_mode_dcc ?? '',
        travel_time_ncdc: detail?.travel_time_ncdc ?? '',
        travel_mode_ncdc: detail?.travel_mode_ncdc ?? '',
        transport_type: detail?.transport_type ?? [],
        goes_to_school_with: detail?.goes_to_school_with ?? [],
    });

    const addSibling = () => setData('siblings', [...data.siblings, { age: '', sex: '', in_school: '' }]);
    const updateSibling = (i: number, key: string, val: string) => {
        const updated = [...data.siblings];
        updated[i] = { ...updated[i], [key]: val };
        setData('siblings', updated);
    };

    const setVaccine = (v: string, val: string) => setData('vaccinations', { ...data.vaccinations, [v]: val });
    const setPrior = (type: string, val: string) => setData('prior_experiences', { ...data.prior_experiences, [type]: val });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('parent.children.profile.store', child.id));
    };

    return (
        <ParentLayout>
            <Head title="Form 2 — Children's Profile" />
            <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-4">
                    <Link href={route('parent.children.show', child.id)} className="text-slate-400 hover:text-purple-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Form 2 — Children's Profile</h1>
                        <p className="text-slate-500 text-sm mt-1">{child.child_first_name} {child.child_last_name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Personal Info */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">1. Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Birth Order"><input type="number" value={data.birth_order} onChange={e => setData('birth_order', e.target.value)} className={ic} /></Field>
                            <Field label="Height (cm)"><input type="number" value={data.height_cm} onChange={e => setData('height_cm', e.target.value)} className={ic} /></Field>
                            <Field label="Weight (kg)"><input type="number" value={data.weight_kg} onChange={e => setData('weight_kg', e.target.value)} className={ic} /></Field>
                        </div>
                        <RadioGroup label="Registered" options={['Yes', 'No']} value={data.registered} onChange={v => setData('registered', v)} />
                        <RadioGroup label="Born At" options={['Hospital', 'Health Center', 'Home']} value={data.born_at} onChange={v => setData('born_at', v)} />
                        <RadioGroup label="Mother Tongue" options={['Tagalog', 'Visayan', 'Ilocano', 'Bicolnon', 'Others']} value={data.mother_tongue} onChange={v => setData('mother_tongue', v)} />
                        <Field label="Other Dialects Spoken at Home"><input type="text" value={data.other_dialects} onChange={e => setData('other_dialects', e.target.value)} className={ic} /></Field>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input type="checkbox" checked={data.eccd_card} onChange={e => setData('eccd_card', e.target.checked)} className="accent-purple-500" /> ECCD Card
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input type="checkbox" checked={data.mother_child_book} onChange={e => setData('mother_child_book', e.target.checked)} className="accent-purple-500" /> Mother & Child Book
                            </label>
                        </div>
                        <RadioGroup label="Left Handed" options={['Yes', 'No']} value={data.left_handed} onChange={v => setData('left_handed', v)} />
                    </div>

                    {/* Vaccinations */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Vaccination & Health Data</h2>
                        <div className="space-y-2">
                            {VACCINES.map(v => (
                                <div key={v} className="flex items-center gap-4">
                                    <span className="text-sm text-slate-600 w-24">{v}</span>
                                    {['Yes', 'No', "Don't Know"].map(opt => (
                                        <label key={opt} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                                            <input type="radio" checked={data.vaccinations[v] === opt} onChange={() => setVaccine(v, opt)} className="accent-purple-500" /> {opt}
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Physical Attributes */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Physical Attributes</h2>
                        <MultiCheck label="Physical Deformity" options={DEFORMITIES} value={data.physical_deformity} onChange={v => setData('physical_deformity', v)} />
                        <MultiCheck label="Problems With" options={PROBLEMS} value={data.problems_with} onChange={v => setData('problems_with', v)} cols={4} />
                    </div>

                    {/* Siblings */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Siblings</h2>
                        {data.siblings.map((s: any, i: number) => (
                            <div key={i} className="grid grid-cols-3 gap-3">
                                <Field label="Age"><input type="number" value={s.age} onChange={e => updateSibling(i, 'age', e.target.value)} className={ic} /></Field>
                                <Field label="Sex">
                                    <select value={s.sex} onChange={e => updateSibling(i, 'sex', e.target.value)} className={ic}>
                                        <option value="">—</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </Field>
                                <Field label="In School">
                                    <select value={s.in_school} onChange={e => updateSibling(i, 'in_school', e.target.value)} className={ic}>
                                        <option value="">—</option>
                                        <option>In School</option>
                                        <option>Out of School</option>
                                    </select>
                                </Field>
                            </div>
                        ))}
                        <button type="button" onClick={addSibling} className="text-sm text-purple-600 hover:underline">+ Add sibling</button>
                    </div>

                    {/* Prior Experiences */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Prior Early Childhood Experiences</h2>
                        {PRIOR_TYPES.map(type => (
                            <div key={type}>
                                <p className={sec}>{type}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                    {PRIOR_OPTIONS.map(o => (
                                        <label key={o} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                                            <input type="radio" checked={data.prior_experiences[type] === o} onChange={() => setPrior(type, o)} className="accent-purple-500" /> {o}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Performance */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Performance Related Inputs</h2>
                        <MultiCheck label="Learns at Home With" options={LEARNS_WITH} value={data.learns_at_home_with} onChange={v => setData('learns_at_home_with', v)} />
                        <RadioGroup label="Plays/Interacts with Older Siblings" options={FREQ} value={data.plays_older_siblings} onChange={v => setData('plays_older_siblings', v)} />
                        <RadioGroup label="Plays/Interacts with Younger Siblings" options={FREQ} value={data.plays_younger_siblings} onChange={v => setData('plays_younger_siblings', v)} />
                        <RadioGroup label="Plays/Interacts with Neighbors of Same Age" options={FREQ} value={data.plays_neighbors} onChange={v => setData('plays_neighbors', v)} />
                    </div>

                    {/* Logistics */}
                    <div className={card}>
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Logistics</h2>
                        <RadioGroup label="Has Meal Before Going to School" options={FREQ} value={data.meal_before_school} onChange={v => setData('meal_before_school', v)} />
                        <MultiCheck label="Food Normally Eaten" options={FOODS} value={data.food_normally_eaten} onChange={v => setData('food_normally_eaten', v)} />
                        <RadioGroup label="Has Baon" options={BAON} value={data.has_baon} onChange={v => setData('has_baon', v)} />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Field label="Travel Time to DCC (mins)"><input type="text" value={data.travel_time_dcc} onChange={e => setData('travel_time_dcc', e.target.value)} className={ic} /></Field>
                            <Field label="Mode to DCC">
                                <select value={data.travel_mode_dcc} onChange={e => setData('travel_mode_dcc', e.target.value)} className={ic}>
                                    <option value="">—</option>
                                    <option>Walking</option><option>Private Vehicle</option><option>Public Transportation</option>
                                </select>
                            </Field>
                            <Field label="Travel Time to NCDC (mins)"><input type="text" value={data.travel_time_ncdc} onChange={e => setData('travel_time_ncdc', e.target.value)} className={ic} /></Field>
                            <Field label="Mode to NCDC">
                                <select value={data.travel_mode_ncdc} onChange={e => setData('travel_mode_ncdc', e.target.value)} className={ic}>
                                    <option value="">—</option>
                                    <option>Walking</option><option>Private Vehicle</option><option>Public Transportation</option>
                                </select>
                            </Field>
                        </div>
                        <MultiCheck label="Public Transportation Type" options={TRANSPORT} value={data.transport_type} onChange={v => setData('transport_type', v)} />
                        <MultiCheck label="Goes to School With" options={GOES_WITH} value={data.goes_to_school_with} onChange={v => setData('goes_to_school_with', v)} />
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" /> {processing ? 'Saving...' : 'Save Profile'}
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
