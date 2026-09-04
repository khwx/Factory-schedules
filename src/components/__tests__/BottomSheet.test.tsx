import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import BottomSheet from '../BottomSheet';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        <ThemeProvider>
            <ToastProvider>
                <I18nProvider>
                    {children}
                </I18nProvider>
            </ToastProvider>
        </ThemeProvider>
    </BrowserRouter>
);

describe('BottomSheet', () => {
    it('should not render when closed', () => {
        const { container } = render(
            <BottomSheet isOpen={false} onClose={vi.fn()}>
                Content
            </BottomSheet>,
            { wrapper }
        );
        // The BottomSheet itself should render null when closed
        expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });

    it('should render content when open', () => {
        render(
            <BottomSheet isOpen={true} onClose={vi.fn()} title="Test Title">
                Sheet Content
            </BottomSheet>,
            { wrapper }
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Sheet Content')).toBeInTheDocument();
    });

    it('should call onClose when backdrop clicked', () => {
        const onClose = vi.fn();
        render(
            <BottomSheet isOpen={true} onClose={onClose}>
                Content
            </BottomSheet>,
            { wrapper }
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
            </BottomSheet>,
            { wrapper }
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
            </BottomSheet>,
            { wrapper }
        );
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });
});
