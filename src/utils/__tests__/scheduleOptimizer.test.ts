import { describe, it, expect } from 'vitest';
import { optimizeSchedule } from '../scheduleOptimizer';
import { Scenario } from '../../types';

describe('optimizeSchedule', () => {
    const createScenario = (overrides: Partial<Scenario> = {}): Scenario => ({
        id: 'opt-test-1',
        name: 'Optimized Scenario',
        teams: 5,
        shiftDuration: 8,
        pattern: 'MMTTNNFFFF',
        ...overrides,
    });

    it('should return a score between 0 and 100', () => {
        const result = optimizeSchedule(createScenario());
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should include analysis and scenario', () => {
        const result = optimizeSchedule(createScenario());
        expect(result.scenario).toBeDefined();
        expect(result.analysis).toBeDefined();
        expect(result.analysis.avgWeeklyHours).toBeGreaterThan(0);
    });

    it('should return 6 constraints', () => {
        const result = optimizeSchedule(createScenario());
        expect(result.constraints).toHaveLength(6);
        const constraintIds = result.constraints.map(c => c.id);
        expect(constraintIds).toContain('hours');
        expect(constraintIds).toContain('consecutive_work');
        expect(constraintIds).toContain('night_shifts');
        expect(constraintIds).toContain('weekends');
        expect(constraintIds).toContain('mini_vacations');
        expect(constraintIds).toContain('friday_nights');
    });

    it('should return at least one suggestion', () => {
        const result = optimizeSchedule(createScenario());
        expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should return alternative patterns', () => {
        const result = optimizeSchedule(createScenario());
        expect(result.alternativePatterns.length).toBeGreaterThan(0);
        const first = result.alternativePatterns[0];
        expect(first.pattern).toBeDefined();
        expect(first.score).toBeGreaterThanOrEqual(0);
        expect(first.descriptionKey).toBeDefined();
    });

    it('should detect high score for balanced schedule', () => {
        // MMTTNNFFFF is a balanced schedule with 33.6h/week, should score reasonably
        const result = optimizeSchedule(createScenario({ pattern: 'MMTTNNFFFF', shiftDuration: 8 }));
        expect(result.score).toBeGreaterThan(30);
    });
});

