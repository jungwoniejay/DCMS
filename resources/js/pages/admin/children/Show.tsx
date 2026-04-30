import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import {
    ArrowLeft, Edit, Trash2, CheckCircle, XCircle, User, Users,
    Home, Heart, Apple, Shield, Phone, Baby, MapPin, Zap, Droplets,
    Wifi, GraduationCap, Briefcase, Calendar, Languages, ClipboardCheck
} from 'lucide-react';
import type { Child } from '@/types';

export default function ChildShow({ child }: { child: Child }) {
    const [processing, setProcessing] = useState(false);

    const handleApprove = () => {
        if (processing) return;
        if (confirm('Approve this child registration?')) {
            setProcessing(true);
            router.post(route('admin.children.approve', child.id), {}, {
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleReject = () => {
        if (processing) return;
        if (confirm('Reject this child registration?')) {
            setProcessing(true);
            router.post(route('admin.children.reject', child.id), {}, {
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleDelete = () => {
        if (processing) return;
        if (confirm('Are you sure you want to delete this child? This action cannot be undone.')) {
            setProcessing(true);
            router.delete(route('admin.children.destroy', child.id), {
                onFinish: () => setProcessing(false),
            });
        }
    };

    const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
        Approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Approved' },
        Pending:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Pending'  },
        Rejected: { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     label: 'Rejected' },
    };
    const status = statusConfig[child.registration_status] ?? statusConfig.Pending;

    return (
        <AdminLayout>
            <Head title={`${child.first_name} ${child.last_name}`} />

            <div className="space-y-5">
                {/* Top Bar */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <Link
                        href={route('admin.children.index')}
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Children
                    </Link>

                    <div className="flex items-center gap-2 flex-wrap">
                        {child.registration_status === 'Pending' && (
                            <>
                                <button
                                    onClick={handleApprove}
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Approve
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Reject
                                </button>
                            </>
                        )}
                        <Link
                            href={route('admin.children.edit', child.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                        >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Profile Hero Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
                    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        {/* Avatar */}
                        {child.profile_picture ? (
                            <img
                                src={`/storage/${child.profile_picture}`}
                                alt={`${child.first_name} ${child.last_name}`}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg shrink-0"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shrink-0">
                                <Baby className="w-9 h-9 text-white" />
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div>
                                    <h1 className="text-xl font-bold text-slate-800">
                                        {child.first_name} {child.middle_name} {child.last_name}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="text-sm text-slate-500">{child.age} years old</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span className="text-sm text-slate-500">{child.sex}</span>
                                        {child.family_profile?.purok_zone && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-sm text-slate-500 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {child.family_profile.purok_zone}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                    {status.label}
                                </div>
                            </div>

                            {child.reviewed_by && (
                                <p className="text-xs text-slate-400 mt-2">
                                    Reviewed by <span className="font-medium text-slate-500">{child.reviewed_by}</span>
                                    {child.reviewed_at && <> on {new Date(child.reviewed_at).toLocaleDateString()}</>}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <SectionCard icon={<User className="w-4 h-4" />} title="Basic Information" color="blue">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InfoItem label="Full Name" value={`${child.first_name} ${child.middle_name || ''} ${child.last_name}`} />
                        <InfoItem label="Birthdate" value={child.birthdate} icon={<Calendar className="w-3 h-3" />} />
                        <InfoItem label="Age" value={`${child.age} years old`} />
                        <InfoItem label="Sex" value={child.sex} />
                        <InfoItem label="Address" value={child.address} fullWidth />
                        <InfoItem label="First Language" value={child.first_language} icon={<Languages className="w-3 h-3" />} />
                        <InfoItem label="Second Language" value={child.second_language || 'N/A'} icon={<Languages className="w-3 h-3" />} />
                        <InfoItem label="Accomplished By" value={child.accomplished_by || 'N/A'} />
                    </div>
                </SectionCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Father Profile */}
                    {child.father_profile && (
                        <SectionCard icon={<User className="w-4 h-4" />} title="Father's Profile" color="blue">
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem label="Name" value={`${child.father_profile.first_name} ${child.father_profile.last_name}`} />
                                <InfoItem label="Age" value={child.father_profile.age} icon={<Calendar className="w-3 h-3" />} />
                                <InfoItem label="Civil Status" value={child.father_profile.civil_status} />
                                <InfoItem label="Education" value={child.father_profile.educational_attainment} icon={<GraduationCap className="w-3 h-3" />} />
                                <InfoItem label="Occupation" value={child.father_profile.occupational_status} icon={<Briefcase className="w-3 h-3" />} />
                                <InfoItem label="Mother Tongue" value={child.father_profile.mother_tongue} icon={<Languages className="w-3 h-3" />} />
                            </div>
                        </SectionCard>
                    )}

                    {/* Mother Profile */}
                    {child.mother_profile && (
                        <SectionCard icon={<User className="w-4 h-4" />} title="Mother's Profile" color="pink">
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem label="Name" value={`${child.mother_profile.first_name} ${child.mother_profile.last_name}`} />
                                <InfoItem label="Age" value={child.mother_profile.age} icon={<Calendar className="w-3 h-3" />} />
                                <InfoItem label="Civil Status" value={child.mother_profile.civil_status} />
                                <InfoItem label="Education" value={child.mother_profile.educational_attainment} icon={<GraduationCap className="w-3 h-3" />} />
                                <InfoItem label="Occupation" value={child.mother_profile.occupational_status} icon={<Briefcase className="w-3 h-3" />} />
                                <InfoItem label="Pregnant" value={child.mother_profile.pregnant ? 'Yes' : 'No'} />
                            </div>
                        </SectionCard>
                    )}

                    {/* Guardians */}
                    {child.guardians?.length > 0 && (
                        <SectionCard icon={<Shield className="w-4 h-4" />} title="Guardians" color="violet">
                            <div className="space-y-3">
                                {child.guardians.map((guardian: any, index: number) => (
                                    <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">{guardian.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{guardian.relationship}</p>
                                            </div>
                                            {guardian.mobile_phone && (
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {guardian.mobile_phone}
                                                </span>
                                            )}
                                        </div>
                                        {(guardian.email || guardian.occupation) && (
                                            <div className="flex gap-3 mt-2 flex-wrap">
                                                {guardian.email && <span className="text-xs text-slate-400">{guardian.email}</span>}
                                                {guardian.occupation && <span className="text-xs text-slate-400">{guardian.occupation}</span>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {/* Emergency Contacts */}
                    {child.emergency_contacts?.length > 0 && (
                        <SectionCard icon={<Phone className="w-4 h-4" />} title="Emergency Contacts" color="red">
                            <div className="space-y-3">
                                {child.emergency_contacts.map((contact: any, index: number) => (
                                    <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">{contact.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{contact.relationship}</p>
                                            </div>
                                            {contact.mobile_phone && (
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {contact.mobile_phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {/* Family Profile */}
                    {child.family_profile && (
                        <SectionCard icon={<Home className="w-4 h-4" />} title="Family Profile" color="emerald">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <InfoItem label="Home Ownership" value={child.family_profile.ownership} />
                                <InfoItem label="Materials" value={child.family_profile.materials} />
                                <InfoItem label="Zone/Purok" value={child.family_profile.purok_zone} icon={<MapPin className="w-3 h-3" />} />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Utilities:</span>
                                {child.family_profile?.electricity ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                                        <Zap className="w-2.5 h-2.5" /> Electricity
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-400 px-2 py-1 rounded-full line-through">
                                        <Zap className="w-2.5 h-2.5" /> Electricity
                                    </span>
                                )}
                                {child.family_profile?.running_water ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-sky-100 text-sky-600 px-2 py-1 rounded-full">
                                        <Droplets className="w-2.5 h-2.5" /> Water
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-400 px-2 py-1 rounded-full line-through">
                                        <Droplets className="w-2.5 h-2.5" /> Water
                                    </span>
                                )}
                                {child.family_profile?.internet ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                                        <Wifi className="w-2.5 h-2.5" /> Internet
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-400 px-2 py-1 rounded-full line-through">
                                        <Wifi className="w-2.5 h-2.5" /> Internet
                                    </span>
                                )}
                            </div>
                        </SectionCard>
                    )}

                    {/* Siblings */}
                    {child.siblings?.length > 0 && (
                        <SectionCard icon={<Users className="w-4 h-4" />} title={`Siblings (${child.siblings.length})`} color="amber">
                            <div className="space-y-2">
                                {child.siblings.map((sibling: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">{sibling.name}</p>
                                            {sibling.age && <p className="text-xs text-slate-400">{sibling.age} years old</p>}
                                        </div>
                                        {sibling.sex && (
                                            <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{sibling.sex}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {/* Health Assessment */}
                    {child.health_assessment && (
                        <SectionCard icon={<Heart className="w-4 h-4" />} title="Health Assessment" color="rose">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <InfoItem label="Hospital/Center" value={child.health_assessment.hospital_center_name} />
                                <InfoItem label="Last Checkup" value={child.health_assessment.last_checkup_date} icon={<Calendar className="w-3 h-3" />} />
                            </div>
                            {child.health_assessment.medical_assessment && (
                                <div className="pt-3 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <ClipboardCheck className="w-3.5 h-3.5" /> Vaccinations
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: 'BCG', key: 'bcg_status' },
                                            { label: 'DPT', key: 'dpt_status' },
                                            { label: 'Polio', key: 'polio_status' },
                                            { label: 'MMR', key: 'mmr_status' },
                                            { label: 'Hepa B', key: 'hepa_b_status' },
                                            { label: 'Measles', key: 'measles_status' },
                                        ].map(({ label, key }) => (
                                            <VaccineStatus
                                                key={key}
                                                label={label}
                                                status={child.health_assessment.medical_assessment[key]}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </SectionCard>
                    )}

                    {/* Nutrition Record */}
                    {child.nutrition_record && (
                        <SectionCard icon={<Apple className="w-4 h-4" />} title="Nutrition Status" color="green">
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem label="Height (1st)" value={`${child.nutrition_record.height_first} cm`} />
                                <InfoItem label="Weight (1st)" value={`${child.nutrition_record.weight_first} kg`} />
                                <InfoItem label="Height (2nd)" value={child.nutrition_record.height_second ? `${child.nutrition_record.height_second} cm` : 'N/A'} />
                                <InfoItem label="Weight (2nd)" value={child.nutrition_record.weight_second ? `${child.nutrition_record.weight_second} kg` : 'N/A'} />
                                <InfoItem label="Status" value={child.nutrition_record.nutritional_status_result} fullWidth />
                            </div>
                        </SectionCard>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

const colorMap: Record<string, { icon: string; header: string; dot: string }> = {
    blue:    { icon: 'bg-blue-500',    header: 'text-blue-600',    dot: 'bg-blue-500'    },
    pink:    { icon: 'bg-pink-500',    header: 'text-pink-600',    dot: 'bg-pink-500'    },
    violet:  { icon: 'bg-violet-500',  header: 'text-violet-600',  dot: 'bg-violet-500'  },
    red:     { icon: 'bg-red-500',     header: 'text-red-600',     dot: 'bg-red-500'     },
    emerald: { icon: 'bg-emerald-500', header: 'text-emerald-600', dot: 'bg-emerald-500' },
    amber:   { icon: 'bg-amber-500',   header: 'text-amber-600',   dot: 'bg-amber-500'   },
    rose:    { icon: 'bg-rose-500',    header: 'text-rose-600',    dot: 'bg-rose-500'    },
    green:   { icon: 'bg-green-500',   header: 'text-green-600',   dot: 'bg-green-500'   },
};

function SectionCard({ icon, title, children, color = 'blue' }: any) {
    const c = colorMap[color] ?? colorMap.blue;
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-2.5 border-b border-slate-50">
                <div className={`w-7 h-7 rounded-lg ${c.icon} flex items-center justify-center shadow-sm`}>
                    <span className="text-white">{icon}</span>
                </div>
                <h2 className={`text-sm font-bold ${c.header}`}>{title}</h2>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function InfoItem({ label, value, icon, fullWidth }: any) {
    return (
        <div className={fullWidth ? 'col-span-2' : ''}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                {icon && <span className="text-slate-400">{icon}</span>}
                {label}
            </p>
            <p className="text-sm text-slate-700 font-medium">{value || 'N/A'}</p>
        </div>
    );
}

function VaccineStatus({ label, status }: any) {
    const done = status === 'Yes';
    return (
        <div className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center ${
            done ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
        }`}>
            <span className={`text-xs font-bold ${done ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
            <span className={`text-[10px] mt-0.5 font-medium ${done ? 'text-emerald-500' : 'text-slate-400'}`}>
                {done ? '✓ Done' : status || 'N/A'}
            </span>
        </div>
    );
}
