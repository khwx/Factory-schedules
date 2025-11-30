import { Scenario, YearlyAnalysis, MonthlyBreakdown, DayInfo, ShiftType } from '../types';

const MONTH_NAMES = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

/**
 * Helper to calculate difference in days between two dates robustly
 * Normalizes times to noon to avoid DST issues at midnight
 */
function getDaysDifference(date1: Date, date2: Date): number {
    // Create new dates to avoid modifying originals
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Set to noon to avoid DST issues at midnight
    d1.setHours(12, 0, 0, 0);
    d2.setHours(12, 0, 0, 0);

    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generate a full year calendar with shift assignments
 * @param scenario - The shift scenario
 * @param year - The year to generate
 * @param teamOffset - Offset for team-specific view. If teamPatterns exists, this is the team INDEX. Otherwise it's a day offset.
 */
export const generateYearCalendar = (scenario: Scenario, year: number, teamOffset: number = 0): DayInfo[] => {
    const { pattern, startDate: scenarioStartDate, teamPatterns } = scenario;

    // Determine which pattern to use
    // If teamPatterns exists and we have a valid index, use that specific pattern
    // Otherwise fall back to the default pattern
    const hasExplicitTeamPattern = teamPatterns && teamPatterns[teamOffset];
    const activePattern = hasExplicitTeamPattern ? teamPatterns[teamOffset] : pattern;
    const patternLength = activePattern.length;

    const calendar: DayInfo[] = [];

    const yearStartDate = new Date(year, 0, 1);
    const daysInYear = isLeapYear(year) ? 366 : 365;

    // Calculate initial offset based on scenario start date if available
    let initialPatternOffset = 0;
    if (scenarioStartDate) {
        // Parse start date explicitly to ensure local time consistency
        // scenarioStartDate is expected to be YYYY-MM-DD
        const [sYear, sMonth, sDay] = scenarioStartDate.split('-').map(Number);
        const start = new Date(sYear, sMonth - 1, sDay); // Month is 0-indexed

        const yearStart = new Date(year, 0, 1);

        // Use a robust difference calculation (noon to noon) to avoid DST issues
        const diffDays = getDaysDifference(start, yearStart);

        // Calculate offset: ensure positive modulo
        initialPatternOffset = ((diffDays % patternLength) + patternLength) % patternLength;
    }

    for (let i = 0; i < daysInYear; i++) {
        const currentDate = new Date(year, 0, 1);
        currentDate.setDate(yearStartDate.getDate() + i);
        const dayOfWeek = currentDate.getDay();

        // Calculate pattern index
        // If we have an explicit team pattern, we ONLY apply the date offset (initialPatternOffset)
        // If we are using the default pattern, we apply the teamOffset (assuming it represents a shift)

        const offsetToAdd = hasExplicitTeamPattern ? 0 : teamOffset;
        const patternIndex = (initialPatternOffset + i + offsetToAdd) % patternLength;
        const shift = activePattern[patternIndex] as ShiftType;

        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Check if this is part of a weekend off (Sat+Sun both off)
        let isWeekendOff = false;
        if (dayOfWeek === 6) { // Saturday
            const nextDayIndex = (initialPatternOffset + i + 1 + offsetToAdd) % patternLength;
            const nextShift = activePattern[nextDayIndex];
            isWeekendOff = shift === 'F' && nextShift === 'F';
        } else if (dayOfWeek === 0) { // Sunday
            const prevDayIndex = (initialPatternOffset + i - 1 + offsetToAdd + patternLength) % patternLength;
            const prevShift = activePattern[prevDayIndex];
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
            } else if (shift === 'F') {
                // It's just a Saturday off (Sunday is worked)
                monthlyBreakdown[month].saturdaysOff++;
                totalSaturdaysOff++;
            }
        } else if (dayOfWeek === 0) { // Sunday
            if (day.isWeekendOff) {
                // Part of a full weekend off.
                // Do NOTHING here. It was already counted on Saturday.
            } else if (shift === 'F') {
                // It's just a Sunday off (Saturday was worked)
                monthlyBreakdown[month].sundaysOff++;
                totalSundaysOff++;
            }
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
