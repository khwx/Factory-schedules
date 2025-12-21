
const fs = require('fs');

const SHIFTS = ['M', 'T', 'N', 'F'];
const TEAMS = 5;

// Constraints
const MAX_CONSECUTIVE_WORK = 6;
const MAX_CONSECUTIVE_OFF = 5;
const MIN_BLOCK_SIZE = 2; // Try to keep shifts in blocks of at least 2

// Valid transitions (Forward rotation)
// Allow F to anything, Anything to F.
// Allow M->M, T->T, N->N
// Allow M->T, T->N
// Disallow N->M (Too short rest), N->T (Backwards/short), T->M (Backwards)
const ALLOWED_TRANSITIONS = {
    'M': ['M', 'T', 'F'],
    'T': ['T', 'N', 'F'],
    'N': ['N', 'F'], // Strict forward from Night: must go to Off.
    'F': ['M', 'T', 'N', 'F']
};

function isValidSequence(pattern) {
    // Check transitions
    for (let i = 0; i < pattern.length - 1; i++) {
        const curr = pattern[i];
        const next = pattern[i + 1];
        if (!ALLOWED_TRANSITIONS[curr].includes(next)) return false;
    }
    // Check wrap-around transition (cycle)
    if (!ALLOWED_TRANSITIONS[pattern[pattern.length - 1]].includes(pattern[0])) return false;

    // Check consecutive limits
    let consecutiveWork = 0;
    let consecutiveOff = 0;

    // We need to check circular consecutiveness.
    const doublePattern = pattern + pattern;

    let currentRun = 0;
    let lastChar = '';

    for (let char of doublePattern) {
        if (char === 'F') {
            consecutiveWork = 0;
            consecutiveOff++;
            if (consecutiveOff > MAX_CONSECUTIVE_OFF) return false;
        } else {
            consecutiveOff = 0;
            consecutiveWork++;
            if (consecutiveWork > MAX_CONSECUTIVE_WORK) return false;
        }
    }

    return true;
}

function checkCoverage(pattern, stride) {
    const L = pattern.length;
    for (let i = 0; i < stride; i++) { // For each position in the "window"
        const shifts = {};
        let fCount = 0;
        for (let t = 0; t < 5; t++) {
            const idx = (i + t * stride) % L;
            const s = pattern[idx];
            if (s === 'F') fCount++;
            else shifts[s] = (shifts[s] || 0) + 1;
        }

        // Must have 1 M, 1 T, 1 N, 2 F
        if (shifts['M'] !== 1 || shifts['T'] !== 1 || shifts['N'] !== 1 || fCount !== 2) {
            return false;
        }
    }
    return true;
}

function scorePattern(pattern) {
    // Lower is better
    let score = 0;

    // Penalize single days (e.g. F M F, or M T M)
    // We want blocks.
    for (let i = 0; i < pattern.length; i++) {
        const prev = pattern[(i - 1 + pattern.length) % pattern.length];
        const curr = pattern[i];
        const next = pattern[(i + 1) % pattern.length];

        if (curr !== prev && curr !== next) {
            score += 5; // Penalty for isolated shift
        }
    }

    // Avoid too many single off days
    // Count specific patterns
    // e.g. M F M is bad.

    return score;
}

function solve(stride) {
    const L = stride * 5;
    console.log(`Searching for cycle length ${L} (Stride ${stride})...`);

    const results = [];

    // We build the pattern index by index.
    // Optimization: Since we need coverage check, we can fill "columns" of the stride matrix.
    // But simplistic backtracking on string P of length L is easiest to code effectively.
    // Domain for P[i] is restricted by P[i-Stride], P[i-2Stride]... due to coverage.
    // Actually, P[i] must be distinct from P[i-Stride], P[i-2Stride]... (ignoring F collisions which are allowed up to 2).

    const pattern = new Array(L).fill(null);

    // Pre-calculate which indices belong to which "Column" (mod stride)
    const columns = [];
    for (let cid = 0; cid < stride; cid++) {
        const col = [];
        for (let t = 0; t < 5; t++) {
            col.push(cid + t * stride);
        }
        columns.push(col);
    }

    function search(idx) {
        if (idx === L) {
            const pStr = pattern.join('');
            if (isValidSequence(pStr)) {
                results.push(pStr);
            }
            return;
        }

        const colId = idx % stride;
        const colIndices = columns[colId];

        // Check what's already in this column
        const used = { M: 0, T: 0, N: 0, F: 0 };
        let filledInCol = 0;

        for (let pos of colIndices) {
            if (pos < idx) {
                used[pattern[pos]]++;
                filledInCol++;
            }
        }

        // What can we place at pattern[idx]?
        // Constraints based on used:
        // M, T, N max 1. F max 2.

        // Also transition from pattern[idx-1]
        const prev = idx > 0 ? pattern[idx - 1] : null;

        // Try allowed shifts
        // Optimization: Try to stick to previous shift if valid (Block preference)
        const candidates = ['M', 'T', 'N', 'F'];
        // Heuristic: order candidates to continue current block
        if (prev) {
            candidates.sort((a, b) => (a === prev ? -1 : 1));
        }

        for (let char of candidates) {
            // 1. Column Constraint
            if (char !== 'F' && used[char] >= 1) continue;
            if (char === 'F' && used[char] >= 2) continue;

            // 2. Transition Constraint (Local)
            if (prev && !ALLOWED_TRANSITIONS[prev].includes(char)) continue;

            // 3. Consecutive Constraint (Local Lookback)
            // Cheap check: look back locally.
            // Strict check done at end for perf, or deeply?
            // Let's do a quick local check for obvious violations
            // E.g. if we have FFFFF and try F -> fail.
            // If we have MMMMMM and try M -> fail.
            let run = 1;
            for (let k = idx - 1; k >= 0; k--) {
                if (pattern[k] === char) run++;
                else break;
            }
            if (char === 'F' && run > MAX_CONSECUTIVE_OFF) continue;
            if (char !== 'F' && run > MAX_CONSECUTIVE_WORK) continue;

            // Place it
            pattern[idx] = char;

            // Recurse
            // Since we want multiple results, we don't return true immediately?
            // Let's limit results per stride
            search(idx + 1);
            if (results.length >= 50) return; // Found enough

            pattern[idx] = null;
        }
    }

    search(0);
    return results;
}

const solutions = {};
[4, 5, 6].forEach(stride => {
    // Stride 4 -> L=20
    // Stride 5 -> L=25
    // Stride 6 -> L=30
    const res = solve(stride);
    // Filter and score
    const best = res.map(p => ({ p, score: scorePattern(p) }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 5);
    solutions[stride * 5] = best;
});

console.log(JSON.stringify(solutions, null, 2));
