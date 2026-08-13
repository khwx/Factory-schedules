import { describe, it, expect } from 'vitest';
import { summarizeCompliance, findTopFailure } from '../complianceSummary';
import { Scenario } from '../../types';

const compliant: Scenario = {
    id: 'c1',
    name: 'Compliant',
    teams: 2,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
};

const violating: Scenario = {
    id: 'v1',
    name: 'Violating',
    teams: 2,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMMMMMM',
};

describe('summarizeCompliance', () => {
    it('should return empty for no scenarios', () => {
        const summary = summarizeCompliance([]);
        expect(summary.scenarios).toHaveLength(0);
        expect(summary.overallScore).toBe(0);
        expect(summary.bestScenarioId).toBeNull();
    });

    it('should score 100 when all pass', () => {
        const summary = summarizeCompliance([compliant], 2026);
        expect(summary.overallScore).toBe(100);
        expect(summary.bestScenarioId).toBe('c1');
    });

    it('should score 0 when none pass', () => {
        const summary = summarizeCompliance([violating], 2026);
        expect(summary.overallScore).toBe(0);
        expect(summary.bestScenarioId).toBeNull();
    });

    it('should score 50 for one of two passing', () => {
        const summary = summarizeCompliance([compliant, violating], 2026);
        expect(summary.overallScore).toBe(50);
        expect(summary.bestScenarioId).toBe('c1');
    });

    it('should count critical failures for violating scenario', () => {
        const summary = summarizeCompliance([violating], 2026);
        expect(summary.scenarios[0].criticalFailures).toBeGreaterThan(0);
        expect(summary.scenarios[0].allPassed).toBe(false);
    });

    it('should include team count info', () => {
        const summary = summarizeCompliance([compliant], 2026);
        expect(summary.scenarios[0].totalTeams).toBe(2);
        expect(summary.scenarios[0].teamsPassing).toBe(2);
    });
});

describe('findTopFailure', () => {
    it('should return null when all comply', () => {
        const top = findTopFailure([compliant], 2026);
        expect(top).toBeNull();
    });

    it('should return the failing rule', () => {
        const top = findTopFailure([violating], 2026);
        expect(top).not.toBeNull();
        expect(top!.count).toBeGreaterThan(0);
        expect(top!.title.length).toBeGreaterThan(0);
    });

    it('should return most frequent failure across scenarios', () => {
        const top = findTopFailure([violating, violating], 2026);
        expect(top!.count).toBeGreaterThanOrEqual(2);
    });
});