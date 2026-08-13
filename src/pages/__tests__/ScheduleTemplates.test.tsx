import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import ScheduleTemplates from '../ScheduleTemplates';

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

describe('ScheduleTemplates', () => {
    beforeEach(() => {
        localStorage.removeItem('shiftsim_scenarios');
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should render without crashing', () => {
        render(<ScheduleTemplates />, { wrapper });
        expect(screen.getByText(/Modelos por Industria|Industry Templates/i)).toBeInTheDocument();
    });

    it('should list industry templates', () => {
        render(<ScheduleTemplates />, { wrapper });
        expect(screen.getByText(/Industria \/ Fabrico|Manufacturing/i)).toBeInTheDocument();
        expect(screen.getByText(/Saude \/ Hospitalar|Healthcare/i)).toBeInTheDocument();
        expect(screen.getByText(/Retalho \/ Comercio|Retail/i)).toBeInTheDocument();
    });

    it('should expand an industry to show templates', () => {
        render(<ScheduleTemplates />, { wrapper });
        fireEvent.click(screen.getByText(/Industria \/ Fabrico|Manufacturing/i));
        expect(screen.getByText('4 Equipas - 2 Turnos (8h)')).toBeInTheDocument();
        expect(screen.getByText(/Importar Todos|Import All/i)).toBeInTheDocument();
    });

    it('should import a single template to localStorage', () => {
        render(<ScheduleTemplates />, { wrapper });
        fireEvent.click(screen.getByText(/Industria \/ Fabrico|Manufacturing/i));
        const singleImportButtons = screen.getAllByRole('button', { name: 'Importar' });
        fireEvent.click(singleImportButtons[0]);
        const saved = JSON.parse(localStorage.getItem('shiftsim_scenarios') || '[]');
        expect(saved.length).toBe(1);
        expect(saved[0].name).toBe('4 Equipas - 2 Turnos (8h)');
    });

    it('should show how it works guide', () => {
        render(<ScheduleTemplates />, { wrapper });
        expect(screen.getByText(/Como Funciona|How It Works/i)).toBeInTheDocument();
    });
});