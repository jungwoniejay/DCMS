import { ReactNode } from 'react';

interface PastelCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export default function PastelCard({ children, className = '', hover = false }: PastelCardProps) {
    return (
        <div
            className={`rounded-2xl transition-all duration-300 ${className}`}
            style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
            }}
            onMouseEnter={(e) => {
                if (hover) {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(144, 202, 249, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                }
            }}
            onMouseLeave={(e) => {
                if (hover) {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }
            }}
        >
            {children}
        </div>
    );
}
