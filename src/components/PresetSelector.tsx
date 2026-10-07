import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, ChevronDown, Plus, Filter, X } from 'lucide-react';
import { PRESET_SCENARIOS, PresetScenario } from '../data/presetScenarios';
import { useI18n } from '../i18n';
import { Translations } from '../i18n/locales/pt';

const INDUSTRY_KEY_MAP: Record<string, keyof Translations['presetSelector']['industries']> = {
    'Indústria / Fabrico': 'manufacturing',
    'Petróleo / Gás': 'oilGas',
    'Segurança Privada': 'privateSecurity',
    'Bombeiros': 'firefighters',
    'Call Center': 'callCenter',
    'Mineração': 'mining',
    'Marítimo / Portuário': 'maritime',
    'Aviação / Aeroportos': 'aviation',
    'Indústria Alimentar': 'foodIndustry',
    'Farmacêutica': 'pharma',
    'Siderurgia / Metalurgia': 'steel',
    'Energia / Elétrica': 'energy',
    'Data Center / TI': 'dataCenter',
    'Saúde / Hospitalar': 'healthcare',
    'Hotelaria / Restauração': 'hospitality',
    'Retalho / Comércio': 'retail',
    'Logística / Transportes': 'logistics',
    'Educação / Escolas': 'education',
    'Administração Pública': 'publicAdmin',
    'Telecomunicações / NOC': 'telecom',
    'Serviços Emergência Médica': 'ems',
    'Segurança Pública': 'publicSafety',
    'Gestão de Resíduos': 'wasteManagement',
    'Energia Renovável': 'renewableEnergy',
    'Casino / Entretenimento': 'casino',
    'Hidrogénio Verde': 'greenHydrogen',
    'Data Center IA': 'aiDataCenter',
    'Logística Última Milha': 'lastMileLogistics',
    'Biotecnologia': 'biotech',
    'Aeroespacial': 'aerospace',
    'Semicondutores': 'semiconductors',
    'Veículos Elétricos': 'evBattery',
    'Cibersegurança': 'cybersecurity',
    'Ferroviário': 'railway',
    'Portos / Logística Portuária': 'portLogistics',
    'Água e Saneamento': 'waterUtilities',
    'Gás Natural': 'gasDistribution',
    'Telecom / Serviços Campo': 'telecomField',
    'Serviços Funerários': 'funeralServices',
    'Segurança Eletrónica': 'electronicSecurity',
    'Manutenção Industrial': 'industrialMaintenance',
    'Emergency Dispatch': 'emergencyDispatch',
    'Controle Tráfego Aéreo': 'airTrafficControl',
    'Metropolitano': 'metroOperations',
    'Oleodutos / Gasodutos': 'pipelineOperations',
    'Central Nuclear': 'nuclearPower',
    'Banco de Sangue': 'bloodBank',
    'Procura Órgãos': 'organProcurement',
    'Estabelecimento Prisional': 'correctionalFacility',
    'Operações Espaciais': 'spaceOperations',
    'Defesa Aérea': 'airDefense',
    'Ciberdefesa Militar': 'militaryCyberDefense',
    'Operações Navais': 'navalOperations',
    'Defesa de Mísseis': 'missileDefense',
    'Operações Satélites': 'satelliteOperations',
    'Comando Estratégico': 'strategicCommand',
    'Logística Defesa': 'defenseLogistics',
    'Oncologia': 'oncology',
    'Hemodiálise': 'hemodialysis',
    'Cuidados Paliativos': 'palliativeCare',
    'Saúde Mental': 'mentalHealth',
    'Unidade Queimados': 'burnUnit',
    'Neonatologia': 'neonatology',
    'Medicina Nuclear': 'nuclearMedicine',
    'Radioterapia': 'radiationTherapy',
    'Semicondutores Avançados': 'advancedSemiconductors',
    'Energia de Fusão': 'fusionEnergy',
    'Captura de Carbono': 'carbonCapture',
    'Computação Quântica': 'quantumComputing',
    'Materiais Avançados': 'advancedMaterials',
};

interface PresetSelectorProps {
    onLoadPreset: (preset: PresetScenario) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ onLoadPreset }) => {
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const industries = useMemo(() => {
        const uniqueIndustries = [...new Set(PRESET_SCENARIOS.map(p => p.industry).filter(Boolean))];
        return ['all', ...uniqueIndustries.sort()] as string[];
    }, []);

    const filteredPresets = useMemo(() => {
        if (selectedIndustry === 'all') return PRESET_SCENARIOS;
        return PRESET_SCENARIOS.filter(p => p.industry === selectedIndustry);
    }, [selectedIndustry]);

    const getIndustryLabel = (industry: string): string => {
        const key = INDUSTRY_KEY_MAP[industry];
        if (key && t.presetSelector.industries[key]) {
            return t.presetSelector.industries[key];
        }
        return industry;
    };

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
                        const next = prev < filteredPresets.length - 1 ? prev + 1 : 0;
                        itemRefs.current[next]?.scrollIntoView({ block: 'nearest' });
                        return next;
                    });
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setActiveIndex(prev => {
                        const next = prev > 0 ? prev - 1 : filteredPresets.length - 1;
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
                    setActiveIndex(filteredPresets.length - 1);
                    itemRefs.current[filteredPresets.length - 1]?.scrollIntoView({ block: 'nearest' });
                    break;
                case 'Enter':
                case ' ':
                    if (activeIndex >= 0) {
                        e.preventDefault();
                        onLoadPreset(filteredPresets[activeIndex]);
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
    }, [isOpen, activeIndex, close, onLoadPreset, filteredPresets]);

    useEffect(() => {
        if (isOpen && activeIndex >= 0) {
            itemRefs.current[activeIndex]?.focus();
        }
    }, [isOpen, activeIndex]);

    useEffect(() => {
        setActiveIndex(-1);
    }, [selectedIndustry]);

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
                    <span>{t.presetSelector.title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    ref={listRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden max-h-[500px] overflow-y-auto"
                    role="listbox"
                    aria-label={t.a11y.exampleScenarios}
                >
                    <div className="p-3 border-b border-gray-700 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <label htmlFor="preset-industry-filter" className="text-sm text-gray-300">{t.presetSelector.industryLabel}</label>
                        <select
                            id="preset-industry-filter"
                            value={selectedIndustry}
                            onChange={e => setSelectedIndustry(e.target.value)}
                            className="ml-2 flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={t.presetSelector.industryLabel}
                        >
                            <option value="all">{t.presetSelector.allIndustries}</option>
                            {industries.filter(i => i !== 'all').map(industry => (
                                <option key={industry} value={industry}>{getIndustryLabel(industry)}</option>
                            ))}
                        </select>
                        {selectedIndustry !== 'all' && (
                            <button
                                onClick={() => setSelectedIndustry('all')}
                                className="text-gray-400 hover:text-white p-1"
                                aria-label={t.presetSelector.clearFilter}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {filteredPresets.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                {t.presetSelector.noScenariosFound}
                            </div>
                        ) : (
                            filteredPresets.map((preset, index) => (
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
                                            {preset.industry && (
                                                <span className="inline-block px-2 py-0.5 text-xs bg-blue-900/50 text-blue-300 rounded mb-2">
                                                    {getIndustryLabel(preset.industry)}
                                                </span>
                                            )}
                                            <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
                                                <span>{preset.teams} {t.presetSelector.teams}</span>
                                                <span>{t.presetSelector.shiftDuration}: {preset.shiftDuration}h</span>
                                                <span>{t.presetSelector.contract}: {preset.weeklyHoursContract}h/sem</span>
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
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PresetSelector;