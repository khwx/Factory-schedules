import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../../i18n';
import TeamAnalysis from '../TeamAnalysis';
import { Scenario } from '../../types';

const multiTeamScenario: Scenario = {
    id: 'team-analysis-1',
    name: 'Multi Team Scenario',
    teams: 3,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFF',
    teamPatterns: ['MMTTNNFF', 'NNFFMMTT', 'TTNNFFMM'],
};

const renderWithI18n = (ui: React.ReactElement) => render(<I18nProvider>{ui}</I18nProvider>);

describe('TeamAnalysis', () => {
    it('renders a table with one row per team', () => {
        renderWithI18n(<TeamAnalysis scenario={multiTeamScenario} />);
        expect(screen.getByText('Analise por Equipa')).toBeInTheDocument();
        expect(screen.getByText('Equipa A')).toBeInTheDocument();
        expect(screen.getByText('Equipa B')).toBeInTheDocument();
        expect(screen.getByText('Equipa C')).toBeInTheDocument();
    });

    it('shows the column headers', () => {
        renderWithI18n(<TeamAnalysis scenario={multiTeamScenario} />);
        expect(screen.getByText('Turnos/Ano')).toBeInTheDocument();
        expect(screen.getByText('Dias Folga')).toBeInTheDocument();
        expect(screen.getByText('FDS Folga')).toBeInTheDocument();
        expect(screen.getByText('Turnos Noite')).toBeInTheDocument();
        expect(screen.getByText('Horas/Semana')).toBeInTheDocument();
    });

    it('displays a fairness badge', () => {
        renderWithI18n(<TeamAnalysis scenario={multiTeamScenario} />);
        expect(screen.getAllByText(/Equilibrado|Desiquilibrado/).length).toBeGreaterThanOrEqual(1);
    });

    it('renders nothing when there is a single team', () => {
        const singleTeam = { ...multiTeamScenario, teams: 1 };
        const { container } = renderWithI18n(<TeamAnalysis scenario={singleTeam} />);
        expect(container).toBeEmptyDOMElement();
    });
});
