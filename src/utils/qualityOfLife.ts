import { Scenario, AnalysisResult } from '../types';
import { generateYearCalendar } from './calendar';
import { getHolidayMonthDays, isHolidayByMonthDay } from './portugueseHolidays';

export interface QualityOfLifeScore {
    overall: number; // 0-100
    breakdown: {
        weekendsCoverage: number; // 0-100
        workLifeBalance: number; // 0-100
        consecutiveRest: number; // 0-100
        nightShiftImpact: number; // 0-100
        holidaysCoverage: number; // 0-100
        recoveryRegularity: number; // 0-100
        fatigueAccumulation: number; // 0-100 (new)
        socialDisruption: number; // 0-100 (new)
        circadianDisruption: number; // 0-100 (new)
        longTermSustainability: number; // 0-100 (new)
    };
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    insights: string[];
}

export interface CriticalPeriod {
    startDate: Date;
    endDate: Date;
    type: 'low-rest' | 'high-intensity' | 'consecutive-nights' | 'no-weekends';
    severity: 'low' | 'medium' | 'high';
    description: string;
    daysAffected: number;
}

function isHoliday(date: Date, holidayMonthDays: string[]): boolean {
    const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return isHolidayByMonthDay(monthDay, holidayMonthDays);
}

export function calculateQualityOfLifeScore(
    scenario: Scenario,
    analysis: AnalysisResult,
    year: number = new Date().getFullYear(),
    customHolidays: string[] = []
): QualityOfLifeScore {
    const calendar = generateYearCalendar(scenario, year);
    const holidayMonthDays = getHolidayMonthDays(year);

    // 1. Weekends Coverage (0-100)
    const idealWeekends = 26; // ~50% of weekends
    const actualWeekends = analysis.weekendsOffPerYear;
    const weekendsCoverage = Math.min(100, (actualWeekends / idealWeekends) * 100);

    // 2. Work-Life Balance (based on hours vs contract)
    const hoursScore = analysis.weeklyHoursDifference !== undefined
        ? Math.max(0, 100 - Math.abs(analysis.weeklyHoursDifference) * 10)
        : 70;

    // 3. Consecutive Rest Quality
    let maxConsecutiveOff = 0;
    let currentConsecutiveOff = 0;
    let totalMiniVacations = 0; // 3+ consecutive off days

    calendar.forEach(day => {
        if (day.shift === 'F') {
            currentConsecutiveOff++;
            maxConsecutiveOff = Math.max(maxConsecutiveOff, currentConsecutiveOff);
        } else {
            if (currentConsecutiveOff >= 3) {
                totalMiniVacations++;
            }
            currentConsecutiveOff = 0;
        }
    });

    const consecutiveRest = Math.min(100, (maxConsecutiveOff / 14) * 100 + totalMiniVacations * 10);

    // 4. Night Shift Impact (lower is better)
    const nightShifts = calendar.filter(d => d.shift === 'N').length;
    const nightRatio = nightShifts / calendar.length;
    const nightShiftImpact = Math.max(0, 100 - (nightRatio * 300)); // Penalize heavily for nights

    // 5. Holidays Coverage
    let holidaysOff = 0;
    calendar.forEach(day => {
        if (day.shift === 'F' && isHoliday(day.date, holidayMonthDays)) {
            holidaysOff++;
        }
    });
    const totalHolidays = holidayMonthDays.length + customHolidays.length;
    const holidaysCoverage = totalHolidays > 0 ? (holidaysOff / totalHolidays) * 100 : 0;

    // 6. Recovery & Regularity
    // Recovery after night blocks: average consecutive rest days following each night block.
    // Regularity: consistency of work-block lengths (lower std-dev -> more regular).
    let recoverySum = 0;
    let nightBlockCount = 0;
    let cursor = 0;
    while (cursor < calendar.length) {
        if (calendar[cursor].shift === 'N') {
            let end = cursor;
            while (end < calendar.length && calendar[end].shift === 'N') end++;
            let rest = 0;
            let k = end;
            while (k < calendar.length && calendar[k].shift === 'F') {
                rest++;
                k++;
            }
            recoverySum += rest;
            nightBlockCount++;
            cursor = end;
        } else {
            cursor++;
        }
    }
    const recoveryAfterNights = nightBlockCount === 0
        ? 100
        : Math.min(100, (recoverySum / nightBlockCount) * 50);

    const workRuns: number[] = [];
    let run = 0;
    calendar.forEach(day => {
        if (day.shift !== 'F') {
            run++;
        } else {
            if (run > 0) workRuns.push(run);
            run = 0;
        }
    });
    if (run > 0) workRuns.push(run);

    let regularity = 100;
    if (workRuns.length > 1) {
        const mean = workRuns.reduce((a, b) => a + b, 0) / workRuns.length;
        const variance = workRuns.reduce((a, b) => a + (b - mean) ** 2, 0) / workRuns.length;
        const std = Math.sqrt(variance);
        regularity = Math.max(0, 100 - std * 25);
    }

    const recoveryRegularity = Math.round((recoveryAfterNights + regularity) / 2);

    // 7. Fatigue Accumulation (cumulative fatigue from consecutive work blocks)
    let fatigueSum = 0;
    let workBlockCount = 0;
    cursor = 0;
    while (cursor < calendar.length) {
        if (calendar[cursor].shift !== 'F') {
            let end = cursor;
            while (end < calendar.length && calendar[end].shift !== 'F') end++;
            const blockLength = end - cursor;
            // Fatigue grows quadratically with block length
            fatigueSum += blockLength ** 2;
            workBlockCount++;
            cursor = end;
        } else {
            cursor++;
        }
    }
    const avgFatigue = workBlockCount === 0 ? 0 : fatigueSum / workBlockCount;
    // Normalize: 4-day blocks = baseline 100, 8-day blocks = ~400
    const fatigueAccumulation = Math.max(0, 100 - avgFatigue * 2);

    // 8. Social Disruption (weekends/evenings worked)
    let socialDisruptionSum = 0;
    calendar.forEach(day => {
        const dayOfWeek = day.date.getDay();
        if (day.shift !== 'F') {
            if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
                socialDisruptionSum += 15; // High penalty for weekend work
            } else if (day.shift === 'N') {
                socialDisruptionSum += 5; // Night shifts affect evening social life
            } else if (day.shift === 'T') {
                socialDisruptionSum += 3; // Afternoon shifts affect evening plans
            }
        }
    });
    const maxPossibleSocialDisruption = calendar.length * 15;
    const socialDisruption = maxPossibleSocialDisruption > 0
        ? Math.max(0, 100 - (socialDisruptionSum / maxPossibleSocialDisruption) * 100)
        : 100;

    // 9. Circadian Disruption (night shifts + quick rotations)
    let circadianPenalty = 0;
    cursor = 0;
    while (cursor < calendar.length) {
        if (calendar[cursor].shift === 'N') {
            circadianPenalty += 10; // Base penalty per night
            let end = cursor;
            while (end < calendar.length && calendar[end].shift === 'N') end++;
            const blockLength = end - cursor;
            if (blockLength > 2) {
                circadianPenalty += (blockLength - 2) * 5; // Extra penalty for consecutive nights
            }
            cursor = end;
        } else {
            cursor++;
        }
    }
    // Quick rotation penalty (day->night or night->day transitions)
    for (let i = 1; i < calendar.length; i++) {
        const prev = calendar[i - 1].shift;
        const curr = calendar[i].shift;
        if ((prev === 'M' && curr === 'N') || (prev === 'T' && curr === 'N') ||
            (prev === 'N' && curr === 'M') || (prev === 'N' && curr === 'T')) {
            circadianPenalty += 8; // Quick rotation penalty
        }
    }
    const circadianDisruption = Math.max(0, 100 - circadianPenalty * 0.5);

    // 10. Long-Term Sustainability (trend over the year)
    // Monthly trend analysis - does QoL degrade over months?
    const monthlyScores: number[] = [];
    for (let month = 0; month < 12; month++) {
        const monthDays = calendar.filter(d => d.date.getMonth() === month);
        let monthWork = 0, monthNights = 0, monthOff = 0;
        monthDays.forEach(d => {
            if (d.shift === 'F') monthOff++;
            else if (d.shift === 'N') monthNights++;
            else monthWork++;
        });
        const monthTotal = monthDays.length || 1;
        const monthScore = 100 - (monthNights / monthTotal) * 100 - (monthWork / monthTotal) * 20 + (monthOff / monthTotal) * 50;
        monthlyScores.push(Math.max(0, Math.min(100, monthScore)));
    }
    const sustainabilityTrend = monthlyScores.length > 1
        ? (monthlyScores[monthlyScores.length - 1] - monthlyScores[0]) / monthlyScores.length * 10
        : 0;
    const longTermSustainability = Math.max(0, Math.min(100, 70 - sustainabilityTrend * 5 + monthlyScores.reduce((a,b) => a+b, 0) / monthlyScores.length * 0.3));

    // Calculate overall score (weighted average with new metrics)
    const overall = (
        weekendsCoverage * 0.18 +
        hoursScore * 0.12 +
        consecutiveRest * 0.12 +
        nightShiftImpact * 0.12 +
        holidaysCoverage * 0.08 +
        recoveryRegularity * 0.12 +
        fatigueAccumulation * 0.08 +
        socialDisruption * 0.08 +
        circadianDisruption * 0.08 +
        longTermSustainability * 0.04
    );

    // Determine grade
    let grade: QualityOfLifeScore['grade'];
    if (overall >= 90) grade = 'A+';
    else if (overall >= 80) grade = 'A';
    else if (overall >= 70) grade = 'B';
    else if (overall >= 60) grade = 'C';
    else if (overall >= 50) grade = 'D';
    else grade = 'F';

    // Generate insights
    const insights: string[] = [];

    if (weekendsCoverage >= 80) {
        insights.push('Excelente cobertura de fins de semana para vida social e familiar.');
    } else if (weekendsCoverage < 50) {
        insights.push('Poucos fins de semana livres podem afetar a qualidade de vida.');
    }

    if (Math.abs(analysis.weeklyHoursDifference ?? 0) <= 1) {
        insights.push('Horas semanais equilibradas com o contrato.');
    }

    if (totalMiniVacations >= 4) {
        insights.push(`${totalMiniVacations} periodos de descanso prolongado (3+ dias) por ano.`);
    } else if (totalMiniVacations === 0) {
        insights.push('Sem periodos de descanso prolongado. Considere ajustar o padrao.');
    }

    if (nightRatio > 0.25) {
        insights.push('Alto numero de turnos noturnos pode afetar a saude e ritmo circadiano.');
    }

    if (holidaysCoverage >= 70) {
        insights.push('Boa cobertura de feriados nacionais.');
    } else if (holidaysCoverage < 30) {
        insights.push('Baixa cobertura de feriados pode reduzir tempo com familia.');
    }

    if (recoveryAfterNights >= 80 && regularity >= 80) {
        insights.push('Bom indice de recuperacao e regularidade: descanso apos noites e padrao previsivel.');
    } else {
        if (recoveryAfterNights < 60) {
            insights.push('Poucos dias de folga apos blocos de noite podem prejudicar a recuperacao.');
        }
        if (regularity < 60) {
            insights.push('Padrao irregular (blocos de trabalho com tamanhos variados) dificulta o planeamento.');
        }
    }

    return {
        overall: Math.round(overall),
        breakdown: {
            weekendsCoverage: Math.round(weekendsCoverage),
            workLifeBalance: Math.round(hoursScore),
            consecutiveRest: Math.round(consecutiveRest),
            nightShiftImpact: Math.round(nightShiftImpact),
            holidaysCoverage: Math.round(holidaysCoverage),
            recoveryRegularity: recoveryRegularity,
            fatigueAccumulation: Math.round(fatigueAccumulation),
            socialDisruption: Math.round(socialDisruption),
            circadianDisruption: Math.round(circadianDisruption),
            longTermSustainability: Math.round(longTermSustainability),
        },
        grade,
        insights,
    };
}

