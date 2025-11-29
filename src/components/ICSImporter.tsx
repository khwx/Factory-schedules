import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { generateScenarioFromICS } from '../utils/icsParser';
import { findConflicts, getConflictSummary } from '../utils/conflictValidator';
import { Scenario } from '../types';

interface ICSImporterProps {
    onImport: (scenario: Omit<Scenario, 'id'>) => void;
}

const ICSImporter: React.FC<ICSImporterProps> = ({ onImport }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [previewData, setPreviewData] = useState<any>(null);
    const [conflictReport, setConflictReport] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (!file.name.endsWith('.ics')) {
            alert('Por favor selecione um ficheiro .ics');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setFileContent(content);
            setFileName(file.name);
            analyzeFile(content, file.name);
        };
        reader.readAsText(file);
    };

    const analyzeFile = (content: string, filename: string) => {
        try {
            // Generate scenario from ICS
            const scenarioName = filename.replace('.ics', '');
            const scenario = generateScenarioFromICS(content, scenarioName, 9, 37.5);

            // Validate for conflicts
            const conflicts = findConflicts(scenario.teamPatterns || []);

            setPreviewData(scenario);
            setConflictReport(conflicts);
        } catch (error) {
            console.error('Error parsing ICS:', error);
            alert('Erro ao analisar ficheiro .ics');
        }
    };

    const handleImport = () => {
        if (!previewData) return;

        onImport(previewData);

        // Reset
        setFileContent(null);
        setFileName('');
        setPreviewData(null);
        setConflictReport(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                Importar Horário (.ics)
            </h2>

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
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".ics"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
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
                                <FileText className="w-5 h-5 text-blue-400" />
                                <span className="text-white font-medium">{fileName}</span>
                            </div>
                            <button
                                onClick={() => {
                                    setFileContent(null);
                                    setFileName('');
                                    setPreviewData(null);
                                    setConflictReport(null);
                                }}
                                className="text-gray-400 hover:text-white text-sm"
                            >
                                Remover
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    {previewData && (
                        <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                            <h3 className="text-white font-semibold mb-3">Pré-visualização</h3>
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
                                    <span className="text-gray-400">Duração Turno:</span>
                                    <span className="text-white ml-2">{previewData.shiftDuration}h</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Horas Semanais:</span>
                                    <span className="text-white ml-2">{previewData.weeklyHoursContract}h</span>
                                </div>
                            </div>

                            {/* Team Patterns */}
                            <div className="mt-4">
                                <h4 className="text-gray-400 text-sm mb-2">Padrões por Equipa:</h4>
                                <div className="space-y-1">
                                    {previewData.teamPatterns?.map((pattern: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs">
                                            <span className="text-gray-500 w-16">Turno {String.fromCharCode(65 + idx)}:</span>
                                            <span className="font-mono text-gray-300">{pattern}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Conflict Report */}
                    {conflictReport && (
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
                                    {conflictReport.conflicts.slice(0, 5).map((conflict: any, idx: number) => (
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
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => {
                                setFileContent(null);
                                setFileName('');
                                setPreviewData(null);
                                setConflictReport(null);
                            }}
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
                        >
                            Importar Horário
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ICSImporter;
