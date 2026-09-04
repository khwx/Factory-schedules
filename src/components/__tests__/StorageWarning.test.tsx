import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import StorageWarning from '../StorageWarning';

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

vi.mock('../../utils/storageQuota', () => ({
    getStorageInfo: () => ({ usedBytes: 4 * 1024 * 1024, estimatedQuota: 5 * 1024 * 1024, percentUsed: 80 }),
    formatStorageSize: (b: number) => `${(b / 1024 / 1024).toFixed(1)} MB`,
}));

describe('StorageWarning', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render warning when storage is high', () => {
        render(<StorageWarning />, { wrapper });
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/80%/)).toBeInTheDocument();
        expect(screen.getByText(/4.0 MB/)).toBeInTheDocument();
    });

    it('should hide warning when dismissed', () => {
        render(<StorageWarning />, { wrapper });
        const closeButton = screen.getByLabelText(/Fechar/i);
        fireEvent.click(closeButton);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});