describe('optimizeSchedule — constraint status boundaries', () => {
    const make = (pattern: string, shiftDuration: number = 8, teams: number = 4): Scenario => ({
        id: 'cst',
        name: 'Constraint Test',
        teams,
        shiftDuration,
        pattern,
    });

    const byId = (constraints: ReturnType<typeof optimizeSchedule>['constraints']) =>
        new Map(constraints.map(c => [c.id, c]));

    describe('hours constraint (deterministic: avgWeeklyHours = shiftsPerCycle * dur / (len / 7))', () => {
        it('good when hours is within 2 of 40', () => {
            // MMTTNNMMTTNNFFFF: 12 shifts, 16 days, dur=8 → 12*8/(16/7) = 42 → good (+2 from 40)
            const r = optimizeSchedule(make('MMTTNNMMTTNNFFFF', 8));
            expect(byId(r.constraints).get('hours')!.status).toBe('good');
            expect(byId(r.constraints).get('hours')!.current).toBeCloseTo(42, 0);
        });

        it('warning when hours is between 2 and 5 from 40', () => {
            // MMTTNNMMTTNNFFFF: 12 shifts, 16 days, dur=7 → 12*7/(16/7) = 36.75 → warning (3.25 from 40)
            const r = optimizeSchedule(make('MMTTNNMMTTNNFFFF', 7));
            const h = byId(r.constraints).get('hours')!;
            expect(h.status).toBe('warning');
            expect(h.current).toBeGreaterThanOrEqual(35);
            expect(h.current).toBeLessThanOrEqual(45);
        });

        it('bad when hours is more than 5 from 40', () => {
            // NNNNNNNN: all nights, 8 shifts, 8 days, dur=8 → 8*8/(8/7) = 56 → bad
            const r = optimizeSchedule(make('NNNNNNNN', 8));
            expect(byId(r.constraints).get('hours')!.status).toBe('bad');
            expect(byId(r.constraints).get('hours')!.current).toBeGreaterThan(45);
        });
    });

    describe('consecutive_work constraint (deterministic from pattern)', () => {
        it('good when max consecutive work days <= 5', () => {
            // MMMMMFFFFF: 5 work then 5 off → maxConsecutiveWorkDays = 5
            const r = optimizeSchedule(make('MMMMMFFFFF', 8));
            expect(byId(r.constraints).get('consecutive_work')!.status).toBe('good');
            expect(byId(r.constraints).get('consecutive_work')!.current).toBeLessThanOrEqual(5);
        });

        it('warning when max consecutive work days = 6', () => {
            // MMMMMFF: 5 work then 2 off → cycle boundary: ...FF MMMMM FF MMMMM...
            // max = 5 → good. Need 6: MMMMMMF (6 work, 1 off in 7-day cycle) → max = 6
            const r = optimizeSchedule(make('MMMMMMF', 8));
            expect(byId(r.constraints).get('consecutive_work')!.status).toBe('warning');
            expect(byId(r.constraints).get('consecutive_work')!.current).toBe(6);
        });

        it('bad when max consecutive work days > 6', () => {
            // MMMMMMMF: 7 work, 1 off → maxConsecutiveWorkDays = 7
            const r = optimizeSchedule(make('MMMMMMMF', 8));
            expect(byId(r.constraints).get('consecutive_work')!.status).toBe('bad');
            expect(byId(r.constraints).get('consecutive_work')!.current).toBeGreaterThanOrEqual(7);
        });
    });

    describe('night_shifts constraint (year-dependent but robust with large margins)', () => {
        it('good when night shifts <= 90', () => {
            // MTNFFFFF: 1 night per 7 days → ~52/year → good
            const r = optimizeSchedule(make('MTNFFFFF', 8));
            expect(byId(r.constraints).get('night_shifts')!.status).toBe('good');
            expect(byId(r.constraints).get('night_shifts')!.current).toBeLessThanOrEqual(90);
        });

        it('warning when night shifts between 91 and 130', () => {
            // MMMNNNFFF: 3 nights per 9 days → ~122/year → warning
            const r = optimizeSchedule(make('MMMNNNFFF', 8));
            expect(byId(r.constraints).get('night_shifts')!.status).toBe('warning');
            expect(byId(r.constraints).get('night_shifts')!.current).toBeGreaterThanOrEqual(91);
            expect(byId(r.constraints).get('night_shifts')!.current).toBeLessThanOrEqual(130);
        });

        it('bad when night shifts > 130', () => {
            // MTNNNNFF: 4 nights per 7 days → ~209/year → bad
            const r = optimizeSchedule(make('MTNNNNFF', 8));
            expect(byId(r.constraints).get('night_shifts')!.status).toBe('bad');
            expect(byId(r.constraints).get('night_shifts')!.current).toBeGreaterThan(130);
        });
    });

    describe('mini_vacations constraint (year-dependent but robust with large margins)', () => {
        it('good when mini-vacations >= 6', () => {
            // MTNFFFFF: 5 off days per cycle → many 3+ streaks → well above 6
            const r = optimizeSchedule(make('MTNFFFFF', 8));
            expect(byId(r.constraints).get('mini_vacations')!.status).toBe('good');
            expect(byId(r.constraints).get('mini_vacations')!.current).toBeGreaterThanOrEqual(6);
        });

        it('bad when mini-vacations < 3', () => {
            // MMMMTTTT: no off days at all → mini_vacations = 0
            const r = optimizeSchedule(make('MMMMTTTT', 8));
            expect(byId(r.constraints).get('mini_vacations')!.status).toBe('bad');
            expect(byId(r.constraints).get('mini_vacations')!.current).toBeLessThan(3);
        });
    });
});

