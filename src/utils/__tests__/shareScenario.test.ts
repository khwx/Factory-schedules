import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateShareableLink, checkForSharedScenario } from '../shareScenario';
import { Scenario } from '../../types';

const testScenario: Scenario = {
    id: 'share-test',
    name: 'Teste Partilha',
    teams: 2,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
    teamPatterns: ['MMTTNNFFFF', 'TTNNFFFFMM'],
    startDate: '2025-01-01',
};

describe('shareScenario', () => {
    describe('generateShareableLink', () => {
        it('should generate a URL with hash', () => {
            const link = generateShareableLink(testScenario);
            expect(link).toContain('#share=');
        });

        it('should contain base64 encoded data', () => {
            const link = generateShareableLink(testScenario);
            const hashPart = link.split('#share=')[1];
            expect(hashPart).toBeTruthy();
            expect(() => atob(hashPart)).not.toThrow();
        });

        it('should encode scenario data correctly', () => {
            const link = generateShareableLink(testScenario);
            const hashPart = link.split('#share=')[1];
            const decoded = JSON.parse(atob(hashPart));
            expect(decoded.n).toBe('Teste Partilha');
            expect(decoded.t).toBe(2);
            expect(decoded.d).toBe(8);
            expect(decoded.p).toBe('MMTTNNFFFF');
        });

        it('should include teamPatterns when present', () => {
            const link = generateShareableLink(testScenario);
            const hashPart = link.split('#share=')[1];
            const decoded = JSON.parse(atob(hashPart));
            expect(decoded.tp).toEqual(['MMTTNNFFFF', 'TTNNFFFFMM']);
        });

        it('should include startDate when present', () => {
            const link = generateShareableLink(testScenario);
            const hashPart = link.split('#share=')[1];
            const decoded = JSON.parse(atob(hashPart));
            expect(decoded.s).toBe('2025-01-01');
        });

        it('should not include search params', () => {
            const link = generateShareableLink(testScenario);
            expect(link).not.toContain('?');
        });
    });

    describe('checkForSharedScenario', () => {
        let originalHash: string;

        beforeEach(() => {
            originalHash = window.location.hash;
        });

        afterEach(() => {
            window.history.replaceState(null, '', originalHash || '/');
        });

        it('should return null when no share hash', () => {
            window.history.replaceState(null, '', '/#no-share');
            const result = checkForSharedScenario();
            expect(result).toBeNull();
        });

        it('should return null for empty hash', () => {
            window.history.replaceState(null, '', '/');
            const result = checkForSharedScenario();
            expect(result).toBeNull();
        });

        it('should decode shared scenario data', () => {
            const data = { n: 'Shared', t: 1, d: 8, p: 'MMFF' };
            const encoded = btoa(JSON.stringify(data));
            window.history.replaceState(null, '', `/#share=${encoded}`);

            const result = checkForSharedScenario();
            expect(result).not.toBeNull();
            expect(result?.n).toBe('Shared');
            expect(result?.t).toBe(1);
        });

        it('should return null for invalid base64', () => {
            window.history.replaceState(null, '', '/#share=!!!invalid!!!');
            const result = checkForSharedScenario();
            expect(result).toBeNull();
        });

        it('should clear the hash from URL after reading', () => {
            const data = { n: 'Test', t: 1, d: 8, p: 'MM' };
            const encoded = btoa(JSON.stringify(data));
            window.history.replaceState(null, '', `/#share=${encoded}`);

            checkForSharedScenario();
            expect(window.location.hash).toBe('');
        });
    });
});
