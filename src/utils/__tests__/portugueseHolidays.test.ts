import { describe, it, expect } from 'vitest';
import {
    getPortugueseHolidays,
    getHolidayMonthDays,
    isHolidayByMonthDay,
    isHoliday,
    getHolidayName,
    countHolidaysOff,
    getHolidaysWorked,
    getTotalHolidaysCount,
} from '../portugueseHolidays';

describe('portugueseHolidays', () => {
    describe('getPortugueseHolidays', () => {
        it('should return holidays for a given year', () => {
            const holidays = getPortugueseHolidays(2025);
            expect(holidays.length).toBeGreaterThan(0);
        });

        it('should include fixed national holidays', () => {
            const holidays = getPortugueseHolidays(2025);
            const names = holidays.map(h => h.name);

            expect(names).toContain('Ano Novo');
            expect(names).toContain('Dia da Liberdade');
            expect(names).toContain('Dia do Trabalhador');
            expect(names).toContain('Dia de Portugal');
            expect(names).toContain('Natal');
        });

        it('should include movable holidays (Easter-based)', () => {
            const holidays = getPortugueseHolidays(2025);
            const names = holidays.map(h => h.name);

            expect(names).toContain('Sexta-feira Santa');
            expect(names).toContain('Corpo de Deus');
            // Note: Easter Sunday is included but may not be a public holiday in Portugal
        });

        it('should sort holidays by date', () => {
            const holidays = getPortugueseHolidays(2025);
            for (let i = 1; i < holidays.length; i++) {
                expect(holidays[i].date.getTime()).toBeGreaterThanOrEqual(
                    holidays[i - 1].date.getTime()
                );
            }
        });

        it('should have monthDay format MM-DD', () => {
            const holidays = getPortugueseHolidays(2025);
            holidays.forEach(h => {
                expect(h.monthDay).toMatch(/^\d{2}-\d{2}$/);
            });
        });
    });

    describe('getHolidayMonthDays', () => {
        it('should return array of month-day strings', () => {
            const monthDays = getHolidayMonthDays(2025);
            expect(Array.isArray(monthDays)).toBe(true);
            expect(monthDays.length).toBeGreaterThan(0);
            monthDays.forEach(md => {
                expect(md).toMatch(/^\d{2}-\d{2}$/);
            });
        });
    });

    describe('isHolidayByMonthDay', () => {
        it('should return true for existing holidays', () => {
            const monthDays = getHolidayMonthDays(2025);
            expect(isHolidayByMonthDay('01-01', monthDays)).toBe(true); // Ano Novo
            expect(isHolidayByMonthDay('12-25', monthDays)).toBe(true); // Natal
        });

        it('should return false for non-holidays', () => {
            const monthDays = getHolidayMonthDays(2025);
            expect(isHolidayByMonthDay('01-02', monthDays)).toBe(false);
            expect(isHolidayByMonthDay('12-26', monthDays)).toBe(false);
        });
    });

    describe('isHoliday', () => {
        it('should return holiday object for holiday dates', () => {
            const holidays = getPortugueseHolidays(2025);
            const result = isHoliday(new Date(2025, 0, 1), holidays); // Jan 1
            expect(result).not.toBeNull();
            expect(result?.name).toBe('Ano Novo');
        });

        it('should return null for non-holiday dates', () => {
            const holidays = getPortugueseHolidays(2025);
            const result = isHoliday(new Date(2025, 0, 2), holidays); // Jan 2
            expect(result).toBeNull();
        });
    });

    describe('getHolidayName', () => {
        it('should return name for holiday dates', () => {
            const holidays = getPortugueseHolidays(2025);
            const name = getHolidayName(new Date(2025, 11, 25), holidays); // Dec 25
            expect(name).toBe('Natal');
        });

        it('should return null for non-holiday dates', () => {
            const holidays = getPortugueseHolidays(2025);
            const name = getHolidayName(new Date(2025, 11, 26), holidays); // Dec 26
            expect(name).toBeNull();
        });
    });

    describe('countHolidaysOff', () => {
        it('should count holidays that fall on off days', () => {
            const holidays = getPortugueseHolidays(2025);
            const calendar = [
                { date: new Date(2025, 0, 1), shift: 'F' }, // Holiday off
                { date: new Date(2025, 0, 2), shift: 'M' }, // Holiday worked
                { date: new Date(2025, 0, 3), shift: 'F' }, // Not a holiday
            ];
            const count = countHolidaysOff(calendar, holidays);
            expect(count).toBe(1);
        });
    });

    describe('getHolidaysWorked', () => {
        it('should return holidays that are worked', () => {
            const holidays = getPortugueseHolidays(2025);
            // Jan 1 is Ano Novo
            const calendar = [
                { date: new Date(2025, 0, 1), shift: 'M' }, // Holiday worked (M)
            ];
            const worked = getHolidaysWorked(calendar, holidays);
            expect(worked.length).toBe(1);
            expect(worked[0].name).toBe('Ano Novo');
        });
    });

    describe('getTotalHolidaysCount', () => {
        it('should return total number of holidays', () => {
            const count = getTotalHolidaysCount(2025);
            expect(count).toBe(13); // 10 fixed + 3 movable
        });
    });
});
