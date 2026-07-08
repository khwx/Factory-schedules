import { describe, it, expect } from 'vitest';
import {
    validateNoOverlaps,
    getDailyCoverage,
    findConflicts,
    findInsufficientCoverage,
    getConflictSummary,
} from '../conflictValidator';

describe('conflictValidator', () => {
    describe('validateNoOverlaps', () => {
        it('should return true for valid non-overlapping patterns', () => {
            const patterns = ['MMFF', 'TTFF', 'NNFF'];
            expect(validateNoOverlaps(patterns)).toBe(true);
        });

        it('should return false for overlapping patterns', () => {
            const patterns = ['MMFF', 'MMFF']; // Both on M on days 0-1
            expect(validateNoOverlaps(patterns)).toBe(false);
        });

        it('should return true for empty patterns', () => {
            expect(validateNoOverlaps([])).toBe(true);
        });

        it('should return true for single team', () => {
            expect(validateNoOverlaps(['MMTTNN'])).toBe(true);
        });
    });

    describe('getDailyCoverage', () => {
        it('should return coverage for each day', () => {
            const patterns = ['MMFF', 'TTFF', 'NNFF'];
            const coverage = getDailyCoverage(patterns);

            expect(coverage.length).toBe(4);
            expect(coverage[0]).toHaveProperty('morning');
            expect(coverage[0]).toHaveProperty('afternoon');
            expect(coverage[0]).toHaveProperty('night');
            expect(coverage[0]).toHaveProperty('off');
        });

        it('should count shifts correctly', () => {
            const patterns = ['MMFF', 'TTFF', 'NNFF'];
            const coverage = getDailyCoverage(patterns);

            // Day 0: M=1, T=1, N=1, F=0
            expect(coverage[0].morning).toBe(1);
            expect(coverage[0].afternoon).toBe(1);
            expect(coverage[0].night).toBe(1);
            expect(coverage[0].off).toBe(0);
        });

        it('should count off days correctly', () => {
            const patterns = ['FFFF', 'FFFF', 'FFFF'];
            const coverage = getDailyCoverage(patterns);

            expect(coverage[0].off).toBe(3);
            expect(coverage[0].morning).toBe(0);
        });

        it('should return empty for no patterns', () => {
            expect(getDailyCoverage([])).toEqual([]);
        });
    });

    describe('findConflicts', () => {
        it('should return no conflicts for valid patterns', () => {
            const patterns = ['MMFF', 'TTFF', 'NNFF'];
            const report = findConflicts(patterns);

            expect(report.hasConflicts).toBe(false);
            expect(report.conflicts.length).toBe(0);
        });

        it('should detect conflicts', () => {
            const patterns = ['MMFF', 'MMFF']; // Both on M
            const report = findConflicts(patterns);

            expect(report.hasConflicts).toBe(true);
            expect(report.conflicts.length).toBeGreaterThan(0);
        });

        it('should include coverage in report', () => {
            const patterns = ['MMFF', 'TTFF'];
            const report = findConflicts(patterns);

            expect(report.coverage.length).toBe(4);
        });

        it('should return empty report for no patterns', () => {
            const report = findConflicts([]);

            expect(report.hasConflicts).toBe(false);
            expect(report.conflicts.length).toBe(0);
            expect(report.coverage.length).toBe(0);
        });
    });

    describe('findInsufficientCoverage', () => {
        it('should return days with no morning coverage', () => {
            const patterns = ['FFMM', 'FFTT', 'FFNN']; // Days 0-1 no work
            const insufficient = findInsufficientCoverage(patterns);

            expect(insufficient).toContain(0);
            expect(insufficient).toContain(1);
        });

        it('should return empty for adequate coverage', () => {
            const patterns = ['MMMM', 'TTTT', 'NNNN'];
            const insufficient = findInsufficientCoverage(patterns);

            expect(insufficient.length).toBe(0);
        });
    });

    describe('getConflictSummary', () => {
        it('should return success message for no conflicts', () => {
            const report = findConflicts(['MMFF', 'TTFF']);
            const summary = getConflictSummary(report);

            expect(summary).toContain('Sem conflitos');
        });

        it('should return conflict count for conflicts', () => {
            const report = findConflicts(['MMFF', 'MMFF']);
            const summary = getConflictSummary(report);

            expect(summary).toContain('conflito');
        });
    });
});
