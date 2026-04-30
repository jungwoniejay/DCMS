import { Head, Link } from '@inertiajs/react';
import { Users, UserCheck, UserX, User } from 'lucide-react';

export default function Dashboard({ stats, recentChildren }) {
  return (
    <>
      <Head title="Dashboard" />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Barangay Child Development Data Management System</h1>
            <p className="mt-2 text-gray-600">Welcome to the CDC Management Dashboard</p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Children"
              value={stats.total_children}
              icon={<Users className="h-8 w-8 text-blue-600" />}
              bgColor="bg-blue-50"
            />
            <StatCard
              title="Pending"
              value={stats.pending_registrations}
              icon={<UserX className="h-8 w-8 text-yellow-600" />}
              bgColor="bg-yellow-50"
            />
            <StatCard
              title="Approved"
              value={stats.approved_registrations}
              icon={<UserCheck className="h-8 w-8 text-green-600" />}
              bgColor="bg-green-50"
            />
            <StatCard
              title="Male / Female"
              value={`${stats.male_children} / ${stats.female_children}`}
              icon={<User className="h-8 w-8 text-purple-600" />}
              bgColor="bg-purple-50"
            />
          </div>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Registrations</h2>
            <Link
              href="/children/create"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Register New Child
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Sex
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {recentChildren.map((child) => (
                  <tr key={child.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {child.first_name} {child.last_name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{child.age}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{child.sex}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          child.registration_status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : child.registration_status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {child.registration_status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <Link href={`/children/${child.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <Link href="/children" className="text-blue-600 hover:text-blue-800">
              View All Children →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className={`rounded-lg ${bgColor} p-6 shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}
