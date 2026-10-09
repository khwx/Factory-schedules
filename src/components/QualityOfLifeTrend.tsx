import React, { useMemo } from 'react';
import { Scenario, AnalysisResult } from '../types';
import { calculateQualityOfLifeScore } from '../utils/qualityOfLife';
import { TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';
import { useI18n } from '../i18n';

interface QualityOfLifeTrendProps {
    scenario: Scenario;
    analysis: AnalysisResult;
    year?: number;
}

const QualityOfLifeTrend: React.FC<QualityOfLifeTrendProps> = ({ scenario, analysis, year = new Date().getFullYear() }) => {
    const { t } = useI18n();
    const monthNames = t.calendar.months.map(m => m.substring(0, 3));

    const qolData = useMemo(() => {
        return calculateQualityOfLifeScore(scenario, analysis, year);
    }, [scenario, analysis, year]);

    const monthlyScores = qolData.monthlyScores;
    const avgScore = monthlyScores.length > 0
        ? Math.round(monthlyScores.reduce((a, b) => a + b, 0) / monthlyScores.length)
        : 0;
    const bestMonthIdx = monthlyScores.indexOf(Math.max(...monthlyScores));
    const worstMonthIdx = monthlyScores.indexOf(Math.min(...monthlyScores));
    const trend = monthlyScores.length > 1
        ? (monthlyScores[monthlyScores.length - 1] - monthlyScores[0]) / monthlyScores.length * 10
        : 0;

    const getTrendIcon = () => {
        if (trend > 2) return <TrendingUp className="w-4 h-4 text-green-400" />;
        if (trend < -2) return <TrendingDown className="w-4 h-4 text-red-400" />;
        return <Minus className="w-4 h-4 text-yellow-400" />;
    };

    const getTrendLabel = () => {
        if (trend > 2) return t.qol.trendImproving;
        if (trend < -2) return t.qol.trendDeclining;
        return t.qol.trendStable;
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-blue-400';
        if (score >= 40) return 'text-yellow-400';
        if (score >= 20) return 'text-orange-400';
        return 'text-red-400';
    };

    const getBarHeight = (score: number) => {
        return Math.max(4, (score / 100) * 120);
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">{t.qol.trendTitle} - {scenario.name}</h3>
            </div>

            <div className="p-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">{t.qol.trendAverage}</div>
                        <div className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}%</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">{t.qol.trendBestMonth}</div>
                        <div className="text-sm text-gray-300">{monthNames[bestMonthIdx]}</div>
                        <div className={`text-xl font-bold ${getScoreColor(monthlyScores[bestMonthIdx])}`}>{monthlyScores[bestMonthIdx]}%</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">{t.qol.trendWorstMonth}</div>
                        <div className="text-sm text-gray-300">{monthNames[worstMonthIdx]}</div>
                        <div className={`text-xl font-bold ${getScoreColor(monthlyScores[worstMonthIdx])}`}>{monthlyScores[worstMonthIdx]}%</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3 flex items-center gap-2">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Tendencia</div>
                        <div className="flex items-center gap-1">
                            {getTrendIcon()}
                            <span className="text-sm font-medium text-gray-300">{getTrendLabel()}</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Bar Chart */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" />
                        {t.qol.trendSubtitle}
                    </h4>

                    <div className="flex items-end justify-between h-48 gap-1 px-2 pb-2 overflow-x-auto">
                        {monthlyScores.map((score, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center flex-1 min-w-[32px]"
                                title={`${monthNames[idx]}: ${score}%`}
                            >
                                <div
                                    className={`w-full transition-all duration-300 rounded-t ${getScoreColor(score).replace('text', 'bg')}`}
                                    style={{ height: `${getBarHeight(score)}px` }}
                                ></div>
                                <span className="text-[10px] text-gray-400 mt-1">{monthNames[idx]}</span>
                                <span className={`text-[10px] font-mono ${getScoreColor(score)}`}>{score}%</span>
                            </div>
                        ))}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between px-2 text-[10px] text-gray-500">
                        {monthNames.map((name, idx) => (
                            <div key={idx} className="w-[32px] text-center">{name}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QualityOfLifeTrend;