import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TeamFairness from '../TeamFairness';
import { Scenario } from '../../types';
import { I18nProvider } from '../../i18n';

const scenario: Scenario = {
    id: 'fair-1',
    name: 'Fairness Scenario',
    teams: 4,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFF',
    teamPatterns: ['MMTTNNFF', 'NNFFMMTT', 'TTNNFFMM', 'FFMMTTNN'],
};

const renderWithI18n = (component: React.ReactElement) => {
    return render(<I18nProvider>{component}</I18nProvider>);
};

describe('TeamFairness', () => {
    it('should render fairness analysis header', () => {
        renderWithI18n(<TeamFairness scenario={scenario} />);
        expect(screen.getByText(/Análise de Equidade da Equipa|Team Fairness/i)).toBeInTheDocument();
    });

    it('should show year navigation', () => {
        renderWithI18n(<TeamFairness scenario={scenario} />);
        const year = new Date().getFullYear();
        expect(screen.getByText(year.toString())).toBeInTheDocument();
    });

    it('should show coverage analysis section', () => {
        renderWithI18n(<TeamFairness scenario={scenario} />);
        expect(screen.getByText(/Cobertura Diária|Daily Coverage/i)).toBeInTheDocument();
    });

    it('should show fairness insights', () => {
        renderWithI18n(<TeamFairness scenario={scenario} />);
        expect(screen.getAllByText(/✅|⚠️|💰/).length).toBeGreaterThanOrEqual(1);
    });
});