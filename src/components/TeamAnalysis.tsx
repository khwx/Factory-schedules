import React, { useMemo } from 'react';
import { Scenario } from '../types';
import { generateYearCalendar } from '../utils/calendar';
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';

interface TeamAnalysisProps {
    scenario: Scenario;
}

interface TeamData {
    index: number;
    label: string;
    pattern: string;
    totalShifts: number;
    totalOffDays: number;
    weekendsOff: number;
    nightShifts: number;
    avgWeeklyHours: number;
}

const TeamAnalysis: React.FC<TeamAnalysisProps> = ({ scenario }) => {
    const teamData = useMemo<TeamData[]>(() => {
        const currentYear = new Date().getFullYear();
        const teams: TeamData[] = [];

        for (let i = 0; i < scenario.teams; i++) {
            const calendar = generateYearCalendar(scenario, currentYear, i);
            const pattern = scenario.teamPatterns?.[i] || scenario.pattern;
            const cleanedPattern = pattern.toUpperCase().replace(/\s/g, '');

            const totalShifts = calendar.filter(d => d.shift !== 'F').length;
            const totalOffDays = calendar.filter(d => d.shift === 'F').length;
            const weekendsOff = calendar.filter(d => d.isWeekend && d.isWeekendOff).length;
            const nightShifts = calendar.filter(d => d.shift === 'N').length;

            const workDays = cleanedPattern.split('').filter(c => c !== 'F').length;
            const cycleLength = cleanedPattern.length;
            const cycleWeeks = cycleLength / 7;
            const avgWeeklyHours = (workDays * scenario.shiftDuration) / cycleWeeks;

            teams.push({
                index: i,
                label: `Equipa ${String.fromCharCode(65 + i)}`,
                pattern: cleanedPattern,
                totalShifts,
                totalOffDays,
                weekendsOff,
                nightShifts,
                avgWeeklyHours,
            });
        }

        return teams;
    }, [scenario]);

    const fairness = useMemo(() => {
        if (teamData.length < 2) return null;

        const offDays = teamData.map(t => t.totalOffDays);
        const maxOff = Math.max(...offDays);
        const minOff = Math.min(...offDays);
        const diff = maxOff - minOff;

        const weekends = teamData.map(t => t.weekendsOff);
        const maxWeekends = Math.max(...weekends);
        const minWeekends = Math.min(...weekends);
        const weekendsDiff = maxWeekends - minWeekends;

        const hours = teamData.map(t => t.avgWeeklyHours);
        const maxHours = Math.max(...hours);
        const minHours = Math.min(...hours);
        const hoursDiff = maxHours - minHours;

        return {
            offDaysDiff: diff,
            weekendsDiff,
            hoursDiff: Math.round(hoursDiff * 100) / 100,
            isBalanced: diff <= 2 && weekendsDiff <= 1,
        };
    }, [teamData]);

    if (scenario.teams <= 1) return null;

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Analise por Equipa</h3>
                </div>
                {fairness && (
                    <span className={`text-xs px-2 py-1 rounded ${fairness.isBalanced ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {fairness.isBalanced ? 'Equilibrado' : 'Desiquilibrado'}
                    </span>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-900/50">
                            <th className="p-3 text-xs text-gray-400 font-medium">Equipa</th>
                            <th className="p-3 text-xs text-gray-400 font-medium">Padrao</th>
                            <th className="p-3 text-xs text-gray-400 font-medium text-right">Turnos/Ano</th>
                            <th className="p-3 text-xs text-gray-400 font-medium text-right">Dias Folga</th>
                            <th className="p-3 text-xs text-gray-400 font-medium text-right">FDS Folga</th>
                            <th className="p-3 text-xs text-gray-400 font-medium text-right">Turnos Noite</th>
                            <th className="p-3 text-xs text-gray-400 font-medium text-right">Horas/Semana</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamData.map((team) => {
                            const isBestOff = fairness && team.totalOffDays === Math.max(...teamData.map(t => t.totalOffDays));
                            const isWorstOff = fairness && team.totalOffDays === Math.min(...teamData.map(t => t.totalOffDays));

                            return (
                                <tr key={team.index} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                                    <td className="p-3 text-white font-medium">{team.label}</td>
                                    <td className="p-3 font-mono text-xs text-gray-400">{team.pattern}</td>
                                    <td className="p-3 text-right text-gray-300">{team.totalShifts}</td>
                                    <td className={`p-3 text-right font-medium ${isBestOff ? 'text-green-400' : isWorstOff ? 'text-red-400' : 'text-gray-300'}`}>
                                        {team.totalOffDays}
                                        {isBestOff && <CheckCircle className="w-3 h-3 inline ml-1" />}
                                        {isWorstOff && teamData.length > 1 && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                                    </td>
                                    <td className="p-3 text-right text-gray-300">{team.weekendsOff}</td>
                                    <td className="p-3 text-right text-gray-300">{team.nightShifts}</td>
                                    <td className="p-3 text-right text-gray-300">{team.avgWeeklyHours.toFixed(1)}h</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {fairness && !fairness.isBalanced && (
                <div className="p-4 border-t border-gray-700 bg-yellow-900/20">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-200">
                            <p className="font-medium mb-1">Desiquilibrado!</p>
                            <ul className="list-disc list-inside text-yellow-300/80 space-y-0.5">
                                {fairness.offDaysDiff > 2 && (
                                    <li>Diferenca de {fairness.offDaysDiff} dias de folga entre equipas</li>
                                )}
                                {fairness.weekendsDiff > 1 && (
                                    <li>Diferenca de {fairness.weekendsDiff} fins de semana de folga</li>
                                )}
                                {fairness.hoursDiff > 0.5 && (
                                    <li>Diferenca de {fairness.hoursDiff}h semanais entre equipas</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamAnalysis;
