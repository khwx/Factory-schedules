import React, { useMemo, useState } from 'react';
import { Scenario } from '../types';
import { analyzeTeamFairness, analyzeCoverage } from '../utils/teamAnalysis';
import { Users, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import { useI18n } from '../i18n';

interface TeamFairnessProps {
    scenario: Scenario;
}

const TeamFairness: React.FC<TeamFairnessProps> = ({ scenario }) => {
    const { t } = useI18n();
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const fairness = useMemo(() => analyzeTeamFairness(scenario, selectedYear), [scenario, selectedYear]);
    const coverage = useMemo(() => analyzeCoverage(scenario, selectedYear), [scenario, selectedYear]);

    // Calculate accumulated hours if selectedYear >= 2026
    const accumulatedHoursMap = useMemo(() => {
        const accMap: Record<number, number> = {};

        if (selectedYear < 2026 || !scenario.weeklyHoursContract) {
            return accMap;
        }

        // Initialize map with 0
        for (let teamNum = 0; teamNum < scenario.teams; teamNum++) {
            accMap[teamNum + 1] = 0;
        }

        // Loop from 2026 up to selectedYear
        for (let y = 2026; y <= selectedYear; y++) {
            const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
            const daysInYear = isLeap ? 366 : 365;
            const annualContractHours = (scenario.weeklyHoursContract * daysInYear) / 7;

            // Analyze for each team
            const analysis = analyzeTeamFairness(scenario, y);

            analysis.teamAnalyses.forEach(team => {
                const diff = team.yearlyAnalysis.totalHoursWorked - annualContractHours;
                accMap[team.teamNumber] += diff;
            });
        }

        return accMap;
    }, [scenario, selectedYear]);

    if (scenario.teams <= 1) return null;

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Análise de Equidade da Equipa - {scenario.name}</h3>

                {/* Year Navigation */}
                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={() => setSelectedYear(y => y - 1)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Previous Year"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="text-sm text-gray-300 font-medium min-w-[60px] text-center">{selectedYear}</span>
                    <button
                        onClick={() => setSelectedYear(y => y + 1)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Next Year"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                {fairness.isBalanced ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                )}
            </div>

            <div className="p-4">
                {/* Insights */}
                <div className="mb-4 space-y-2">
                    {fairness.insightKeys.map((insightKey, idx) => {
                        let text = insightKey.key.startsWith('teamAnalysis.fairness.')
                            ? (t.teamAnalysis.fairness[insightKey.key.replace('teamAnalysis.fairness.', '') as keyof typeof t.teamAnalysis.fairness] as string) || ''
                            : (t.teamAnalysis.coverage[insightKey.key.replace('teamAnalysis.coverage.', '') as keyof typeof t.teamAnalysis.coverage] as string) || '';
                        if (insightKey.params) {
                            Object.entries(insightKey.params).forEach(([k, v]) => {
                                text = text.replace(`{${k}}`, String(v));
                            });
                        }
                        return (
                            <div
                                key={idx}
                                className={`p-3 rounded text-sm ${text.startsWith('✅')
                                    ? 'bg-green-900/30 text-green-300'
                                    : text.startsWith('⚠️') || text.startsWith('💰')
                                        ? 'bg-yellow-900/30 text-yellow-300'
                                        : 'bg-blue-900/30 text-blue-300'
                                    }`}
                            >
                                {text}
                            </div>
                        );
                    })}
                </div>

                {/* Coverage Analysis */}
                {coverage.insightKeys.length > 0 && (
                    <div className="mb-6 space-y-2 border-t border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-2">
                            <ShieldAlert className="w-4 h-4 text-blue-400" />
                            {t.teamAnalysis.coverage.title}
                        </h4>
                        {coverage.insightKeys.map((insightKey, idx) => {
                            let text = insightKey.key.startsWith('teamAnalysis.fairness.')
                                ? (t.teamAnalysis.fairness[insightKey.key.replace('teamAnalysis.fairness.', '') as keyof typeof t.teamAnalysis.fairness] as string) || ''
                                : (t.teamAnalysis.coverage[insightKey.key.replace('teamAnalysis.coverage.', '') as keyof typeof t.teamAnalysis.coverage] as string) || '';
                            if (insightKey.params) {
                                Object.entries(insightKey.params).forEach(([k, v]) => {
                                    text = text.replace(`{${k}}`, String(v));
                                });
                            }
                            return (
                                <div
                                    key={idx}
                                    className={`p-3 rounded text-sm ${text.startsWith('✅')
                                        ? 'bg-green-900/30 text-green-300'
                                        : text.startsWith('⛔')
                                            ? 'bg-red-900/30 text-red-300 border border-red-800'
                                            : 'bg-yellow-900/30 text-yellow-300'
                                        }`}
                                >
                                    {text}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Team Comparison Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50">
                                <th className="p-3 text-left text-gray-400 font-medium border-b border-gray-700">Turno</th>
                                <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Fins de Semana de Folga</th>
                                <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Total de Dias de Folga</th>
                                <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Feriados Trabalhados 💰</th>
                                <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Horas Anuais</th>
                                <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Dif. Horas</th>
                                <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Dif. Acumulada (2026+)</th>
                                <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Dif. Fins de Semana</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fairness.teamAnalyses.map((team, idx) => {
                                const avgWeekends = fairness.teamAnalyses.reduce((sum, t) => sum + t.yearlyAnalysis.totalWeekends, 0) / fairness.teamAnalyses.length;
                                const weekendDiff = team.yearlyAnalysis.totalWeekends - avgWeekends;

                                // Annual hour diff (vs average of teams) - keep existing logic or change to contract? 
                                // Existing logic was vs Average. Let's keep it consistent with previous state, 
                                // but note that "Dif. Acumulada" is vs Contract.
                                const avgHours = fairness.teamAnalyses.reduce((sum, t) => sum + t.yearlyAnalysis.totalHoursWorked, 0) / fairness.teamAnalyses.length;
                                const hoursDiff = team.yearlyAnalysis.totalHoursWorked - avgHours;

                                const accDiff = accumulatedHoursMap[team.teamNumber];

                                return (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-800/50' : ''}>
                                        <td className="p-3 text-white font-semibold border-b border-gray-700">Turno {String.fromCharCode(64 + team.teamNumber)}</td>
                                        <td className="p-3 text-center text-green-400 font-mono border-b border-gray-700">
                                            {team.yearlyAnalysis.totalWeekends}
                                        </td>
                                        <td className="p-3 text-center text-blue-400 font-mono border-b border-gray-700">
                                            {team.yearlyAnalysis.totalOffDays}
                                        </td>
                                        <td className="p-3 text-center text-yellow-400 font-mono border-b border-gray-700">
                                            {team.holidaysWorked}
                                        </td>
                                        <td className="p-3 text-center text-purple-400 font-mono border-b border-gray-700">
                                            {Number(team.yearlyAnalysis.totalHoursWorked.toFixed(1))}h
                                        </td>
                                        <td className={`p-3 text-center font-mono border-b border-gray-700 ${Math.abs(hoursDiff) < 0.1 ? 'text-gray-400' : hoursDiff > 0 ? 'text-red-400' : 'text-green-400'
                                            }`}>
                                            {hoursDiff > 0 ? '+' : ''}{Number(hoursDiff.toFixed(1))}h
                                        </td>
                                        <td className={`p-3 text-center font-mono border-b border-gray-700 ${selectedYear < 2026 ? 'text-gray-500' :
                                                Math.abs(accDiff || 0) < 1 ? 'text-gray-400' : (accDiff || 0) > 0 ? 'text-red-400' : 'text-green-400'
                                            }`}>
                                            {selectedYear < 2026 ? '-' : `${(accDiff || 0) > 0 ? '+' : ''}${Number((accDiff || 0).toFixed(1))}h`}
                                        </td>
                                        <td className={`p-3 text-center font-mono border-b border-gray-700 ${Math.abs(weekendDiff) < 0.5 ? 'text-gray-400' : weekendDiff > 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {weekendDiff > 0 ? '+' : ''}{weekendDiff.toFixed(1)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default TeamFairness;
