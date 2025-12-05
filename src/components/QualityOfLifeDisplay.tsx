import React, { useMemo } from 'react';
import { Scenario, AnalysisResult } from '../types';
import { calculateQualityOfLifeScore, detectCriticalPeriods } from '../utils/qualityOfLife';
import { Heart, TrendingUp, AlertTriangle, Award } from 'lucide-react';

interface QualityOfLifeDisplayProps {
    scenario: Scenario;
    analysis: AnalysisResult;
    year?: number;
}

const QualityOfLifeDisplay: React.FC<QualityOfLifeDisplayProps> = ({ scenario, analysis, year = new Date().getFullYear() }) => {
    const qolScore = useMemo(() => {
        return calculateQualityOfLifeScore(scenario, analysis, year);
    }, [scenario, analysis, year]);

    const criticalPeriods = useMemo(() => {
        return detectCriticalPeriods(scenario, year);
    }, [scenario, year]);

    // Grade color mapping
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

    // Progress bar color based on score
    const getProgressColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-blue-500';
        if (score >= 40) return 'bg-yellow-500';
        if (score >= 20) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'border-red-600 bg-red-900/20';
            case 'medium':
                return 'border-orange-600 bg-orange-900/20';
            case 'low':
                return 'border-yellow-600 bg-yellow-900/20';
            default:
                return 'border-gray-600 bg-gray-900/20';
        }
    };

    return (
        <div className="space-y-6 mb-6">
            {/* Quality of Life Score Card */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <h3 className="text-lg font-semibold text-white">Score de Qualidade de Vida - {scenario.name}</h3>
                </div>

                <div className="p-6">
                    {/* Overall Score */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${getGradeColor(qolScore.grade)}`}>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{qolScore.grade}</div>
                                    <div className="text-xs opacity-75">{qolScore.overall}%</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{qolScore.overall}%</div>
                                <div className="text-sm text-gray-400">Pontuação Geral</div>
                            </div>
                        </div>

                        <div className="text-right">
                            <Award className="w-12 h-12 text-yellow-400 mb-2 inline-block" />
                            <div className="text-sm text-gray-400">
                                {qolScore.grade === 'A+' && 'Excelente!'}
                                {qolScore.grade === 'A' && 'Muito Bom'}
                                {qolScore.grade === 'B' && 'Bom'}
                                {qolScore.grade === 'C' && 'Aceitável'}
                                {qolScore.grade === 'D' && 'Necessita Melhoria'}
                                {qolScore.grade === 'F' && 'Crítico'}
                            </div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Análise Detalhada
                        </h4>

                        {Object.entries(qolScore.breakdown).map(([key, value]) => {
                            const labels: { [key: string]: string } = {
                                weekendsCoverage: 'Cobertura de Fins de Semana',
                                workLifeBalance: 'Equilíbrio Trabalho-Vida',
                                consecutiveRest: 'Qualidade do Descanso',
                                nightShiftImpact: 'Impacto de Turnos Noturnos',
                                holidaysCoverage: 'Cobertura de Feriados',
                            };

                            return (
                                <div key={key} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">{labels[key]}</span>
                                        <span className="text-gray-400 font-mono">{value}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getProgressColor(value)} transition-all duration-500`}
                                            style={{ width: `${value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Insights */}
                    <div className="mt-6 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-300">Observações</h4>
                        {qolScore.insights.map((insight, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded text-sm ${insight.startsWith('✅')
                                    ? 'bg-green-900/30 text-green-300'
                                    : 'bg-yellow-900/30 text-yellow-300'
                                    }`}
                            >
                                {insight}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Critical Periods */}
            {criticalPeriods.length > 0 && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <h3 className="text-lg font-semibold text-white">Períodos Críticos Identificados</h3>
                        <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            {criticalPeriods.length}
                        </span>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {criticalPeriods.map((period, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg border ${getSeverityColor(period.severity)}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex flex-col gap-2 mb-2">
                                            <span
                                                className={`text-xs font-bold px-2 py-0.5 rounded uppercase self-start ${period.severity === 'high'
                                                    ? 'bg-red-600 text-white'
                                                    : period.severity === 'medium'
                                                        ? 'bg-orange-600 text-white'
                                                        : 'bg-yellow-600 text-white'
                                                    }`}
                                            >
                                                {period.severity === 'high' ? 'Crítica' : period.severity === 'medium' ? 'Média' : 'Baixa'}
                                            </span>
                                            <span className="text-sm font-semibold text-white leading-tight">{period.description}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {period.startDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'numeric' })} a{' '}
                                            {period.endDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="text-right pl-2">
                                        <div className="text-xl font-bold text-white">{period.daysAffected}</div>
                                        <div className="text-[10px] text-gray-400 uppercase">dias</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QualityOfLifeDisplay;
