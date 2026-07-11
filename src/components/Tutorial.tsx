import React, { useState, useEffect, useCallback } from 'react';
import { HelpCircle, X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TutorialStep {
    selector: string;
    title: string;
    text: string;
}

const STEPS: TutorialStep[] = [
    {
        selector: '[data-tutorial="form"]',
        title: 'Criar Cenario',
        text: 'Use este formulario para definir o nome, numero de equipas, duracao do turno e padrao de rotacao (ex: MMTTNNFFFF).',
    },
    {
        selector: '[data-tutorial="presets"]',
        title: 'Cenarios de Exemplo',
        text: 'Carregue cenarios pre-definidos para explorar as funcionalidades rapidamente.',
    },
    {
        selector: '[data-tutorial="generator"]',
        title: 'Gerador de Horarios',
        text: 'O gerador cria automaticamente padroes validos com base nas restricoes que definir.',
    },
    {
        selector: '[data-tutorial="cards"]',
        title: 'Cenarios Criados',
        text: 'Cada cenario mostra metricas chave: horas semanais, fins de semana de folga e dias de folga. Use os botoes para ver o calendario, exportar ou partilhar.',
    },
    {
        selector: '[data-tutorial="comparison"]',
        title: 'Comparacao de Cenarios',
        text: 'A tabela compara todos os cenarios lado a lado. Valores verdes sao os melhores, vermelhos os piores.',
    },
    {
        selector: '[data-tutorial="compliance"]',
        title: 'Conformidade Legal',
        text: 'Verifica automaticamente a conformidade com o Codigo do Trabalho Portugues (11h descanso, max 5 noites, etc.).',
    },
];

const STORAGE_KEY = 'shiftsim_tutorial_complete';

export function useTutorial() {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const start = useCallback(() => {
        setCurrentStep(0);
        setIsActive(true);
    }, []);

    const next = useCallback(() => {
        setCurrentStep(prev => {
            if (prev >= STEPS.length - 1) {
                setIsActive(false);
                try { localStorage.setItem(STORAGE_KEY, 'true'); } catch { /* ignore */ }
                return prev;
            }
            return prev + 1;
        });
    }, []);

    const prev = useCallback(() => {
        setCurrentStep(p => Math.max(0, p - 1));
    }, []);

    const close = useCallback(() => {
        setIsActive(false);
        try { localStorage.setItem(STORAGE_KEY, 'true'); } catch { /* ignore */ }
    }, []);

    const shouldShowOnFirstVisit = useCallback(() => {
        try {
            return !localStorage.getItem(STORAGE_KEY);
        } catch {
            return false;
        }
    }, []);

    return { isActive, currentStep, start, next, prev, close, shouldShowOnFirstVisit, totalSteps: STEPS.length };
}

export const TutorialOverlay: React.FC<{
    isActive: boolean;
    currentStep: number;
    onNext: () => void;
    onPrev: () => void;
    onClose: () => void;
    totalSteps: number;
}> = ({ isActive, currentStep, onNext, onPrev, onClose, totalSteps }) => {
    const [rect, setRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!isActive) return;
        const step = STEPS[currentStep];
        if (!step) return;

        const updateRect = () => {
            const el = document.querySelector(step.selector);
            if (el) {
                setRect(el.getBoundingClientRect());
            } else {
                setRect(null);
            }
        };

        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect, true);
        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect, true);
        };
    }, [isActive, currentStep]);

    if (!isActive) return null;

    const step = STEPS[currentStep];
    if (!step) return null;

    const tooltipStyle: React.CSSProperties = rect
        ? {
            position: 'fixed',
            top: rect.bottom + 16,
            left: Math.max(16, Math.min(rect.left, window.innerWidth - 360)),
            zIndex: 100,
        }
        : {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
        };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
            {rect && (
                <div
                    className="fixed border-2 border-blue-500 rounded-lg pointer-events-none z-40 transition-all"
                    style={{
                        top: rect.top - 4,
                        left: rect.left - 4,
                        width: rect.width + 8,
                        height: rect.height + 8,
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
                    }}
                />
            )}
            <div
                className="bg-gray-800 border border-gray-600 rounded-lg p-5 shadow-2xl w-[340px] animate-scaleIn"
                style={tooltipStyle}
                role="dialog"
                aria-modal="true"
                aria-label={step.title}
            >
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-semibold text-lg">{step.title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Fechar tutorial">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-sm text-gray-300 mb-4">{step.text}</p>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        {currentStep + 1} de {totalSteps}
                    </span>
                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <button
                                onClick={onPrev}
                                className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Anterior
                            </button>
                        )}
                        <button
                            onClick={onNext}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                        >
                            {currentStep === totalSteps - 1 ? 'Concluir' : 'Proximo'}
                            {currentStep < totalSteps - 1 && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export const HelpButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        title="Ajuda"
        aria-label="Abrir tutorial de ajuda"
    >
        <HelpCircle className="w-5 h-5 text-gray-400" />
    </button>
);