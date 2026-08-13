import { Scenario } from '../types';
import { validateLegalCompliance, LegalComplianceReport } from './legalValidator';

export interface ScenarioCompliance {
    scenarioId: string;
    scenarioName: string;
    year: number;
    allPassed: boolean;
    totalTeams: number;
    teamsPassing: number;
    criticalFailures: number;
    warnings: number;
    reports: LegalComplianceReport[];
}

export interface ComplianceSummary {
    scenarios: ScenarioCompliance[];
    bestScenarioId: string | null;
    overallScore: number;
}

/**
 * Aggregate legal compliance across multiple scenarios for the current year.
 * Returns a summary plus per-scenario compliance data.
 */
export function summarizeCompliance(
    scenarios: Scenario[],
    year: number = new Date().getFullYear(),
): ComplianceSummary {
    const perScenario = scenarios.map(scenario => {
        const reports = validateLegalCompliance(scenario, year);
        const teamsPassing = reports.filter(r => r.allPassed).length;
        const criticalFailures = reports.reduce((sum, r) => sum + r.criticalFailures, 0);
        const warnings = reports.reduce((sum, r) => sum + r.warnings, 0);

        return {
            scenarioId: scenario.id,
            scenarioName: scenario.name,
            year,
            allPassed: teamsPassing === reports.length && reports.length > 0,
            totalTeams: reports.length,
            teamsPassing,
            criticalFailures,
            warnings,
            reports,
        };
    });

    const passingScenarios = perScenario.filter(s => s.allPassed).length;
    const overallScore = perScenario.length > 0
        ? Math.round((passingScenarios / perScenario.length) * 100)
        : 0;

    const best = perScenario.filter(s => s.allPassed)
        .sort((a, b) => b.teamsPassing - a.teamsPassing || a.criticalFailures - b.criticalFailures)[0];

    return {
        scenarios: perScenario,
        bestScenarioId: best ? best.scenarioId : null,
        overallScore,
    };
}

/**
 * Find the most common rule failure across scenarios, useful for actionable insight.
 */
export function findTopFailure(
    scenarios: Scenario[],
    year: number = new Date().getFullYear(),
): { ruleId: string; title: string; count: number } | null {
    const counts = new Map<string, { title: string; count: number }>();

    for (const scenario of scenarios) {
        const reports = validateLegalCompliance(scenario, year);
        for (const report of reports) {
            for (const result of report.results) {
                if (result.limit !== undefined && !result.passed) {
                    const current = counts.get(result.rule.id) || { title: result.rule.title, count: 0 };
                    current.count += 1;
                    counts.set(result.rule.id, current);
                }
            }
        }
    }

    let top: { ruleId: string; title: string; count: number } | null = null;
    for (const [ruleId, value] of counts.entries()) {
        if (!top || value.count > top.count) {
            top = { ruleId, title: value.title, count: value.count };
        }
    }
    return top;
}