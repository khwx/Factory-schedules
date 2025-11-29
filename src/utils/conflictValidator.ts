// Shift Conflict Validator
// Validates that team shift patterns don't have overlapping work shifts

export interface ConflictReport {
    hasConflicts: boolean;
    conflicts: DayConflict[];
    coverage: DailyCoverage[];
}

export interface DayConflict {
    day: number; // Day index in pattern
    shift: string; // M, T, or N
    teams: string[]; // Teams with conflict (e.g., ["A", "B"])
}

export interface DailyCoverage {
    day: number;
    morning: number; // Number of teams on morning shift
    afternoon: number; // Number of teams on afternoon shift
    night: number; // Number of teams on night shift
    off: number; // Number of teams off
}

/**
 * Validate that team patterns don't have overlapping work shifts
 * Returns true if valid (no conflicts), false otherwise
 */
export function validateNoOverlaps(teamPatterns: string[]): boolean {
    if (teamPatterns.length === 0) return true;

    const patternLength = teamPatterns[0].length;

    // Check each day
    for (let day = 0; day < patternLength; day++) {
        const shiftsOnDay: { [shift: string]: number } = {
            M: 0,
            T: 0,
            N: 0,
            F: 0,
        };

        // Count shifts for this day
        for (const pattern of teamPatterns) {
            const shift = pattern[day];
            if (shift) {
                shiftsOnDay[shift] = (shiftsOnDay[shift] || 0) + 1;
            }
        }

        // Check for conflicts (more than 1 team on same work shift)
        if (shiftsOnDay.M > 1 || shiftsOnDay.T > 1 || shiftsOnDay.N > 1) {
            return false;
        }
    }

    return true;
}

/**
 * Get daily coverage breakdown
 * Returns array showing how many teams are on each shift per day
 */
export function getDailyCoverage(teamPatterns: string[]): DailyCoverage[] {
    if (teamPatterns.length === 0) return [];

    const patternLength = teamPatterns[0].length;
    const coverage: DailyCoverage[] = [];

    for (let day = 0; day < patternLength; day++) {
        const dayCoverage: DailyCoverage = {
            day,
            morning: 0,
            afternoon: 0,
            night: 0,
            off: 0,
        };

        for (const pattern of teamPatterns) {
            const shift = pattern[day];
            if (shift === 'M') dayCoverage.morning++;
            else if (shift === 'T') dayCoverage.afternoon++;
            else if (shift === 'N') dayCoverage.night++;
            else if (shift === 'F') dayCoverage.off++;
        }

        coverage.push(dayCoverage);
    }

    return coverage;
}

/**
 * Find all conflicts in team patterns
 * Returns detailed conflict report
 */
export function findConflicts(teamPatterns: string[]): ConflictReport {
    if (teamPatterns.length === 0) {
        return {
            hasConflicts: false,
            conflicts: [],
            coverage: [],
        };
    }

    const patternLength = teamPatterns[0].length;
    const conflicts: DayConflict[] = [];
    const coverage = getDailyCoverage(teamPatterns);

    // Find conflicts for each day
    for (let day = 0; day < patternLength; day++) {
        const teamsPerShift: { [shift: string]: string[] } = {
            M: [],
            T: [],
            N: [],
        };

        // Collect teams for each shift
        teamPatterns.forEach((pattern, teamIndex) => {
            const shift = pattern[day];
            if (shift === 'M' || shift === 'T' || shift === 'N') {
                const teamName = String.fromCharCode(65 + teamIndex); // A, B, C, ...
                teamsPerShift[shift].push(teamName);
            }
        });

        // Check for conflicts (multiple teams on same shift)
        for (const [shift, teams] of Object.entries(teamsPerShift)) {
            if (teams.length > 1) {
                conflicts.push({
                    day,
                    shift,
                    teams,
                });
            }
        }
    }

    return {
        hasConflicts: conflicts.length > 0,
        conflicts,
        coverage,
    };
}

/**
 * Check if coverage is adequate (at least 1 team per shift)
 * Returns array of days with inadequate coverage
 */
export function findInsufficientCoverage(teamPatterns: string[]): number[] {
    const coverage = getDailyCoverage(teamPatterns);
    const insufficientDays: number[] = [];

    for (const dayCoverage of coverage) {
        if (dayCoverage.morning === 0 || dayCoverage.afternoon === 0 || dayCoverage.night === 0) {
            insufficientDays.push(dayCoverage.day);
        }
    }

    return insufficientDays;
}

/**
 * Get human-readable conflict summary
 */
export function getConflictSummary(report: ConflictReport): string {
    if (!report.hasConflicts) {
        return 'Sem conflitos - Cobertura perfeita!';
    }

    const conflictDays = new Set(report.conflicts.map(c => c.day));
    return `${report.conflicts.length} conflito(s) em ${conflictDays.size} dia(s)`;
}
