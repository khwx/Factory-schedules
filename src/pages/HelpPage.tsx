import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Keyboard, Calculator, Calendar, Users, FileText, BarChart3, Settings } from 'lucide-react';
import { useI18n } from '../i18n';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const FAQ_PT: FAQItem[] = [
    {
        category: 'Geral',
        question: 'O que e o ShiftSim Factory?',
        answer: 'O ShiftSim Factory e um simulador de escalas industriais para o mercado portugues. Permite criar, comparar e analisar diferentes padroes de turnos para equipas de trabalho.',
    },
    {
        category: 'Geral',
        question: 'Os meus dados sao guardados no servidor?',
        answer: 'Nao. Todos os dados sao guardados localmente no seu navegador (localStorage). Nao e enviado nenhum dado para servidores externos. Pode fazer backup/exportar os seus dados a qualquer momento.',
    },
    {
        category: 'Cenarios',
        question: 'Qual e o padrao de turno maximo?',
        answer: 'O padrao pode ter entre 5 e 60 caracteres. Use M (Manha), T (Tarde), N (Noite) e F (Folga). Exemplo: MM TT NN FFFF para um ciclo de 10 dias.',
    },
    {
        category: 'Cenarios',
        question: 'Posso ter padroes diferentes por equipa?',
        answer: 'Sim. Ao criar/editar um cenario, pode definir o padrao de cada equipa individualmente. Isto e util para escalas assimetricas.',
    },
    {
        category: 'Cenarios',
        question: 'Quantas equipas posso ter?',
        answer: 'Pode ter entre 1 e 10 equipas por cenario. O numero ideal depende da cobertura necessaria e do tipo de industria.',
    },
    {
        category: 'Legal',
        question: 'O que verifica a conformidade legal?',
        answer: 'O sistema verifica 6 regras do Codigo do Trabalho portugues: descanso semanal, intervalo entre turnos, maximo de horas extras, descanso diario, feriados e rotacao de turnos.',
    },
    {
        category: 'Legal',
        question: 'Os feriados sao atualizados automaticamente?',
        answer: 'Sim. Os feriados portugueses (incluindo moveis baseados na Pascoa) sao calculados automaticamente. Pode tambem adicionar feriados personalizados.',
    },
    {
        category: 'Exportacao',
        question: 'Que formatos de exportacao estao disponiveis?',
        answer: 'Pode exportar para Excel (.xlsx), PDF, CSV, JSON e ICS (calendario). Cada formato e adequado para diferentes utilizacoes.',
    },
    {
        category: 'Exportacao',
        question: 'Como partilhar um cenario com um colega?',
        answer: 'Clique no botao "Partilhar" no cartao do cenario. sera gerado um link URL que pode copiar e enviar. O destinatario vera o cenario automaticamente ao abrir o link.',
    },
    {
        category: 'Atalhos',
        question: 'Que atalhos de teclado existem?',
        answer: 'Ctrl+Z (desfazer), Ctrl+Shift+Z (refazer), Ctrl+F (pesquisar), N (novo cenario), Ctrl+1-9 (ver calendario), ? (ajuda), Esc (fechar).',
    },
];

const FAQ_EN: FAQItem[] = [
    {
        category: 'General',
        question: 'What is ShiftSim Factory?',
        answer: 'ShiftSim Factory is an industrial shift schedule simulator for the Portuguese market. It allows you to create, compare, and analyze different shift patterns for work teams.',
    },
    {
        category: 'General',
        question: 'Are my data stored on a server?',
        answer: 'No. All data is stored locally in your browser (localStorage). No data is sent to external servers. You can backup/export your data at any time.',
    },
    {
        category: 'Scenarios',
        question: 'What is the maximum shift pattern length?',
        answer: 'The pattern can be between 5 and 60 characters. Use M (Morning), T (Afternoon), N (Night), and F (Off). Example: MM TT NN FFFF for a 10-day cycle.',
    },
    {
        category: 'Scenarios',
        question: 'Can I have different patterns per team?',
        answer: 'Yes. When creating/editing a scenario, you can define each team pattern individually. This is useful for asymmetric schedules.',
    },
    {
        category: 'Scenarios',
        question: 'How many teams can I have?',
        answer: 'You can have between 1 and 10 teams per scenario. The ideal number depends on the required coverage and industry type.',
    },
    {
        category: 'Legal',
        question: 'What does legal compliance check?',
        answer: 'The system verifies 6 rules from the Portuguese Labor Code: weekly rest, interval between shifts, maximum overtime, daily rest, holidays, and shift rotation.',
    },
    {
        category: 'Legal',
        question: 'Are holidays updated automatically?',
        answer: 'Yes. Portuguese holidays (including Easter-based movable ones) are calculated automatically. You can also add custom holidays.',
    },
    {
        category: 'Export',
        question: 'What export formats are available?',
        answer: 'You can export to Excel (.xlsx), PDF, CSV, JSON, and ICS (calendar). Each format is suitable for different uses.',
    },
    {
        category: 'Export',
        question: 'How do I share a scenario with a colleague?',
        answer: 'Click the "Share" button on the scenario card. A URL link will be generated that you can copy and send. The recipient will see the scenario automatically when they open the link.',
    },
    {
        category: 'Shortcuts',
        question: 'What keyboard shortcuts are available?',
        answer: 'Ctrl+Z (undo), Ctrl+Shift+Z (redo), Ctrl+F (search), N (new scenario), Ctrl+1-9 (view calendar), ? (help), Esc (close).',
    },
];

