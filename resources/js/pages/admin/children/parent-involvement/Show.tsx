import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Edit, Trash2, Users, Phone, Mail, Heart, Plus } from 'lucide-react';

export default function ParentInvolvementShow({ child, parentInvolvement }: any) {
    const handleDelete = () => {
        if (confirm('Delete this parent involvement record?')) {
            router.delete(route('admin.children.parent-involvement.destroy', child.id));
        }
    };

    const hasData = parentInvolvement !== null;

    return (
        <AdminLayout>
            <Head title={`Parent Involvement — ${child.first_name} ${child.last_name}`} />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.children.show', child.id)}
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Parent Involvement</h1>
                            <p className="text-slate-500 text-sm mt-0.5">{child.first_name} {child.last_name} · Family support and involvement records</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasData ? (
                            <>
                                <Link href={route('admin.children.parent-involvement.edit', child.id)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm">
                                    <Edit className="w-3.5 h-3.5" /> Edit
                                </Link>
                                <button onClick={handleDelete}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-all shadow-sm">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </>
                        ) : (
                            <Link href={route('admin.children.parent-involvement.edit', child.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all">
                                <Plus className="w-3.5 h-3.5" /> Add Parent Involvement
                            </Link>
                        )}
                    </div>
                </div>

                {hasData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Parent Info */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                                    <Users className="w-4 h-4" />
                                </div>
                                <h2 className="text-sm font-bold text-teal-600">Parent / Guardian Information</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label="Name" value={parentInvolvement.parent_name} />
                                    <InfoItem label="Relationship" value={parentInvolvement.parent_relationship} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoItem label={<span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />Contact</span>} value={parentInvolvement.parent_contact} />
                                    <InfoItem label={<span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />Email</span>} value={parentInvolvement.parent_email} />
                                </div>
                            </div>
                        </div>

                        {/* Support Roles */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Heart className="w-4 h-4" />
                                </div>
                                <h2 className="text-sm font-bold text-emerald-600">Support Roles</h2>
                            </div>
                            <div className="p-5">
                                {parentInvolvement.support_roles?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {parentInvolvement.support_roles.map((role: string, i: number) => (
                                            <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No support roles selected</p>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        {parentInvolvement.additional_notes && (
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-50">
                                    <h2 className="text-sm font-bold text-slate-500">Additional Notes</h2>
                                </div>
                                <div className="p-5">
                                    <p className="text-sm text-slate-600 leading-relaxed">{parentInvolvement.additional_notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-1">No Parent Involvement Data</h3>
                        <p className="text-slate-400 text-sm mb-6">No parent involvement information has been recorded yet.</p>
                        <Link href={route('admin.children.parent-involvement.edit', child.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                            <Plus className="w-4 h-4" /> Add Parent Involvement
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function InfoItem({ label, value }: { label: any; value?: string | null }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-700">{value || <span className="text-slate-300 italic font-normal">N/A</span>}</p>
        </div>
    );
}
