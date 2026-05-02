import AdminLayout from '@/layouts/admin-layout';
import { useForm } from '@inertiajs/react';
import { Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { useState } from 'react';

interface EnrollmentRequest {
  id: number;
  child_first_name: string;
  child_middle_name: string;
  child_last_name: string;
  child_sex: string;
  child_birthdate: string;
  child_age: number;
  child_address: string;
  child_first_language: string;
  child_second_language: string;
  child_photo: string | null;
  purok_zone: string;
  father_name: string;
  father_occupation: string;
  mother_name: string;
  mother_occupation: string;
  guardian_contact: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  parent: { name: string; email: string };
  reviewer: { name: string } | null;
}

interface Props {
  requests: {
    data: EnrollmentRequest[];
    current_page: number;
    last_page: number;
  };
  stats: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

export default function Enrollments({ requests, stats }: Props) {
  const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequest | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const { data, setData, post, processing } = useForm({ rejection_reason: '' });

  const handleApprove = (id: number) => {
    if (confirm('Approve this enrollment request? This will create a new child record.')) {
      post(route('admin.enrollments.approve', id));
    }
  };

  const handleReject = (request: EnrollmentRequest) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const submitRejection = () => {
    if (selectedRequest) {
      post(route('admin.enrollments.reject', selectedRequest.id), {
        onSuccess: () => {
          setShowRejectModal(false);
          setData('rejection_reason', '');
          setSelectedRequest(null);
        },
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Enrollment Requests</h1>
          <p className="text-slate-500 mt-1 text-sm">Review and approve parent enrollment submissions</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Pending</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Approved</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Rejected</p>
              <p className="text-3xl font-bold text-red-900 mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {requests.data.map((request) => (
          <div key={request.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {/* Child Photo */}
                {request.child_photo ? (
                  <img
                    src={`/storage/${request.child_photo}`}
                    alt={request.child_first_name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
                    <User className="w-7 h-7 text-slate-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {request.child_first_name} {request.child_middle_name} {request.child_last_name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {request.child_age} years old • {request.child_sex} • Born {request.child_birthdate}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-xs text-slate-500">
                      {request.parent.name} ({request.parent.email})
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Submitted: {new Date(request.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Purok/Zone</p>
                <p className="text-sm text-gray-600">{request.purok_zone}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Address</p>
                <p className="text-sm text-gray-600">{request.child_address}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Languages</p>
                <p className="text-sm text-gray-600">
                  {request.child_first_language}
                  {request.child_second_language && `, ${request.child_second_language}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Father</p>
                <p className="text-sm text-gray-600">
                  {request.father_name || 'N/A'}
                  {request.father_occupation && ` - ${request.father_occupation}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Mother</p>
                <p className="text-sm text-gray-600">
                  {request.mother_name || 'N/A'}
                  {request.mother_occupation && ` - ${request.mother_occupation}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Guardian Contact</p>
                <p className="text-sm text-gray-600">{request.guardian_contact}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Emergency Contact</p>
                <p className="text-sm text-gray-600">
                  {request.emergency_contact_name} - {request.emergency_contact_phone}
                </p>
              </div>
            </div>

            {request.status === 'Rejected' && request.rejection_reason && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-900">Rejection Reason:</p>
                <p className="text-sm text-red-800 mt-1">{request.rejection_reason}</p>
                {request.reviewer && (
                  <p className="text-xs text-red-700 mt-1">Reviewed by: {request.reviewer.name}</p>
                )}
              </div>
            )}

            {request.status === 'Approved' && request.reviewer && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Approved by {request.reviewer.name} on {new Date(request.reviewed_at!).toLocaleString()}
                </p>
              </div>
            )}

            {request.status === 'Pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve & Create Child Record
                </button>
                <button
                  onClick={() => handleReject(request)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reject Enrollment Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this enrollment request:
            </p>
            <textarea
              value={data.rejection_reason}
              onChange={e => setData('rejection_reason', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="e.g., Incomplete information, Age requirement not met..."
              required
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={submitRejection}
                disabled={processing || !data.rejection_reason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setData('rejection_reason', '');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
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
