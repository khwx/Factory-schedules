import { describe, it, expect } from 'vitest';
import { analyzeTeamFairness, analyzeCoverage } from '../teamAnalysis';
import { Scenario } from '../../types';

function createScenario(overrides: Partial<Scenario> = {}): Scenario {
    return {
        id: 'team-1',
        name: 'Team Test',
        teams: 4,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFF',
        teamPatterns: ['MMTTNNFF', 'NNFFMMTT', 'TTNNFFMM', 'FFMMTTNN'],
        ...overrides,
    };
}

describe('analyzeTeamFairness', () => {
    it('should analyze all teams', () => {
        const scenario = createScenario();
        const result = analyzeTeamFairness(scenario, 2026);
        expect(result.teamAnalyses).toHaveLength(4);
        expect(result.teamAnalyses[0].teamNumber).toBe(1);
        expect(result.teamAnalyses[3].teamNumber).toBe(4);
    });

    it('should include holiday work/off stats per team', () => {
        const scenario = createScenario();
        const result = analyzeTeamFairness(scenario, 2026);
        result.teamAnalyses.forEach(team => {
            expect(team.holidaysWorked).toBeGreaterThanOrEqual(0);
            expect(team.holidaysOff).toBeGreaterThanOrEqual(0);
            expect(team.yearlyAnalysis.year).toBe(2026);
        });
    });

    it('should keep weekend/offday distribution close across rotated teams', () => {
        // Rotated identical patterns => equal or near-equal weekends/off days (year boundary effect)
        const scenario = createScenario();
        const result = analyzeTeamFairness(scenario, 2026);
        const weekendCounts = result.teamAnalyses.map(t => t.yearlyAnalysis.totalWeekends);
        const offDayCounts = result.teamAnalyses.map(t => t.yearlyAnalysis.totalOffDays);
        expect(Math.max(...weekendCounts) - Math.min(...weekendCounts)).toBeLessThanOrEqual(1);
        expect(Math.max(...offDayCounts) - Math.min(...offDayCounts)).toBeLessThanOrEqual(2);
    });

    it('should generate insights', () => {
        const scenario = createScenario();
        const result = analyzeTeamFairness(scenario, 2026);
        expect(result.insights.length).toBeGreaterThanOrEqual(1);
    });

    it('should warn about pattern not divisible by team count', () => {
        const scenario = createScenario({ pattern: 'MMTTNNFFF' }); // 9 chars, not divisible by 4
        const result = analyzeTeamFairness(scenario, 2026);
        expect(result.insights.some(i => i.includes('divis'))).toBe(true);
    });
});

describe('analyzeCoverage', () => {
    it('should compute min/max coverage', () => {
        const scenario = createScenario();
        const coverage = analyzeCoverage(scenario, 2026);
        expect(coverage.minCoverage).toBeGreaterThanOrEqual(0);
        expect(coverage.maxCoverage).toBeLessThanOrEqual(4);
        expect(coverage.minCoverage).toBeLessThanOrEqual(coverage.maxCoverage);
    });

    it('should count zero coverage days', () => {
        const scenario = createScenario();
        const coverage = analyzeCoverage(scenario, 2026);
        expect(coverage.daysWithZeroCoverage).toBeGreaterThanOrEqual(0);
    });

    it('should generate insights', () => {
        const scenario = createScenario();
        const coverage = analyzeCoverage(scenario, 2026);
        expect(Array.isArray(coverage.insights)).toBe(true);
    });
});