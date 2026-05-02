import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Activity, AlertTriangle, AlertCircle, Shield, Users, Eye, Download,
    Search, Filter, RefreshCw, Calendar, MapPin, Monitor, Globe,
    ChevronDown, ChevronRight, X, Check, LogIn, LogOut, Plus, Edit, Trash2,
    FileDown, TrendingUp, TrendingDown, Clock, ArrowUpRight, ArrowDownRight,
    Smartphone, Tablet, Database
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface ActivityLog {
    id: number;
    user_id: number | null;
    user: { id: number; name: string; email: string } | null;
    action: string;
    action_type: string | null;
    model_type: string | null;
    model_id: number | null;
    description: string | null;
    properties: Record<string, any> | null;
    old_values: Record<string, any> | null;
    new_values: Record<string, any> | null;
    ip_address: string | null;
    user_agent: string | null;
    browser: string | null;
    os: string | null;
    device_type: string | null;
    country: string | null;
    city: string | null;
    is_suspicious: boolean;
    suspicion_reason: string | null;
    created_at: string;
}

interface Stats {
    total_activities: number;
    suspicious_activities: number;
    today_activities: number;
    today_suspicious: number;
    unique_users_today: number;
    failed_logins_today: number;
    yesterday_activities: number;
    activity_growth: number;
}

interface TrendData {
    date: string;
    total: number;
    suspicious: number;
}

interface ActionDistribution {
    action: string;
    count: number;
}

interface Filters {
    search: string;
    user_id: string;
    action: string;
    action_type: string;
    is_suspicious: string;
    date_from: string;
    date_to: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLinks[];
}

