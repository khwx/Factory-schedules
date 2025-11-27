import React from 'react';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';

interface ComparisonTableProps {
    scenarios: Scenario[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ scenarios }) => {
    if (scenarios.length === 0) return null;

    const analyses = scenarios.map(s => calculateAnalysis(s));

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mt-8">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Comparação de Cenários</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 bg-gray-900/50 text-gray-400 font-medium border-b border-gray-700 w-1/4">Métrica</th>
                            {scenarios.map(scenario => (
                                <th key={scenario.id} className="p-4 bg-gray-900/50 text-white font-semibold border-b border-gray-700 border-l border-gray-700">
                                    {scenario.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 border-b border-gray-700 text-gray-300">Horas Semanais Médias</td>
                            {analyses.map((analysis, i) => (
                                <td key={i} className={`p-4 border-b border-gray-700 border-l border-gray-700 font-mono ${analysis.avgWeeklyHours > 40 ? 'text-red-400' : 'text-green-400'}`}>
                                    {analysis.avgWeeklyHours.toFixed(1)}h
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border-b border-gray-700 text-gray-300">Horas Anuais Totais</td>
                            {analyses.map((analysis, i) => (
                                <td key={i} className="p-4 border-b border-gray-700 border-l border-gray-700 font-mono text-gray-400">
                                    {Math.round(analysis.totalAnnualHours)}h
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border-b border-gray-700 text-gray-300">Fins de Semana de Folga (Ano)</td>
                            {analyses.map((analysis, i) => (
                                <td key={i} className="p-4 border-b border-gray-700 border-l border-gray-700 font-mono text-white">
                                    {analysis.weekendsOffPerYear}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border-b border-gray-700 text-gray-300">Total de Dias de Folga (Ano)</td>
                            {analyses.map((analysis, i) => (
                                <td key={i} className="p-4 border-b border-gray-700 border-l border-gray-700 font-mono text-green-400">
                                    {analysis.totalOffDaysPerYear}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 border-b border-gray-700 text-gray-300 align-top">Análise</td>
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
