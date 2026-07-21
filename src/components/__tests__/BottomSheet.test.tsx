import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BottomSheet from '../../components/BottomSheet';

describe('BottomSheet', () => {
    it('should not render when closed', () => {
        const { container } = render(
            <BottomSheet isOpen={false} onClose={vi.fn()}>
                Content
            </BottomSheet>
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render content when open', () => {
        render(
            <BottomSheet isOpen={true} onClose={vi.fn()} title="Test Title">
                Sheet Content
            </BottomSheet>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Sheet Content')).toBeInTheDocument();
    });

    it('should call onClose when backdrop clicked', () => {
        const onClose = vi.fn();
        render(
            <BottomSheet isOpen={true} onClose={onClose}>
                Content
            </BottomSheet>
        );
        const backdrop = screen.getByRole('dialog').firstChild;
        fireEvent.click(backdrop as Element);
        expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when close button clicked', () => {
        const onClose = vi.fn();
        render(
            <BottomSheet isOpen={true} onClose={onClose} title="Test Title">
                Content
            </BottomSheet>
        );
        const closeButton = screen.getByLabelText('Fechar');
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when Escape key pressed', () => {
        const onClose = vi.fn();
        render(
            <BottomSheet isOpen={true} onClose={onClose} title="Test Title">
                Content
            </BottomSheet>
        );
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });
});
