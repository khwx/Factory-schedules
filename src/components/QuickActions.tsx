import { useState } from 'react';
import { Plus, Wand2, Download, Search, X } from 'lucide-react';
import { clsx } from 'clsx';

interface QuickActionsProps {
    onNewScenario: () => void;
    onOpenGenerator: () => void;
    onExport: () => void;
    onSearch: () => void;
}

export default function QuickActions({ onNewScenario, onOpenGenerator, onExport, onSearch }: QuickActionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { icon: Plus, label: 'Novo Cenario', color: 'bg-blue-600 hover:bg-blue-500', onClick: onNewScenario },
        { icon: Wand2, label: 'Gerar Horario', color: 'bg-purple-600 hover:bg-purple-500', onClick: onOpenGenerator },
        { icon: Download, label: 'Exportar', color: 'bg-emerald-600 hover:bg-emerald-500', onClick: onExport },
        { icon: Search, label: 'Pesquisar', color: 'bg-amber-600 hover:bg-amber-500', onClick: onSearch },
    ];

    return (
        <div className="md:hidden fixed bottom-20 right-4 z-30">
            {isOpen && (
                <div className="absolute bottom-16 right-0 space-y-3 animate-fadeIn">
                    {actions.map((action, i) => (
                        <button
                            key={action.label}
                            onClick={() => {
                                action.onClick();
                                setIsOpen(false);
                            }}
                            className={clsx(
                                'flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow-lg transition-all',
                                action.color
                            )}
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <action.icon className="h-4 w-4" />
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all transform',
                    isOpen
                        ? 'bg-gray-600 rotate-45'
                        : 'bg-blue-600 hover:bg-blue-500 active:scale-95'
                )}
                aria-label={isOpen ? 'Fechar acoes' : 'Acoes rapidas'}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <Plus className="h-6 w-6 text-white" />
                )}
            </button>
        </div>
    );
}
