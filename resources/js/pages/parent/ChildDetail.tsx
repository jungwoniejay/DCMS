import ParentLayout from '@/layouts/parent-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { User, Heart, Activity, Users, Home, AlertTriangle, ArrowLeft, Pencil, X, Save, CheckCircle, Clock } from 'lucide-react';

const ic = 'w-full px-3 py-2 border border-sky-100 rounded-xl bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all';
const lc = 'block text-xs font-medium text-slate-500 mb-1';

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">{value || <span className="text-slate-300 italic">Not provided</span>}</p>
        </div>
    );
}

function SectionCard({ title, icon, children, onEdit }: { title: string; icon: React.ReactNode; children: React.ReactNode; onEdit?: () => void }) {
    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                    {icon} {title}
                </h2>
                {onEdit && (
                    <button onClick={onEdit} className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 font-semibold px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 transition-all">
                        <Pencil className="w-3 h-3" /> Edit
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}

function Modal({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
                    <h3 className="font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-5 space-y-4">{children}</div>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <div><label className={lc}>{label}</label>{children}</div>;
}

export default function ChildDetail({ child, nutritionHistory, medicalAssessment, healthProblems, medications, childDetail, healthAssessment, nutritionRecord }: {
    child: any; nutritionHistory: any[]; medicalAssessment: any;
    healthProblems: any[]; medications: any[];
    childDetail?: any; healthAssessment?: any; nutritionRecord?: any;
}) {
    const [modal, setModal] = useState<'profile' | 'health' | 'nutrition' | null>(null);

    // Form 2 — Child Profile
    const profileForm = useForm<any>({
        birth_order: childDetail?.birth_order ?? '',
        registered: childDetail?.registered ?? '',
        born_at: childDetail?.born_at ?? '',
        height_cm: childDetail?.height_cm ?? '',
        weight_kg: childDetail?.weight_kg ?? '',
        left_handed: childDetail?.left_handed ?? '',
        mother_tongue: childDetail?.mother_tongue ?? '',
        other_dialects: childDetail?.other_dialects ?? '',
    });

    // Form 2 Health
    const healthForm = useForm<any>({
        routine_hospital: healthAssessment?.routine_hospital ?? '',
        routine_phone: healthAssessment?.routine_phone ?? '',
        last_checkup_date: healthAssessment?.last_checkup_date ?? '',
        last_checkup_hospital: healthAssessment?.last_checkup_hospital ?? '',
        takes_medication: healthAssessment?.takes_medication ?? '',
        medication_description: healthAssessment?.medication_description ?? '',
        serious_accident: healthAssessment?.serious_accident ?? '',
        accident_description: healthAssessment?.accident_description ?? '',
    });

    // Form 3 Nutrition
    const nutritionForm = useForm<any>({
        height_1: nutritionRecord?.height_1 ?? '',
        weight_1: nutritionRecord?.weight_1 ?? '',
        nutritional_status_1: nutritionRecord?.nutritional_status_1 ?? '',
        date_1: nutritionRecord?.date_1 ?? '',
        food_allergies: nutritionRecord?.food_allergies ?? '',
        usual_food: nutritionRecord?.usual_food ?? '',
        eating_habit: nutritionRecord?.eating_habit ?? '',
        breakfast_time: nutritionRecord?.breakfast_time ?? '',
        lunch_time: nutritionRecord?.lunch_time ?? '',
    });

    const statusColor = child.registration_status?.toLowerCase() === 'approved'
        ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700';

    const statusIcon = child.registration_status?.toLowerCase() === 'approved'
        ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />;

    return (
        <ParentLayout>
            <Head title={`${child.first_name} ${child.last_name}`} />
            <div className="space-y-5 max-w-4xl">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/parent/my-children" className="text-slate-400 hover:text-teal-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">Child Profile</h1>
                </div>

                {/* Profile Banner */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-5">
                    <div className="flex items-center gap-5">
                        {child.profile_picture
                            ? <img src={`/storage/${child.profile_picture}`} alt={child.first_name} className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-100 shadow-md" />
                            : <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center shadow-md shrink-0"><User className="w-10 h-10 text-white" /></div>
                        }
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-slate-800">{child.first_name} {child.middle_name} {child.last_name}</h2>
                            <p className="text-slate-500 text-sm mt-0.5">{child.age} years old • {child.sex} • Born {child.birthdate}</p>
                            <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                                {statusIcon} {child.registration_status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Left — main info */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Basic Info */}
                        <SectionCard title="Basic Information" icon={<User className="w-4 h-4 text-sky-500" />}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <InfoRow label="First Name" value={child.first_name} />
                                <InfoRow label="Middle Name" value={child.middle_name} />
                                <InfoRow label="Last Name" value={child.last_name} />
                                <InfoRow label="Sex" value={child.sex} />
                                <InfoRow label="Birthdate" value={child.birthdate} />
                                <InfoRow label="Age" value={`${child.age} years old`} />
                                <div className="col-span-2 md:col-span-3"><InfoRow label="Address" value={child.address} /></div>
                                <InfoRow label="First Language" value={child.first_language} />
                                <InfoRow label="Second Language" value={child.second_language || 'None'} />
                            </div>
                        </SectionCard>

                        {/* Form 2 — Child Profile */}
                        <SectionCard title="Form 2 — Children's Profile" icon={<Users className="w-4 h-4 text-teal-500" />} onEdit={() => setModal('profile')}>
                            {childDetail ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <InfoRow label="Birth Order" value={childDetail.birth_order} />
                                    <InfoRow label="Registered" value={childDetail.registered} />
                                    <InfoRow label="Born At" value={childDetail.born_at} />
                                    <InfoRow label="Height (cm)" value={childDetail.height_cm} />
                                    <InfoRow label="Weight (kg)" value={childDetail.weight_kg} />
                                    <InfoRow label="Left Handed" value={childDetail.left_handed} />
                                    <InfoRow label="Mother Tongue" value={childDetail.mother_tongue} />
                                    <InfoRow label="Other Dialects" value={childDetail.other_dialects} />
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-slate-400 text-sm">Not yet filled out.</p>
                                    <button onClick={() => setModal('profile')} className="mt-2 text-sm text-sky-600 font-semibold hover:underline">Fill out now →</button>
                                </div>
                            )}
                        </SectionCard>

                        {/* Form 2 — Health */}
                        <SectionCard title="Form 2 — Health Assessment" icon={<Heart className="w-4 h-4 text-red-400" />} onEdit={() => setModal('health')}>
                            {healthAssessment ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <InfoRow label="Routine Hospital" value={healthAssessment.routine_hospital} />
                                    <InfoRow label="Phone" value={healthAssessment.routine_phone} />
                                    <InfoRow label="Last Check-up" value={healthAssessment.last_checkup_date} />
                                    <InfoRow label="Last Hospital" value={healthAssessment.last_checkup_hospital} />
                                    <InfoRow label="Takes Medication" value={healthAssessment.takes_medication} />
                                    <InfoRow label="Serious Accident" value={healthAssessment.serious_accident} />
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-slate-400 text-sm">Not yet filled out.</p>
                                    <button onClick={() => setModal('health')} className="mt-2 text-sm text-sky-600 font-semibold hover:underline">Fill out now →</button>
                                </div>
                            )}
                        </SectionCard>

                        {/* Form 3 — Nutrition */}
                        <SectionCard title="Form 3 — Nutrition Status" icon={<Activity className="w-4 h-4 text-emerald-500" />} onEdit={() => setModal('nutrition')}>
                            {nutritionRecord ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <InfoRow label="Height (cm)" value={nutritionRecord.height_1} />
                                    <InfoRow label="Weight (kg)" value={nutritionRecord.weight_1} />
                                    <InfoRow label="Nutritional Status" value={nutritionRecord.nutritional_status_1} />
                                    <InfoRow label="Date Taken" value={nutritionRecord.date_1} />
                                    <InfoRow label="Food Allergies" value={nutritionRecord.food_allergies} />
                                    <InfoRow label="Usual Food" value={nutritionRecord.usual_food} />
                                    <InfoRow label="Breakfast Time" value={nutritionRecord.breakfast_time} />
                                    <InfoRow label="Lunch Time" value={nutritionRecord.lunch_time} />
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-slate-400 text-sm">Not yet filled out.</p>
                                    <button onClick={() => setModal('nutrition')} className="mt-2 text-sm text-sky-600 font-semibold hover:underline">Fill out now →</button>
                                </div>
                            )}
                        </SectionCard>
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-5">

                        {/* Family */}
                        <SectionCard title="Family" icon={<Home className="w-4 h-4 text-sky-500" />}>
                            {child.family_profile ? (
                                <div className="space-y-3">
                                    <InfoRow label="Purok / Zone" value={child.family_profile.purok_zone} />
                                    <InfoRow label="Home Ownership" value={child.family_profile.home_ownership} />
                                    <InfoRow label="Home Materials" value={child.family_profile.home_materials} />
                                </div>
                            ) : <p className="text-xs text-slate-400 italic">No family info</p>}
                            {child.father_profile && (
                                <div className="mt-3 pt-3 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Father</p>
                                    <InfoRow label="Name" value={`${child.father_profile.first_name} ${child.father_profile.last_name}`} />
                                    <InfoRow label="Occupation" value={child.father_profile.occupational_status} />
                                </div>
                            )}
                            {child.mother_profile && (
                                <div className="mt-3 pt-3 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Mother</p>
                                    <InfoRow label="Name" value={`${child.mother_profile.first_name} ${child.mother_profile.last_name}`} />
                                    <InfoRow label="Occupation" value={child.mother_profile.occupational_status} />
                                </div>
                            )}
                        </SectionCard>

                        {/* Emergency */}
                        {child.emergency_contacts?.length > 0 && (
                            <SectionCard title="Emergency Contacts" icon={<AlertTriangle className="w-4 h-4 text-orange-400" />}>
                                <div className="space-y-3">
                                    {child.emergency_contacts.map((c: any, i: number) => (
                                        <div key={i} className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                                            <p className="text-sm font-semibold text-slate-700">{c.name}</p>
                                            <p className="text-xs text-slate-500">{c.relationship}</p>
                                            <p className="text-xs text-slate-500">{c.mobile_phone}</p>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        )}

                        {/* Nutrition history */}
                        {nutritionHistory?.length > 0 && (
                            <SectionCard title="Growth History" icon={<Activity className="w-4 h-4 text-teal-500" />}>
                                <div className="space-y-2">
                                    {nutritionHistory.map((r: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-2.5 bg-teal-50 rounded-xl border border-teal-100">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-700">{r.date_taken}</p>
                                                <p className="text-xs text-slate-500">{r.height}cm / {r.weight}kg</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.nutritional_status === 'Normal' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {r.nutritional_status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal — Child Profile */}
            <Modal title="Edit Form 2 — Children's Profile" open={modal === 'profile'} onClose={() => setModal(null)}>
                <form onSubmit={e => { e.preventDefault(); profileForm.post(route('parent.children.profile.store', child.id), { onSuccess: () => setModal(null) }); }}>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Birth Order"><input type="number" value={profileForm.data.birth_order} onChange={e => profileForm.setData('birth_order', e.target.value)} className={ic} /></Field>
                        <Field label="Registered">
                            <select value={profileForm.data.registered} onChange={e => profileForm.setData('registered', e.target.value)} className={ic}>
                                <option value="">—</option><option>Yes</option><option>No</option>
                            </select>
                        </Field>
                        <Field label="Born At">
                            <select value={profileForm.data.born_at} onChange={e => profileForm.setData('born_at', e.target.value)} className={ic}>
                                <option value="">—</option><option>Hospital</option><option>Health Center</option><option>Home</option>
                            </select>
                        </Field>
                        <Field label="Left Handed">
                            <select value={profileForm.data.left_handed} onChange={e => profileForm.setData('left_handed', e.target.value)} className={ic}>
                                <option value="">—</option><option>Yes</option><option>No</option>
                            </select>
                        </Field>
                        <Field label="Height (cm)"><input type="number" value={profileForm.data.height_cm} onChange={e => profileForm.setData('height_cm', e.target.value)} className={ic} /></Field>
                        <Field label="Weight (kg)"><input type="number" value={profileForm.data.weight_kg} onChange={e => profileForm.setData('weight_kg', e.target.value)} className={ic} /></Field>
                        <Field label="Mother Tongue"><input type="text" value={profileForm.data.mother_tongue} onChange={e => profileForm.setData('mother_tongue', e.target.value)} className={ic} /></Field>
                        <Field label="Other Dialects"><input type="text" value={profileForm.data.other_dialects} onChange={e => profileForm.setData('other_dialects', e.target.value)} className={ic} /></Field>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
                        <button type="submit" disabled={profileForm.processing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-600 text-white text-sm font-semibold shadow-md disabled:opacity-50">
                            <Save className="w-4 h-4" /> {profileForm.processing ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-all">Cancel</button>
                    </div>
                </form>
            </Modal>

            {/* Modal — Health Assessment */}
            <Modal title="Edit Form 2 — Health Assessment" open={modal === 'health'} onClose={() => setModal(null)}>
                <form onSubmit={e => { e.preventDefault(); healthForm.post(route('parent.children.health.store', child.id), { onSuccess: () => setModal(null) }); }}>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Routine Hospital"><input type="text" value={healthForm.data.routine_hospital} onChange={e => healthForm.setData('routine_hospital', e.target.value)} className={ic} /></Field>
                        <Field label="Phone"><input type="text" value={healthForm.data.routine_phone} onChange={e => healthForm.setData('routine_phone', e.target.value)} className={ic} /></Field>
                        <Field label="Last Check-up Date"><input type="date" value={healthForm.data.last_checkup_date} onChange={e => healthForm.setData('last_checkup_date', e.target.value)} className={ic} /></Field>
                        <Field label="Last Check-up Hospital"><input type="text" value={healthForm.data.last_checkup_hospital} onChange={e => healthForm.setData('last_checkup_hospital', e.target.value)} className={ic} /></Field>
                        <Field label="Takes Medication">
                            <select value={healthForm.data.takes_medication} onChange={e => healthForm.setData('takes_medication', e.target.value)} className={ic}>
                                <option value="">—</option><option>Yes</option><option>No</option>
                            </select>
                        </Field>
                        <Field label="Medication Description"><input type="text" value={healthForm.data.medication_description} onChange={e => healthForm.setData('medication_description', e.target.value)} className={ic} /></Field>
                        <Field label="Serious Accident">
                            <select value={healthForm.data.serious_accident} onChange={e => healthForm.setData('serious_accident', e.target.value)} className={ic}>
                                <option value="">—</option><option>Yes</option><option>No</option>
                            </select>
                        </Field>
                        <Field label="Accident Description"><input type="text" value={healthForm.data.accident_description} onChange={e => healthForm.setData('accident_description', e.target.value)} className={ic} /></Field>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
                        <button type="submit" disabled={healthForm.processing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-600 text-white text-sm font-semibold shadow-md disabled:opacity-50">
                            <Save className="w-4 h-4" /> {healthForm.processing ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-all">Cancel</button>
                    </div>
                </form>
            </Modal>

            {/* Modal — Nutrition */}
            <Modal title="Edit Form 3 — Nutrition Status" open={modal === 'nutrition'} onClose={() => setModal(null)}>
                <form onSubmit={e => { e.preventDefault(); nutritionForm.post(route('parent.children.nutrition.store', child.id), { onSuccess: () => setModal(null) }); }}>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Height (cm)"><input type="number" value={nutritionForm.data.height_1} onChange={e => nutritionForm.setData('height_1', e.target.value)} className={ic} /></Field>
                        <Field label="Weight (kg)"><input type="number" value={nutritionForm.data.weight_1} onChange={e => nutritionForm.setData('weight_1', e.target.value)} className={ic} /></Field>
                        <Field label="Nutritional Status"><input type="text" value={nutritionForm.data.nutritional_status_1} onChange={e => nutritionForm.setData('nutritional_status_1', e.target.value)} className={ic} /></Field>
                        <Field label="Date Taken"><input type="date" value={nutritionForm.data.date_1} onChange={e => nutritionForm.setData('date_1', e.target.value)} className={ic} /></Field>
                        <Field label="Food Allergies"><input type="text" value={nutritionForm.data.food_allergies} onChange={e => nutritionForm.setData('food_allergies', e.target.value)} className={ic} /></Field>
                        <Field label="Usual Food"><input type="text" value={nutritionForm.data.usual_food} onChange={e => nutritionForm.setData('usual_food', e.target.value)} className={ic} /></Field>
                        <Field label="Eating Habit"><input type="text" value={nutritionForm.data.eating_habit} onChange={e => nutritionForm.setData('eating_habit', e.target.value)} className={ic} /></Field>
                        <Field label="Breakfast Time"><input type="time" value={nutritionForm.data.breakfast_time} onChange={e => nutritionForm.setData('breakfast_time', e.target.value)} className={ic} /></Field>
                        <Field label="Lunch Time"><input type="time" value={nutritionForm.data.lunch_time} onChange={e => nutritionForm.setData('lunch_time', e.target.value)} className={ic} /></Field>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4">
                        <button type="submit" disabled={nutritionForm.processing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-600 text-white text-sm font-semibold shadow-md disabled:opacity-50">
                            <Save className="w-4 h-4" /> {nutritionForm.processing ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-all">Cancel</button>
                    </div>
                </form>
            </Modal>

        </ParentLayout>
    );
}
