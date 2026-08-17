import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiTeamCalendarView } from '../MultiTeamCalendarView';
import { Scenario } from '../../types';

const scenario: Scenario = {
    id: 'mtc-1',
    name: 'Multi Team Scenario',
    teams: 2,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFF',
    teamPatterns: ['MMTTNNFF', 'NNFFMMTT'],
};

describe('MultiTeamCalendarView', () => {
    it('renders the scenario name in the header', () => {
        render(<MultiTeamCalendarView scenario={scenario} onClose={() => {}} />);
        expect(screen.getByText(/Vista Multi-Equipa - Multi Team Scenario/)).toBeInTheDocument();
    });

    it('renders a column/row per team', () => {
        render(<MultiTeamCalendarView scenario={scenario} onClose={() => {}} />);
        expect(screen.getAllByText('Turno A').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Turno B').length).toBeGreaterThan(0);
    });

    it('renders layout toggle and legend', () => {
        render(<MultiTeamCalendarView scenario={scenario} onClose={() => {}} />);
        expect(screen.getByTitle(/Vista Horizontal/)).toBeInTheDocument();
        expect(screen.getByTitle(/Vista Vertical/)).toBeInTheDocument();
        expect(screen.getByText('Manhã (M)')).toBeInTheDocument();
    });

    it('switches to vertical layout when toggled', () => {
        render(<MultiTeamCalendarView scenario={scenario} onClose={() => {}} />);
        fireEvent.click(screen.getByTitle(/Vista Vertical/));
        expect(screen.getByTitle(/Vista Vertical/).className).toContain('active');
    });

    it('calls onClose when the close button is clicked', () => {
        const onClose = vi.fn();
        render(<MultiTeamCalendarView scenario={scenario} onClose={onClose} />);
        fireEvent.click(screen.getByText('✕'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('navigates between years', () => {
        const currentYear = new Date().getFullYear();
        render(<MultiTeamCalendarView scenario={scenario} onClose={() => {}} />);
        const yearSelector = screen.getByText(currentYear.toString()).closest('.year-selector') as HTMLElement;
        const buttons = yearSelector.querySelectorAll('button');
        fireEvent.click(buttons[buttons.length - 1]);
        expect(screen.getByText((currentYear + 1).toString())).toBeInTheDocument();
    });
});
