
export interface GeneratorConstraints {
    teams: number;
    maxConsecutiveWork: number;
    maxConsecutiveOff: number;
    minBlockSize: number; // Preference for blocks of at least X
}

export interface GeneratedSchedule {
    pattern: string;
    score: number;
    cycleLength: number;
    quality: {
        avgWorkBlock: number;
        avgOffBlock: number;
        isolatedShifts: number;
    };
}

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    'M': ['M', 'T', 'F'],
    'T': ['T', 'N', 'F'],
    'N': ['N', 'F'],
    'F': ['M', 'T', 'N', 'F']
};

export class ScheduleGenerator {
    private constraints: GeneratorConstraints;
    private cancelled = false;

    constructor(constraints: Partial<GeneratorConstraints> = {}) {
        this.constraints = {
            teams: 5,
            maxConsecutiveWork: 6,
            maxConsecutiveOff: 5,
            minBlockSize: 2,
            ...constraints
        };
    }

    public cancel() {
        this.cancelled = true;
    }

    public async generate(strides: number[] = [4, 5, 6], limitPerStride = 20): Promise<GeneratedSchedule[]> {
        this.cancelled = false;
        const allResults: GeneratedSchedule[] = [];

        for (const stride of strides) {
            if (this.cancelled) break;

            // Yield to event loop to keep UI responsive
            await new Promise(resolve => setTimeout(resolve, 10));

            const rawPatterns = this.solve(stride, limitPerStride);
            const processed = rawPatterns.map(p => this.analyzePattern(p, stride * 5));
            allResults.push(...processed);
        }

        return allResults.sort((a, b) => a.score - b.score);
    }

    private solve(stride: number, limit: number): string[] {
        const L = stride * 5;
        const results: string[] = [];
        const pattern: (string | null)[] = new Array(L).fill(null);

        // Pre-calculate columns
        const columns: number[][] = [];
        for (let cid = 0; cid < stride; cid++) {
            const col: number[] = [];
            for (let t = 0; t < 5; t++) col.push(cid + t * stride);
            columns.push(col);
        }

        let iterations = 0;
        const MAX_ITERATIONS = 100000; // Safety brake

        const search = (idx: number) => {
            if (this.cancelled) return;
            if (results.length >= limit) return;
            iterations++;
            if (iterations > MAX_ITERATIONS) return;

            if (idx === L) {
                const pStr = pattern.join('');
                if (this.isValidSequence(pStr)) {
                    results.push(pStr);
                }
                return;
            }

            const colId = idx % stride;
            const colIndices = columns[colId];

            const used = { M: 0, T: 0, N: 0, F: 0 };
            for (let pos of colIndices) {
                if (pos < idx && pattern[pos]) {
                    used[pattern[pos] as keyof typeof used]++;
                }
            }

            const prev = idx > 0 ? pattern[idx - 1] : null;

            // Heuristic: try to continue block
            const candidates = ['M', 'T', 'N', 'F'];
            if (prev) {
                candidates.sort((a, b) => (a === prev ? -1 : 1));
            }

            for (const char of candidates) {
                // 1. Coverage Constraint (Column)
                // With 5 teams, usually we want 1M, 1T, 1N, 2F per column
                if (char !== 'F' && used[char as 'M' | 'T' | 'N'] >= 1) continue;
                if (char === 'F' && used['F'] >= 2) continue;

                // 2. Transition Constraint
                if (prev && !ALLOWED_TRANSITIONS[prev].includes(char)) continue;

                // 3. Consecutive Constraint (Local Lookback)
                let run = 1;
                for (let k = idx - 1; k >= 0; k--) {
                    if (pattern[k] === char) run++;
                    else break;
                }

                if (char === 'F' && run > this.constraints.maxConsecutiveOff) continue;
                if (char !== 'F' && run > this.constraints.maxConsecutiveWork) continue;

                pattern[idx] = char;
                search(idx + 1);
                pattern[idx] = null;
            }
        };

        search(0);
        return results;
    }

    private isValidSequence(pattern: string): boolean {
        // Full Check including wrap-around
        const double = pattern + pattern;

        let consecutiveWork = 0;
        let consecutiveOff = 0;

        for (let char of double) {
            if (char === 'F') {
                consecutiveWork = 0;
                consecutiveOff++;
                if (consecutiveOff > this.constraints.maxConsecutiveOff) return false;
            } else {
                consecutiveOff = 0;
                consecutiveWork++;
                if (consecutiveWork > this.constraints.maxConsecutiveWork) return false;
            }
        }

        // Wrap around transition
        const last = pattern[pattern.length - 1];
        const first = pattern[0];
        if (!ALLOWED_TRANSITIONS[last].includes(first)) return false;

        return true;
    }

    private analyzePattern(pattern: string, cycleLength: number): GeneratedSchedule {
        let score = 0;
        let isolated = 0;
        let workBlocks = [];
        let offBlocks = [];

        let currentType = pattern[0] === 'F' ? 'OFF' : 'WORK';
        let currentLen = 1;

        // Linear scan logic slightly flawed for wrap around stats, 
        // but good enough for scoring local fragmentation
        for (let i = 1; i < pattern.length; i++) {
            const type = pattern[i] === 'F' ? 'OFF' : 'WORK';
            if (type === currentType) {
                currentLen++;
            } else {
                if (currentType === 'WORK') workBlocks.push(currentLen);
                else offBlocks.push(currentLen);
                currentType = type;
                currentLen = 1;
            }
        }
        // Push last
        if (currentType === 'WORK') workBlocks.push(currentLen);
        else offBlocks.push(currentLen);

        // Penalize isolated shifts (1 day blocks)
        workBlocks.forEach(l => { if (l < this.constraints.minBlockSize) { score += 10; isolated++; } });
        offBlocks.forEach(l => { if (l < 2) { score += 5; isolated++; } });

        // Penalize changing shift types too often (e.g. M T M)
        for (let i = 0; i < pattern.length; i++) {
            const prev = pattern[(i - 1 + pattern.length) % pattern.length];
            const curr = pattern[i];
            const next = pattern[(i + 1) % pattern.length];
            if (curr !== 'F' && curr !== prev && curr !== next) score += 5;
        }

        const avgWork = workBlocks.length ? workBlocks.reduce((a, b) => a + b, 0) / workBlocks.length : 0;
        const avgOff = offBlocks.length ? offBlocks.reduce((a, b) => a + b, 0) / offBlocks.length : 0;

        return {
            pattern,
            score,
            cycleLength,
            quality: {
                avgWorkBlock: parseFloat(avgWork.toFixed(1)),
                avgOffBlock: parseFloat(avgOff.toFixed(1)),
                isolatedShifts: isolated
            }
        };
    }
}
