import { Scenario, AnalysisResult } from '../types';
import { generateMultiYearAnalysis, generateYearCalendar, analyzeYearCalendar } from './calendar';
import { calculateAdvancedMetrics, generateAdvancedInsights } from './advancedMetrics';

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
    const currentYearAnalysis = analyzeYearCalendar(currentYearCalendar, currentYear);

    const weekendsOff = currentYearAnalysis.totalWeekends;
    const totalOffDaysPerYear = currentYearAnalysis.totalOffDays;
    const weekendsOffPerMonthAvg = weekendsOff / 12;

    // 4. Multi-Year Analysis (5 years)
    const multiYearAnalysis = generateMultiYearAnalysis(scenario, currentYear);

    // 5. Advanced Metrics
    const advancedMetrics = calculateAdvancedMetrics(currentYearCalendar);
    const advancedInsights = generateAdvancedInsights(advancedMetrics);

    // 6. Qualitative Analysis
    const qualitative: string[] = [
        ...advancedInsights, // Add advanced insights first
    ];

    if (avgWeeklyHours > 42) {
        qualitative.push('⚠️ High average weekly hours. Consider reducing shift load.');
    } else if (avgWeeklyHours < 35) {
        qualitative.push('ℹ️ Low average weekly hours. May need additional coverage.');
    }

    if (weekendsOff < 20) {
        qualitative.push('⚠️ Few weekends off. May impact work-life balance.');
    } else if (weekendsOff >= 26) {
        qualitative.push('✅ Good weekend coverage for rest and family time.');
    }

    if (totalOffDaysPerYear < 150) {
        qualitative.push('⚠️ Low total off-days. Ensure adequate rest periods.');
    }

    return {
        avgWeeklyHours,
        totalAnnualHours,
        weekendsOffPerYear: weekendsOff,
        weekendsOffPerMonthAvg,
        totalOffDaysPerYear,
        qualitative,
        multiYearAnalysis,
        advancedMetrics, // Include advanced metrics
    };
};
