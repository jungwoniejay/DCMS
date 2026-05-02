import AdminLayout from '@/layouts/admin-layout';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Appointment {
  id: number;
  child: { id: number; first_name: string; last_name: string; };
  requested_by: { name: string; };
  appointment_type: string;
  parent_notes: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  location: string | null;
  admin_notes: string | null;
  status: string;
  created_at: string;
}

interface Props {
  appointments: {
    data: Appointment[];
    current_page: number;
    last_page: number;
  };
}

export default function Appointments({ appointments }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    scheduled_date: '',
    scheduled_time: '',
    location: '',
    admin_notes: '',
  });

  const handleSchedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const submitSchedule = () => {
    if (!selectedAppointment) return;
    
    router.post(`/admin/appointments/${selectedAppointment.id}/schedule`, formData, {
      onSuccess: () => {
        setShowModal(false);
        setFormData({ scheduled_date: '', scheduled_time: '', location: '', admin_notes: '' });
      }
    });
  };

  const handleComplete = (id: number) => {
    if (confirm('Mark this appointment as completed?')) {
      router.post(`/admin/appointments/${id}/complete`);
    }
  };

  const handleCancel = (id: number) => {
    if (confirm('Cancel this appointment?')) {
      router.post(`/admin/appointments/${id}/cancel`);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Appointment Requests</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage checkup and vaccination appointments</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Child</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.data.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {appointment.child.first_name} {appointment.child.last_name}
                      </div>
                      {appointment.parent_notes && (
                        <div className="text-sm text-gray-500 mt-1">{appointment.parent_notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{appointment.requested_by.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm capitalize">{appointment.appointment_type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {appointment.scheduled_date ? (
                        <div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {appointment.scheduled_date}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-4 h-4" />
                            {appointment.scheduled_time}
                          </div>
                          {appointment.location && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <MapPin className="w-4 h-4" />
                              {appointment.location}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not scheduled</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleSchedule(appointment)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Schedule
                          </button>
                        )}
                        {appointment.status === 'scheduled' && (
                          <button
                            onClick={() => handleComplete(appointment.id)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Complete
                          </button>
                        )}
                        {(appointment.status === 'pending' || appointment.status === 'scheduled') && (
                          <button
                            onClick={() => handleCancel(appointment.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Schedule Appointment</h3>
              
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="font-medium">{selectedAppointment.child.first_name} {selectedAppointment.child.last_name}</p>
                <p className="text-sm text-gray-600 capitalize">{selectedAppointment.appointment_type.replace('_', ' ')}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Barangay Health Center"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.admin_notes}
                    onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={submitSchedule}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Schedule
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
