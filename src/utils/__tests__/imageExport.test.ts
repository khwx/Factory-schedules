import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportElementAsImage } from '../imageExport';

// Mock html2canvas
vi.mock('html2canvas', () => ({
    default: vi.fn().mockResolvedValue({
        toDataURL: vi.fn().mockReturnValue('data:image/png;base64,test'),
    }),
}));

describe('imageExport', () => {
    let mockAnchor: HTMLAnchorElement;
    let clickSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        mockAnchor = document.createElement('a');
        clickSpy = vi.spyOn(mockAnchor, 'click').mockImplementation(() => {});
        vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create download link with default filename', async () => {
        const element = document.createElement('div');
        await exportElementAsImage(element);

        expect(mockAnchor.download).toBe('shiftsim_export.png');
        expect(mockAnchor.href).toBe('data:image/png;base64,test');
        expect(clickSpy).toHaveBeenCalled();
    });

    it('should use custom filename when provided', async () => {
        const element = document.createElement('div');
        await exportElementAsImage(element, 'custom_name.png');

        expect(mockAnchor.download).toBe('custom_name.png');
    });
});
