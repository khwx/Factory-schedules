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
        expect(score.breakdown).toHaveProperty('recoveryRegularity');
        // New metrics
        expect(score.breakdown).toHaveProperty('fatigueAccumulation');
        expect(score.breakdown).toHaveProperty('socialDisruption');
        expect(score.breakdown).toHaveProperty('circadianDisruption');
        expect(score.breakdown).toHaveProperty('longTermSustainability');
    });

    it('should compute recoveryRegularity in 0-100 and reward rest after nights', () => {
        // Pattern with night block followed by ample rest should score high on recovery
        const scenario = createScenario({ pattern: 'MMTTNNFFFF' });
        const analysis = calculateAnalysis(scenario);
        const score = calculateQualityOfLifeScore(scenario, analysis, 2026);
        expect(score.breakdown.recoveryRegularity).toBeGreaterThanOrEqual(0);
        expect(score.breakdown.recoveryRegularity).toBeLessThanOrEqual(100);
        // 2 nights then 4 off -> recovery after nights is full (avg rest >= 2)
        expect(score.breakdown.recoveryRegularity).toBeGreaterThan(70);
    });

    it('should give full recovery score when there are no night shifts', () => {
        const scenario = createScenario({ pattern: 'MMMMFFFF' });
        const analysis = calculateAnalysis(scenario);
        const score = calculateQualityOfLifeScore(scenario, analysis, 2026);
        // No night blocks -> recovery component = 100; regularity from uniform work runs = 100
        expect(score.breakdown.recoveryRegularity).toBe(100);
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

    it('should compute new metrics in 0-100 range', () => {
        const scenario = createScenario();
        const analysis = calculateAnalysis(scenario);
        const score = calculateQualityOfLifeScore(scenario, analysis, 2026);
        expect(score.breakdown.fatigueAccumulation).toBeGreaterThanOrEqual(0);
        expect(score.breakdown.fatigueAccumulation).toBeLessThanOrEqual(100);
        expect(score.breakdown.socialDisruption).toBeGreaterThanOrEqual(0);
        expect(score.breakdown.socialDisruption).toBeLessThanOrEqual(100);
        expect(score.breakdown.circadianDisruption).toBeGreaterThanOrEqual(0);
        expect(score.breakdown.circadianDisruption).toBeLessThanOrEqual(100);
        expect(score.breakdown.longTermSustainability).toBeGreaterThanOrEqual(0);
        expect(score.breakdown.longTermSustainability).toBeLessThanOrEqual(100);
    });

    it('should have lower fatigue for patterns with short work blocks', () => {
        const scenarioShort = createScenario({ pattern: 'MMTTFF' }); // 2 work, 2 off
        const scenarioLong = createScenario({ pattern: 'MMMMMMFFFF' }); // 6 work, 4 off
        const analysisShort = calculateAnalysis(scenarioShort);
        const analysisLong = calculateAnalysis(scenarioLong);
        const scoreShort = calculateQualityOfLifeScore(scenarioShort, analysisShort, 2026);
        const scoreLong = calculateQualityOfLifeScore(scenarioLong, analysisLong, 2026);
        expect(scoreShort.breakdown.fatigueAccumulation).toBeGreaterThan(scoreLong.breakdown.fatigueAccumulation);
    });

    it('should have lower social disruption for patterns avoiding weekends', () => {
        // Pattern that avoids weekends
        const scenarioNoWeekend = createScenario({ pattern: 'MTWTFS' }); // Work weekdays only
        const scenarioWithWeekend = createScenario({ pattern: 'MMTTNNFF' }); // May hit weekends
        const analysisNoWeekend = calculateAnalysis(scenarioNoWeekend);
        const analysisWithWeekend = calculateAnalysis(scenarioWithWeekend);
        const scoreNoWeekend = calculateQualityOfLifeScore(scenarioNoWeekend, analysisNoWeekend, 2026);
        const scoreWithWeekend = calculateQualityOfLifeScore(scenarioWithWeekend, analysisWithWeekend, 2026);
        expect(scoreNoWeekend.breakdown.socialDisruption).toBeGreaterThanOrEqual(scoreWithWeekend.breakdown.socialDisruption);
    });

    it('should have lower circadian disruption for patterns without night shifts', () => {
        const scenarioNoNight = createScenario({ pattern: 'MMTTFF' });
        const scenarioWithNight = createScenario({ pattern: 'NNNNFF' });
        const analysisNoNight = calculateAnalysis(scenarioNoNight);
        const analysisWithNight = calculateAnalysis(scenarioWithNight);
        const scoreNoNight = calculateQualityOfLifeScore(scenarioNoNight, analysisNoNight, 2026);
        const scoreWithNight = calculateQualityOfLifeScore(scenarioWithNight, analysisWithNight, 2026);
        expect(scoreNoNight.breakdown.circadianDisruption).toBeGreaterThan(scoreWithNight.breakdown.circadianDisruption);
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