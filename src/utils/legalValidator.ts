import { DayInfo, Scenario } from '../types';
import { generateYearCalendar } from './calendar';
import { getAllHolidays } from './holidays';

export interface LegalRule {
    id: string;
    article: string;
    title: string;
    description: string;
}

export interface LegalRuleResult {
    rule: LegalRule;
    passed: boolean;
    details: string;
    actual?: number;
    limit?: number;
}

export interface LegalComplianceReport {
    scenarioId: string;
    scenarioName: string;
    year: number;
    teamIndex: number;
    teamName: string;
    results: LegalRuleResult[];
    allPassed: boolean;
    criticalFailures: number;
    warnings: number;
}

const RULES: LegalRule[] = [
    {
        id: 'rest-11h',
        article: 'Art. 214º CT',
        title: 'Intervalo Mínimo 11h Entre Turnos',
        description: 'O intervalo entre dois turnos consecutivos deve ser de pelo menos 11 horas.',
    },
    {
        id: 'max-night-sequence',
        article: 'Art. 221º CT',
        title: 'Limite de Noites Consecutivas',
        description: 'Não podem ser prestados mais de 5 turnos nocturnos consecutivos.',
    },
    {
        id: 'weekly-rest',
        article: 'Art. 232º CT',
        title: 'Descanso Semanal Mínimo',
        description: 'Pelo menos 1 dia de descanso completo por cada período de 7 dias.',
    },
    {
        id: 'max-consecutive-work',
        article: 'Art. 221º CT',
        title: 'Limite Dias Consecutivos de Trabalho',
        description: 'Recomenda-se evitar mais de 7 dias consecutivos de trabalho para prevenir fadiga.',
    },
    {
        id: 'night-compensation',
        article: 'Art. 226º CT',
        title: 'Compensação Trabalho Nocturno',
        description: 'Trabalho nocturno tem acréscimo salarial de 25%.',
    },
    {
        id: 'holiday-compensation',
        article: 'Art. 269º CT',
        title: 'Compensação Trabalho em Feriado',
        description: 'Trabalho em feriado obrigatório tem pagamento a dobrar ou compensação equivalente.',
    },
];

function find11hRestViolations(calendar: DayInfo[]): number {
    let violations = 0;
    const workDays = calendar.filter(d => d.shift !== 'F');

    for (let i = 1; i < workDays.length; i++) {
        const prev = workDays[i - 1];
        const curr = workDays[i];
        const diffMs = curr.date.getTime() - prev.date.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours < 11) {
            violations++;
        }
    }

    return violations;
}

function findMaxConsecutiveNights(calendar: DayInfo[]): number {
    let maxStreak = 0;
    let currentStreak = 0;

    for (const day of calendar) {
        if (day.shift === 'N') {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    }

    return maxStreak;
}

function findMaxConsecutiveWork(calendar: DayInfo[]): number {
    let maxStreak = 0;
    let currentStreak = 0;

    for (const day of calendar) {
        if (day.shift !== 'F') {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    }

    return maxStreak;
}

function findWeeklyRestViolations(calendar: DayInfo[]): number {
    if (calendar.length === 0) return 0;

    let violations = 0;

    for (let weekStart = 0; weekStart < 364; weekStart += 7) {
        const weekSlice: DayInfo[] = [];
        for (let j = 0; j < 7; j++) {
            const idx = weekStart + j;
            if (idx < calendar.length) {
                weekSlice.push(calendar[idx]);
            }
        }
        if (weekSlice.length === 0) continue;

        const hasFullRestDay = weekSlice.some(d => d.shift === 'F');
        if (!hasFullRestDay) {
            violations++;
        }
    }

    return violations;
}

function countNightShifts(calendar: DayInfo[]): number {
    return calendar.filter(d => d.shift === 'N').length;
}

function countHolidaysWorked(calendar: DayInfo[]): number {
    const year = calendar[0]?.date.getFullYear() || new Date().getFullYear();
    const holidays = getAllHolidays(year);
    const holidayDates = new Set(
        holidays.map(h => {
            const d = new Date(h.date);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );

    return calendar.filter(d => {
        const key = `${d.date.getFullYear()}-${d.date.getMonth()}-${d.date.getDate()}`;
        return holidayDates.has(key) && d.shift !== 'F';
    }).length;
}

export function validateLegalCompliance(
    scenario: Scenario,
    year: number = new Date().getFullYear(),
): LegalComplianceReport[] {
    const reports: LegalComplianceReport[] = [];

    for (let team = 0; team < scenario.teams; team++) {
        const calendar = generateYearCalendar(scenario, year, team);
        const teamName = `Equipa ${String.fromCharCode(65 + team)}`;

        const results: LegalRuleResult[] = [];

        const restViolations = find11hRestViolations(calendar);
        results.push({
            rule: RULES[0],
            passed: restViolations === 0,
            details: restViolations === 0
                ? 'Todos os intervalos entre turnos cumprem o mínimo de 11h.'
                : `${restViolations} violações do intervalo mínimo de 11h entre turnos.`,
            actual: restViolations,
            limit: 0,
        });

        const maxNights = findMaxConsecutiveNights(calendar);
        results.push({
            rule: RULES[1],
            passed: maxNights <= 5,
            details: maxNights <= 5
                ? `Máximo de ${maxNights} noites consecutivas — dentro do limite legal de 5.`
                : `Foram encontradas sequências de ${maxNights} noites consecutivas — excede o limite legal de 5.`,
            actual: maxNights,
            limit: 5,
        });

        const maxWork = findMaxConsecutiveWork(calendar);
        results.push({
            rule: RULES[3],
            passed: maxWork <= 7,
            details: maxWork <= 7
                ? `Máximo de ${maxWork} dias consecutivos de trabalho — dentro do recomendado (≤7).`
                : `Máximo de ${maxWork} dias consecutivos de trabalho — excede os 7 dias recomendados para prevenção de fadiga.`,
            actual: maxWork,
            limit: 7,
        });

        const weeklyViolations = findWeeklyRestViolations(calendar);
        results.push({
            rule: RULES[2],
            passed: weeklyViolations === 0,
            details: weeklyViolations === 0
                ? 'Todas as semanas têm pelo menos 1 dia de descanso completo.'
                : `${weeklyViolations} semanas sem dia de descanso completo. Exigido por lei pelo menos 1 dia por semana.`,
            actual: weeklyViolations,
            limit: 0,
        });

        const totalNights = countNightShifts(calendar);
        results.push({
            rule: RULES[4],
            passed: true,
            details: `${totalNights} turnos nocturnos no ano — exigem acréscimo salarial de 25%.`,
            actual: totalNights,
        });

        const holidaysWorked = countHolidaysWorked(calendar);
        results.push({
            rule: RULES[5],
            passed: true,
            details: `${holidaysWorked} feriados trabalhados — exigem pagamento a dobrar ou compensação equivalente.`,
            actual: holidaysWorked,
        });

        const allPassed = results.filter(r => r.limit !== undefined).every(r => r.passed);
        const criticalFailures = results.filter(r => r.limit !== undefined && !r.passed).length;
        const warnings = results.filter(r => r.limit === undefined && !r.passed).length;

        reports.push({
            scenarioId: scenario.id,
            scenarioName: scenario.name,
            year,
            teamIndex: team,
            teamName,
            results,
            allPassed,
            criticalFailures,
            warnings,
        });
    }

    return reports;
}