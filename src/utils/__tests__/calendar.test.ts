import { describe, it, expect } from 'vitest';
import { generateYearCalendar, analyzeYearCalendar, generateMultiYearAnalysis } from '../calendar';
import { Scenario } from '../../types';

function createScenario(overrides: Partial<Scenario> = {}): Scenario {
    return {
        id: 'cal-1',
        name: 'Calendar Test',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFFFF',
        ...overrides,
    };
}

describe('generateYearCalendar', () => {
    it('should generate 365 days for a non-leap year', () => {
        const cal = generateYearCalendar(createScenario(), 2026);
        expect(cal).toHaveLength(365);
    });

    it('should generate 366 days for a leap year', () => {
        const cal = generateYearCalendar(createScenario(), 2024);
        expect(cal).toHaveLength(366);
    });

    it('should mark weekends correctly', () => {
        const cal = generateYearCalendar(createScenario(), 2026);
        // Jan 4 2026 is a Sunday; Jan 5 is Monday
        expect(cal[3].date.getDay()).toBe(0);
        expect(cal[3].isWeekend).toBe(true);
        expect(cal[4].isWeekend).toBe(false);
    });

    it('should follow the pattern sequence', () => {
        const cal = generateYearCalendar(createScenario(), 2026);
        const pattern = 'MMTTNNFFFF';
        for (let i = 0; i < pattern.length; i++) {
            expect(cal[i].shift).toBe(pattern[i]);
        }
    });

    it('should use teamPatterns when provided', () => {
        const scenario = createScenario({
            teams: 4,
            teamPatterns: ['MMTTNNFF', 'NNFFMMTT', 'TTNNFFMM', 'FFMMTTNN'],
        });
        const calTeam0 = generateYearCalendar(scenario, 2026, 0);
        const calTeam1 = generateYearCalendar(scenario, 2026, 1);
        expect(calTeam0[0].shift).toBe('M');
        // Check the two team schedules differ at the same date
        expect(calTeam0[0].shift).not.toBe(calTeam1[0].shift);
    });

    it('should respect startDate offset', () => {
        const scenarioA = createScenario({ startDate: '2026-01-01' });
        const scenarioB = createScenario({ startDate: '2026-01-02' });
        const calA = generateYearCalendar(scenarioA, 2026);
        const calB = generateYearCalendar(scenarioB, 2026);
        // One day shift changes the pattern alignment
        expect(calA[0].shift).not.toBe(calB[0].shift);
    });
});

describe('analyzeYearCalendar', () => {
    it('should produce monthly breakdown with 12 months', () => {
        const cal = generateYearCalendar(createScenario(), 2026);
        const analysis = analyzeYearCalendar(cal, 2026, 8);
        expect(analysis.monthlyBreakdown).toHaveLength(12);
        expect(analysis.year).toBe(2026);
    });

    it('should count total off days', () => {
        const scenario = createScenario({ pattern: 'MMMMMFF' }); // 2 off days per week
        const cal = generateYearCalendar(scenario, 2026);
        const analysis = analyzeYearCalendar(cal, 2026, 8);
        const expectedOff = parseInt((cal.filter(d => d.shift === 'F').length).toString());
        expect(analysis.totalOffDays).toBe(expectedOff);
    });

    it('should count hours worked for non-off days', () => {
        const cal = generateYearCalendar(createScenario(), 2026);
        const workDays = cal.filter(d => d.shift !== 'F').length;
        const analysis = analyzeYearCalendar(cal, 2026, 8);
        expect(analysis.totalHoursWorked).toBe(workDays * 8);
    });

    it('should count full weekend offs (assigned on Saturday)', () => {
        const cal = generateYearCalendar(createScenario(), 2026);
        const analysis = analyzeYearCalendar(cal, 2026, 8);
        // Count Saturdays that are part of a full weekend off
        const expected = cal.filter(d => d.isWeekendOff && d.date.getDay() === 6).length;
        expect(analysis.totalWeekends).toBe(expected);
        expect(analysis.totalWeekends).toBeGreaterThanOrEqual(0);
    });

    it('should correctly count saturday/sunday partial offs', () => {
        const analysis = analyzeYearCalendar([], 2026, 8);
        expect(analysis.totalSaturdaysOff).toBe(0);
        expect(analysis.totalSundaysOff).toBe(0);
    });
});

describe('generateMultiYearAnalysis', () => {
    it('should generate 5 years of analysis', () => {
        const years = generateMultiYearAnalysis(createScenario(), 2026);
        expect(years).toHaveLength(5);
        expect(years[0].year).toBe(2026);
        expect(years[4].year).toBe(2030);
    });

    it('should respect custom start year', () => {
        const years = generateMultiYearAnalysis(createScenario(), 2031);
        expect(years[0].year).toBe(2031);
    });

    it('should compute different weekend counts across years', () => {
        const years = generateMultiYearAnalysis(createScenario(), 2026);
        const weekendCounts = new Set(years.map(y => y.totalWeekends));
        expect(weekendCounts.size).toBeGreaterThan(1);
    });
});