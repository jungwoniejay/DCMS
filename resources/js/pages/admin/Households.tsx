import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';
import { User, Users, Home, Phone, Search, Eye, Baby, Shield, ChevronRight, MapPin, Zap, Wifi, Droplets } from 'lucide-react';

export default function Households({ households }: any) {
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            router.get(route('admin.households'), { search }, { preserveState: true });
        }
    };

    const stats = [
        {
            label: 'Total Families',
            value: households.total || 0,
            icon: Home,
            gradient: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-100',
        },
        {
            label: 'With Father Info',
            value: households.data?.filter((h: any) => h.father_profile).length || 0,
            icon: User,
            gradient: 'from-blue-500 to-indigo-500',
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            border: 'border-blue-100',
        },
        {
            label: 'With Mother Info',
            value: households.data?.filter((h: any) => h.mother_profile).length || 0,
            icon: User,
            gradient: 'from-pink-500 to-rose-500',
            bg: 'bg-pink-50',
            text: 'text-pink-700',
            border: 'border-pink-100',
        },
        {
            label: 'With Guardians',
            value: households.data?.filter((h: any) => h.guardians?.length > 0).length || 0,
            icon: Shield,
            gradient: 'from-violet-500 to-purple-500',
            bg: 'bg-violet-50',
            text: 'text-violet-700',
            border: 'border-violet-100',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Household & Family" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                                <Home className="w-4 h-4 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-800">Household & Family</h1>
                        </div>
                        <p className="text-slate-400 text-sm ml-10">Complete family profiles and household information</p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search by child name..."
                            className="pl-9 pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 w-full sm:w-64 shadow-sm backdrop-blur-sm transition-all"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl border ${stat.border} p-4 shadow-sm hover:shadow-md transition-all duration-200`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                    <p className={`text-xs font-medium mt-0.5 ${stat.text}`}>{stat.label}</p>
                                </div>
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                                    <stat.icon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            {/* Decorative accent */}
                            <div className={`absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-br ${stat.gradient} opacity-5`} />
                        </div>
                    ))}
                </div>

                {/* Cards Grid */}
                {households.data?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {households.data.map((h: any) => (
                            <div
                                key={h.id}
                                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300 overflow-hidden"
                            >
                                {/* Card Header */}
                                <div className="relative px-5 pt-5 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {h.profile_picture ? (
                                                <img
                                                    src={`/storage/${h.profile_picture}`}
                                                    alt={h.first_name}
                                                    className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-md"
                                                />
                                            ) : (
                                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                                                    <Baby className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm leading-tight">
                                                    {h.first_name} {h.last_name}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-xs text-slate-400">{h.age} yrs</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                    <span className="text-xs text-slate-400">{h.sex}</span>
                                                    {h.family_profile?.purok_zone && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                            <span className="text-xs text-slate-400 flex items-center gap-0.5">
                                                                <MapPin className="w-2.5 h-2.5" />
                                                                {h.family_profile.purok_zone}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={route('admin.children.show', h.id)}
                                            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all duration-200 group-hover:shadow-sm"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="mx-5 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

                                {/* Card Body */}
                                <div className="px-5 py-4 space-y-3">
                                    {/* Parents Row */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Father */}
                                        <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100/60">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="w-4 h-4 rounded-md bg-blue-500 flex items-center justify-center">
                                                    <User className="w-2.5 h-2.5 text-white" />
                                                </div>
                                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Father</p>
                                            </div>
                                            {h.father_profile ? (
                                                <>
                                                    <p className="text-xs font-semibold text-slate-700 truncate">
                                                        {h.father_profile.first_name} {h.father_profile.last_name}
                                                    </p>
                                                    {h.father_profile?.occupational_status && (
                                                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{h.father_profile.occupational_status}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">Not provided</p>
                                            )}
                                        </div>

                                        {/* Mother */}
                                        <div className="bg-pink-50/60 rounded-xl p-3 border border-pink-100/60">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="w-4 h-4 rounded-md bg-pink-500 flex items-center justify-center">
                                                    <User className="w-2.5 h-2.5 text-white" />
                                                </div>
                                                <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Mother</p>
                                            </div>
                                            {h.mother_profile ? (
                                                <>
                                                    <p className="text-xs font-semibold text-slate-700 truncate">
                                                        {h.mother_profile.first_name} {h.mother_profile.last_name}
                                                    </p>
                                                    {h.mother_profile?.occupational_status && (
                                                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{h.mother_profile.occupational_status}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">Not provided</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Guardians & Emergency */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Guardians */}
                                        <div className="flex items-start gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <Shield className="w-3 h-3 text-violet-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardians</p>
                                                {h.guardians?.length > 0 ? (
                                                    <p className="text-xs text-slate-600 truncate">{h.guardians.map((g: any) => g.name).join(', ')}</p>
                                                ) : (
                                                    <p className="text-xs text-slate-400 italic">None</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Siblings */}
                                        <div className="flex items-start gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <Users className="w-3 h-3 text-amber-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Siblings</p>
                                                <p className="text-xs text-slate-600">
                                                    {h.siblings?.length > 0 ? `${h.siblings.length} sibling(s)` : 'None'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    {h.emergency_contacts?.length > 0 && (
                                        <div className="flex items-center gap-2 bg-red-50/60 rounded-xl px-3 py-2 border border-red-100/60">
                                            <Phone className="w-3 h-3 text-red-400 shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Emergency · </span>
                                                <span className="text-xs text-slate-600 truncate">
                                                    {h.emergency_contacts[0].name} — {h.emergency_contacts[0].mobile_phone}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Home Info */}
                                    {h.family_profile && (
                                        <div className="bg-slate-50/80 rounded-xl px-3 py-2.5 border border-slate-100">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <Home className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Home</span>
                                                </div>
                                                {h.family_profile?.home_ownership && (
                                                    <span className="text-[10px] text-slate-500 font-medium">{h.family_profile.home_ownership}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {h.family_profile?.electricity && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                                                        <Zap className="w-2.5 h-2.5" /> Electricity
                                                    </span>
                                                )}
                                                {h.family_profile?.running_water && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full">
                                                        <Droplets className="w-2.5 h-2.5" /> Water
                                                    </span>
                                                )}
                                                {h.family_profile?.internet && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                                                        <Wifi className="w-2.5 h-2.5" /> Internet
                                                    </span>
                                                )}
                                                {!h.family_profile?.electricity && !h.family_profile?.running_water && !h.family_profile?.internet && (
                                                    <span className="text-[10px] text-slate-400 italic">No utilities listed</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 pb-4">
                                    <Link
                                        href={route('admin.children.show', h.id)}
                                        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all duration-200"
                                    >
                                        View Full Profile
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 text-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
                            <Home className="w-7 h-7 text-slate-400" />
                        </div>
                        <p className="font-semibold text-slate-600">No household data available</p>
                        <p className="text-sm text-slate-400 mt-1">Household records will appear here once children are registered</p>
                    </div>
                )}

                {/* Pagination */}
                {households.last_page > 1 && (
                    <div className="flex justify-center items-center gap-1.5">
                        {Array.from({ length: households.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => router.get(route('admin.households'), { page }, { preserveState: true })}
                                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                    page === households.current_page
                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200'
                                        : 'bg-white/80 border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
