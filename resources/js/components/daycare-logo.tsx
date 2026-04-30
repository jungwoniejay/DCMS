export default function DaycareLogo({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* House/Building */}
            <path
                d="M50 10L20 35V85H80V35L50 10Z"
                fill="#7ED321"
                stroke="#6BB91A"
                strokeWidth="2"
            />
            
            {/* Roof */}
            <path
                d="M15 35L50 5L85 35H15Z"
                fill="#6BB91A"
            />
            
            {/* Door */}
            <rect
                x="42"
                y="60"
                width="16"
                height="25"
                rx="2"
                fill="#F5A623"
            />
            
            {/* Windows */}
            <rect
                x="28"
                y="45"
                width="12"
                height="12"
                rx="1"
                fill="#F5A623"
            />
            <rect
                x="60"
                y="45"
                width="12"
                height="12"
                rx="1"
                fill="#F5A623"
            />
            
            {/* Child figure 1 */}
            <circle cx="35" cy="70" r="4" fill="#FFB347" />
            <path
                d="M35 74C35 74 32 74 32 77V82H38V77C38 74 35 74 35 74Z"
                fill="#FFB347"
            />
            
            {/* Child figure 2 */}
            <circle cx="65" cy="70" r="4" fill="#4A90E2" />
            <path
                d="M65 74C65 74 62 74 62 77V82H68V77C68 74 65 74 65 74Z"
                fill="#4A90E2"
            />
            
            {/* Heart accent */}
            <path
                d="M50 25C50 25 47 22 44 22C41 22 39 24 39 27C39 30 41 32 44 34L50 38L56 34C59 32 61 30 61 27C61 24 59 22 56 22C53 22 50 25 50 25Z"
                fill="#B39DDB"
            />
        </svg>
    );
}
