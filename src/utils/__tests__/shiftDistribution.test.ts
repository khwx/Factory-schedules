import { describe, it, expect } from 'vitest';
import { computeShiftDistribution, assessErgonomics } from '../shiftDistribution';
import { Scenario } from '../../types';

function createScenario(overrides: Partial<Scenario> = {}): Scenario {
    return {
        id: 'dist-1',
        name: 'Distribution Test',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFFFF',
        ...overrides,
    };
}

describe('computeShiftDistribution', () => {
    it('should count total days matching year length', () => {
        const dist = computeShiftDistribution(createScenario(), 2026);
        expect(dist.totalDays).toBe(365);
    });

    it('should return 366 for leap year', () => {
        const dist = computeShiftDistribution(createScenario(), 2024);
        expect(dist.totalDays).toBe(366);
    });

    it('should count shift types consistent with pattern', () => {
        // MMTTNNFFFF has 2 M, 2 T, 2 N, 4 F per 10 days
        const dist = computeShiftDistribution(createScenario(), 2026);
        const expectedMorning = Math.round((2 / 10) * 365);
        expect(Math.abs(dist.morning - expectedMorning)).toBeLessThanOrEqual(1);
    });

    it('should make percentages sum to ~100', () => {
        const dist = computeShiftDistribution(createScenario(), 2026);
        const total = dist.morningPct + dist.afternoonPct + dist.nightPct + dist.offPct;
        expect(Math.abs(total - 100)).toBeLessThanOrEqual(0.2);
    });

    it('should compute avg work days per week', () => {
        const dist = computeShiftDistribution(createScenario(), 2026);
        // 6 work days per 10-day cycle = 4.2 days/week
        expect(dist.avgWorkPerWeek).toBeCloseTo(4.2, 1);
    });

    it('should handle all-off pattern', () => {
        const dist = computeShiftDistribution(createScenario({ pattern: 'FFFFFF' }), 2026);
        expect(dist.off).toBe(dist.totalDays);
        expect(dist.avgWorkPerWeek).toBe(0);
    });
});

describe('assessErgonomics', () => {
    it('should flag low night density', () => {
        const dist = computeShiftDistribution(createScenario({ pattern: 'MMMMMFF' }), 2026);
        const assessment = assessErgonomics(dist);
        expect(assessment.nightDensity).toBe('low');
    });

    it('should flag high night density', () => {
        const dist = computeShiftDistribution(createScenario({ pattern: 'NNNNNFF' }), 2026);
        const assessment = assessErgonomics(dist);
        expect(assessment.nightDensity).toBe('high');
    });

    it('should flag excellent off density for 4-off pattern', () => {
        const dist = computeShiftDistribution(createScenario({ pattern: 'MMTTNNFFFF' }), 2026);
        const assessment = assessErgonomics(dist);
        expect(assessment.offDensity).toBe('excellent');
    });

    it('should generate suggestions', () => {
        const dist = computeShiftDistribution(createScenario(), 2026);
        const assessment = assessErgonomics(dist);
        expect(assessment.suggestions.length).toBeGreaterThan(0);
    });

    it('should rate heavy weekly workload for 6-day patterns', () => {
        const dist = computeShiftDistribution(createScenario({ pattern: 'MMMMMMF' }), 2026);
        const assessment = assessErgonomics(dist);
        expect(assessment.workPerWeekRating).toBe('heavy');
    });
});