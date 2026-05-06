import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard, Users, Heart, Apple, BookOpen, Baby,
    BarChart3, Settings, User, LogOut, ClipboardList,
    Calendar, Menu, X, ChevronDown, ChevronRight, MapPin,
    Shield, Stethoscope, PanelLeftClose, PanelLeftOpen, FileText, Truck, Building2, Activity
} from 'lucide-react';
import DaycareLogo from '@/components/daycare-logo';
import Toast from '@/components/toast';

const menuGroups = [
    {
        label: 'Main',
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: 'admin.dashboard' },
        ],
    },
    {
        label: 'Child & Family',
        items: [
            { id: 'children', label: 'Child Management', icon: Baby, route: 'admin.children.index' },
            { id: 'households', label: 'Household & Family', icon: Users, route: 'admin.households' },
            { id: 'development', label: 'Development', icon: BookOpen, route: 'admin.development' },
        ],
    },
    {
        label: 'Health & Care',
        items: [
            { id: 'health', label: 'Health Records', icon: Stethoscope, route: 'admin.health' },
            { id: 'nutrition', label: 'Nutrition Monitoring', icon: Apple, route: 'admin.nutrition' },
        ],
    },
    {
        label: 'Operations',
        items: [
            { id: 'enrollments', label: 'Enrollment Requests', icon: ClipboardList, route: 'admin.enrollments' },
            { id: 'appointments', label: 'Appointments', icon: Calendar, route: 'admin.appointments' },
            { id: 'logistics', label: 'Attendance & Access', icon: Truck, route: 'admin.logistics' },
        ],
    },
    {
        label: 'Management',
        items: [
            { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, route: 'admin.reports' },
            { id: 'welcome-content', label: 'Welcome Content', icon: FileText, route: 'admin.welcome-content' },
        ],
    },
    {
        label: 'System',
        items: [
            { id: 'system', label: 'Admin Panel', icon: Shield, route: 'admin.system' },
            { id: 'activity-monitoring', label: 'Activity Monitoring', icon: Activity, route: 'admin.activity-monitoring' },
            { id: 'maintenance', label: 'System Maintenance', icon: Settings, route: 'admin.system', hash: 'maintenance' },
        ],
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;
    const barangay = (usePage().props as any).barangay ?? {};
    const systemName = barangay.system_name || 'KidCare Hinoba-an';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const currentPath = window.location.pathname;

    const isActive = (routeName: string) => {
        try {
            return currentPath === route(routeName) || currentPath.startsWith(route(routeName));
        } catch { return false; }
    };

    const NavItem = ({ item, mini }: { item: any; mini: boolean }) => {
        const active = isActive(item.route);
        return (
            <Link
                href={route(item.route)}
                onClick={() => setSidebarOpen(false)}
                title={mini ? item.label : undefined}
                className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 ease-in-out group
                    ${mini ? 'justify-center px-2' : ''}
                    ${active
                        ? 'bg-indigo-500/10 text-indigo-300'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }
                `}
            >
                {/* Active indicator */}
                {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                )}

                {/* Icon */}
                <div className={`
                    shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200
                    ${active
                        ? 'bg-indigo-500 shadow-md shadow-indigo-900/40'
                        : 'bg-white/5 group-hover:bg-white/10'
                    }
                `}>
                    <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-300'}`} />
                </div>

                {/* Label */}
                {!mini && (
                    <span className={`text-sm font-medium truncate ${active ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {item.label}
                    </span>
                )}

                {/* Tooltip for mini mode */}
                {mini && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                    </div>
                )}
            </Link>
        );
    };

    const SidebarContent = ({ mini = false }: { mini?: boolean }) => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`shrink-0 p-4 ${mini ? 'px-2' : ''}`}>
                <div className={`flex items-center gap-3 ${mini ? 'justify-center' : ''}`}>
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 blur-md opacity-30 rounded-full" />
                        <DaycareLogo className="w-10 h-10 relative z-10 drop-shadow" />
                    </div>
                    {!mini && (
                        <div>
                            <h1 className="text-base font-bold text-white leading-tight">
                                {systemName}
                            </h1>
                            <p className="text-[10px] text-slate-400 font-semibold tracking-[0.15em] uppercase">{barangay.barangay_name || 'Admin Portal'}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mx-4 h-px bg-white/10 shrink-0" />
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin">
                {menuGroups.map((group) => (
                    <div key={group.label}>
                        {!mini && (
                            <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em]">
                                {group.label}
                            </p>
                        )}
                        {mini && <div className="mx-2 mb-1.5 h-px bg-white/10" />}
                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <NavItem key={item.id} item={item} mini={mini} />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Settings group */}
                <div>
                    {!mini && (
                        <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em]">
                            Settings
                        </p>
                    )}
                    {mini && <div className="mx-2 mb-1.5 h-px bg-white/10" />}
                    <div className="space-y-0.5">
                        <button
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            title={mini ? 'Settings' : undefined}
                            className={`
                                relative flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
                                transition-all duration-200 ease-in-out group
                                text-slate-400 hover:text-slate-200 hover:bg-white/5
                                ${mini ? 'justify-center px-2' : ''}
                            `}
                        >
                            <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-all duration-200">
                                <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-300" />
                            </div>
                            {!mini && (
                                <>
                                    <span className="text-sm font-medium flex-1 text-left text-slate-300">Settings</span>
                                    {settingsOpen
                                        ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                        : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    }
                                </>
                            )}
                            {mini && (
                                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                    Settings
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                                </div>
                            )}
                        </button>

                        {(settingsOpen || mini) && (
                            <div className={mini ? '' : 'ml-4 pl-3 border-l border-white/10 space-y-0.5'}>
                                <Link
                                    href={route('admin.settings.puroks')}
                                    onClick={() => setSidebarOpen(false)}
                                    title={mini ? 'Purok Database' : undefined}
                                    className={`
                                        relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                                        transition-all duration-200 ease-in-out group
                                        text-slate-400 hover:text-slate-200 hover:bg-white/5
                                        ${mini ? 'justify-center px-2' : ''}
                                    `}
                                >
                                    <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-all duration-200">
                                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-indigo-300" />
                                    </div>
                                    {!mini && <span className="text-sm font-medium text-slate-300">Purok Database</span>}
                                    {mini && (
                                        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                            Purok Database
                                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                                        </div>
                                    )}
                                </Link>
                                <Link
                                    href={route('admin.settings.locations')}
                                    onClick={() => setSidebarOpen(false)}
                                    title={mini ? 'City & Province' : undefined}
                                    className={`
                                        relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                                        transition-all duration-200 ease-in-out group
                                        text-slate-400 hover:text-slate-200 hover:bg-white/5
                                        ${mini ? 'justify-center px-2' : ''}
                                    `}
                                >
                                    <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-all duration-200">
                                        <Building2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-300" />
                                    </div>
                                    {!mini && <span className="text-sm font-medium text-slate-300">City & Province</span>}
                                    {mini && (
                                        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                            City & Province
                                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                                        </div>
                                    )}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="mx-4 h-px bg-white/10 shrink-0" />

            {/* User & Logout */}
            <div className={`p-3 shrink-0 ${mini ? 'px-2' : ''}`}>
                <div className={`flex items-center gap-3 mb-2 p-2.5 rounded-xl bg-white/5 border border-white/10 ${mini ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-md shrink-0">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    {!mini && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-200 truncate">{auth?.user?.name}</p>
                            <p className="text-[10px] text-slate-500">Administrator</p>
                        </div>
                    )}
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to logout?')) {
                        router.post(route('logout'));
                    }
                }}>
                    <button
                        type="submit"
                        title={mini ? 'Logout' : undefined}
                        className={`
                            flex items-center gap-2 px-3 py-2 text-xs text-red-400
                            hover:text-white hover:bg-gradient-to-r hover:from-red-400 hover:to-rose-500
                            border border-red-100 hover:border-transparent
                            rounded-xl w-full transition-all duration-200 font-semibold shadow-sm
                            ${mini ? 'justify-center px-2' : 'justify-center'}
                        `}
                    >
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                        {!mini && <span>Logout</span>}
                    </button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-950">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Desktop Sidebar */}
            <aside className={`
                hidden lg:flex flex-col shrink-0
                transition-all duration-300 ease-in-out
                ${collapsed ? 'w-16' : 'w-64'}
            `}
                style={{
                    background: '#0f172a',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
                }}
            >
                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute top-4 -right-3 z-10 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:border-emerald-500"
                >
                    {collapsed
                        ? <PanelLeftOpen className="w-3 h-3 text-slate-400" />
                        : <PanelLeftClose className="w-3 h-3 text-slate-400" />
                    }
                </button>

                <SidebarContent mini={collapsed} />
            </aside>

            {/* Mobile Sidebar Drawer */}
            <aside className={`
                fixed lg:hidden inset-y-0 left-0 z-30 w-64 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
                style={{
                    background: '#0f172a',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
                }}
            >
                <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-white/10 z-10">
                    <X className="w-4 h-4" />
                </button>
                <SidebarContent mini={false} />
            </aside>

            <main className="flex-1 overflow-y-auto min-w-0 bg-slate-100">
                {/* Mobile top bar */}
                <div className="lg:hidden sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
                    style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-slate-400 hover:bg-white/10 transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <DaycareLogo className="w-7 h-7" />
                        <span className="font-bold text-sm text-white">{systemName}</span>
                    </div>
                </div>

                <div className="p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
            <Toast />
        </div>
    );
}
