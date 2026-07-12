import { describe, it, expect } from 'vitest';
import { validateLegalCompliance } from '../legalValidator';
import { Scenario } from '../../types';

const baseScenario: Scenario = {
    id: 'test-1',
    name: 'Teste Legal',
    teams: 2,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
};

describe('legalValidator', () => {
    describe('validateLegalCompliance', () => {
        it('should return a report for each team', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            expect(reports).toHaveLength(2);
        });

        it('should label teams correctly', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            expect(reports[0].teamName).toBe('Equipa A');
            expect(reports[1].teamName).toBe('Equipa B');
        });

        it('should include all 6 legal rules', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            reports.forEach(report => {
                expect(report.results).toHaveLength(6);
            });
        });

        it('should have rule IDs for each result', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            const ruleIds = reports[0].results.map(r => r.rule.id);
            expect(ruleIds).toContain('rest-11h');
            expect(ruleIds).toContain('max-night-sequence');
            expect(ruleIds).toContain('weekly-rest');
            expect(ruleIds).toContain('max-consecutive-work');
            expect(ruleIds).toContain('night-compensation');
            expect(ruleIds).toContain('holiday-compensation');
        });

        it('should have article references', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            reports[0].results.forEach(result => {
                expect(result.rule.article).toMatch(/Art\. \d+º CT/);
            });
        });

        it('should mark night compensation and holiday compensation as always passed (informational)', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            reports.forEach(report => {
                const nightComp = report.results.find(r => r.rule.id === 'night-compensation');
                const holidayComp = report.results.find(r => r.rule.id === 'holiday-compensation');
                expect(nightComp?.passed).toBe(true);
                expect(holidayComp?.passed).toBe(true);
            });
        });

        it('should count night shifts correctly', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            reports.forEach(report => {
                const nightResult = report.results.find(r => r.rule.id === 'night-compensation');
                expect(nightResult?.actual).toBeGreaterThan(0);
            });
        });

        it('should set correct year', () => {
            const reports = validateLegalCompliance(baseScenario, 2026);
            expect(reports[0].year).toBe(2026);
        });

        it('should set scenarioId', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            expect(reports[0].scenarioId).toBe('test-1');
        });

        it('should set scenarioName', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            expect(reports[0].scenarioName).toBe('Teste Legal');
        });

        it('should handle single team scenario', () => {
            const singleTeam: Scenario = { ...baseScenario, teams: 1 };
            const reports = validateLegalCompliance(singleTeam, 2025);
            expect(reports).toHaveLength(1);
        });

        it('should have allPassed as boolean', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            reports.forEach(report => {
                expect(typeof report.allPassed).toBe('boolean');
            });
        });

        it('should have criticalFailures as number', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            reports.forEach(report => {
                expect(typeof report.criticalFailures).toBe('number');
                expect(report.criticalFailures).toBeGreaterThanOrEqual(0);
            });
        });

        it('should have non-empty details strings', () => {
            const reports = validateLegalCompliance(baseScenario, 2025);
            reports.forEach(report => {
                report.results.forEach(result => {
                    expect(result.details).toBeTruthy();
                    expect(typeof result.details).toBe('string');
                });
            });
        });
    });
});
