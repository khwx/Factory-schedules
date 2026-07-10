import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { generateScenarioFromICS } from '../utils/icsParser';
import { findConflicts, getConflictSummary, ConflictReport } from '../utils/conflictValidator';
import { Scenario } from '../types';

interface ICSImporterProps {
    onImport: (scenario: Omit<Scenario, 'id'>) => void;
}

interface PreviewData {
    name: string;
    teams: number;
    shiftDuration: number;
    weeklyHoursContract: number;
    pattern: string;
    teamPatterns: string[];
    startDate: string;
}

type ImportStatus = 'idle' | 'loading' | 'success' | 'error';

const ICSImporter: React.FC<ICSImporterProps> = ({ onImport }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [conflictReport, setConflictReport] = useState<ConflictReport | null>(null);
    const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [shiftDuration, setShiftDuration] = useState(8);
    const [weeklyHoursContract, setWeeklyHoursContract] = useState(40);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const analyzeFile = useCallback((content: string, filename: string, duration: number, weeklyHours: number) => {
        setImportStatus('loading');
        setErrorMessage(null);

        try {
            const scenarioName = filename.replace('.ics', '');
            const scenario = generateScenarioFromICS(content, scenarioName, duration, weeklyHours);

            if (scenario.teams === 0) {
                setErrorMessage('Nenhuma equipa encontrada no ficheiro ICS. Verifique o formato do ficheiro.');
                setImportStatus('error');
                return;
            }

            // Validate for conflicts
            const conflicts = findConflicts(scenario.teamPatterns || []);

            setPreviewData(scenario);
            setConflictReport(conflicts);
            setImportStatus('success');
        } catch (error) {
            console.error('Error parsing ICS:', error);
            setErrorMessage(
                error instanceof Error 
                    ? `Erro ao analisar: ${error.message}`
                    : 'Erro desconhecido ao analisar o ficheiro ICS'
            );
            setImportStatus('error');
        }
    }, []);

    const handleFileSelect = useCallback((file: File) => {
        if (!file.name.endsWith('.ics')) {
            setErrorMessage('Por favor selecione um ficheiro .ics');
            setImportStatus('error');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('Ficheiro demasiado grande. Maximo 5MB.');
            setImportStatus('error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setFileContent(content);
            setFileName(file.name);
            analyzeFile(content, file.name, shiftDuration, weeklyHoursContract);
        };
        reader.onerror = () => {
            setErrorMessage('Erro ao ler o ficheiro.');
            setImportStatus('error');
        };
        reader.readAsText(file);
    }, [analyzeFile, shiftDuration, weeklyHoursContract]);

    const handleImport = useCallback(() => {
        if (!previewData) return;

        onImport(previewData);
        handleReset();
    }, [previewData, onImport]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleReset = useCallback(() => {
        setFileContent(null);
        setFileName('');
        setPreviewData(null);
        setConflictReport(null);
        setImportStatus('idle');
        setErrorMessage(null);
    }, []);

    const toggleExpanded = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    if (!isExpanded) {
        return (
            <div
                onClick={toggleExpanded}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-8 cursor-pointer hover:bg-gray-750 transition-colors flex items-center justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleExpanded()}
                aria-label="Expandir importador de horarios ICS"
            >
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-200 group-hover:text-white transition-colors">
                    <Upload className="w-5 h-5 text-blue-400" />
                    Importar Horario (.ics)
                </h2>
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">Clique para expandir</span>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-400" />
                    Importar Horario (.ics)
                </h2>
                <button
                    onClick={toggleExpanded}
                    className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Recolher"
                    aria-label="Recolher importador"
                >
                    <ChevronUp className="w-5 h-5" />
                </button>
            </div>

            {!fileContent ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                        }`}
                >
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">
                        Arraste um ficheiro .ics aqui ou clique para selecionar
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                        Formatos suportados: .ics (Calendar)
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".ics"
                        onChange={handleFileInputChange}
                        className="hidden"
                        aria-label="Selecionar ficheiro ICS"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
                        aria-label="Abrir seletor de ficheiros"
                    >
                        Selecionar Ficheiro
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* File Info */}
                    <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {importStatus === 'loading' ? (
                                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                                ) : (
                                    <FileText className="w-5 h-5 text-blue-400" />
                                )}
                                <span className="text-white font-medium">{fileName}</span>
                            </div>
                            <button
                                onClick={handleReset}
                                className="text-gray-400 hover:text-white text-sm"
                                aria-label="Remover ficheiro"
                            >
                                Remover
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-900/20 border border-red-700 p-4 rounded">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-400 font-semibold">Erro</span>
                            </div>
                            <p className="text-sm text-red-300 mt-2">{errorMessage}</p>
                            <button
                                onClick={handleReset}
                                className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {importStatus === 'loading' && (
                        <div className="bg-blue-900/20 border border-blue-700 p-4 rounded text-center">
                            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                            <p className="text-blue-300">A analisar ficheiro...</p>
                        </div>
                    )}

                    {/* Preview */}
                    {previewData && importStatus === 'success' && (
                        <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                            <h3 className="text-white font-semibold mb-3">Pre-visualizacao</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Nome:</span>
                                    <span className="text-white ml-2">{previewData.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Equipas:</span>
                                    <span className="text-white ml-2">{previewData.teams}</span>
                                </div>
                                <div>
                                    <label className="text-gray-400 block mb-1">Duracao Turno (h):</label>
                                    <input
                                        type="number"
                                        value={shiftDuration}
                                        min={1}
                                        max={12}
                                        step={0.5}
                                        onChange={(e) => setShiftDuration(Number(e.target.value))}
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-400 block mb-1">Horas Semanais:</label>
                                    <input
                                        type="number"
                                        value={weeklyHoursContract}
                                        min={1}
                                        max={60}
                                        step={0.5}
                                        onChange={(e) => setWeeklyHoursContract(Number(e.target.value))}
                                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Team Patterns */}
                            {previewData.teamPatterns && previewData.teamPatterns.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-gray-400 text-sm mb-2">Padroes por Equipa:</h4>
                                    <div className="space-y-1">
                                        {previewData.teamPatterns.map((pattern: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs">
                                                <span className="text-gray-500 w-16">Turno {String.fromCharCode(65 + idx)}:</span>
                                                <span className="font-mono text-gray-300">{pattern}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Conflict Report */}
                    {conflictReport && importStatus === 'success' && (
                        <div className={`p-4 rounded border ${conflictReport.hasConflicts
                            ? 'bg-red-900/20 border-red-700'
                            : 'bg-green-900/20 border-green-700'
                            }`}>
                            <div className="flex items-center gap-2 mb-2">
                                {conflictReport.hasConflicts ? (
                                    <>
                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                        <span className="text-red-400 font-semibold">Conflitos Detectados</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-green-400 font-semibold">Sem Conflitos</span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-gray-300">{getConflictSummary(conflictReport)}</p>

                            {conflictReport.hasConflicts && (
                                <div className="mt-3 space-y-1">
                                    {conflictReport.conflicts.slice(0, 5).map((conflict, idx) => (
                                        <div key={idx} className="text-xs text-red-300">
                                            Dia {conflict.day + 1}: Turnos {conflict.teams.join(', ')} em {conflict.shift}
                                        </div>
                                    ))}
                                    {conflictReport.conflicts.length > 5 && (
                                        <div className="text-xs text-red-400">
                                            ... e mais {conflictReport.conflicts.length - 5} conflito(s)
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Import Button */}
                    {importStatus === 'success' && (
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleReset}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={conflictReport?.hasConflicts}
                                className={`px-6 py-2 rounded transition-colors ${conflictReport?.hasConflicts
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                aria-label={conflictReport?.hasConflicts ? 'Nao e possivel importar com conflitos' : 'Importar horario'}
                            >
                                Importar Horario
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ICSImporter;
