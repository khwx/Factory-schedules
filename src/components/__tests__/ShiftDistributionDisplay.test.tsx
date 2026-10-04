import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../../i18n';
import ShiftDistributionDisplay from '../ShiftDistributionDisplay';
import { Scenario } from '../../types';

const scenario: Scenario = {
    id: 'sd-1',
    name: 'Dist Scenario',
    teams: 5,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
};

const renderWithI18n = (ui: React.ReactElement) => render(<I18nProvider>{ui}</I18nProvider>);

describe('ShiftDistributionDisplay', () => {
    it('should render header with scenario name', () => {
        renderWithI18n(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getByText(/Distribuição de Turnos/i)).toBeInTheDocument();
        expect(screen.getByText(/Dist Scenario/)).toBeInTheDocument();
    });

    it('should show night density metric', () => {
        renderWithI18n(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getByText('Densidade Nocturna')).toBeInTheDocument();
    });

    it('should show off days metric', () => {
        renderWithI18n(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getByText('Dias de Folga')).toBeInTheDocument();
    });

    it('should show average work per week', () => {
        renderWithI18n(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getByText('Dias Trabalho/Semana')).toBeInTheDocument();
        expect(screen.getByText('4.24')).toBeInTheDocument();
    });

    it('should show shift type labels', () => {
        renderWithI18n(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getAllByText('Manha').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Tarde').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Noite').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Folga').length).toBeGreaterThanOrEqual(1);
    });

    it('should show suggestions', () => {
        renderWithI18n(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getAllByText(/•/).length).toBeGreaterThan(0);
    });
});