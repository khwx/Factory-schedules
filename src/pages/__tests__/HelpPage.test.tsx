import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import HelpPage from '../HelpPage';

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

describe('HelpPage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should render without crashing', () => {
        render(<HelpPage />, { wrapper });
        expect(screen.getAllByText(/Ajuda|Help/i).length).toBeGreaterThanOrEqual(1);
    });

    it('should show FAQ section', () => {
        render(<HelpPage />, { wrapper });
        expect(screen.getAllByText(/Perguntas Frequentes|FAQ/i).length).toBeGreaterThanOrEqual(1);
    });

    it('should show keyboard shortcuts section', () => {
        render(<HelpPage />, { wrapper });
        expect(screen.getAllByText(/Atalhos|Shortcuts/i).length).toBeGreaterThanOrEqual(1);
    });

    it('should be able to expand a FAQ item', () => {
        render(<HelpPage />, { wrapper });
        const question = screen.getByText(/O que e o ShiftSim Factory|What is ShiftSim Factory/i);
        fireEvent.click(question);
        // After expanding, answer becomes visible
        expect(screen.getAllByText(/simulador de escalas industriais|industrial shift schedule simulator/i).length).toBeGreaterThanOrEqual(1);
    });
});