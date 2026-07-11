import { Holiday, getPortugueseHolidays } from './portugueseHolidays';

function calculateEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function makeHoliday(name: string, date: Date, type: 'national' | 'religious' = 'national'): Holiday {
    return {
        name,
        date,
        type,
        isFixed: false,
        monthDay: `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    };
}

function makeFixedHoliday(name: string, month: number, day: number, type: 'national' | 'religious' = 'national'): Holiday {
    return {
        name,
        date: new Date(new Date().getFullYear(), month, day),
        type,
        isFixed: true,
        monthDay: `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    };
}

export function getBrazilHolidays(year: number): Holiday[] {
    const holidays: Holiday[] = [];
    const fixed = [
        { name: 'Confraternizacao Universal', month: 0, day: 1 },
        { name: 'Tiradentes', month: 3, day: 21 },
        { name: 'Dia do Trabalhador', month: 4, day: 1 },
        { name: 'Independencia do Brasil', month: 8, day: 7 },
        { name: 'Nossa Senhora Aparecida', month: 9, day: 12 },
        { name: 'Finados', month: 10, day: 2 },
        { name: 'Proclamacao da Republica', month: 10, day: 15 },
        { name: 'Natal', month: 11, day: 25 },
    ];
    for (const h of fixed) {
        holidays.push(makeFixedHoliday(h.name, h.month, h.day));
    }
    const easter = calculateEaster(year);
    const carnaval = new Date(easter); carnaval.setDate(easter.getDate() - 47);
    holidays.push(makeHoliday('Carnaval', carnaval));
    const sextaSanta = new Date(easter); sextaSanta.setDate(easter.getDate() - 2);
    holidays.push(makeHoliday('Sexta-feira Santa', sextaSanta, 'religious'));
    const corpusChristi = new Date(easter); corpusChristi.setDate(easter.getDate() + 60);
    holidays.push(makeHoliday('Corpo de Deus', corpusChristi, 'religious'));
    holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
    return holidays;
}

export function getAngolaHolidays(year: number): Holiday[] {
    const holidays: Holiday[] = [];
    const fixed = [
        { name: 'Ano Novo', month: 0, day: 1 },
        { name: 'Dia do Inicio da Luta Armada', month: 1, day: 4 },
        { name: 'Dia da Paz', month: 3, day: 4 },
        { name: 'Dia do Trabalhador', month: 4, day: 1 },
        { name: 'Dia do Fundador da Naacao', month: 8, day: 17 },
        { name: 'Dia dos Herois Nacionais', month: 8, day: 17 },
        { name: 'Dia da Independencia', month: 10, day: 11 },
        { name: 'Natal', month: 11, day: 25 },
    ];
    const seen = new Set<string>();
    for (const h of fixed) {
        const key = `${h.month}-${h.day}`;
        if (seen.has(key)) continue;
        seen.add(key);
        holidays.push(makeFixedHoliday(h.name, h.month, h.day));
    }
    const easter = calculateEaster(year);
    const sextaSanta = new Date(easter); sextaSanta.setDate(easter.getDate() - 2);
    holidays.push(makeHoliday('Sexta-feira Santa', sextaSanta, 'religious'));
    holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
    return holidays;
}

export function getMozambiqueHolidays(year: number): Holiday[] {
    const holidays: Holiday[] = [];
    const fixed = [
        { name: 'Ano Novo', month: 0, day: 1 },
        { name: 'Dia dos Herois Mocambicanos', month: 1, day: 3 },
        { name: 'Dia da Mulher Mocambicana', month: 3, day: 7 },
        { name: 'Dia do Trabalhador', month: 4, day: 1 },
        { name: 'Dia da Independencia', month: 5, day: 25 },
        { name: 'Dia da Victoria', month: 8, day: 7 },
        { name: 'Dia das Forcas Armadas', month: 8, day: 25 },
        { name: 'Dia da Paz', month: 9, day: 4 },
        { name: 'Dia da Familia', month: 11, day: 25 },
        { name: 'Natal', month: 11, day: 25 },
    ];
    const seen = new Set<string>();
    for (const h of fixed) {
        const key = `${h.month}-${h.day}`;
        if (seen.has(key)) continue;
        seen.add(key);
        holidays.push(makeFixedHoliday(h.name, h.month, h.day));
    }
    const easter = calculateEaster(year);
    const sextaSanta = new Date(easter); sextaSanta.setDate(easter.getDate() - 2);
    holidays.push(makeHoliday('Sexta-feira Santa', sextaSanta, 'religious'));
    holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
    return holidays;
}

export type CountryCode = 'PT' | 'BR' | 'AO' | 'MZ';

export function getHolidaysForCountry(country: CountryCode, year: number): Holiday[] {
    switch (country) {
        case 'BR': return getBrazilHolidays(year);
        case 'AO': return getAngolaHolidays(year);
        case 'MZ': return getMozambiqueHolidays(year);
        default: return getPortugueseHolidays(year);
    }
}