import { clsx } from 'clsx';

interface FilterChipProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
    count?: number;
    color?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

const COLOR_STYLES = {
    blue: { active: 'bg-blue-600 text-white border-blue-600', inactive: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
    green: { active: 'bg-emerald-600 text-white border-emerald-600', inactive: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
    amber: { active: 'bg-amber-600 text-white border-amber-600', inactive: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
    purple: { active: 'bg-purple-600 text-white border-purple-600', inactive: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
    red: { active: 'bg-red-600 text-white border-red-600', inactive: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' },
};

export default function FilterChip({ label, active = false, onClick, count, color = 'blue' }: FilterChipProps) {
    const styles = COLOR_STYLES[color];

    return (
        <button
            onClick={onClick}
            className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                active ? styles.active : styles.inactive
            )}
        >
            {label}
            {count !== undefined && (
                <span className={clsx(
                    'ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                    active ? 'bg-white/20' : 'bg-black/5'
                )}>
                    {count}
                </span>
            )}
        </button>
    );
}
