import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardStats from '../DashboardStats';
import { I18nProvider } from '../../i18n';
import { Scenario } from '../../types';

const scenarios: Scenario[] = [
    { id: '1', name: 'A', teams: 5, shiftDuration: 8, weeklyHoursContract: 40, pattern: 'MMTTNNFFFF' },
    { id: '2', name: 'B', teams: 4, shiftDuration: 8, weeklyHoursContract: 40, pattern: 'MMMMFFFF' },
];

const renderStats = (scs: Scenario[]) => render(
    <I18nProvider>
        <DashboardStats scenarios={scs} />
    </I18nProvider>
);

describe('DashboardStats', () => {
    it('should render scenario count', () => {
        renderStats(scenarios);
        expect(screen.getByText('Cenarios')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render total teams', () => {
        renderStats(scenarios);
        expect(screen.getByText('Total Equipas')).toBeInTheDocument();
        expect(screen.getByText('9')).toBeInTheDocument();
    });

    it('should render average hours', () => {
        renderStats(scenarios);
        expect(screen.getByText('Media Horas')).toBeInTheDocument();
        expect(screen.getByText(/h$/)).toBeInTheDocument();
    });

    it('should render night shifts stat', () => {
        renderStats(scenarios);
        expect(screen.getByText('Turnos Noite')).toBeInTheDocument();
    });

    it('should render fridays off stat', () => {
        renderStats(scenarios);
        expect(screen.getByText('Sextas Livres')).toBeInTheDocument();
    });

    it('should return null for empty scenarios', () => {
        const { container } = renderStats([]);
        expect(container.firstChild).toBeNull();
    });
});