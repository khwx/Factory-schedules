import { Scenario, YearlyAnalysis } from '../types';
import { generateYearCalendar, analyzeYearCalendar } from './calendar';
import { getPortugueseHolidays, countHolidaysOff, getHolidaysWorked } from './holidays';

export interface TeamAnalysis {
    teamNumber: number;
    yearlyAnalysis: YearlyAnalysis;
    holidaysWorked: number;
    holidaysOff: number;
}

export interface FairnessAnalysis {
    isBalanced: boolean;
    maxDifference: number;
    teamAnalyses: TeamAnalysis[];
    insights: string[];
}

/**
 * Analyze fairness across all teams in a scenario
 */
export const analyzeTeamFairness = (scenario: Scenario, year: number): FairnessAnalysis => {
    const { teams, pattern } = scenario;
    const teamAnalyses: TeamAnalysis[] = [];
    const holidays = getPortugueseHolidays(year);

    // Generate analysis for each team
    for (let teamNum = 0; teamNum < teams; teamNum++) {
        const calendar = generateYearCalendar(scenario, year, teamNum);
        const analysis = analyzeYearCalendar(calendar, year);
        const holidaysWorked = getHolidaysWorked(calendar, holidays).length;
        const holidaysOff = countHolidaysOff(calendar, holidays);

        teamAnalyses.push({
            teamNumber: teamNum + 1,
            yearlyAnalysis: analysis,
            holidaysWorked,
            holidaysOff,
        });
    }

    // Calculate fairness metrics
    const weekendCounts = teamAnalyses.map(t => t.yearlyAnalysis.totalWeekends);
    const offDayCounts = teamAnalyses.map(t => t.yearlyAnalysis.totalOffDays);
    const holidaysCounts = teamAnalyses.map(t => t.holidaysWorked);

    const maxWeekends = Math.max(...weekendCounts);
    const minWeekends = Math.min(...weekendCounts);
    const weekendDiff = maxWeekends - minWeekends;

    const maxOffDays = Math.max(...offDayCounts);
    const minOffDays = Math.min(...offDayCounts);
    const offDayDiff = maxOffDays - minOffDays;

    const maxHolidays = Math.max(...holidaysCounts);
    const minHolidays = Math.min(...holidaysCounts);
    const holidayDiff = maxHolidays - minHolidays;

    const maxDifference = Math.max(weekendDiff, offDayDiff, holidayDiff);
    const isBalanced = weekendDiff <= 1 && offDayDiff <= 1 && holidayDiff <= 1;

    // Generate insights
    const insights: string[] = [];

    if (isBalanced) {
        insights.push('✅ Excellent balance: All teams have similar schedules.');
    } else {
        if (weekendDiff > 1) {
            const bestTeam = teamAnalyses.find(t => t.yearlyAnalysis.totalWeekends === maxWeekends);
            const worstTeam = teamAnalyses.find(t => t.yearlyAnalysis.totalWeekends === minWeekends);
            insights.push(`⚠️ Desequilíbrio de fins de semana: Turno ${String.fromCharCode(64 + (bestTeam?.teamNumber || 0))} tem mais ${weekendDiff} fins de semana de folga que o Turno ${String.fromCharCode(64 + (worstTeam?.teamNumber || 0))}.`);
        }

        if (offDayDiff > 1) {
            insights.push(`⚠️ Desequilíbrio de dias de folga: diferença de ${offDayDiff} dias entre turnos.`);
        }

        if (holidayDiff > 1) {
            const bestTeam = teamAnalyses.find(t => t.holidaysWorked === maxHolidays);
            const worstTeam = teamAnalyses.find(t => t.holidaysWorked === minHolidays);
            insights.push(`💰 Desequilíbrio de feriados: Turno ${String.fromCharCode(64 + (bestTeam?.teamNumber || 0))} trabalha mais ${holidayDiff} feriados que o Turno ${String.fromCharCode(64 + (worstTeam?.teamNumber || 0))}.`);
        }
    }

    // Check for pattern length vs team count
    if (pattern.length % teams !== 0) {
        insights.push('ℹ️ Pattern length is not divisible by team count. This may cause rotation imbalances over time.');
    }

    return {
        isBalanced,
        maxDifference,
        teamAnalyses,
        insights,
    };
};
