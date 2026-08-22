import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Keyboard, Calculator, Calendar, Users, FileText, BarChart3, Settings } from 'lucide-react';
import { useI18n } from '../i18n';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const HelpPage: React.FC = () => {
    const { t } = useI18n();
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    const faq = t.helpPage.faq;
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
