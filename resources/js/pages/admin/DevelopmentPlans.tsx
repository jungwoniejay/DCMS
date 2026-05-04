import AdminLayout from '@/layouts/admin-layout';
import Modal from '@/components/Modal';
import { Brain, Heart, Users, MessageCircle, Languages, Plus } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface DevelopmentPlan {
  id: number;
  plan_type: string;
  current_status: string;
  goals: string;
  activities: string;
  resources_needed: string | null;
  target_date: string | null;
  progress_notes: string | null;
  status: string;
  creator: { name: string; };
  created_at: string;
}

interface Props {
  child: { id: number; first_name: string; last_name: string; };
  plans: DevelopmentPlan[];
}

export default function DevelopmentPlans({ child, plans }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    plan_type: 'cognitive',
    current_status: '',
    goals: '',
    activities: '',
    resources_needed: '',
    target_date: '',
  });

  const submitPlan = () => {
    router.post(`/admin/children/${child.id}/development-plans`, formData, {
      onSuccess: () => {
        setShowModal(false);
        setFormData({
          plan_type: 'cognitive',
          current_status: '',
          goals: '',
          activities: '',
          resources_needed: '',
          target_date: '',
        });
      }
    });
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      cognitive: Brain,
      physical: Heart,
      social: Users,
      emotional: MessageCircle,
      language: Languages,
    };
    const Icon = icons[type] || Brain;
    return <Icon className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Development Plans</h1>
            <p className="text-slate-500 mt-1">{child.first_name} {child.last_name}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Plan
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {getTypeIcon(plan.plan_type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 capitalize">{plan.plan_type} Development</h3>
                    <p className="text-sm text-gray-500">Created by {plan.creator.name}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
                  {plan.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Current Status</h4>
                  <p className="text-gray-600">{plan.current_status}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Goals</h4>
                  <p className="text-gray-600">{plan.goals}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Activities</h4>
                  <p className="text-gray-600">{plan.activities}</p>
                </div>

                {plan.resources_needed && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Resources Needed</h4>
                    <p className="text-gray-600">{plan.resources_needed}</p>
                  </div>
                )}

                {plan.target_date && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Target Date</h4>
                    <p className="text-gray-600">{plan.target_date}</p>
                  </div>
                )}

                {plan.progress_notes && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-700 mb-2">Progress Notes</h4>
                    <p className="text-gray-600">{plan.progress_notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {plans.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No development plans yet.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Plan
              </button>
            </div>
          )}
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)} title="Create Development Plan" maxWidth="xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
              <select value={formData.plan_type} onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="cognitive">Cognitive Development</option>
                <option value="physical">Physical Development</option>
                <option value="social">Social Development</option>
                <option value="emotional">Emotional Development</option>
                <option value="language">Language Development</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label><textarea value={formData.current_status} onChange={(e) => setFormData({ ...formData, current_status: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Describe the child's current developmental status..." /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Goals</label><textarea value={formData.goals} onChange={(e) => setFormData({ ...formData, goals: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} placeholder="What are the developmental goals?" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Activities</label><textarea value={formData.activities} onChange={(e) => setFormData({ ...formData, activities: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={3} placeholder="What activities will help achieve these goals?" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Resources Needed (Optional)</label><textarea value={formData.resources_needed} onChange={(e) => setFormData({ ...formData, resources_needed: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Target Date (Optional)</label><input type="date" value={formData.target_date} onChange={(e) => setFormData({ ...formData, target_date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
            <div className="flex gap-3 pt-2">
              <button onClick={submitPlan} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold">Create Plan</button>
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-semibold">Cancel</button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
