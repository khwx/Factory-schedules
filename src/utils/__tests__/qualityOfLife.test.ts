import { describe, it, expect } from 'vitest';
import { calculateQualityOfLifeScore, detectCriticalPeriods } from '../qualityOfLife';
import { Scenario, AnalysisResult } from '../../types';
import { calculateAnalysis } from '../calculations';

function createScenario(overrides: Partial<Scenario> = {}): Scenario {
    return {
        id: 'qol-1',
        name: 'QoL Test',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFFFF',
        ...overrides,
    };
}

describe('calculateQualityOfLifeScore', () => {
    it('should return a score object with overall 0-100', () => {
        const scenario = createScenario();
        const analysis = calculateAnalysis(scenario);
        const score = calculateQualityOfLifeScore(scenario, analysis, 2026);
        expect(score.overall).toBeGreaterThanOrEqual(0);
        expect(score.overall).toBeLessThanOrEqual(100);
    });

    it('should include all breakdown categories', () => {
        const scenario = createScenario();
        const analysis = calculateAnalysis(scenario);
        const score = calculateQualityOfLifeScore(scenario, analysis, 2026);
        expect(score.breakdown).toHaveProperty('weekendsCoverage');
        expect(score.breakdown).toHaveProperty('workLifeBalance');
        expect(score.breakdown).toHaveProperty('consecutiveRest');
        expect(score.breakdown).toHaveProperty('nightShiftImpact');
        expect(score.breakdown).toHaveProperty('holidaysCoverage');
    });

    it('should assign a valid grade', () => {
        const scenario = createScenario();
        const analysis = calculateAnalysis(scenario);
        const score = calculateQualityOfLifeScore(scenario, analysis, 2026);
        expect(['A+', 'A', 'B', 'C', 'D', 'F']).toContain(score.grade);
    });

    it('should produce a high score for a balanced schedule', () => {
        const scenario = createScenario({ pattern: 'MMTTNNFFFF', shiftDuration: 8 });
        const analysis = calculateAnalysis(scenario);
        const score = calculateQualityOfLifeScore(scenario, analysis, 2026);
        // Balanced 4-on/4-off style should score reasonably well
        expect(score.overall).toBeGreaterThan(50);
    });

    it('should generate insights array', () => {
        const scenario = createScenario();
        const analysis = calculateAnalysis(scenario);
        const score = calculateQualityOfLifeScore(scenario, analysis, 2026);
        expect(Array.isArray(score.insights)).toBe(true);
    });

    it('should work with a manually crafted analysis result', () => {
        const analysis: AnalysisResult = {
            avgWeeklyHours: 40,
            weeklyHoursDifference: 0,
            totalAnnualHours: 2080,
            weekendsOffPerYear: 26,
            weekendsOffPerMonthAvg: 2.16,
            totalOffDaysPerYear: 150,
            qualitative: [],
            multiYearAnalysis: [],
        };
        const score = calculateQualityOfLifeScore(createScenario(), analysis, 2026);
        expect(score.overall).toBeGreaterThan(0);
    });
});

describe('detectCriticalPeriods', () => {
    it('should return an array sorted by severity', () => {
        const scenario = createScenario();
        const periods = detectCriticalPeriods(scenario, 2026);
        expect(Array.isArray(periods)).toBe(true);
    });

    it('should sort periods by severity descending (high first)', () => {
        const scenario = createScenario({ pattern: 'MMMMMFFFFF' }); // 5 work 5 off
        const periods = detectCriticalPeriods(scenario, 2026);
        for (let i = 1; i < periods.length; i++) {
            const order = { high: 3, medium: 2, low: 1 };
            expect(order[periods[i - 1].severity]).toBeGreaterThanOrEqual(order[periods[i].severity]);
        }
    });
});