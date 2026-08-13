import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('ShiftDistributionDisplay', () => {
    it('should render header with scenario name', () => {
        render(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getByText(/Distribuição de Turnos/i)).toBeInTheDocument();
        expect(screen.getByText(/Dist Scenario/)).toBeInTheDocument();
    });

    it('should show night density metric', () => {
        render(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getByText('Densidade Nocturna')).toBeInTheDocument();
    });

    it('should show off days metric', () => {
        render(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getByText('Dias de Folga')).toBeInTheDocument();
    });

    it('should show average work per week', () => {
        render(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getByText('Dias Trabalho/Semana')).toBeInTheDocument();
        expect(screen.getByText('4.24')).toBeInTheDocument();
    });

    it('should show shift type labels', () => {
        render(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getAllByText('Manhã').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Tarde').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Noite').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Folga').length).toBeGreaterThanOrEqual(1);
    });

    it('should show suggestions', () => {
        render(<ShiftDistributionDisplay scenario={scenario} year={2026} />);
        expect(screen.getAllByText(/•/).length).toBeGreaterThan(0);
    });
});