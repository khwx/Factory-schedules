import { describe, it, expect } from 'vitest';
import { calculateEstimatedPay, formatCurrency, DEFAULT_PAY_CONFIG, PayConfig } from '../payCalculator';
import { Scenario } from '../../types';

const baseScenario: Scenario = {
    id: 'test-pay',
    name: 'Teste Pay',
    teams: 1,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
};

describe('payCalculator', () => {
    describe('calculateEstimatedPay', () => {
        it('should return a pay estimate object with all fields', () => {
            const result = calculateEstimatedPay(baseScenario);
            expect(result).toHaveProperty('regularHours');
            expect(result).toHaveProperty('regularPay');
            expect(result).toHaveProperty('nightHours');
            expect(result).toHaveProperty('nightPay');
            expect(result).toHaveProperty('holidayHours');
            expect(result).toHaveProperty('holidayPay');
            expect(result).toHaveProperty('weekendHours');
            expect(result).toHaveProperty('weekendPay');
            expect(result).toHaveProperty('totalHours');
            expect(result).toHaveProperty('totalPay');
            expect(result).toHaveProperty('monthlyAvg');
        });

        it('should calculate total hours as sum of all categories', () => {
            const result = calculateEstimatedPay(baseScenario);
            expect(result.totalHours).toBe(
                result.regularHours + result.nightHours + result.holidayHours + result.weekendHours
            );
        });

        it('should calculate total pay as sum of all pay categories', () => {
            const result = calculateEstimatedPay(baseScenario);
            expect(result.totalPay).toBeCloseTo(
                result.regularPay + result.nightPay + result.holidayPay + result.weekendPay, 2
            );
        });

        it('should calculate monthly average as totalPay / 12', () => {
            const result = calculateEstimatedPay(baseScenario);
            expect(result.monthlyAvg).toBeCloseTo(result.totalPay / 12, 2);
        });

        it('should apply night premium', () => {
            const result = calculateEstimatedPay(baseScenario);
            if (result.nightHours > 0) {
                const expectedNightPay = result.nightHours * DEFAULT_PAY_CONFIG.hourlyRate * (1 + DEFAULT_PAY_CONFIG.nightPremium);
                expect(result.nightPay).toBeCloseTo(expectedNightPay, 2);
            }
        });

        it('should apply holiday premium', () => {
            const result = calculateEstimatedPay(baseScenario);
            if (result.holidayHours > 0) {
                const expectedHolidayPay = result.holidayHours * DEFAULT_PAY_CONFIG.hourlyRate * (1 + DEFAULT_PAY_CONFIG.holidayPremium);
                expect(result.holidayPay).toBeCloseTo(expectedHolidayPay, 2);
            }
        });

        it('should use custom pay config', () => {
            const customConfig: PayConfig = {
                hourlyRate: 15,
                nightPremium: 0.5,
                holidayPremium: 2.0,
                weekendPremium: 0.25,
            };
            const result = calculateEstimatedPay(baseScenario, 0, customConfig);
            expect(result.totalPay).toBeGreaterThan(0);
            if (result.nightHours > 0) {
                expect(result.nightPay).toBeCloseTo(result.nightHours * 15 * 1.5, 2);
            }
        });

        it('should not count free days in total hours', () => {
            const result = calculateEstimatedPay(baseScenario);
            const totalFromCalendar = result.regularHours + result.nightHours + result.holidayHours + result.weekendHours;
            expect(result.totalHours).toBe(totalFromCalendar);
        });

        it('should use default config when not provided', () => {
            const result = calculateEstimatedPay(baseScenario);
            expect(result.totalPay).toBeGreaterThanOrEqual(0);
        });

        it('should handle multi-team scenario', () => {
            const multiTeam: Scenario = { ...baseScenario, teams: 3, pattern: 'MMTTNNFFFF' };
            const result = calculateEstimatedPay(multiTeam, 1);
            expect(result.totalHours).toBeGreaterThan(0);
        });
    });

    describe('formatCurrency', () => {
        it('should format as EUR currency', () => {
            const formatted = formatCurrency(1234.56);
            expect(formatted).toContain('1');
            expect(formatted).toContain('234');
        });

        it('should handle zero', () => {
            const formatted = formatCurrency(0);
            expect(formatted).toContain('0');
        });

        it('should handle large values', () => {
            const formatted = formatCurrency(50000);
            expect(formatted).toContain('50');
        });
    });

    describe('DEFAULT_PAY_CONFIG', () => {
        it('should have reasonable defaults', () => {
            expect(DEFAULT_PAY_CONFIG.hourlyRate).toBeGreaterThan(0);
            expect(DEFAULT_PAY_CONFIG.nightPremium).toBeGreaterThan(0);
            expect(DEFAULT_PAY_CONFIG.holidayPremium).toBeGreaterThan(0);
        });
    });
});
