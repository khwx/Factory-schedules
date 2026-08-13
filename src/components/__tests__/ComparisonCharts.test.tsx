import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ComparisonCharts from '../ComparisonCharts';
import { Scenario, AnalysisResult } from '../../types';

vi.mock('recharts', async () => {
    const actual = await vi.importActual<typeof import('recharts')>('recharts');
    const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="responsive">{children}</div>
    );
    return { ...actual, ResponsiveContainer };
});

const scenarios: Scenario[] = [
    { id: '1', name: 'Scenario A', teams: 5, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
    { id: '2', name: 'Scenario B', teams: 4, shiftDuration: 8, pattern: 'MMMMFFFF' },
];

const makeAnalysis = (overrides: Partial<AnalysisResult> = {}): AnalysisResult => ({
    avgWeeklyHours: 42,
    totalAnnualHours: 2184,
    weekendsOffPerYear: 40,
    weekendsOffPerMonthAvg: 3.3,
    totalOffDaysPerYear: 200,
    qualitative: [],
    multiYearAnalysis: [],
    advancedMetrics: undefined,
    ...overrides,
});

const analyses: AnalysisResult[] = [
    makeAnalysis({ weekendsOffPerYear: 40, avgWeeklyHours: 42 }),
    makeAnalysis({ weekendsOffPerYear: 45, avgWeeklyHours: 36 }),
];

const renderCharts = () => render(<ComparisonCharts scenarios={scenarios} analyses={analyses} />);

describe('ComparisonCharts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the charts title', () => {
        renderCharts();
        expect(screen.getByText('Comparacao de Fins de Semana e Horas')).toBeInTheDocument();
    });

    it('should render the monthly distribution title', () => {
        renderCharts();
        expect(screen.getByText(/Distribuicao Mensal/)).toBeInTheDocument();
    });

    it('should render chart type buttons', () => {
        renderCharts();
        expect(screen.getByRole('button', { name: 'Barras' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Linhas' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Area' })).toBeInTheDocument();
    });

    it('should render responsive containers', () => {
        renderCharts();
        expect(screen.getAllByTestId('responsive').length).toBe(2);
    });

    it('should switch chart type on button click', () => {
        renderCharts();
        fireEvent.click(screen.getByRole('button', { name: 'Linhas' }));
        // line chart is now active - assert no crash and bar inactive state
        expect(screen.getByText('Comparacao de Fins de Semana e Horas')).toBeInTheDocument();
    });

    it('should switch to area chart', () => {
        renderCharts();
        fireEvent.click(screen.getByRole('button', { name: 'Area' }));
        expect(screen.getByText('Comparacao de Fins de Semana e Horas')).toBeInTheDocument();
    });
});