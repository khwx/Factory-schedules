import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BookOpen, ChevronDown, Plus } from 'lucide-react';
import { PRESET_SCENARIOS, PresetScenario } from '../data/presetScenarios';

interface PresetSelectorProps {
    onLoadPreset: (preset: PresetScenario) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ onLoadPreset }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const close = useCallback(() => {
        setIsOpen(false);
        setActiveIndex(-1);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close();
                buttonRef.current?.focus();
                return;
            }

            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setActiveIndex(prev => {
                        const next = prev < PRESET_SCENARIOS.length - 1 ? prev + 1 : 0;
                        itemRefs.current[next]?.scrollIntoView({ block: 'nearest' });
                        return next;
                    });
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setActiveIndex(prev => {
                        const next = prev > 0 ? prev - 1 : PRESET_SCENARIOS.length - 1;
                        itemRefs.current[next]?.scrollIntoView({ block: 'nearest' });
                        return next;
                    });
                    break;
                case 'Home':
                    e.preventDefault();
                    setActiveIndex(0);
                    itemRefs.current[0]?.scrollIntoView({ block: 'nearest' });
                    break;
                case 'End':
                    e.preventDefault();
                    setActiveIndex(PRESET_SCENARIOS.length - 1);
                    itemRefs.current[PRESET_SCENARIOS.length - 1]?.scrollIntoView({ block: 'nearest' });
                    break;
                case 'Enter':
                case ' ':
                    if (activeIndex >= 0) {
                        e.preventDefault();
                        onLoadPreset(PRESET_SCENARIOS[activeIndex]);
                        close();
                        buttonRef.current?.focus();
                    }
                    break;
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, activeIndex, close, onLoadPreset]);

    useEffect(() => {
        if (isOpen && activeIndex >= 0) {
            itemRefs.current[activeIndex]?.focus();
        }
    }, [isOpen, activeIndex]);

    return (
        <div className="relative mb-4" ref={containerRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-between shadow-lg"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Carregar Cenario de Exemplo</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    ref={listRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden max-h-[400px] overflow-y-auto"
                    role="listbox"
                    aria-label="Cenarios de exemplo"
                >
                    {PRESET_SCENARIOS.map((preset, index) => (
                        <button
                            key={preset.name}
                            ref={el => { itemRefs.current[index] = el; }}
                            onClick={() => {
                                onLoadPreset(preset);
                                close();
                            }}
                            className={`w-full text-left p-4 transition-colors border-b border-gray-700 last:border-b-0 ${
                                activeIndex === index ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            role="option"
                            aria-selected={activeIndex === index}
                            tabIndex={activeIndex === index ? 0 : -1}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-white mb-1">{preset.name}</h4>
                                    <p className="text-sm text-gray-400 mb-2">{preset.description}</p>
                                    <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
                                        <span>{preset.teams} equipas</span>
                                        <span>Turno: {preset.shiftDuration}h</span>
                                        <span>Contrato: {preset.weeklyHoursContract}h/sem</span>
                                        <span className="font-mono truncate max-w-[200px]" title={preset.pattern}>
                                            {preset.pattern.length > 30
                                                ? preset.pattern.substring(0, 30) + '...'
                                                : preset.pattern}
                                        </span>
                                    </div>
                                </div>
                                <Plus className="w-5 h-5 text-blue-400 flex-shrink-0 ml-4" />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PresetSelector;
