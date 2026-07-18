import { Scenario, AnalysisResult } from '../types';
import { calculateAnalysis } from './calculations';

export interface OptimizationConstraint {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    weight: number; // 0-1
    target: number;
    current: number;
    status: 'good' | 'warning' | 'bad';
}

export interface OptimizationSuggestion {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    impact: 'high' | 'medium' | 'low';
    category: 'balance' | 'compliance' | 'comfort' | 'efficiency';
    pattern?: string;
    scoreImprovement: number;
}

export interface OptimizationResult {
    scenario: Scenario;
    analysis: AnalysisResult;
    score: number; // 0-100
    constraints: OptimizationConstraint[];
    suggestions: OptimizationSuggestion[];
    alternativePatterns: Array<{
        pattern: string;
        score: number;
        description: string;
        descriptionEn: string;
    }>;
}

const COMMON_PATTERNS = [
    { pattern: 'MMTTNNFFFF', desc: '4 turnos, 4 folgas (classico)', descEn: '4 shifts, 4 off (classic)' },
    { pattern: 'MMTTNNFFF', desc: '3 turnos, 2 folgas (5x2)', descEn: '3 shifts, 2 off (5x2)' },
    { pattern: 'MMTTNNF', desc: '2 turnos, 1 folga (6x1)', descEn: '2 shifts, 1 off (6x1)' },
    { pattern: 'MMTTNNFFFFF', desc: '5 turnos, 5 folgas', descEn: '5 shifts, 5 off' },
    { pattern: 'MTNNFFFF', desc: '3 turnos, 4 folgas', descEn: '3 shifts, 4 off' },
    { pattern: 'MTNFFFFF', desc: '3 turnos, 5 folgas', descEn: '3 shifts, 5 off' },
    { pattern: 'MMTTNNMMTTNNFFFF', desc: '6 turnos, 4 folgas', descEn: '6 shifts, 4 off' },
    { pattern: 'MTNMTNFFFF', desc: 'Rotacao rapida, 4 folgas', descEn: 'Fast rotation, 4 off' },
    { pattern: 'MMTTTNNNNFFFF', desc: '6 turnos, 6 folgas', descEn: '6 shifts, 6 off' },
    { pattern: 'MTNFF', desc: '3 turnos, 2 folgas (compacto)', descEn: '3 shifts, 2 off (compact)' },
];

function calculateScore(analysis: AnalysisResult): number {
    let score = 50; // base
    const am = analysis.advancedMetrics;

    // Hours balance (target: 40h/week)
    const hoursDiff = Math.abs(analysis.avgWeeklyHours - 40);
    if (hoursDiff <= 2) score += 15;
    else if (hoursDiff <= 5) score += 8;
    else score -= 5;

    // Work-life balance
    if (am) {
        if (am.maxConsecutiveWorkDays <= 5) score += 10;
        else if (am.maxConsecutiveWorkDays <= 6) score += 5;
        else score -= 10;

        if (am.maxConsecutiveOffDays >= 2) score += 5;
        if (am.miniVacations >= 4) score += 5;
        if (am.isolatedOffDays <= 3) score += 5;

        // Night shift impact
        if (am.totalNightShifts <= 90) score += 5;
        else if (am.totalNightShifts >= 150) score -= 5;

        // Friday nights off
        if (am.fridayNightsOff >= 40) score += 5;
    }

    // Weekend balance
    if (analysis.weekendsOffPerYear >= 40) score += 5;
    else if (analysis.weekendsOffPerYear >= 30) score += 3;

    return Math.max(0, Math.min(100, score));
}

