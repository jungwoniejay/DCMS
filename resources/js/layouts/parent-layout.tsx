import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard, Baby, ClipboardList,
    MessageCircle, LogOut, User, Menu, X,
    PanelLeftClose, PanelLeftOpen, Stethoscope, BookOpen
} from 'lucide-react';
import DaycareLogo from '@/components/daycare-logo';
import { ReactNode } from 'react';
import Toast from '@/components/toast';

const menuGroups = [
    {
        label: 'Main',
        items: [
            { name: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        label: 'My Child',
        items: [
            { name: 'My Children', href: '/parent/my-children', icon: Baby },
            { name: 'Health', href: '/parent/health', icon: Stethoscope },
            { name: 'Development', href: '/parent/nutrition', icon: BookOpen },
        ],
    },
    {
        label: 'Requests',
        items: [
            { name: 'Requests', href: '/parent/enrollment-requests', icon: ClipboardList },
        ],
    },
    {
        label: 'Communication',
        items: [
            { name: 'Messages', href: '/parent/appointments', icon: MessageCircle },
        ],
    },
];

interface ParentLayoutProps {
    children: ReactNode;
}

export default function ParentLayout({ children }: ParentLayoutProps) {
    const { auth } = usePage().props as any;
    const { url } = usePage();
    const barangay = (usePage().props as any).barangay ?? {};
    const systemName = barangay.system_name || 'KidCare Hinoba-an';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (href: string) => url.startsWith(href);

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            router.post(route('logout'));
        }
    };

    const NavItem = ({ item, mini }: { item: any; mini: boolean }) => {
        const active = isActive(item.href);
        return (
            <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                title={mini ? item.name : undefined}
                className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 ease-in-out group
                    ${mini ? 'justify-center px-2' : ''}
                    ${active
                        ? 'bg-gradient-to-r from-sky-400/20 to-teal-400/20 text-teal-700'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/70'
                    }
                `}
            >
                {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-sky-400 to-teal-500 rounded-r-full" />
                )}
                <div className={`
                    shrink-0 w-8 h-8 flex items-center justify-center rounded-xl
                    transition-all duration-200
                    ${active
                        ? 'bg-gradient-to-br from-sky-400 to-teal-500 shadow-md shadow-teal-200'
                        : 'bg-white/80 group-hover:bg-white group-hover:shadow-sm group-hover:-translate-y-0.5'
                    }
                `}>
                    <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'}`} />
                </div>
                {!mini && (
                    <span className={`text-sm font-medium ${active ? 'text-teal-700' : ''}`}>
                        {item.name}
                    </span>
                )}
                {mini && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        {item.name}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                    </div>
                )}
            </Link>
        );
    };

    const SidebarContent = ({ mini = false }: { mini?: boolean }) => (
        <div className="flex flex-col h-full">
            <div className={`shrink-0 p-4 ${mini ? 'px-2' : ''}`}>
                <div className={`flex items-center gap-3 ${mini ? 'justify-center' : ''}`}>
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-300 to-teal-400 blur-md opacity-30 rounded-full" />
                        <DaycareLogo className="w-10 h-10 relative z-10 drop-shadow" />
                    </div>
                    {!mini && (
                        <div>
                            <h1 className="text-base font-bold bg-gradient-to-r from-sky-500 to-teal-600 bg-clip-text text-transparent leading-tight">
                                {systemName}
                            </h1>
                            <p className="text-[10px] text-slate-400 font-semibold tracking-[0.15em] uppercase">Parent Portal</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent shrink-0" />

            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
                {menuGroups.map((group) => (
                    <div key={group.label}>
                        {!mini && (
                            <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">
                                {group.label}
                            </p>
                        )}
                        {mini && <div className="mx-2 mb-1.5 h-px bg-sky-100" />}
                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <NavItem key={item.name} item={item} mini={mini} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent shrink-0" />

            <div className={`p-3 shrink-0 ${mini ? 'px-2' : ''}`}>
                <div className={`flex items-center gap-3 mb-2 p-2.5 rounded-xl bg-white/60 border border-white/80 shadow-sm ${mini ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center shadow-md shrink-0">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    {!mini && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">{auth?.user?.name || 'Parent'}</p>
                            <p className="text-[10px] text-slate-400">Parent Account</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    title={mini ? 'Logout' : undefined}
                    className={`
                        flex items-center gap-2 px-3 py-2 text-xs text-red-400
                        hover:text-white hover:bg-gradient-to-r hover:from-red-400 hover:to-rose-500
                        border border-red-100 hover:border-transparent
                        rounded-xl w-full transition-all duration-200 font-semibold
                        ${mini ? 'justify-center px-2' : 'justify-center'}
                    `}
                >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    {!mini && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)' }}>
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <aside
                className={`hidden lg:flex flex-col shrink-0 relative transition-all duration-300 ease-in-out no-print ${collapsed ? 'w-16' : 'w-60'}`}
                style={{
                    background: 'rgba(255,255,255,0.70)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '4px 0 24px rgba(14,165,233,0.07)',
                }}
            >
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute top-4 -right-3 z-10 w-6 h-6 bg-white border border-sky-100 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:border-sky-300"
                >
                    {collapsed
                        ? <PanelLeftOpen className="w-3 h-3 text-sky-400" />
                        : <PanelLeftClose className="w-3 h-3 text-sky-400" />
                    }
                </button>
                <SidebarContent mini={collapsed} />
            </aside>

            <aside
                className={`fixed lg:hidden inset-y-0 left-0 z-30 w-60 flex flex-col transform transition-transform duration-300 ease-in-out no-print ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '4px 0 24px rgba(14,165,233,0.10)',
                }}
            >
                <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 z-10">
                    <X className="w-4 h-4" />
                </button>
                <SidebarContent mini={false} />
            </aside>

            <main className="flex-1 overflow-y-auto min-w-0">
                <div
                    className="lg:hidden sticky top-0 z-10 px-4 py-3 flex items-center gap-3 no-print"
                    style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.8)' }}
                >
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-slate-500 hover:bg-white/80 transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 flex-1">
                        <DaycareLogo className="w-7 h-7" />
                        <span className="font-bold text-sm bg-gradient-to-r from-sky-500 to-teal-600 bg-clip-text text-transparent">{systemName}</span>
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
