import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LegalComplianceBanner from '../LegalComplianceBanner';
import { Scenario } from '../../types';

const scenario: Scenario = {
    id: 'lc-1',
    name: 'Legal Scenario',
    teams: 2,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
};

describe('LegalComplianceBanner', () => {
    it('should render header', () => {
        render(<LegalComplianceBanner scenario={scenario} year={2026} />);
        expect(screen.getByText(/Conformidade Legal/)).toBeInTheDocument();
    });

    it('should render a team section per team', () => {
        render(<LegalComplianceBanner scenario={scenario} year={2026} />);
        expect(screen.getByText('Equipa A')).toBeInTheDocument();
        expect(screen.getByText('Equipa B')).toBeInTheDocument();
    });

    it('should render rule headers', () => {
        render(<LegalComplianceBanner scenario={scenario} year={2026} />);
        expect(screen.getAllByText('Regra').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Artigo').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Estado').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Detalhes').length).toBeGreaterThan(0);
    });

    it('should render article references', () => {
        render(<LegalComplianceBanner scenario={scenario} year={2026} />);
        expect(screen.getAllByText(/Art\./).length).toBeGreaterThan(0);
    });

    it('should render a status for each rule', () => {
        render(<LegalComplianceBanner scenario={scenario} year={2026} />);
        expect(screen.getAllByText('OK').length).toBeGreaterThan(0);
    });

    it('should flag a violation for a schedule without weekly rest', () => {
        render(<LegalComplianceBanner scenario={{ ...scenario, pattern: 'MMMMMMM' }} year={2026} />);
        expect(screen.getAllByText('FALHA').length).toBeGreaterThan(0);
    });
});