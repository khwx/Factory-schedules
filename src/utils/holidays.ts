/**
 * Portuguese Holidays Database
 * Includes fixed and movable holidays
 */

export interface Holiday {
    name: string;
    date: Date;
    type: 'national' | 'religious' | 'regional';
    isFixed: boolean;
}

/**
 * Calculate Easter Sunday for a given year (using Computus algorithm)
 */
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

/**
 * Get all Portuguese holidays for a given year
 */
export function getPortugueseHolidays(year: number): Holiday[] {
    const holidays: Holiday[] = [];

    // Fixed National Holidays
    holidays.push({
        name: 'Ano Novo',
        date: new Date(year, 0, 1),
        type: 'national',
        isFixed: true,
    });

    holidays.push({
        name: 'Dia da Liberdade',
        date: new Date(year, 3, 25),
        type: 'national',
        isFixed: true,
    });

    holidays.push({
        name: 'Dia do Trabalhador',
        date: new Date(year, 4, 1),
        type: 'national',
        isFixed: true,
    });

    holidays.push({
        name: 'Dia de Portugal',
        date: new Date(year, 5, 10),
        type: 'national',
        isFixed: true,
    });

    holidays.push({
        name: 'Assunção de Nossa Senhora',
        date: new Date(year, 7, 15),
        type: 'religious',
        isFixed: true,
    });

    holidays.push({
        name: 'Implantação da República',
        date: new Date(year, 9, 5),
        type: 'national',
        isFixed: true,
    });

    holidays.push({
        name: 'Dia de Todos os Santos',
        date: new Date(year, 10, 1),
        type: 'religious',
        isFixed: true,
    });

    holidays.push({
        name: 'Restauração da Independência',
        date: new Date(year, 11, 1),
        type: 'national',
        isFixed: true,
    });

    holidays.push({
        name: 'Imaculada Conceição',
        date: new Date(year, 11, 8),
        type: 'religious',
        isFixed: true,
    });

    holidays.push({
        name: 'Natal',
        date: new Date(year, 11, 25),
        type: 'religious',
        isFixed: true,
    });

    // Movable Holidays (based on Easter)
    const easter = calculateEaster(year);

    // Sexta-feira Santa (Good Friday) - 2 days before Easter
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    holidays.push({
        name: 'Sexta-feira Santa',
        date: goodFriday,
        type: 'religious',
        isFixed: false,
    });

    // Páscoa (Easter Sunday)
    holidays.push({
        name: 'Páscoa',
        date: easter,
        type: 'religious',
        isFixed: false,
    });

    // Corpo de Deus (Corpus Christi) - 60 days after Easter
    const corpusChristi = new Date(easter);
    corpusChristi.setDate(easter.getDate() + 60);
    holidays.push({
        name: 'Corpo de Deus',
        date: corpusChristi,
        type: 'religious',
        isFixed: false,
    });

    // Sort by date
    holidays.sort((a, b) => a.date.getTime() - b.date.getTime());

    return holidays;
}

/**
 * Check if a date is a holiday
 */
export function isHoliday(date: Date, holidays: Holiday[]): Holiday | null {
    const dateStr = date.toDateString();
    const holiday = holidays.find(h => h.date.toDateString() === dateStr);
    return holiday || null;
}

/**
 * Get holiday name for a date
 */
export function getHolidayName(date: Date, holidays: Holiday[]): string | null {
    const holiday = isHoliday(date, holidays);
    return holiday ? holiday.name : null;
}

/**
 * Count holidays that fall on off days
 */
export function countHolidaysOff(calendar: { date: Date; shift: string }[], holidays: Holiday[]): number {
    let count = 0;

    for (const day of calendar) {
        if (day.shift === 'F') {
            const holiday = isHoliday(day.date, holidays);
            if (holiday) {
                count++;
            }
        }
    }

    return count;
}

/**
 * Get list of holidays that fall on off days
 */
export function getHolidaysOffList(calendar: { date: Date; shift: string }[], holidays: Holiday[]): Holiday[] {
    const holidaysOff: Holiday[] = [];

    for (const day of calendar) {
        if (day.shift === 'F') {
            const holiday = isHoliday(day.date, holidays);
            if (holiday) {
                holidaysOff.push(holiday);
            }
        }
    }

    return holidaysOff;
}

/**
 * Get list of holidays that are worked (not off)
 */
export function getHolidaysWorked(calendar: { date: Date; shift: string }[], holidays: Holiday[]): Holiday[] {
    const holidaysWorked: Holiday[] = [];

    for (const day of calendar) {
        if (day.shift !== 'F') {
            const holiday = isHoliday(day.date, holidays);
            if (holiday) {
                holidaysWorked.push(holiday);
            }
        }
    }

    return holidaysWorked;
}
