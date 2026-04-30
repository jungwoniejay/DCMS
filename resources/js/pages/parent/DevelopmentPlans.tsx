import ParentLayout from '@/layouts/parent-layout';
import { Brain, Heart, Users, MessageCircle, Languages, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

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
    <ParentLayout>
      <div className="p-8">
        <div className="mb-8">
          <Link href="/parent/my-children" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to My Children
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Development Plans</h1>
          <p className="text-gray-600 mt-2">{child.first_name} {child.last_name}</p>
        </div>

        {plans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No development plans yet.</p>
            <p className="text-gray-400 text-sm mt-2">The barangay staff will create development plans for your child.</p>
          </div>
        ) : (
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
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-gray-700">{plan.progress_notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
