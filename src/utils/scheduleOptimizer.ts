import { Scenario, AnalysisResult } from '../types';
import { calculateAnalysis } from './calculations';
import { calculateQualityOfLifeScore } from './qualityOfLife';

export type ConstraintKey = 
  | 'hours'
  | 'consecutive_work'
  | 'night_shifts'
  | 'weekends'
  | 'mini_vacations'
  | 'friday_nights';

export type SuggestionKey = 
  | 'adjust_hours'
  | 'reduce_consecutive'
  | 'reduce_nights'
  | 'more_weekends'
  | 'add_mini_vacations'
  | 'friday_nights_off'
  | 'reduce_fatigue'
  | 'improve_social'
  | 'improve_circadian'
  | 'improve_sustainability'
  | 'good_overall';

export type AlternativePatternKey = 
  | 'MMTTNNFFFF'
  | 'MMTTNNFFF'
  | 'MMTTNNF'
  | 'MMTTNNFFFFF'
  | 'MTNNFFFF'
  | 'MTNFFFFF'
  | 'MMTTNNMMTTNNFFFF'
  | 'MTNMTNFFFF'
  | 'MMTTTNNNNFFFF'
  | 'MTNFF';

export interface OptimizationConstraint {
    id: ConstraintKey;
    weight: number;
    target: number;
    current: number;
    status: 'good' | 'warning' | 'bad';
}

export interface OptimizationSuggestion {
    id: SuggestionKey;
    impact: 'high' | 'medium' | 'low';
    category: 'balance' | 'compliance' | 'comfort' | 'efficiency';
    pattern?: string;
    scoreImprovement: number;
    // Dynamic values for template interpolation
    params?: Record<string, string | number>;
}

export interface OptimizationResult {
    scenario: Scenario;
    analysis: AnalysisResult;
    score: number;
    constraints: OptimizationConstraint[];
    suggestions: OptimizationSuggestion[];
    alternativePatterns: Array<{
        pattern: string;
        score: number;
        descriptionKey: AlternativePatternKey;
    }>;
}

const COMMON_PATTERNS: Array<{ pattern: string; descriptionKey: AlternativePatternKey }> = [
    { pattern: 'MMTTNNFFFF', descriptionKey: 'MMTTNNFFFF' },
    { pattern: 'MMTTNNFFF', descriptionKey: 'MMTTNNFFF' },
    { pattern: 'MMTTNNF', descriptionKey: 'MMTTNNF' },
    { pattern: 'MMTTNNFFFFF', descriptionKey: 'MMTTNNFFFFF' },
    { pattern: 'MTNNFFFF', descriptionKey: 'MTNNFFFF' },
    { pattern: 'MTNFFFFF', descriptionKey: 'MTNFFFFF' },
    { pattern: 'MMTTNNMMTTNNFFFF', descriptionKey: 'MMTTNNMMTTNNFFFF' },
    { pattern: 'MTNMTNFFFF', descriptionKey: 'MTNMTNFFFF' },
    { pattern: 'MMTTTNNNNFFFF', descriptionKey: 'MMTTTNNNNFFFF' },
    { pattern: 'MTNFF', descriptionKey: 'MTNFF' },
];

function analyzeConstraints(analysis: AnalysisResult): OptimizationConstraint[] {
    const am = analysis.advancedMetrics;
    return [
        {
            id: 'hours',
            weight: 0.25,
            target: 40,
            current: analysis.avgWeeklyHours,
            status: Math.abs(analysis.avgWeeklyHours - 40) <= 2 ? 'good' : Math.abs(analysis.avgWeeklyHours - 40) <= 5 ? 'warning' : 'bad',
        },
        {
            id: 'consecutive_work',
            weight: 0.2,
            target: 5,
            current: am?.maxConsecutiveWorkDays || 0,
            status: (am?.maxConsecutiveWorkDays || 0) <= 5 ? 'good' : (am?.maxConsecutiveWorkDays || 0) <= 6 ? 'warning' : 'bad',
        },
        {
            id: 'night_shifts',
            weight: 0.15,
            target: 90,
            current: am?.totalNightShifts || 0,
            status: (am?.totalNightShifts || 0) <= 90 ? 'good' : (am?.totalNightShifts || 0) <= 130 ? 'warning' : 'bad',
        },
        {
            id: 'weekends',
            weight: 0.2,
            target: 40,
            current: analysis.weekendsOffPerYear,
            status: analysis.weekendsOffPerYear >= 40 ? 'good' : analysis.weekendsOffPerYear >= 30 ? 'warning' : 'bad',
        },
        {
            id: 'mini_vacations',
            weight: 0.1,
            target: 6,
            current: am?.miniVacations || 0,
            status: (am?.miniVacations || 0) >= 6 ? 'good' : (am?.miniVacations || 0) >= 3 ? 'warning' : 'bad',
        },
        {
            id: 'friday_nights',
            weight: 0.1,
            target: 40,
            current: am?.fridayNightsOff || 0,
            status: (am?.fridayNightsOff || 0) >= 40 ? 'good' : (am?.fridayNightsOff || 0) >= 25 ? 'warning' : 'bad',
        },
    ];
}

