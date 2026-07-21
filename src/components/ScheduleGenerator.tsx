import React, { useState, useEffect, useRef } from 'react';
import { ScheduleGenerator, GeneratedSchedule, GeneratorConstraints } from '../utils/scheduleGenerator';
import { PresetScenario } from '../data/presetScenarios';
import { Settings, Zap, Target, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';

interface ScheduleGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectScenario: (scenario: PresetScenario) => void;
}

const SCENARIO_NAMES = [
    "Aurora", "Zenith", "Horizonte", "Mare Viva", "Equinocio",
    "Solsticio", "Pulsar", "Orbita", "Crono", "Vertice",
    "Meridiano", "Brisa", "Eclipse", "Nebula", "Spectra",
    "Quantum", "Fluxo", "Delta", "Sigma", "Polaris"
];

const SHIFT_COLORS: Record<string, string> = {
    M: 'bg-blue-500 text-white',
    T: 'bg-amber-500 text-white',
    N: 'bg-purple-500 text-white',
    F: 'bg-gray-600 text-gray-300',
};

const generateCreativeName = (idx: number, cycle: number) => {
    const base = SCENARIO_NAMES[idx % SCENARIO_NAMES.length];
    const suffix = Math.floor(idx / SCENARIO_NAMES.length) + 1;
    return `${base} ${suffix > 1 ? suffix : ''} (${cycle}d)`;
};

const calculateWeeklyHours = (pattern: string, shiftDuration: number): { avgHours: number; difference: number } => {
    const workDays = pattern.split('').filter(c => c !== 'F').length;
    const totalDays = pattern.length;
    const weeksInCycle = totalDays / 7;
    const avgHours = (workDays * shiftDuration) / weeksInCycle;
    const weeklyHoursContract = 37.5;
    const difference = avgHours - weeklyHoursContract;
    return { avgHours, difference };
};

