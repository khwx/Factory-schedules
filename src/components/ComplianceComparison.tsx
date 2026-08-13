import React, { useMemo } from 'react';
import { ShieldCheck, ShieldAlert, Trophy, AlertTriangle } from 'lucide-react';
import { Scenario } from '../types';
import { summarizeCompliance, findTopFailure } from '../utils/complianceSummary';

interface ComplianceComparisonProps {
    scenarios: Scenario[];
}

const ComplianceComparison: React.FC<ComplianceComparisonProps> = ({ scenarios }) => {
    const summary = useMemo(() => summarizeCompliance(scenarios), [scenarios]);
    const topFailure = useMemo(() => findTopFailure(scenarios), [scenarios]);

    if (scenarios.length === 0) return null;

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-400" />
                    <h3 className="text-lg font-semibold text-white">Conformidade Legal — Comparacao</h3>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                    summary.overallScore === 100
                        ? 'bg-green-900 text-green-300'
                        : summary.overallScore >= 50
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-red-900 text-red-300'
                }`}>
                    {summary.overallScore}% Conforme
                </span>
            </div>

            <div className="p-4">
                {summary.scenarios.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Sem cenarios para analisar.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 border-b border-gray-700">
                                    <th className="py-2 pr-4 text-left">Cenario</th>
                                    <th className="py-2 pr-4 text-center">Estado</th>
                                    <th className="py-2 pr-4 text-center">Equipas Conformes</th>
                                    <th className="py-2 pr-4 text-center">Falhas Criticas</th>
                                    <th className="py-2 text-center">Avisos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.scenarios.map(s => (
                                    <tr key={s.scenarioId} className="border-b border-gray-700/50 last:border-0">
                                        <td className="py-2 pr-4 text-white">
                                            <span className="flex items-center gap-2">
                                                {s.scenarioId === summary.bestScenarioId && s.allPassed && (
                                                    <Trophy className="w-4 h-4 text-yellow-400" />
                                                )}
                                                {s.scenarioName}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-4 text-center">
                                            {s.allPassed ? (
                                                <span className="inline-flex items-center gap-1 text-green-400">
                                                    <ShieldCheck className="w-4 h-4" /> Conforme
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-red-400">
                                                    <ShieldAlert className="w-4 h-4" /> Nao Conforme
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 pr-4 text-center text-gray-300 font-mono">
                                            {s.teamsPassing}/{s.totalTeams}
                                        </td>
                                        <td className="py-2 pr-4 text-center">
                                            <span className={`font-mono ${s.criticalFailures > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                {s.criticalFailures}
                                            </span>
                                        </td>
                                        <td className="py-2 text-center text-gray-300 font-mono">
                                            {s.warnings}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {topFailure && (
                    <div className="mt-4 flex items-start gap-2 bg-red-900/20 border border-red-700/40 rounded-lg p-3">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-200">
                            <span className="font-semibold">Falha mais comum:</span> {topFailure.title}
                            <span className="text-red-400"> ({topFailure.count} ocorrencias)</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplianceComparison;