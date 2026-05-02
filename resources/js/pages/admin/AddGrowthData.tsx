import AdminLayout from '@/layouts/admin-layout';
import { Ruler, Weight, Plus, Calendar } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Child {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  sex: string;
}

interface NutritionRecord {
  id: number;
  date_taken: string;
  height: number;
  weight: number;
  nutritional_status: string;
}

interface Props {
  child: Child;
  records: NutritionRecord[];
}

export default function AddGrowthData({ child, records }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date_taken: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    nutritional_status: 'Normal',
  });

  const submitData = () => {
    router.post(`/admin/children/${child.id}/growth-data`, formData, {
      onSuccess: () => {
        setShowModal(false);
        setFormData({
          date_taken: new Date().toISOString().split('T')[0],
          height: '',
          weight: '',
          nutritional_status: 'Normal',
        });
      }
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Normal': 'bg-green-100 text-green-800',
      'Underweight': 'bg-yellow-100 text-yellow-800',
      'Severely Underweight': 'bg-red-100 text-red-800',
      'Overweight': 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Growth & Nutrition Data</h1>
            <p className="text-slate-500 mt-1">{child.first_name} {child.last_name} • {child.age} years old • {child.sex}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Measurement
          </button>
        </div>

        {/* Latest Measurement */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Ruler className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-blue-900">Latest Height</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">{records[0].height} cm</p>
              <p className="text-sm text-blue-600 mt-1">{records[0].date_taken}</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Weight className="w-6 h-6 text-green-600" />
                <span className="font-semibold text-green-900">Latest Weight</span>
              </div>
              <p className="text-3xl font-bold text-green-700">{records[0].weight} kg</p>
              <p className="text-sm text-green-600 mt-1">{records[0].date_taken}</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-purple-900">Status</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(records[0].nutritional_status)}`}>
                {records[0].nutritional_status}
              </span>
            </div>
          </div>
        )}

        {/* Growth History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Growth History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Height (cm)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No measurements recorded yet. Click "Add Measurement" to start tracking.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{record.date_taken}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{record.height} cm</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{record.weight} kg</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.nutritional_status)}`}>
                          {record.nutritional_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Measurement Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Add Growth Measurement</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date_taken}
                    onChange={(e) => setFormData({ ...formData, date_taken: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="e.g., 105.5"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g., 18.5"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nutritional Status</label>
                  <select
                    value={formData.nutritional_status}
                    onChange={(e) => setFormData({ ...formData, nutritional_status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Underweight">Underweight</option>
                    <option value="Severely Underweight">Severely Underweight</option>
                    <option value="Overweight">Overweight</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={submitData}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Measurement
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
