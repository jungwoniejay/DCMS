import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastItem {
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

const icons = {
    success: CheckCircle,
    error:   XCircle,
    warning: AlertTriangle,
    info:    Info,
};

const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error:   'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info:    'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
    success: 'text-green-500',
    error:   'text-red-500',
    warning: 'text-yellow-500',
    info:    'text-blue-500',
};

export default function Toast() {
    const { props } = usePage();
    const flash = props.flash as any;
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const counter = useRef(0);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const addToast = (type: ToastItem['type'], message: string) => {
        const id = ++counter.current;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => removeToast(id), 4000);
    };

    useEffect(() => {
        if (flash?.success) addToast('success', flash.success);
        if (flash?.error)   addToast('error',   flash.error);
        if (flash?.warning) addToast('warning', flash.warning);
        if (flash?.info)    addToast('info',    flash.info);
    }, [flash?.success, flash?.error, flash?.warning, flash?.info]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full pointer-events-none">
            {toasts.map(toast => {
                const Icon = icons[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-3 p-4 rounded-2xl border shadow-lg animate-slide-up pointer-events-auto ${styles[toast.type]}`}
                    >
                        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconStyles[toast.type]}`} />
                        <p className="text-sm font-medium flex-1">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
