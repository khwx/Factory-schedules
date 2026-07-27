import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportScenariosToJSON, importScenariosFromFile } from '../scenarioIO';

describe('scenarioIO', () => {
    describe('exportScenariosToJSON', () => {
        let mockAnchor: any;

        beforeEach(() => {
            mockAnchor = {
                href: '',
                download: '',
                click: vi.fn(),
            };
            vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
            vi.spyOn(document.body, 'appendChild').mockReturnValue(mockAnchor as any);
            vi.spyOn(document.body, 'removeChild').mockReturnValue(mockAnchor as any);
            URL.createObjectURL = vi.fn(() => 'blob:test');
            URL.revokeObjectURL = vi.fn();
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('should create a download link with JSON content', () => {
            const scenarios = [
                { id: '1', name: 'Test', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
            ];

            exportScenariosToJSON(scenarios as any);

            expect(URL.createObjectURL).toHaveBeenCalled();
            expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
            expect(mockAnchor.click).toHaveBeenCalled();
            expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
            expect(URL.revokeObjectURL).toHaveBeenCalled();
        });
    });

    describe('importScenariosFromFile', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('should be a defined function', () => {
            expect(exportScenariosToJSON).toBeDefined();
            expect(importScenariosFromFile).toBeDefined();
            expect(typeof exportScenariosToJSON).toBe('function');
            expect(typeof importScenariosFromFile).toBe('function');
        });
    });
});
