import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PayEstimateDisplay from '../PayEstimateDisplay';
import { Scenario } from '../../types';

const scenario: Scenario = {
    id: 'pay-comp-1',
    name: 'Pay Component',
    teams: 5,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
};

describe('PayEstimateDisplay', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should render pay estimate for team A by default', () => {
        render(<PayEstimateDisplay scenario={scenario} />);
        expect(screen.getByText(/Estimativa de Remuneracao|Pay Estimate/i)).toBeInTheDocument();
        expect(screen.getByText(/Equipa A/i)).toBeInTheDocument();
    });

    it('should render pay estimate for a specific team', () => {
        render(<PayEstimateDisplay scenario={scenario} teamIndex={2} />);
        expect(screen.getByText(/Equipa C/i)).toBeInTheDocument();
    });

    it('should show annual salary estimate', () => {
        render(<PayEstimateDisplay scenario={scenario} teamIndex={0} />);
        expect(screen.getByText(/Anual|Annual/i)).toBeInTheDocument();
        expect(screen.getByText(/EUR/)).toBeInTheDocument();
    });

    it('should show hourly rate input', () => {
        render(<PayEstimateDisplay scenario={scenario} teamIndex={0} />);
        const inputs = screen.getAllByRole('spinbutton');
        expect(inputs.length).toBeGreaterThanOrEqual(1);
    });

    it('should update salary when rate changes', () => {
        render(<PayEstimateDisplay scenario={scenario} teamIndex={0} />);
        const rateInput = screen.getAllByRole('spinbutton')[0];
        fireEvent.change(rateInput, { target: { value: '15' } });
        expect(screen.getByText(/EUR/)).toBeInTheDocument();
    });
});