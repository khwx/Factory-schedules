import React, { useState } from 'react';
import { BookOpen, Plus, Download, Factory, Hospital, ShoppingCart, Building, Utensils, Wrench } from 'lucide-react';
import { useI18n } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import { Scenario } from '../types';
import type { Translations } from '../i18n/locales/pt';

type StKey = keyof Translations['scheduleTemplates'];

interface IndustryTemplate {
    id: string;
    icon: React.ReactNode;
    color: string;
    nameKey: StKey;
    descKey: StKey;
    scenarios: Array<{
        nameKey: StKey;
        teams: number;
        shiftDuration: number;
        weeklyHoursContract: number;
        pattern: string;
        teamPatterns?: string[];
    }>;
}

const TEMPLATES: IndustryTemplate[] = [
    {
        id: 'manufacturing',
        nameKey: 'industryManufacturingName',
        descKey: 'industryManufacturingDesc',
        icon: <Factory className="w-6 h-6" />,
        color: 'bg-blue-600',
        scenarios: [
            {
                nameKey: 'templateMfg4Teams2Shifts',
                teams: 4,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMTTNNFF',
                teamPatterns: ['MMTTNNFF', 'NNFFMMTT', 'TTNNFFMM', 'FFMMTTNN'],
            },
            {
                nameKey: 'templateMfg3Teams3Shifts',
                teams: 3,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMTTNN',
                teamPatterns: ['MMTTNN', 'NNMMTT', 'TTNNMM'],
            },
            {
                nameKey: 'templateMfg5Teams4Shifts',
                teams: 5,
                shiftDuration: 7,
                weeklyHoursContract: 35,
                pattern: 'MMMMFFTTTTFFNNNNFFFF',
                teamPatterns: [
                    'MMMMFFTTTTFFNNNNFFFF',
                    'FFTTTTFFNNNNFFFFMMMM',
                    'TTFFNNNNFFFFMMMMFFTT',
                    'NNFFFFMMMMFFTTTTFFNN',
                    'FFFFMMMMFFTTTTFFNNNN',
                ],
            },
        ],
    },
    {
        id: 'healthcare',
        nameKey: 'industryHealthcareName',
        descKey: 'industryHealthcareDesc',
        icon: <Hospital className="w-6 h-6" />,
        color: 'bg-green-600',
        scenarios: [
            {
                nameKey: 'templateHealthcare3Teams12h',
                teams: 3,
                shiftDuration: 12,
                weeklyHoursContract: 36,
                pattern: 'NNNFFFMMMFFF',
                teamPatterns: ['NNNFFFMMMFFF', 'MMMFFFNNNFFF', 'FFFNNNMMMFFF'],
            },
            {
                nameKey: 'templateHealthcare4Teams8h',
                teams: 4,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMTTNNFF',
                teamPatterns: ['MMTTNNFF', 'TTNNFFMM', 'NNFFMMTT', 'FFMMTTNN'],
            },
        ],
    },
    {
        id: 'retail',
        nameKey: 'industryRetailName',
        descKey: 'industryRetailDesc',
        icon: <ShoppingCart className="w-6 h-6" />,
        color: 'bg-purple-600',
        scenarios: [
            {
                nameKey: 'templateRetail3Teams6Days',
                teams: 3,
                shiftDuration: 8,
                weeklyHoursContract: 48,
                pattern: 'MMMMMMF',
                teamPatterns: ['MMMMMMF', 'FMMMMMM', 'MMFMMMM'],
            },
            {
                nameKey: 'templateRetail2TeamsRotating',
                teams: 2,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMMMTTTTNNNNFF',
                teamPatterns: ['MMMMTTTTNNNNFF', 'NNNNFFMMMMTTTT'],
            },
        ],
    },
    {
        id: 'office',
        nameKey: 'industryOfficeName',
        descKey: 'industryOfficeDesc',
        icon: <Building className="w-6 h-6" />,
        color: 'bg-yellow-600',
        scenarios: [
            {
                nameKey: 'templateOffice1Team5x2',
                teams: 1,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMMMMFF',
            },
            {
                nameKey: 'templateOffice2TeamsFlexible',
                teams: 2,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMMMMFF',
                teamPatterns: ['MMMMMFF', 'FFMMMMM'],
            },
        ],
    },
    {
        id: 'hospitality',
        nameKey: 'industryHospitalityName',
        descKey: 'industryHospitalityDesc',
        icon: <Utensils className="w-6 h-6" />,
        color: 'bg-orange-600',
        scenarios: [
            {
                nameKey: 'templateHospitality3Teams',
                teams: 3,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMMTTNNNFF',
                teamPatterns: ['MMMTTNNNFF', 'NNNFFMMMTT', 'TTNNNFFMMM'],
            },
            {
                nameKey: 'templateHospitality2Teams',
                teams: 2,
                shiftDuration: 6,
                weeklyHoursContract: 36,
                pattern: 'MMMMMMFFFF',
                teamPatterns: ['MMMMMMFFFF', 'FFFFMMMMMM'],
            },
        ],
    },
    {
        id: 'logistics',
        nameKey: 'industryLogisticsName',
        descKey: 'industryLogisticsDesc',
        icon: <Wrench className="w-6 h-6" />,
        color: 'bg-red-600',
        scenarios: [
            {
                nameKey: 'templateLogistics4Teams',
                teams: 4,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMTTNNFF',
                teamPatterns: ['MMTTNNFF', 'TTNNFFMM', 'NNFFMMTT', 'FFMMTTNN'],
            },
            {
                nameKey: 'templateLogistics3Teams',
                teams: 3,
                shiftDuration: 10,
                weeklyHoursContract: 40,
                pattern: 'MMMTTTNNN',
                teamPatterns: ['MMMTTTNNN', 'NNNMMMTTT', 'TTTNNNMMM'],
            },
        ],
    },
];

