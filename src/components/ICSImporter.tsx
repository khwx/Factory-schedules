import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { generateScenarioFromICS } from '../utils/icsParser';
import { findConflicts, ConflictReport } from '../utils/conflictValidator';
import { Scenario } from '../types';
import { useI18n } from '../i18n';

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
    const { t } = useI18n();
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
                setErrorMessage(t.icsImporter.noTeamsFound);
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
                    ? t.icsImporter.parseError.replace('{msg}', error.message)
                    : t.icsImporter.unknownParseError
            );
            setImportStatus('error');
        }
    }, [t]);

    const handleFileSelect = useCallback((file: File) => {
        if (!file.name.endsWith('.ics')) {
            setErrorMessage(t.icsImporter.invalidFileType);
            setImportStatus('error');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage(t.icsImporter.fileTooLarge);
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
            setErrorMessage(t.icsImporter.readError);
            setImportStatus('error');
        };
        reader.readAsText(file);
    }, [analyzeFile, shiftDuration, weeklyHoursContract, t]);

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

    const conflictSummary = conflictReport?.hasConflicts
        ? t.icsImporter.conflictSummaryConflicts
            .replace('{count}', String(conflictReport.conflicts.length))
            .replace('{days}', String(new Set(conflictReport.conflicts.map(c => c.day)).size))
        : t.icsImporter.conflictSummaryOk;

    if (!isExpanded) {
        return (
            <div
                onClick={toggleExpanded}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-8 cursor-pointer hover:bg-gray-750 transition-colors flex items-center justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleExpanded()}
                aria-label={t.icsImporter.expandAria}
            >
                <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-200 group-hover:text-white transition-colors">
                    <Upload className="w-5 h-5 text-blue-400" />
                    {t.icsImporter.title}
                </h2>
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">{t.icsImporter.expandLabel}</span>
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
                    {t.icsImporter.title}
                </h2>
                <button
                    onClick={toggleExpanded}
                    className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded transition-colors"
                    title={t.icsImporter.collapseLabel}
                    aria-label={t.icsImporter.collapseAria}
                >
                    <ChevronUp className="w-5 h-5" />
                </button>
            </div>

            {errorMessage && (
                <div className="bg-red-900/20 border border-red-700 p-4 rounded mb-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-semibold">{t.icsImporter.errorLabel}</span>
                    </div>
                    <p className="text-sm text-red-300 mt-2">{errorMessage}</p>
                    <button
                        onClick={handleReset}
                        className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
                    >
                        {t.icsImporter.retry}
                    </button>
                </div>
            )}

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
                        {t.icsImporter.dragDropText}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                        {t.icsImporter.supportedFormats}
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".ics"
                        onChange={handleFileInputChange}
                        className="hidden"
                        aria-label={t.icsImporter.selectFileLabel}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
                        aria-label={t.icsImporter.openFilePicker}
                    >
                        {t.icsImporter.selectFile}
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
                                aria-label={t.icsImporter.removeFileAria}
                            >
                                {t.icsImporter.removeFile}
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {importStatus === 'loading' && (
                        <div className="bg-blue-900/20 border border-blue-700 p-4 rounded text-center">
                            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                            <p className="text-blue-300">{t.icsImporter.analyzing}</p>
                        </div>
                    )}

                    {/* Preview */}
                    {previewData && importStatus === 'success' && (
                        <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                            <h3 className="text-white font-semibold mb-3">{t.icsImporter.preview}</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">{t.icsImporter.nameLabel}</span>
                                    <span className="text-white ml-2">{previewData.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">{t.icsImporter.teamsLabel}</span>
                                    <span className="text-white ml-2">{previewData.teams}</span>
                                </div>
                                <div>
                                    <label className="text-gray-400 block mb-1">{t.icsImporter.shiftDurationLabel}</label>
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
                                    <label className="text-gray-400 block mb-1">{t.icsImporter.weeklyHoursLabel}</label>
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
                                    <h4 className="text-gray-400 text-sm mb-2">{t.icsImporter.teamPatternsLabel}</h4>
                                    <div className="space-y-1">
                                        {previewData.teamPatterns.map((pattern: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs">
                                                <span className="text-gray-500 w-16">{t.icsImporter.shiftLabel.replace('{letter}', String.fromCharCode(65 + idx))}</span>
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
                                        <span className="text-red-400 font-semibold">{t.icsImporter.conflictsDetected}</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-green-400 font-semibold">{t.icsImporter.noConflicts}</span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-gray-300">{conflictSummary}</p>

                            {conflictReport.hasConflicts && (
                                <div className="mt-3 space-y-1">
                                    {conflictReport.conflicts.slice(0, 5).map((conflict, idx) => (
                                        <div key={idx} className="text-xs text-red-300">
                                            {t.icsImporter.conflictDetail
                                                .replace('{day}', String(conflict.day + 1))
                                                .replace('{teams}', conflict.teams.join(', '))
                                                .replace('{shift}', conflict.shift)}
                                        </div>
                                    ))}
                                    {conflictReport.conflicts.length > 5 && (
                                        <div className="text-xs text-red-400">
                                            {t.icsImporter.moreConflicts.replace('{count}', String(conflictReport.conflicts.length - 5))}
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
                                {t.icsImporter.cancel}
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={conflictReport?.hasConflicts}
                                className={`px-6 py-2 rounded transition-colors ${conflictReport?.hasConflicts
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                aria-label={conflictReport?.hasConflicts ? t.icsImporter.cannotImportConflicts : t.icsImporter.import}
                            >
                                {t.icsImporter.import}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ICSImporter;
