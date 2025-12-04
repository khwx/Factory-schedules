import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Scenario, AnalysisResult } from '../types';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ComparisonChartsProps {
    scenarios: Scenario[];
    analyses: AnalysisResult[];
}

const ComparisonCharts: React.FC<ComparisonChartsProps> = ({ scenarios, analyses }) => {
    // Prepare data for weekend comparison chart
    const weekendData = useMemo(() => {
        return scenarios.map((scenario, idx) => ({
            name: scenario.name.length > 15 ? scenario.name.substring(0, 15) + '...' : scenario.name,
            'Fins de Semana': analyses[idx].weekendsOffPerYear,
            'Horas Semanais': analyses[idx].avgWeeklyHours,
        }));
    }, [scenarios, analyses]);

    // Prepare data for monthly distribution (average across all scenarios)
    const monthlyData = useMemo(() => {
        if (analyses.length === 0) return [];

        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        return months.map((month, idx) => {
            const avgWeekends = analyses.reduce((sum, analysis) => {
                const monthData = analysis.multiYearAnalysis[0]?.monthlyBreakdown[idx];
                return sum + (monthData?.weekendsOff || 0);
            }, 0) / analyses.length;

            return {
                month,
                'Média Fins de Semana': Math.round(avgWeekends * 10) / 10,
            };
        });
    }, [analyses]);

    if (scenarios.length === 0) return null;

    return (
        <div className="space-y-6 mb-8">
            {/* Weekend Comparison Chart */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Comparação de Fins de Semana e Horas</h3>
                </div>
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weekendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="name"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '0.5rem',
                                    color: '#fff'
                                }}
                            />
                            <Legend
                                wrapperStyle={{ color: '#9CA3AF' }}
                            />
                            <Bar dataKey="Fins de Semana" fill="#4ADE80" />
                            <Bar dataKey="Horas Semanais" fill="#60A5FA" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Distribution Chart */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Distribuição Mensal de Fins de Semana (Média)</h3>
                </div>
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="month"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '0.5rem',
                                    color: '#fff'
                                }}
                            />
                            <Legend
                                wrapperStyle={{ color: '#9CA3AF' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Média Fins de Semana"
                                stroke="#4ADE80"
                                strokeWidth={2}
                                dot={{ fill: '#4ADE80', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ComparisonCharts;
