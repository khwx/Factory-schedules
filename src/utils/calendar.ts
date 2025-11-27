import { Scenario, YearlyAnalysis, MonthlyBreakdown, DayInfo, ShiftType } from '../types';

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
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

        // Count off days
        if (day.shift === 'F') {
            monthlyBreakdown[month].totalOffDays++;
            totalOffDays++;
        }

        // Count Saturdays off
        if (day.date.getDay() === 6 && day.shift === 'F') {
            monthlyBreakdown[month].saturdaysOff++;
            totalSaturdaysOff++;
        }

        // Count Sundays off
        if (day.date.getDay() === 0 && day.shift === 'F') {
            monthlyBreakdown[month].sundaysOff++;
            totalSundaysOff++;
        }

        // Count weekends off (only on Saturday to avoid double counting)
        if (day.date.getDay() === 6 && day.isWeekendOff) {
            monthlyBreakdown[month].weekendsOff++;
            totalWeekends++;
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
