import { Scenario, YearlyAnalysis } from '../types';
import { generateYearCalendar, analyzeYearCalendar } from './calendar';
import { getAllHolidays, countHolidaysOff, getHolidaysWorked } from './holidays';
import { InsightKey } from './qualityOfLife';

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
    insightKeys: InsightKey[];
}

export interface CoverageAnalysis {
    minCoverage: number;
    maxCoverage: number;
    daysWithZeroCoverage: number;
    daysWithLowCoverage: number;
    insights: string[];
    insightKeys: InsightKey[];
}

/**
 * Analyze fairness across all teams in a scenario
 */
export const analyzeTeamFairness = (scenario: Scenario, year: number): FairnessAnalysis => {
    const { teams, pattern } = scenario;
    const teamAnalyses: TeamAnalysis[] = [];
    const holidays = getAllHolidays(year);

    // Generate analysis for each team
    for (let teamNum = 0; teamNum < teams; teamNum++) {
        const calendar = generateYearCalendar(scenario, year, teamNum);
        const analysis = analyzeYearCalendar(calendar, year, scenario.shiftDuration);
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

    // Generate insights with i18n keys
    const insights: string[] = [];
    const insightKeys: InsightKey[] = [];

    if (isBalanced) {
        insights.push('✅ Equilíbrio excelente: Todas as equipas têm horários semelhantes.');
        insightKeys.push({ key: 'teamAnalysis.fairness.balanced' });
    } else {
        if (weekendDiff > 1) {
            const bestTeam = teamAnalyses.find(t => t.yearlyAnalysis.totalWeekends === maxWeekends);
            const worstTeam = teamAnalyses.find(t => t.yearlyAnalysis.totalWeekends === minWeekends);
            const bestTeamLetter = String.fromCharCode(64 + (bestTeam?.teamNumber || 0));
            const worstTeamLetter = String.fromCharCode(64 + (worstTeam?.teamNumber || 0));
            insights.push(`⚠️ Desequilíbrio de fins de semana: Turno ${bestTeamLetter} tem mais ${weekendDiff} fins de semana de folga que o Turno ${worstTeamLetter}.`);
            insightKeys.push({
                key: 'teamAnalysis.fairness.weekendImbalance',
                params: { bestTeam: bestTeamLetter, worstTeam: worstTeamLetter, diff: weekendDiff }
            });
        }

        if (offDayDiff > 1) {
            insights.push(`⚠️ Desequilíbrio de dias de folga: diferença de ${offDayDiff} dias entre turnos.`);
            insightKeys.push({
                key: 'teamAnalysis.fairness.offDayImbalance',
                params: { diff: offDayDiff }
            });
        }

        if (holidayDiff > 1) {
            const bestTeam = teamAnalyses.find(t => t.holidaysWorked === maxHolidays);
            const worstTeam = teamAnalyses.find(t => t.holidaysWorked === minHolidays);
            const bestTeamLetter = String.fromCharCode(64 + (bestTeam?.teamNumber || 0));
            const worstTeamLetter = String.fromCharCode(64 + (worstTeam?.teamNumber || 0));
            insights.push(`💰 Desequilíbrio de feriados: Turno ${bestTeamLetter} trabalha mais ${holidayDiff} feriados que o Turno ${worstTeamLetter}.`);
            insightKeys.push({
                key: 'teamAnalysis.fairness.holidayImbalance',
                params: { bestTeam: bestTeamLetter, worstTeam: worstTeamLetter, diff: holidayDiff }
            });
        }
    }

    // Check for pattern length vs team count
    if (pattern.length % teams !== 0) {
        insights.push('ℹ️ O tamanho do padrão não é divisível pelo número de equipas. Pode causar desequilíbrios a longo prazo.');
        insightKeys.push({ key: 'teamAnalysis.fairness.patternNotDivisible' });
    }

    return {
        isBalanced,
        maxDifference,
        teamAnalyses,
        insights,
        insightKeys,
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

    // Generate insights with i18n keys
    const insights: string[] = [];
    const insightKeys: InsightKey[] = [];

    if (daysWithZeroCoverage > 0) {
        insights.push(`⛔ CRÍTICO: Existem ${daysWithZeroCoverage} dias sem qualquer equipa a trabalhar!`);
        insightKeys.push({
            key: 'teamAnalysis.coverage.zeroCoverage',
            params: { count: daysWithZeroCoverage }
        });
    }

    if (daysWithLowCoverage > 0) {
        const requiredOff = teams >= 4 ? 2 : 1;
        insights.push(`⚠️ Aviso de Cobertura: Existem ${daysWithLowCoverage} dias com menos de ${requiredOff} equipas de folga.`);
        insightKeys.push({
            key: 'teamAnalysis.coverage.lowCoverage',
            params: { count: daysWithLowCoverage, requiredOff }
        });
    }

    if (minCoverage > 0) {
        insights.push(`✅ Cobertura mínima garantida: ${minCoverage} equipa(s) sempre a trabalhar.`);
        insightKeys.push({
            key: 'teamAnalysis.coverage.minGuaranteed',
            params: { count: minCoverage }
        });
    }

    return {
        minCoverage,
        maxCoverage,
        daysWithZeroCoverage,
        daysWithLowCoverage,
        insights,
        insightKeys,
    };
};
