import { useState, useEffect } from 'react';
import { generateYearCalendar } from '../utils/calendar';
import { getAllHolidays } from '../utils/portugueseHolidays';
import { Building2, Users, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import type { Scenario, DayInfo } from '../types';
import { loadValidatedScenarios } from '../utils/scenarioValidation';

interface UsageStats {
    teamSize: number;
    teamCount: number;
    workDays: number;
    weekends: number;
    holidays: number;
    avgHours: number;
}

interface Props {
    scenarios?: Scenario[];
}

export default function SystemHealth({ scenarios: propScenarios }: Props) {
    const [stats, setStats] = useState<UsageStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const scenarios: Scenario[] = propScenarios || loadValidatedScenarios();

            if (scenarios.length === 0) {
                setStats(null);
                return;
            }

            // Calculate aggregated stats
            const now = new Date();
            const holidays = getAllHolidays(now.getFullYear());

            let totalWorkDays = 0;
            let totalWeekendDays = 0;
            let totalHours = 0;
            let totalTeams = 0;

            scenarios.forEach((scenario: Scenario) => {
                const teamCount = scenario.teamPatterns?.length || scenario.teams;
                totalTeams += teamCount;

                const calendar = generateYearCalendar(scenario, now.getFullYear(), 0);
                calendar.forEach((day: DayInfo) => {
                    totalHours += scenario.shiftDuration;
                    if (day.isWeekend && !day.isWeekendOff) {
                        totalWeekendDays++;
                    }
                    if (day.shift === 'F') {
                        totalWorkDays++;
                    }
                });
            });

            const holidayCount = holidays.length;

            setStats({
                teamSize: Math.round(totalTeams / scenarios.length),
                teamCount: scenarios.length,
                workDays: totalWorkDays,
                weekends: totalWeekendDays,
                holidays: holidayCount,
                avgHours: totalHours / scenarios.length,
            });
        } catch {
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 text-gray-500">
                    <Building2 className="h-5 w-5" />
                    <span>Nenhum cenario encontrado</span>
                </div>
            </div>
        );
    }

    const statsCards = [
        { label: 'Equipas', value: stats.teamCount, icon: Building2, color: 'bg-indigo-50 text-indigo-600' },
        { label: 'Tamanho Medio', value: stats.teamSize, icon: Users, color: 'bg-blue-50 text-blue-600' },
        { label: 'Dias Trabalhados', value: stats.workDays, icon: Calendar, color: 'bg-green-50 text-green-600' },
        { label: 'Fins de Semana', value: stats.weekends, icon: Calendar, color: 'bg-amber-50 text-amber-600' },
        { label: 'Feriados/Anual', value: stats.holidays, icon: Calendar, color: 'bg-red-50 text-red-600' },
        { label: 'Media Horas/Cenario', value: stats.avgHours.toFixed(1), icon: Calendar, color: 'bg-purple-50 text-purple-600' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Saude do Sistema
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statsCards.map((card, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mb-3', card.color)}>
                            <card.icon className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-1">
                            {typeof card.value === 'number' && card.value % 1 === 0 ? card.value : card.value}
                        </div>
                        <div className="text-xs text-gray-500">{card.label}</div>
                    </div>
                ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Sistema operacional — {stats.teamCount} cenarios carregados</span>
                </div>
            </div>
        </div>
    );
}
