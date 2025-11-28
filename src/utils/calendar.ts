import { Scenario, YearlyAnalysis, MonthlyBreakdown, DayInfo, ShiftType } from '../types';

const MONTH_NAMES = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

/**
 * Generate a full year calendar with shift assignments
 * @param scenario - The shift scenario
 * @param year - The year to generate
 * @param teamOffset - Offset for team-specific view (0 = Team 1, 1 = Team 2, etc.)
 */
export const generateYearCalendar = (scenario: Scenario, year: number, teamOffset: number = 0): DayInfo[] => {
    const { pattern } = scenario;
    const patternLength = pattern.length;
    const calendar: DayInfo[] = [];

    const startDate = new Date(year, 0, 1);
    const daysInYear = isLeapYear(year) ? 366 : 365;

    for (let i = 0; i < daysInYear; i++) {
        const currentDate = new Date(year, 0, 1);
        currentDate.setDate(startDate.getDate() + i);
        const dayOfWeek = currentDate.getDay();

        // Apply team offset to the pattern index
        const patternIndex = (i + teamOffset) % patternLength;
        const shift = pattern[patternIndex] as ShiftType;

        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Check if this is part of a weekend off (Sat+Sun both off)
        let isWeekendOff = false;
        if (dayOfWeek === 6) { // Saturday
            const nextDayIndex = (i + 1 + teamOffset) % patternLength;
            const nextShift = pattern[nextDayIndex];
            isWeekendOff = shift === 'F' && nextShift === 'F';
        } else if (dayOfWeek === 0) { // Sunday
            const prevDayIndex = (i - 1 + teamOffset + patternLength) % patternLength;
            const prevShift = pattern[prevDayIndex];
            isWeekendOff = shift === 'F' && prevShift === 'F';
        }

        calendar.push({
            date: new Date(currentDate),
            shift,
            isWeekend,
            isWeekendOff,
        });
    }

    return calendar;
};

/**
 * Analyze a year calendar and extract metrics
 */
export const analyzeYearCalendar = (calendar: DayInfo[], year: number): YearlyAnalysis => {
    const monthlyBreakdown: MonthlyBreakdown[] = [];

    // Initialize monthly data
    for (let month = 0; month < 12; month++) {
        monthlyBreakdown.push({
            month: month + 1,
            monthName: MONTH_NAMES[month],
            weekendsOff: 0,
            saturdaysOff: 0,
            sundaysOff: 0,
            totalOffDays: 0,
        });
    }

    let totalWeekends = 0;
    let totalSaturdaysOff = 0;
    let totalSundaysOff = 0;
    let totalOffDays = 0;

    // Count weekends off (only count once per weekend, on Saturday)
    for (let i = 0; i < calendar.length; i++) {
        const day = calendar[i];
        const month = day.date.getMonth();

        const dayOfWeek = day.date.getDay();
        const shift = day.shift;

        // Count off days
        if (shift === 'F') {
            monthlyBreakdown[month].totalOffDays++;
            totalOffDays++;
        }

        // Logic for Exclusive Counting:
        // 1. Full Weekend (Sat+Sun off): Counts as weekendsOff (assigned to Saturday's month)
        // 2. Partial Saturday (Sat off, Sun work): Counts as saturdaysOff
        // 3. Partial Sunday (Sat work, Sun off): Counts as sundaysOff

        if (dayOfWeek === 6) { // Saturday
            if (day.isWeekendOff) {
                // It's a full weekend off
                monthlyBreakdown[month].weekendsOff++;
                totalWeekends++;
            }
            // Partial Saturday (Sat off, Sun work) -> IGNORED as per user request
            // else if (shift === 'F') { ... }
        } else if (dayOfWeek === 0) { // Sunday
            // Partial Sunday (Sat work, Sun off) -> IGNORED as per user request
            // Only full weekends matter.
        }
    }

    return {
        year,
        totalWeekends,
        totalSaturdaysOff,
        totalSundaysOff,
        totalOffDays,
        monthlyBreakdown,
    };
};

/**
 * Generate multi-year analysis (5 years)
 */
export const generateMultiYearAnalysis = (scenario: Scenario, startYear: number = new Date().getFullYear()): YearlyAnalysis[] => {
    const years: YearlyAnalysis[] = [];

    for (let i = 0; i < 5; i++) {
        const year = startYear + i;
        const calendar = generateYearCalendar(scenario, year);
        const analysis = analyzeYearCalendar(calendar, year);
        years.push(analysis);
    }

    return years;
};

/**
 * Check if a year is a leap year
 */
function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
