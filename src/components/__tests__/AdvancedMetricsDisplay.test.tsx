import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdvancedMetricsDisplay from '../AdvancedMetricsDisplay';
import { AdvancedMetrics } from '../../types';
import { I18nProvider } from '../../i18n';

const metrics: AdvancedMetrics = {
    maxConsecutiveOffDays: 4,
    maxConsecutiveWorkDays: 6,
    maxConsecutiveNightShifts: 4,
    miniVacations: 3,
    isolatedOffDays: 12,
    totalNightShifts: 80,
    nightShiftsPerMonth: 6.67,
    fridayNightsOff: 35,
    saturdayNightsOff: 33,
    sundayMorningsOff: 42,
    holidaysOff: 6,
    holidaysWorked: 5,
    holidaysList: ['Dia de Ano Novo', 'Natal'],
};

describe('AdvancedMetricsDisplay', () => {
    it('should render work load section', () => {
        render(
            <I18nProvider>
                <AdvancedMetricsDisplay metrics={metrics} scenarioName="Test Scenario" />
            </I18nProvider>
        );
        expect(screen.getByText(/Carga de Trabalho/i)).toBeInTheDocument();
    });

    it('should show consecutive work days', () => {
        render(
            <I18nProvider>
                <AdvancedMetricsDisplay metrics={metrics} scenarioName="Test Scenario" />
            </I18nProvider>
        );
        expect(screen.getByText('Max. Dias de Trabalho Consecutivos')).toBeInTheDocument();
        expect(screen.getAllByText('6').length).toBeGreaterThanOrEqual(1);
    });

    it('should show mini vacations count', () => {
        render(
            <I18nProvider>
                <AdvancedMetricsDisplay metrics={metrics} scenarioName="Test Scenario" />
            </I18nProvider>
        );
        expect(screen.getByText('Mini-Ferias (3+ dias)')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should show total night shifts', () => {
        render(
            <I18nProvider>
                <AdvancedMetricsDisplay metrics={metrics} scenarioName="Test Scenario" />
            </I18nProvider>
        );
        expect(screen.getByText('Total de Turnos Noturnos')).toBeInTheDocument();
        expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('should show holiday list', () => {
        render(
            <I18nProvider>
                <AdvancedMetricsDisplay metrics={metrics} scenarioName="Test Scenario" />
            </I18nProvider>
        );
        expect(screen.getByText(/Dia de Ano Novo/i)).toBeInTheDocument();
        expect(screen.getByText(/Natal/i)).toBeInTheDocument();
    });
});