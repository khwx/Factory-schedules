import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComplianceComparison from '../ComplianceComparison';
import { Scenario } from '../../types';

const compliant: Scenario = {
    id: 'c1',
    name: 'Compliant',
    teams: 2,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
};

const violating: Scenario = {
    id: 'v1',
    name: 'Violating',
    teams: 2,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMMMMMM',
};

describe('ComplianceComparison', () => {
    it('should return null for empty scenarios', () => {
        const { container } = render(<ComplianceComparison scenarios={[]} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render header', () => {
        render(<ComplianceComparison scenarios={[compliant, violating]} />);
        expect(screen.getByText(/Conformidade Legal/)).toBeInTheDocument();
    });

    it('should render overall score percentage', () => {
        render(<ComplianceComparison scenarios={[compliant, violating]} />);
        expect(screen.getByText('50% Conforme')).toBeInTheDocument();
    });

    it('should render scenario names', () => {
        render(<ComplianceComparison scenarios={[compliant, violating]} />);
        expect(screen.getByText('Compliant')).toBeInTheDocument();
        expect(screen.getByText('Violating')).toBeInTheDocument();
    });

    it('should show status labels', () => {
        render(<ComplianceComparison scenarios={[compliant, violating]} />);
        expect(screen.getByText('Conforme')).toBeInTheDocument();
        expect(screen.getByText('Nao Conforme')).toBeInTheDocument();
    });

    it('should show teams conforming count', () => {
        render(<ComplianceComparison scenarios={[compliant, violating]} />);
        expect(screen.getAllByText('2/2').length).toBeGreaterThan(0);
    });

    it('should show most common failure', () => {
        render(<ComplianceComparison scenarios={[compliant, violating]} />);
        expect(screen.getByText(/Falha mais comum/)).toBeInTheDocument();
    });

    it('should render nothing about failures when all pass', () => {
        render(<ComplianceComparison scenarios={[compliant]} />);
        expect(screen.getByText('100% Conforme')).toBeInTheDocument();
        expect(screen.queryByText(/Falha mais comum/)).not.toBeInTheDocument();
    });

    it('should render trophy for best scenario', () => {
        render(<ComplianceComparison scenarios={[compliant, violating]} />);
        expect(screen.getByText('Compliant').closest('tr')!.querySelector('svg')).toBeInTheDocument();
    });
});