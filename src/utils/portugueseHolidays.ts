/**
 * Portuguese Holidays - Single source of truth
 * Includes fixed and movable holidays (Easter-based)
 */

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

export interface Holiday {
    name: string;
    date: Date;
    type: 'national' | 'religious' | 'regional';
    isFixed: boolean;
    monthDay: string; // Format: 'MM-DD' for quick lookup
}

/**
 * Get all Portuguese holidays for a given year
 */
export function getPortugueseHolidays(year: number): Holiday[] {
    const holidays: Holiday[] = [];

    const fixedHolidays: Array<{ name: string; month: number; day: number; type: 'national' | 'religious' }> = [
        { name: 'Ano Novo', month: 0, day: 1, type: 'national' },
        { name: 'Dia da Liberdade', month: 3, day: 25, type: 'national' },
        { name: 'Dia do Trabalhador', month: 4, day: 1, type: 'national' },
        { name: 'Dia de Portugal', month: 5, day: 10, type: 'national' },
        { name: 'Assunção de Nossa Senhora', month: 7, day: 15, type: 'religious' },
        { name: 'Implantação da República', month: 9, day: 5, type: 'national' },
        { name: 'Dia de Todos os Santos', month: 10, day: 1, type: 'religious' },
        { name: 'Restauração da Independência', month: 11, day: 1, type: 'national' },
        { name: 'Imaculada Conceição', month: 11, day: 8, type: 'religious' },
        { name: 'Natal', month: 11, day: 25, type: 'religious' },
    ];

    for (const h of fixedHolidays) {
        const date = new Date(year, h.month, h.day);
        holidays.push({
            name: h.name,
            date,
            type: h.type,
            isFixed: true,
            monthDay: `${String(h.month + 1).padStart(2, '0')}-${String(h.day).padStart(2, '0')}`,
        });
    }

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
        monthDay: `${String(goodFriday.getMonth() + 1).padStart(2, '0')}-${String(goodFriday.getDate()).padStart(2, '0')}`,
    });

    // Páscoa (Easter Sunday)
    holidays.push({
        name: 'Páscoa',
        date: easter,
        type: 'religious',
        isFixed: false,
        monthDay: `${String(easter.getMonth() + 1).padStart(2, '0')}-${String(easter.getDate()).padStart(2, '0')}`,
    });

    // Corpo de Deus (Corpus Christi) - 60 days after Easter
    const corpusChristi = new Date(easter);
    corpusChristi.setDate(easter.getDate() + 60);
    holidays.push({
        name: 'Corpo de Deus',
        date: corpusChristi,
        type: 'religious',
        isFixed: false,
        monthDay: `${String(corpusChristi.getMonth() + 1).padStart(2, '0')}-${String(corpusChristi.getDate()).padStart(2, '0')}`,
    });

    // Sort by date
    holidays.sort((a, b) => a.date.getTime() - b.date.getTime());

    return holidays;
}

/**
 * Get month-day strings for all holidays in a given year (for quick lookup)
 */
export function getHolidayMonthDays(year: number): string[] {
    return getPortugueseHolidays(year).map(h => h.monthDay);
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
 * Check if a date is a holiday by month-day string
 */
export function isHolidayByMonthDay(monthDay: string, holidayMonthDays: string[]): boolean {
    return holidayMonthDays.includes(monthDay);
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

/**
 * Get total number of holidays in a year (fixed + movable)
 */
export function getTotalHolidaysCount(year: number): number {
    return getPortugueseHolidays(year).length;
}
