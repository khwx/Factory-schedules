import { DayInfo, AdvancedMetrics } from '../types';
import { getPortugueseHolidays, countHolidaysOff, getHolidaysOffList, getHolidaysWorked } from './holidays';

/**
 * Calculate advanced metrics from a year calendar
 */
export const calculateAdvancedMetrics = (calendar: DayInfo[]): AdvancedMetrics => {
    let maxConsecutiveOffDays = 0;
    let maxConsecutiveWorkDays = 0;
    let maxConsecutiveNightShifts = 0;

    let currentOffStreak = 0;
    let currentWorkStreak = 0;
    let currentNightStreak = 0;

    let miniVacations = 0;
    let isolatedOffDays = 0;

    let totalNightShifts = 0;
    let fridayNightsOff = 0;
    let saturdayNightsOff = 0;
    let sundayMorningsOff = 0;

    // Get year from calendar
    const year = calendar[0]?.date.getFullYear() || new Date().getFullYear();
    const holidays = getPortugueseHolidays(year);

    // Analyze consecutive patterns
    for (let i = 0; i < calendar.length; i++) {
        const day = calendar[i];
        const dayOfWeek = day.date.getDay();

        // Off days streak
        if (day.shift === 'F') {
            currentOffStreak++;
            currentWorkStreak = 0;
            // Don't reset night streak here - only when we hit a non-night work day
        } else {
            // End of off streak
            if (currentOffStreak > 0) {
                maxConsecutiveOffDays = Math.max(maxConsecutiveOffDays, currentOffStreak);

                // Check for mini-vacations (3+ days)
                if (currentOffStreak >= 3) {
                    miniVacations++;
                }

                // Check for isolated off days (exactly 1 day)
                if (currentOffStreak === 1) {
                    isolatedOffDays++;
                }
            }
            currentOffStreak = 0;
            currentWorkStreak++;

            // Night shifts - only reset when we hit a non-night shift
            if (day.shift === 'N') {
                totalNightShifts++;
                currentNightStreak++;
            } else {
                // Hit a non-night work shift (M or T), end the night streak
                if (currentNightStreak > 0) {
                    maxConsecutiveNightShifts = Math.max(maxConsecutiveNightShifts, currentNightStreak);
                }
                currentNightStreak = 0;
            }
        }

        // Update max work streak
        if (currentWorkStreak > 0) {
            maxConsecutiveWorkDays = Math.max(maxConsecutiveWorkDays, currentWorkStreak);
        }

        // Friday nights off (Friday not working night shift)
        if (dayOfWeek === 5 && day.shift !== 'N') {
            fridayNightsOff++;
        }

        // Saturday nights off
        if (dayOfWeek === 6 && day.shift !== 'N') {
            saturdayNightsOff++;
        }

        // Sunday mornings off (Sunday not working morning shift)
        if (dayOfWeek === 0 && day.shift !== 'M') {
            sundayMorningsOff++;
        }
    }

    // Handle end-of-year streaks
    if (currentOffStreak > 0) {
        maxConsecutiveOffDays = Math.max(maxConsecutiveOffDays, currentOffStreak);
        if (currentOffStreak >= 3) miniVacations++;
        if (currentOffStreak === 1) isolatedOffDays++;
    }
    if (currentNightStreak > 0) {
        maxConsecutiveNightShifts = Math.max(maxConsecutiveNightShifts, currentNightStreak);
    }

    const nightShiftsPerMonth = totalNightShifts / 12;

    // Holiday analysis
    const holidaysOffCount = countHolidaysOff(calendar, holidays);
    const holidaysOffList = getHolidaysOffList(calendar, holidays);
    const holidaysWorkedList = getHolidaysWorked(calendar, holidays);

    return {
        maxConsecutiveOffDays,
        maxConsecutiveWorkDays,
        maxConsecutiveNightShifts,
        miniVacations,
        isolatedOffDays,
        totalNightShifts,
        nightShiftsPerMonth,
        fridayNightsOff,
        saturdayNightsOff,
        sundayMorningsOff,
        holidaysOff: holidaysOffCount,
        holidaysWorked: holidaysWorkedList.length,
        holidaysList: holidaysOffList.map(h => h.name),
    };
};

/**
 * Generate qualitative insights from advanced metrics
 */
export const generateAdvancedInsights = (metrics: AdvancedMetrics): string[] => {
    const insights: string[] = [];

    // Holidays - Working holidays is good (better pay)
    if (metrics.holidaysWorked >= 10) {
        insights.push(`💰 Excellent earnings potential: ${metrics.holidaysWorked} feriados trabalhados (pagamento majorado).`);
    } else if (metrics.holidaysWorked >= 6) {
        insights.push(`💰 Good earnings: ${metrics.holidaysWorked} feriados trabalhados com pagamento extra.`);
    } else if (metrics.holidaysWorked < 3) {
        insights.push(`ℹ️ Few paid holidays worked: apenas ${metrics.holidaysWorked} feriados trabalhados.`);
    }

    if (metrics.holidaysOff > 10) {
        insights.push(`ℹ️ Many holidays off: ${metrics.holidaysOff} feriados de folga (menos rendimento extra).`);
    }

    // Consecutive off days
    if (metrics.maxConsecutiveOffDays >= 5) {
        insights.push(`✅ Excellent rest periods: up to ${metrics.maxConsecutiveOffDays} consecutive days off.`);
    } else if (metrics.maxConsecutiveOffDays <= 2) {
        insights.push(`⚠️ Short rest periods: maximum ${metrics.maxConsecutiveOffDays} consecutive days off.`);
    }

    // Mini-vacations
    if (metrics.miniVacations >= 4) {
        insights.push(`✅ ${metrics.miniVacations} mini-vacations (3+ days off) per year.`);
    } else if (metrics.miniVacations === 0) {
        insights.push(`⚠️ No mini-vacation opportunities (3+ consecutive days off).`);
    }

    // Isolated off days
    if (metrics.isolatedOffDays > 20) {
        insights.push(`⚠️ Many isolated off-days (${metrics.isolatedOffDays}). Less effective for recovery.`);
    }

    // Consecutive work days
    if (metrics.maxConsecutiveWorkDays > 7) {
        insights.push(`⚠️ Long work stretches: up to ${metrics.maxConsecutiveWorkDays} consecutive days. Risk of burnout.`);
    } else if (metrics.maxConsecutiveWorkDays <= 5) {
        insights.push(`✅ Reasonable work stretches: maximum ${metrics.maxConsecutiveWorkDays} consecutive days.`);
    }

    // Night shifts
    if (metrics.nightShiftsPerMonth > 10) {
        insights.push(`⚠️ High night shift load: ${metrics.nightShiftsPerMonth.toFixed(1)} per month. Monitor health impacts.`);
    } else if (metrics.nightShiftsPerMonth < 5) {
        insights.push(`✅ Moderate night shift load: ${metrics.nightShiftsPerMonth.toFixed(1)} per month.`);
    }

    if (metrics.maxConsecutiveNightShifts > 5) {
        insights.push(`⚠️ Long night shift sequences: up to ${metrics.maxConsecutiveNightShifts} consecutive nights. Impacts circadian rhythm.`);
    }

    // Social life
    if (metrics.fridayNightsOff >= 40) {
        insights.push(`✅ Good social life potential: ${metrics.fridayNightsOff} Friday nights free.`);
    }

    if (metrics.sundayMorningsOff >= 45) {
        insights.push(`✅ Family-friendly: ${metrics.sundayMorningsOff} Sunday mornings free.`);
    }

    return insights;
};
