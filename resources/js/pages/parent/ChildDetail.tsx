import ParentLayout from '@/layouts/parent-layout';
import { User, Heart, Activity, Users, Home, AlertTriangle, Pill, Syringe } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Child {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  sex: string;
  birthdate: string;
  age: number;
  address: string;
  first_language: string;
  second_language: string;
  registration_status: string;
  profile_picture: string | null;
  family_profile: any;
  father_profile: any;
  mother_profile: any;
  health_assessment: any;
  emergency_contacts: any[];
  logistics: any;
  siblings: any[];
  prior_experience: any;
  child_details: any;
}

interface Props {
  child: Child;
  nutritionHistory: any[];
  medicalAssessment: any;
  healthProblems: any[];
  medications: any[];
}

export default function ChildDetail({ child, nutritionHistory, medicalAssessment, healthProblems, medications }: Props) {
  return (
    <ParentLayout>
      <div className="space-y-6">
        {/* Header with profile picture */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <Link href="/parent/my-children" className="text-green-600 hover:text-green-700 text-sm font-medium mb-4 inline-flex items-center gap-1">
            ← Back to My Children
          </Link>
          <div className="flex items-center gap-5 mt-3">
            {child.profile_picture ? (
              <img
                src={`/storage/${child.profile_picture}`}
                alt={child.first_name}
                className="w-20 h-20 rounded-full object-cover border-4 border-green-100 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {child.first_name} {child.middle_name} {child.last_name}
              </h1>
              <p className="text-gray-500 mt-1 text-sm">{child.age} years old • {child.sex} • Born {child.birthdate}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                child.registration_status === 'Approved' || child.registration_status === 'approved'
                  ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>{child.registration_status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-900">{child.first_name} {child.middle_name} {child.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sex</p>
                  <p className="font-medium text-gray-900">{child.sex}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Birthdate</p>
                  <p className="font-medium text-gray-900">{child.birthdate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium text-gray-900">{child.age} years old</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{child.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">First Language</p>
                  <p className="font-medium text-gray-900">{child.first_language}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Second Language</p>
                  <p className="font-medium text-gray-900">{child.second_language || 'None'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Health Information
              </h2>
              
              {medicalAssessment && (
                <>
                  {medicalAssessment.requires_emergency_action && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900">Emergency Action Required</p>
                          <p className="text-red-800 text-sm mt-1">{medicalAssessment.emergency_action_description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Syringe className="w-4 h-4 text-green-500" />
                      Vaccination Status
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {['bcg', 'dpt', 'polio', 'hepa_b', 'measles', 'mmr'].map((vaccine) => (
                        <div key={vaccine} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium text-gray-700">{vaccine.toUpperCase()}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            medicalAssessment[`${vaccine}_status`] === 'Yes' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {medicalAssessment[`${vaccine}_status`] || 'Unknown'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {healthProblems.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Health Problems</h3>
                  <div className="space-y-2">
                    {healthProblems.map((problem: any, idx: number) => (
                      <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-900">{problem.problem_type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {medications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-purple-500" />
                    Current Medications
                  </h3>
                  <div className="space-y-2">
                    {medications.map((med: any, idx: number) => (
                      <div key={idx} className="p-3 bg-purple-50 border border-purple-200 rounded">
                        <p className="font-medium text-purple-900">{med.medication_name}</p>
                        <p className="text-sm text-purple-700">{med.dosage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Growth & Nutrition
              </h2>
              
              {nutritionHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Height (cm)</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Weight (kg)</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {nutritionHistory.map((record: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{record.date_taken}</td>
                          <td className="px-4 py-2">{record.height}</td>
                          <td className="px-4 py-2">{record.weight}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              record.nutritional_status === 'Normal' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.nutritional_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No nutrition records available</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-purple-500" />
                Family Information
              </h2>
              
              {child.family_profile && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Zone</p>
                    <p className="font-medium text-gray-900">{child.family_profile.purok_zone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Home Ownership</p>
                    <p className="font-medium text-gray-900">{child.family_profile.home_ownership}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Home Materials</p>
                    <p className="font-medium text-gray-900">{child.family_profile.home_materials}</p>
                  </div>
                </div>
              )}

              {child.father_profile && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Father</p>
                  <p className="text-sm text-gray-900">
                    {child.father_profile.first_name} {child.father_profile.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{child.father_profile.occupational_status}</p>
                </div>
              )}

              {child.mother_profile && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Mother</p>
                  <p className="text-sm text-gray-900">
                    {child.mother_profile.first_name} {child.mother_profile.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{child.mother_profile.occupational_status}</p>
                </div>
              )}
            </div>

            {child.emergency_contacts && child.emergency_contacts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Emergency Contacts
                </h2>
                <div className="space-y-3">
                  {child.emergency_contacts.map((contact: any, idx: number) => (
                    <div key={idx} className="p-3 bg-orange-50 border border-orange-200 rounded">
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                      <p className="text-sm text-gray-600">{contact.mobile_phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {child.siblings && child.siblings.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Siblings
                </h2>
                <div className="space-y-2">
                  {child.siblings.map((sibling: any, idx: number) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-900">{sibling.name}</p>
                      <p className="text-xs text-gray-600">{sibling.age} years old</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Forms Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">Child Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href={route('parent.children.profile.edit', child.id)}
              className="flex flex-col gap-1 p-4 rounded-xl border border-purple-100 bg-purple-50 hover:bg-purple-100 transition-all"
            >
              <span className="text-sm font-bold text-purple-700">Form 2 — Children's Profile</span>
              <span className="text-xs text-purple-500">Birth order, vaccinations, siblings, logistics & more</span>
            </Link>
            <Link
              href={route('parent.children.health.edit', child.id)}
              className="flex flex-col gap-1 p-4 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-all"
            >
              <span className="text-sm font-bold text-red-700">Form 2 — Health Assessment</span>
              <span className="text-xs text-red-500">Routine care, health problems, immunizations</span>
            </Link>
            <Link
              href={route('parent.children.nutrition.edit', child.id)}
              className="flex flex-col gap-1 p-4 rounded-xl border border-green-100 bg-green-50 hover:bg-green-100 transition-all"
            >
              <span className="text-sm font-bold text-green-700">Form 3 — Nutrition Status</span>
              <span className="text-xs text-green-500">Height, weight, feeding habits & meal times</span>
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => window.print()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">Download Portfolio</button>
          <button onClick={() => window.print()} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">Print Health Form</button>
          <button onClick={() => { const r = prompt('Describe what needs correction:'); if (r) alert('Correction request submitted!'); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">Request Correction</button>
        </div>
      </div>
    </ParentLayout>
  );
}
