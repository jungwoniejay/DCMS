import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useState, useRef, useEffect } from 'react';
import { Search, Download, Eye, User, Plus, MoreVertical, TrendingUp, Brain, Utensils, ClipboardList, Users, Edit, GraduationCap, ChevronLeft, ChevronRight, X, SlidersHorizontal } from 'lucide-react';
import type { Child, PaginatedData } from '@/types';
import ChildActionsModal from '@/components/ChildActionsModal';

type ModalType = 'growth' | 'development' | 'care' | 'observations' | 'parent-involvement' | null;

interface Filters {
    search?: string;
    status?: string;
    gender?: string;
    age_group?: string;
    zone?: string;
    classroom?: string;
    sort_by?: string;
    sort_dir?: string;
}

const statusStyle: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-700',
    pending:  'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
};

const classroomColor: Record<string, string> = {
    Nursery:     'bg-emerald-100 text-emerald-700',
    Kindergarten:'bg-sky-100 text-sky-700',
    Prep:        'bg-violet-100 text-violet-700',
    Toddlers:    'bg-orange-100 text-orange-700',
    Infants:     'bg-pink-100 text-pink-700',
};

function ClassroomBadge({ classroom }: { classroom: string | null }) {
    if (!classroom) return <span className="text-slate-300 text-sm">—</span>;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${classroomColor[classroom] ?? 'bg-slate-100 text-slate-600'}`}>
            <GraduationCap className="w-3 h-3" />{classroom}
        </span>
    );
}

function ActionDropdown({ child, onAction }: { child: Child; onAction: (type: ModalType, child: Child) => void }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, right: 0 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (!btnRef.current?.contains(e.target as Node) && !dropRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleOpen = () => {
        if (!open && btnRef.current) {
            const r = btnRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - r.bottom;
            setPos({
                top: spaceBelow < 300 ? r.top + window.scrollY - 300 : r.bottom + window.scrollY + 4,
                right: window.innerWidth - r.right,
            });
        }
        setOpen(o => !o);
    };

    const items = [
        { label: 'Add Growth Data',    icon: <TrendingUp className="w-3.5 h-3.5" />,   color: 'text-emerald-600 hover:bg-emerald-50', modal: 'growth' as ModalType },
        { label: 'Development Plans',  icon: <Brain className="w-3.5 h-3.5" />,        color: 'text-violet-600 hover:bg-violet-50',   modal: 'development' as ModalType },
        { label: 'Care Info',          icon: <Utensils className="w-3.5 h-3.5" />,     color: 'text-sky-600 hover:bg-sky-50',         modal: 'care' as ModalType },
        { label: 'Observations',       icon: <ClipboardList className="w-3.5 h-3.5" />,color: 'text-indigo-600 hover:bg-indigo-50',   modal: 'observations' as ModalType },
        { label: 'Parent Involvement', icon: <Users className="w-3.5 h-3.5" />,        color: 'text-orange-600 hover:bg-orange-50',   modal: 'parent-involvement' as ModalType },
        { type: 'divider' },
        { label: 'View Profile', icon: <Eye className="w-3.5 h-3.5" />,  color: 'text-slate-700 hover:bg-slate-50', href: route('admin.children.show', child.id) },
        { label: 'Edit',         icon: <Edit className="w-3.5 h-3.5" />, color: 'text-blue-600 hover:bg-blue-50',   href: route('admin.children.edit', child.id) },
    ];

    return (
        <>
            <button ref={btnRef} onClick={handleOpen}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
            </button>
            {open && (
                <div ref={dropRef} style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}
                    className="w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1">
                    {items.map((item, i) => {
                        if ('type' in item) return <div key={i} className="border-t border-slate-100 my-1" />;
                        if ('modal' in item && item.modal) return (
                            <button key={i} onClick={() => { setOpen(false); onAction(item.modal!, child); }}
                                className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium w-full text-left ${item.color} transition-colors`}>
                                {item.icon}{item.label}
                            </button>
                        );
                        if ('href' in item && item.href) return (
                            <Link key={i} href={item.href!} onClick={() => setOpen(false)}
                                className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium ${item.color} transition-colors`}>
                                {item.icon}{item.label}
                            </Link>
                        );
                        return null;
                    })}
                </div>
            )}
        </>
    );
}

export default function ChildrenIndex({ children, filters, zones }: { children: PaginatedData<Child>; filters: Filters; zones: string[] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeFilters, setActiveFilters] = useState<Filters>(filters);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);

    const openModal = (type: ModalType, child: Child) => { setActiveModal(type); setSelectedChild(child); };
    const closeModal = () => { setActiveModal(null); setSelectedChild(null); };

    const applyFilter = (key: string, value: string | null) => {
        const newFilters = { ...activeFilters, [key]: value ?? undefined };
        setActiveFilters(newFilters);
        router.get(route('admin.children.index'), newFilters as Record<string, string>, { preserveState: true });
    };

    const clearFilters = () => {
        setActiveFilters({});
        setSearch('');
        router.get(route('admin.children.index'));
    };

    const hasActiveFilters = Object.values(activeFilters).some(v => v);

    const sel = 'w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all';

    return (
        <AdminLayout>
            <Head title="Child Management" />
            <div className="space-y-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Child Management</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Manage children's records, development, and care information</p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button onClick={() => window.location.href = route('admin.reports.export', 'children')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm">
                            <Download className="w-3.5 h-3.5" /> Export
                        </button>
                        <Link href={route('admin.children.create')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all">
                            <Plus className="w-3.5 h-3.5" /> Add Child
                        </Link>
                    </div>
                </div>

                {/* Filter bar */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-600">Filters</span>
                            {hasActiveFilters && (
                                <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">Active</span>
                            )}
                        </div>
                        {hasActiveFilters && (
                            <button onClick={clearFilters}
                                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 font-medium transition-colors">
                                <X className="w-3.5 h-3.5" /> Clear all
                            </button>
                        )}
                    </div>

                    {/* Status pills */}
                    <div className="flex flex-wrap gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map(s => {
                            const active = s === 'all' ? !activeFilters.status : activeFilters.status === s;
                            return (
                                <button key={s} onClick={() => applyFilter('status', s === 'all' ? null : s)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        active ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            );
                        })}
                    </div>

                    {/* Dropdowns + search */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        <select value={activeFilters.classroom || ''} onChange={e => applyFilter('classroom', e.target.value || null)} className={sel}>
                            <option value="">All Classes</option>
                            {['Nursery','Kindergarten','Prep','Toddlers','Infants'].map(o => <option key={o}>{o}</option>)}
                        </select>
                        <select value={activeFilters.gender || ''} onChange={e => applyFilter('gender', e.target.value || null)} className={sel}>
                            <option value="">All Genders</option>
                            <option>Male</option><option>Female</option>
                        </select>
                        <select value={activeFilters.age_group || ''} onChange={e => applyFilter('age_group', e.target.value || null)} className={sel}>
                            <option value="">All Ages</option>
                            <option value="0-2">0–2 yrs</option>
                            <option value="3-4">3–4 yrs</option>
                            <option value="5-6">5–6 yrs</option>
                        </select>
                        <select value={activeFilters.zone || ''} onChange={e => applyFilter('zone', e.target.value || null)} className={sel}>
                            <option value="">All Zones</option>
                            {zones?.map(z => <option key={z}>{z}</option>)}
                        </select>
                        <div className="relative col-span-2 md:col-span-4 lg:col-span-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input type="text" value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && applyFilter('search', search)}
                                placeholder="Search name…"
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-50 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            Showing <span className="font-semibold text-slate-700">{children.data?.length ?? 0}</span> of <span className="font-semibold text-slate-700">{children.total ?? 0}</span> children
                        </p>
                    </div>

                    {children.data?.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-50">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            {['Child', 'Age', 'Class', 'Gender', 'Status', ''].map(h => (
                                                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider last:text-right">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {children.data.map((child: any) => (
                                            <tr key={child.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        {child.profile_picture ? (
                                                            <img src={`/storage/${child.profile_picture}`} alt={child.first_name}
                                                                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm shrink-0" />
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
                                                                <User className="w-4 h-4 text-white" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{child.first_name} {child.last_name}</p>
                                                            {child.family_profile?.purok_zone && (
                                                                <p className="text-[11px] text-slate-400 mt-0.5">{child.family_profile.purok_zone}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    <span className="text-sm text-slate-600">{child.age} yrs</span>
                                                </td>
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    <ClassroomBadge classroom={child.classroom} />
                                                </td>
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    <span className="text-sm text-slate-600">{child.sex}</span>
                                                </td>
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[child.registration_status?.toLowerCase()] ?? 'bg-slate-100 text-slate-600'}`}>
                                                        {child.registration_status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 whitespace-nowrap text-right">
                                                    <ActionDropdown child={child} onAction={openModal} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {children.last_page > 1 && (
                                <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-xs text-slate-500">
                                        Page <span className="font-semibold text-slate-700">{children.current_page}</span> of <span className="font-semibold text-slate-700">{children.last_page}</span>
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => router.get(route('admin.children.index'), { ...activeFilters, page: children.current_page - 1 } as any, { preserveState: true })}
                                            disabled={children.current_page === 1}
                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        {children.links.slice(1, -1).map((link: any) => (
                                            <button key={link.label}
                                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${link.active ? 'bg-blue-500 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ))}
                                        <button onClick={() => router.get(route('admin.children.index'), { ...activeFilters, page: children.current_page + 1 } as any, { preserveState: true })}
                                            disabled={children.current_page === children.last_page}
                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                <User className="w-7 h-7 text-slate-300" />
                            </div>
                            <p className="text-slate-600 font-semibold">No children found</p>
                            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or add a new child</p>
                        </div>
                    )}
                </div>
            </div>

            <ChildActionsModal child={selectedChild} type={activeModal} onClose={closeModal} />
        </AdminLayout>
    );
}
