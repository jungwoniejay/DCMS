import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Edit, Trash2, Utensils, Moon, Droplets, Toilet, Plus } from 'lucide-react';

export default function ChildCareShow({ child, careInfo }: any) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this care information?')) {
            router.delete(route('admin.children.care.destroy', child.id));
        }
    };

    const hasData = careInfo !== null;

    return (
        <AdminLayout>
            <Head title={`Care Information — ${child.first_name} ${child.last_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.children.show', child.id)}
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Care Information</h1>
                            <p className="text-slate-500 text-sm mt-0.5">{child.first_name} {child.last_name} · Daily care records and routines</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasData ? (
                            <>
                                <Link href={route('admin.children.care.edit', child.id)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm">
                                    <Edit className="w-3.5 h-3.5" /> Edit
                                </Link>
                                <button onClick={handleDelete}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-all shadow-sm">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </>
                        ) : (
                            <Link href={route('admin.children.care.edit', child.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all">
                                <Plus className="w-3.5 h-3.5" /> Add Care Information
                            </Link>
                        )}
                    </div>
                </div>

                {hasData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {/* Feeding */}
                        <Section icon={<Utensils className="w-4 h-4" />} title="Feeding" color="emerald">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label="Appetite" value={careInfo.feeding_appetite} />
                                    <InfoItem label="Food Selection"
                                        value={careInfo.feeding_food_selection?.length
                                            ? careInfo.feeding_food_selection.join(', ')
                                            : null}
                                    />
                                </div>
                                {careInfo.feeding_custom && <Notes text={careInfo.feeding_custom} />}
                            </div>
                        </Section>

                        {/* Sleeping */}
                        <Section icon={<Moon className="w-4 h-4" />} title="Sleeping" color="indigo">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label="Duration"
                                        value={careInfo.sleeping_duration ? `${careInfo.sleeping_duration} hrs` : null}
                                    />
                                    <InfoItem label="Quality" value={careInfo.sleeping_quality} />
                                </div>
                                {careInfo.sleeping_custom && <Notes text={careInfo.sleeping_custom} />}
                            </div>
                        </Section>

                        {/* Bathing */}
                        <Section icon={<Droplets className="w-4 h-4" />} title="Bathing" color="sky">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label="Frequency" value={careInfo.bathing_frequency} />
                                    <InfoItem label="Assistance" value={careInfo.bathing_assistance} />
                                </div>
                                {careInfo.bathing_custom && <Notes text={careInfo.bathing_custom} />}
                            </div>
                        </Section>

                        {/* Toileting */}
                        <Section icon={<Toilet className="w-4 h-4" />} title="Toileting" color="amber">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label="Frequency" value={careInfo.toileting_frequency} />
                                    <InfoItem label="Assistance" value={careInfo.toileting_assistance} />
                                </div>
                                {careInfo.toileting_custom && <Notes text={careInfo.toileting_custom} />}
                            </div>
                        </Section>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Utensils className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-1">No Care Information</h3>
                        <p className="text-slate-400 text-sm mb-6">No care records have been added for this child yet.</p>
                        <Link href={route('admin.children.care.edit', child.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                            <Plus className="w-4 h-4" /> Add Care Information
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

const colorMap: Record<string, { header: string; icon: string; badge: string }> = {
    emerald: { header: 'text-emerald-600', icon: 'bg-emerald-100 text-emerald-600', badge: 'bg-emerald-50 text-emerald-700' },
    indigo:  { header: 'text-indigo-600',  icon: 'bg-indigo-100 text-indigo-600',   badge: 'bg-indigo-50 text-indigo-700'  },
    sky:     { header: 'text-sky-600',     icon: 'bg-sky-100 text-sky-600',         badge: 'bg-sky-50 text-sky-700'        },
    amber:   { header: 'text-amber-600',   icon: 'bg-amber-100 text-amber-600',     badge: 'bg-amber-50 text-amber-700'    },
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

function InfoItem({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-700">{value || <span className="text-slate-300 italic font-normal">N/A</span>}</p>
        </div>
    );
}

function Notes({ text }: { text: string }) {
    return (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-slate-600">{text}</p>
        </div>
    );
}
