import ParentLayout from '@/layouts/parent-layout';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Plus, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function Appointments({ appointments, children }: any) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        child_id: '',
        appointment_type: 'checkup',
        parent_notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('parent.appointments.store'), {
            onSuccess: () => { reset(); setShowForm(false); },
        });
    };

    const statusColor: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        scheduled: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <ParentLayout>
            <Head title="Appointments" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Appointments</h1>
                        <p className="text-gray-500 mt-1 text-sm">Request and track checkup appointments</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Request Appointment
                    </button>
                </div>

                {/* Request Form */}
                {showForm && (
                    <div className="bg-white/70 backdrop-blur rounded-xl border border-white/80 shadow-sm p-5">
                        <h2 className="text-base font-semibold text-gray-800 mb-4">New Appointment Request</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Child</label>
                                    <select
                                        value={data.child_id}
                                        onChange={e => setData('child_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                                        required
                                    >
                                        <option value="">Select child...</option>
                                        {children.map((c: any) => (
                                            <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Type</label>
                                    <select
                                        value={data.appointment_type}
                                        onChange={e => setData('appointment_type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                                    >
                                        <option value="checkup">Checkup</option>
                                        <option value="vaccination">Vaccination</option>
                                        <option value="nutrition_assessment">Nutrition Assessment</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Notes</label>
                                <textarea
                                    value={data.parent_notes}
                                    onChange={e => setData('parent_notes', e.target.value)}
                                    rows={3}
                                    placeholder="Any concerns or notes for the doctor..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" disabled={processing} className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">
                                    {processing ? 'Submitting...' : 'Submit Request'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Appointments List */}
                {appointments.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur rounded-xl border border-white/80 p-12 text-center">
                        <MessageCircle className="w-12 h-12 text-purple-200 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No appointments yet</p>
                        <p className="text-gray-400 text-sm mt-1">Request your first appointment above</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {appointments.map((apt: any) => (
                            <div key={apt.id} className="bg-white/70 backdrop-blur rounded-xl border border-white/80 shadow-sm p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm">
                                            {apt.child?.first_name} {apt.child?.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize mt-0.5">
                                            {apt.appointment_type?.replace('_', ' ')}
                                        </p>
                                        {apt.parent_notes && (
                                            <p className="text-xs text-gray-400 mt-1 italic">"{apt.parent_notes}"</p>
                                        )}
                                        {apt.scheduled_date && (
                                            <div className="flex flex-wrap gap-3 mt-2">
                                                <span className="flex items-center gap-1 text-xs text-blue-600">
                                                    <Calendar className="w-3 h-3" /> {apt.scheduled_date}
                                                </span>
                                                {apt.scheduled_time && (
                                                    <span className="flex items-center gap-1 text-xs text-blue-600">
                                                        <Clock className="w-3 h-3" /> {apt.scheduled_time}
                                                    </span>
                                                )}
                                                {apt.location && (
                                                    <span className="flex items-center gap-1 text-xs text-blue-600">
                                                        <MapPin className="w-3 h-3" /> {apt.location}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {apt.admin_notes && (
                                            <p className="text-xs text-purple-600 mt-1.5 bg-purple-50 px-2 py-1 rounded-lg">
                                                Admin: {apt.admin_notes}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[apt.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}
