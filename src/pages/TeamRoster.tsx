import React, { useState, useMemo } from 'react';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../i18n';
import { Scenario, ShiftType } from '../types';

const MONTH_NAMES_PT = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TEAM_COLORS = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
    'bg-pink-500', 'bg-teal-500', 'bg-yellow-500', 'bg-red-500',
    'bg-indigo-500', 'bg-cyan-500',
];

const TEAM_LABELS = 'ABCDEFGHIJ';

function getShiftForDay(scenario: Scenario, dayIndex: number, teamIndex: number): ShiftType {
    const pattern = scenario.teamPatterns?.[teamIndex] || scenario.pattern;
    const cycleLength = pattern.length;
    const dayInCycle = ((dayIndex % cycleLength) + cycleLength) % cycleLength;
    return (pattern[dayInCycle] || 'F') as ShiftType;
}

function getShiftLabel(shift: ShiftType): string {
    switch (shift) {
        case 'M': return 'M';
        case 'T': return 'T';
        case 'N': return 'N';
        case 'F': return 'F';
        default: return '?';
    }
}

function getShiftColor(shift: ShiftType): string {
    switch (shift) {
        case 'M': return 'bg-yellow-500';
        case 'T': return 'bg-orange-500';
        case 'N': return 'bg-blue-600';
        case 'F': return 'bg-gray-600';
        default: return 'bg-gray-700';
    }
}

