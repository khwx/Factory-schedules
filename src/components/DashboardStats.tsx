import React, { useMemo } from 'react';
import { Users, Clock, Calendar, Palmtree, Moon, Coffee } from 'lucide-react';
import { useI18n } from '../i18n';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';

interface DashboardStatsProps {
    scenarios: Scenario[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ scenarios }) => {
    const { lang } = useI18n();

    const stats = useMemo(() => {
        if (scenarios.length === 0) return null;

        const analyses = scenarios.map(s => calculateAnalysis(s));

        const totalScenarios = scenarios.length;
        const totalTeams = scenarios.reduce((sum, s) => sum + s.teams, 0);
        const avgHours = analyses.reduce((sum, a) => sum + a.avgWeeklyHours, 0) / totalScenarios;
        const avgWeekends = analyses.reduce((sum, a) => sum + a.weekendsOffPerYear, 0) / totalScenarios;
        const avgOffDays = analyses.reduce((sum, a) => sum + a.totalOffDaysPerYear, 0) / totalScenarios;
        const totalNightShifts = analyses.reduce((sum, a) => sum + (a.advancedMetrics?.totalNightShifts || 0), 0);
        const avgFridayNights = analyses.reduce((sum, a) => sum + (a.advancedMetrics?.fridayNightsOff || 0), 0) / totalScenarios;

        // Best scenario (most weekends off)
        const bestIdx = analyses.reduce((best, a, i) =>
            a.weekendsOffPerYear > analyses[best].weekendsOffPerYear ? i : best, 0);
        const bestScenario = scenarios[bestIdx];

        return {
            totalScenarios,
            totalTeams,
            avgHours,
            avgWeekends,
            avgOffDays,
            totalNightShifts,
            avgFridayNights,
            bestScenario,
        };
    }, [scenarios]);

    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs">{lang === 'pt' ? 'Cenarios' : 'Scenarios'}</span>
                </div>
                <p className="text-xl font-bold text-white">{stats.totalScenarios}</p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs">{lang === 'pt' ? 'Total Equipas' : 'Total Teams'}</span>
                </div>
                <p className="text-xl font-bold text-white">{stats.totalTeams}</p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{lang === 'pt' ? 'Media Horas' : 'Avg Hours'}</span>
                </div>
                <p className="text-xl font-bold text-white">{stats.avgHours.toFixed(1)}h</p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">{lang === 'pt' ? 'Media FDS' : 'Avg Weekends'}</span>
                </div>
                <p className="text-xl font-bold text-green-400">{stats.avgWeekends.toFixed(0)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Palmtree className="w-3.5 h-3.5" />
                    <span className="text-xs">{lang === 'pt' ? 'Media Folgas' : 'Avg Off Days'}</span>
                </div>
                <p className="text-xl font-bold text-green-400">{stats.avgOffDays.toFixed(0)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Moon className="w-3.5 h-3.5" />
                    <span className="text-xs">{lang === 'pt' ? 'Turnos Noite' : 'Night Shifts'}</span>
                </div>
                <p className="text-xl font-bold text-purple-400">{stats.totalNightShifts}</p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Coffee className="w-3.5 h-3.5" />
                    <span className="text-xs">{lang === 'pt' ? 'Sextas Livres' : 'Fridays Off'}</span>
                </div>
                <p className="text-xl font-bold text-pink-400">{stats.avgFridayNights.toFixed(0)}</p>
            </div>
        </div>
    );
};

export default DashboardStats;
