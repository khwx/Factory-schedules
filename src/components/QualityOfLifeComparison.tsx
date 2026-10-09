import React, { useMemo } from 'react';
import { Scenario, AnalysisResult } from '../types';
import { calculateQualityOfLifeScore } from '../utils/qualityOfLife';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useI18n } from '../i18n';

interface QualityOfLifeComparisonProps {
    scenarios: Scenario[];
    analyses: AnalysisResult[];
    year?: number;
}

const subScoreKeys = [
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

const getScoreColor = (index: number) => {
    const colors = ['#4ADE80', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA', '#34D399', '#FB923C', '#EC4899', '#22D3EE', '#EAB308'];
    return colors[index % colors.length];
};

const QualityOfLifeComparison: React.FC<QualityOfLifeComparisonProps> = ({ scenarios, analyses, year = new Date().getFullYear() }) => {
    const { t } = useI18n();

    const qolDataList = useMemo(() => {
        if (scenarios.length === 0 || analyses.length === 0) return [];
        return scenarios.map((scenario, idx) => ({
            scenario,
            qol: calculateQualityOfLifeScore(scenario, analyses[idx], year),
        }));
    }, [scenarios, analyses, year]);

    const radarData = useMemo(() => {
        if (qolDataList.length === 0) return [];
        return qolDataList.map(({ scenario, qol }) => {
            const entry: Record<string, number | string> = { name: scenario.name.length > 15 ? scenario.name.substring(0, 15) + '...' : scenario.name };
            subScoreKeys.forEach(key => {
                entry[t.qol[key as keyof typeof t.qol] || key] = qol.breakdown[key];
            });
            return entry;
        });
    }, [qolDataList, t]);

    const trendData = useMemo(() => {
        if (qolDataList.length === 0) return [];
        const months = qolDataList[0]?.qol.monthlyScores.length ?? 12;
        return t.calendar.months.slice(0, months).map((month, monthIdx) => {
            const entry: Record<string, number | string> = { month };
            qolDataList.forEach(({ scenario, qol }) => {
                entry[scenario.name.length > 15 ? scenario.name.substring(0, 15) + '...' : scenario.name] = qol.monthlyScores[monthIdx] ?? 0;
            });
            return entry;
        });
    }, [qolDataList, t]);

    if (scenarios.length === 0) return null;

    return (
        <div className="space-y-6 mb-8">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">{t.qol.comparisonRadarTitle}</h3>
                    <p className="text-sm text-gray-400 mt-1">{t.qol.comparisonRadarSubtitle}</p>
                </div>
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart cx="50%" cy="50%" innerRadius={60} outerRadius={140} data={radarData}>
                            <PolarGrid className="stroke-gray-700" />
                            <PolarAngleAxis axisLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dataKey="name" />
                            <PolarRadiusAxis axisLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '0.5rem',
                                    color: '#fff',
                                }}
                                formatter={(value: number) => [value, '']}
                            />
                            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                            {radarData.map((entry, idx) => (
                                <Radar
                                    key={idx}
                                    dataKey={entry.name as string}
                                    stroke={getScoreColor(idx)}
                                    fill={getScoreColor(idx)}
                                    fillOpacity={0.15}
                                    strokeWidth={2}
                                />
                            ))}
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">{t.qol.comparisonTrendTitle}</h3>
                    <p className="text-sm text-gray-400 mt-1">{t.qol.comparisonTrendSubtitle}</p>
                </div>
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="month"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                axisLine={{ stroke: '#374151' }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF' }}
                                axisLine={{ stroke: '#374151' }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '0.5rem',
                                    color: '#fff',
                                }}
                                formatter={(value: number) => [value, '%']}
                            />
                            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                            {qolDataList.map(({ scenario }, idx) => (
                                <Line
                                    key={idx}
                                    type="monotone"
                                    dataKey={scenario.name.length > 15 ? scenario.name.substring(0, 15) + '...' : scenario.name}
                                    stroke={getScoreColor(idx)}
                                    strokeWidth={2}
                                    dot={{ fill: getScoreColor(idx), r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default QualityOfLifeComparison;