export function detectCriticalPeriods(
    scenario: Scenario,
    year: number = new Date().getFullYear()
): CriticalPeriod[] {
    const calendar = generateYearCalendar(scenario, year);
    const criticalPeriods: CriticalPeriod[] = [];

    // Detect consecutive work days without rest (critical if > 10 days)
    let consecutiveWork = 0;
    let workStartDate: Date | null = null;

    calendar.forEach((day, idx) => {
        if (day.shift !== 'F') {
            if (consecutiveWork === 0) {
                workStartDate = day.date;
            }
            consecutiveWork++;
        } else {
            if (consecutiveWork >= 10 && workStartDate) {
                criticalPeriods.push({
                    startDate: new Date(workStartDate),
                    endDate: new Date(calendar[idx - 1].date),
                    type: 'low-rest',
                    severity: consecutiveWork >= 14 ? 'high' : consecutiveWork >= 12 ? 'medium' : 'low',
                    description: `${consecutiveWork} dias consecutivos de trabalho sem folga`,
                    daysAffected: consecutiveWork,
                });
            }
            consecutiveWork = 0;
            workStartDate = null;
        }
    });

    // Detect consecutive night shifts (critical if > 5 nights)
    let consecutiveNights = 0;
    let nightsStartDate: Date | null = null;

    calendar.forEach((day, idx) => {
        if (day.shift === 'N') {
            if (consecutiveNights === 0) {
                nightsStartDate = day.date;
            }
            consecutiveNights++;
        } else {
            if (consecutiveNights >= 5 && nightsStartDate) {
                criticalPeriods.push({
                    startDate: new Date(nightsStartDate),
                    endDate: new Date(calendar[idx - 1].date),
                    type: 'consecutive-nights',
                    severity: consecutiveNights >= 7 ? 'high' : 'medium',
                    description: `${consecutiveNights} noites consecutivas de trabalho`,
                    daysAffected: consecutiveNights,
                });
            }
            consecutiveNights = 0;
            nightsStartDate = null;
        }
    });

    // Detect long periods without weekends off (4+ weeks)
    let weeksSinceWeekend = 0;
    let lastWeekendOffDate: Date | null = null;

    calendar.forEach(day => {
        const dayOfWeek = day.date.getDay();

        if (day.isWeekendOff && (dayOfWeek === 6 || dayOfWeek === 0)) {
            if (weeksSinceWeekend >= 4 && lastWeekendOffDate) {
                criticalPeriods.push({
                    startDate: new Date(lastWeekendOffDate),
                    endDate: new Date(day.date),
                    type: 'no-weekends',
                    severity: weeksSinceWeekend >= 6 ? 'high' : 'medium',
                    description: `${weeksSinceWeekend} semanas sem fim de semana completo de folga`,
                    daysAffected: weeksSinceWeekend * 7,
                });
            }
            weeksSinceWeekend = 0;
            lastWeekendOffDate = new Date(day.date);
        } else if (dayOfWeek === 0) { // Count weeks on Sundays
            weeksSinceWeekend++;
        }
    });

    return criticalPeriods.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
    });
}