function calculateScore(analysis: AnalysisResult): number {
    const constraints = analyzeConstraints(analysis);
    const totalWeight = constraints.reduce((sum, c) => sum + c.weight, 0);
    const earned = constraints.reduce((sum, c) => {
        const factor = c.status === 'good' ? 1 : c.status === 'warning' ? 0.6 : 0.2;
        return sum + c.weight * factor;
    }, 0);
    return Math.max(0, Math.min(100, Math.round((earned / totalWeight) * 100)));
}

function generateSuggestions(analysis: AnalysisResult, constraints: OptimizationConstraint[]): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const am = analysis.advancedMetrics;

    // Calculate QoL score for advanced metrics
    const fakeScenario: Scenario = {
        id: 'temp',
        name: 'temp',
        teams: 4,
        shiftDuration: 8,
        pattern: 'MMTTNNFFFF', // placeholder, will be overridden
    };
    const tempAnalysis = analysis; // use actual analysis
    const qolScore = calculateQualityOfLifeScore(fakeScenario, tempAnalysis);

    const badConstraints = constraints.filter(c => c.status === 'bad');
    const warningConstraints = constraints.filter(c => c.status === 'warning');

    if (badConstraints.some(c => c.id === 'hours')) {
        suggestions.push({
            id: 'adjust_hours',
            impact: 'high',
            category: 'compliance',
            scoreImprovement: 8,
            params: { hours: analysis.avgWeeklyHours.toFixed(1) },
        });
    }

    if (badConstraints.some(c => c.id === 'consecutive_work') || warningConstraints.some(c => c.id === 'consecutive_work')) {
        suggestions.push({
            id: 'reduce_consecutive',
            impact: 'high',
            category: 'comfort',
            scoreImprovement: 10,
            params: { days: am?.maxConsecutiveWorkDays || 0 },
        });
    }

    if (badConstraints.some(c => c.id === 'night_shifts')) {
        suggestions.push({
            id: 'reduce_nights',
            impact: 'medium',
            category: 'comfort',
            scoreImprovement: 6,
            params: { count: am?.totalNightShifts || 0 },
        });
    }

    if (warningConstraints.some(c => c.id === 'weekends')) {
        suggestions.push({
            id: 'more_weekends',
            impact: 'medium',
            category: 'balance',
            scoreImprovement: 5,
            params: { count: analysis.weekendsOffPerYear },
        });
    }

    if (badConstraints.some(c => c.id === 'mini_vacations')) {
        suggestions.push({
            id: 'add_mini_vacations',
            impact: 'medium',
            category: 'balance',
            scoreImprovement: 5,
            params: {},
        });
    }

    if (warningConstraints.some(c => c.id === 'friday_nights')) {
        suggestions.push({
            id: 'friday_nights_off',
            impact: 'low',
            category: 'balance',
            scoreImprovement: 3,
            params: {},
        });
    }

    // New QoL-based suggestions
    const breakdown = qolScore.breakdown;

    if (breakdown.fatigueAccumulation < 60) {
        suggestions.push({
            id: 'reduce_fatigue',
            impact: 'high',
            category: 'comfort',
            scoreImprovement: 8,
            params: { fatigue: breakdown.fatigueAccumulation },
        });
    }

    if (breakdown.socialDisruption < 60) {
        suggestions.push({
            id: 'improve_social',
            impact: 'medium',
            category: 'balance',
            scoreImprovement: 5,
            params: { disruption: breakdown.socialDisruption },
        });
    }

    if (breakdown.circadianDisruption < 60) {
        suggestions.push({
            id: 'improve_circadian',
            impact: 'high',
            category: 'comfort',
            scoreImprovement: 7,
            params: { disruption: breakdown.circadianDisruption },
        });
    }

    if (breakdown.longTermSustainability < 60) {
        suggestions.push({
            id: 'improve_sustainability',
            impact: 'medium',
            category: 'efficiency',
            scoreImprovement: 5,
            params: { sustainability: breakdown.longTermSustainability },
        });
    }

    if (suggestions.length === 0) {
        suggestions.push({
            id: 'good_overall',
            impact: 'low',
            category: 'efficiency',
            scoreImprovement: 0,
            params: {},
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
                descriptionKey: p.descriptionKey,
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