export default function ActivityMonitoring({
    activityLogs,
    filters,
    stats,
    suspiciousTrends,
    actionDistribution,
    recentSuspicious,
    users,
    actions,
    actionTypes,
}: {
    activityLogs: PaginatedData;
    filters: Filters;
    stats: Stats;
    suspiciousTrends: TrendData[];
    actionDistribution: ActionDistribution[];
    recentSuspicious: ActivityLog[];
    users: { id: number; name: string; email: string }[];
    actions: string[];
    actionTypes: string[];
}) {
    const [currentFilters, setCurrentFilters] = useState<Filters>(filters);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
    const [showExportModal, setShowExportModal] = useState(false);
    const [perPage, setPerPage] = useState(25);

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setCurrentFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });
        params.set('per_page', perPage.toString());
        router.get(route('admin.activity-monitoring'), Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        const emptyFilters = {
            search: '',
            user_id: '',
            action: '',
            action_type: '',
            is_suspicious: '',
            date_from: '',
            date_to: '',
        };
        setCurrentFilters(emptyFilters);
        router.get(route('admin.activity-monitoring'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('admin.activity-monitoring.export');

        const formatInput = document.createElement('input');
        formatInput.type = 'hidden';
        formatInput.name = 'format';
        formatInput.value = exportFormat;
        form.appendChild(formatInput);

        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        form.appendChild(csrfInput);

        const filtersInput = document.createElement('input');
        filtersInput.type = 'hidden';
        filtersInput.name = 'filters[search]';
        filtersInput.value = currentFilters.search;
        form.appendChild(filtersInput);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        setShowExportModal(false);
    };

    const getActionBadgeColor = (action: string) => {
        const colors: Record<string, string> = {
            login: 'bg-green-100 text-green-700 border-green-200',
            logout: 'bg-gray-100 text-gray-700 border-gray-200',
            create: 'bg-blue-100 text-blue-700 border-blue-200',
            update: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            delete: 'bg-red-100 text-red-700 border-red-200',
            view: 'bg-gray-100 text-gray-600 border-gray-200',
            export: 'bg-purple-100 text-purple-700 border-purple-200',
            failed_login: 'bg-orange-100 text-orange-700 border-orange-200',
        };
        return colors[action] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getActionIcon = (action: string) => {
        const icons: Record<string, any> = {
            login: LogIn,
            logout: LogOut,
            create: Plus,
            update: Edit,
            delete: Trash2,
            view: Eye,
            export: FileDown,
            failed_login: AlertCircle,
        };
        return icons[action] || Activity;
    };

    const getDeviceIcon = (deviceType: string | null) => {
        switch (deviceType) {
            case 'mobile': return Smartphone;
            case 'tablet': return Tablet;
            default: return Monitor;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleString('en-US'),
        };
    };

    const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span>{trend >= 0 ? '+' : ''}{trendValue || trend}% vs yesterday</span>
                        </div>
                    )}
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
        </div>
    );

    const SimpleChart = ({ data }: { data: TrendData[] }) => {
        const maxValue = Math.max(...data.map(d => Math.max(d.total, d.suspicious)), 1);

        return (
            <div className="flex items-end gap-2 h-40 px-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end gap-0.5 h-32">
                            <div
                                className="flex-1 bg-blue-400 rounded-t-sm transition-all hover:bg-blue-500"
                                style={{ height: `${(item.total / maxValue) * 100}%`, minHeight: item.total > 0 ? '4px' : '0' }}
                                title={`Total: ${item.total}`}
                            />
                            <div
                                className="flex-1 bg-red-400 rounded-t-sm transition-all hover:bg-red-500"
                                style={{ height: `${(item.suspicious / maxValue) * 100}%`, minHeight: item.suspicious > 0 ? '4px' : '0' }}
                                title={`Suspicious: ${item.suspicious}`}
                            />
                        </div>
                        <span className="text-[10px] text-gray-500">{item.date}</span>
                    </div>
                ))}
            </div>
        );
    };

    const ActionDistributionChart = ({ data }: { data: ActionDistribution[] }) => {
        const total = data.reduce((sum, item) => sum + item.count, 0) || 1;
        const maxCount = Math.max(...data.map(d => d.count), 1);

        return (
            <div className="space-y-3">
                {data.slice(0, 8).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-24 truncate capitalize">{item.action}</span>
                        <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                                style={{ width: `${(item.count / maxCount) * 100}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">{item.count}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title="Activity Monitoring" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <Shield className="w-7 h-7 text-blue-500" />
                            Activity Monitoring
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm">Track user behavior and detect anomalies</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowExportModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button
                            onClick={() => router.reload()}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Activities"
                        value={stats.total_activities.toLocaleString()}
                        icon={Activity}
                        trend={stats.activity_growth}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Suspicious Activities"
                        value={stats.suspicious_activities.toLocaleString()}
                        icon={AlertTriangle}
                        color="bg-red-500"
                    />
                    <StatCard
                        title="Today's Activities"
                        value={stats.today_activities.toLocaleString()}
                        icon={Calendar}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Failed Logins Today"
                        value={stats.failed_logins_today.toLocaleString()}
                        icon={AlertCircle}
                        color="bg-orange-500"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Suspicious Activity Trends */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                Activity Trends (Last 7 Days)
                            </h2>
                        </div>
                        <div className="mb-4 flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-sm" />
                                <span className="text-gray-600">Total</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-400 rounded-sm" />
                                <span className="text-gray-600">Suspicious</span>
                            </div>
                        </div>
                        <SimpleChart data={suspiciousTrends} />
                    </div>

                    {/* Action Distribution */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <Database className="w-5 h-5 text-purple-500" />
                                Action Distribution
                            </h2>
                        </div>
                        <ActionDistributionChart data={actionDistribution} />
                    </div>
                </div>

                {/* Recent Suspicious Activities */}
                {recentSuspicious.length > 0 && (
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-sm border border-red-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-red-800 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Recent Suspicious Activities
                            </h2>
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                {recentSuspicious.length} Alerts
                            </span>
                        </div>
                        <div className="space-y-2">
                            {recentSuspicious.slice(0, 5).map((log) => (
                                <div
                                    key={log.id}
                                    className="flex items-center gap-3 p-3 bg-white/70 rounded-lg border border-red-100 cursor-pointer hover:bg-white transition-colors"
                                    onClick={() => setSelectedLog(log)}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {log.user?.name || 'Unknown User'} - {log.description || log.action}
                                        </p>
                                        <p className="text-xs text-red-600">
                                            {log.suspicion_reason}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs text-gray-500">{formatDate(log.created_at).time}</p>
                                        <p className="text-xs text-gray-400">{log.ip_address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        placeholder="Search activities..."
                                        value={currentFilters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                    {showFilters ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">User</label>
                                    <select
                                        value={currentFilters.user_id}
                                        onChange={(e) => handleFilterChange('user_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm mt-1"
                                    >
                                        <option value="">All Users</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Action</label>
                                    <select
                                        value={currentFilters.action}
                                        onChange={(e) => handleFilterChange('action', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm mt-1"
                                    >
                                        <option value="">All Actions</option>
                                        {actions.map(action => (
                                            <option key={action} value={action} className="capitalize">{action}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                                    <select
                                        value={currentFilters.is_suspicious}
                                        onChange={(e) => handleFilterChange('is_suspicious', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm mt-1"
                                    >
                                        <option value="">All Activities</option>
                                        <option value="1">Suspicious Only</option>
                                        <option value="0">Normal Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Date Range</label>
                                    <div className="flex gap-2 mt-1">
                                        <input
                                            type="date"
                                            value={currentFilters.date_from}
                                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                        <input
                                            type="date"
                                            value={currentFilters.date_to}
                                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                            <button onClick={applyFilters} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:shadow-md transition-all">
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Activity Logs Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP / Device</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {activityLogs.data.map((log) => {
                                    const ActionIcon = getActionIcon(log.action);
                                    const DeviceIcon = getDeviceIcon(log.device_type);
                                    return (
                                        <tr
                                            key={log.id}
                                            className={`cursor-pointer transition-colors ${
                                                log.is_suspicious
                                                    ? 'bg-red-50 hover:bg-red-100'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => setSelectedLog(log)}
                                        >
                                            <td className="px-4 py-3">
                                                {log.is_suspicious ? (
                                                    <div className="relative">
                                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                    </div>
                                                ) : (
                                                    <Check className="w-5 h-5 text-green-500" />
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                        log.is_suspicious ? 'bg-red-100' : 'bg-gray-100'
                                                    }`}>
                                                        <ActionIcon className={`w-4 h-4 ${
                                                            log.is_suspicious ? 'text-red-500' : 'text-gray-500'
                                                        }`} />
                                                    </div>
                                                    <span className={`${getActionBadgeColor(log.action)} px-2 py-0.5 rounded-full text-xs font-medium border capitalize`}>
                                                        {log.action}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-900">
                                                        {log.user?.name || 'Unknown'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {log.user?.email || `ID: ${log.user_id}`}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-600 max-w-xs truncate">
                                                    {log.description || log.action_type || '-'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm">
                                                        <p className="font-mono text-gray-700">{log.ip_address || '-'}</p>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <DeviceIcon className="w-3 h-3" />
                                                            <span>{log.browser || 'Unknown'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {log.city || log.country ? (
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span>{[log.city, log.country].filter(Boolean).join(', ')}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">Unknown</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm">
                                                    <p className="text-gray-700">{formatDate(log.created_at).date}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(log.created_at).time}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {activityLogs.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                                            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p>No activity logs found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    applyFilters();
                                }}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value={10}>10 per page</option>
                                <option value={25}>25 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                            </select>
                            <span className="text-sm text-gray-500">
                                Showing {activityLogs.from} to {activityLogs.to} of {activityLogs.total} entries
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            {activityLogs.links.map((link, index) => (
                                link.url ? (
                                    <button
                                        key={index}
                                        onClick={() => router.get(link.url!)}
                                        className={`px-3 py-1.5 rounded-lg text-sm ${
                                            link.active
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 rounded-lg text-sm bg-gray-50 text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-500" />
                                Activity Details
                            </h3>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Status Banner */}
                            <div className={`p-4 rounded-xl ${
                                selectedLog.is_suspicious
                                    ? 'bg-red-50 border border-red-200'
                                    : 'bg-green-50 border border-green-200'
                            }`}>
                                <div className="flex items-center gap-3">
                                    {selectedLog.is_suspicious ? (
                                        <>
                                            <AlertTriangle className="w-6 h-6 text-red-500" />
                                            <div>
                                                <p className="font-semibold text-red-800">Suspicious Activity Detected</p>
                                                <p className="text-sm text-red-600">{selectedLog.suspicion_reason}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-6 h-6 text-green-500" />
                                            <div>
                                                <p className="font-semibold text-green-800">Normal Activity</p>
                                                <p className="text-sm text-green-600">No anomalies detected</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Action</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`${getActionBadgeColor(selectedLog.action)} px-2 py-0.5 rounded-full text-xs font-medium border capitalize`}>
                                            {selectedLog.action}
                                        </span>
                                        {selectedLog.action_type && (
                                            <span className="text-sm text-gray-600 capitalize">{selectedLog.action_type}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Timestamp</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDate(selectedLog.created_at).full}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">User</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedLog.user?.name || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-gray-500">{selectedLog.user?.email || `User ID: ${selectedLog.user_id}`}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
                                    <p className="text-sm text-gray-700">{selectedLog.description || '-'}</p>
                                </div>
                            </div>

                            {/* Network & Device Info */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Monitor className="w-4 h-4" />
                                    Network & Device Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">IP Address</p>
                                        <p className="text-sm font-mono text-gray-900">{selectedLog.ip_address || 'Unknown'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                                        <p className="text-sm text-gray-700">
                                            {[selectedLog.city, selectedLog.country].filter(Boolean).join(', ') || 'Unknown'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Browser</p>
                                        <p className="text-sm text-gray-700">{selectedLog.browser || 'Unknown'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Operating System</p>
                                        <p className="text-sm text-gray-700">{selectedLog.os || 'Unknown'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Device Type</p>
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const DeviceIcon = getDeviceIcon(selectedLog.device_type);
                                                return (
                                                    <>
                                                        <DeviceIcon className="w-4 h-4 text-gray-500" />
                                                        <span className="text-sm text-gray-700 capitalize">{selectedLog.device_type || 'Unknown'}</span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">User Agent</p>
                                        <p className="text-xs text-gray-600 font-mono truncate" title={selectedLog.user_agent || ''}>
                                            {selectedLog.user_agent || 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Properties */}
                            {selectedLog.properties && Object.keys(selectedLog.properties).length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Database className="w-4 h-4" />
                                        Additional Properties
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <pre className="text-xs text-gray-700 overflow-x-auto">
                                            {JSON.stringify(selectedLog.properties, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Old/New Values for Updates */}
                            {(selectedLog.old_values || selectedLog.new_values) && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Change Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedLog.old_values && (
                                            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                                <p className="text-xs text-red-600 uppercase tracking-wide mb-2 font-semibold">Old Values</p>
                                                <pre className="text-xs text-gray-700 overflow-x-auto">
                                                    {JSON.stringify(selectedLog.old_values, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                        {selectedLog.new_values && (
                                            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                                <p className="text-xs text-green-600 uppercase tracking-wide mb-2 font-semibold">New Values</p>
                                                <pre className="text-xs text-gray-700 overflow-x-auto">
                                                    {JSON.stringify(selectedLog.new_values, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Download className="w-5 h-5 text-blue-500" />
                                Export Activity Logs
                            </h3>
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Export Format</label>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    {(['csv', 'json'] as const).map(format => (
                                        <button
                                            key={format}
                                            type="button"
                                            onClick={() => setExportFormat(format)}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                exportFormat === format
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    exportFormat === format
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {format === 'csv' ? <FileDown className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold text-sm uppercase ${
                                                        exportFormat === format ? 'text-blue-700' : 'text-gray-700'
                                                    }`}>
                                                        {format.toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> The export will include all activity logs matching your current filters.
                                </p>
                            </div>

                            <div className="flex gap-2 justify-end">
                            <button
                                    type="button"
                                    onClick={() => setShowExportModal(false)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleExport}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-md transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    Export {exportFormat.toUpperCase()}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}