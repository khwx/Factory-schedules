import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Scenario, AnalysisResult } from '../types';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ComparisonChartsProps {
    scenarios: Scenario[];
    analyses: AnalysisResult[];
}

type ChartType = 'bar' | 'line' | 'area';

const ComparisonCharts: React.FC<ComparisonChartsProps> = ({ scenarios, analyses }) => {
    const [chartType, setChartType] = useState<ChartType>('bar');

    const weekendData = useMemo(() => {
        return scenarios.map((scenario, idx) => ({
            name: scenario.name.length > 15 ? scenario.name.substring(0, 15) + '...' : scenario.name,
            'Fins de Semana': analyses[idx].weekendsOffPerYear,
            'Horas Semanais': analyses[idx].avgWeeklyHours,
        }));
    }, [scenarios, analyses]);

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
                'Media Fins de Semana': Math.round(avgWeekends * 10) / 10,
            };
        });
    }, [analyses]);

    if (scenarios.length === 0) return null;

    const ChartTypeButton = ({ type, label }: { type: ChartType; label: string }) => (
        <button
            onClick={() => setChartType(type)}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
                chartType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
            }`}
            aria-pressed={chartType === type}
        >
            {label}
        </button>
    );

    const tooltipStyle = {
        backgroundColor: '#1F2937',
        border: '1px solid #374151',
        borderRadius: '0.5rem',
        color: '#fff',
    };

    const renderComparisonChart = () => {
        switch (chartType) {
            case 'line':
                return (
                    <LineChart data={weekendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                        <Line type="monotone" dataKey="Fins de Semana" stroke="#4ADE80" strokeWidth={2} dot={{ fill: '#4ADE80', r: 4 }} />
                        <Line type="monotone" dataKey="Horas Semanais" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA', r: 4 }} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={weekendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                        <Area type="monotone" dataKey="Fins de Semana" stroke="#4ADE80" fill="#4ADE80" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="Horas Semanais" stroke="#60A5FA" fill="#60A5FA" fillOpacity={0.3} />
                    </AreaChart>
                );
            default:
                return (
                    <BarChart data={weekendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                        <Bar dataKey="Fins de Semana" fill="#4ADE80" />
                        <Bar dataKey="Horas Semanais" fill="#60A5FA" />
                    </BarChart>
                );
        }
    };

    return (
        <div className="space-y-6 mb-8">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Comparacao de Fins de Semana e Horas</h3>
                    </div>
                    <div className="flex gap-1 bg-gray-900 rounded-lg p-1" role="radiogroup" aria-label="Tipo de grafico">
                        <ChartTypeButton type="bar" label="Barras" />
                        <ChartTypeButton type="line" label="Linhas" />
                        <ChartTypeButton type="area" label="Area" />
                    </div>
                </div>
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                        {renderComparisonChart()}
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Distribuicao Mensal de Fins de Semana (Media)</h3>
                </div>
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                            <Area type="monotone" dataKey="Media Fins de Semana" stroke="#4ADE80" fill="#4ADE80" fillOpacity={0.3} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ComparisonCharts;
