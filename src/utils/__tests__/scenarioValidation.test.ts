import { describe, it, expect } from 'vitest';
import { validateScenario, validateScenarios, loadValidatedScenarios } from '../scenarioValidation';

describe('scenarioValidation', () => {
    describe('validateScenario', () => {
        it('should return true for valid scenario', () => {
            const scenario = {
                id: 'test-1',
                name: 'Test',
                teams: 4,
                shiftDuration: 8,
                pattern: 'MMTTNNFFFF',
            };
            expect(validateScenario(scenario)).toBe(true);
        });

        it('should return false for null', () => {
            expect(validateScenario(null)).toBe(false);
        });

        it('should return false for non-object', () => {
            expect(validateScenario('string')).toBe(false);
            expect(validateScenario(42)).toBe(false);
            expect(validateScenario(undefined)).toBe(false);
        });

        it('should return false when id is missing', () => {
            expect(validateScenario({ name: 'Test', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' })).toBe(false);
        });

        it('should return false when name is missing', () => {
            expect(validateScenario({ id: 'test-1', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' })).toBe(false);
        });

        it('should return false when teams is out of range', () => {
            expect(validateScenario({ id: 'test-1', name: 'Test', teams: 0, shiftDuration: 8, pattern: 'MMTTNNFFFF' })).toBe(false);
            expect(validateScenario({ id: 'test-1', name: 'Test', teams: 101, shiftDuration: 8, pattern: 'MMTTNNFFFF' })).toBe(false);
        });

        it('should return false when shiftDuration is out of range', () => {
            expect(validateScenario({ id: 'test-1', name: 'Test', teams: 4, shiftDuration: 0, pattern: 'MMTTNNFFFF' })).toBe(false);
            expect(validateScenario({ id: 'test-1', name: 'Test', teams: 4, shiftDuration: 25, pattern: 'MMTTNNFFFF' })).toBe(false);
        });

        it('should return false for invalid pattern characters', () => {
            expect(validateScenario({ id: 'test-1', name: 'Test', teams: 4, shiftDuration: 8, pattern: 'ABCD' })).toBe(false);
        });

        it('should accept optional fields', () => {
            const scenario = {
                id: 'test-1',
                name: 'Test',
                teams: 4,
                shiftDuration: 8,
                pattern: 'MMTTNNFFFF',
                hidden: true,
                weeklyHoursContract: 40,
                teamPatterns: ['MMTTNNFFFF', 'FFMMTTNNFF'],
                startDate: '2024-01-01',
                description: 'Test description',
            };
            expect(validateScenario(scenario)).toBe(true);
        });

        it('should reject invalid teamPatterns', () => {
            const scenario = {
                id: 'test-1',
                name: 'Test',
                teams: 4,
                shiftDuration: 8,
                pattern: 'MMTTNNFFFF',
                teamPatterns: ['INVALID', 'MMTTNNFFFF'],
            };
            expect(validateScenario(scenario)).toBe(false);
        });
    });

    describe('validateScenarios', () => {
        it('should return valid scenarios from array', () => {
            const data = [
                { id: '1', name: 'A', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
                { id: '2', name: 'B', teams: 3, shiftDuration: 6, pattern: 'MMMMTTTTFF' },
            ];
            expect(validateScenarios(data)).toHaveLength(2);
        });

        it('should filter out invalid scenarios', () => {
            const data = [
                { id: '1', name: 'A', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
                { id: null, name: 'B', teams: 3, shiftDuration: 6, pattern: 'MMMMTTTTFF' },
            ];
            expect(validateScenarios(data)).toHaveLength(1);
        });

        it('should return empty array for non-array input', () => {
            expect(validateScenarios(null)).toEqual([]);
            expect(validateScenarios({})).toEqual([]);
            expect(validateScenarios('string')).toEqual([]);
        });
    });

    describe('loadValidatedScenarios', () => {
        beforeEach(() => {
            localStorage.clear();
        });

        it('should return empty array when nothing in localStorage', () => {
            expect(loadValidatedScenarios()).toEqual([]);
        });

        it('should return empty array for invalid JSON', () => {
            localStorage.setItem('shiftsim_scenarios', 'not-json');
            expect(loadValidatedScenarios()).toEqual([]);
        });

        it('should validate and return scenarios from localStorage', () => {
            const data = [
                { id: '1', name: 'A', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
            ];
            localStorage.setItem('shiftsim_scenarios', JSON.stringify(data));
            const result = loadValidatedScenarios();
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('1');
        });

        it('should clean invalid scenarios from localStorage', () => {
            const data = [
                { id: '1', name: 'A', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
                { id: 'bad', name: 'B' },
            ];
            localStorage.setItem('shiftsim_scenarios', JSON.stringify(data));
            const result = loadValidatedScenarios();
            expect(result).toHaveLength(1);
            const cleaned = JSON.parse(localStorage.getItem('shiftsim_scenarios')!);
            expect(cleaned).toHaveLength(1);
        });
    });
});