const GeneratorUI: React.FC<ScheduleGeneratorProps> = ({ isOpen, onClose, onSelectScenario }) => {
    const [constraints, setConstraints] = useState<GeneratorConstraints>({
        teams: 5,
        maxConsecutiveWork: 6,
        maxConsecutiveOff: 5,
        minBlockSize: 2
    });
    const [shiftDuration, setShiftDuration] = useState(8.75);
    const [weeklyHoursTarget, setWeeklyHoursTarget] = useState(37.5);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [results, setResults] = useState<GeneratedSchedule[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const generatorRef = useRef<ScheduleGenerator | null>(null);

    useEffect(() => {
        return () => {
            if (generatorRef.current) generatorRef.current.cancel();
        };
    }, []);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setResults([]);
        setSelectedIdx(null);

        if (generatorRef.current) generatorRef.current.cancel();
        generatorRef.current = new ScheduleGenerator(constraints);

        try {
            const patterns = await generatorRef.current.generate([5, 6]);
            setResults(patterns);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelect = (result: GeneratedSchedule, index: number) => {
        const L = result.cycleLength;
        const creativeName = generateCreativeName(index, L);
        const offsetStep = L / constraints.teams;
        const teamPatterns: string[] = [];

        for (let i = 0; i < constraints.teams; i++) {
            const offset = i * offsetStep;
            let p = '';
            for (let d = 0; d < L; d++) {
                p += result.pattern[(d + offset) % L];
            }
            teamPatterns.push(p);
        }

        const newScenario: PresetScenario = {
            name: creativeName,
            description: `${constraints.teams} Equipas, Ciclo ${L} dias. Gerado automaticamente.`,
            teams: constraints.teams,
            shiftDuration,
            weeklyHoursContract: weeklyHoursTarget,
            pattern: result.pattern,
            startDate: new Date().toISOString().split('T')[0],
            teamPatterns: teamPatterns
        };

        onSelectScenario(newScenario);
        onClose();
    };

    const getScoreColor = (score: number) => {
        if (score < 10) return 'text-green-400';
        if (score < 20) return 'text-blue-400';
        if (score < 30) return 'text-amber-400';
        return 'text-red-400';
    };

    const getScoreLabel = (score: number) => {
        if (score < 10) return 'Excelente';
        if (score < 20) return 'Muito Bom';
        if (score < 30) return 'Bom';
        return 'Razoavel';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 md:p-4 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col text-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Gerador de Horarios Avancado</h2>
                            <p className="text-sm text-gray-400">{constraints.teams} equipas, {shiftDuration}h/turno, alvo {weeklyHoursTarget}h/sem</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                        aria-label="Fechar gerador"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    <div className="w-full lg:w-96 bg-gray-900 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-800 overflow-y-auto shrink-0">
                        <div className="mb-4 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Settings className="h-3 w-3" />
                                Configuracao
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Numero de Equipas</label>
                                    <input
                                        type="range"
                                        min="2"
                                        max="10"
                                        step="1"
                                        value={constraints.teams}
                                        onChange={e => setConstraints({ ...constraints, teams: parseInt(e.target.value) })}
                                        className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>2</span>
                                        <span className="text-white font-bold">{constraints.teams}</span>
                                        <span>10</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Duracao Turno (horas)</label>
                                    <input
                                        type="number"
                                        value={shiftDuration}
                                        onChange={e => setShiftDuration(Math.max(4, Math.min(12, parseFloat(e.target.value) || 8)))}
                                        step="0.25"
                                        min="4"
                                        max="12"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Alvo Horas Semanais</label>
                                    <input
                                        type="number"
                                        value={weeklyHoursTarget}
                                        onChange={e => setWeeklyHoursTarget(Math.max(20, Math.min(50, parseFloat(e.target.value) || 37.5)))}
                                        step="0.5"
                                        min="20"
                                        max="50"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center justify-between w-full text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 hover:text-gray-300"
                        >
                            <span>Preferencias Avancadas</span>
                            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {showAdvanced && (
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Max. Dias Trabalho Seguidos
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range" min="4" max="8" step="1"
                                            value={constraints.maxConsecutiveWork}
                                            onChange={(e) => setConstraints({ ...constraints, maxConsecutiveWork: parseInt(e.target.value) })}
                                            className="flex-1 accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-xl font-bold text-white w-8 text-center">{constraints.maxConsecutiveWork}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Max. Folgas Seguidas
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range" min="2" max="7" step="1"
                                            value={constraints.maxConsecutiveOff}
                                            onChange={(e) => setConstraints({ ...constraints, maxConsecutiveOff: parseInt(e.target.value) })}
                                            className="flex-1 accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-xl font-bold text-white w-8 text-center">{constraints.maxConsecutiveOff}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Tamanho Min. Blocos
                                    </label>
                                    <div className="text-xs text-gray-500 mb-2">Evitar dias isolados (ex: Tarde-Folga-Tarde)</div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range" min="1" max="4" step="1"
                                            value={constraints.minBlockSize}
                                            onChange={(e) => setConstraints({ ...constraints, minBlockSize: parseInt(e.target.value) })}
                                            className="flex-1 accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-xl font-bold text-white w-8 text-center">{constraints.minBlockSize}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className={clsx(
                                'w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2',
                                isGenerating
                                    ? 'bg-gray-700 cursor-wait opacity-50'
                                    : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                            )}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                    A Gerar...
                                </>
                            ) : (
                                <>
                                    <Zap className="h-4 w-4" />
                                    Gerar Opcoes
                                </>
                            )}
                        </button>

                        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Target className="h-3 w-3" />
                                Metricas Alvo
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Cobertura:</span>
                                    <span className="text-green-400 font-mono">24h</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Turno:</span>
                                    <span className="text-white font-mono">{shiftDuration}h</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Alvo:</span>
                                    <span className="text-white font-mono">{weeklyHoursTarget}h/sem</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Equipas:</span>
                                    <span className="text-white font-mono">{constraints.teams}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-800/50 p-4 lg:p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                Resultados
                                {results.length > 0 && (
                                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {results.length}
                                    </span>
                                )}
                            </h3>
                        </div>

                        {results.length === 0 && !isGenerating && (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
                                <Calendar className="h-12 w-12 mb-4 text-gray-600" />
                                <p className="text-sm">Define as preferencias e clica em "Gerar"</p>
                                <p className="text-xs text-gray-600 mt-1">Serao encontrados padroes otimizados</p>
                            </div>
                        )}

                        {isGenerating && results.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-blue-400">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                                <p className="text-sm">A procurar padroes matematicos...</p>
                                <p className="text-xs text-gray-500 mt-1">Isto pode demorar alguns segundos</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {results.map((res, idx) => {
                                const { avgHours, difference } = calculateWeeklyHours(res.pattern, shiftDuration);
                                const isSelected = selectedIdx === idx;

                                return (
                                    <div
                                        key={idx}
                                        className={clsx(
                                            'bg-gray-800 border rounded-lg p-4 transition-all cursor-pointer',
                                            isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-700 hover:border-gray-600'
                                        )}
                                        onClick={() => setSelectedIdx(isSelected ? null : idx)}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h4 className="font-bold text-blue-400 text-sm">
                                                        {generateCreativeName(idx, res.cycleLength)}
                                                    </h4>
                                                    <span className={clsx('text-xs px-2 py-0.5 rounded font-medium', getScoreColor(res.score))}>
                                                        {getScoreLabel(res.score)}
                                                    </span>
                                                    <span className="bg-purple-900/50 text-purple-200 text-xs px-2 py-0.5 rounded border border-purple-800">
                                                        24h
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-0.5 mt-2">
                                                    {res.pattern.split('').map((char, i) => (
                                                        <div
                                                            key={i}
                                                            className={clsx(
                                                                'w-5 h-5 rounded text-[9px] flex items-center justify-center font-bold',
                                                                SHIFT_COLORS[char] || 'bg-gray-700'
                                                            )}
                                                            title={`Dia ${i + 1}: ${char === 'M' ? 'Manha' : char === 'T' ? 'Tarde' : char === 'N' ? 'Noite' : 'Folga'}`}
                                                        >
                                                            {char}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleSelect(res, idx); }}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors ml-4"
                                            >
                                                Usar
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs border-t border-gray-700 pt-3 mt-2">
                                            <div className="bg-gray-700/50 rounded p-2">
                                                <span className="block text-gray-400 text-[10px]">Media Trabalho</span>
                                                <span className="font-mono text-white text-sm">{res.quality.avgWorkBlock.toFixed(1)} dias</span>
                                            </div>
                                            <div className="bg-gray-700/50 rounded p-2">
                                                <span className="block text-gray-400 text-[10px]">Media Folga</span>
                                                <span className="font-mono text-white text-sm">{res.quality.avgOffBlock.toFixed(1)} dias</span>
                                            </div>
                                            <div className="bg-gray-700/50 rounded p-2">
                                                <span className="block text-gray-400 text-[10px]">Turnos Isolados</span>
                                                <span className={clsx('font-mono text-sm', res.quality.isolatedShifts > 0 ? 'text-amber-400' : 'text-green-400')}>
                                                    {res.quality.isolatedShifts}
                                                </span>
                                            </div>
                                            <div className="bg-gray-700/50 rounded p-2">
                                                <span className="block text-gray-400 text-[10px]">Media Semanal</span>
                                                <span className="font-mono text-sm">
                                                    <span className="text-blue-300">{avgHours.toFixed(1)}h</span>
                                                    <span className={clsx('text-[10px] ml-1', Math.abs(difference) <= 0.5 ? 'text-green-400' : 'text-gray-500')}>
                                                        ({difference >= 0 ? '+' : ''}{difference.toFixed(1)}h)
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <div className="mt-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                                                <div className="grid grid-cols-3 gap-4 text-xs">
                                                    <div>
                                                        <span className="block text-gray-400 mb-1">Ciclo</span>
                                                        <span className="text-white font-bold">{res.cycleLength} dias</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-400 mb-1">Dias Trabalho/Ciclo</span>
                                                        <span className="text-white font-bold">{res.pattern.split('').filter(c => c !== 'F').length}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-400 mb-1">Folgas/Ciclo</span>
                                                        <span className="text-white font-bold">{res.pattern.split('').filter(c => c === 'F').length}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-gray-400 text-xs">Padrao:</span>
                                                    <code className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">{res.pattern}</code>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneratorUI;