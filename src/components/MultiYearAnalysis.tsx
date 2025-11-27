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
                            <th className="p-3 text-left text-gray-400 font-medium border-b border-gray-700">Year</th>
                            <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Total de Fins de Semana</th>
                            <th className="p-3 text-center text-gray-400 font-medium border-b border-gray-700">Total Off Days</th>
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
                                <td className="p-3 text-center text-blue-400 font-mono border-b border-gray-700">{yearData.totalOffDays}</td>
                                {yearData.monthlyBreakdown.map(month => (
                                    <td key={month.month} className="p-2 text-center text-gray-300 font-mono border-b border-gray-700 border-l border-gray-700">
                                        <div className="flex flex-col">
                                            <span className="text-green-400">{month.weekendsOff}</span>
                                            <span className="text-xs text-gray-500">({month.totalOffDays})</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-3 bg-gray-900/30 text-xs text-gray-400 border-t border-gray-700">
                <span className="text-green-400">Números verdes</span>: Fins de semana de folga (Sáb+Dom) •
                <span className="text-gray-500 ml-2">(Números cinzentos)</span>: Total de dias de folga no mês
            </div>
        </div>
    );
};

export default MultiYearAnalysis;
