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

export interface CoverageAnalysis {
    minCoverage: number;
    maxCoverage: number;
    daysWithZeroCoverage: number;
    daysWithLowCoverage: number;
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
        insights.push('✅ Equilíbrio excelente: Todas as equipas têm horários semelhantes.');
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
        insights.push('ℹ️ O tamanho do padrão não é divisível pelo número de equipas. Pode causar desequilíbrios a longo prazo.');
    }

    return {
        isBalanced,
        maxDifference,
        teamAnalyses,
        insights,
    };
};

export const analyzeCoverage = (scenario: Scenario, year: number): CoverageAnalysis => {
    const { teams } = scenario;
    const calendars = [];

    // Generate calendars for all teams
    for (let i = 0; i < teams; i++) {
        calendars.push(generateYearCalendar(scenario, year, i));
    }

    let minCoverage = teams;
    let maxCoverage = 0;
    let daysWithZeroCoverage = 0;
    let daysWithLowCoverage = 0; // Days where too many people work (less than 2 off)

    const daysInYear = calendars[0].length;

    for (let dayIdx = 0; dayIdx < daysInYear; dayIdx++) {
        let workingCount = 0;

        for (let teamIdx = 0; teamIdx < teams; teamIdx++) {
            if (calendars[teamIdx][dayIdx].shift !== 'F') {
                workingCount++;
            }
        }

        if (workingCount < minCoverage) minCoverage = workingCount;
        if (workingCount > maxCoverage) maxCoverage = workingCount;

        if (workingCount === 0) daysWithZeroCoverage++;
        // If we have 5 teams, we need 2 off. So max working is 3.
        // General rule: ensure at least 2 teams are off if teams >= 4?
        // User said: "no caso do haver 5 turnos temos que estar sempre 2 de folga."
        // Let's assume if teams >= 4, we want at least 2 off.
        const requiredOff = teams >= 4 ? 2 : 1;
        if ((teams - workingCount) < requiredOff) daysWithLowCoverage++;
    }

    const insights: string[] = [];
    if (daysWithZeroCoverage > 0) {
        insights.push(`⛔ CRÍTICO: Existem ${daysWithZeroCoverage} dias sem qualquer equipa a trabalhar!`);
    }

    if (daysWithLowCoverage > 0) {
        insights.push(`⚠️ Aviso de Cobertura: Existem ${daysWithLowCoverage} dias com menos de ${teams >= 4 ? 2 : 1} equipas de folga.`);
    }

    if (minCoverage > 0) {
        insights.push(`✅ Cobertura mínima garantida: ${minCoverage} equipa(s) sempre a trabalhar.`);
    }

    return {
        minCoverage,
        maxCoverage,
        daysWithZeroCoverage,
        daysWithLowCoverage,
        insights
    };
};
