import { describe, it, expect } from 'vitest';
import { calculateAdvancedMetrics, generateAdvancedInsights } from '../advancedMetrics';
import { DayInfo } from '../../types';

function day(dateStr: string, shift: DayInfo['shift'], opts: Partial<DayInfo> = {}): DayInfo {
    return {
        date: new Date(dateStr),
        shift,
        isWeekend: opts.isWeekend ?? false,
        isWeekendOff: opts.isWeekendOff ?? false,
    };
}

describe('calculateAdvancedMetrics', () => {
    it('should return zeroed metrics for empty calendar', () => {
        // Use a real year for holiday lookup
        const empty = [] as DayInfo[];
        const metrics = calculateAdvancedMetrics(empty);
        expect(metrics.maxConsecutiveWorkDays).toBe(0);
        expect(metrics.maxConsecutiveNightShifts).toBe(0);
        expect(metrics.totalNightShifts).toBe(0);
        expect(metrics.miniVacations).toBe(0);
    });

    it('should count consecutive work days', () => {
        const calendar: DayInfo[] = [
            day('2026-01-01', 'M'),
            day('2026-01-02', 'M'),
            day('2026-01-03', 'F'),
            day('2026-01-04', 'T'),
            day('2026-01-05', 'T'),
            day('2026-01-06', 'N'),
        ];
        const metrics = calculateAdvancedMetrics(calendar);
        expect(metrics.maxConsecutiveWorkDays).toBe(3);
    });

    it('should count consecutive night shifts', () => {
        const calendar: DayInfo[] = [
            day('2026-01-01', 'N'),
            day('2026-01-02', 'N'),
            day('2026-01-03', 'N'),
            day('2026-01-04', 'M'),
        ];
        const metrics = calculateAdvancedMetrics(calendar);
        expect(metrics.maxConsecutiveNightShifts).toBe(3);
        expect(metrics.totalNightShifts).toBe(3);
        expect(metrics.nightShiftsPerMonth).toBeCloseTo(3 / 12, 5);
    });

    it('should detect mini vacations and isolated off days', () => {
        const calendar: DayInfo[] = [
            day('2026-01-01', 'F'),
            day('2026-01-02', 'F'),
            day('2026-01-03', 'F'),
            day('2026-01-04', 'M'),
            day('2026-01-05', 'F'),
            day('2026-01-06', 'M'),
        ];
        const metrics = calculateAdvancedMetrics(calendar);
        expect(metrics.miniVacations).toBe(1);
        expect(metrics.isolatedOffDays).toBe(1);
        expect(metrics.maxConsecutiveOffDays).toBe(3);
    });

    it('should count friday/saturday nights off and sunday mornings off', () => {
        // Jan 2 2026 is Friday, Jan 3 is Saturday, Jan 4 is Sunday
        const calendar: DayInfo[] = [
            day('2026-01-02', 'M'), // Friday morning, not night
            day('2026-01-03', 'N'), // Saturday night shift
            day('2026-01-04', 'M'), // Sunday morning shift
        ];
        const metrics = calculateAdvancedMetrics(calendar);
        expect(metrics.fridayNightsOff).toBe(1);
        expect(metrics.saturdayNightsOff).toBe(0);
        expect(metrics.sundayMorningsOff).toBe(0);
    });
});

describe('generateAdvancedInsights', () => {
    const baseMetrics = {
        maxConsecutiveOffDays: 3,
        maxConsecutiveWorkDays: 5,
        maxConsecutiveNightShifts: 3,
        miniVacations: 2,
        isolatedOffDays: 10,
        totalNightShifts: 60,
        nightShiftsPerMonth: 5,
        fridayNightsOff: 30,
        saturdayNightsOff: 30,
        sundayMorningsOff: 40,
        holidaysOff: 5,
        holidaysWorked: 4,
    };

    it('should return an array of insights', () => {
        const insights = generateAdvancedInsights(baseMetrics);
        expect(Array.isArray(insights)).toBe(true);
        expect(insights.length).toBeGreaterThan(0);
    });

    it('should highlight many holidays worked', () => {
        const insights = generateAdvancedInsights({ ...baseMetrics, holidaysWorked: 12 });
        expect(insights.some(i => i.includes('12 feriados trabalhados'))).toBe(true);
    });

    it('should warn about long consecutive work', () => {
        const insights = generateAdvancedInsights({ ...baseMetrics, maxConsecutiveWorkDays: 10 });
        expect(insights.some(i => i.includes('10 dias consecutivos'))).toBe(true);
    });

    it('should warn about high night load', () => {
        const insights = generateAdvancedInsights({ ...baseMetrics, nightShiftsPerMonth: 12 });
        expect(insights.some(i => i.toLowerCase().includes('noturnos'))).toBe(true);
    });
});