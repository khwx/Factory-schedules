import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WorkloadHeatmap from '../WorkloadHeatmap';
import { Scenario } from '../../types';

const scenario: Scenario = {
    id: 'wh-1',
    name: 'Heat Scenario',
    teams: 5,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
};

describe('WorkloadHeatmap', () => {
    it('should render header with scenario name and year', () => {
        render(<WorkloadHeatmap scenario={scenario} year={2026} />);
        expect(screen.getByText(/Heatmap de Intensidade de Trabalho/)).toBeInTheDocument();
        expect(screen.getByText(/Heat Scenario/)).toBeInTheDocument();
        expect(screen.getByText(/2026/)).toBeInTheDocument();
    });

    it('should render all 12 month labels', () => {
        render(<WorkloadHeatmap scenario={scenario} year={2026} />);
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        for (const m of months) {
            expect(screen.getByText(m)).toBeInTheDocument();
        }
    });

    it('should render intensity percentages', () => {
        render(<WorkloadHeatmap scenario={scenario} year={2026} />);
        expect(screen.getAllByText(/%$/).length).toBeGreaterThanOrEqual(12);
    });

    it('should render legend items', () => {
        render(<WorkloadHeatmap scenario={scenario} year={2026} />);
        expect(screen.getByText(/Leve/)).toBeInTheDocument();
        expect(screen.getByText(/Intenso/)).toBeInTheDocument();
    });
});