const HelpPage: React.FC = () => {
    const { lang, t } = useI18n();
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    const faq = lang === 'pt' ? FAQ_PT : FAQ_EN;
    const sections = t.helpPage.sections;
    const sectionIcons = [BarChart3, Calculator, Users, Calendar, FileText, Settings];
    const shortcuts = [
        'Ctrl + Z', 'Ctrl + Shift + Z', 'Ctrl + F', 'N', 'Ctrl + 1-9', 'Alt + ↑/↓', '?', 'Esc',
    ];

    // Group FAQ by category
    const faqByCategory = faq.reduce((acc, item, i) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push({ ...item, index: i });
        return acc;
    }, {} as Record<string, Array<FAQItem & { index: number }>>);

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <HelpCircle className="w-8 h-8 text-blue-400" />
                    {t.helpPage.title}
                </h1>
                <p className="text-gray-400">
                    {t.helpPage.subtitle}
                </p>
            </div>

            {/* Quick Start */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/20 p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                    {t.helpPage.quickStart}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {t.helpPage.quickSteps.map((item, i) => (
                        <div key={i} className="text-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-white font-bold">{i + 1}</span>
                            </div>
                            <p className="text-white font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Sections */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                    {t.helpPage.features}
                </h2>
                <div className="space-y-3">
                    {sections.map((section, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                            <button
                                onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-700/50 transition-colors"
                            >
                                <span className="text-blue-400">{React.createElement(sectionIcons[i])}</span>
                                <span className="text-white font-medium flex-1">{section.title}</span>
                                {expandedSection === i ? (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            {expandedSection === i && (
                                <div className="px-4 pb-4 text-sm text-gray-400 border-t border-gray-700 pt-3">
                                    {section.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="mb-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Keyboard className="w-5 h-5 text-blue-400" />
                    {t.helpPage.keyboardShortcuts}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {shortcuts.map((keys, i) => (
                        <div key={keys} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                            <span className="text-sm text-gray-400">{t.helpPage.shortcuts[i]}</span>
                            <kbd className="bg-gray-600 border border-gray-500 text-gray-300 text-xs px-2 py-1 rounded font-mono">
                                {keys}
                            </kbd>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                    {t.helpPage.faqTitle}
                </h2>
                {Object.entries(faqByCategory).map(([category, items]) => (
                    <div key={category} className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">{category}</h3>
                        <div className="space-y-2">
                            {items.map(item => (
                                <div key={item.index} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFAQ(openFAQ === item.index ? null : item.index)}
                                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-700/50 transition-colors"
                                    >
                                        <span className="text-white font-medium flex-1 text-sm">{item.question}</span>
                                        {openFAQ === item.index ? (
                                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        )}
                                    </button>
                                    {openFAQ === item.index && (
                                        <div className="px-4 pb-4 text-sm text-gray-400 border-t border-gray-700 pt-3">
                                            {item.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
                <h2 className="text-xl font-semibold text-white mb-2">
                    {t.helpPage.stillQuestions}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                    {t.helpPage.contactText}
                </p>
                <a
                    href="https://github.com/khwx/Factory-schedules"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    GitHub
                </a>
            </div>
        </div>
    );
};

export default HelpPage;
