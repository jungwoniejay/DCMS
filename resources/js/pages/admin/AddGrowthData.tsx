import AdminLayout from '@/layouts/admin-layout';
import Modal from '@/components/Modal';
import { Ruler, Weight, Plus, Calendar } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Child { id: number; first_name: string; last_name: string; age: number; sex: string; }
interface NutritionRecord { id: number; assessment_date: string; height_first: number; weight_first: number; nutritional_status_result: string; }
interface Props { child: Child; records: NutritionRecord[]; }

const ic = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400';
const lc = 'block text-sm font-medium text-gray-700 mb-1';

export default function AddGrowthData({ child, records }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ date_taken: new Date().toISOString().split('T')[0], height: '', weight: '', nutritional_status: 'Normal' });

  const submitData = () => {
    router.post(`/admin/children/${child.id}/growth-data`, formData, {
      onSuccess: () => { setShowModal(false); setFormData({ date_taken: new Date().toISOString().split('T')[0], height: '', weight: '', nutritional_status: 'Normal' }); }
    });
  };

  const getStatusColor = (status: string) => ({ 'Normal': 'bg-green-100 text-green-800', 'Underweight': 'bg-yellow-100 text-yellow-800', 'Severely Underweight': 'bg-red-100 text-red-800', 'Overweight': 'bg-orange-100 text-orange-800' }[status] || 'bg-gray-100 text-gray-600');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Growth & Nutrition Data</h1>
            <p className="text-slate-500 mt-1">{child.first_name} {child.last_name} • {child.age} yrs • {child.sex}</p>
          </div>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 text-sm font-semibold">
            <Plus className="w-4 h-4" /> Add Measurement
          </button>
        </div>

        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2"><Ruler className="w-6 h-6 text-blue-600" /><span className="font-semibold text-blue-900">Latest Height</span></div>
              <p className="text-3xl font-bold text-blue-700">{records[0].height_first} cm</p>
              <p className="text-sm text-blue-600 mt-1">{records[0].assessment_date}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2"><Weight className="w-6 h-6 text-green-600" /><span className="font-semibold text-green-900">Latest Weight</span></div>
              <p className="text-3xl font-bold text-green-700">{records[0].weight_first} kg</p>
              <p className="text-sm text-green-600 mt-1">{records[0].assessment_date}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2"><Calendar className="w-6 h-6 text-purple-600" /><span className="font-semibold text-purple-900">Status</span></div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(records[0].nutritional_status_result)}`}>{records[0].nutritional_status_result}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">Growth History</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['Date','Height (cm)','Weight (kg)','Status'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No measurements recorded yet.</td></tr>
                ) : records.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{r.assessment_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{r.height_first} cm</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{r.weight_first} kg</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(r.nutritional_status_result)}`}>{r.nutritional_status_result}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)} title="Add Growth Measurement">
          <div className="space-y-4">
            <div><label className={lc}>Date</label><input type="date" value={formData.date_taken} onChange={e => setFormData({ ...formData, date_taken: e.target.value })} className={ic} /></div>
            <div><label className={lc}>Height (cm)</label><input type="number" step="0.1" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} placeholder="e.g., 105.5" className={ic} /></div>
            <div><label className={lc}>Weight (kg)</label><input type="number" step="0.1" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="e.g., 18.5" className={ic} /></div>
            <div>
              <label className={lc}>Nutritional Status</label>
              <select value={formData.nutritional_status} onChange={e => setFormData({ ...formData, nutritional_status: e.target.value })} className={ic}>
                <option value="Normal">Normal</option>
                <option value="Underweight">Underweight</option>
                <option value="Severely Underweight">Severely Underweight</option>
                <option value="Overweight">Overweight</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={submitData} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-semibold">Save Measurement</button>
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-semibold">Cancel</button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
