import React, { useState, useMemo } from 'react';
import { Scenario } from '../types';
import { generateYearCalendar } from '../utils/calendar';
import { ArrowLeft, ArrowRight, LayoutGrid, LayoutList } from 'lucide-react';
import './MultiTeamCalendarView.css';

interface MultiTeamCalendarViewProps {
    scenario: Scenario;
    onClose: () => void;
}

type LayoutMode = 'horizontal' | 'vertical';

const MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const MultiTeamCalendarView: React.FC<MultiTeamCalendarViewProps> = ({ scenario, onClose }) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [layoutMode, setLayoutMode] = useState<LayoutMode>('horizontal');

    const teamCalendars = useMemo(() => {
        const calendars = [];
        for (let t = 0; t < scenario.teams; t++) {
            calendars.push(generateYearCalendar(scenario, year, t));
        }
        return calendars;
    }, [scenario, year]);

    const getShiftColor = (shift: string) => {
        switch (shift) {
            case 'M': return '#4ade80'; // Morning - green
            case 'T': return '#fbbf24'; // Afternoon - yellow
            case 'N': return '#60a5fa'; // Night - blue
            case 'F': return '#e5e7eb'; // Off - gray
            default: return '#e5e7eb';
        }
    };

    const getShiftLabel = (shift: string) => {
        switch (shift) {
            case 'M': return 'M';
            case 'T': return 'T';
            case 'N': return 'N';
            case 'F': return 'F';
            default: return '';
        }
    };

    const renderHorizontalLayout = () => {
        return (
            <div className="multi-team-horizontal">
                {teamCalendars.map((calendar, teamIndex) => (
                    <div key={teamIndex} className="team-column">
                        <div className="team-header">
                            <h3>Turno {String.fromCharCode(65 + teamIndex)}</h3>
                        </div>
                        <div className="calendar-grid-compact">
                            {calendar.map((day, dayIndex) => {
                                const isFirstOfMonth = day.date.getDate() === 1;
                                const monthLabel = isFirstOfMonth ? MONTH_NAMES[day.date.getMonth()].substring(0, 3) : '';

                                return (
                                    <div
                                        key={dayIndex}
                                        className="day-cell-compact"
                                        style={{ backgroundColor: getShiftColor(day.shift) }}
                                        title={`${day.date.toLocaleDateString('pt-PT')} - ${day.shift}`}
                                    >
                                        {monthLabel && <div className="month-label">{monthLabel}</div>}
                                        <div className="day-number">{day.date.getDate()}</div>
                                        <div className="shift-label">{getShiftLabel(day.shift)}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderVerticalLayout = () => {
        const daysInYear = teamCalendars[0].length;

        return (
            <div className="multi-team-vertical">
                <div className="team-labels">
                    {teamCalendars.map((_, teamIndex) => (
                        <div key={teamIndex} className="team-label-vertical">
                            Turno {String.fromCharCode(65 + teamIndex)}
                        </div>
                    ))}
                </div>
                <div className="calendar-scroll-horizontal">
                    <div className="calendar-grid-vertical">
                        {Array.from({ length: daysInYear }).map((_, dayIndex) => (
                            <div key={dayIndex} className="day-column">
                                <div className="day-header-vertical">
                                    {teamCalendars[0][dayIndex].date.getDate() === 1 && (
                                        <div className="month-label-vertical">
                                            {MONTH_NAMES[teamCalendars[0][dayIndex].date.getMonth()].substring(0, 3)}
                                        </div>
                                    )}
                                    <div className="day-number-vertical">
                                        {teamCalendars[0][dayIndex].date.getDate()}
                                    </div>
                                </div>
                                {teamCalendars.map((calendar, teamIndex) => {
                                    const day = calendar[dayIndex];
                                    return (
                                        <div
                                            key={teamIndex}
                                            className="shift-cell-vertical"
                                            style={{ backgroundColor: getShiftColor(day.shift) }}
                                            title={`Turno ${String.fromCharCode(65 + teamIndex)} - ${day.date.toLocaleDateString('pt-PT')} - ${day.shift}`}
                                        >
                                            {getShiftLabel(day.shift)}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="year-calendar-overlay">
            <div className="year-calendar-modal multi-team-modal">
                <div className="year-calendar-header">
                    <h2>Vista Multi-Equipa - {scenario.name}</h2>
                    <div className="header-controls">
                        <div className="layout-toggle">
                            <button
                                className={`layout-btn ${layoutMode === 'horizontal' ? 'active' : ''}`}
                                onClick={() => setLayoutMode('horizontal')}
                                title="Vista Horizontal (Equipas em Colunas)"
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                className={`layout-btn ${layoutMode === 'vertical' ? 'active' : ''}`}
                                onClick={() => setLayoutMode('vertical')}
                                title="Vista Vertical (Equipas em Linhas)"
                            >
                                <LayoutList size={20} />
                            </button>
                        </div>
                        <div className="year-selector">
                            <button onClick={() => setYear(year - 1)}>
                                <ArrowLeft size={20} />
                            </button>
                            <span>{year}</span>
                            <button onClick={() => setYear(year + 1)}>
                                <ArrowRight size={20} />
                            </button>
                        </div>
                        <button className="close-btn" onClick={onClose}>✕</button>
                    </div>
                </div>

                <div className="year-calendar-content">
                    {layoutMode === 'horizontal' ? renderHorizontalLayout() : renderVerticalLayout()}
                </div>

                <div className="legend">
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#4ade80' }}></div>
                        <span>Manhã (M)</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
                        <span>Tarde (T)</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#60a5fa' }}></div>
                        <span>Noite (N)</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#e5e7eb' }}></div>
                        <span>Folga (F)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
