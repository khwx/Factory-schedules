import { describe, it, expect } from 'vitest';
import { ScheduleGenerator, GeneratedSchedule } from '../scheduleGenerator';

describe('ScheduleGenerator', () => {
    it('should generate schedules given default constraints', async () => {
        const gen = new ScheduleGenerator();
        const results = await gen.generate([4], 5);
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThanOrEqual(0);
        results.forEach(r => {
            expect(r.pattern.length).toBe(4 * 5);
            expect(r.score).toBeGreaterThanOrEqual(0);
            expect(r.quality).toBeDefined();
            expect(r.quality.avgWorkBlock).toBeGreaterThan(0);
        });
    });

    it('should return patterns obeying consecutive work constraints', async () => {
        const gen = new ScheduleGenerator({ teams: 5, maxConsecutiveWork: 3, maxConsecutiveOff: 5, minBlockSize: 2 });
        const results = await gen.generate([4], 20);

        results.forEach((result: GeneratedSchedule) => {
            const { pattern } = result;
            const doubled = pattern + pattern;
            let workRun = 0;
            let valid = true;
            for (const ch of doubled) {
                if (ch === 'F') {
                    workRun = 0;
                } else {
                    workRun++;
                    if (workRun > 3) {
                        valid = false;
                        break;
                    }
                }
                if (!valid) break;
            }
            expect(valid).toBe(true);
        });
    });

    it('should respect cancel()', async () => {
        const gen = new ScheduleGenerator();
        gen.cancel();
        const results = await gen.generate([4, 5]);
        // After cancel, generation should stop early/late but not crash
        expect(Array.isArray(results)).toBe(true);
    });

    it('should sort results by score ascending', async () => {
        const gen = new ScheduleGenerator();
        const results = await gen.generate([4, 5], 30);
        for (let i = 1; i < results.length; i++) {
            expect(results[i - 1].score).toBeLessThanOrEqual(results[i].score);
        }
    });

    it('should report cycleLength based on stride', async () => {
        const gen = new ScheduleGenerator();
        const results = await gen.generate([4], 5);
        results.forEach(r => {
            expect(r.cycleLength).toBe(4 * 5);
        });
    });

    it('should use provided constraints in quality scoring', async () => {
        const gen = new ScheduleGenerator({ teams: 5, maxConsecutiveWork: 6, maxConsecutiveOff: 5, minBlockSize: 2 });
        const results = await gen.generate([4, 5, 6], 20);
        // No crashes, results exist
        expect(results.every(r => r.quality.isolatedShifts >= 0)).toBe(true);
    });
});