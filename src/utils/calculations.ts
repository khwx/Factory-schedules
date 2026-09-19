import { Scenario, AnalysisResult } from '../types';
import { generateMultiYearAnalysis, generateYearCalendar, analyzeYearCalendar } from './calendar';
import { calculateAdvancedMetrics, generateAdvancedInsights, generateAdvancedInsightKeys } from './advancedMetrics';
import { InsightKey } from './qualityOfLife';

/**
 * Calculate comprehensive analysis for a shift schedule scenario.
 * 
 * @param scenario - The schedule scenario to analyze
 * @returns Complete analysis results including hours, weekends, and qualitative insights
 * 
 * @example
 * ```typescript
 * const scenario: Scenario = {
 *   id: '1',
 *   name: '5 Teams - Standard',
 *   teams: 5,
 *   shiftDuration: 8,
 *   pattern: 'MMTTNNFFFF'
 * };
 * const analysis = calculateAnalysis(scenario);
 * console.log(analysis.avgWeeklyHours); // Average weekly hours
 * ```
 */
export const calculateAnalysis = (scenario: Scenario): AnalysisResult => {
    const { teams, shiftDuration, pattern } = scenario;
    const patternLength = pattern.length;

    // Basic validation
    if (patternLength === 0 || teams === 0) {
        return {
            avgWeeklyHours: 0,
            totalAnnualHours: 0,
            weekendsOffPerYear: 0,
            weekendsOffPerMonthAvg: 0,
            totalOffDaysPerYear: 0,
            qualitative: [],
            multiYearAnalysis: [],
        };
    }

    // 1. Average Weekly Hours
    const shiftsPerCycle = pattern.split('').filter(c => c !== 'F').length;
    const cycleLengthDays = patternLength;
    const cycleLengthWeeks = cycleLengthDays / 7;

    const avgWeeklyHours = (shiftsPerCycle * shiftDuration) / cycleLengthWeeks;

    // 2. Total Annual Hours
    const totalAnnualHours = (365 / cycleLengthDays) * shiftsPerCycle * shiftDuration;

    // 3. Current Year Analysis
    const currentYear = new Date().getFullYear();
    const currentYearCalendar = generateYearCalendar(scenario, currentYear);
    const currentYearAnalysis = analyzeYearCalendar(currentYearCalendar, currentYear, scenario.shiftDuration);

    const weekendsOff = currentYearAnalysis.totalWeekends;
    const totalOffDaysPerYear = currentYearAnalysis.totalOffDays;
    const weekendsOffPerMonthAvg = weekendsOff / 12;

    // 4. Multi-Year Analysis (5 years)
    const multiYearAnalysis = generateMultiYearAnalysis(scenario, currentYear);

    // 5. Advanced Metrics
    const advancedMetrics = calculateAdvancedMetrics(currentYearCalendar);
    const advancedInsights = generateAdvancedInsights(advancedMetrics);
    const advancedInsightKeys = generateAdvancedInsightKeys(advancedMetrics);

    // 6. Qualitative Analysis
    const qualitative: string[] = [
        ...advancedInsights, // Add advanced insights first
    ];
    const qualitativeKeys: InsightKey[] = [
        ...advancedInsightKeys,
    ];

    if (avgWeeklyHours > 42) {
        qualitative.push('Media de horas semanais elevada. Considere reduzir a carga horaria.');
        qualitativeKeys.push({ key: 'calcInsights.weeklyHoursHigh' });
    } else if (avgWeeklyHours < 35) {
        qualitative.push('Media de horas semanais baixa. Pode necessitar de cobertura adicional.');
        qualitativeKeys.push({ key: 'calcInsights.weeklyHoursLow' });
    }

    if (weekendsOff < 20) {
        qualitative.push('Poucos fins de semana de folga. Pode afetar o equilibrio vida-trabalho.');
        qualitativeKeys.push({ key: 'calcInsights.weekendsFew' });
    } else if (weekendsOff >= 26) {
        qualitative.push('Boa cobertura de fins de semana para descanso e familia.');
        qualitativeKeys.push({ key: 'calcInsights.weekendsGood' });
    }

    if (totalOffDaysPerYear < 150) {
        qualitative.push('Poucos dias de folga totais. Assegure periodos de descanso adequados.');
        qualitativeKeys.push({ key: 'calcInsights.offDaysFew' });
    }

    let weeklyHoursDifference: number | undefined;
    if (scenario.weeklyHoursContract) {
        weeklyHoursDifference = avgWeeklyHours - scenario.weeklyHoursContract;

        if (weeklyHoursDifference > 0.5) {
            qualitative.push(`Excede o contrato em ${weeklyHoursDifference.toFixed(1)} horas semanais.`);
            qualitativeKeys.push({ key: 'calcInsights.contractExceeds', params: { hours: weeklyHoursDifference.toFixed(1) } });
        } else if (weeklyHoursDifference < -0.5) {
            qualitative.push(`Abaixo do contrato em ${Math.abs(weeklyHoursDifference).toFixed(1)} horas semanais.`);
            qualitativeKeys.push({ key: 'calcInsights.contractBelow', params: { hours: Math.abs(weeklyHoursDifference).toFixed(1) } });
        } else {
            qualitative.push('Cumpre o horario contratual.');
            qualitativeKeys.push({ key: 'calcInsights.contractMeets' });
        }
    }

    return {
        avgWeeklyHours,
        weeklyHoursDifference,
        totalAnnualHours,
        weekendsOffPerYear: weekendsOff,
        weekendsOffPerMonthAvg,
        totalOffDaysPerYear,
        qualitative,
        qualitativeKeys,
        multiYearAnalysis,
        advancedMetrics, // Include advanced metrics
    };
};
