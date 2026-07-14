import { describe, it, expect } from 'vitest';
import { parseImportData } from '../ImportPreview';

describe('parseImportData', () => {
    it('parses valid scenarios from object with scenarios array', () => {
        const data = {
            scenarios: [
                { name: 'Test 1', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
                { name: 'Test 2', teams: 3, shiftDuration: 12, pattern: 'MMTTFF' },
            ],
        };
        const result = parseImportData(data);
        expect(result).toHaveLength(2);
        expect(result[0].isValid).toBe(true);
        expect(result[1].isValid).toBe(true);
        expect(result[0].name).toBe('Test 1');
    });

    it('parses valid scenarios from plain array', () => {
        const data = [
            { name: 'Test', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
        ];
        const result = parseImportData(data);
        expect(result).toHaveLength(1);
        expect(result[0].isValid).toBe(true);
    });

    it('marks missing name as invalid', () => {
        const data = { scenarios: [{ teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' }] };
        const result = parseImportData(data);
        expect(result[0].isValid).toBe(false);
        expect(result[0].errors).toContain('Nome obrigatorio');
    });

    it('marks invalid teams as invalid', () => {
        const data = { scenarios: [{ name: 'Test', teams: 15, shiftDuration: 8, pattern: 'MMTTNNFFFF' }] };
        const result = parseImportData(data);
        expect(result[0].isValid).toBe(false);
        expect(result[0].errors[0]).toContain('Equipas invalido');
    });

    it('marks invalid shift duration as invalid', () => {
        const data = { scenarios: [{ name: 'Test', teams: 4, shiftDuration: 0, pattern: 'MMTTNNFFFF' }] };
        const result = parseImportData(data);
        expect(result[0].isValid).toBe(false);
        expect(result[0].errors[0]).toContain('Duracao invalida');
    });

    it('marks invalid pattern as invalid', () => {
        const data = { scenarios: [{ name: 'Test', teams: 4, shiftDuration: 8, pattern: 'XYZ' }] };
        const result = parseImportData(data);
        expect(result[0].isValid).toBe(false);
        expect(result[0].errors[0]).toContain('Padrao invalido');
    });

    it('marks too-short pattern as invalid', () => {
        const data = { scenarios: [{ name: 'Test', teams: 4, shiftDuration: 8, pattern: 'MF' }] };
        const result = parseImportData(data);
        expect(result[0].isValid).toBe(false);
    });

    it('returns empty for null input', () => {
        expect(parseImportData(null)).toEqual([]);
    });

    it('returns empty for non-object input', () => {
        expect(parseImportData('string')).toEqual([]);
    });

    it('returns empty for object with no scenarios array', () => {
        expect(parseImportData({ foo: 'bar' })).toEqual([]);
    });

    it('handles mixed valid and invalid scenarios', () => {
        const data = {
            scenarios: [
                { name: 'Valid', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
                { name: '', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
            ],
        };
        const result = parseImportData(data);
        expect(result).toHaveLength(2);
        expect(result[0].isValid).toBe(true);
        expect(result[1].isValid).toBe(false);
    });

    it('normalizes pattern to uppercase', () => {
        const data = { scenarios: [{ name: 'Test', teams: 4, shiftDuration: 8, pattern: 'mmttnnffff' }] };
        const result = parseImportData(data);
        expect(result[0].pattern).toBe('MMTTNNFFFF');
    });

    it('preserves optional fields', () => {
        const data = {
            scenarios: [{
                name: 'Test',
                teams: 4,
                shiftDuration: 8,
                weeklyHoursContract: 35,
                pattern: 'MMTTNNFFFF',
                description: 'My scenario',
                startDate: '2025-01-01',
            }],
        };
        const result = parseImportData(data);
        expect(result[0].weeklyHoursContract).toBe(35);
        expect(result[0].description).toBe('My scenario');
        expect(result[0].startDate).toBe('2025-01-01');
    });

    it('handles non-object items in array', () => {
        const data = { scenarios: ['invalid', 123] };
        const result = parseImportData(data);
        expect(result).toHaveLength(2);
        expect(result[0].isValid).toBe(false);
        expect(result[1].isValid).toBe(false);
    });
});
