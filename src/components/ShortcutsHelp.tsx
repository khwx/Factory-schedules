import React, { useEffect, useCallback, useState } from 'react';
import { X, Keyboard } from 'lucide-react';
import { useI18n } from '../i18n';

interface ShortcutItem {
    keys: string[];
    labelKey: string;
}

const SHORTCUTS: ShortcutItem[] = [
    { keys: ['Ctrl', 'Z'], labelKey: 'undo' },
    { keys: ['Ctrl', 'Shift', 'Z'], labelKey: 'redo' },
    { keys: ['Ctrl', 'F'], labelKey: 'search' },
    { keys: ['Alt', '\u2191'], labelKey: 'moveUp' },
    { keys: ['Alt', '\u2193'], labelKey: 'moveDown' },
    { keys: ['N'], labelKey: 'newScenario' },
    { keys: ['E'], labelKey: 'exportICS' },
    { keys: ['Ctrl', '1-9'], labelKey: 'viewCalendar' },
    { keys: ['Esc'], labelKey: 'close' },
    { keys: ['?'], labelKey: 'shortcuts' },
];

interface ShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose }) => {
    const { t } = useI18n();
    const labelMap: Record<string, string> = {
        undo: t.a11y.undo,
        redo: t.a11y.redo,
        search: t.a11y.search,
        moveUp: t.a11y.moveUp,
        moveDown: t.a11y.moveDown,
        newScenario: t.a11y.newScenario,
        exportICS: t.a11y.exportICS,
        viewCalendar: t.a11y.viewCalendar,
        close: t.a11y.closeModal,
        shortcuts: t.a11y.shortcutsOpen,
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
            <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-600 rounded-xl p-6 shadow-2xl z-50 w-[380px] animate-scaleIn"
                role="dialog"
                aria-modal="true"
                aria-label={t.a11y.shortcutsTitle}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                        <Keyboard className="w-5 h-5 text-blue-400" />
                        {t.helpPage.keyboardShortcuts}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label={t.common.close}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-3">
                    {SHORTCUTS.map(({ keys, labelKey }) => (
                        <div key={labelKey} className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">{labelMap[labelKey]}</span>
                            <div className="flex gap-1">
                                {keys.map((key) => (
                                    <kbd
                                        key={key}
                                        className="bg-gray-700 border border-gray-600 text-gray-300 text-xs px-2 py-0.5 rounded font-mono"
                                    >
                                        {key}
                                    </kbd>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export function useShortcutsHelp() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => setIsOpen(p => !p), []);
    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement
            ) return;
            if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                setIsOpen(p => !p);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return { isOpen, toggle, close };
}
