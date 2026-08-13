import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportScenarioToCSV, exportScenarioToJSON, exportComparisonToCSV, exportComparisonToJSON } from '../csvJsonExport';
import { Scenario, AnalysisResult } from '../../types';
import { calculateAnalysis } from '../calculations';

function createScenario(overrides: Partial<Scenario> = {}): Scenario {
    return {
        id: 'csv-1',
        name: 'CSV Test Scenario',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFFFF',
        ...overrides,
    };
}

describe('csvJsonExport', () => {
    let clickSpy: ReturnType<typeof vi.spyOn>;
    let createSpy: ReturnType<typeof vi.spyOn>;
    let anchors: HTMLAnchorElement[];

    beforeEach(() => {
        anchors = [];
        createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
        clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
        const originalAppend = document.body.appendChild.bind(document.body);
        vi.spyOn(document.body, 'appendChild').mockImplementation((node: Node) => {
            if (node instanceof HTMLAnchorElement) anchors.push(node);
            return originalAppend(node);
        });
        const originalRemove = document.body.removeChild.bind(document.body);
        vi.spyOn(document.body, 'removeChild').mockImplementation((node: Node) => originalRemove(node));
    });

    afterEach(() => {
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    function lastAnchor(): HTMLAnchorElement {
        expect(anchors.length).toBeGreaterThan(0);
        return anchors[anchors.length - 1];
    }

    it('should trigger a CSV download for a scenario', () => {
        const scenario = createScenario();
        const analysis = calculateAnalysis(scenario);
        exportScenarioToCSV(scenario, analysis);
        expect(clickSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).toHaveBeenCalledTimes(1);
        expect(lastAnchor().download).toContain('.csv');
    });

    it('should trigger a JSON download for a scenario', () => {
        const scenario = createScenario();
        const analysis = calculateAnalysis(scenario);
        exportScenarioToJSON(scenario, analysis);
        expect(lastAnchor().download).toContain('.json');
    });

    it('should trigger a CSV download for comparison', () => {
        const scenario = createScenario();
        const analysis = calculateAnalysis(scenario);
        exportComparisonToCSV([scenario], [analysis]);
        expect(lastAnchor().download).toContain('Comparacao');
        expect(lastAnchor().download).toContain('.csv');
    });

    it('should trigger a JSON download for comparison', () => {
        const scenario = createScenario();
        const analysis = calculateAnalysis(scenario);
        exportComparisonToJSON([scenario], [analysis]);
        expect(lastAnchor().download).toContain('.json');
    });

    it('should handle a manual analysis result without advanced metrics', () => {
        const scenario = createScenario();
        const analysis: AnalysisResult = {
            avgWeeklyHours: 36,
            totalAnnualHours: 1800,
            weekendsOffPerYear: 26,
            weekendsOffPerMonthAvg: 2.16,
            totalOffDaysPerYear: 150,
            qualitative: ['Bom equilibrio'],
            multiYearAnalysis: [],
        };
        exportScenarioToCSV(scenario, analysis);
        expect(clickSpy).toHaveBeenCalled();
    });
});