import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import HolidayCalendar from '../HolidayCalendar';

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

describe('HolidayCalendar', () => {
    beforeEach(() => {
        localStorage.removeItem('shiftsim_custom_holidays');
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should render without crashing', () => {
        render(<HolidayCalendar />, { wrapper });
        expect(screen.getByText(/Calendario de Feriados|Holiday Calendar/i)).toBeInTheDocument();
    });

    it('should show month navigation', () => {
        render(<HolidayCalendar />, { wrapper });
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it('should show country selector with Portugal default', () => {
        render(<HolidayCalendar />, { wrapper });
        const combos = screen.getAllByRole('combobox');
        expect(combos.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/Portugal/)).toBeInTheDocument();
    });

    it('should show add holiday button', () => {
        render(<HolidayCalendar />, { wrapper });
        expect(screen.getByText(/Adicionar Feriado|Add Holiday/i)).toBeInTheDocument();
    });

    it('should open add holiday form', () => {
        render(<HolidayCalendar />, { wrapper });
        fireEvent.click(screen.getByText(/Adicionar Feriado|Add Holiday/i));
        expect(screen.getByText(/Novo Feriado Personalizado|New Custom Holiday/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Nome do feriado|Holiday name/i)).toBeInTheDocument();
    });

    it('should show legend for holiday types', () => {
        render(<HolidayCalendar />, { wrapper });
        expect(screen.getAllByText(/Nacional|National/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Religioso|Religious/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Personalizado|Custom/i).length).toBeGreaterThanOrEqual(1);
    });

    it('should show calendar grid with day names', () => {
        render(<HolidayCalendar />, { wrapper });
        expect(screen.getAllByText(/Seg|Ter|Qua|Qui|Sex|Sab|Dom|Mon|Tue|Wed|Thu|Fri|Sat|Sun/i).length).toBeGreaterThanOrEqual(7);
    });
});