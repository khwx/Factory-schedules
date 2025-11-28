import React from 'react';
import { YearlyAnalysis } from '../types';
import { Calendar } from 'lucide-react';

interface MultiYearAnalysisProps {
    multiYearData: YearlyAnalysis[];
    scenarioName: string;
}

const MultiYearAnalysis: React.FC<MultiYearAnalysisProps> = ({ multiYearData, scenarioName }) => {
    if (!multiYearData || multiYearData.length === 0) return null;

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">
                    Análise de Fins de Semana (5 Anos): {scenarioName}
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-900/50">
                            <th className="p-3 text-left text-gray-400 font-medium border-b border-gray-700">Ano</th>
                            <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Total de Fins de Semana</th>
                            <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Sábados</th>
                            <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Domingos</th>
                            <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Total de Dias de Folga</th>
                            {multiYearData[0]?.monthlyBreakdown.map(m => (
                                <th key={m.month} className="p-2 text-center text-gray-400 font-medium border-b border-gray-700 border-l border-gray-700">
                                    {m.monthName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {multiYearData.map((yearData, idx) => (
                            <tr key={yearData.year} className={idx % 2 === 0 ? 'bg-gray-800/50' : ''}>
                                <td className="p-3 text-white font-semibold border-b border-gray-700">{yearData.year}</td>
                                <td className="p-3 text-center text-green-400 font-mono border-b border-gray-700">{yearData.totalWeekends}</td>
                                <td className="p-3 text-center text-gray-300 font-mono border-b border-gray-700">{yearData.totalSaturdaysOff}</td>
                                <td className="p-3 text-center text-gray-300 font-mono border-b border-gray-700">{yearData.totalSundaysOff}</td>
                                <td className="p-3 text-center text-blue-400 font-mono border-b border-gray-700">{yearData.totalOffDays}</td>
                                {yearData.monthlyBreakdown.map(month => (
                                    <td key={month.month} className="p-2 text-center text-gray-300 font-mono border-b border-gray-700 border-l border-gray-700">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-green-400 font-bold" title="Fins de Semana Completos">{month.weekendsOff}</span>
                                            <div className="flex justify-center gap-1 text-[10px] text-gray-400">
                                                <span title="Sábados Livres">S:{month.saturdaysOff}</span>
                                                <span title="Domingos Livres">D:{month.sundaysOff}</span>
                                            </div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-3 bg-gray-900/30 text-xs text-gray-400 border-t border-gray-700">
                <span className="text-green-400">Números verdes</span>: Fins de semana completos •
                <span className="text-gray-500 ml-2">S/D</span>: Total de Sábados e Domingos livres
            </div>
        </div>
    );
};

export default MultiYearAnalysis;
