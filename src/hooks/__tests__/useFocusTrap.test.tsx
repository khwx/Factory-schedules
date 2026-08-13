import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useFocusTrap } from '../useFocusTrap';

function TrapDialog({ open }: { open: boolean }) {
    const containerRef = useFocusTrap(open);
    return (
        <div ref={containerRef}>
            <button id="btn-1">One</button>
            <button id="btn-2">Two</button>
        </div>
    );
}

describe('useFocusTrap', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('should focus the first focusable element when opened', () => {
        render(<TrapDialog open />);
        vi.advanceTimersByTime(100);
        expect(document.activeElement?.id).toBe('btn-1');
    });

    it('should wrap focus back to first element when tabbing from last', () => {
        render(<TrapDialog open />);
        vi.advanceTimersByTime(100);

        const last = document.getElementById('btn-2') as HTMLElement;
        last.focus();

        const first = document.getElementById('btn-1') as HTMLElement;
        const firstFocusSpy = vi.spyOn(first, 'focus');

        fireEvent.keyDown(document, { key: 'Tab' });
        expect(firstFocusSpy).toHaveBeenCalled();
        expect(document.activeElement?.id).toBe('btn-1');
    });

    it('should wrap focus back to last element when shift-tabbing from first', () => {
        render(<TrapDialog open />);
        vi.advanceTimersByTime(100);

        const first = document.getElementById('btn-1') as HTMLElement;
        first.focus();

        const last = document.getElementById('btn-2') as HTMLElement;
        const lastFocusSpy = vi.spyOn(last, 'focus');

        fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
        expect(lastFocusSpy).toHaveBeenCalled();
        expect(document.activeElement?.id).toBe('btn-2');
    });

    it('should not trap when there are no focusable elements', () => {
        function EmptyDialog({ open }: { open: boolean }) {
            const containerRef = useFocusTrap(open);
            return <div ref={containerRef} />;
        }
        render(<EmptyDialog open />);
        expect(() => fireEvent.keyDown(document, { key: 'Tab' })).not.toThrow();
    });

    it('should not focus when closed', () => {
        render(<TrapDialog open={false} />);
        vi.advanceTimersByTime(100);
        expect(document.activeElement?.id).not.toBe('btn-1');
    });
});