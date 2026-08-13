import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MultiYearAnalysis from '../MultiYearAnalysis';
import { YearlyAnalysis } from '../../types';

const multiYearData: YearlyAnalysis[] = [
    {
        year: 2026,
        totalWeekends: 40,
        totalSaturdaysOff: 30,
        totalSundaysOff: 35,
        totalOffDays: 200,
        totalHoursWorked: 1750,
        monthlyBreakdown: [
            { month: 1, monthName: 'Jan', weekendsOff: 3, saturdaysOff: 2, sundaysOff: 3, totalOffDays: 18 },
            { month: 2, monthName: 'Fev', weekendsOff: 2, saturdaysOff: 2, sundaysOff: 2, totalOffDays: 15 },
        ],
    },
    {
        year: 2027,
        totalWeekends: 38,
        totalSaturdaysOff: 28,
        totalSundaysOff: 33,
        totalOffDays: 190,
        totalHoursWorked: 1700,
        monthlyBreakdown: [
            { month: 1, monthName: 'Jan', weekendsOff: 3, saturdaysOff: 2, sundaysOff: 3, totalOffDays: 17 },
            { month: 2, monthName: 'Fev', weekendsOff: 2, saturdaysOff: 2, sundaysOff: 2, totalOffDays: 14 },
        ],
    },
];

describe('MultiYearAnalysis', () => {
    it('should render header with scenario name', () => {
        render(<MultiYearAnalysis multiYearData={multiYearData} scenarioName="Test Scenario" />);
        expect(screen.getByText(/Análise de Fins de Semana \(5 Anos\)/)).toBeInTheDocument();
        expect(screen.getByText(/Test Scenario/)).toBeInTheDocument();
    });

    it('should render year rows', () => {
        render(<MultiYearAnalysis multiYearData={multiYearData} scenarioName="Test" />);
        expect(screen.getByText('2026')).toBeInTheDocument();
        expect(screen.getByText('2027')).toBeInTheDocument();
    });

    it('should show totals', () => {
        render(<MultiYearAnalysis multiYearData={multiYearData} scenarioName="Test" />);
        expect(screen.getAllByText('40').length).toBeGreaterThan(0);
        expect(screen.getByText('200')).toBeInTheDocument();
        expect(screen.getByText('190')).toBeInTheDocument();
    });

    it('should render month columns', () => {
        render(<MultiYearAnalysis multiYearData={multiYearData} scenarioName="Test" />);
        expect(screen.getAllByText('Jan').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Fev').length).toBeGreaterThan(0);
    });

    it('should render legend', () => {
        render(<MultiYearAnalysis multiYearData={multiYearData} scenarioName="Test" />);
        expect(screen.getByText(/Números verdes/)).toBeInTheDocument();
    });

    it('should return null for empty data', () => {
        const { container } = render(<MultiYearAnalysis multiYearData={[]} scenarioName="Test" />);
        expect(container.firstChild).toBeNull();
    });
});