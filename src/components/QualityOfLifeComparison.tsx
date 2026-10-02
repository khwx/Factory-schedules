import React, { useMemo } from 'react';
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Tooltip,
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import { Scenario, AnalysisResult } from '../types';
import { calculateQualityOfLifeScore } from '../utils/qualityOfLife';
import { BarChart2, TrendingUp, Trophy } from 'lucide-react';
import { useI18n } from '../i18n';

interface QualityOfLifeComparisonProps {
    scenarios: Scenario[];
    analyses: AnalysisResult[];
    year?: number;
}

const QUOL_BREAKDOWN_KEYS = [
    'weekendsCoverage',
    'workLifeBalance',
    'consecutiveRest',
    'nightShiftImpact',
    'holidaysCoverage',
    'recoveryRegularity',
    'fatigueAccumulation',
    'socialDisruption',
    'circadianDisruption',
    'longTermSustainability',
] as const;

const QualityOfLifeComparison: React.FC<QualityOfLifeComparisonProps> = ({
    scenarios,
    analyses,
    year = new Date().getFullYear(),
}) => {
    const { t } = useI18n();

    const qolData = useMemo(() => {
        if (scenarios.length === 0 || analyses.length === 0) return [];
        return scenarios.map((scenario, idx) => ({
            scenario,
            analysis: analyses[idx],
            qol: calculateQualityOfLifeScore(scenario, analyses[idx], year),
        }));
    }, [scenarios, analyses, year]);

    const radarData = useMemo(() => {
        return qolData.map(({ scenario, qol }, _idx) => ({
            name: scenario.name.length > 15 ? scenario.name.substring(0, 15) + '...' : scenario.name,
            ...Object.fromEntries(
                QUOL_BREAKDOWN_KEYS.map(key => [t.qol[key as keyof typeof t.qol], qol.breakdown[key]])
            ),
        }));
    }, [qolData, t]);

    const monthlyTrendData = useMemo(() => {
        const months = t.comparisonCharts.monthsShort;
        return months.map((month, monthIdx) => {
            const entry: Record<string, string | number> = { month };
            qolData.forEach(({ scenario, qol }, _idx) => {
                entry[scenario.name.length > 15 ? scenario.name.substring(0, 15) + '...' : scenario.name] = qol.monthlyScores[monthIdx];
            });
            return entry;
        });
    }, [qolData, t]);

    if (qolData.length === 0) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#4ADE80';
        if (score >= 60) return '#60A5FA';
        if (score >= 40) return '#FACC15';
        if (score >= 20) return '#FB923C';
        return '#F87171';
    };

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A+':
            case 'A':
                return 'text-green-400 bg-green-900/30 border-green-700';
            case 'B':
                return 'text-blue-400 bg-blue-900/30 border-blue-700';
            case 'C':
                return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
            case 'D':
                return 'text-orange-400 bg-orange-900/30 border-orange-700';
            case 'F':
                return 'text-red-400 bg-red-900/30 border-red-700';
            default:
                return 'text-gray-400 bg-gray-900/30 border-gray-700';
        }
    };

    const tooltipStyle = {
        backgroundColor: '#1F2937',
        border: '1px solid #374151',
        borderRadius: '0.5rem',
        color: '#fff',
    };

    const bestOverall = qolData.reduce((best, current) =>
        current.qol.overall > best.qol.overall ? current : best
    );

    return (
        <div className="space-y-6 mb-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {qolData.map(({ scenario, qol }, _idx) => (
                    <div
                        key={scenario.id}
                        className={`bg-gray-800 rounded-lg border p-4 ${
                            qol.overall === bestOverall.qol.overall ? 'border-green-500/50' : 'border-gray-700'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-white truncate pr-2">{scenario.name}</h4>
                            {qol.overall === bestOverall.qol.overall && (
                                <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" aria-label={t.comparison.best} />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${getGradeColor(qol.grade)}`}>
                                    <div className="text-center">
                                        <div className="text-xl font-bold">{qol.grade}</div>
                                        <div className="text-[10px] opacity-75">{qol.overall}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-700">
                            <div className="text-xs text-gray-400 uppercase tracking-wide">{t.qol.overall}</div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
                                <div
                                    className="h-full transition-all duration-500"
                                    style={{ width: `${qol.overall}%`, backgroundColor: getScoreColor(qol.overall) }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Radar Chart */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">{t.qol.comparisonRadarTitle}</h3>
                </div>
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#374151" />
                            <PolarAngleAxis
                                dataKey="name"
                                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                stroke="#374151"
                            />
                            <PolarRadiusAxis
                                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                stroke="#374151"
                                domain={[0, 100]}
                                tickCount={5}
                            />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend
                                wrapperStyle={{ color: '#9CA3AF' }}
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                            />
                            {qolData.map(({ qol }, _idx) => (
                                <Radar
                                    key={_idx}
                                    dataKey={qolData[_idx].scenario.name}
                                    stroke={getScoreColor(qol.overall)}
                                    fill={getScoreColor(qol.overall)}
                                    fillOpacity={0.15}
                                    strokeWidth={2}
                                    dot={{ fill: getScoreColor(qol.overall), r: 3 }}
                                />
                            ))}
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-xs text-gray-500 text-center">
                        {t.qol.comparisonRadarSubtitle}
                    </div>
                </div>
            </div>

            {/* Monthly Trend Comparison */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">{t.qol.comparisonTrendTitle}</h3>
                </div>
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={monthlyTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="month"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                                domain={[0, 100]}
                            />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                            {qolData.map(({ qol }, _idx) => (
                                <Line
                                    key={_idx}
                                    type="monotone"
                                    dataKey={qolData[_idx].scenario.name}
                                    stroke={getScoreColor(qol.overall)}
                                    strokeWidth={2}
                                    dot={{ fill: getScoreColor(qol.overall), r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 2 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-xs text-gray-500 text-center">
                        {t.qol.comparisonTrendSubtitle}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QualityOfLifeComparison;