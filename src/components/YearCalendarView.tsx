import React, { useState, useEffect, useCallback } from 'react';
import { Scenario, DayInfo } from '../types';
import { generateYearCalendar } from '../utils/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface YearCalendarViewProps {
    scenario: Scenario;
}

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Mar\u00e7o', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAY_HEADERS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

const YearCalendarView: React.FC<YearCalendarViewProps> = ({ scenario }) => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedTeam, setSelectedTeam] = useState(0);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [isMobile, setIsMobile] = useState(false);

    const calendar = generateYearCalendar(scenario, selectedYear, selectedTeam);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        setIsMobile(mq.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const getShiftColor = (shift: string) => {
        switch (shift) {
            case 'M': return 'bg-yellow-500';
            case 'T': return 'bg-orange-500';
            case 'N': return 'bg-blue-600';
            case 'F': return 'bg-gray-600';
            default: return 'bg-gray-700';
        }
    };

    const getShiftLabel = (shift: string) => {
        switch (shift) {
            case 'M': return 'Manh\u00e3';
            case 'T': return 'Tarde';
            case 'N': return 'Noite';
            case 'F': return 'Folga';
            default: return 'Desconhecido';
        }
    };

    const monthGroups: { [key: number]: DayInfo[] } = {};
    calendar.forEach(day => {
        const month = day.date.getMonth();
        if (!monthGroups[month]) monthGroups[month] = [];
        monthGroups[month].push(day);
    });

    const handleDayInteraction = useCallback((day: DayInfo, rect: DOMRect) => {
        const dayName = day.date.toLocaleDateString('pt-PT', { weekday: 'long' });
        const monthName = day.date.toLocaleDateString('pt-PT', { month: 'long' });
        setTooltip({
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
            content: `${day.date.getDate()} de ${monthName} (${dayName}) - ${getShiftLabel(day.shift)}${day.isWeekendOff ? ' - FDS Folga' : ''}`,
        });
    }, []);

    const renderMonth = (monthIdx: number, days: DayInfo[]) => (
        <div key={monthIdx} className="bg-gray-900/30 rounded p-3">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">{MONTH_NAMES[monthIdx]}</h4>
            <div className="grid grid-cols-7 gap-1">
                {DAY_HEADERS.map((d, i) => (
                    <div key={i} className="text-xs text-gray-500 text-center font-medium">{d}</div>
                ))}
                {days.length > 0 && Array.from({ length: (days[0].date.getDay() + 6) % 7 }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`aspect-square flex items-center justify-center text-xs rounded cursor-default ${getShiftColor(day.shift)} ${day.isWeekendOff ? 'ring-2 ring-green-400' : ''} ${day.isWeekend && !day.isWeekendOff ? 'opacity-75' : ''}`}
                        role="gridcell"
                        tabIndex={0}
                        aria-label={`${day.date.toLocaleDateString('pt-PT')}, ${getShiftLabel(day.shift)}${day.isWeekendOff ? ', fim de semana de folga' : ''}`}
                        onMouseEnter={(e) => handleDayInteraction(day, e.currentTarget.getBoundingClientRect())}
                        onMouseLeave={() => setTooltip(null)}
                        onFocus={(e) => handleDayInteraction(day, e.currentTarget.getBoundingClientRect())}
                        onBlur={() => setTooltip(null)}
                    >
                        <span className="text-white font-semibold">{day.date.getDate()}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-lg font-semibold text-white">Calend\u00e1rio Anual: {scenario.name}</h3>
                <div className="flex items-center gap-3">
                    {scenario.teams > 1 && (
                        <select
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(Number(e.target.value))}
                            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                            {Array.from({ length: scenario.teams }, (_, i) => (
                                <option key={i} value={i}>Turno {String.fromCharCode(65 + i)}</option>
                            ))}
                        </select>
                    )}
                    <button
                        onClick={() => setSelectedYear(y => y - 1)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Ano Anterior"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <span className="text-white font-semibold min-w-[80px] text-center">{selectedYear}</span>
                    <button
                        onClick={() => setSelectedYear(y => y + 1)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Pr\u00f3ximo Ano"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            <div className={`p-4 ${isMobile ? '' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto'}`}>
                {isMobile ? (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <button
                                onClick={() => setSelectedMonth(m => (m + 11) % 12)}
                                className="p-2 hover:bg-gray-700 rounded transition-colors"
                                aria-label="M\u00eas anterior"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-400" />
                            </button>
                            <h4 className="text-base font-semibold text-white">{MONTH_NAMES[selectedMonth]}</h4>
                            <button
                                onClick={() => setSelectedMonth(m => (m + 1) % 12)}
                                className="p-2 hover:bg-gray-700 rounded transition-colors"
                                aria-label="Pr\u00f3ximo m\u00eas"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        {renderMonth(selectedMonth, monthGroups[selectedMonth] || [])}
                    </div>
                ) : (
                    Object.entries(monthGroups).map(([monthIdx, days]) => renderMonth(parseInt(monthIdx), days))
                )}
            </div>

            <div className="p-3 bg-gray-900/30 border-t border-gray-700 flex flex-wrap gap-4 text-xs">
                {[
                    { color: 'bg-yellow-500', label: 'Manh\u00e3' },
                    { color: 'bg-orange-500', label: 'Tarde' },
                    { color: 'bg-blue-600', label: 'Noite' },
                    { color: 'bg-gray-600', label: 'Folga' },
                    { color: 'bg-gray-600 ring-2 ring-green-400', label: 'FDS Folga' },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color}`} />
                        <span className="text-gray-400">{label}</span>
                    </div>
                ))}
            </div>

            {tooltip && (
                <div
                    className="fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-xs rounded shadow-lg border border-gray-600 pointer-events-none whitespace-nowrap"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
                    role="tooltip"
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export default YearCalendarView;
