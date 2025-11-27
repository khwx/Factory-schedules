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
        insights.push(`💰 Potencial de ganhos excelente: ${metrics.holidaysWorked} feriados trabalhados (pagamento majorado).`);
    } else if (metrics.holidaysWorked >= 6) {
        insights.push(`💰 Bons ganhos: ${metrics.holidaysWorked} feriados trabalhados com pagamento extra.`);
    } else if (metrics.holidaysWorked < 3) {
        insights.push(`ℹ️ Poucos feriados trabalhados: apenas ${metrics.holidaysWorked} feriados trabalhados.`);
    }

    if (metrics.holidaysOff > 10) {
        insights.push(`ℹ️ Muitos feriados de folga: ${metrics.holidaysOff} feriados de folga (menos rendimento extra).`);
    }

    // Consecutive off days
    if (metrics.maxConsecutiveOffDays >= 5) {
        insights.push(`✅ Excelentes períodos de descanso: até ${metrics.maxConsecutiveOffDays} dias de folga consecutivos.`);
    } else if (metrics.maxConsecutiveOffDays <= 2) {
        insights.push(`⚠️ Períodos de descanso curtos: máximo de ${metrics.maxConsecutiveOffDays} dias de folga consecutivos.`);
    }

    // Mini-vacations
    if (metrics.miniVacations >= 4) {
        insights.push(`✅ ${metrics.miniVacations} mini-férias (3+ dias de folga) por ano.`);
    } else if (metrics.miniVacations === 0) {
        insights.push(`⚠️ Sem oportunidades de mini-férias (3+ dias de folga consecutivos).`);
    }

    // Isolated off days
    if (metrics.isolatedOffDays > 20) {
        insights.push(`⚠️ Muitos dias de folga isolados (${metrics.isolatedOffDays}). Menos eficaz para recuperação.`);
    }

    // Consecutive work days
    if (metrics.maxConsecutiveWorkDays > 7) {
        insights.push(`⚠️ Longos períodos de trabalho: até ${metrics.maxConsecutiveWorkDays} dias consecutivos. Risco de burnout.`);
    } else if (metrics.maxConsecutiveWorkDays <= 5) {
        insights.push(`✅ Períodos de trabalho razoáveis: máximo de ${metrics.maxConsecutiveWorkDays} dias consecutivos.`);
    }

    // Night shifts
    if (metrics.nightShiftsPerMonth > 10) {
        insights.push(`⚠️ Carga elevada de turnos noturnos: ${metrics.nightShiftsPerMonth.toFixed(1)} por mês. Monitorizar impacto na saúde.`);
    } else if (metrics.nightShiftsPerMonth < 5) {
        insights.push(`✅ Carga moderada de turnos noturnos: ${metrics.nightShiftsPerMonth.toFixed(1)} por mês.`);
    }

    if (metrics.maxConsecutiveNightShifts > 5) {
        insights.push(`⚠️ Sequências longas de turnos noturnos: até ${metrics.maxConsecutiveNightShifts} noites consecutivas. Impacta o ritmo circadiano.`);
    }

    // Social life
    if (metrics.fridayNightsOff >= 40) {
        insights.push(`✅ Bom potencial de vida social: ${metrics.fridayNightsOff} noites de sexta-feira livres.`);
    }

    if (metrics.sundayMorningsOff >= 45) {
        insights.push(`✅ Favorável à família: ${metrics.sundayMorningsOff} manhãs de domingo livres.`);
    }

    return insights;
};
