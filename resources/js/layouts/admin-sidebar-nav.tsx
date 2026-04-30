import { Link } from '@inertiajs/react';
import {
    LayoutDashboard, Users, Heart, Apple, BookOpen, Baby,
    BarChart3, Settings, User, LogOut, ClipboardList,
    Calendar, ChevronDown, ChevronRight, MapPin,
    Shield, Stethoscope, FileText, Truck, Building2, Activity
} from 'lucide-react';

export const menuGroups = [
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

export function NavItem({ item, mini, onClose }: { item: any; mini: boolean; onClose: () => void }) {
    const currentPath = window.location.pathname;
    const active = (() => {
        try { return currentPath === route(item.route) || currentPath.startsWith(route(item.route)); }
        catch { return false; }
    })();

    return (
        <Link
            href={route(item.route)}
            onClick={onClose}
            title={mini ? item.label : undefined}
            className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 ease-in-out group
                ${mini ? 'justify-center px-2' : ''}
                ${active
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 shadow-sm shadow-blue-100'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                }
            `}
        >
            {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
            )}
            <div className={`
                shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200
                ${active
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-md shadow-blue-200'
                    : 'bg-white/80 group-hover:bg-white group-hover:shadow-sm'
                }
            `}>
                <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-500'}`} />
            </div>
            {!mini && (
                <span className={`text-sm font-medium truncate ${active ? 'text-blue-700' : ''}`}>
                    {item.label}
                </span>
            )}
            {mini && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                </div>
            )}
        </Link>
    );
}
