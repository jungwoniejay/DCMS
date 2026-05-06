import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import Modal from '@/components/Modal';
import { Users, Database, Trash2, Edit, Plus, Download, RefreshCw, Phone, Building2, Settings, FileSpreadsheet, FileCode, FileJson, CheckSquare, Square, AlertTriangle, X, Megaphone } from 'lucide-react';
import { useState } from 'react';

const ic = 'w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const lc = 'block text-sm font-medium text-slate-600 mb-1';

export default function System({ users, stats, barangay_settings, provinces, cities, tables }: any) {
    const [activeTab, setActiveTab] = useState<'barangay' | 'users' | 'announcements' | 'maintenance'>(() => {
        if (typeof window !== 'undefined' && window.location.hash === '#maintenance') return 'maintenance';
        if (typeof window !== 'undefined' && window.location.hash === '#announcements') return 'announcements';
        return 'barangay';
    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [filteredCities, setFilteredCities] = useState(
        cities?.filter((c: any) => c.province_id === provinces?.find((p: any) => p.name === barangay_settings?.province)?.id) ?? []
    );

    // Export form state
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState<'csv' | 'sql' | 'json'>('sql');
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [selectAllTables, setSelectAllTables] = useState(true);
    const [showCacheConfirmModal, setShowCacheConfirmModal] = useState(false);

    const handleProvinceChange = (provinceName: string) => {
        barangayForm.setData('province', provinceName);
        barangayForm.setData('city_municipality', '');
        const province = provinces?.find((p: any) => p.name === provinceName);
        setFilteredCities(province ? cities?.filter((c: any) => c.province_id === province.id) : []);
    };

    // Barangay settings form
    const barangayForm = useForm({
        barangay_name:     barangay_settings?.barangay_name     ?? '',
        city_municipality: barangay_settings?.city_municipality ?? '',
        province:          barangay_settings?.province          ?? '',
        cdc_name:          barangay_settings?.cdc_name          ?? '',
        system_name:       barangay_settings?.system_name       ?? '',
        contact_phone:     barangay_settings?.contact_phone     ?? '',
        contact_email:     barangay_settings?.contact_email     ?? '',
        contact_address:   barangay_settings?.contact_address   ?? '',
        office_hours:      barangay_settings?.office_hours      ?? '',
    });

    // User form
    const userForm = useForm({ name: '', email: '', password: '', role: 'parent' });

    const handleSaveBarangay = (e: React.FormEvent) => {
        e.preventDefault();
        barangayForm.post(route('admin.system.barangay-settings'));
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        userForm.post(route('admin.system.users.create'), {
            onSuccess: () => { userForm.reset(); setShowCreateModal(false); },
        });
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            userForm.put(route('admin.system.users.update', editingUser.id), {
                onSuccess: () => { userForm.reset(); setEditingUser(null); },
            });
        }
    };

    const handleDeleteUser = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('admin.system.users.delete', id));
        }
    };

    const announcementForm = useForm({ title: '', message: '', scheduled_at: '', expires_at: '', display_minutes: '5' });

    const handleSendAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        announcementForm.post(route('admin.announcements.send'), {
            onSuccess: () => announcementForm.reset(),
        });
    };

    const tabs = [
        { id: 'barangay',      label: 'Barangay Settings',  icon: Building2 },
        { id: 'users',         label: 'User Management',    icon: Users },
        { id: 'announcements', label: 'Announcements',      icon: Megaphone },
        { id: 'maintenance',   label: 'System Maintenance', icon: Settings },
    ];

    const inputClass = ic;

    // Table selection handlers
    const handleSelectAllTables = () => {
        if (selectAllTables) {
            setSelectedTables([]);
            setSelectAllTables(false);
        } else {
            setSelectedTables(tables || []);
            setSelectAllTables(true);
        }
    };

    const handleToggleTable = (tableName: string) => {
        if (selectedTables.includes(tableName)) {
            setSelectedTables(selectedTables.filter(t => t !== tableName));
            setSelectAllTables(false);
        } else {
            setSelectedTables([...selectedTables, tableName]);
            if (selectedTables.length + 1 === tables?.length) {
                setSelectAllTables(true);
            }
        }
    };

    // Export handlers
    const handleOpenExportModal = () => {
        setSelectedTables(tables || []);
        setSelectAllTables(true);
        setShowExportModal(true);
    };

    const handleExport = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTables.length === 0) {
            alert('Please select at least one table to export.');
            return;
        }
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('admin.system.export');
        
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

        selectedTables.forEach(table => {
            const tableInput = document.createElement('input');
            tableInput.type = 'hidden';
            tableInput.name = 'tables[]';
            tableInput.value = table;
            form.appendChild(tableInput);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        setShowExportModal(false);
    };

    const handleClearCache = () => {
        router.post(route('admin.system.clear-cache'));
        setShowCacheConfirmModal(false);
    };

    const getFormatIcon = (format: string) => {
        switch (format) {
            case 'csv': return FileSpreadsheet;
            case 'sql': return FileCode;
            case 'json': return FileJson;
            default: return FileSpreadsheet;
        }
    };

    const getFormatDescription = (format: string) => {
        switch (format) {
            case 'csv': return 'Comma-separated values - Best for spreadsheets and data analysis';
            case 'sql': return 'SQL format - Best for database restoration and migrations';
            case 'json': return 'JSON format - Best for API integration and web applications';
            default: return '';
        }
    };

    return (
        <AdminLayout>
            <Head title="System Administration" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">System Administration</h1>
                    <p className="text-slate-500 mt-1 text-sm">Manage barangay info, users, and system maintenance</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Users',   value: stats?.total_users   ?? 0, color: 'bg-blue-500' },
                        { label: 'Admin Users',   value: stats?.admin_users   ?? 0, color: 'bg-purple-500' },
                        { label: 'Parent Users',  value: stats?.parent_users  ?? 0, color: 'bg-green-500' },
                        { label: 'Total Records', value: stats?.total_records ?? 0, color: 'bg-orange-500' },
                    ].map(s => (
                        <div key={s.label} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                                <p className="text-xs text-slate-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* Barangay Settings Tab */}
                        {activeTab === 'barangay' && (
                            <form onSubmit={handleSaveBarangay} className="space-y-5 max-w-2xl">
                                <div>
                                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" /> Barangay Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={lc}>Barangay Name *</label>
                                            <input value={barangayForm.data.barangay_name} onChange={e => barangayForm.setData('barangay_name', e.target.value)} className={ic} required />
                                        </div>
                                        <div>
                                            <label className={lc}>System Name *</label>
                                            <input value={barangayForm.data.system_name} onChange={e => barangayForm.setData('system_name', e.target.value)} className={ic} required />
                                        </div>
                                        <div>
                                            <label className={lc}>City / Municipality *</label>
                                            <select value={barangayForm.data.city_municipality} onChange={e => barangayForm.setData('city_municipality', e.target.value)} className={ic} required>
                                                <option value="">Select City...</option>
                                                {filteredCities.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                {barangayForm.data.city_municipality && !filteredCities.find((c: any) => c.name === barangayForm.data.city_municipality) && (
                                                    <option value={barangayForm.data.city_municipality}>{barangayForm.data.city_municipality}</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={lc}>Province *</label>
                                            <select value={barangayForm.data.province} onChange={e => handleProvinceChange(e.target.value)} className={ic} required>
                                                <option value="">Select Province...</option>
                                                {provinces?.map((p: any) => <option key={p.id} value={p.name}>{p.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={lc}>CDC Name *</label>
                                            <input value={barangayForm.data.cdc_name} onChange={e => barangayForm.setData('cdc_name', e.target.value)} className={ic} required />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Contact Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={lc}>Phone Number</label>
                                            <input value={barangayForm.data.contact_phone} onChange={e => barangayForm.setData('contact_phone', e.target.value)} className={ic} placeholder="+63 912 345 6789" />
                                        </div>
                                        <div>
                                            <label className={lc}>Email Address</label>
                                            <input type="email" value={barangayForm.data.contact_email} onChange={e => barangayForm.setData('contact_email', e.target.value)} className={ic} placeholder="cdc@barangay.gov.ph" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={lc}>Address</label>
                                            <input value={barangayForm.data.contact_address} onChange={e => barangayForm.setData('contact_address', e.target.value)} className={ic} placeholder="Barangay Hall, ..." />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={lc}>Office Hours</label>
                                            <input value={barangayForm.data.office_hours} onChange={e => barangayForm.setData('office_hours', e.target.value)} className={ic} placeholder="Monday - Friday, 8:00 AM - 5:00 PM" />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={barangayForm.processing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50">
                                    {barangayForm.processing ? 'Saving...' : 'Save Barangay Settings'}
                                </button>
                            </form>
                        )}

                        {/* User Management Tab */}
                        {activeTab === 'users' && (
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all">
                                        <Plus className="w-4 h-4" /> Create User
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {['Name','Email','Role','Created','Actions'].map(h => (
                                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {users?.data?.map((user: any) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingUser(user); userForm.setData({ name: user.name, email: user.email, password: '', role: user.role }); }} className="text-blue-500 hover:text-blue-700">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Announcements Tab */}
                        {activeTab === 'announcements' && (
                            <div className="max-w-xl space-y-5">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                                        <Megaphone className="w-4 h-4" /> Send Announcement to All Parents
                                    </h2>
                                    <p className="text-xs text-slate-400">This will appear on every parent's notification feed.</p>
                                </div>
                                <form onSubmit={handleSendAnnouncement} className="space-y-4">
                                    <div>
                                        <label className={lc}>Title *</label>
                                        <input value={announcementForm.data.title} onChange={e => announcementForm.setData('title', e.target.value)}
                                            className={ic} placeholder="e.g. School Holiday Notice" required />
                                        {announcementForm.errors.title && <p className="text-red-500 text-xs mt-1">{announcementForm.errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className={lc}>Message *</label>
                                        <textarea value={announcementForm.data.message} onChange={e => announcementForm.setData('message', e.target.value)}
                                            className={`${ic} resize-none`} rows={4} placeholder="Write your announcement here..." required />
                                        {announcementForm.errors.message && <p className="text-red-500 text-xs mt-1">{announcementForm.errors.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div>
                                            <label className={lc}>Schedule Date & Time <span className="text-slate-400 font-normal">(optional)</span></label>
                                            <input type="datetime-local" value={announcementForm.data.scheduled_at}
                                                onChange={e => announcementForm.setData('scheduled_at', e.target.value)}
                                                className={ic} />
                                            <p className="text-[10px] text-slate-400 mt-1">Leave blank to send immediately</p>
                                            {announcementForm.errors.scheduled_at && <p className="text-red-500 text-xs mt-1">{announcementForm.errors.scheduled_at}</p>}
                                        </div>
                                        <div>
                                            <label className={lc}>Expiry Date & Time <span className="text-slate-400 font-normal">(optional)</span></label>
                                            <input type="datetime-local" value={announcementForm.data.expires_at}
                                                onChange={e => announcementForm.setData('expires_at', e.target.value)}
                                                className={ic} />
                                            <p className="text-[10px] text-slate-400 mt-1">Banner hides from parents after this time</p>
                                            {announcementForm.errors.expires_at && <p className="text-red-500 text-xs mt-1">{announcementForm.errors.expires_at}</p>}
                                        </div>
                                        <div>
                                            <label className={lc}>Banner Display Duration (minutes)</label>
                                            <input type="number" min="1" max="60" value={announcementForm.data.display_minutes}
                                                onChange={e => announcementForm.setData('display_minutes', e.target.value)}
                                                className={ic} />
                                            <p className="text-[10px] text-slate-400 mt-1">How long the ticker stays visible per session</p>
                                            {announcementForm.errors.display_minutes && <p className="text-red-500 text-xs mt-1">{announcementForm.errors.display_minutes}</p>}
                                        </div>
                                    </div>
                                    <button type="submit" disabled={announcementForm.processing}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50">
                                        <Megaphone className="w-4 h-4" />
                                        {announcementForm.processing ? 'Sending...' : 'Send to All Parents'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* System Maintenance Tab */}
                        {activeTab === 'maintenance' && (
                            <div className="space-y-6 max-w-4xl">
                                {/* Database Export Section */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <Database className="w-5 h-5 text-blue-500" />
                                                Database Export
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Export your database for backup or migration purposes
                                            </p>
                                        </div>
                                        <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                            {tables?.length || 0} Tables
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                                <Database className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700">Database Size</p>
                                                <p className="text-lg font-bold text-gray-900">{stats?.database_size ?? 'Unknown'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleOpenExportModal} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all w-full md:w-auto justify-center">
                                        <Download className="w-4 h-4" />
                                        Export Database
                                    </button>
                                </div>

                                {/* Clear Cache Section */}
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <RefreshCw className="w-5 h-5 text-amber-500" />
                                                Clear System Cache
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Clear cached data to improve system performance
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 mb-4 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            Application Cache
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            Configuration Cache
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            Route Cache
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            View Cache
                                        </div>
                                    </div>

                                    <button onClick={() => setShowCacheConfirmModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 text-sm font-semibold transition-all w-full md:w-auto justify-center">
                                        <RefreshCw className="w-4 h-4" />
                                        Clear Cache
                                    </button>
                                </div>

                                {/* System Information */}
                                <div className="bg-white rounded-xl p-6 border border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-gray-500" />
                                        System Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Users</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats?.total_users ?? 0}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Records</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats?.total_records ?? 0}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Admin Users</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats?.admin_users ?? 0}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Parent Users</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats?.parent_users ?? 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create User Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New User">
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <div><label className={lc}>Name</label><input value={userForm.data.name} onChange={e => userForm.setData('name', e.target.value)} className={ic} required /></div>
                    <div><label className={lc}>Email</label><input type="email" value={userForm.data.email} onChange={e => userForm.setData('email', e.target.value)} className={ic} required /></div>
                    <div><label className={lc}>Password</label><input type="password" value={userForm.data.password} onChange={e => userForm.setData('password', e.target.value)} className={ic} required /></div>
                    <div>
                        <label className={lc}>Role</label>
                        <select value={userForm.data.role} onChange={e => userForm.setData('role', e.target.value)} className={ic}>
                            <option value="parent">Parent</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">Cancel</button>
                        <button type="submit" disabled={userForm.processing} className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold disabled:opacity-50 transition-all">{userForm.processing ? 'Creating...' : 'Create'}</button>
                    </div>
                </form>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={!!editingUser} onClose={() => setEditingUser(null)} title="Edit User">
                <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div><label className={lc}>Name</label><input value={userForm.data.name} onChange={e => userForm.setData('name', e.target.value)} className={ic} required /></div>
                    <div><label className={lc}>Email</label><input type="email" value={userForm.data.email} onChange={e => userForm.setData('email', e.target.value)} className={ic} required /></div>
                    <div><label className={lc}>Password <span className="text-slate-400 font-normal">(leave blank to keep)</span></label><input type="password" value={userForm.data.password} onChange={e => userForm.setData('password', e.target.value)} className={ic} /></div>
                    <div>
                        <label className={lc}>Role</label>
                        <select value={userForm.data.role} onChange={e => userForm.setData('role', e.target.value)} className={ic}>
                            <option value="parent">Parent</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">Cancel</button>
                        <button type="submit" disabled={userForm.processing} className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold disabled:opacity-50 transition-all">{userForm.processing ? 'Updating...' : 'Update'}</button>
                    </div>
                </form>
            </Modal>

            {/* Export Database Modal */}
            <Modal show={showExportModal} onClose={() => setShowExportModal(false)} title="Export Database" maxWidth="2xl">
                <form onSubmit={handleExport} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Export Format</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                            {(['csv', 'sql', 'json'] as const).map(format => {
                                const Icon = getFormatIcon(format);
                                return (
                                    <button key={format} type="button" onClick={() => setExportFormat(format)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                                            exportFormat === format ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                exportFormat === format ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                                            }`}><Icon className="w-5 h-5" /></div>
                                            <p className={`font-semibold text-sm uppercase ${exportFormat === format ? 'text-blue-700' : 'text-gray-700'}`}>{format}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">{getFormatDescription(format)}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-slate-700">Select Tables</label>
                            <button type="button" onClick={handleSelectAllTables} className="text-sm text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1">
                                {selectAllTables ? <><CheckSquare className="w-4 h-4" /> Deselect All</> : <><Square className="w-4 h-4" /> Select All</>}
                            </button>
                        </div>
                        <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                            {tables?.map((table: string) => (
                                <label key={table} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                                    <input type="checkbox" checked={selectedTables.includes(table)} onChange={() => handleToggleTable(table)} className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                                    <span className="text-sm font-mono text-gray-700">{table}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{selectedTables.length} table(s) selected</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-800">Export Notice</p>
                            <p className="text-xs text-amber-700 mt-1">The export will include all data from the selected tables. Please store the exported file securely as it contains sensitive information.</p>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setShowExportModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">Cancel</button>
                        <button type="submit" disabled={selectedTables.length === 0} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold disabled:opacity-50 transition-all">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Clear Cache Confirmation Modal */}
            <Modal show={showCacheConfirmModal} onClose={() => setShowCacheConfirmModal(false)} title="Clear System Cache?">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                        </div>
                        <p className="text-sm text-gray-600">This will clear application, configuration, route, and view caches. This action cannot be undone.</p>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setShowCacheConfirmModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">Cancel</button>
                        <button type="button" onClick={handleClearCache} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:shadow-md transition-all">
                            <RefreshCw className="w-4 h-4" /> Yes, Clear Cache
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}