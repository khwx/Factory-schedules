import React, { useEffect, useCallback, useState } from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutItem {
    keys: string[];
    label: string;
}

const SHORTCUTS: ShortcutItem[] = [
    { keys: ['Ctrl', 'Z'], label: 'Desfazer' },
    { keys: ['Ctrl', 'Shift', 'Z'], label: 'Refazer' },
    { keys: ['Ctrl', 'F'], label: 'Pesquisar cenarios' },
    { keys: ['Alt', '\u2191'], label: 'Mover cenario para cima' },
    { keys: ['Alt', '\u2193'], label: 'Mover cenario para baixo' },
    { keys: ['Esc'], label: 'Fechar modal/painel' },
    { keys: ['?'], label: 'Abrir atalhos de teclado' },
];

interface ShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose }) => {
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
                aria-label="Atalhos de teclado"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                        <Keyboard className="w-5 h-5 text-blue-400" />
                        Atalhos de Teclado
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Fechar">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-3">
                    {SHORTCUTS.map(({ keys, label }) => (
                        <div key={label} className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">{label}</span>
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
