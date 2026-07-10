import React, { useMemo } from 'react';
import { Scenario, AnalysisResult } from '../types';
import { calculateAnalysis } from '../utils/calculations';
import { Trophy, TrendingDown, Minus } from 'lucide-react';

interface ComparisonTableProps {
    scenarios: Scenario[];
    analyses?: AnalysisResult[];
}

interface ComparisonRow {
    label: string;
    values: number[];
    unit?: string;
    better?: 'lower' | 'higher';
    format?: (value: number) => string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ scenarios, analyses: preComputedAnalyses }) => {
    const analyses = useMemo(
        () => preComputedAnalyses ?? scenarios.map(s => calculateAnalysis(s)),
        [scenarios, preComputedAnalyses]
    );

    const rows: ComparisonRow[] = useMemo(() => [
        {
            label: 'Horas Semanais Médias',
            values: analyses.map(a => a.avgWeeklyHours),
            unit: 'h',
            better: 'lower',
            format: (v) => v.toFixed(1),
        },
        {
            label: 'Horas Anuais Totais',
            values: analyses.map(a => a.totalAnnualHours),
            unit: 'h',
            format: (v) => Math.round(v).toString(),
        },
        {
            label: 'Fins de Semana de Folga',
            values: analyses.map(a => a.weekendsOffPerYear),
            better: 'higher',
        },
        {
            label: 'Total de Dias de Folga',
            values: analyses.map(a => a.totalOffDaysPerYear),
            better: 'higher',
        },
        {
            label: 'Média de FDS Folga/Mês',
            values: analyses.map(a => a.weekendsOffPerMonthAvg),
            unit: 'fim/semana',
            format: (v) => v.toFixed(1),
        },
        {
            label: 'Dias Máx. Consecutivos de Trabalho',
            values: analyses.map(a => a.advancedMetrics?.maxConsecutiveWorkDays || 0),
            better: 'lower',
        },
        {
            label: 'Mini-Férias (3+ dias folga)',
            values: analyses.map(a => a.advancedMetrics?.miniVacations || 0),
            better: 'higher',
        },
        {
            label: 'Turnos Nocturnos/Ano',
            values: analyses.map(a => a.advancedMetrics?.totalNightShifts || 0),
            better: 'lower',
        },
        {
            label: 'Feriados Trabalhados',
            values: analyses.map(a => a.advancedMetrics?.holidaysWorked || 0),
            better: 'lower',
        },
    ], [analyses]);

    const getBestIndex = (row: ComparisonRow): number | null => {
        if (!row.better || row.values.length < 2) return null;
        const min = Math.min(...row.values);
        const max = Math.max(...row.values);
        if (min === max) return null;
        return row.better === 'lower' ? row.values.indexOf(min) : row.values.indexOf(max);
    };

    const getWorstIndex = (row: ComparisonRow): number | null => {
        if (!row.better || row.values.length < 2) return null;
        const min = Math.min(...row.values);
        const max = Math.max(...row.values);
        if (min === max) return null;
        return row.better === 'lower' ? row.values.indexOf(max) : row.values.indexOf(min);
    };

    const getValueColor = (row: ComparisonRow, value: number): string => {
        if (!row.better || row.values.length < 2) return 'text-white';
        const bestIdx = getBestIndex(row);
        const worstIdx = getWorstIndex(row);
        const idx = row.values.indexOf(value);
        if (idx === bestIdx) return 'text-green-400 font-bold';
        if (idx === worstIdx) return 'text-red-400';
        return 'text-gray-300';
    };

    const getValueTrend = (row: ComparisonRow, value: number) => {
        if (!row.better || row.values.length < 2) return null;
        const bestIdx = getBestIndex(row);
        const worstIdx = getWorstIndex(row);
        const idx = row.values.indexOf(value);
        if (idx === bestIdx) return <Trophy className="w-4 h-4 text-yellow-400 inline ml-2" />;
        if (idx === worstIdx) return <TrendingDown className="w-4 h-4 text-red-400 inline ml-2" />;
        return <Minus className="w-4 h-4 text-gray-500 inline ml-2" />;
    };

    if (scenarios.length === 0) return null;

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mt-8">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Comparação de Cenários</h2>
                <span className="text-sm text-gray-400">{scenarios.length} cenários</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 bg-gray-900/50 text-gray-400 font-medium border-b border-gray-700 w-1/4">
                                Métrica
                            </th>
                            {scenarios.map(scenario => (
                                <th key={scenario.id} className="p-4 bg-gray-900/50 text-white font-semibold border-b border-gray-700 border-l border-gray-700">
                                    {scenario.name}
                                    <div className="text-xs text-gray-500 font-normal mt-1">
                                        {scenario.teams} equipas · {scenario.shiftDuration}h
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Configuration rows */}
                        <tr className="bg-gray-900/30">
                            <td className="p-4 border-b border-gray-700 text-gray-300 font-medium" colSpan={scenarios.length + 1}>
                                Configuração
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 border-b border-gray-700 text-gray-300">Padrão</td>
                            {scenarios.map(scenario => (
                                <td key={scenario.id} className="p-4 border-b border-gray-700 border-l border-gray-700 font-mono text-sm text-gray-400">
                                    {scenario.pattern}
                                </td>
                            ))}
                        </tr>
                        {scenarios.some(s => s.weeklyHoursContract) && (
                            <tr>
                                <td className="p-4 border-b border-gray-700 text-gray-300">Contrato Semanal</td>
                                {scenarios.map(scenario => (
                                    <td key={scenario.id} className="p-4 border-b border-gray-700 border-l border-gray-700 font-mono text-gray-400">
                                        {scenario.weeklyHoursContract ? `${scenario.weeklyHoursContract}h` : '-'}
                                    </td>
                                ))}
                            </tr>
                        )}

                        {/* Metrics rows */}
                        <tr className="bg-gray-900/30">
                            <td className="p-4 border-b border-gray-700 text-gray-300 font-medium" colSpan={scenarios.length + 1}>
                                Métricas
                            </td>
                        </tr>
                        {rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-gray-700/30 transition-colors">
                                <td className="p-4 border-b border-gray-700 text-gray-300">
                                    {row.label}
                                </td>
                                {row.values.map((value, i) => (
                                    <td key={i} className={`p-4 border-b border-gray-700 border-l border-gray-700 font-mono ${getValueColor(row, value)}`}>
                                        {row.format ? row.format(value) : value}
                                        {row.unit && <span className="text-gray-500 ml-1">{row.unit}</span>}
                                        {getValueTrend(row, value)}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {/* Analysis rows */}
                        <tr className="bg-gray-900/30">
                            <td className="p-4 border-b border-gray-700 text-gray-300 font-medium" colSpan={scenarios.length + 1}>
                                Análise Qualitativa
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 border-b border-gray-700 text-gray-300 align-top">Observações</td>
                            {analyses.map((analysis, i) => (
                                <td key={i} className="p-4 border-b border-gray-700 border-l border-gray-700 align-top">
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                                        {analysis.qualitative.map((q, idx) => (
                                            <li key={idx}>{q}</li>
                                        ))}
                                    </ul>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonTable;
