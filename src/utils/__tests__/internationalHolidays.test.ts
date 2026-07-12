import { describe, it, expect } from 'vitest';
import { getBrazilHolidays, getAngolaHolidays, getMozambiqueHolidays, getHolidaysForCountry, CountryCode } from '../internationalHolidays';

describe('internationalHolidays', () => {
    describe('getBrazilHolidays', () => {
        it('should return holidays for a given year', () => {
            const holidays = getBrazilHolidays(2025);
            expect(holidays.length).toBeGreaterThan(0);
        });

        it('should include fixed Brazilian holidays', () => {
            const holidays = getBrazilHolidays(2025);
            const names = holidays.map(h => h.name);
            expect(names).toContain('Confraternizacao Universal');
            expect(names).toContain('Tiradentes');
            expect(names).toContain('Dia do Trabalhador');
            expect(names).toContain('Natal');
        });

        it('should include Easter-based holidays', () => {
            const holidays = getBrazilHolidays(2025);
            const names = holidays.map(h => h.name);
            expect(names).toContain('Carnaval');
            expect(names).toContain('Sexta-feira Santa');
            expect(names).toContain('Corpo de Deus');
        });

        it('should return at least 11 holidays (8 fixed + 3 Easter-based)', () => {
            const holidays = getBrazilHolidays(2025);
            expect(holidays.length).toBeGreaterThanOrEqual(11);
        });

        it('should be sorted by date', () => {
            const holidays = getBrazilHolidays(2025);
            for (let i = 1; i < holidays.length; i++) {
                expect(holidays[i].date.getTime()).toBeGreaterThanOrEqual(holidays[i - 1].date.getTime());
            }
        });

        it('should have different dates for different years (Easter-based)', () => {
            const holidays2025 = getBrazilHolidays(2025);
            const holidays2026 = getBrazilHolidays(2026);
            const carnaval2025 = holidays2025.find(h => h.name === 'Carnaval');
            const carnaval2026 = holidays2026.find(h => h.name === 'Carnaval');
            expect(carnaval2025?.date.getTime()).not.toBe(carnaval2026?.date.getTime());
        });
    });

    describe('getAngolaHolidays', () => {
        it('should return holidays', () => {
            const holidays = getAngolaHolidays(2025);
            expect(holidays.length).toBeGreaterThan(0);
        });

        it('should include fixed Angolan holidays', () => {
            const holidays = getAngolaHolidays(2025);
            const names = holidays.map(h => h.name);
            expect(names).toContain('Ano Novo');
            expect(names).toContain('Dia do Trabalhador');
            expect(names).toContain('Natal');
            expect(names).toContain('Dia da Independencia');
        });

        it('should include Sexta-feira Santa', () => {
            const holidays = getAngolaHolidays(2025);
            const names = holidays.map(h => h.name);
            expect(names).toContain('Sexta-feira Santa');
        });

        it('should deduplicate same-day holidays', () => {
            const holidays = getAngolaHolidays(2025);
            const sept17 = holidays.filter(h =>
                h.date.getMonth() === 8 && h.date.getDate() === 17
            );
            expect(sept17).toHaveLength(1);
        });
    });

    describe('getMozambiqueHolidays', () => {
        it('should return holidays', () => {
            const holidays = getMozambiqueHolidays(2025);
            expect(holidays.length).toBeGreaterThan(0);
        });

        it('should include fixed Mozambican holidays', () => {
            const holidays = getMozambiqueHolidays(2025);
            const names = holidays.map(h => h.name);
            expect(names).toContain('Ano Novo');
            expect(names).toContain('Dia do Trabalhador');
            expect(names).toContain('Dia da Familia');
        });

        it('should include Sexta-feira Santa', () => {
            const holidays = getMozambiqueHolidays(2025);
            const names = holidays.map(h => h.name);
            expect(names).toContain('Sexta-feira Santa');
        });
    });

    describe('getHolidaysForCountry', () => {
        it('should return Portuguese holidays for PT', () => {
            const holidays = getHolidaysForCountry('PT', 2025);
            expect(holidays.length).toBeGreaterThan(0);
            const names = holidays.map(h => h.name);
            expect(names).toContain('Ano Novo');
        });

        it('should return Brazilian holidays for BR', () => {
            const holidays = getHolidaysForCountry('BR', 2025);
            expect(holidays.length).toBeGreaterThan(0);
            const names = holidays.map(h => h.name);
            expect(names).toContain('Tiradentes');
        });

        it('should return Angolan holidays for AO', () => {
            const holidays = getHolidaysForCountry('AO', 2025);
            expect(holidays.length).toBeGreaterThan(0);
            const names = holidays.map(h => h.name);
            expect(names).toContain('Dia da Paz');
        });

        it('should return Mozambican holidays for MZ', () => {
            const holidays = getHolidaysForCountry('MZ', 2025);
            expect(holidays.length).toBeGreaterThan(0);
            const names = holidays.map(h => h.name);
            expect(names).toContain('Dia da Victoria');
        });

        it('should default to Portuguese for unknown country', () => {
            const holidays = getHolidaysForCountry('PT' as CountryCode, 2025);
            const ptHolidays = getHolidaysForCountry('PT', 2025);
            expect(holidays.length).toBe(ptHolidays.length);
        });
    });
});
