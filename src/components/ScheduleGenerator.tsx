import React, { useState, useEffect, useRef } from 'react';
import { ScheduleGenerator, GeneratedSchedule, GeneratorConstraints } from '../utils/scheduleGenerator';
import { PresetScenario } from '../data/presetScenarios';

interface ScheduleGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectScenario: (scenario: PresetScenario) => void;
}

// Creative names for schedules
const SCENARIO_NAMES = [
    "Aurora", "Zenith", "Horizonte", "Maré Viva", "Equinócio",
    "Solstício", "Pulsar", "Órbita", "Crono", "Vértice",
    "Meridiano", "Brisa", "Eclipse", "Nebula", "Spectra",
    "Quantum", "Fluxo", "Delta", "Sigma", "Polaris"
];

const generateCreativeName = (idx: number, cycle: number) => {
    // Deterministic name based on index to keep it consistent during re-renders if needed
    const base = SCENARIO_NAMES[idx % SCENARIO_NAMES.length];
    const suffix = Math.floor(idx / SCENARIO_NAMES.length) + 1;
    return `${base} ${suffix > 1 ? suffix : ''} (${cycle}d)`;
};

const GeneratorUI: React.FC<ScheduleGeneratorProps> = ({ isOpen, onClose, onSelectScenario }) => {
    // ... existing state ...
    const [constraints, setConstraints] = useState<GeneratorConstraints>({
        teams: 5,
        maxConsecutiveWork: 6,
        maxConsecutiveOff: 5,
        minBlockSize: 2
    });
    const [results, setResults] = useState<GeneratedSchedule[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const generatorRef = useRef<ScheduleGenerator | null>(null);

    useEffect(() => {
        return () => {
            if (generatorRef.current) generatorRef.current.cancel();
        };
    }, []);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setResults([]);

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
        const offsetStep = L / 5;
        const teamPatterns: string[] = [];

        for (let i = 0; i < 5; i++) {
            const offset = i * offsetStep;
            let p = '';
            for (let d = 0; d < L; d++) {
                p += result.pattern[(d + offset) % L];
            }
            teamPatterns.push(p);
        }

        const newScenario: PresetScenario = {
            name: creativeName,
            description: `5 Equipas, Ciclo ${L} dias. Gerado automaticamente.`,
            teams: 5,
            shiftDuration: 8.75,
            weeklyHoursContract: 37.5,
            pattern: result.pattern,
            startDate: new Date().toISOString().split('T')[0],
            teamPatterns: teamPatterns
        };

        onSelectScenario(newScenario);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-gray-100 overflow-hidden">
                {/* Header and Left Panel unchanged ... */}
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800">
                    <div>
                        <h2 className="text-xl font-bold text-white">Gerador de Horários</h2>
                        <p className="text-sm text-gray-400">Opções geradas para 5 equipas com cobertura total 24h</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    <div className="w-full lg:w-80 bg-gray-900 p-6 border-b lg:border-b-0 lg:border-r border-gray-800 overflow-y-auto shrink-0">
                        <div className="mb-6 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Regras Base (Fixas)</h4>
                            <ul className="text-xs text-gray-300 space-y-1.5">
                                <li className="flex justify-between"><span>Equipas:</span> <span className="text-white font-mono">5</span></li>
                                <li className="flex justify-between"><span>Cobertura:</span> <span className="text-green-400">24h (1M + 1T + 1N)</span></li>
                                <li className="flex justify-between"><span>Duração Turno:</span> <span className="text-white font-mono">8h45 (8.75h)</span></li>
                                <li className="flex justify-between"><span>Alvo Semanal:</span> <span className="text-white font-mono">37.5h</span></li>
                            </ul>
                        </div>

                        <h3 className="font-semibold text-gray-300 mb-4 uppercase text-xs tracking-wider">Preferências Ajustáveis</h3>
                        {/* Settings inputs unchanged ... (Only need to verify existing inputs are kept or use broader match if I am replacing the whole component logic block) */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Max. Dias Trabalho Seguidos</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range" min="4" max="6" step="1"
                                        value={constraints.maxConsecutiveWork}
                                        onChange={(e) => setConstraints({ ...constraints, maxConsecutiveWork: parseInt(e.target.value) })}
                                        className="flex-1 accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-xl font-bold text-white w-8 text-center">{constraints.maxConsecutiveWork}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Max. Folgas Seguidas</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range" min="2" max="5" step="1"
                                        value={constraints.maxConsecutiveOff}
                                        onChange={(e) => setConstraints({ ...constraints, maxConsecutiveOff: parseInt(e.target.value) })}
                                        className="flex-1 accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-xl font-bold text-white w-8 text-center">{constraints.maxConsecutiveOff}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Tamanho Mín. Blocos</label>
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

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform active:scale-95 ${isGenerating
                                    ? 'bg-gray-700 cursor-wait opacity-50'
                                    : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                                    }`}
                            >
                                {isGenerating ? 'A Gerar...' : 'Gerar Opções'}
                            </button>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="flex-1 bg-gray-800/50 p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-white">Resultados Encontrados ({results.length})</h3>
                        </div>

                        {results.length === 0 && !isGenerating && (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
                                <span className="text-4xl mb-4">⚙️</span>
                                <p>Define as regras e clica em "Gerar"</p>
                            </div>
                        )}

                        {isGenerating && results.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-blue-400">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                                <p>À procura de padrões matemáticos...</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            {results.map((res, idx) => (
                                <div key={idx} className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-blue-400 text-sm">
                                                    {generateCreativeName(idx, res.cycleLength)}
                                                </h4>
                                                <span className="bg-purple-900/50 text-purple-200 text-xs px-2 py-0.5 rounded border border-purple-800 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                                    24h
                                                </span>
                                                {res.score < 10 && (
                                                    <span className="bg-green-900/50 text-green-200 text-xs px-2 py-0.5 rounded border border-green-800">
                                                        Excelente
                                                    </span>
                                                )}
                                            </div>
                                            <div className="font-mono text-sm tracking-widest text-gray-300 break-all">
                                                {res.pattern}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSelect(res, idx)}
                                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            Usar Este
                                        </button>
                                    </div>

                                    <div className="flex gap-4 text-xs text-gray-500 border-t border-gray-700 pt-3 mt-2">
                                        <div>
                                            <span className="block text-gray-400">Média Trabalho</span>
                                            <span className="font-mono text-white">{res.quality.avgWorkBlock.toFixed(1)} dias</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400">Média Folga</span>
                                            <span className="font-mono text-white">{res.quality.avgOffBlock.toFixed(1)} dias</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400">Turnos Isolados</span>
                                            <span className={`font-mono ${res.quality.isolatedShifts > 0 ? 'text-yellow-500' : 'text-green-400'}`}>
                                                {res.quality.isolatedShifts}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400">Média Semanal</span>
                                            <span className="font-mono text-blue-300">
                                                36.8h <span className="text-[10px] text-gray-500">(-0.7h)</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneratorUI;