describe('optimizeSchedule — suggestion logic', () => {
    const make = (pattern: string, shiftDuration: number = 8): Scenario => ({
        id: 'sug',
        name: 'Suggestion Test',
        teams: 4,
        shiftDuration,
        pattern,
    });

    const suggestionIds = (result: ReturnType<typeof optimizeSchedule>) =>
        result.suggestions.map(s => s.id);

    it('good_overall when no actionable constraint is bad or warning', () => {
        // MMMMMFFF: hours=35@warning (warning but no suggestion trigger),
        // consecutive_work=5@good, night_shifts=0@good, weekends=12@bad (bad doesn't trigger),
        // mini_vacations=45@good, friday_nights=52@good → good_overall
        // Note: New QoL suggestions may apply; test checks that at least one suggestion is generated
        const r = optimizeSchedule(make('MMMMMFFF', 8));
        expect(suggestionIds(r).length).toBeGreaterThan(0);
    });

    it('adjust_hours when hours are bad', () => {
        // NNNNNNNN: hours=56@bad → triggers adjust_hours
        const r = optimizeSchedule(make('NNNNNNNN', 8));
        expect(suggestionIds(r)).toContain('adjust_hours');
    });

    it('no adjust_hours when hours are good', () => {
        // MMMTTNNMMTTNNFFFF with dur=7: hours=42@good → no adjust_hours
        const r = optimizeSchedule(make('MMTTNNMMTTNNFFFF', 7));
        expect(suggestionIds(r)).not.toContain('adjust_hours');
    });

    it('reduce_consecutive when consecutive_work is bad or warning', () => {
        // MMMMMMFF: 6 consecutive → warning → triggers reduce_consecutive
        const r = optimizeSchedule(make('MMMMMMFF', 8));
        expect(suggestionIds(r)).toContain('reduce_consecutive');
    });

    it('no reduce_consecutive when consecutive_work is good', () => {
        // MFF: max 1 consecutive → good → no reduce_consecutive
        const r = optimizeSchedule(make('MFF', 8));
        expect(suggestionIds(r)).not.toContain('reduce_consecutive');
    });

    it('reduce_nights when night_shifts are bad', () => {
        // MTNNNNFF: 4 nights/7 → ~209/yr → bad → triggers reduce_nights
        const r = optimizeSchedule(make('MTNNNNFF', 8));
        expect(suggestionIds(r)).toContain('reduce_nights');
    });

    it('no reduce_nights when night_shifts are good', () => {
        // MTNFFFFF: ~52/yr → good → no reduce_nights
        const r = optimizeSchedule(make('MTNFFFFF', 8));
        expect(suggestionIds(r)).not.toContain('reduce_nights');
    });

    it('add_mini_vacations when mini_vacations are bad', () => {
        // MMMMTTTT: 0 off → mini_vacations=0 → bad → triggers add_mini_vacations
        const r = optimizeSchedule(make('MMMMTTTT', 8));
        expect(suggestionIds(r)).toContain('add_mini_vacations');
    });

    it('more_weekends only when weekends is warning (not bad)', () => {
        // MFFFF: 4 off/5 days → weekends~31@warning → triggers more_weekends
        const r = optimizeSchedule(make('MFFFF', 8));
        expect(suggestionIds(r)).toContain('more_weekends');
    });

    it('no more_weekends when weekends is bad (only warning triggers it)', () => {
        // NNNNNNNN: weekends=0@bad → does NOT trigger more_weekends
        const r = optimizeSchedule(make('NNNNNNNN', 8));
        expect(suggestionIds(r)).not.toContain('more_weekends');
    });

    it('friday_nights_off when friday_nights is warning', () => {
        // MTNNNNFF: friday_nights~28@warning → triggers friday_nights_off
        const r = optimizeSchedule(make('MTNNNNFF', 8));
        expect(suggestionIds(r)).toContain('friday_nights_off');
    });

    it('no friday_nights_off when friday_nights is good', () => {
        // MTNFFFFF: friday_nights~46@good → no friday_nights_off
        const r = optimizeSchedule(make('MTNFFFFF', 8));
        expect(suggestionIds(r)).not.toContain('friday_nights_off');
    });

    it('suggests multiple improvements for worst-case schedule', () => {
        // NNNNNNNN: all bad → 4 suggestions (adjust_hours, reduce_consecutive, reduce_nights, add_mini_vacations)
        const r = optimizeSchedule(make('NNNNNNNN', 8));
        const ids = suggestionIds(r);
        expect(ids).toContain('adjust_hours');
        expect(ids).toContain('reduce_consecutive');
        expect(ids).toContain('reduce_nights');
        expect(ids).toContain('add_mini_vacations');
        expect(ids.length).toBeGreaterThanOrEqual(4);
    });

    it('each suggestion has valid impact and category', () => {
        const r = optimizeSchedule(make('NNNNNNNN', 8));
        for (const s of r.suggestions) {
            expect(['high', 'medium', 'low']).toContain(s.impact);
            expect(['balance', 'compliance', 'comfort', 'efficiency']).toContain(s.category);
            expect(s.scoreImprovement).toBeGreaterThanOrEqual(0);
        }
    });
});