const ScheduleTemplates: React.FC = () => {
    const { t } = useI18n();
    const { showToast } = useToast();
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

    const handleImport = (template: IndustryTemplate['scenarios'][0]) => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        const existing: Scenario[] = saved ? JSON.parse(saved) : [];

        const newScenario: Scenario = {
            id: crypto.randomUUID(),
            name: t.scheduleTemplates[template.nameKey],
            teams: template.teams,
            shiftDuration: template.shiftDuration,
            weeklyHoursContract: template.weeklyHoursContract,
            pattern: template.pattern,
            teamPatterns: template.teamPatterns,
        };

        localStorage.setItem('shiftsim_scenarios', JSON.stringify([...existing, newScenario]));
        showToast('success', t.scheduleTemplates.toastAdded.replace('{name}', t.scheduleTemplates[template.nameKey]));
    };

    const handleImportAll = (template: IndustryTemplate) => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        const existing: Scenario[] = saved ? JSON.parse(saved) : [];

        const newScenarios = template.scenarios.map(s => ({
            id: crypto.randomUUID(),
            name: t.scheduleTemplates[s.nameKey],
            teams: s.teams,
            shiftDuration: s.shiftDuration,
            weeklyHoursContract: s.weeklyHoursContract,
            pattern: s.pattern,
            teamPatterns: s.teamPatterns,
        }));

        localStorage.setItem('shiftsim_scenarios', JSON.stringify([...existing, ...newScenarios]));
        showToast('success', t.scheduleTemplates.toastScenariosAdded.replace('{count}', String(newScenarios.length)));
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                    {t.scheduleTemplates.title}
                </h1>
                <p className="text-gray-400">
                    {t.scheduleTemplates.subtitle}
                </p>
            </div>

            {/* Industry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {TEMPLATES.map(template => (
                    <button
                        key={template.id}
                        onClick={() => setSelectedIndustry(selectedIndustry === template.id ? null : template.id)}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                            selectedIndustry === template.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${template.color} text-white`}>
                                {template.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold text-lg">
                                    {t.scheduleTemplates[template.nameKey]}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {t.scheduleTemplates[template.descKey]}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {template.scenarios.length} {t.scheduleTemplates.templatesAvailable}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Selected Industry Templates */}
            {selectedIndustry && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    {(() => {
                        const template = TEMPLATES.find(t => t.id === selectedIndustry);
                        if (!template) return null;

                        return (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${template.color} text-white`}>
                                            {template.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-white">
                                                {t.scheduleTemplates[template.nameKey]}
                                            </h2>
                                            <p className="text-sm text-gray-400">
                                                {t.scheduleTemplates[template.descKey]}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleImportAll(template)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        {t.scheduleTemplates.importAll}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {template.scenarios.map((scenario, i) => (
                                        <div key={i} className="bg-gray-700/50 rounded-lg border border-gray-600 p-4">
                                            <h4 className="text-white font-medium mb-2">{t.scheduleTemplates[scenario.nameKey]}</h4>
                                            <div className="space-y-1 text-sm text-gray-400 mb-4">
                                                <p>{scenario.teams} {t.scheduleTemplates.teamsUnit} &bull; {scenario.shiftDuration}h</p>
                                                <p>{t.scheduleTemplates.contract}: {scenario.weeklyHoursContract}h</p>
                                                <p className="font-mono text-xs">{scenario.pattern}</p>
                                            </div>

                                            {/* Pattern Preview */}
                                            <div className="flex h-3 rounded overflow-hidden mb-4">
                                                {scenario.pattern.split('').map((ch, j) => (
                                                    <div
                                                        key={j}
                                                        className={`flex-1 ${
                                                            ch === 'M' ? 'bg-yellow-500'
                                                                : ch === 'T' ? 'bg-orange-500'
                                                                : ch === 'N' ? 'bg-blue-600'
                                                                : 'bg-gray-600'
                                                        }`}
                                                    />
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => handleImport(scenario)}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                {t.scheduleTemplates.import}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}

            {/* Quick Start Guide */}
            <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                    {t.scheduleTemplates.howItWorks}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-xl">1</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">{t.scheduleTemplates.step1Title}</h3>
                        <p className="text-sm text-gray-400">{t.scheduleTemplates.step1Desc}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-xl">2</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">{t.scheduleTemplates.step2Title}</h3>
                        <p className="text-sm text-gray-400">{t.scheduleTemplates.step2Desc}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-xl">3</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">{t.scheduleTemplates.step3Title}</h3>
                        <p className="text-sm text-gray-400">{t.scheduleTemplates.step3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleTemplates;
