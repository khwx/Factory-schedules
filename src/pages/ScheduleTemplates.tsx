import React, { useState } from 'react';
import { BookOpen, Plus, Download, Factory, Hospital, ShoppingCart, Building, Utensils, Wrench } from 'lucide-react';
import { useI18n } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import { Scenario } from '../types';

interface IndustryTemplate {
    id: string;
    name: string;
    nameEn: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    descriptionEn: string;
    scenarios: Array<{
        name: string;
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
        name: 'Industria / Fabrico',
        nameEn: 'Manufacturing',
        icon: <Factory className="w-6 h-6" />,
        color: 'bg-blue-600',
        description: 'Turnos continuos 24/7 para fabrico industrial',
        descriptionEn: 'Continuous 24/7 shifts for industrial manufacturing',
        scenarios: [
            {
                name: '4 Equipas - 2 Turnos (8h)',
                teams: 4,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMTTNNFF',
                teamPatterns: ['MMTTNNFF', 'NNFFMMTT', 'TTNNFFMM', 'FFMMTTNN'],
            },
            {
                name: '3 Equipas - 3 Turnos (8h)',
                teams: 3,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMTTNN',
                teamPatterns: ['MMTTNN', 'NNMMTT', 'TTNNMM'],
            },
            {
                name: '5 Equipas - 4 Turnos (7h)',
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
        name: 'Saude / Hospitalar',
        nameEn: 'Healthcare',
        icon: <Hospital className="w-6 h-6" />,
        color: 'bg-green-600',
        description: 'Cobertura 24h com enfermeiros e medicos',
        descriptionEn: '24h coverage with nurses and doctors',
        scenarios: [
            {
                name: '3 Equipas - 12h (Enfermagem)',
                teams: 3,
                shiftDuration: 12,
                weeklyHoursContract: 36,
                pattern: 'NNNFFFMMMFFF',
                teamPatterns: ['NNNFFFMMMFFF', 'MMMFFFNNNFFF', 'FFFNNNMMMFFF'],
            },
            {
                name: '4 Equipas - 8h (Hospital)',
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
        name: 'Retalho / Comercio',
        nameEn: 'Retail',
        icon: <ShoppingCart className="w-6 h-6" />,
        color: 'bg-purple-600',
        description: 'Horarios para lojas e centros comerciais',
        descriptionEn: 'Schedules for shops and shopping centers',
        scenarios: [
            {
                name: '3 Equipas - 6 dias/semana',
                teams: 3,
                shiftDuration: 8,
                weeklyHoursContract: 48,
                pattern: 'MMMMMMF',
                teamPatterns: ['MMMMMMF', 'FMMMMMM', 'MMFMMMM'],
            },
            {
                name: '2 Equipas - Turnos Rotativos',
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
        name: 'Escritorio / Servicos',
        nameEn: 'Office',
        icon: <Building className="w-6 h-6" />,
        color: 'bg-yellow-600',
        description: 'Horarios de escritorio com flexibilidade',
        descriptionEn: 'Office schedules with flexibility',
        scenarios: [
            {
                name: '1 Equipa - 5x2 (Horario Comercial)',
                teams: 1,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMMMMFF',
            },
            {
                name: '2 Equipas - Horario Flexivel',
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
        name: 'Hotelaria / Restauracao',
        nameEn: 'Hospitality',
        icon: <Utensils className="w-6 h-6" />,
        color: 'bg-orange-600',
        description: 'Turnos para hoteis e restaurantes',
        descriptionEn: 'Shifts for hotels and restaurants',
        scenarios: [
            {
                name: '3 Equipas - Pequeno Hotel',
                teams: 3,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMMTTNNNFF',
                teamPatterns: ['MMMTTNNNFF', 'NNNFFMMMTT', 'TTNNNFFMMM'],
            },
            {
                name: '2 Equipas - Restaurante',
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
        name: 'Logistica / Transportes',
        nameEn: 'Logistics',
        icon: <Wrench className="w-6 h-6" />,
        color: 'bg-red-600',
        description: 'Turnos para armazens e distribuicao',
        descriptionEn: 'Shifts for warehouses and distribution',
        scenarios: [
            {
                name: '4 Equipas - Armazem 24h',
                teams: 4,
                shiftDuration: 8,
                weeklyHoursContract: 40,
                pattern: 'MMTTNNFF',
                teamPatterns: ['MMTTNNFF', 'TTNNFFMM', 'NNFFMMTT', 'FFMMTTNN'],
            },
            {
                name: '3 Equipas - Distribuicao',
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
    const { lang } = useI18n();
    const { showToast } = useToast();
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

    const handleImport = (template: IndustryTemplate['scenarios'][0]) => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        const existing: Scenario[] = saved ? JSON.parse(saved) : [];

        const newScenario: Scenario = {
            id: crypto.randomUUID(),
            name: template.name,
            teams: template.teams,
            shiftDuration: template.shiftDuration,
            weeklyHoursContract: template.weeklyHoursContract,
            pattern: template.pattern,
            teamPatterns: template.teamPatterns,
        };

        localStorage.setItem('shiftsim_scenarios', JSON.stringify([...existing, newScenario]));
        showToast('success', lang === 'pt' ? `"${template.name}" adicionado!` : `"${template.name}" added!`);
    };

    const handleImportAll = (template: IndustryTemplate) => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        const existing: Scenario[] = saved ? JSON.parse(saved) : [];

        const newScenarios = template.scenarios.map(s => ({
            ...s,
            id: crypto.randomUUID(),
        }));

        localStorage.setItem('shiftsim_scenarios', JSON.stringify([...existing, ...newScenarios]));
        showToast('success', lang === 'pt' ? `${newScenarios.length} cenarios adicionados!` : `${newScenarios.length} scenarios added!`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                    {lang === 'pt' ? 'Modelos por Industria' : 'Industry Templates'}
                </h1>
                <p className="text-gray-400">
                    {lang === 'pt'
                        ? 'Escolha um modelo pre-configurado para o seu setor e importe directamente.'
                        : 'Choose a pre-configured template for your industry and import directly.'}
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
                                    {lang === 'pt' ? template.name : template.nameEn}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {lang === 'pt' ? template.description : template.descriptionEn}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {template.scenarios.length} {lang === 'pt' ? 'modelos disponiveis' : 'templates available'}
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
                                                {lang === 'pt' ? template.name : template.nameEn}
                                            </h2>
                                            <p className="text-sm text-gray-400">
                                                {lang === 'pt' ? template.description : template.descriptionEn}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleImportAll(template)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        {lang === 'pt' ? 'Importar Todos' : 'Import All'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {template.scenarios.map((scenario, i) => (
                                        <div key={i} className="bg-gray-700/50 rounded-lg border border-gray-600 p-4">
                                            <h4 className="text-white font-medium mb-2">{scenario.name}</h4>
                                            <div className="space-y-1 text-sm text-gray-400 mb-4">
                                                <p>{scenario.teams} {lang === 'pt' ? 'equipas' : 'teams'} &bull; {scenario.shiftDuration}h</p>
                                                <p>{lang === 'pt' ? 'Contrato' : 'Contract'}: {scenario.weeklyHoursContract}h</p>
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
                                                {lang === 'pt' ? 'Importar' : 'Import'}
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
                    {lang === 'pt' ? 'Como Funciona' : 'How It Works'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-xl">1</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">{lang === 'pt' ? 'Escolha a Industria' : 'Choose Industry'}</h3>
                        <p className="text-sm text-gray-400">{lang === 'pt' ? 'Selecione o setor que mais se aproxima da sua necessidade.' : 'Select the sector closest to your need.'}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-xl">2</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">{lang === 'pt' ? 'Importe o Modelo' : 'Import Template'}</h3>
                        <p className="text-sm text-gray-400">{lang === 'pt' ? 'Importe um ou varios modelos para o seu dashboard.' : 'Import one or more templates to your dashboard.'}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-xl">3</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">{lang === 'pt' ? 'Personalize' : 'Customize'}</h3>
                        <p className="text-sm text-gray-400">{lang === 'pt' ? 'Ajuste os padroes, equipas e configuracoes ao seu gosto.' : 'Adjust patterns, teams, and settings to your liking.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleTemplates;
