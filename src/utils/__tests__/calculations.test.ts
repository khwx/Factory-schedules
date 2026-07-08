import { describe, it, expect } from 'vitest';
import { calculateAnalysis } from '../calculations';
import { Scenario } from '../../types';

describe('calculateAnalysis', () => {
    const createScenario = (overrides: Partial<Scenario> = {}): Scenario => ({
        id: 'test-1',
        name: 'Test Scenario',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFFFF',
        ...overrides,
    });

    describe('basic calculations', () => {
        it('should calculate average weekly hours correctly', () => {
            const scenario = createScenario({
                pattern: 'MMTTNNFFFF', // 6 work days in 10 day cycle
                shiftDuration: 8,
            });
            const analysis = calculateAnalysis(scenario);

            // 6 shifts * 8h = 48h per 10 days = 48h / (10/7) weeks = 33.6h/week
            expect(analysis.avgWeeklyHours).toBeCloseTo(33.6, 1);
        });

        it('should calculate total annual hours correctly', () => {
            const scenario = createScenario({
                pattern: 'MMTTNNFFFF',
                shiftDuration: 8,
            });
            const analysis = calculateAnalysis(scenario);

            expect(analysis.totalAnnualHours).toBeGreaterThan(0);
            expect(analysis.totalAnnualHours).toBeLessThan(3000);
        });

        it('should calculate weekends off per year', () => {
            const scenario = createScenario();
            const analysis = calculateAnalysis(scenario);

            expect(analysis.weekendsOffPerYear).toBeGreaterThanOrEqual(0);
            expect(analysis.weekendsOffPerYear).toBeLessThanOrEqual(52);
        });

        it('should calculate total off days per year', () => {
            const scenario = createScenario();
            const analysis = calculateAnalysis(scenario);

            expect(analysis.totalOffDaysPerYear).toBeGreaterThan(0);
            expect(analysis.totalOffDaysPerYear).toBeLessThanOrEqual(365);
        });
    });

    describe('edge cases', () => {
        it('should handle empty pattern', () => {
            const scenario = createScenario({ pattern: '' });
            const analysis = calculateAnalysis(scenario);

            expect(analysis.avgWeeklyHours).toBe(0);
            expect(analysis.totalAnnualHours).toBe(0);
            expect(analysis.weekendsOffPerYear).toBe(0);
        });

        it('should handle zero teams', () => {
            const scenario = createScenario({ teams: 0 });
            const analysis = calculateAnalysis(scenario);

            expect(analysis.avgWeeklyHours).toBe(0);
        });

        it('should handle pattern with no off days', () => {
            const scenario = createScenario({
                pattern: 'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM', // All work
                shiftDuration: 8,
            });
            const analysis = calculateAnalysis(scenario);

            expect(analysis.totalOffDaysPerYear).toBe(0);
            expect(analysis.avgWeeklyHours).toBeGreaterThan(0);
        });
    });

    describe('weekly hours difference', () => {
        it('should calculate difference from contract hours', () => {
            const scenario = createScenario({
                pattern: 'MMTTNNFFFF',
                shiftDuration: 8,
                weeklyHoursContract: 40,
            });
            const analysis = calculateAnalysis(scenario);

            expect(analysis.weeklyHoursDifference).toBeDefined();
            expect(typeof analysis.weeklyHoursDifference).toBe('number');
        });

        it('should be undefined when no contract hours provided', () => {
            const scenario = createScenario({
                weeklyHoursContract: undefined,
            });
            const analysis = calculateAnalysis(scenario);

            expect(analysis.weeklyHoursDifference).toBeUndefined();
        });
    });

    describe('qualitative analysis', () => {
        it('should return qualitative insights array', () => {
            const scenario = createScenario();
            const analysis = calculateAnalysis(scenario);

            expect(Array.isArray(analysis.qualitative)).toBe(true);
        });

        it('should include hours-related insights', () => {
            const scenario = createScenario({
                pattern: 'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM', // High hours
                shiftDuration: 12,
            });
            const analysis = calculateAnalysis(scenario);

            const hasHoursInsight = analysis.qualitative.some(
                q => q.includes('horas') || q.includes('trabalho')
            );
            expect(hasHoursInsight).toBe(true);
        });
    });

    describe('multi-year analysis', () => {
        it('should return 5 years of analysis', () => {
            const scenario = createScenario();
            const analysis = calculateAnalysis(scenario);

            expect(analysis.multiYearAnalysis.length).toBe(5);
        });

        it('should have consecutive years', () => {
            const scenario = createScenario();
            const analysis = calculateAnalysis(scenario);

            const currentYear = new Date().getFullYear();
            expect(analysis.multiYearAnalysis[0].year).toBe(currentYear);
            expect(analysis.multiYearAnalysis[4].year).toBe(currentYear + 4);
        });
    });

    describe('advanced metrics', () => {
        it('should include advanced metrics when pattern is valid', () => {
            const scenario = createScenario();
            const analysis = calculateAnalysis(scenario);

            expect(analysis.advancedMetrics).toBeDefined();
            expect(analysis.advancedMetrics?.maxConsecutiveWorkDays).toBeGreaterThanOrEqual(0);
            expect(analysis.advancedMetrics?.maxConsecutiveOffDays).toBeGreaterThanOrEqual(0);
        });
    });
});
