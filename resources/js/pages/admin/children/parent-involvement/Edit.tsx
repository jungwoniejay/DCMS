import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save, Users, Phone, Mail, Heart } from 'lucide-react';

const ic = 'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all';
const lc = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5';

const RELATIONSHIPS = ['Mother', 'Father', 'Guardian', 'Grandparent', 'Aunt/Uncle', 'Sibling', 'Other'];

const SUPPORT_ROLES = [
    'Volunteer in classroom',
    'Help with field trips',
    'Assist with events',
    'Share cultural traditions',
    'Read to children',
    'Help with crafts',
    'Support fundraising',
    'Attend parent meetings',
    'Provide materials/supplies',
    'Share professional expertise',
    'Help with gardening',
    'Assist with meals',
    'Other',
];

export default function ParentInvolvementEdit({ child, parentInvolvement, prefill }: any) {
    const isEditing = parentInvolvement !== null;

    const { data, setData, post, put, processing, errors } = useForm({
        child_id:            child.id,
        parent_name:         parentInvolvement?.parent_name         ?? prefill?.parent_name         ?? '',
        parent_relationship: parentInvolvement?.parent_relationship ?? prefill?.parent_relationship ?? '',
        parent_contact:      parentInvolvement?.parent_contact      ?? prefill?.parent_contact      ?? '',
        parent_email:        parentInvolvement?.parent_email        ?? prefill?.parent_email        ?? '',
        support_roles:       parentInvolvement?.support_roles       ?? [],
        additional_notes:    parentInvolvement?.additional_notes    ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.children.parent-involvement.update', child.id));
        } else {
            post(route('admin.children.parent-involvement.store', child.id));
        }
    };

    const toggleRole = (role: string) => {
        const current = data.support_roles || [];
        setData('support_roles', current.includes(role)
            ? current.filter((r: string) => r !== role)
            : [...current, role]
        );
    };

    return (
        <AdminLayout>
            <Head title={`${isEditing ? 'Edit' : 'Add'} Parent Involvement — ${child.first_name} ${child.last_name}`} />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('admin.children.parent-involvement.show', child.id)}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isEditing ? 'Edit' : 'Add'} Parent Involvement
                        </h1>
                        <p className="text-slate-500 text-sm mt-0.5">{child.first_name} {child.last_name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {/* Parent/Guardian Info */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                                    <Users className="w-4 h-4" />
                                </div>
                                <h2 className="text-sm font-bold text-teal-600">Parent / Guardian Information</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className={lc}>Full Name</label>
                                    <input type="text" value={data.parent_name}
                                        onChange={e => setData('parent_name', e.target.value)}
                                        className={ic} placeholder="e.g. Maria Santos" />
                                    {errors.parent_name && <p className="text-xs text-red-500 mt-1">{errors.parent_name}</p>}
                                </div>

                                <div>
                                    <label className={lc}>Relationship to Child</label>
                                    <div className="flex flex-wrap gap-2">
                                        {RELATIONSHIPS.map(rel => (
                                            <button key={rel} type="button"
                                                onClick={() => setData('parent_relationship', rel)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                                    data.parent_relationship === rel
                                                        ? 'bg-teal-50 border-teal-300 text-teal-700'
                                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                                }`}>
                                                {rel}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.parent_relationship && <p className="text-xs text-red-500 mt-1">{errors.parent_relationship}</p>}
                                </div>

                                <div>
                                    <label className={lc}>
                                        <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> Contact Number</span>
                                    </label>
                                    <input type="text" value={data.parent_contact}
                                        onChange={e => setData('parent_contact', e.target.value)}
                                        className={ic} placeholder="e.g. 09XX XXX XXXX" />
                                    {errors.parent_contact && <p className="text-xs text-red-500 mt-1">{errors.parent_contact}</p>}
                                </div>

                                <div>
                                    <label className={lc}>
                                        <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> Email Address</span>
                                    </label>
                                    <input type="email" value={data.parent_email}
                                        onChange={e => setData('parent_email', e.target.value)}
                                        className={ic} placeholder="e.g. parent@email.com" />
                                    {errors.parent_email && <p className="text-xs text-red-500 mt-1">{errors.parent_email}</p>}
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
                                <p className="text-xs text-slate-400 mb-3">Select all roles the parent/guardian is willing to support:</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {SUPPORT_ROLES.map(role => {
                                        const active = data.support_roles?.includes(role);
                                        return (
                                            <label key={role} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                                                active
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                    : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                                            }`}>
                                                <input type="checkbox" checked={active || false}
                                                    onChange={() => toggleRole(role)}
                                                    className="accent-emerald-500 shrink-0" />
                                                <span className="text-sm font-medium">{role}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-50">
                            <h2 className="text-sm font-bold text-slate-500">Additional Notes</h2>
                        </div>
                        <div className="p-5">
                            <textarea value={data.additional_notes}
                                onChange={e => setData('additional_notes', e.target.value)}
                                className={ic} rows={3}
                                placeholder="Enter any additional notes about parent involvement..." />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {processing ? 'Saving...' : `${isEditing ? 'Update' : 'Save'} Parent Involvement`}
                        </button>
                        <Link href={route('admin.children.parent-involvement.show', child.id)}
                            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
