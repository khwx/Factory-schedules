import React, { useState, useMemo } from 'react';
import { X, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { useI18n } from '../i18n';

interface ParsedScenario {
    name: string;
    teams: number;
    shiftDuration: number;
    weeklyHoursContract?: number;
    pattern: string;
    teamPatterns?: string[];
    startDate?: string;
    description?: string;
    isValid: boolean;
    errors: string[];
}

interface ImportPreviewProps {
    scenarios: ParsedScenario[];
    onConfirm: (selected: ParsedScenario[]) => void;
    onCancel: () => void;
}

function validateScenario(s: Record<string, unknown>): ParsedScenario {
    const errors: string[] = [];
    const name = typeof s.name === 'string' ? s.name : '';
    const teams = typeof s.teams === 'number' ? s.teams : 0;
    const shiftDuration = typeof s.shiftDuration === 'number' ? s.shiftDuration : 0;
    const weeklyHoursContract = typeof s.weeklyHoursContract === 'number' ? s.weeklyHoursContract : undefined;
    const pattern = typeof s.pattern === 'string' ? s.pattern : '';
    const teamPatterns = Array.isArray(s.teamPatterns) ? s.teamPatterns as string[] : undefined;
    const startDate = typeof s.startDate === 'string' ? s.startDate : undefined;
    const description = typeof s.description === 'string' ? s.description : undefined;

    if (!name.trim()) errors.push('Nome obrigatorio');
    if (teams < 1 || teams > 10) errors.push(`Equipas invalido: ${teams} (1-10)`);
    if (shiftDuration < 1 || shiftDuration > 12) errors.push(`Duracao invalida: ${shiftDuration}h (1-12)`);
    if (!pattern || !/^[MTNF]{5,60}$/i.test(pattern)) errors.push(`Padrao invalido: "${pattern}"`);

    if (teamPatterns) {
        teamPatterns.forEach((tp, i) => {
            if (!/^[MTNF]{5,60}$/i.test(tp)) {
                errors.push(`Padrao equipa ${i + 1} invalido: "${tp}"`);
            }
        });
    }

    return {
        name: name.trim(),
        teams,
        shiftDuration,
        weeklyHoursContract,
        pattern: pattern.toUpperCase(),
        teamPatterns: teamPatterns?.map(tp => tp.toUpperCase()),
        startDate,
        description,
        isValid: errors.length === 0,
        errors,
    };
}

function parseImportData(data: unknown): ParsedScenario[] {
    if (!data || typeof data !== 'object') return [];

    const obj = data as Record<string, unknown>;
    let scenarios: unknown[] = [];

    if (Array.isArray(obj.scenarios)) {
        scenarios = obj.scenarios;
    } else if (Array.isArray(obj)) {
        scenarios = obj;
    } else {
        return [];
    }

    return scenarios.map((s, i) => {
        if (s && typeof s === 'object') {
            return validateScenario(s as Record<string, unknown>);
        }
        return {
            name: `Cenario ${i + 1}`,
            teams: 0,
            shiftDuration: 0,
            pattern: '',
            isValid: false,
            errors: ['Formato invalido'],
        };
    });
}

const ImportPreview: React.FC<ImportPreviewProps> = ({ scenarios, onConfirm, onCancel }) => {
    const { lang } = useI18n();
    const [selected, setSelected] = useState<Set<number>>(
        () => new Set(scenarios.map((_, i) => i).filter(i => scenarios[i].isValid))
    );

    const validCount = useMemo(() => scenarios.filter(s => s.isValid).length, [scenarios]);
    const invalidCount = scenarios.length - validCount;

    const toggleSelect = (index: number) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const toggleAll = () => {
        if (selected.size === validCount) {
            setSelected(new Set());
        } else {
            setSelected(new Set(scenarios.map((_, i) => i).filter(i => scenarios[i].isValid)));
        }
    };

    const handleConfirm = () => {
        const selectedScenarios = scenarios.filter((_, i) => selected.has(i));
        onConfirm(selectedScenarios);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">
                        {lang === 'pt' ? 'Pre-visualizacao de Importacao' : 'Import Preview'}
                    </h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white" aria-label="Fechar">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-700 bg-gray-750 flex gap-4 text-sm">
                    <span className="text-gray-300">
                        {lang === 'pt' ? 'Total:' : 'Total:'} <strong className="text-white">{scenarios.length}</strong>
                    </span>
                    {validCount > 0 && (
                        <span className="text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {validCount} {lang === 'pt' ? 'validos' : 'valid'}
                        </span>
                    )}
                    {invalidCount > 0 && (
                        <span className="text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            {invalidCount} {lang === 'pt' ? 'invalidos' : 'invalid'}
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {scenarios.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            {lang === 'pt' ? 'Nenhum cenario encontrado no ficheiro.' : 'No scenarios found in file.'}
                        </p>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="checkbox"
                                    checked={selected.size === validCount && validCount > 0}
                                    onChange={toggleAll}
                                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                    aria-label={lang === 'pt' ? 'Selecionar todos validos' : 'Select all valid'}
                                />
                                <span className="text-sm text-gray-400">
                                    {lang === 'pt' ? 'Selecionar todos validos' : 'Select all valid'}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {scenarios.map((s, i) => (
                                    <div
                                        key={i}
                                        className={`p-3 rounded-lg border transition-colors ${
                                            s.isValid
                                                ? selected.has(i)
                                                    ? 'border-blue-500 bg-blue-500/10'
                                                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                                                : 'border-red-500/30 bg-red-500/5'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {s.isValid && (
                                                <input
                                                    type="checkbox"
                                                    checked={selected.has(i)}
                                                    onChange={() => toggleSelect(i)}
                                                    className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${s.isValid ? 'text-white' : 'text-red-400'}`}>
                                                        {s.name || `Cenario ${i + 1}`}
                                                    </span>
                                                    {!s.isValid && (
                                                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-400 mt-1">
                                                    {s.teams > 0 && <span>{s.teams} equipas</span>}
                                                    {s.shiftDuration > 0 && <span> &bull; {s.shiftDuration}h</span>}
                                                    {s.pattern && <span> &bull; {s.pattern}</span>}
                                                </div>
                                                {s.description && (
                                                    <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                                                )}
                                                {s.errors.length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        {s.errors.map((err, j) => (
                                                            <p key={j} className="text-xs text-red-400 flex items-center gap-1">
                                                                <span className="w-1 h-1 bg-red-400 rounded-full flex-shrink-0" />
                                                                {err}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                    >
                        {lang === 'pt' ? 'Cancelar' : 'Cancel'}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={selected.size === 0}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />
                        {lang === 'pt' ? `Importar ${selected.size} cenario${selected.size !== 1 ? 's' : ''}` : `Import ${selected.size} scenario${selected.size !== 1 ? 's' : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export { parseImportData };
export default ImportPreview;
