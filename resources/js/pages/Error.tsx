import { Head, Link } from '@inertiajs/react';
import DaycareLogo from '@/components/daycare-logo';
import { Home, ArrowLeft, AlertTriangle, ShieldX, ServerCrash } from 'lucide-react';

interface Props {
    status: number;
}

const errorConfig: Record<number, { icon: any; title: string; description: string; color: string }> = {
    403: {
        icon: ShieldX,
        title: 'Access Denied',
        description: "You don't have permission to access this page. Please contact your administrator.",
        color: 'from-orange-400 to-red-500',
    },
    404: {
        icon: AlertTriangle,
        title: 'Page Not Found',
        description: "The page you're looking for doesn't exist or has been moved.",
        color: 'from-blue-400 to-purple-500',
    },
    500: {
        icon: ServerCrash,
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later or contact support.',
        color: 'from-red-400 to-rose-600',
    },
    503: {
        icon: ServerCrash,
        title: 'Service Unavailable',
        description: 'The service is temporarily unavailable. Please try again in a few minutes.',
        color: 'from-yellow-400 to-orange-500',
    },
};

export default function ErrorPage({ status }: Props) {
    const config = errorConfig[status] ?? errorConfig[404];
    const Icon = config.icon;

    return (
        <>
            <Head title={`${status} — ${config.title}`} />
            <div
                className="min-h-screen flex items-center justify-center p-6"
                style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}
            >
                <div className="text-center max-w-md w-full">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 blur-xl opacity-20 rounded-full" />
                            <DaycareLogo className="w-16 h-16 relative z-10" />
                        </div>
                    </div>

                    {/* Error Icon */}
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-xl`}>
                        <Icon className="w-12 h-12 text-white" />
                    </div>

                    {/* Status Code */}
                    <p className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                        {status}
                    </p>

                    {/* Title & Description */}
                    <h1 className="text-2xl font-bold text-slate-800 mb-3">{config.title}</h1>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">{config.description}</p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <Home className="w-4 h-4" />
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-600 rounded-2xl font-semibold text-sm border border-slate-200 hover:bg-slate-50 transition-all duration-200"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
