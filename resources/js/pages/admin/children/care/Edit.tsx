import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save, Utensils, Moon, Droplets, Toilet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const foodOptions = [
    'Rice', 'Bread', 'Eggs', 'Fruit', 'Vegetables', 'Meat', 'Fish', 
    'Milk', 'Cheese', 'Yogurt', 'Cereal', 'Pasta', 'Soup', 'Other'
];

const appetiteOptions = ['Good', 'Fair', 'Poor'];
const sleepQualityOptions = ['Good', 'Fair', 'Poor'];
const bathingFrequencyOptions = ['Daily', 'Every other day', 'Weekly', 'As needed'];
const assistanceOptions = ['Independent', 'Assisted'];
const toiletingFrequencyOptions = ['Regular', 'Irregular', 'As needed'];

export default function ChildCareEdit({ child, careInfo }: any) {
    const { data, setData, post, put, processing, errors } = useForm({
        child_id: child.id,
        feeding_food_selection: careInfo?.feeding_food_selection || [],
        feeding_appetite: careInfo?.feeding_appetite || '',
        feeding_custom: careInfo?.feeding_custom || '',
        sleeping_duration: careInfo?.sleeping_duration || '',
        sleeping_quality: careInfo?.sleeping_quality || '',
        sleeping_custom: careInfo?.sleeping_custom || '',
        bathing_frequency: careInfo?.bathing_frequency || '',
        bathing_assistance: careInfo?.bathing_assistance || '',
        bathing_custom: careInfo?.bathing_custom || '',
        toileting_frequency: careInfo?.toileting_frequency || '',
        toileting_assistance: careInfo?.toileting_assistance || '',
        toileting_custom: careInfo?.toileting_custom || '',
    });

    const isEditing = careInfo !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.children.care.update', child.id));
        } else {
            post(route('admin.children.care.store', child.id));
        }
    };

    const handleFoodToggle = (food: string) => {
        const current = data.feeding_food_selection || [];
        if (current.includes(food)) {
            setData('feeding_food_selection', current.filter((f: string) => f !== food));
        } else {
            setData('feeding_food_selection', [...current, food]);
        }
    };

    return (
        <AdminLayout>
            <Head title={`${isEditing ? 'Edit' : 'Add'} Care Information - ${child.first_name} ${child.last_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href={route('admin.children.care.show', child.id)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isEditing ? 'Edit' : 'Add'} Care Information
                            </h1>
                            <p className="text-gray-600 mt-1">For: {child.first_name} {child.last_name}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Feeding Information */}
                        <Section icon={<Utensils />} title="Feeding Information">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Food Selection (Check all that apply)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {foodOptions.map((food) => (
                                            <label key={food} className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                                                <input
                                                    type="checkbox"
                                                    checked={data.feeding_food_selection?.includes(food) || false}
                                                    onChange={() => handleFoodToggle(food)}
                                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-700">{food}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.feeding_food_selection && (
                                        <p className="text-sm text-red-600 mt-1">{errors.feeding_food_selection}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Appetite
                                    </label>
                                    <div className="flex gap-4">
                                        {appetiteOptions.map((option) => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="feeding_appetite"
                                                    value={option}
                                                    checked={data.feeding_appetite === option}
                                                    onChange={(e) => setData('feeding_appetite', e.target.value)}
                                                    className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.feeding_appetite && (
                                        <p className="text-sm text-red-600 mt-1">{errors.feeding_appetite}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        value={data.feeding_custom}
                                        onChange={(e) => setData('feeding_custom', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                        rows={2}
                                        placeholder="Enter any additional feeding notes..."
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Sleeping Information */}
                        <Section icon={<Moon />} title="Sleeping Information">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sleep Duration (hours)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.sleeping_duration}
                                        onChange={(e) => setData('sleeping_duration', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                        placeholder="e.g., 8-10"
                                    />
                                    {errors.sleeping_duration && (
                                        <p className="text-sm text-red-600 mt-1">{errors.sleeping_duration}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sleep Quality
                                    </label>
                                    <div className="flex gap-4">
                                        {sleepQualityOptions.map((option) => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="sleeping_quality"
                                                    value={option}
                                                    checked={data.sleeping_quality === option}
                                                    onChange={(e) => setData('sleeping_quality', e.target.value)}
                                                    className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.sleeping_quality && (
                                        <p className="text-sm text-red-600 mt-1">{errors.sleeping_quality}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        value={data.sleeping_custom}
                                        onChange={(e) => setData('sleeping_custom', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                        rows={2}
                                        placeholder="Enter any additional sleeping notes..."
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Bathing Information */}
                        <Section icon={<Droplets />} title="Bathing Information">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bathing Frequency
                                    </label>
                                    <select
                                        value={data.bathing_frequency}
                                        onChange={(e) => setData('bathing_frequency', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                    >
                                        <option value="">Select frequency</option>
                                        {bathingFrequencyOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    {errors.bathing_frequency && (
                                        <p className="text-sm text-red-600 mt-1">{errors.bathing_frequency}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assistance Level
                                    </label>
                                    <div className="flex gap-4">
                                        {assistanceOptions.map((option) => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="bathing_assistance"
                                                    value={option}
                                                    checked={data.bathing_assistance === option}
                                                    onChange={(e) => setData('bathing_assistance', e.target.value)}
                                                    className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.bathing_assistance && (
                                        <p className="text-sm text-red-600 mt-1">{errors.bathing_assistance}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        value={data.bathing_custom}
                                        onChange={(e) => setData('bathing_custom', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                        rows={2}
                                        placeholder="Enter any additional bathing notes..."
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* Toileting Information */}
                        <Section icon={<Toilet />} title="Toileting Information">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Toileting Frequency
                                    </label>
                                    <select
                                        value={data.toileting_frequency}
                                        onChange={(e) => setData('toileting_frequency', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                    >
                                        <option value="">Select frequency</option>
                                        {toiletingFrequencyOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    {errors.toileting_frequency && (
                                        <p className="text-sm text-red-600 mt-1">{errors.toileting_frequency}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assistance Level
                                    </label>
                                    <div className="flex gap-4">
                                        {assistanceOptions.map((option) => (
                                            <label key={option} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="toileting_assistance"
                                                    value={option}
                                                    checked={data.toileting_assistance === option}
                                                    onChange={(e) => setData('toileting_assistance', e.target.value)}
                                                    className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.toileting_assistance && (
                                        <p className="text-sm text-red-600 mt-1">{errors.toileting_assistance}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        value={data.toileting_custom}
                                        onChange={(e) => setData('toileting_custom', e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                        rows={2}
                                        placeholder="Enter any additional toileting notes..."
                                    />
                                </div>
                            </div>
                        </Section>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-4 mt-6">
                        <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            {isEditing ? 'Update' : 'Save'} Care Information
                        </Button>
                        <Link href={route('admin.children.care.show', child.id)}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function Section({ icon, title, children }: any) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="text-green-600">{icon}</div>
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            </div>
            {children}
        </div>
    );
}