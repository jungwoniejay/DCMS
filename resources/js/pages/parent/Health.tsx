import ParentLayout from '@/layouts/parent-layout';
import { Syringe, AlertTriangle, Pill, Calendar, X, Send } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface HealthData {
  child_id: number;
  child_name: string;
  age: number;
  vaccinations: {
    bcg: string;
    dpt: string;
    polio: string;
    hepa_b: string;
    measles: string;
    mmr: string;
  };
  next_vaccine: string;
  emergency_alert: boolean;
  emergency_description: string | null;
  health_problems: any[];
  medications: any[];
  appointments: any[];
}

interface Props {
  healthData: HealthData[];
}

export default function Health({ healthData }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [appointmentType, setAppointmentType] = useState('checkup');
  const [notes, setNotes] = useState('');

  const handleScheduleCheckup = (childId: number, childName: string) => {
    setSelectedChild(childId);
    setShowModal(true);
  };

  const submitAppointment = () => {
    if (!selectedChild) return;
    
    router.post('/parent/appointments', {
      child_id: selectedChild,
      appointment_type: appointmentType,
      parent_notes: notes,
    }, {
      onSuccess: () => {
        alert('Appointment request submitted! The barangay health worker will contact you soon.');
        setShowModal(false);
        setNotes('');
        setAppointmentType('checkup');
      }
    });
  };

  const handlePrintHealthForm = () => {
    window.print();
  };

  return (
    <ParentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Health & Medical</h1>
          <p className="text-gray-600 mt-2">Track vaccinations, health conditions, and medical information</p>
        </div>

        {healthData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Syringe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No health data available.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {healthData.map((data) => (
              <div key={data.child_id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-900">{data.child_name}</h2>
                  <p className="text-gray-600">{data.age} years old</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Syringe className="w-5 h-5 text-green-500" />
                        Vaccination Record
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(data.vaccinations).map(([vaccine, status]) => (
                          <div key={vaccine} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700">{vaccine.toUpperCase()}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              status === 'Yes' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {status}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">Next Vaccine Due</span>
                        </div>
                        <p className="text-blue-800">{data.next_vaccine}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Health Alerts & Conditions
                      </h3>

                      {data.emergency_alert ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <p className="font-semibold text-red-900 mb-2">⚠️ Emergency Action Required</p>
                          <p className="text-red-800">{data.emergency_description}</p>
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <p className="text-green-800">✓ No emergency alerts</p>
                        </div>
                      )}

                      {data.health_problems.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">Health Problems</h4>
                          <div className="space-y-2">
                            {data.health_problems.map((problem: any, idx: number) => (
                              <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-900">{problem.problem_type}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.medications.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Pill className="w-4 h-4" />
                            Current Medications
                          </h4>
                          <div className="space-y-2">
                            {data.medications.map((med: any, idx: number) => (
                              <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="font-medium text-gray-900">{med.medication_name}</p>
                                <p className="text-sm text-gray-600">{med.dosage}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 print:hidden">
                    <button 
                      onClick={() => handleScheduleCheckup(data.child_id, data.child_name)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Schedule Checkup
                    </button>
                    <button 
                      onClick={handlePrintHealthForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Print Health Form
                    </button>
                  </div>

                  {/* Scheduled Appointments */}
                  {data.appointments && data.appointments.length > 0 && (
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Your Appointments
                      </h3>
                      <div className="space-y-3">
                        {data.appointments.map((apt: any, idx: number) => (
                          <div key={idx} className={`p-4 rounded-lg border ${
                            apt.status === 'scheduled' ? 'bg-blue-50 border-blue-200' :
                            apt.status === 'completed' ? 'bg-green-50 border-green-200' :
                            apt.status === 'cancelled' ? 'bg-red-50 border-red-200' :
                            'bg-yellow-50 border-yellow-200'
                          }`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                                    apt.status === 'scheduled' ? 'bg-blue-600 text-white' :
                                    apt.status === 'completed' ? 'bg-green-600 text-white' :
                                    apt.status === 'cancelled' ? 'bg-red-600 text-white' :
                                    'bg-yellow-600 text-white'
                                  }`}>
                                    {apt.status}
                                  </span>
                                  <span className="text-sm font-medium text-gray-700 capitalize">
                                    {apt.appointment_type.replace('_', ' ')}
                                  </span>
                                </div>
                                {apt.status === 'scheduled' && (
                                  <div className="space-y-1 text-sm">
                                    <p className="font-semibold text-gray-900">
                                      📅 {apt.scheduled_date} at {apt.scheduled_time}
                                    </p>
                                    <p className="text-gray-700">📍 {apt.location}</p>
                                    {apt.admin_notes && (
                                      <p className="text-gray-600 italic">Note: {apt.admin_notes}</p>
                                    )}
                                  </div>
                                )}
                                {apt.status === 'pending' && (
                                  <p className="text-sm text-gray-600">Waiting for admin to schedule...</p>
                                )}
                                {apt.status === 'completed' && (
                                  <p className="text-sm text-gray-600">Completed on {apt.scheduled_date}</p>
                                )}
                                {apt.status === 'cancelled' && (
                                  <p className="text-sm text-gray-600">This appointment was cancelled</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Schedule Appointment</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Submit a checkup appointment request</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Appointment Type</label>
                  <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-100 rounded-xl bg-white/80 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  >
                    <option value="checkup">General Checkup</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="nutrition_assessment">Nutrition Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Notes <span className="text-slate-400 normal-case font-normal">(Optional)</span></label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Any specific concerns or requests..."
                    className="w-full px-3 py-2 border border-purple-100 rounded-xl bg-white/80 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={submitAppointment}
                    className="inline-flex items-center gap-2 flex-1 justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Submit Request
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:hidden { display: none !important; }
          @page { margin: 2cm; }
        }
      `}</style>
    </ParentLayout>
  );
}
