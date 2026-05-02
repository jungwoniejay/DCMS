import { Head, useForm } from '@inertiajs/react';
import { Save, Globe, FileText, Phone, Mail, MapPin, Clock } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';

const ic = 'w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const lc = 'block text-sm font-medium text-slate-600 mb-1';

interface WelcomeContentItem { id: number; key: string; value: string; type: string; }
interface Props { contents?: Record<string, WelcomeContentItem>; }

export default function WelcomeContent({ contents }: Props) {
    const get = (key: string) => contents?.[key]?.value || '';

    const { data, setData, post, processing } = useForm({
        contents: [
            { key: 'hero_title',            value: get('hero_title') },
            { key: 'hero_subtitle',         value: get('hero_subtitle') },
            { key: 'feature_1_title',       value: get('feature_1_title') },
            { key: 'feature_1_description', value: get('feature_1_description') },
            { key: 'feature_2_title',       value: get('feature_2_title') },
            { key: 'feature_2_description', value: get('feature_2_description') },
            { key: 'feature_3_title',       value: get('feature_3_title') },
            { key: 'feature_3_description', value: get('feature_3_description') },
            { key: 'footer_tagline',        value: get('footer_tagline') },
            { key: 'footer_address',        value: get('footer_address') },
            { key: 'footer_phone',          value: get('footer_phone') },
            { key: 'footer_email',          value: get('footer_email') },
            { key: 'footer_hours',          value: get('footer_hours') },
            { key: 'footer_copyright',      value: get('footer_copyright') },
        ],
    });

    const idx = (key: string) => data.contents.findIndex(c => c.key === key);
    const update = (key: string, value: string) => {
        const i = idx(key);
        if (i === -1) return;
        const next = [...data.contents];
        next[i] = { ...next[i], value };
        setData('contents', next);
    };
    const val = (key: string) => data.contents[idx(key)]?.value || '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.welcome-content.update'));
    };

    const Field = ({ label, id, multiline = false, rows = 2 }: { label: string; id: string; multiline?: boolean; rows?: number }) => (
        <div className="w-full">
            <label className={lc}>{label}</label>
            {multiline ? (
                <textarea
                    id={id}
                    value={val(id)}
                    onChange={e => update(id, e.target.value)}
                    disabled={processing}
                    rows={rows}
                    className={`${ic} resize-none`}
                />
            ) : (
                <input
                    id={id}
                    value={val(id)}
                    onChange={e => update(id, e.target.value)}
                    disabled={processing}
                    className={ic}
                />
            )}
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Welcome Page Content" />
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome Page Content</h1>
                    <p className="text-slate-500 mt-1 text-sm">Manage all editable content on the public welcome page</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hero */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
                        <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-500" /> Hero Section
                        </h2>
                        <Field label="Main Title" id="hero_title" />
                        <Field label="Subtitle" id="hero_subtitle" multiline rows={3} />
                    </div>

                    {/* Features */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
                        <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-500" /> Features Section
                        </h2>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 border border-slate-100 rounded-xl space-y-3 bg-slate-50/50">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Feature {i}</p>
                                <Field label="Title" id={`feature_${i}_title`} />
                                <Field label="Description" id={`feature_${i}_description`} multiline />
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
                        <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-500" /> Footer Section
                        </h2>
                        <Field label="Tagline / Description" id="footer_tagline" multiline rows={2} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-slate-400 mt-7 shrink-0" />
                                <Field label="Address" id="footer_address" />
                            </div>
                            <div className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-slate-400 mt-7 shrink-0" />
                                <Field label="Phone Number" id="footer_phone" />
                            </div>
                            <div className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-slate-400 mt-7 shrink-0" />
                                <Field label="Email Address" id="footer_email" />
                            </div>
                            <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-slate-400 mt-7 shrink-0" />
                                <Field label="Office Hours" id="footer_hours" />
                            </div>
                        </div>
                        <Field label="Copyright Text" id="footer_copyright" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Saving...' : 'Save All Changes'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
