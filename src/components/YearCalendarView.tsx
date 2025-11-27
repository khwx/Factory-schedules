import React, { useState } from 'react';
import { Scenario, DayInfo } from '../types';
import { generateYearCalendar } from '../utils/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface YearCalendarViewProps {
    scenario: Scenario;
}

const YearCalendarView: React.FC<YearCalendarViewProps> = ({ scenario }) => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedTeam, setSelectedTeam] = useState(0);

    const calendar = generateYearCalendar(scenario, selectedYear, selectedTeam);

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
            case 'M': return 'M';
            case 'T': return 'T';
            case 'N': return 'N';
            case 'F': return 'F';
            default: return '?';
        }
    };

    // Group by month
    const monthGroups: { [key: number]: DayInfo[] } = {};
    calendar.forEach(day => {
        const month = day.date.getMonth();
        if (!monthGroups[month]) monthGroups[month] = [];
        monthGroups[month].push(day);
    });

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-lg font-semibold text-white">Annual Calendar: {scenario.name}</h3>
                <div className="flex items-center gap-3">
                    {/* Team Selector */}
                    {scenario.teams > 1 && (
                        <select
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(Number(e.target.value))}
                            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                            {Array.from({ length: scenario.teams }, (_, i) => (
                                <option key={i} value={i}>
                                    Team {i + 1}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Year Navigation */}
                    <button
                        onClick={() => setSelectedYear(y => y - 1)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Previous Year"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <span className="text-white font-semibold min-w-[80px] text-center">{selectedYear}</span>
                    <button
                        onClick={() => setSelectedYear(y => y + 1)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Next Year"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                {Object.entries(monthGroups).map(([monthIdx, days]) => (
                    <div key={monthIdx} className="bg-gray-900/30 rounded p-3">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">{monthNames[parseInt(monthIdx)]}</h4>
                        <div className="grid grid-cols-7 gap-1">
                            {/* Day headers */}
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <div key={i} className="text-xs text-gray-500 text-center font-medium">{d}</div>
                            ))}

                            {/* Empty cells for alignment */}
                            {Array.from({ length: days[0].date.getDay() }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {/* Days */}
                            {days.map((day, i) => (
                                <div
                                    key={i}
                                    className={`
                    aspect-square flex items-center justify-center text-xs rounded
                    ${getShiftColor(day.shift)}
                    ${day.isWeekendOff ? 'ring-2 ring-green-400' : ''}
                    ${day.isWeekend && !day.isWeekendOff ? 'opacity-75' : ''}
                  `}
                                    title={`${day.date.toLocaleDateString()} - ${getShiftLabel(day.shift)} ${day.isWeekendOff ? '(Weekend Off)' : ''}`}
                                >
                                    <span className="text-white font-semibold">{day.date.getDate()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-gray-900/30 border-t border-gray-700 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-400">Morning</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-gray-400">Afternoon</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-gray-400">Night</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-600 rounded"></div>
                    <span className="text-gray-400">Off</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-600 rounded ring-2 ring-green-400"></div>
                    <span className="text-gray-400">Weekend Off</span>
                </div>
            </div>
        </div>
    );
};

export default YearCalendarView;
