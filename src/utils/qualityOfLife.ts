import { Scenario, AnalysisResult } from '../types';
import { generateYearCalendar } from './calendar';

export interface QualityOfLifeScore {
    overall: number; // 0-100
    breakdown: {
        weekendsCoverage: number; // 0-100
        workLifeBalance: number; // 0-100
        consecutiveRest: number; // 0-100
        nightShiftImpact: number; // 0-100
        holidaysCoverage: number; // 0-100
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

const PORTUGUESE_HOLIDAYS = [
    '01-01', // Ano Novo
    '04-25', // 25 de Abril
    '05-01', // Dia do Trabalhador
    '06-10', // Dia de Portugal
    '08-15', // Assunção de Nossa Senhora
    '10-05', // Implantação da República
    '11-01', // Todos os Santos
    '12-01', // Restauração da Independência
    '12-08', // Imaculada Conceição
    '12-25', // Natal
];

function isHoliday(date: Date, customHolidays: string[] = []): boolean {
    const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return PORTUGUESE_HOLIDAYS.includes(monthDay) || customHolidays.includes(monthDay);
}

export function calculateQualityOfLifeScore(
    scenario: Scenario,
    analysis: AnalysisResult,
    year: number = new Date().getFullYear(),
    customHolidays: string[] = []
): QualityOfLifeScore {
    const calendar = generateYearCalendar(scenario, year);

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
        if (day.shift === 'F' && isHoliday(day.date, customHolidays)) {
            holidaysOff++;
        }
    });
    const totalHolidays = PORTUGUESE_HOLIDAYS.length + customHolidays.length;
    const holidaysCoverage = (holidaysOff / totalHolidays) * 100;

    // Calculate overall score (weighted average)
    const overall = (
        weekendsCoverage * 0.30 +
        hoursScore * 0.20 +
        consecutiveRest * 0.20 +
        nightShiftImpact * 0.20 +
        holidaysCoverage * 0.10
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
        insights.push('✅ Excelente cobertura de fins de semana para vida social e familiar.');
    } else if (weekendsCoverage < 50) {
        insights.push('⚠️ Poucos fins de semana livres podem afetar a qualidade de vida.');
    }

    if (Math.abs(analysis.weeklyHoursDifference ?? 0) <= 1) {
        insights.push('✅ Horas semanais equilibradas com o contrato.');
    }

    if (totalMiniVacations >= 4) {
        insights.push(`✅ ${totalMiniVacations} períodos de descanso prolongado (3+ dias) por ano.`);
    } else if (totalMiniVacations === 0) {
        insights.push('⚠️ Sem períodos de descanso prolongado. Considere ajustar o padrão.');
    }

    if (nightRatio > 0.25) {
        insights.push('⚠️ Alto número de turnos noturnos pode afetar a saúde e ritmo circadiano.');
    }

    if (holidaysCoverage >= 70) {
        insights.push('✅ Boa cobertura de feriados nacionais.');
    } else if (holidaysCoverage < 30) {
        insights.push('⚠️ Baixa cobertura de feriados pode reduzir tempo com família.');
    }

    return {
        overall: Math.round(overall),
        breakdown: {
            weekendsCoverage: Math.round(weekendsCoverage),
            workLifeBalance: Math.round(hoursScore),
            consecutiveRest: Math.round(consecutiveRest),
            nightShiftImpact: Math.round(nightShiftImpact),
            holidaysCoverage: Math.round(holidaysCoverage),
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
