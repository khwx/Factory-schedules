export interface PresetScenario {
    name: string;
    description: string;
    teams: number;
    shiftDuration: number;
    weeklyHoursContract: number;
    pattern: string;
    teamPatterns?: string[]; // Optional: individual patterns for each team
    startDate?: string; // ISO date string (YYYY-MM-DD)
}

export const PRESET_SCENARIOS: PresetScenario[] = [
    {
        name: 'Horário 5x3x5x4x5x3',
        description: '5 equipas - Ciclo de 25 dias (5M-3F-5T-4F-5N-3F)',
        teams: 5,
        shiftDuration: 8.75,
        weeklyHoursContract: 37.5,
        pattern: 'MMMMMFFFTTTTTFFFFNNNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMMFFFTTTTTFFFFNNNNNFFF', // Team A
            'NNFFFMMMMMFFFTTTTTFFFFNNN', // Team B (Offset 20)
            'FFNNNNNFFFMMMMMFFFTTTTTFF', // Team C (Offset 15)
            'TTTFFFFNNNNNFFFMMMMMFFFTT', // Team D (Offset 10)
            'FFFTTTTTFFFFNNNNNFFFMMMMM', // Team E (Offset 5)
        ]
    },
    {
        name: 'Horário 4.2.4.2.4.4',
        description: '5 equipas - 4 manhãs, 2 folgas, 4 tardes, 2 folgas, 4 noites, 4 folgas',
        teams: 5,
        shiftDuration: 8.93,
        weeklyHoursContract: 37.5,
        pattern: 'MMMMFFTTTTFFNNNNFFFF',
        startDate: '2024-01-01',
        teamPatterns: [
            'MMMMFFTTTTFFNNNNFFFF', // Team A
            'FFTTTTFFNNNNFFFFMMMM', // Team B (Offset 4)
            'TTFFNNNNFFFFMMMMFFTT', // Team C (Offset 8)
            'NNFFFFMMMMFFTTTTFFNN', // Team D (Offset 12)
            'FFFFMMMMFFTTTTFFNNNN', // Team E (Offset 16)
        ]
    },
    {
        name: 'Horário 3.2',
        description: '5 equipas - 3 noites, 2 folgas, 3 tardes, 2 folgas, 3 manhãs, 2 folgas',
        teams: 5,
        shiftDuration: 8.93,
        weeklyHoursContract: 37.5,
        pattern: 'NNNFFTTTFFMMMFF',
        startDate: '2024-01-01',
        teamPatterns: [
            'NNNFFTTTFFMMMFF', // Team A
            'FFTTTFFMMMFFNNN', // Team B (Offset 3)
            'TTFFMMMFFNNNFFT', // Team C (Offset 6)
            'FMMMFFNNNFFTTTF', // Team D (Offset 9)
            'MFFNNNFFTTTFFMM', // Team E (Offset 12)
        ]
    },
    {
        name: 'Horário Veralia',
        description: '5 equipas - Ciclo de 210 dias (Extraído de ICS)',
        teams: 5,
        shiftDuration: 8.93,
        weeklyHoursContract: 37.5,
        pattern: 'MMMFFNNNNFTTTFFMMMMFNNNNFFTTTFMMMFFNNNNNFFFFFFFMMMMFFFNNNNFTTTTFFMMMFNNNNFFTTTTFMMMFFNNNNFTTTTFFMMMFNNNNFTTTTTFFFFFFFMMMFFFFTTTTFMMFFFFNNNFTTTTFFFFFFFNNNFFTTTTFFFMMFFNNNFTTTTFFMMMMFFFFFFFMMMMFFFMMMMFNNNNFFTTTFM',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMFFNNNNFTTTFFMMMMFNNNNFFTTTFMMMFFNNNNNFFFFFFFMMMMFFFNNNNFTTTTFFMMMFNNNNFFTTTTFMMMFFNNNNFTTTTFFMMMFNNNNFTTTTTFFFFFFFMMMFFFFTTTTFMMFFFFNNNFTTTTFFFFFFFNNNFFTTTTFFFMMFFNNNFTTTTFFMMMMFFFFFFFMMMMFFFMMMMFNNNNFFTTTFM', // Team A
            'TTFMMFFFFNNNFTTTTFFFFFFFNNNFFTTTTFFFMMFFNNNFTTTTFFFMMMFFFFFFFMMMMFFFMMMMFNNNNFFTTTFMMMMFFNNNNFTTTFFMMMMFNNNNFFTTTFMMMFFNNNNNFFFFFFFMMMMFFFNNNNFTTTTFFMMMFNNNNFFTTTTFMMMFFNNNNFTTTTFFMMMFNNNNFTTTTTFFFFFFFMMMFFFFTT', // Team B
            'FFFFFMMMMFFFNNNNFTTTTFFMMMFNNNNFFTTTTFMMMFFNNNNFTTTTFFMMMFNNNNFTTTTTFFFFFFFMMMFFFFTTTTFMMFFFFNNNFTTTTFFFFFFFNNNFFTTTTFFFMMFFNNNFTTTTFFFMMMFFFFFFFMMMMFFFMMMMFNNNNFFTTTFMMMMFFNNNNFTTTFFMMMMFNNNNFFTTTFMMMFFNNNNNFF', // Team C
            'NFTTTTFFFMMMFFFFFFFMMMMFFFMMMMFNNNNFFTTTFMMMMFFNNNNFTTTFFMMMMFNNNNFFTTTFMMMFFNNNNNFFFFFFFMMMMFFFNNNNFTTTTFFTTTFNNNNFFTTTTFMMMFFNNNNFTTTTFFFFFFNNNNFTTTTTFFFFFFFMMMFFFFTTTTFMMFFFFNNNFTTTTFFFFFFFNNNFFTTTTFFFMMFFNN', // Team D
            'FNNNNFTTTTFFMMMFNNNNFTTTTTFFFFFFFMMMFFFFTTTTFMMFFFFNNNFTTTTFFFFFFFNNNFFTTTTFFFMMFFNNNFTTTTFFFMMMFFFFFFFMMMMFFFMMMMFNNNNFFTTTFMMMMFFNNNNFTTTFFMMMMFNNNNFFTTTFMMMFFNNNNNFFFFFFFMMMFFFFNNNNFTTTTFFMMMFNNNNFFTTTTFMMMF'  // Team E
        ]
    },
    {
        name: 'Current',
        description: '4 equipas - Ciclo de 28 dias (Manhãs, Tardes, Noites)',
        teams: 4,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'TFNNNNMFMMMMMFMTTTTFNNNFFFTT',
        startDate: '2025-01-01',
        teamPatterns: [
            'TFNNNNMFMMMMMFMTTTTFNNNFFFTT', // Team A
            'NNFFFTTTFNNNNMFMMMMMFMTTTTFN', // Team B
            'MTTTTFNNNFFFTTTFNNNNMFMMMMMF', // Team C
            'FMMMMMFMTTTTFNNNFFFTTTFNNNNM', // Team D
        ],
    },
    {
        name: 'Horário 25 Dias (Equilibrado)',
        description: '5 equipas - Ciclo 25 dias (5M-2F-5T-4F-5N-4F). Blocos de 5 dias de trabalho.',
        teams: 5,
        shiftDuration: 8.75,
        weeklyHoursContract: 37.5,
        pattern: 'MMMMMFFTTTTTFFFFNNNNNFFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMMFFTTTTTFFFFNNNNNFFFF', // Team A
            'FFTTTTTFFFFNNNNNFFFFMMMMM', // Team B (Offset 5)
            'TTTTTFFFFNNNNNFFFFMMMMMFF', // Team C (Offset 10)
            'FFFFNNNNNFFFFMMMMMFFTTTTT', // Team D (Offset 15)
            'NNNNNFFFFMMMMMFFTTTTTFFFF', // Team E (Offset 20)
        ]
    },
    {
        name: 'Horário 30 Dias (Blocos Longos)',
        description: '5 equipas - Ciclo 30 dias (6M-5F-6T-5F-6N-2F). Máximo 6 dias trabalho, 5 folgas.',
        teams: 5,
        shiftDuration: 8.75,
        weeklyHoursContract: 37.5,
        pattern: 'MMMMMMFFFFFTTTTTTFFFFFNNNNNNFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMMMFFFFFTTTTTTFFFFFNNNNNNFF', // Team A
            'FFFFFTTTTTTFFFFFNNNNNNFFMMMMMM', // Team B (Offset 6)
            'TTTTTTFFFFFNNNNNNFFMMMMMMFFFFF', // Team C (Offset 12)
            'FFFFFNNNNNNFFMMMMMMFFFFFTTTTTT', // Team D (Offset 18)
            'NNNNNNFFMMMMMMFFFFFTTTTTTFFFFF', // Team E (Offset 24)
        ]
    },
    // Oil & Gas / Petrochemical - 24/7 continuous operations
    {
        name: 'Oil & Gas - 12h Rotativo (4 Equipas)',
        description: 'Petroquímica - 4 equipas, turnos 12h, rotação dia/noite (Panama / 2-2-3)',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO', // D=Day, N=Night, O=Off (using M/D for day, N for night, F for off)
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOODDNNOO', // Team A: 2 dia, 2 noite, 2 off
            'OODDNNOODDNN', // Team B (offset 2)
            'NNOODDNNOODD', // Team C (offset 4)
            'DDOODDNNOODD', // Team D (offset 6)
        ]
    },
    // Security / Surveillance - 24/7 coverage
    {
        name: 'Segurança / Vigilância - 8h Rotativo (3 Equipas)',
        description: 'Segurança patrimonial - 3 equipas, 3 turnos 8h, rotação semanal',
        teams: 3,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMFFF', // Team A: 3 manhãs, 3 folgas
            'TTTFFF', // Team B: 3 tardes, 3 folgas
            'NNNFFF', // Team C: 3 noites, 3 folgas
        ]
    },
    // Emergency Services - Fire/Police
    {
        name: 'Bombeiros / Emergência - 24h On/Off (4 Equipas)',
        description: 'Serviços emergência - 4 equipas, turno 24h (1 dia trabalho, 3 off)',
        teams: 4,
        shiftDuration: 24,
        weeklyHoursContract: 48,
        pattern: 'MFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MFFF', // Team A
            'FMFF', // Team B
            'FFMF', // Team C
            'FFF', // Team D (will be 'FFFM')
        ]
    },
    // Call Centers - Multi-timezone coverage
    {
        name: 'Contact Center - Cobertura Fuso Horário (5 Equipas)',
        description: 'Call center internacional - 5 equipas para cobertura 24h com picos',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A
            'OOOOMMMMTTTTNNNN', // Team B (offset 4)
            'NNNNOOOOMMMMTTTT', // Team C (offset 8)
            'TTTNNNNOOOOMMMM', // Team D (offset 12)
            'MMMTTTTNNNNOOOO', // Team E (offset 16)
        ]
    },
    // Mining - 12-hour rotating shifts
    {
        name: 'Mineração - 12h FIFO 2/1 (2 Equipas)',
        description: 'Mineração - 2 equipas fly-in/fly-out, 12h dia/noite, 2 on 1 off',
        teams: 2,
        shiftDuration: 12,
        weeklyHoursContract: 84,
        pattern: 'DDNN',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNN', // Team A: 2 dias, 2 noites
            'NNDD', // Team B: 2 noites, 2 dias
        ]
    },
    // Maritime / Shipping - Watch system
    {
        name: 'Marítimo / Navios - Sistema de Quartos (3 Quartos)',
        description: 'Marinha mercante - 3 quartos (watch), 4h on / 8h off rotativo',
        teams: 3,
        shiftDuration: 4,
        weeklyHoursContract: 56,
        pattern: 'MFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MFFF', // Watch 1
            'FMFF', // Watch 2
            'FFMF', // Watch 3
        ]
    },
    // Aviation - Ground crew / ATC
    {
        name: 'Aviação - Controle Tráfego / Solo (4 Equipas)',
        description: 'ATC / Solo aeroporto - 4 equipas, turnos 8h, rotação contínua 24/7',
        teams: 4,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFFF', // Team A
            'NNNFFFMMMTTT', // Team B
            'TTTNNNFFFMMM', // Team C
            'FFFMMMTTTNNN', // Team D
        ]
    },
    // Food Processing - Continuous production
    {
        name: 'Indústria Alimentar - Produção Contínua (5 Equipas)',
        description: 'Processamento alimentos - 5 equipas, 3 turnos 8h, limpeza entre turnos',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFFF', // Team A
            'FFFMMMTTTNNN', // Team B
            'NNNFFFMMMTTT', // Team C
            'TTTNNNFFFMMM', // Team D
            'MMMTTTNNNFFF', // Team E (repetido para 5ª equipa)
        ]
    },
    // Pharmaceutical - GMP cleanroom shifts
    {
        name: 'Farmacêutica - Sala Limpa GMP (3 Equipas)',
        description: 'Produção farmacêutica - 3 equipas, turnos 8h com gowning time',
        teams: 3,
        shiftDuration: 8.5,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFFF', // Team A
            'NNNFFFMMMTTT', // Team B
            'TTTNNNFFFMMM', // Team C
        ]
    },
    // Steel / Metalworking
    {
        name: 'Siderurgia / Metalurgia - Alto Forno (4 Equipas)',
        description: 'Produção aço - 4 equipas, turnos 12h contínuos (sem parada)',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 48,
        pattern: 'DDNN',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNN', // Team A
            'NNDD', // Team B
            'DDNN', // Team C (mesmo A para cobertura)
            'NNDD', // Team D
        ]
    },
    // Utilities / Power Plant
    {
        name: 'Energia / Central Termoelétrica (4 Equipas)',
        description: 'Geração energia - 4 equipas, operação 24/7, turnos 12h',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 48,
        pattern: 'DDNNOO', // Panama schedule
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A
            'OODDNN', // Team B
            'NNOODD', // Team C
            'DDOONN', // Team D
        ]
    },
    // Data Center Operations
    {
        name: 'Data Center - NOC/SOC 24x7 (4 Equipas)',
        description: 'Operações datacenter - 4 equipas, turnos 12h (Panama), monitoramento contínuo',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A
            'OODDNN', // Team B
            'NNOODD', // Team C
            'DDOONN', // Team D
        ]
    },
];
