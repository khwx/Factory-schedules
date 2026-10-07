export interface PresetScenario {
    name: string;
    description: string;
    teams: number;
    shiftDuration: number;
    weeklyHoursContract: number;
    pattern: string;
    teamPatterns?: string[]; // Optional: individual patterns for each team
    startDate?: string; // ISO date string (YYYY-MM-DD)
    industry?: string; // Industry category for filtering
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
        ],
        industry: 'Indústria / Fabrico'
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
        ],
        industry: 'Indústria / Fabrico'
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
        ],
        industry: 'Indústria / Fabrico'
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
        ],
        industry: 'Indústria / Fabrico'
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
        industry: 'Indústria / Fabrico'
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
        ],
        industry: 'Indústria / Fabrico'
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
        ],
        industry: 'Indústria / Fabrico'
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
        ],
        industry: 'Petróleo / Gás'
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
        ],
        industry: 'Segurança Privada'
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
        ],
        industry: 'Bombeiros'
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
        ],
        industry: 'Call Center'
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
        ],
        industry: 'Mineração'
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
        ],
        industry: 'Marítimo / Portuário'
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
        ],
        industry: 'Aviação / Aeroportos'
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
        ],
        industry: 'Indústria Alimentar'
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
        ],
        industry: 'Farmacêutica'
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
        ],
        industry: 'Siderurgia / Metalurgia'
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
        ],
        industry: 'Energia / Elétrica'
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
        ],
        industry: 'Data Center / TI'
    },
    // Healthcare / Hospital - Nursing shifts
    {
        name: 'Saúde / Hospital - Enfermagem 12h (4 Equipas)',
        description: 'Hospital - 4 equipas enfermagem, turnos 12h, rotação dia/noite (2-2-3)',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 36,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: 2 dia, 2 noite, 2 off
            'OODDNN', // Team B
            'NNOODD', // Team C
            'DDOONN', // Team D
        ],
        industry: 'Saúde / Hospitalar'
    },
    // Healthcare / Hospital - Medical residents
    {
        name: 'Saúde / Hospital - Médicos Residentes (5 Equipas)',
        description: 'Internato médico - 5 equipas, turnos 24h plantão, escala 1x4',
        teams: 5,
        shiftDuration: 24,
        weeklyHoursContract: 60,
        pattern: 'MFFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MFFFF', // Team A
            'FMFFF', // Team B
            'FFMFF', // Team C
            'FFF MF', // Team D (FFFMF)
            'FFFFM', // Team E
        ],
        industry: 'Saúde / Hospitalar'
    },
    // Hospitality / Hotel - Front desk
    {
        name: 'Hotelaria / Hotel - Recepção 8h (3 Equipas)',
        description: 'Hotel 24h - 3 equipas recepção, turnos 8h (manhã/tarde/noite) rotativo',
        teams: 3,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFFF', // Team A
            'NNNFFFMMMTTT', // Team B
            'TTTNNNFFFMMM', // Team C
        ],
        industry: 'Hotelaria / Restauração'
    },
    // Hospitality / Hotel - Housekeeping
    {
        name: 'Hotelaria / Hotel - Governantas (2 Equipas)',
        description: 'Limpeza quartos - 2 equipas, turno único manhã, fim-de-semana rotativo',
        teams: 2,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMMMFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMMFF', // Team A: seg-sex, folgas fim-semana alternados
            'FFMMMMM', // Team B: fim-semana, folgas seg-sex alternados
        ],
        industry: 'Hotelaria / Restauração'
    },
    // Retail / Supermarket
    {
        name: 'Retalho / Supermercado - Horário Alargado (4 Equipas)',
        description: 'Supermercado 12h/dia - 4 equipas, turnos 6h/8h mistos, cobertura picos',
        teams: 4,
        shiftDuration: 7,
        weeklyHoursContract: 35,
        pattern: 'MMMTTTNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFFF', // Team A: manhã + tarde
            'FFFMMMTTTNNN', // Team B: tarde + noite
            'NNNFFFMMMTTT', // Team C: noite + manhã
            'TTTNNNFFFMMM', // Team D: swing shift
        ],
        industry: 'Retalho / Comércio'
    },
    // Logistics / Warehouse
    {
        name: 'Logística / Armazém - 3 Turnos 8h (3 Equipas)',
        description: 'Centro distribuição - 3 equipas, 3 turnos 8h contínuos, sem paragem',
        teams: 3,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFFF', // Team A
            'NNNFFFMMMTTT', // Team B
            'TTTNNNFFFMMM', // Team C
        ],
        industry: 'Logística / Transportes'
    },
    // Transportation / Public Transit - Bus drivers
    {
        name: 'Transportes / Autocarros - Motoristas (5 Equipas)',
        description: 'Rede urbana - 5 equipas motoristas, turnos 8h/10h mistos, picos manhã/tarde',
        teams: 5,
        shiftDuration: 8.5,
        weeklyHoursContract: 39,
        pattern: 'MMMTTTNNNFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFF', // Team A: pico manhã
            'FFMMMTTTNNN', // Team B: pico tarde
            'NFFMMMTTTNN', // Team C: noite
            'NNFMMMTTTNN', // Team D: swing
            'NNNFFMMMTTT', // Team E: reserva/extra
        ],
        industry: 'Logística / Transportes'
    },
    // Manufacturing / Automotive - Assembly line
    {
        name: 'Indústria Automóvel - Linha Montagem (4 Equipas)',
        description: 'Fábrica automóvel - 4 equipas, 3 turnos 8h, pausa manutenção fim-semana',
        teams: 4,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFFF', // Team A
            'FFFMMMTTTNNN', // Team B
            'NNNFFFMMMTTT', // Team C
            'TTTNNNFFFMMM', // Team D
        ],
        industry: 'Indústria / Fabrico'
    },
    // Chemical Plant - Continuous process
    {
        name: 'Química / Petroquímica - Processo Contínuo (4 Equipas)',
        description: 'Planta química - 4 equipas, turnos 12h contínuos (Panama 2-2-3)',
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
        ],
        industry: 'Petróleo / Gás'
    },
    // Water Treatment - 24/7 monitoring
    {
        name: 'Tratamento Água / ETAR - Monitoramento 24h (3 Equipas)',
        description: 'Estação tratamento - 3 equipas, turnos 8h, monitoramento contínuo parâmetros',
        teams: 3,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFFF', // Team A
            'NNNFFFMMMTTT', // Team B
            'TTTNNNFFFMMM', // Team C
        ],
        industry: 'Energia / Elétrica'
    },
    // Education / Schools - Teachers and admin staff
    {
        name: 'Educação / Escolas - Professores e Staff (2 Equipas)',
        description: 'Escola pública - 2 equipas administrativas, turno único manhã, cobertura férias escalonada',
        teams: 2,
        shiftDuration: 7,
        weeklyHoursContract: 35,
        pattern: 'MMMMMFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMMFF', // Team A: seg-sex, admin manhã
            'MMMMMFF', // Team B: seg-sex, admin tarde (sobreposição almoço)
        ],
        industry: 'Educação / Escolas'
    },
    // Public Administration - Citizen services
    {
        name: 'Administração Pública - Balcão Atendimento (3 Equipas)',
        description: 'Serviços públicos - 3 equipas, turno único 7h, rotação balcão/backoffice',
        teams: 3,
        shiftDuration: 7,
        weeklyHoursContract: 35,
        pattern: 'MMMMMFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMMFF', // Team A: balcão manhã
            'MMMMMFF', // Team B: backoffice + balcão tarde
            'MMMMMFF', // Team C: suporte + pico almoço
        ],
        industry: 'Administração Pública'
    },
    // Telecommunications - NOC
    {
        name: 'Telecomunicações - NOC 24x7 (4 Equipas)',
        description: 'Network Operations Center - 4 equipas, turnos 12h (Panama), monitoramento rede contínuo',
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
        ],
        industry: 'Telecomunicações / NOC'
    },
    // Emergency Medical Services - SAMU
    {
        name: 'SAMU / Emergência Médica - Ambulâncias (4 Equipas)',
        description: 'Serviço móvel urgência - 4 equipas, turnos 12h/24h mistos, cobertura geográfica',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 48,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: área norte
            'OODDNN', // Team B: área sul
            'NNOODD', // Team C: área centro
            'DDOONN', // Team D: reserva/apoio
        ],
        industry: 'Serviços Emergência Médica'
    },
    // Public Safety - Police
    {
        name: 'Segurança Pública / Polícia - Patrulha 8h (5 Equipas)',
        description: 'Polícia preventiva - 5 equipas, 3 turnos 8h, reforço fins-semana/noite',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFF', // Team A: patrulha dia
            'FFMMMTTTNNN', // Team B: patrulha tarde
            'NFFMMMTTTNN', // Team C: patrulha noite
            'NNFMMMTTTNN', // Team D: investigação + apoio
            'NNNFFMMMTTT', // Team E: operações especiais
        ],
        industry: 'Segurança Pública'
    },
    // Waste Management
    {
        name: 'Gestão Resíduos - Coleta/Tratamento (3 Equipas)',
        description: 'Coleta lixo/reciclagem - 3 equipas, turno manhã cedo 6h, fim-semana rotativo',
        teams: 3,
        shiftDuration: 6,
        weeklyHoursContract: 36,
        pattern: 'MMMMMMF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMMMF', // Team A: rota segunda-sábado
            'FMMMMMM', // Team B: rota terça-domingo
            'MFMMMMM', // Team C: rota quarta-segunda
        ],
        industry: 'Gestão de Resíduos'
    },
    // Renewable Energy - Solar/Wind monitoring
    {
        name: 'Energia Renovável - Solar/Eólica 24h (3 Equipas)',
        description: 'Parques eólico/solar - 3 equipas, turnos 8h, monitoramento SCADA contínuo',
        teams: 3,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFFF', // Team A
            'NNNFFFMMMTTT', // Team B
            'TTTNNNFFFMMM', // Team C
        ],
        industry: 'Energia Renovável'
    },
    // Casino / Entertainment 24/7
    {
        name: 'Casino / Entretenimento - Operação 24h (4 Equipas)',
        description: 'Casino resort - 4 equipas, turnos 12h (Panama), cobertura mesa/jogos contínua',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: piso jogos
            'OODDNN', // Team B: vigilância
            'NNOODD', // Team C: atendimento clientes
            'DDOONN', // Team D: operações/caixa
        ],
        industry: 'Casino / Entretenimento'
    },
    // Green Hydrogen - 24/7 electrolysis monitoring
    {
        name: 'Hidrogénio Verde - Eletrólise 24/7 (4 Equipas)',
        description: 'Produção H2 verde - 4 equipas, turnos 12h, monitoramento contínuo de eletrólitos',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: sala controle eletrólise
            'OODDNN', // Team B: manutenção preventiva
            'NNOODD', // Team C: qualidade gás/pureza
            'DDOONN', // Team D: logística compressão
        ],
        industry: 'Hidrogénio Verde'
    },
    // AI Data Centers - GPU cluster monitoring
    {
        name: 'Data Center IA - Clusters GPU 24/7 (4 Equipas)',
        description: 'Datacenter IA - 4 equipas, turnos 12h, monitoramento GPU/cooling contínuo',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: operações cluster treino
            'OODDNN', // Team B: cooling/energia
            'NNOODD', // Team C: rede/storage
            'DDOONN', // Team D: segurança/modelos
        ],
        industry: 'Data Center IA'
    },
    // Last-mile Logistics - Delivery optimization
    {
        name: 'Logística Última Milha - Entregas (5 Equipas)',
        description: 'Entrega urbana - 5 equipas, turnos 8h/10h, picos e-commerce, rotas dinâmicas',
        teams: 5,
        shiftDuration: 9,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFF', // Team A: rota centro manhã
            'FFMMMTTTNNN', // Team B: rota sul tarde
            'NFFMMMTTTNN', // Team C: rota norte noite
            'NNFMMMTTTNN', // Team D: rota oeste swing
            'NNNFFMMMTTT', // Team E: reserva/picos Black Friday
        ],
        industry: 'Logística Última Milha'
    },
    // Biotech / Advanced Pharma - Continuous bioprocessing
    {
        name: 'Biotecnologia - Bioprocessamento Contínuo (4 Equipas)',
        description: 'Bioprocessos - 4 equipas, turnos 12h, fermentadores/biorreatores 24/7 GMP',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: biorreatores upstream
            'OODDNN', // Team B: purificação downstream
            'NNOODD', // Team C: controle qualidade/analytics
            'DDOONN', // Team D: utilidades/esterilização
        ],
        industry: 'Biotecnologia'
    },
    // Aerospace / Space Launch - Mission control
    {
        name: 'Aeroespacial - Centro Controle Missão (4 Equipas)',
        description: 'Lançamento espacial - 4 equipas, turnos 12h, monitoramento veículo/telemetria',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: controle voo/guidance
            'OODDNN', // Team B: telemetria/comunicações
            'NNOODD', // Team C: sistemas propulsão
            'DDOONN', // Team D: range safety/meteorologia
        ],
        industry: 'Aeroespacial'
    },
    // Semiconductors / Fabs - Photolithography cleanroom
    {
        name: 'Semicondutores - Fab 24/7 Litografia (4 Equipas)',
        description: 'Fab semicondutores - 4 equipas, turnos 12h, sala limpa litografia EUV contínua',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: scanners EUV/ArF
            'OODDNN', // Team B: metrologia/inspeção
            'NNOODD', // Team C: track/coater/developer
            'DDOONN', // Team D: manutenção preventiva
        ],
        industry: 'Semicondutores'
    },
    // EV Battery Manufacturing - Gigafactory
    {
        name: 'Veículos Elétricos - Gigafactory Baterias (5 Equipas)',
        description: 'Produção baterias - 5 equipas, turnos 8h/12h mistos, linha contínua electrode/cell',
        teams: 5,
        shiftDuration: 10,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFF', // Team A: eletrodos (coating/calendering)
            'FFMMMTTTNNN', // Team B: montagem célula (stacking/winding)
            'NFFMMMTTTNN', // Team C: formação/envelhecimento
            'NNFMMMTTTNN', // Team C: módulo/pack
            'NNNFFMMMTTT', // Team E: qualidade/reciclagem
        ],
        industry: 'Veículos Elétricos'
    },
    // Cybersecurity / SOC - Security Operations Center
    {
        name: 'Cibersegurança - SOC 24/7 (4 Equipas)',
        description: 'Security Operations Center - 4 equipas, turnos 12h (Panama), monitoramento ameaças contínuo',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: triagem alertas Tier 1
            'OODDNN', // Team B: investigação Tier 2
            'NNOODD', // Team C: threat hunting/inteligência
            'DDOONN', // Team D: resposta incidente/forense
        ],
        industry: 'Cibersegurança'
    },
    // Ferroviário / Transportes Ferroviários - Centro Controle Tráfego
    {
        name: 'Ferroviário - Centro Controle Tráfego (4 Equipas)',
        description: 'Centro de controle tráfego ferroviário - 4 equipas, turnos 12h (Panama), sinalização/controle contínuo',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: controle tráfego principal
            'OODDNN', // Team B: sinalização/desvio
            'NNOODD', // Team C: monitoramento linha/estações
            'DDOONN', // Team D: emergência/incidentes via
        ],
        industry: 'Ferroviário'
    },
    // Portos / Logística Portuária - Operação 24/7
    {
        name: 'Portos - Operação 24/7 (4 Equipas)',
        description: 'Terminal portuário contentores - 4 equipas, turnos 12h (Panama), guindastes/logística contínua',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: operação guindastes cais
            'OODDNN', // Team B: pátio/contentores (stacking)
            'NNOODD', // Team C: gate/entrada-saída caminhões
            'DDOONN', // Team D: manutenção equipamentos/turno noite
        ],
        industry: 'Portos / Logística Portuária'
    },
    // Água e Saneamento - Tratamento 24h
    {
        name: 'Água e Saneamento - Tratamento 24h (3 Equipas)',
        description: 'ETA/ETE tratamento água/esgoto - 3 equipas, turnos 8h, monitoramento parâmetros contínuo',
        teams: 3,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: operação ETA (tratamento água)
            'NNNNOOOOMMMMTTTT', // Team B: operação ETE (tratamento esgoto)
            'TTTTNNNNOOOOMMMM', // Team C: laboratório/controle qualidade + SCADA
        ],
        industry: 'Água e Saneamento'
    },
    // Gás Natural - Distribuição Emergência
    {
        name: 'Gás Natural - Distribuição Emergência (4 Equipas)',
        description: 'Distribuição gás natural - 4 equipas, turnos 12h (Panama), resposta emergência + monitoramento rede',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: centro controle distribuição (SCADA)
            'OODDNN', // Team B: equipes campo - resposta vazamentos
            'NNOODD', // Team C: manutenção preventiva/corretiva rede
            'DDOONN', // Team D: emergência 24h / plantão regulação pressão
        ],
        industry: 'Gás Natural'
    },
    // Telecomunicações - Serviços de Campo
    {
        name: 'Telecom - Serviços Campo (5 Equipas)',
        description: 'Instalação/manutenção fibra/5G - 5 equipas, turnos 8h/10h mistos, picos demanda, agendamento dinâmico',
        teams: 5,
        shiftDuration: 9,
        weeklyHoursContract: 40,
        pattern: 'MMMMFFFFTTTTNNNN',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMFFFFTTTTNNNN', // Team A: instalação fibra residencial (manhã)
            'TTTTNNNNMMMMFFFF', // Team B: manutenção rede backbone (tarde/noite)
            'NNNNMMMMFFFFTTTT', // Team C: ativação 5K/small cells (noturno)
            'FFFFTTTTNNNNMMMM', // Team D: reparo emergencial (plantão rotativo)
            'MMMMMMMMFFFFFFFF', // Team E: comissionamento/TESTES (turno estendido 10h)
        ],
        industry: 'Telecom / Serviços Campo'
    },
    // Serviços Funerários - Plantão 24h
    {
        name: 'Serviços Funerários - Plantão 24h (3 Equipas)',
        description: 'Funerária/crematório - 3 equipas, turnos 12h/24h mistos, plantão remoção/atendimento contínuo',
        teams: 3,
        shiftDuration: 16,
        weeklyHoursContract: 40,
        pattern: 'DDNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOOOO', // Team A: remoção/translado (diurno 12h)
            'OODDNNNN', // Team B: preparação/velório + plantão noturno 24h
            'NNNNOODD', // Team C: cremação/operação forno + atendimento famílias
        ],
        industry: 'Serviços Funerários'
    },
    // Segurança Eletrónica - Central Alarmes
    {
        name: 'Segurança Eletrónica - Central Alarmes (4 Equipas)',
        description: 'Central monitoramento alarmes/CCTV - 4 equipas, turnos 12h (Panama), triagem eventos 24/7',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: triagem alarmes Tier 1 (falso/verdadeiro)
            'OODDNN', // Team B: despacho viaturas/acordo contratual
            'NNOODD', // Team C: monitoramento vídeo/CCTV ativo
            'DDOONN', // Team D: escalação polícia/bombeiros + relatórios
        ],
        industry: 'Segurança Eletrónica'
    },
    // Manutenção Industrial - Facilities 24/7
    {
        name: 'Manutenção Industrial - Facilities 24/7 (4 Equipas)',
        description: 'Facilities/manutenção fábrica - 4 equipas, turnos 12h (Panama), preventiva/preditiva/corretiva contínua',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: manutenção preventiva programada (CMMS)
            'OODDNN', // Team B: preditiva (vibração/termografia/óleo)
            'NNOODD', // Team C: corretiva emergencial / quebra-parada
            'DDOONN', // Team D: utilidades (vapor/ar comprimido/água gelada) + facilities
        ],
        industry: 'Manutenção Industrial'
    },
    // Emergency Dispatch / 911 - Central de Atendimento
    {
        name: 'Emergency Dispatch - Central 911 (4 Equipas)',
        description: 'Central atendimento emergência 911/112 - 4 equipas, turnos 12h (Panama), triagem chamadas despacho polícia/bombeiros/EMS',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: atendimento chamadas 911/112 (call taker)
            'OODDNN', // Team B: despacho recursos polícia/bombeiros/EMS (dispatcher)
            'NNOODD', // Team C: supervisão qualidade + backup rádio/telefone
            'DDOONN', // Team D: formação contínua + gestão incidentes críticos
        ],
        industry: 'Emergency Dispatch'
    },
    // Air Traffic Control - Controle Tráfego Aéreo
    {
        name: 'Controle Tráfego Aéreo - ATC (4 Equipas)',
        description: 'Torre/APP/ACC controlo tráfego aéreo - 4 equipas, turnos 12h (Panama), separação aeronaves + coordenação espaço aéreo',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: torre aeródromo (local/aproximação)
            'OODDNN', // Team B: controlo aproximação (APP) radar
            'NNOODD', // Team C: controlo área (ACC) rota/overflight
            'DDOONN', // Team D: coordenação FIR/UIR + gestão fluxo (ATFM)
        ],
        industry: 'Controle Tráfego Aéreo'
    },
    // Subway/Metro Operations - Metropolitano
    {
        name: 'Metropolitano - Operação 24h (4 Equipas)',
        description: 'Metro/Subway operação contínua - 4 equipas, turnos 12h (Panama), condução trens + sinalização + estações',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: operadores trens (condutores/ATO)
            'OODDNN', // Team B: controlo centro operações (OCC/SCADA)
            'NNOODD', // Team C: estações/acesso passageiros + bilhética
            'DDOONN', // Team D: manutenção via/energia/sinalização (janela noturna)
        ],
        industry: 'Metropolitano'
    },
    // Pipeline Operations - Oleodutos/Gasodutos
    {
        name: 'Oleodutos/Gasodutos - Monitoramento 24h (4 Equipas)',
        description: 'Centros controle oleodutos/gasodutos - 4 equipas, turnos 12h (Panama), SCADA detecção vazamentos + bombas/compressores',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: monitoramento SCADA pressão/vazão/temperatura
            'OODDNN', // Team B: operação bombas/compressores + válvulas bloqueio
            'NNOODD', // Team C: detecção vazamentos (fibra óptica/pressão) + resposta
            'DDOONN', // Team D: manutenção preventiva catódica/pigging + facilities
        ],
        industry: 'Oleodutos / Gasodutos'
    },
    // Nuclear Power Plant Operations - Central Nuclear
    {
        name: 'Central Nuclear - Operação 24/7 (5 Equipas)',
        description: 'Central nuclear energia - 5 equipas, turnos 8h/12h mistos, operação reator + segurança radiológica + regulatório',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: operadores sala controle (SRO/RO) - licença NRC
            'NNNNOOOOMMMMTTTT', // Team B: engenharia reator + proteção radiológica (RP)
            'TTTTNNNNOOOOMMMM', // Team C: sistemas segurança (ECCS/RHR/EDG) + testes vigilância
            'OOOOMMMMTTTTNNNN', // Team D: química/química radiológica + tratamento resíduos
            'MMMMMMMMMMMMMMMM', // Team E: turno longo (12h) fim semana/feriado - supervisor plantão
        ],
        industry: 'Central Nuclear'
    },
    // Blood Bank / Transfusion Services - Banco de Sangue
    {
        name: 'Banco de Sangue - Serviços Transfusão 24h (3 Equipas)',
        description: 'Banco sangue/hemoterapia - 3 equipas, turnos 8h/12h mistos, colheita/processamento/distribuição + imunohematologia',
        teams: 3,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: colheita doadores (móvel/fixo) + triagem clínica
            'NNNNOOOOMMMMTTTT', // Team B: processamento componentes (hemácias/plasma/plaquetas) + QC
            'TTTTNNNNOOOOMMMM', // Team C: imunohematologia (tipagem/triagem anticorpos) + emissão hemoderivados
        ],
        industry: 'Banco de Sangue'
    },
    // Organ Procurement / Transplant Coordination - Procura Órgãos
    {
        name: 'Procura Órgãos - Coordenação Transplante 24h (3 Equipas)',
        description: 'OPO/organ procurement - 3 equipas, turnos 12h/24h mistos, avaliação doadores + cirurgia recuperação + logística órgãos',
        teams: 3,
        shiftDuration: 16,
        weeklyHoursContract: 40,
        pattern: 'DDNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOOOO', // Team A: coordenação hospitalar (identificação/avaliação doadores)
            'OODDNNNN', // Team B: recuperação cirúrgica órgãos (equipa móvel) + preservação
            'NNNNOODD', // Team C: alocação/match (lista espera) + transporte/logística fria
        ],
        industry: 'Procura Órgãos'
    },
    // Correctional Facility / Prison Operations - Estabelecimento Prisional
    {
        name: 'Estabelecimento Prisional - Segurança 24/7 (4 Equipas)',
        description: 'Prisão/estabelecimento prisional - 4 equipas, turnos 12h (Panama), vigilância perímetro + celas + escoltas + reinserção',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: vigilância muralhas/perímetro + torres + CCTV
            'OODDNN', // Team B: gestão celas/pavilhões (contagens/revistas/reações)
            'NNOODD', // Team C: escoltas externas (hospital/tribunal/transferências) + admissões
            'DDOONN', // Team D: programas reinserção (educação/trabalho/terapia) + administração
        ],
        industry: 'Estabelecimento Prisional'
    },
    // Space Operations Center - Centro Operações Espaciais
    {
        name: 'Operações Espaciais - Centro Controle Missão (4 Equipas)',
        description: 'Centro operações espaciais - 4 equipas, turnos 12h (Panama), monitoramento satélites/veículos lançamento + telemetria',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: controle voo orbital / rendezvous
            'OODDNN', // Team B: telemetria / comando / TT&C
            'NNOODD', // Team C: dinâmica orbital / prevenção colisão (SSA)
            'DDOONN', // Team D: operações carga útil / experimentos científicos
        ],
        industry: 'Operações Espaciais'
    },
    // Air Defense - Defesa Aérea
    {
        name: 'Defesa Aérea - Comando Controle (4 Equipas)',
        description: 'Defesa aérea integrada - 4 equipas, turnos 12h (Panama), vigilância radar + interceptação + C2',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: vigilância radar 3D / consciência situacional
            'OODDNN', // Team B: controle interceptação / scrambling
            'NNOODD', // Team C: identificação amigo/inimigo (IFF) + ROE
            'DDOONN', // Team D: gestão espaço aéreo / coordenação civil-militar
        ],
        industry: 'Defesa Aérea'
    },
    // Military Cyber Defense - Ciberdefesa Militar
    {
        name: 'Ciberdefesa Militar - SOC Defesa (4 Equipas)',
        description: 'Centro operações cibernéticas defesa - 4 equipas, turnos 12h (Panama), monitoramento ameaças APT + resposta incidente',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: monitoramento rede militar / detecção intrusão
            'OODDNN', // Team B: análise malware / engenharia reversa
            'NNOODD', // Team C: threat hunting / inteligência ameaças (CTI)
            'DDOONN', // Team D: resposta incidente / forense digital / hardening
        ],
        industry: 'Ciberdefesa Militar'
    },
    // Naval Operations - Operações Navais
    {
        name: 'Operações Navais - Centro Combate (4 Equipas)',
        description: 'Centro operações navais - 4 equipas, turnos 12h (Panama), consciência situacional marítima + guerra anti-submarino',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: vigilância superfície / AIS / radar marítimo
            'OODDNN', // Team B: guerra anti-submarino (ASW) / sonares
            'NNOODD', // Team C: guerra aérea naval / defesa antimíssil
            'DDOONN', // Team D: comando força-tarefa / logística / comunicações
        ],
        industry: 'Operações Navais'
    },
    // Missile Defense - Defesa de Mísseis
    {
        name: 'Defesa de Mísseis - Alerta Antecipado (3 Equipas)',
        description: 'Sistema defesa antimísseis - 3 equipas, turnos 8h/12h mistos, alerta antecipado + interceptação exo-atmosférica',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: radares alerta antecipado (UEWR/SBIRS) / track
            'NNNNOOOOMMMMTTTT', // Team B: comando lançamento interceptores / C2BMC
            'TTTTNNNNOOOOMMMM', // Team C: discriminação alvo / kill assessment / BDA
        ],
        industry: 'Defesa de Mísseis'
    },
    // Satellite Operations - Operações de Satélites
    {
        name: 'Operações Satélites - Controle Constelação (4 Equipas)',
        description: 'Controle constelação satélites - 4 equipas, turnos 12h (Panama), TT&C + manutenção orbital + gestão carga útil',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: telemetria/comando (TT&C) passes contato solo
            'OODDNN', // Team B: determinação órbita / manobras station-keeping
            'NNOODD', // Team C: operações carga útil (comms/EO/SAR/GNSS)
            'DDOONN', // Team D: gestão constelação / planejamento passes / anomalias
        ],
        industry: 'Operações Satélites'
    },
    // Strategic Command - Comando Estratégico
    {
        name: 'Comando Estratégico - Centro Operações (3 Equipas)',
        description: 'Comando estratégico nacional - 3 equipas, turnos 12h/24h mistos, C2 nuclear/convencional + avaliação ameaças',
        teams: 3,
        shiftDuration: 16,
        weeklyHoursContract: 40,
        pattern: 'DDNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOOOO', // Team A: monitoramento indicadores estratégicos / DEFCON
            'OODDNNNN', // Team B: planejamento emprego forças / targeting
            'NNNNOODD', // Team C: comunicações sobrevivíveis / NC3 / continuidade governo
        ],
        industry: 'Comando Estratégico'
    },
    // Defense Logistics - Logística de Defesa
    {
        name: 'Logística Defesa - Sustentação 24/7 (4 Equipas)',
        description: 'Logística militar - 4 equipas, turnos 12h (Panama), cadeia suprimentos + manutenção equipamento + prontidão',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: gestão estoques / munições / combustíveis / peças
            'OODDNN', // Team B: manutenção nível depósito / revisão geral (MRO)
            'NNOODD', // Team C: transporte estratégico / aéreo / marítimo / ferroviário
            'DDOONN', // Team D: aquisição / contratação / prontidão industrial
        ],
        industry: 'Logística Defesa'
    },
    // Oncology - Quimioterapia 24/7
    {
        name: 'Oncologia - Quimioterapia 24/7 (4 Equipas)',
        description: 'Unidade oncologia - 4 equipas, turnos 12h (Panama), infusão quimioterápicos + monitoramento toxicidade + suporte',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: infusão quimioterapia dia (cadeiras/leitos)
            'OODDNN', // Team B: preparação citotóxicos / farmácia oncológica
            'NNOODD', // Team C: monitoramento toxicidade / urgências febris
            'DDOONN', // Team D: consultas seguimento / survivorship / paliativos
        ],
        industry: 'Oncologia'
    },
    // Hemodialysis Center - Centro Diálise
    {
        name: 'Hemodiálise - Centro Diálise (4 Equipas)',
        description: 'Centro hemodiálise - 4 equipas, turnos 12h, 3 sessões/dia (4h cada) + preparação máquinas/água',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: sessão manhã (6h-10h) + monitoramento
            'OODDNN', // Team B: sessão tarde (11h-15h) + acesso vascular
            'NNOODD', // Team C: sessão noite (16h-20h) + complicações
            'DDOONN', // Team D: preparação máquinas/RO + manutenção + triagem
        ],
        industry: 'Hemodiálise'
    },
    // Palliative Care - Hospice 24h
    {
        name: 'Cuidados Paliativos - Hospice 24h (3 Equipas)',
        description: 'Unidade paliativos/hospice - 3 equipas, turnos 12h/24h mistos, controle sintomas + suporte família + plantão',
        teams: 3,
        shiftDuration: 16,
        weeklyHoursContract: 40,
        pattern: 'DDNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOOOO', // Team A: cuidados diurnos + controle sintomas (12h)
            'OODDNNNN', // Team B: plantão noturno 24h + suporte família + óbitos
            'NNNNOODD', // Team C: admissões/alta + coordenação equipa multidisciplinar
        ],
        industry: 'Cuidados Paliativos'
    },
    // Mental Health - Psychiatric Unit
    {
        name: 'Saúde Mental - Unidade Psiquiátrica (4 Equipas)',
        description: 'Internamento psiquiátrico - 4 equipas, turnos 12h (Panama), observação contínua + grupos terapêuticos + contenção',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: observação enfermaria + medicação oral/IM
            'OODDNN', // Team B: grupos terapêuticos + atividades ocupacionais
            'NNOODD', // Team C: vigilância contínua risco suicídio/fuga + contenção
            'DDOONN', // Team D: admissões/altas + reunião clínica + família
        ],
        industry: 'Saúde Mental'
    },
    // Burn Unit - Unidade Queimados
    {
        name: 'Unidade Queimados - Burn Unit (3 Equipas)',
        description: 'Centro tratamento queimados - 3 equipas, turnos 8h/12h mistos, curativos complexos + reabilitação + UTI queimados',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: curativos complexos (banho/desbridamento) + UTI
            'NNNNOOOOMMMMTTTT', // Team B: enxertos/cirurgia + reabilitação precoce
            'TTTTNNNNOOOOMMMM', // Team C: monitoramento hemodinâmico + nutrição/infecção
        ],
        industry: 'Unidade Queimados'
    },
    // Neonatology - NICU
    {
        name: 'Neonatologia - UTI Neonatal (4 Equipas)',
        description: 'UTI neonatal - 4 equipas, turnos 12h (Panama), cuidados intensivos recém-nascidos + transporte neonatal',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: ventilação/CPAP + acesso vascular umbilical
            'OODDNN', // Team B: nutrição parenteral + fototerapia + triagem
            'NNOODD', // Team C: transporte neonatal (SAMU/helicóptero) + estabilização
            'DDOONN', // Team D: alta/seguimento + aconselhamento pais + kangaroo care
        ],
        industry: 'Neonatologia'
    },
    // Nuclear Medicine - Radiofarmácia
    {
        name: 'Medicina Nuclear - Radiofarmácia (3 Equipas)',
        description: 'Medicina nuclear - 3 equipas, turnos 8h/12h mistos, produção radiofármacos + PET/CT + terapia metabólica',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: síntese radiofármacos (GMP) + controle qualidade
            'NNNNOOOOMMMMTTTT', // Team B: PET/CT/SPECT + dosimetria + proteção radiológica
            'TTTTNNNNOOOOMMMM', // Team C: terapia metabólica (Lu-177/I-131) + alta proteção
        ],
        industry: 'Medicina Nuclear'
    },
    // Radiation Therapy - Linear Accelerators
    {
        name: 'Radioterapia - Aceleradores Lineares (4 Equipas)',
        description: 'Serviço radioterapia - 4 equipas, turnos 10h, planejamento tratamento + QA máquinas + sessões pacientes',
        teams: 4,
        shiftDuration: 10,
        weeklyHoursContract: 40,
        pattern: 'MMMMMFFFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMMFFFFF', // Team A: simulação CT + contorno alvo/órgãos risco
            'FFFFFMMMMM', // Team B: planejamento dosimétrico (IMRT/VMAT/SBRT) + QA
            'MMMMMFFFFF', // Team C: tratamento diário (linacs) + verificação imagem (IGRT)
            'FFFFFMMMMM', // Team D: braquiterapia + radiocirurgia + seguimento toxicidade
        ],
        industry: 'Radioterapia'
    },
    // Advanced Semiconductors - Advanced Packaging
    {
        name: 'Semicondutores Avançados - Empacotamento 3D/Chiplets (4 Equipas)',
        description: 'Advanced packaging - 4 equipas, turnos 12h, 3D stacking + chiplet integration + HBM bonding + test',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: wafer thinning + TSV etch + die attach
            'OOOOMMMMNNNN', // Team B: chiplet placement + reflow + underfill
            'NNNNOOOOMMMM', // Team C: HBM stacking + hybrid bonding + metrology
            'MMMMNNNNOOOO', // Team D: final test + singulation + ship prep
        ],
        industry: 'Semicondutores Avançados'
    },
    // Advanced Semiconductors - Wafer Test
    {
        name: 'Semicondutores Avançados - Teste Wafers/Final (4 Equipas)',
        description: 'Wafer probe & final test - 4 equipas, turnos 12h, probe card + burn-in + SLT + ATE',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMTTNNFF', // Team A: wafer sort (probe) + parametric test
            'TTNNFFMM', // Team B: burn-in board load/unload + HTOL
            'NNFFMMTT', // Team C: system level test (SLT) + ATE pattern debug
            'FFMMTTNN', // Team D: final test + mark/pack + datalog
        ],
        industry: 'Semicondutores Avançados'
    },
    // Fusion Energy - Tokamak Operations
    {
        name: 'Energia de Fusão - Operações Tokamak (4 Equipas)',
        description: 'Tokamak operations - 4 equipas, turnos 12h, plasma control + heating + diagnostics + cryogenics',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNN',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNN', // Team A: plasma control + magnetic config + fuelling
            'TTTTNNNNMMMM', // Team B: heating systems (NBI/ICRH/ECRH) + power supplies
            'NNNNMMMMTTTT', // Team C: diagnostics (magnetics/bolometry/TS) + data acquisition
            'MMMMTTTTNNNN', // Team D: cryogenics + vacuum + first wall conditioning
        ],
        industry: 'Energia de Fusão'
    },
    // Fusion Energy - Inertial Confinement
    {
        name: 'Energia de Fusão - Confinamento Inercial Laser (4 Equipas)',
        description: 'Laser fusion - 4 equipas, turnos 12h, laser drivers + target fab + diagnostics + chamber ops',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: laser alignment + pulse shaping + amplifier chain
            'NNNNOOOOMMMM', // Team B: target fabrication + metrology + cryo-layering
            'OOOOMMMMNNNN', // Team C: diagnostics (neutron/x-ray/optical) + data systems
            'MMMMNNNNOOOO', // Team D: chamber recovery + debris clearing + shot prep
        ],
        industry: 'Energia de Fusão'
    },
    // Carbon Capture - Direct Air Capture
    {
        name: 'Captura Carbono - Captura Direta Ar DAC (3 Equipas)',
        description: 'Direct Air Capture - 3 equipas, turnos 8h/12h mistos, contactores + sorbent regen + CO2 compressão',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: air contactor ops + fan control + sorbent monitoring
            'NNNNOOOOMMMM', // Team B: thermal swing regeneration + vacuum/steam systems
            'OOOOMMMMNNNN', // Team C: CO2 compression + dehydration + pipeline injection
        ],
        industry: 'Captura de Carbono'
    },
    // Carbon Capture - Point Source
    {
        name: 'Captura Carbono - Captura Fonte Pontual (4 Equipas)',
        description: 'Point source capture - 4 equipas, turnos 12h, absorção + regeneração solvente + compressão CO2',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMTTNNFF', // Team A: absorber column ops + flue gas conditioning
            'TTNNFFMM', // Team B: stripper/regenerator + reboiler + lean/rich solvent
            'NNFFMMTT', // Team C: CO2 compression train + dehydration + metering
            'FFMMTTNN', // Team D: solvent makeup + reclaim + emissions monitoring
        ],
        industry: 'Captura de Carbono'
    },
    // Quantum Computing - Cryogenic Operations
    {
        name: 'Computação Quântica - Operações Criogénicas (3 Equipas)',
        description: 'Quantum computing - 3 equipas, turnos 8h/12h mistos, dilution fridges + qubit control + error correction',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNN',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNN', // Team A: dilution fridge ops + cryogenics + wiring
            'TTTTNNNNMMMM', // Team B: qubit control electronics + microwave + flux bias
            'NNNNMMMMTTTT', // Team C: quantum error correction + calibration + benchmarking
        ],
        industry: 'Computação Quântica'
    },
    // Advanced Materials - Nanofabrication
    {
        name: 'Materiais Avançados - Nanofabricação 24/7 (4 Equipas)',
        description: 'Nanofabrication cleanroom - 4 equipas, turnos 12h, e-beam litho + ALD/CVD + etch + metrology',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: e-beam lithography + resist process + pattern transfer
            'NNNNOOOOMMMM', // Team B: ALD/CVD deposition + precursor management + thickness control
            'OOOOMMMMNNNN', // Team C: etch (RIE/ICP) + endpoint detection + profile control
            'MMMMNNNNOOOO', // Team D: metrology (SEM/AFM/ellipsometry) + defect inspection
        ],
        industry: 'Materiais Avançados'
    },
    // Biofabrication / Artificial Organs - Bioprinting
    {
        name: 'Biofabricação - Bioprinting 3D Órgãos (4 Equipas)',
        description: 'Biofabricação de órgãos - 4 equipas, turnos 12h, bioprinting 3D + cultura células + maturação + QC',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: design CAD + bioprinting multi-material
            'OODDNN', // Team B: cultura células estaminais + expansão + diferenciação
            'NNOODD', // Team C: biorreatores maturação + perfusão + monitoramento
            'DDOONN', // Team D: controlo qualidade (histologia/funcionalidade) + esterilização
        ],
        industry: 'Biofabricação'
    },
    // Space Mining - Asteroid Mining Operations
    {
        name: 'Mineração Espacial - Operações Asteroides (3 Equipas)',
        description: 'Mineração asteroides - 3 equipas, turnos 16h mistos, teleoperação robótica + processamento in-situ + logística orbital',
        teams: 3,
        shiftDuration: 16,
        weeklyHoursContract: 40,
        pattern: 'DDNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOOOO', // Team A: teleoperação robôs mineração + navegação autónoma
            'OODDNNNN', // Team B: processamento minério + extração água/metais + refinação
            'NNNNOODD', // Team C: logística orbital + transferência carga + manutenção sistemas
        ],
        industry: 'Mineração Espacial'
    },
    // Green Hydrogen - Distribution & Logistics
    {
        name: 'Hidrogénio Verde - Distribuição Logística (4 Equipas)',
        description: 'Distribuição H2 verde - 4 equipas, turnos 12h (Panama), compressão + transporte + postos abastecimento',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: compressão/liquefação + armazenamento alta pressão
            'OODDNN', // Team B: logística transporte (tubagem/camiões ISO) + rastreamento
            'NNOODD', // Team C: operação postos abastecimento + dispensadores 700bar
            'DDOONN', // Team D: manutenção rede + detecção fugas + certificação pureza
        ],
        industry: 'Hidrogénio Verde Distribuição'
    },
    // Biobanking / Cryopreservation
    {
        name: 'Biobanco - Criopreservação 24/7 (3 Equipas)',
        description: 'Biobanco clínico/investigação - 3 equipas, turnos 8h/12h, processamento amostras + armazenamento azoto líquido + gestão dados',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: receção/processamento amostras (sangue/tecidos/ADN)
            'NNNNOOOOMMMMTTTT', // Team B: criopreservação controlada + armazenamento LN2 (-196°C)
            'TTTTNNNNOOOOMMMM', // Team C: gestão LIMS + rastreabilidade + controlo qualidade + expedição
        ],
        industry: 'Biobanco / Criopreservação'
    },
    // Tissue Engineering / Regenerative Medicine
    {
        name: 'Engenharia Tecidos - Medicina Regenerativa (4 Equipas)',
        description: 'Medicina regenerativa - 4 equipas, turnos 12h, scaffolds + células + biorreatores + implantes personalizados',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: fabrico scaffolds (eletrófiação/impressão 3D) + biomateriais
            'OODDNN', // Team B: semeadura células + expansão + condicionamento mecânico
            'NNOODD', // Team C: biorreatores perfusão + monitoramento não-invasivo + maturação
            'DDOONN', // Team D: controlo qualidade (mecânico/biológico) + embalagem estéril + envio clínico
        ],
        industry: 'Engenharia de Tecidos'
    },
    // Cultured Food / Cellular Agriculture
    {
        name: 'Agricultura Celular - Carne Cultivada (4 Equipas)',
        description: 'Proteína cultivada - 4 equipas, turnos 12h, biorreatores escala industrial + meio cultura + colheita + processamento',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: linhas celulares + banco células mestre + controlo qualidade genómico
            'OODDNN', // Team B: biorreatores 50kL+ + otimização meio (sem soro) + perfusão
            'NNOODD', // Team C: colheita + separação células/medio + concentração + texturização
            'DDOONN', // Team D: processamento final (extrusão/corte) + segurança alimentar + embalagem
        ],
        industry: 'Agricultura Celular'
    },
    // Flow Chemistry / Continuous Pharma Manufacturing
    {
        name: 'Química de Fluxo - Farmacêutica Contínua (4 Equipas)',
        description: 'Síntese contínua fármacos - 4 equipas, turnos 12h, microrreatores + purificação inline + PAT + formulação',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: síntese fluxo contínuo (microrreatores) + telescoping reações
            'OODDNN', // Team B: purificação inline (cromatografia/extração/cristalização) + PAT
            'NNOODD', // Team C: formulação contínua (compressão/revestimento) + controlo dose
            'DDOONN', // Team D: controlo qualidade tempo real (NIR/Raman) + lote digital + GMP
        ],
        industry: 'Química de Fluxo'
    },
    // Metamaterials / Programmable Nanomaterials
    {
        name: 'Materiais Meta - Nanomateriais Programáveis (3 Equipas)',
        description: 'Metamateriais ativos - 3 equipas, turnos 8h/12h, nanoestruturação + propriedades tunáveis + integração dispositivos',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: nano-fabricação (litografia/focused ion beam) + meta-átomos
            'NNNNOOOOMMMM', // Team B: caracterização óptica/EM/terahertz + modelagem inversa
            'OOOOMMMMNNNN', // Team C: integração dispositivos (sensores/comunicações/energia) + testes campo
        ],
        industry: 'Materiais Meta'
    },
    // Floating Offshore Wind - Emerging renewable energy
    {
        name: 'Eólica Offshore Flutuante - Operações 24/7 (4 Equipas)',
        description: 'Parques eólicos flutuantes - 4 equipas, turnos 12h (Panama), monitoramento turbinas + cabos + fundações flutuantes',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: centro controle SCADA turbinas + performance
            'OODDNN', // Team B: inspeção ROV/subsea cabos dinâmicos + ancoragem
            'NNOODD', // Team C: manutenção pás/caixas multiplicadoras + helicóptero
            'DDOONN', // Team D: logística offshore + transferência tripulação + meteo
        ],
        industry: 'Eólica Offshore Flutuante'
    },
    // Small Modular Reactors (SMR) - Next-gen nuclear
    {
        name: 'Reactores Modulares Pequenos - SMR (4 Equipas)',
        description: 'SMR fábrica/módulo - 4 equipas, turnos 12h, fabricação modular + teste fábrica + comissionamento local',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: fabricação vaso pressão + soldagem automatizada
            'OODDNN', // Team B: integração sistemas segurança passiva + instrumentação
            'NNOODD', // Team C: teste fábrica (FAT) + simulação acidentes + QA nuclear
            'DDOONN', // Team D: transporte módulo + montagem local + comissionamento
        ],
        industry: 'Reactores Modulares Pequenos (SMR)'
    },
    // Carbon Utilization - CO2 to Products
    {
        name: 'Utilização Carbono - CO2 para Produtos (3 Equipas)',
        description: 'Conversão CO2 - 3 equipas, turnos 8h/12h, eletroquímica/catalítica + separação + purificação produtos (metanol/plásticos/combustíveis)',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: eletrolisadores CO2 + catálise + reatores fluxo
            'NNNNOOOOMMMMTTTT', // Team B: separação produtos (destilação/membranas) + purificação
            'TTTTNNNNOOOOMMMM', // Team C: controle qualidade + formulação final + certificação
        ],
        industry: 'Utilização de Carbono'
    },
    // Autonomous Vehicle Fleet Operations
    {
        name: 'Frota Veículos Autónomos - Depósito 24/7 (4 Equipas)',
        description: 'Robotaxi/camiões autónomos - 4 equipas, turnos 12h (Panama), carregamento + limpeza + manutenção sensores + teleoperação remota',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: operações carregamento (MW charging) + gestão energia
            'OODDNN', // Team B: limpeza interior/exterior + inspeção sensores LiDAR/câmaras
            'NNOODD', // Team C: manutenção preventiva/preditiva + atualizações OTA software
            'DDOONN', // Team D: teleoperação remota (reserva) + resposta incidentes + logística
        ],
        industry: 'Frota Veículos Autónomos'
    },
    // Space Situational Awareness / Orbital Debris
    {
        name: 'Consciência Espacial - Lixo Orbital (3 Equipas)',
        description: 'SSA/space traffic - 3 equipas, turnos 8h/12h, rastreamento objetos + prevenção colisão + remoção ativa detritos',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: radares/óptica rastreamento + catálogo objetos (catalogação)
            'NNNNOOOOMMMMTTTT', // Team B: análise conjunção + alertas colisão + manobras evasivas
            'TTTTNNNNOOOOMMMM', // Team C: operações remoção ativa (captura/de-orbit) + verificação
        ],
        industry: 'Consciência Espacial / Lixo Orbital'
    },
    // Synthetic Biology / Cell-Free Systems
    {
        name: 'Biologia Sintética - Sistemas Livres Células (3 Equipas)',
        description: 'CFPS biomanufacturing - 3 equipas, turnos 8h/12h, lisados celulares + síntese proteica sem células + purificação rápida',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: preparação lisados (E. coli/wheat germ) + controle qualidade
            'NNNNOOOOMMMM', // Team B: reatores CFPS + adição DNA/energia + monitoramento tempo real
            'OOOOMMMMNNNN', // Team C: purificação proteína (cromatografia inline) + formulação + QC
        ],
        industry: 'Biologia Sintética / Cell-Free'
    },
    // Hypersonic Test Facilities
    {
        name: 'Instalações Teste Hipersónico - Túneis Vento (3 Equipas)',
        description: 'Teste hipersónico Mach 5+ - 3 equipas, turnos 8h/12h, túneis vento arco/choque + instrumentação + modelagem CFD',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: operação túneis (driver gás/arc-jet) + condição fronteira
            'NNNNOOOOMMMM', // Team B: instrumentação (pressão/calor/velocidade) + aquisição dados alta velocidade
            'OOOOMMMMNNNN', // Team C: modelagem CFD/validação + preparação modelos + pós-teste
        ],
        industry: 'Testes Hipersónicos'
    },
    // Deep Sea / Subsea Operations
    {
        name: 'Operações Submarinas - Deep Sea (4 Equipas)',
        description: 'Óleo/gás/mineração/cabos mar profundos - 4 equipas, turnos 12h (Panama), ROV/AUV + intervenção subsea + monitoramento risers',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: pilotagem ROV trabalho + manipulação + inspeção visual/sonar
            'OODDNN', // Team B: intervenção subsea (válvulas/jumpers/tree) + tooling especializado
            'NNOODD', // Team C: monitoramento risers/flowlines + integridade estrutural + CP
            'DDOONN', // Team D: logística navio apoio + lançamento/recolha ROV + meteo/ondas
        ],
        industry: 'Operações Submarinas / Deep Sea'
    },
    // Ocean Carbon Capture - Direct Ocean Capture
    {
        name: 'Captura Carbono Oceânica - Captura Direta Oceano (3 Equipas)',
        description: 'DAC oceânica - 3 equipas, turnos 12h, contactores oceânicos + mineralização alcalinidade + monitoramento ambiental marinho',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: contactores água do mar + bombas + alcalinização controlada
            'NNNNOOOOMMMM', // Team B: precipitação carbonatos + separação sólidos + disposição
            'OOOOMMMMNNNN', // Team C: monitoramento pH/alcalinidade + ecotoxicologia + relatórios MRV
        ],
        industry: 'Captura Carbono Oceânica'
    },
    // Commercial Fusion Energy - Reactor Operations
    {
        name: 'Energia de Fusão Comercial - Operações Reator (4 Equipas)',
        description: 'Fusão comercial - 4 equipas, turnos 12h, plasma contínuo + criogenia + ciclo trítio + diagnóstico avançado',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: controle plasma (forma/posição/instabilidades) + aquecimento (NBI/ICRF/ECRH)
            'OODDNN', // Team B: criogenia (hélio superfluido) + supercondutores + blindagem nêutrons
            'NNOODD', // Team C: ciclo combustível (trítio breeding/recuperação) + vácuo + primeiros materiais
            'DDOONN', // Team D: diagnósticos avançados (bolômetro/neutrões/imagem) + proteção disruptiva
        ],
        industry: 'Energia de Fusão Comercial'
    },
    // Fault-Tolerant Quantum Computing - Error Correction
    {
        name: 'Computação Quântica Tolerante a Falhas - Correção Erros (3 Equipas)',
        description: 'QC tolerante a falhas - 3 equipas, turnos 12h, qubits lógicos + códigos superfície + decodificação tempo real + calibração',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: controle qubits físicos + portas Clifford + medição síndromes
            'NNNNOOOOMMMM', // Team B: decodificação (MWPM/neural) + feedback tempo real + correção lógica
            'OOOOMMMMNNNN', // Team C: calibração contínua (RB/GST) + caracterização ruído + benchmarking
        ],
        industry: 'Computação Quântica Tolerante a Falhas'
    },
    // Polymetallic Nodule Mining - Deep Sea
    {
        name: 'Mineração Nódulos Polimetálicos - Mar Profundo (4 Equipas)',
        description: 'Mineração fundo mar - 4 equipas, turnos 12h, veículos coletores + riser + processamento navio + monitoramento ambiental',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: operação veículos coletores (caterpillar/tracked) + navegação AUV
            'OODDNN', // Team B: sistema riser (bomba/ar comprimido) + separação nódulos/sedimento
            'NNOODD', // Team C: processamento navio (lavagem/classificação) + armazenamento + logística
            'DDOONN', // Team D: monitoramento plumas sedimento + biodiversidade + conformidade ISA
        ],
        industry: 'Mineração Nódulos Polimetálicos'
    },
    // Offshore Green Hydrogen Production
    {
        name: 'Hidrogénio Verde Offshore - Produção Marítima (3 Equipas)',
        description: 'H2 verde offshore - 3 equipas, turnos 12h, eletrólise eólica offshore + compressão + exportação pipeline/navio + segurança',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: eletrólise PEM/alcalina + retificação + purificação H2
            'NNNNOOOOMMMMTTTT', // Team B: compressão/liquefação + armazenamento + exportação (pipeline/navio)
            'TTTTNNNNOOOOMMMM', // Team C: segurança processo (H2/incêndio) + instrumentação + manutenção preventiva
        ],
        industry: 'Hidrogénio Verde Offshore'
    },
    // Underwater Data Centers
    {
        name: 'Data Centers Submersos - Operações Subaquáticas (3 Equipas)',
        description: 'DC submersos - 3 equipas, turnos 12h, monitoramento térmico + manutenção ROV + conectividade + energia renovável',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: monitoramento racks (temperatura/vibração/vazamento) + energia onda/maré
            'NNNNOOOOMMMM', // Team B: manutenção ROV (troca servidores/cabos) + inspeção casco + biofouling
            'OOOOMMMMNNNN', // Team C: conectividade (cabo submarino/satélite) + resiliência + disaster recovery
        ],
        industry: 'Data Centers Submersos'
    },
    // Orbital Manufacturing - Microgravity
    {
        name: 'Fabrico Orbital - Microgravidade (3 Equipas)',
        description: 'Fabrico espacial - 3 equipas, turnos 12h, impressão 3D orbital + crescimento cristais + fibras ZBLAN + retorno carga',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: manufatura aditiva (metais/polímeros) + controle térmico vácuo
            'NNNNOOOOMMMMTTTT', // Team B: crescimento cristais (semicon/proteína) + fibras ópticas ZBLAN + monitoramento
            'TTTTNNNNOOOOMMMM', // Team C: integração payload + acoplagem/desacoplagem + retorno cápsula + QC terrestre
        ],
        industry: 'Fabrico Orbital'
    },
    // Long-Duration Energy Storage - Flow Batteries
    {
        name: 'Armazenamento Energia Longa Duração - Baterias Fluxo (4 Equipas)',
        description: 'LDES baterias fluxo - 4 equipas, turnos 12h, preparação eletrólitos + bombas + stacks + gestão térmica + BMS',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: preparação eletrólitos (vanádio/ferro/organicos) + tanques + controle qualidade
            'OODDNN', // Team B: bombas circulação + stacks célula + otimização densidade potência/energia
            'NNOODD', // Team C: gestão térmica (resfriamento/aquecimento) + BMS + balanceamento células
            'DDOONN', // Team D: integração rede (carga/descarga 10h+) + ancilaridade + manutenção preventiva
        ],
        industry: 'Armazenamento Energia Longa Duração'
    },
];
