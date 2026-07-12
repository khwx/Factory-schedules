import React, { useMemo, useCallback } from 'react';
import { Trash2, Clock, Calendar, Download, Palmtree, Pencil, Eye, EyeOff, Users, Copy, GripVertical, FileText, Table2, Code2, ChevronUp, ChevronDown, CalendarDays, Link } from 'lucide-react';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';
import { useI18n } from '../i18n';

interface ScenarioCardProps {
    scenario: Scenario;
    onDelete: (id: string) => void;
    onEdit: (scenario: Scenario) => void;
    onViewCalendar: (scenario: Scenario) => void;
    onViewMultiTeamCalendar?: (scenario: Scenario) => void;
    onExport: (scenario: Scenario) => void;
    onExportPDF?: (scenario: Scenario) => void;
    onExportCSV?: (scenario: Scenario) => void;
    onExportJSON?: (scenario: Scenario) => void;
    onExportICS?: (scenario: Scenario) => void;
    onShare?: (scenario: Scenario) => void;
    onToggleHidden: (id: string) => void;
    onDuplicate: (scenario: Scenario) => void;
    isDragging?: boolean;
    isDragOver?: boolean;
    onDragStart?: () => void;
    onDragEnter?: () => void;
    onDragLeave?: () => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
    onDragEnd?: () => void;
    onKeyboardReorder?: (itemId: string, direction: 'up' | 'down') => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = React.memo(({
    scenario,
    onDelete,
    onEdit,
    onViewCalendar,
    onViewMultiTeamCalendar,
    onExport,
    onExportPDF,
    onExportCSV,
    onExportJSON,
    onExportICS,
    onShare,
    onToggleHidden,
    onDuplicate,
    isDragging = false,
    isDragOver = false,
    onDragStart,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onDragEnd,
    onKeyboardReorder,
}) => {
    const { t } = useI18n();
    const analysis = useMemo(() => calculateAnalysis(scenario), [scenario]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!onKeyboardReorder) return;
        if (e.altKey && e.key === 'ArrowUp') {
            e.preventDefault();
            onKeyboardReorder(scenario.id, 'up');
        } else if (e.altKey && e.key === 'ArrowDown') {
            e.preventDefault();
            onKeyboardReorder(scenario.id, 'down');
        }
    }, [onKeyboardReorder, scenario.id]);

    const getShiftColor = (char: string) => {
        switch (char) {
            case 'M': return 'bg-yellow-500';
            case 'T': return 'bg-orange-500';
            case 'N': return 'bg-blue-600';
            case 'F': return 'bg-gray-600';
            default: return 'bg-gray-700';
        }
    };