function analyzeConstraints(analysis: AnalysisResult): OptimizationConstraint[] {
    const am = analysis.advancedMetrics;
    return [
        {
            id: 'hours',
            name: 'Horas Semanais',
            nameEn: 'Weekly Hours',
            description: 'Proximidade ao contrato de 40h',
            descriptionEn: 'Proximity to 40h contract',
            weight: 0.25,
            target: 40,
            current: analysis.avgWeeklyHours,
            status: Math.abs(analysis.avgWeeklyHours - 40) <= 2 ? 'good' : Math.abs(analysis.avgWeeklyHours - 40) <= 5 ? 'warning' : 'bad',
        },
        {
            id: 'consecutive_work',
            name: 'Dias Consecutivos',
            nameEn: 'Consecutive Days',
            description: 'Maximo 5 dias de trabalho seguidos',
            descriptionEn: 'Maximum 5 consecutive work days',
            weight: 0.2,
            target: 5,
            current: am?.maxConsecutiveWorkDays || 0,
            status: (am?.maxConsecutiveWorkDays || 0) <= 5 ? 'good' : (am?.maxConsecutiveWorkDays || 0) <= 6 ? 'warning' : 'bad',
        },
        {
            id: 'night_shifts',
            name: 'Turnos Noturnos',
            nameEn: 'Night Shifts',
            description: 'Quantidade de turnos noturnos por ano',
            descriptionEn: 'Number of night shifts per year',
            weight: 0.15,
            target: 90,
            current: am?.totalNightShifts || 0,
            status: (am?.totalNightShifts || 0) <= 90 ? 'good' : (am?.totalNightShifts || 0) <= 130 ? 'warning' : 'bad',
        },
        {
            id: 'weekends',
            name: 'Fins de Semana',
            nameEn: 'Weekends',
            description: 'Fins de semana de folga por ano',
            descriptionEn: 'Weekends off per year',
            weight: 0.2,
            target: 40,
            current: analysis.weekendsOffPerYear,
            status: analysis.weekendsOffPerYear >= 40 ? 'good' : analysis.weekendsOffPerYear >= 30 ? 'warning' : 'bad',
        },
        {
            id: 'mini_vacations',
            name: 'Mini-Ferias',
            nameEn: 'Mini-Vacations',
            description: 'Sequencias de 3+ dias de folga',
            descriptionEn: 'Sequences of 3+ consecutive off days',
            weight: 0.1,
            target: 6,
            current: am?.miniVacations || 0,
            status: (am?.miniVacations || 0) >= 6 ? 'good' : (am?.miniVacations || 0) >= 3 ? 'warning' : 'bad',
        },
        {
            id: 'friday_nights',
            name: 'Sextas noites livres',
            nameEn: 'Friday Nights Free',
            description: 'Sextas feiras sem turno noturno',
            descriptionEn: 'Fridays without night shift',
            weight: 0.1,
            target: 40,
            current: am?.fridayNightsOff || 0,
            status: (am?.fridayNightsOff || 0) >= 40 ? 'good' : (am?.fridayNightsOff || 0) >= 25 ? 'warning' : 'bad',
        },
    ];
}

