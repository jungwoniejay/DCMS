import ParentLayout from '@/layouts/parent-layout';
import { TrendingUp, Ruler, Weight } from 'lucide-react';
import { useState } from 'react';

interface NutritionData {
  child_id: number;
  child_name: string;
  age: number;
  sex: string;
  current_status: string;
  current_height: number | null;
  current_weight: number | null;
  last_measured: string | null;
  history: Array<{
    date: string;
    height: number;
    weight: number;
    status: string;
  }>;
  food_allergies: string | null;
  eating_habits: string | null;
}

interface Props {
  nutritionData: NutritionData[];
}

export default function Nutrition({ nutritionData }: Props) {
  const [selectedChild, setSelectedChild] = useState<NutritionData | null>(null);

  const handleViewGrowthChart = (child: NutritionData) => {
    setSelectedChild(child);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Normal': 'bg-green-100 text-green-800',
      'Underweight': 'bg-yellow-100 text-yellow-800',
      'Severely Underweight': 'bg-red-100 text-red-800',
      'Overweight': 'bg-orange-100 text-orange-800',
      'Not assessed': 'bg-gray-100 text-gray-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <ParentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Growth & Development</h1>
          <p className="text-gray-600 mt-2">Track your children's growth, nutrition status, and feeding habits</p>
        </div>

        {nutritionData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No nutrition data available.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {nutritionData.map((data) => (
              <div key={data.child_id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{data.child_name}</h2>
                      <p className="text-gray-600">{data.age} years old • {data.sex}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.current_status)}`}>
                      {data.current_status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Ruler className="w-6 h-6 text-blue-600" />
                        <span className="font-semibold text-blue-900">Current Height</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-700">
                        {data.current_height ? `${data.current_height} cm` : 'Not recorded'}
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Weight className="w-6 h-6 text-green-600" />
                        <span className="font-semibold text-green-900">Current Weight</span>
                      </div>
                      <p className="text-3xl font-bold text-green-700">
                        {data.current_weight ? `${data.current_weight} kg` : 'Not recorded'}
                      </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        <span className="font-semibold text-purple-900">Last Measured</span>
                      </div>
                      <p className="text-lg font-bold text-purple-700">
                        {data.last_measured || 'Never'}
                      </p>
                    </div>
                  </div>

                  {data.history.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Growth History</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">Height (cm)</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">Weight (kg)</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {data.history.map((record, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{record.date}</td>
                                <td className="px-4 py-3">{record.height}</td>
                                <td className="px-4 py-3">{record.weight}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                    {record.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.food_allergies && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Food Allergies</h3>
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800">{data.food_allergies}</p>
                        </div>
                      </div>
                    )}

                    {data.eating_habits && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Eating Habits</h3>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-gray-700">{data.eating_habits}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 print:hidden">
                    <button 
                      onClick={() => handleViewGrowthChart(data)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Growth Chart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedChild && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:hidden">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold">Growth Chart - {selectedChild.child_name}</h3>
                <button onClick={() => setSelectedChild(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="text-xl font-bold text-blue-700">{selectedChild.age} years</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Sex</p>
                    <p className="text-xl font-bold text-green-700">{selectedChild.sex}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-xl font-bold text-purple-700">{selectedChild.current_status}</p>
                  </div>
                </div>

                {selectedChild.history.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-4">Growth Visualization</h4>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <svg viewBox="0 0 800 400" className="w-full">
                        <line x1="50" y1="350" x2="750" y2="350" stroke="#333" strokeWidth="2" />
                        <line x1="50" y1="50" x2="50" y2="350" stroke="#333" strokeWidth="2" />
                        
                        <text x="400" y="390" textAnchor="middle" className="text-sm">Date</text>
                        <text x="20" y="200" textAnchor="middle" transform="rotate(-90 20 200)" className="text-sm">Height (cm) / Weight (kg)</text>
                        
                        {selectedChild.history.map((record, idx) => {
                          const x = 100 + (idx * 150);
                          const heightY = 350 - (record.height * 2);
                          const weightY = 350 - (record.weight * 8);
                          return (
                            <g key={idx}>
                              <circle cx={x} cy={heightY} r="5" fill="#4A90E2" />
                              <circle cx={x} cy={weightY} r="5" fill="#7ED321" />
                              <text x={x} y="370" textAnchor="middle" className="text-xs">{record.date}</text>
                            </g>
                          );
                        })}
                        
                        <circle cx="600" cy="30" r="5" fill="#4A90E2" />
                        <text x="615" y="35" className="text-sm">Height</text>
                        <circle cx="680" cy="30" r="5" fill="#7ED321" />
                        <text x="695" y="35" className="text-sm">Weight</text>
                      </svg>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-lg mb-3">Growth History</h4>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Height (cm)</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Weight (kg)</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedChild.history.map((record, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{record.date}</td>
                          <td className="border border-gray-300 px-4 py-2">{record.height}</td>
                          <td className="border border-gray-300 px-4 py-2">{record.weight}</td>
                          <td className="border border-gray-300 px-4 py-2">{record.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => window.print()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Print Chart
                  </button>
                  <button onClick={() => setSelectedChild(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Close
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
