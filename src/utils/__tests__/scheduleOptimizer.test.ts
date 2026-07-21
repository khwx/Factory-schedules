import { describe, it, expect } from 'vitest';
import { optimizeSchedule } from '../scheduleOptimizer';
import { Scenario } from '../../types';

describe('optimizeSchedule', () => {
    const createScenario = (overrides: Partial<Scenario> = {}): Scenario => ({
        id: 'opt-test-1',
        name: 'Optimized Scenario',
        teams: 5,
        shiftDuration: 8,
        pattern: 'MMTTNNFFFF',
        ...overrides,
    });

    it('should return a score between 0 and 100', () => {
        const result = optimizeSchedule(createScenario());
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should include analysis and scenario', () => {
        const result = optimizeSchedule(createScenario());
        expect(result.scenario).toBeDefined();
        expect(result.analysis).toBeDefined();
        expect(result.analysis.avgWeeklyHours).toBeGreaterThan(0);
    });

    it('should return 6 constraints', () => {
        const result = optimizeSchedule(createScenario());
        expect(result.constraints).toHaveLength(6);
        const constraintIds = result.constraints.map(c => c.id);
        expect(constraintIds).toContain('hours');
        expect(constraintIds).toContain('consecutive_work');
        expect(constraintIds).toContain('night_shifts');
        expect(constraintIds).toContain('weekends');
        expect(constraintIds).toContain('mini_vacations');
        expect(constraintIds).toContain('friday_nights');
    });

    it('should return at least one suggestion', () => {
        const result = optimizeSchedule(createScenario());
        expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should return alternative patterns', () => {
        const result = optimizeSchedule(createScenario());
        expect(result.alternativePatterns.length).toBeGreaterThan(0);
        const first = result.alternativePatterns[0];
        expect(first.pattern).toBeDefined();
        expect(first.score).toBeGreaterThanOrEqual(0);
        expect(first.description).toBeDefined();
    });

    it('should detect high score for balanced schedule', () => {
        // MMTTNNFFFF is a balanced schedule with 33.6h/week, should score reasonably
        const result = optimizeSchedule(createScenario({ pattern: 'MMTTNNFFFF', shiftDuration: 8 }));
        expect(result.score).toBeGreaterThan(30);
    });
});