function generateSuggestions(analysis: AnalysisResult, constraints: OptimizationConstraint[]): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const am = analysis.advancedMetrics;

    const badConstraints = constraints.filter(c => c.status === 'bad');
    const warningConstraints = constraints.filter(c => c.status === 'warning');

    if (badConstraints.some(c => c.id === 'hours')) {
        suggestions.push({
            id: 'adjust_hours',
            title: 'Ajustar duracao do turno',
            titleEn: 'Adjust shift duration',
            description: `A media atual e ${analysis.avgWeeklyHours.toFixed(1)}h. Considere ajustar a duracao do turno ou o padrao para chegar mais perto de 40h semanais.`,
            descriptionEn: `Current average is ${analysis.avgWeeklyHours.toFixed(1)}h. Consider adjusting shift duration or pattern to get closer to 40h weekly.`,
            impact: 'high',
            category: 'compliance',
            scoreImprovement: 8,
        });
    }

    if (badConstraints.some(c => c.id === 'consecutive_work') || warningConstraints.some(c => c.id === 'consecutive_work')) {
        suggestions.push({
            id: 'reduce_consecutive',
            title: 'Reduzir dias consecutivos',
            titleEn: 'Reduce consecutive days',
            description: `Maximo de ${am?.maxConsecutiveWorkDays} dias consecutivos. Adicione mais folgas no padrao para garantir descanso adequado.`,
            descriptionEn: `Maximum of ${am?.maxConsecutiveWorkDays} consecutive days. Add more off days to the pattern for adequate rest.`,
            impact: 'high',
            category: 'comfort',
            scoreImprovement: 10,
        });
    }

    if (badConstraints.some(c => c.id === 'night_shifts')) {
        suggestions.push({
            id: 'reduce_nights',
            title: 'Reduzir turnos noturnos',
            titleEn: 'Reduce night shifts',
            description: `${am?.totalNightShifts} turnos noturnos por ano e elevado. Considere um padrao com menos noites ou redistribuir por mais equipas.`,
            descriptionEn: `${am?.totalNightShifts} night shifts per year is high. Consider a pattern with fewer nights or redistribute across more teams.`,
            impact: 'medium',
            category: 'comfort',
            scoreImprovement: 6,
        });
    }

    if (warningConstraints.some(c => c.id === 'weekends')) {
        suggestions.push({
            id: 'more_weekends',
            title: 'Mais fins de semana de folga',
            titleEn: 'More weekends off',
            description: `${analysis.weekendsOffPerYear} fins de semana de folga por ano. Padroes como 5x2 ou 6x2 oferecem mais fins de semana livres.`,
            descriptionEn: `${analysis.weekendsOffPerYear} weekends off per year. Patterns like 5x2 or 6x2 offer more free weekends.`,
            impact: 'medium',
            category: 'balance',
            scoreImprovement: 5,
        });
    }

    if (badConstraints.some(c => c.id === 'mini_vacations')) {
        suggestions.push({
            id: 'add_mini_vacations',
            title: 'Criar sequencias de folga longas',
            titleEn: 'Create long off sequences',
            description: 'Poucas mini-ferias detetadas. Padroes com 3+ folgas consecutivas melhoram a qualidade de vida.',
            descriptionEn: 'Few mini-vacations detected. Patterns with 3+ consecutive off days improve quality of life.',
            impact: 'medium',
            category: 'balance',
            scoreImprovement: 5,
        });
    }

    if (warningConstraints.some(c => c.id === 'friday_nights')) {
        suggestions.push({
            id: 'friday_nights_off',
            title: 'Mais sextas feiras livres',
            titleEn: 'More free Fridays',
            description: 'Considere um padrao que evite turnos noturnos nas sextas feiras para melhorar a vida social.',
            descriptionEn: 'Consider a pattern that avoids night shifts on Fridays to improve social life.',
            impact: 'low',
            category: 'balance',
            scoreImprovement: 3,
        });
    }

    if (suggestions.length === 0) {
        suggestions.push({
            id: 'good_overall',
            title: 'Cenario bem equilibrado',
            titleEn: 'Well-balanced scenario',
            description: 'O cenario atual esta bem equilibrado nos principais indicadores. Considere apenas pequenos ajustes.',
            descriptionEn: 'The current scenario is well-balanced across key indicators. Consider only minor adjustments.',
            impact: 'low',
            category: 'efficiency',
            scoreImprovement: 0,
        });
    }

    return suggestions;
}

function generateAlternatives(currentPattern: string): OptimizationResult['alternativePatterns'] {
    return COMMON_PATTERNS
        .filter(p => p.pattern !== currentPattern)
        .map(p => {
            const fakeScenario: Scenario = {
                id: 'opt',
                name: 'temp',
                teams: 4,
                shiftDuration: 8,
                pattern: p.pattern,
            };
            const a = calculateAnalysis(fakeScenario);
            const score = calculateScore(a);
            return {
                pattern: p.pattern,
                score,
                description: p.desc,
                descriptionEn: p.descEn,
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}

export function optimizeSchedule(scenario: Scenario): OptimizationResult {
    const analysis = calculateAnalysis(scenario);
    const score = calculateScore(analysis);
    const constraints = analyzeConstraints(analysis);
    const suggestions = generateSuggestions(analysis, constraints);
    const alternativePatterns = generateAlternatives(scenario.pattern);

    return {
        scenario,
        analysis,
        score,
        constraints,
        suggestions,
        alternativePatterns,
    };
}
