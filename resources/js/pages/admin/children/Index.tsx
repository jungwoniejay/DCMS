import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Download, Eye, User, Plus, MoreVertical, TrendingUp, Brain, Utensils, ClipboardList, Users, Edit, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Child, PaginatedData } from '@/types';

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

interface ActionItem {
    label: string;
    icon: React.ReactNode;
    href: string;
    color: string;
    type?: string;
}

function ActionDropdown({ child }: { child: Child }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpen = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 280;
            const top = spaceBelow < dropdownHeight
                ? rect.top + window.scrollY - dropdownHeight
                : rect.bottom + window.scrollY + 4;
            setDropdownPos({
                top,
                right: window.innerWidth - rect.right,
            });
        }
        setIsOpen(!isOpen);
    };

    const actionItems: (ActionItem | { type: 'divider' })[] = [
        {
            label: 'Add Growth Data',
            icon: <TrendingUp className="w-4 h-4" />,
            href: route('admin.growth-data', child.id),
            color: 'text-green-600 hover:bg-green-50'
        },
        {
            label: 'Development Plans',
            icon: <Brain className="w-4 h-4" />,
            href: route('admin.development-plans', child.id),
            color: 'text-purple-600 hover:bg-purple-50'
        },
        {
            label: 'Care Info',
            icon: <Utensils className="w-4 h-4" />,
            href: route('admin.children.care.show', child.id),
            color: 'text-blue-600 hover:bg-blue-50'
        },
        {
            label: 'Observations',
            icon: <ClipboardList className="w-4 h-4" />,
            href: route('admin.children.observations.index', child.id),
            color: 'text-indigo-600 hover:bg-indigo-50'
        },
        {
            label: 'Parent Involvement',
            icon: <Users className="w-4 h-4" />,
            href: route('admin.children.parent-involvement.show', child.id),
            color: 'text-orange-600 hover:bg-orange-50'
        },
        { type: 'divider' } as const,
        {
            label: 'View Profile',
            icon: <Eye className="w-4 h-4" />,
            href: route('admin.children.show', child.id),
            color: 'text-gray-700 hover:bg-gray-50'
        },
        {
            label: 'Edit',
            icon: <Edit className="w-4 h-4" />,
            href: route('admin.children.edit', child.id),
            color: 'text-blue-600 hover:bg-blue-50'
        },
    ];

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleOpen}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    style={{ top: dropdownPos.top, right: dropdownPos.right }}
                    className="fixed w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-[9999]"
                >
                    {actionItems.map((item, index) => {
                        if ('type' in item && item.type === 'divider') {
                            return <div key={index} className="border-t border-gray-100 my-1" />;
                        }
                        const actionItem = item as ActionItem;
                        return (
                            <Link
                                key={index}
                                href={actionItem.href}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm ${actionItem.color} transition-colors duration-150`}
                                onClick={() => setIsOpen(false)}
                            >
                                {actionItem.icon}
                                {actionItem.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Classroom badge component
function ClassroomBadge({ classroom }: { classroom: string | null }) {
    if (!classroom) {
        return <span className="text-gray-400 text-sm">—</span>;
    }

    const classroomColors: Record<string, string> = {
        'Nursery': 'bg-green-100 text-green-700 border-green-200',
        'Kindergarten': 'bg-blue-100 text-blue-700 border-blue-200',
        'Prep': 'bg-purple-100 text-purple-700 border-purple-200',
        'Toddlers': 'bg-orange-100 text-orange-700 border-orange-200',
        'Infants': 'bg-pink-100 text-pink-700 border-pink-200',
    };

    const colorClass = classroomColors[classroom] || 'bg-gray-100 text-gray-700 border-gray-200';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
            <GraduationCap className="w-3 h-3 mr-1" />
            {classroom}
        </span>
    );
}

export default function ChildrenIndex({ children, filters, zones }: { children: PaginatedData<Child>; filters: Filters; zones: string[] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeFilters, setActiveFilters] = useState<Filters>(filters);

    const applyFilter = (key: string, value: string | null) => {
        const newFilters = { ...activeFilters, [key]: value };
        setActiveFilters(newFilters);
        router.get(route('admin.children.index'), newFilters as Record<string, string>, { preserveState: true });
    };

    const clearFilters = () => {
        setActiveFilters({});
        setSearch('');
        router.get(route('admin.children.index'));
    };

    const handleExport = () => {
        window.location.href = route('admin.reports.export', 'children');
    };

    const classroomOptions = ['Nursery', 'Kindergarten', 'Prep', 'Toddlers', 'Infants'];

    return (
        <AdminLayout>
            <Head title="Child Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Child Management</h1>
                        <p className="text-gray-600 mt-1 text-sm">Manage children's records, development, and care information</p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors duration-150 shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <Link
                            href={route('admin.children.create')}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-medium shadow-md transition-all duration-150"
                        >
                            <Plus className="w-4 h-4" />
                            Add Child
                        </Link>
                    </div>
                </div>

                {/* Advanced Filter Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Quick Status Filters */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => applyFilter('status', status === 'all' ? null : status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                            activeFilters.status === status || (status === 'all' && !activeFilters.status)
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Classroom Filter */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Class</label>
                                <select
                                    value={activeFilters.classroom || ''}
                                    onChange={(e) => applyFilter('classroom', e.target.value || null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
                                >
                                    <option value="">All Classes</option>
                                    {classroomOptions.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Gender Filter */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
                                <select
                                    value={activeFilters.gender || ''}
                                    onChange={(e) => applyFilter('gender', e.target.value || null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
                                >
                                    <option value="">All</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            {/* Age Group Filter */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Age Group</label>
                                <select
                                    value={activeFilters.age_group || ''}
                                    onChange={(e) => applyFilter('age_group', e.target.value || null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
                                >
                                    <option value="">All</option>
                                    <option value="0-2">0-2 years</option>
                                    <option value="3-4">3-4 years</option>
                                    <option value="5-6">5-6 years</option>
                                </select>
                            </div>

                            {/* Zone Filter */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Zone/Purok</label>
                                <select
                                    value={activeFilters.zone || ''}
                                    onChange={(e) => applyFilter('zone', e.target.value || null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
                                >
                                    <option value="">All Zones</option>
                                    {zones?.map((zone: string) => (
                                        <option key={zone} value={zone}>{zone}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-md">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilter('search', search)}
                                    placeholder="Search by child's name..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150"
                                />
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-150"
                        >
                            Clear all filters
                        </button>
                    </div>
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{children.data?.length || 0}</span> of <span className="font-semibold text-gray-900">{children.total || 0}</span> children
                        </p>
                    </div>

                    {children.data?.length > 0 ? (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Child</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {children.data.map((child: any) => (
                                            <tr key={child.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        {child.profile_picture ? (
                                                            <img src={`/storage/${child.profile_picture}`} alt={`${child.first_name}`} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                                                <User className="w-5 h-5 text-white" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <span className="font-semibold text-gray-900">{child.first_name} {child.last_name}</span>
                                                            {child.family_profile?.purok_zone && (
                                                                <p className="text-xs text-gray-500 mt-0.5">{child.family_profile.purok_zone}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600">{child.age} yrs</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <ClassroomBadge classroom={child.classroom} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600">{child.sex}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        child.registration_status?.toLowerCase() === 'approved' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : child.registration_status?.toLowerCase() === 'rejected'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {child.registration_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end">
                                                        <ActionDropdown child={child} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Tablet/Mobile Table */}
                            <div className="lg:hidden block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Child</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {children.data.map((child: any) => (
                                            <tr key={child.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {child.profile_picture ? (
                                                            <img src={`/storage/${child.profile_picture}`} alt={`${child.first_name}`} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                                                <User className="w-4 h-4 text-white" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <span className="font-medium text-gray-900 text-sm">{child.first_name} {child.last_name}</span>
                                                            <p className="text-xs text-gray-500">{child.sex}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600">{child.age}y</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <ClassroomBadge classroom={child.classroom} />
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                                    <ActionDropdown child={child} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards View */}
                            <div className="md:hidden divide-y divide-gray-200">
                                {children.data.map((child: any) => (
                                    <div key={child.id} className="p-4 flex items-center gap-3 bg-white hover:bg-gray-50 transition-colors duration-150">
                                        {child.profile_picture ? (
                                            <img src={`/storage/${child.profile_picture}`} alt={child.first_name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shrink-0" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{child.first_name} {child.last_name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">{child.age} yrs</span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-xs text-gray-500">{child.sex}</span>
                                            </div>
                                            <div className="mt-1">
                                                <ClassroomBadge classroom={child.classroom} />
                                            </div>
                                        </div>
                                        <ActionDropdown child={child} />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-lg font-medium text-gray-900">No children found</p>
                            <p className="text-sm mt-1 text-gray-500">Try adjusting your filters or add a new child</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {children.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Page <span className="font-semibold">{children.current_page}</span> of <span className="font-semibold">{children.last_page}</span>
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => router.get(route('admin.children.index'), { ...activeFilters, page: children.current_page - 1 } as Record<string, unknown>, { preserveState: true })}
                                    disabled={children.current_page === 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {children.links.slice(1, -1).map((link) => (
                                    <button
                                        key={link.label}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                                <button
                                    onClick={() => router.get(route('admin.children.index'), { ...activeFilters, page: children.current_page + 1 } as Record<string, unknown>, { preserveState: true })}
                                    disabled={children.current_page === children.last_page}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}