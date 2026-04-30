import ParentLayout from '@/layouts/parent-layout';
import { Users, AlertTriangle, Activity, Syringe, User } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Child {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  age: number;
  sex: string;
  birthdate: string;
  status: string;
  zone: string;
  profile_picture: string | null;
  emergency_alert: boolean;
  emergency_description: string | null;
  nutritional_status: string;
  height: number | null;
  weight: number | null;
  vaccinations: {
    bcg: string;
    dpt: string;
    polio: string;
    hepa_b: string;
    measles: string;
  };
}

interface Props {
  children: Child[];
}

export default function MyChildren({ children }: Props) {
  return (
    <ParentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Children</h1>
          <p className="text-gray-500 mt-1 text-sm">View detailed information about your children</p>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No children registered yet.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {children.map((child) => (
              <div key={child.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Card Header with profile picture */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {child.profile_picture ? (
                        <img
                          src={`/storage/${child.profile_picture}`}
                          alt={child.full_name}
                          className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{child.full_name}</h2>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {child.age} yrs • {child.sex} • Born {child.birthdate} • {child.zone}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      child.status === 'Approved' || child.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {child.status}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Basic Info */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-blue-500" /> Basic Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        {[
                          { label: 'Zone', value: child.zone },
                          { label: 'Height', value: child.height ? `${child.height} cm` : 'Not recorded' },
                          { label: 'Weight', value: child.weight ? `${child.weight} kg` : 'Not recorded' },
                          { label: 'Nutrition', value: child.nutritional_status },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between">
                            <span className="text-gray-500">{label}:</span>
                            <span className="font-medium text-gray-800">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vaccinations */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                        <Syringe className="w-4 h-4 text-green-500" /> Vaccination Status
                      </h3>
                      <div className="space-y-2 text-sm">
                        {Object.entries(child.vaccinations).map(([vaccine, status]) => (
                          <div key={vaccine} className="flex justify-between">
                            <span className="text-gray-500">{vaccine.toUpperCase()}:</span>
                            <span className={`font-medium ${
                              status === 'Yes' ? 'text-green-600' : 'text-gray-400'
                            }`}>{status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Health Alerts */}
                    <div className={`rounded-xl p-4 border ${
                      child.emergency_alert ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
                    }`}>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                        <AlertTriangle className={`w-4 h-4 ${child.emergency_alert ? 'text-red-500' : 'text-gray-400'}`} />
                        Health Alerts
                      </h3>
                      {child.emergency_alert ? (
                        <div>
                          <p className="text-sm text-red-800 font-medium">Emergency Action Required</p>
                          <p className="text-sm text-red-700 mt-1">{child.emergency_description}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">No health alerts</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/parent/my-children/${child.id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      View Full Profile
                    </Link>
                    <Link
                      href={`/parent/children/${child.id}/development-plans`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Development Plans
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Print Portfolio
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
