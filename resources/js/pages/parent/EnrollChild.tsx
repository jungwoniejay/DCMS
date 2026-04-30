import ParentLayout from '@/layouts/parent-layout';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function EnrollChild({ puroks }: { puroks: string[] }) {
  const { data, setData, post, processing, errors } = useForm({
    child_last_name: '',
    child_first_name: '',
    child_middle_name: '',
    child_sex: 'Male',
    child_birthdate: '',
    child_age: '',
    child_address: '',
    child_first_language: 'Tagalog',
    child_second_language: '',
    purok_zone: '',
    father_name: '',
    father_occupation: '',
    mother_name: '',
    mother_occupation: '',
    guardian_contact: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to submit this enrollment request?')) return;
    post(route('parent.enroll.store'));
  };

  return (
    <ParentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enroll New Child</h1>
          <p className="text-gray-600 mt-2">Submit enrollment request for your child. Admin approval required.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Child Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={data.child_last_name}
                    onChange={e => setData('child_last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.child_last_name && <p className="text-red-600 text-sm mt-1">{errors.child_last_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={data.child_first_name}
                    onChange={e => setData('child_first_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.child_first_name && <p className="text-red-600 text-sm mt-1">{errors.child_first_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={data.child_middle_name}
                    onChange={e => setData('child_middle_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sex *</label>
                  <select
                    value={data.child_sex}
                    onChange={e => setData('child_sex', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate *</label>
                  <input
                    type="date"
                    value={data.child_birthdate}
                    onChange={e => setData('child_birthdate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                  <input
                    type="number"
                    value={data.child_age}
                    onChange={e => setData('child_age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="10"
                    required
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <textarea
                    value={data.child_address}
                    onChange={e => setData('child_address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Language *</label>
                  <input
                    type="text"
                    value={data.child_first_language}
                    onChange={e => setData('child_first_language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Second Language</label>
                  <input
                    type="text"
                    value={data.child_second_language}
                    onChange={e => setData('child_second_language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purok/Zone *</label>
                  <select
                    value={data.purok_zone}
                    onChange={e => setData('purok_zone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Purok/Zone...</option>
                    {puroks.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.purok_zone && <p className="text-red-600 text-sm mt-1">{errors.purok_zone}</p>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Parent Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={data.father_name}
                    onChange={e => setData('father_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
                  <input
                    type="text"
                    value={data.father_occupation}
                    onChange={e => setData('father_occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={data.mother_name}
                    onChange={e => setData('mother_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Occupation</label>
                  <input
                    type="text"
                    value={data.mother_occupation}
                    onChange={e => setData('mother_occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Contact *</label>
                  <input
                    type="text"
                    value={data.guardian_contact}
                    onChange={e => setData('guardian_contact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name *</label>
                  <input
                    type="text"
                    value={data.emergency_contact_name}
                    onChange={e => setData('emergency_contact_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone *</label>
                  <input
                    type="text"
                    value={data.emergency_contact_phone}
                    onChange={e => setData('emergency_contact_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'Submitting...' : 'Submit Enrollment Request'}
            </button>
            <a
              href="/parent/dashboard"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </ParentLayout>
  );
}
