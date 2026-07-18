import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { Scenario } from '../types';
import { optimizeSchedule, type OptimizationResult } from '../utils/scheduleOptimizer';
import { Brain, CheckCircle, AlertTriangle, XCircle, Lightbulb, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

const STATUS_COLORS = {
    good: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: AlertTriangle },
    bad: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: XCircle },
};

const IMPACT_COLORS = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200',
};

const CATEGORY_LABELS: Record<string, { pt: string; en: string }> = {
    balance: { pt: 'Equilibrio', en: 'Balance' },
    compliance: { pt: 'Conformidade', en: 'Compliance' },
    comfort: { pt: 'Conforto', en: 'Comfort' },
    efficiency: { pt: 'Eficiencia', en: 'Efficiency' },
};

function ScoreGauge({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-1000"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color }}>{score}</span>
                <span className="text-[10px] text-gray-400">/ 100</span>
            </div>
        </div>
    );
}

export default function ScheduleOptimizer() {
    const { lang } = useI18n();
    const [selectedId, setSelectedId] = useState('');
    const [showAlternatives, setShowAlternatives] = useState(false);

    const scenarios = useMemo(() => {
        try {
            const saved = localStorage.getItem('shiftsim_scenarios');
            if (saved) return JSON.parse(saved) as Scenario[];
        } catch { /* ignore */ }
        return [];
    }, []);

    const activeId = selectedId || (scenarios.length > 0 ? scenarios[0].id : '');
    const scenario = scenarios.find(s => s.id === activeId);

    const result = useMemo<OptimizationResult | null>(() => {
        if (!scenario) return null;
        return optimizeSchedule(scenario);
    }, [scenario]);

    if (!scenario || !result) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Otimizador de Escalas</h2>
                    <p className="text-gray-500">Crie ou selecione um cenario para otimizar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Brain className="h-6 w-6 text-purple-600" />
                        {lang === 'pt' ? 'Otimizador de Escalas' : 'Schedule Optimizer'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {lang === 'pt' ? 'Analise e melhore o seu cenario de turnos' : 'Analyze and improve your shift scenario'}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 no-print">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cenario</label>
                <select
                    value={activeId}
                    onChange={e => setSelectedId(e.target.value)}
                    className="w-full md:w-96 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                    {scenarios.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                        {lang === 'pt' ? 'Pontuacao Global' : 'Overall Score'}
                    </h3>
                    <ScoreGauge score={result.score} />
                    <p className="mt-3 text-sm text-gray-600 text-center">
                        {result.score >= 75
                            ? (lang === 'pt' ? 'Cenario bem equilibrado' : 'Well-balanced scenario')
                            : result.score >= 50
                                ? (lang === 'pt' ? 'Cenario com margem de melhoria' : 'Room for improvement')
                                : (lang === 'pt' ? 'Cenario precisa de atencao' : 'Needs attention')
                        }
                    </p>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                        {lang === 'pt' ? 'Constraintes' : 'Constraints'}
                    </h3>
                    <div className="space-y-3">
                        {result.constraints.map(c => {
                            const style = STATUS_COLORS[c.status];
                            const Icon = style.icon;
                            return (
                                <div key={c.id} className={clsx('flex items-center gap-3 p-3 rounded-lg border', style.bg, style.border)}>
                                    <Icon className={clsx('h-5 w-5 flex-shrink-0', style.text)} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-800 text-sm">
                                                {lang === 'pt' ? c.name : c.nameEn}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {c.current} / {c.target}
                                            </span>
                                        </div>
                                        <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={clsx('h-full rounded-full transition-all', {
                                                    'bg-emerald-500': c.status === 'good',
                                                    'bg-amber-500': c.status === 'warning',
                                                    'bg-red-500': c.status === 'bad',
                                                })}
                                                style={{ width: `${Math.min(100, (c.current / c.target) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    {lang === 'pt' ? 'Sugestoes de Melhoria' : 'Improvement Suggestions'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.suggestions.map(s => (
                        <div key={s.id} className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-medium text-gray-800 text-sm">
                                    {lang === 'pt' ? s.title : s.titleEn}
                                </h4>
                                <span className={clsx('text-[10px] px-2 py-0.5 rounded-full border font-medium', IMPACT_COLORS[s.impact])}>
                                    {s.impact === 'high' ? (lang === 'pt' ? 'Alto' : 'High') : s.impact === 'medium' ? (lang === 'pt' ? 'Medio' : 'Medium') : (lang === 'pt' ? 'Baixo' : 'Low')}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                                {lang === 'pt' ? s.description : s.descriptionEn}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className={clsx('text-[10px] px-2 py-0.5 rounded-full',
                                    CATEGORY_LABELS[s.category]?.pt ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'
                                )}>
                                    {lang === 'pt' ? CATEGORY_LABELS[s.category]?.pt : CATEGORY_LABELS[s.category]?.en}
                                </span>
                                {s.scoreImprovement > 0 && (
                                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                                        <Zap className="h-3 w-3" />
                                        +{s.scoreImprovement} pts
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <button
                    onClick={() => setShowAlternatives(!showAlternatives)}
                    className="flex items-center justify-between w-full"
                >
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-blue-500" />
                        {lang === 'pt' ? 'Padroes Alternativos Recomendados' : 'Recommended Alternative Patterns'}
                    </h3>
                    <ArrowRight className={clsx('h-4 w-4 text-gray-400 transition-transform', showAlternatives && 'rotate-90')} />
                </button>

                {showAlternatives && (
                    <div className="mt-4 space-y-3">
                        {result.alternativePatterns.map((alt, i) => (
                            <div key={alt.pattern} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                <div className={clsx(
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                                    i === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                                )}>
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{alt.pattern}</code>
                                        <span className="text-xs text-gray-500">
                                            {lang === 'pt' ? alt.description : alt.descriptionEn}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={clsx(
                                        'text-lg font-bold',
                                        alt.score >= 75 ? 'text-emerald-600' : alt.score >= 50 ? 'text-amber-600' : 'text-red-600'
                                    )}>
                                        {alt.score}
                                    </div>
                                    <div className="text-[10px] text-gray-400">pts</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
