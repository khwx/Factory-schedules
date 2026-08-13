import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TeamFairness from '../TeamFairness';
import { Scenario } from '../../types';

const scenario: Scenario = {
    id: 'fair-1',
    name: 'Fairness Scenario',
    teams: 4,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFF',
    teamPatterns: ['MMTTNNFF', 'NNFFMMTT', 'TTNNFFMM', 'FFMMTTNN'],
};

describe('TeamFairness', () => {
    it('should render fairness analysis header', () => {
        render(<TeamFairness scenario={scenario} />);
        expect(screen.getByText(/Análise de Equidade da Equipa|Team Fairness/i)).toBeInTheDocument();
    });

    it('should show year navigation', () => {
        render(<TeamFairness scenario={scenario} />);
        const year = new Date().getFullYear();
        expect(screen.getByText(year.toString())).toBeInTheDocument();
    });

    it('should show coverage analysis section', () => {
        render(<TeamFairness scenario={scenario} />);
        expect(screen.getByText(/Análise de Cobertura Diária/i)).toBeInTheDocument();
    });

    it('should show fairness insights', () => {
        render(<TeamFairness scenario={scenario} />);
        expect(screen.getAllByText(/✅|⚠️|💰/).length).toBeGreaterThanOrEqual(1);
    });
});