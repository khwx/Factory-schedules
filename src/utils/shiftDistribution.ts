import { Scenario } from '../types';
import { generateYearCalendar } from './calendar';

export interface ShiftDistribution {
    totalDays: number;
    morning: number;
    afternoon: number;
    night: number;
    off: number;
    morningPct: number;
    afternoonPct: number;
    nightPct: number;
    offPct: number;
    avgWorkPerWeek: number;
}

/**
 * Compute the annual distribution of shift types for a scenario's default team.
 * Useful for ergonomics and workload analysis.
 */
export function computeShiftDistribution(
    scenario: Scenario,
    year: number = new Date().getFullYear()
): ShiftDistribution {
    const calendar = generateYearCalendar(scenario, year);

    const counts = {
        morning: 0,
        afternoon: 0,
        night: 0,
        off: 0,
    };

    for (const day of calendar) {
        switch (day.shift) {
            case 'M': counts.morning++; break;
            case 'T': counts.afternoon++; break;
            case 'N': counts.night++; break;
            case 'F': counts.off++; break;
            default: break;
        }
    }

    const totalDays = calendar.length;

    const pct = (n: number) => totalDays > 0 ? parseFloat(((n / totalDays) * 100).toFixed(1)) : 0;

    const workDays = counts.morning + counts.afternoon + counts.night;
    const weeks = totalDays / 7;
    const avgWorkPerWeek = weeks > 0 ? parseFloat((workDays / weeks).toFixed(2)) : 0;

    return {
        totalDays,
        morning: counts.morning,
        afternoon: counts.afternoon,
        night: counts.night,
        off: counts.off,
        morningPct: pct(counts.morning),
        afternoonPct: pct(counts.afternoon),
        nightPct: pct(counts.night),
        offPct: pct(counts.off),
        avgWorkPerWeek,
    };
}

export interface ErgonomicAssessment {
    nightDensity: 'low' | 'moderate' | 'high';
    offDensity: 'low' | 'good' | 'excellent';
    workPerWeekRating: 'light' | 'normal' | 'heavy';
    suggestions: string[];
}

/**
 * Produce an ergonomic assessment based on the shift distribution.
 */
export function assessErgonomics(distribution: ShiftDistribution): ErgonomicAssessment {
    const suggestions: string[] = [];

    let nightDensity: 'low' | 'moderate' | 'high';
    if (distribution.nightPct < 15) {
        nightDensity = 'low';
        suggestions.push('Baixa densidade de turnos noturnos — bom para a saúde do colaborador.');
    } else if (distribution.nightPct <= 30) {
        nightDensity = 'moderate';
        suggestions.push('Densidade noturna moderada. Monitorize o impacto no ritmo circadiano.');
    } else {
        nightDensity = 'high';
        suggestions.push('Densidade noturna elevada. Considere rotacionar turnos com mais frequência.');
    }

    let offDensity: 'low' | 'good' | 'excellent';
    if (distribution.offPct < 25) {
        offDensity = 'low';
        suggestions.push('Poucos dias de folga. Assegure períodos de descanso adequados.');
    } else if (distribution.offPct <= 35) {
        offDensity = 'good';
        suggestions.push('Proporção de folgas adequada para a maioria das indústrias.');
    } else {
        offDensity = 'excellent';
        suggestions.push('Elevada proporção de folgas — excelente para recuperação.');
    }

    let workPerWeekRating: 'light' | 'normal' | 'heavy';
    if (distribution.avgWorkPerWeek < 4) {
        workPerWeekRating = 'light';
    } else if (distribution.avgWorkPerWeek <= 5.5) {
        workPerWeekRating = 'normal';
        suggestions.push('Carga semanal de trabalho dentro do padrão habitual.');
    } else {
        workPerWeekRating = 'heavy';
        suggestions.push('Elevada carga semanal. Considere reduzir para evitar fadiga.');
    }

    return { nightDensity, offDensity, workPerWeekRating, suggestions };
}