    return (
        <div
            className={`bg-gray-800 rounded-lg border overflow-hidden transition-all duration-200 animate-cardEnter ${
                isDragging
                    ? 'opacity-50 border-blue-500 scale-95'
                    : isDragOver
                        ? 'border-blue-500 border-2 scale-[1.02]'
                        : 'border-gray-700 hover:border-gray-600'
            }`}
            draggable
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="article"
            aria-label={scenario.name}
        >
            <div className="p-4 border-b border-gray-700 flex justify-between items-start">
                <div className="flex items-start gap-2">
                    <div className="flex flex-col gap-0.5 mt-1">
                        <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 transition-colors" data-testid="drag-handle">
                            <GripVertical className="w-4 h-4" />
                        </div>
                        {onKeyboardReorder && (
                            <div className="flex flex-col">
                                <button
                                    onClick={() => onKeyboardReorder(scenario.id, 'up')}
                                    className="text-gray-500 hover:text-gray-300 transition-colors p-0"
                                    aria-label={`${scenario.name} up`}
                                >
                                    <ChevronUp className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => onKeyboardReorder(scenario.id, 'down')}
                                    className="text-gray-500 hover:text-gray-300 transition-colors p-0"
                                    aria-label={`${scenario.name} down`}
                                >
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{scenario.name}</h3>
                        <p className="text-sm text-gray-400">
                            {scenario.teams} {t.form.teams} &bull; {scenario.shiftDuration}h
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onToggleHidden(scenario.id)}
                        className="text-gray-500 hover:text-yellow-400 transition-colors"
                        title={scenario.hidden ? t.card.show : t.card.hide}
                        aria-label={scenario.hidden ? t.card.show : t.card.hide}
                    >
                        {scenario.hidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => onDuplicate(scenario)}
                        className="text-gray-500 hover:text-green-400 transition-colors"
                        title={t.card.duplicate}
                        aria-label={t.card.duplicate}
                    >
                        <Copy className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onEdit(scenario)}
                        className="text-gray-500 hover:text-blue-400 transition-colors"
                        title={t.card.edit}
                        aria-label={t.card.edit}
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(scenario.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        title={t.card.delete}
                        aria-label={t.card.delete}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{t.form.pattern}</p>
                    {scenario.teamPatterns && scenario.teamPatterns.length > 1 ? (
                        <div className="space-y-1">
                            {scenario.teamPatterns.map((pattern, teamIdx) => (
                                <div key={teamIdx} className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 w-12 flex-shrink-0">
                                        {String.fromCharCode(65 + teamIdx)}
                                    </span>
                                    <div className="flex h-3 rounded overflow-hidden flex-1" title={`${String.fromCharCode(65 + teamIdx)}: ${pattern}`}>
                                        {pattern.split('').map((char, i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 ${getShiftColor(char)}`}
                                                title={`Day ${i + 1}: ${char}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-4 rounded overflow-hidden">
                            {scenario.pattern.split('').map((char, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 ${getShiftColor(char)}`}
                                    title={`Day ${i + 1}: ${char}`}
                                />
                            ))}
                        </div>
                    )}
                    <div className="flex justify-between text-xs text-gray-500 mt-1 font-mono">
                        <span>Dia 1</span>
                        <span>Dia {scenario.pattern.length}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-700/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs">{t.card.avgWeekly}</span>
                        </div>
                        <div className={`text-lg font-bold ${analysis.avgWeeklyHours > 40 ? 'text-red-400' : 'text-white'}`}>
                            {analysis.avgWeeklyHours.toFixed(1)}h
                        </div>
                        {analysis.weeklyHoursDifference !== undefined && (
                            <div className={`text-xs mt-1 ${analysis.weeklyHoursDifference > 0 ? 'text-red-400' : analysis.weeklyHoursDifference < 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                {analysis.weeklyHoursDifference > 0 ? '+' : ''}{analysis.weeklyHoursDifference.toFixed(1)}h
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-700/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">{t.card.weekends}</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                            {analysis.weekendsOffPerYear}
                        </div>
                    </div>

                    <div className="bg-gray-700/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Palmtree className="w-4 h-4" />
                            <span className="text-xs">{t.card.offDays}</span>
                        </div>
                        <div className="text-lg font-bold text-green-400">
                            {analysis.totalOffDaysPerYear}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => onViewCalendar(scenario)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
                        aria-label={t.card.calendar}
                    >
                        <Calendar className="w-4 h-4" />
                        {t.card.calendar}
                    </button>
                    {scenario.teams > 1 && onViewMultiTeamCalendar && (
                        <button
                            onClick={() => onViewMultiTeamCalendar(scenario)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
                            aria-label={t.card.multi}
                        >
                            <Users className="w-4 h-4" />
                            {t.card.multi}
                        </button>
                    )}
                    {onShare && (
                        <button
                            onClick={() => onShare(scenario)}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
                            aria-label={t.card.share}
                        >
                            <Link className="w-4 h-4" />
                            {t.card.share}
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onExport(scenario)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
                        aria-label="Excel"
                    >
                        <Download className="w-4 h-4" />
                        Excel
                    </button>
                    {onExportPDF && (
                        <button
                            onClick={() => onExportPDF(scenario)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
                            aria-label={t.card.exportPDF}
                        >
                            <FileText className="w-4 h-4" />
                            {t.card.exportPDF}
                        </button>
                    )}
                    {onExportCSV && (
                        <button
                            onClick={() => onExportCSV(scenario)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
                            aria-label={t.card.exportCSV}
                        >
                            <Table2 className="w-4 h-4" />
                            {t.card.exportCSV}
                        </button>
                    )}
                    {onExportJSON && (
                        <button
                            onClick={() => onExportJSON(scenario)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
                            aria-label={t.card.exportJSON}
                        >
                            <Code2 className="w-4 h-4" />
                            {t.card.exportJSON}
                        </button>
                    )}
                    {onExportICS && (
                        <button
                            onClick={() => onExportICS(scenario)}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
                            aria-label={t.card.exportICS}
                        >
                            <CalendarDays className="w-4 h-4" />
                            {t.card.exportICS}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});

ScenarioCard.displayName = 'ScenarioCard';

export default ScenarioCard;