const TeamRoster: React.FC = () => {
    const { lang } = useI18n();
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');

    const scenarios = useMemo(() => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        if (saved) {
            try { return JSON.parse(saved) as Scenario[]; }
            catch { return []; }
        }
        return [];
    }, []);

    const selectedScenario = useMemo(() => {
        return scenarios.find(s => s.id === selectedScenarioId) || scenarios[0] || null;
    }, [scenarios, selectedScenarioId]);

    const monthNames = lang === 'pt' ? MONTH_NAMES_PT : MONTH_NAMES_EN;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Calculate day indices from scenario start or year start
    const yearStart = new Date(year, 0, 1);
    const monthStartDayIndex = Math.floor((new Date(year, month, 1).getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));

    const roster = useMemo(() => {
        if (!selectedScenario) return [];
        const teams = selectedScenario.teams;
        const result: Array<{ team: number; label: string; shifts: Array<{ day: number; shift: ShiftType; isToday: boolean }> }> = [];

        for (let t = 0; t < teams; t++) {
            const shifts: Array<{ day: number; shift: ShiftType; isToday: boolean }> = [];
            for (let d = 1; d <= daysInMonth; d++) {
                const dayIndex = monthStartDayIndex + (d - 1);
                const shift = getShiftForDay(selectedScenario, dayIndex, t);
                const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
                shifts.push({ day: d, shift, isToday });
            }
            result.push({
                team: t,
                label: TEAM_LABELS[t] || `T${t + 1}`,
                shifts,
            });
        }
        return result;
    }, [selectedScenario, daysInMonth, monthStartDayIndex, year, month, today]);

    const stats = useMemo(() => {
        if (!selectedScenario || roster.length === 0) return null;

        const teamStats = roster.map(r => {
            const workDays = r.shifts.filter(s => s.shift !== 'F').length;
            const offDays = r.shifts.filter(s => s.shift === 'F').length;
            const morningShifts = r.shifts.filter(s => s.shift === 'M').length;
            const afternoonShifts = r.shifts.filter(s => s.shift === 'T').length;
            const nightShifts = r.shifts.filter(s => s.shift === 'N').length;
            return { ...r, workDays, offDays, morningShifts, afternoonShifts, nightShifts };
        });

        return teamStats;
    }, [roster, selectedScenario]);

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else { setMonth(m => m - 1); }
    };

    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else { setMonth(m => m + 1); }
    };

    return (
        <div className="max-w-full mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <Users className="w-8 h-8 text-blue-400" />
                    {lang === 'pt' ? 'Gestao de Equipas' : 'Team Roster'}
                </h1>
                <p className="text-gray-400">
                    {lang === 'pt'
                        ? 'Visualize a atribuicao de turnos por equipa para cada dia do mes.'
                        : 'View team shift assignments for each day of the month.'}
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <select
                    value={selectedScenarioId || (scenarios[0]?.id || '')}
                    onChange={e => setSelectedScenarioId(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                    {scenarios.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.name} ({s.teams} {lang === 'pt' ? 'equipas' : 'teams'})
                        </option>
                    ))}
                </select>

                <div className="flex items-center gap-2 ml-auto">
                    <button onClick={prevMonth} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <span className="text-white font-semibold text-lg min-w-[180px] text-center">
                        {monthNames[month]} {year}
                    </span>
                    <button onClick={nextMonth} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {scenarios.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                    <p>{lang === 'pt' ? 'Nenhum cenario disponivel. Crie um primeiro.' : 'No scenarios available. Create one first.'}</p>
                </div>
            ) : (
                <>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-yellow-500" />
                            <span className="text-sm text-gray-400">{lang === 'pt' ? 'Manha' : 'Morning'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-orange-500" />
                            <span className="text-sm text-gray-400">{lang === 'pt' ? 'Tarde' : 'Afternoon'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-blue-600" />
                            <span className="text-sm text-gray-400">{lang === 'pt' ? 'Noite' : 'Night'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-gray-600" />
                            <span className="text-sm text-gray-400">{lang === 'pt' ? 'Folga' : 'Off'}</span>
                        </div>
                    </div>

                    {/* Roster Table */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-3 text-gray-400 text-sm font-medium sticky left-0 bg-gray-800 z-10 min-w-[60px]">
                                        {lang === 'pt' ? 'Equipa' : 'Team'}
                                    </th>
                                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                                        const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
                                        const date = new Date(year, month, d);
                                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                        return (
                                            <th
                                                key={d}
                                                className={`text-center p-2 text-xs font-medium min-w-[36px] ${
                                                    isToday ? 'text-blue-400 bg-blue-500/10' : isWeekend ? 'text-gray-500' : 'text-gray-400'
                                                }`}
                                            >
                                                <div>{d}</div>
                                                <div className="text-[10px] text-gray-600">
                                                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][date.getDay()]}
                                                </div>
                                            </th>
                                        );
                                    })}
                                    <th className="text-center p-2 text-xs text-gray-400 font-medium min-w-[50px]">
                                        {lang === 'pt' ? 'Folgas' : 'Off'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats ? stats.map(team => (
                                    <tr key={team.team} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-3 sticky left-0 bg-gray-800 z-10">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-3 h-3 rounded-full ${TEAM_COLORS[team.team % TEAM_COLORS.length]}`} />
                                                <span className="text-white font-medium text-sm">{team.label}</span>
                                            </div>
                                        </td>
                                        {team.shifts.map(s => (
                                            <td key={s.day} className="text-center p-1">
                                                <div
                                                    className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold text-white ${
                                                        getShiftColor(s.shift)
                                                    } ${s.isToday ? 'ring-2 ring-blue-400' : ''} ${
                                                        s.shift === 'F' ? 'opacity-50' : ''
                                                    }`}
                                                    title={`${s.day}/${month + 1}: ${s.shift === 'M' ? (lang === 'pt' ? 'Manha' : 'Morning') : s.shift === 'T' ? (lang === 'pt' ? 'Tarde' : 'Afternoon') : s.shift === 'N' ? (lang === 'pt' ? 'Noite' : 'Night') : (lang === 'pt' ? 'Folga' : 'Off')}`}
                                                >
                                                    {getShiftLabel(s.shift)}
                                                </div>
                                            </td>
                                        ))}
                                        <td className="text-center p-2">
                                            <span className="text-green-400 font-bold text-sm">{team.offDays}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={daysInMonth + 2} className="text-center p-8 text-gray-500">
                                            {lang === 'pt' ? 'Selecione um cenario' : 'Select a scenario'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Team Summary Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                            {stats.map(team => (
                                <div key={team.team} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`w-3 h-3 rounded-full ${TEAM_COLORS[team.team % TEAM_COLORS.length]}`} />
                                        <span className="text-white font-semibold">
                                            {lang === 'pt' ? 'Equipa' : 'Team'} {team.label}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">{lang === 'pt' ? 'Trabalho' : 'Work'}</span>
                                            <span className="text-white font-medium">{team.workDays} {lang === 'pt' ? 'dias' : 'days'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">{lang === 'pt' ? 'Folgas' : 'Off'}</span>
                                            <span className="text-green-400 font-medium">{team.offDays} {lang === 'pt' ? 'dias' : 'days'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">{lang === 'pt' ? 'Manhas' : 'Mornings'}</span>
                                            <span className="text-yellow-400 font-medium">{team.morningShifts}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">{lang === 'pt' ? 'Tardes' : 'Afternoons'}</span>
                                            <span className="text-orange-400 font-medium">{team.afternoonShifts}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">{lang === 'pt' ? 'Noites' : 'Nights'}</span>
                                            <span className="text-blue-400 font-medium">{team.nightShifts}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TeamRoster;