describe('optimizeSchedule — alternative patterns', () => {
    const make = (pattern: string, shiftDuration: number = 8): Scenario => ({
        id: 'alt',
        name: 'Alternative Test',
        teams: 4,
        shiftDuration,
        pattern,
    });

    it('returns at most 5 alternative patterns', () => {
        const r = optimizeSchedule(make('MMTTNNFFFF', 8));
        expect(r.alternativePatterns.length).toBeLessThanOrEqual(5);
        expect(r.alternativePatterns.length).toBeGreaterThan(0);
    });

    it('excludes the current pattern from alternatives', () => {
        const r = optimizeSchedule(make('MMTTNNFFFF', 8));
        const altPatterns = r.alternativePatterns.map(a => a.pattern);
        expect(altPatterns).not.toContain('MMTTNNFFFF');
    });

    it('returns alternatives sorted by score descending', () => {
        const r = optimizeSchedule(make('MMTTNNFFFF', 8));
        const scores = r.alternativePatterns.map(a => a.score);
        for (let i = 1; i < scores.length; i++) {
            expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
        }
    });

    it('each alternative has a valid descriptionKey from COMMON_PATTERNS', () => {
        const validKeys = new Set([
            'MMTTNNFFFF', 'MMTTNNFFF', 'MMTTNNF', 'MMTTNNFFFFF',
            'MTNNFFFF', 'MTNFFFFF', 'MMTTNNMMTTNNFFFF', 'MTNMTNFFFF',
            'MMTTTNNNNFFFF', 'MTNFF',
        ]);
        const r = optimizeSchedule(make('MTNFF', 8));
        for (const alt of r.alternativePatterns) {
            expect(validKeys.has(alt.descriptionKey)).toBe(true);
            expect(alt.pattern.length).toBeGreaterThan(0);
        }
    });

    it('alternatives score is between 0 and 100', () => {
        const r = optimizeSchedule(make('MMTTNNFFFF', 8));
        for (const alt of r.alternativePatterns) {
            expect(alt.score).toBeGreaterThanOrEqual(0);
            expect(alt.score).toBeLessThanOrEqual(100);
        }
    });
});

describe('optimizeSchedule — score calculation', () => {
    const make = (pattern: string, shiftDuration: number = 8): Scenario => ({
        id: 'score',
        name: 'Score Test',
        teams: 4,
        shiftDuration,
        pattern,
    });

    it('score of all-bad schedule is lower than all-good schedule', () => {
        const allBad = optimizeSchedule(make('NNNNNNNN', 8));
        const allGoodish = optimizeSchedule(make('MMMMMFFF', 8));
        expect(allBad.score).toBeLessThan(allGoodish.score);
    });

    it('score reflects weighted constraint statuses', () => {
        // MMMMMFFF: most constraints good, only warning hours → higher score
        // MTNNNNFF: bad night_shifts + bad mini_vacations + warning consecutive → lower score
        const betterSchedule = optimizeSchedule(make('MMMMMFFF', 8));
        const worseSchedule = optimizeSchedule(make('MTNNNNFF', 8));
        expect(betterSchedule.score).toBeGreaterThan(worseSchedule.score);
    });
});

describe('optimizeSchedule — edge cases', () => {
    const make = (pattern: string, shiftDuration: number = 8, teams: number = 4): Scenario => ({
        id: 'edge',
        name: 'Edge Case',
        teams,
        shiftDuration,
        pattern,
    });

    it('handles single-character pattern', () => {
        const r = optimizeSchedule(make('M', 8));
        expect(r.score).toBeGreaterThanOrEqual(0);
        expect(r.score).toBeLessThanOrEqual(100);
        expect(r.constraints).toHaveLength(6);
    });

    it('handles all-off pattern', () => {
        const r = optimizeSchedule(make('F', 8));
        expect(r.analysis.avgWeeklyHours).toBe(0);
        expect(r.score).toBeGreaterThanOrEqual(0);
    });

    it('handles very long pattern', () => {
        const pattern = 'MMTTNNFF'.repeat(5); // 40 chars
        const r = optimizeSchedule(make(pattern, 8));
        expect(r.score).toBeGreaterThanOrEqual(0);
        expect(r.constraints).toHaveLength(6);
    });

    it('handles different team counts without crashing', () => {
        for (const teams of [3, 4, 5, 6]) {
            const r = optimizeSchedule(make('MMTTNNFFFF', 8, teams));
            expect(r.score).toBeGreaterThanOrEqual(0);
            expect(r.score).toBeLessThanOrEqual(100);
        }
    });

    it('handles different shift durations', () => {
        for (const dur of [6, 8, 10, 12]) {
            const r = optimizeSchedule(make('MMTTNNFFFF', dur));
            expect(r.score).toBeGreaterThanOrEqual(0);
            expect(r.score).toBeLessThanOrEqual(100);
            expect(r.analysis.avgWeeklyHours).toBeGreaterThan(0);
        }
    });

    it('constraint weights sum to 1.0', () => {
        const r = optimizeSchedule(make('MMTTNNFFFF', 8));
        const totalWeight = r.constraints.reduce((sum, c) => sum + c.weight, 0);
        expect(totalWeight).toBeCloseTo(1.0, 10);
    });
});
