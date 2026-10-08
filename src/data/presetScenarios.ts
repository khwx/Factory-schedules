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
    // AGI Infrastructure - Large-Scale AI Training
    {
        name: 'Infraestrutura AGI - Treino Massivo (4 Equipas)',
        description: 'AGI treino - 4 equipas, turnos 12h, clusters GPU/TPU 100k+ + refrigeração líquida + energia dedicada + checkpoints distribuídos',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: orquestração treino (data parallelism/pipeline/tensor) + monitoramento loss
            'OODDNN', // Team B: refrigeração directa-a-chip (CDU/manifolds) + gestão térmica + detecção vazamentos
            'NNOODD', // Team C: infraestrutura energia (subestação/UPS/geradores) + otimização PUE + carbono
            'DDOONN', // Team D: checkpoints/resiliência (fault tolerance) + storage scale + recuperação desastre
        ],
        industry: 'Infraestrutura AGI'
    },
    // Synthetic Biology / Programmable Matter Bio-foundries
    {
        name: 'Biologia Sintética - Bio-fundições Programáveis (4 Equipas)',
        description: 'Bio-fundição - 4 equipas, turnos 12h, design-construção-teste-aprendizagem (DBTL) + automação líquida + IA generativa DNA',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: design genómico (CAD biológico) + síntese oligos + montagem Gibson/Golden Gate
            'OODDNN', // Team B: automação robótica (liquid handling) + biorreatores microfluídicos + screening HT
            'NNOODD', // Team C: caracterização fenotípica (omics/imagem) + ML loop + otimização cepas
            'DDOONN', // Team D: escala piloto (fermentação 10kL+) + downstream + formulação + GMP/QC
        ],
        industry: 'Biologia Sintética Programável'
    },
    // Space-Based Solar Power
    {
        name: 'Energia Solar Espacial - Estações Orbitais (3 Equipas)',
        description: 'SBSP - 3 equipas, turnos 12h, painéis fotovoltaicos orbitais + conversão microondas/laser + transmissão terra + receptor rectena',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: array solar (desdobramento/pointing) + conversão DC-RF + gestão térmica orbital
            'NNNNOOOOMMMMTTTT', // Team B: feixe microondas/laser (formação/steering) + segurança exclusão + rastreamento
            'TTTTNNNNOOOOMMMM', // Team C: estação terra (rectena) + integração rede + armazenamento + monitoramento RF
        ],
        industry: 'Energia Solar Espacial'
    },
    // Advanced Nuclear - Fusion-Fission Hybrid
    {
        name: 'Nuclear Avançado - Híbrido Fusão-Fissão (4 Equipas)',
        description: 'Híbrido fusão-fissão - 4 equipas, turnos 12h, manta fértil + transmutação actinídeos + produção isótopos + ciclagem combustível',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: núcleo fusão (fonte nêutrons 14 MeV) + blanket multiplicador + trítio breeding
            'OODDNN', // Team B: zona físsil (tório/URANIO/actínideos) + transmutação resíduos + extração isótopos
            'NNOODD', // Team C: ciclo combustível (reprocessamento piroquímico) + reciclagem + fabricação pellets
            'DDOONN', // Team D: segurança (desligamento passivo) + blindagem + licenciamento + monitoramento rad
        ],
        industry: 'Nuclear Híbrido Fusão-Fissão'
    },
    // Carbon-Negative Materials / Mineralization
    {
        name: 'Materiais Carbono-Negativo - Mineralização (3 Equipas)',
        description: 'Mineralização CO2 - 3 equipas, turnos 12h, carbonatação minerais (olivina/serpentina) + agregados construção + curinga acelerada + MRV',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: preparação matéria-prima (moagem/ativação) + reatores carbonatação + controle pH/T
            'NNNNOOOOMMMM', // Team B: separação carbonatos + lavagem + pelotização + cura CO2 (câmara pressurizada)
            'OOOOMMMMNNNN', // Team C: controle qualidade (RDT/resistência) + certificação EPD + logística obra + MRV blockchain
        ],
        industry: 'Materiais Carbono-Negativo'
    },
    // Neuromorphic Computing / Brain-Computer Interfaces
    {
        name: 'Computação Neuromórfica - Interfaces Cérebro-Máquina (3 Equipas)',
        description: 'Neuromórfico/BCI - 3 equipas, turnos 12h, chips espinhais (memristores/event-driven) + decodificação neural + estimulação + biocompatibilidade',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMTTTTNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMTTTTNNNNOOOO', // Team A: fabricação neuromórfica (CMOS/memristor/3D stacking) + caracterização sinapses
            'NNNNOOOOMMMMTTTT', // Team B: algoritmos SNN (STDP/plasticidade) + decodificação tempo real + loop fechado
            'TTTTNNNNOOOOMMMM', // Team C: implante (eletrodos flexíveis/hermeticidade) + telemetria sem fios + ensaios clínicos
        ],
        industry: 'Computação Neuromórfica / BCI'
    },
    // Bio-manufacturing at Scale - Cell & Gene Therapy
    {
        name: 'Biofabricação Escala - Terapias Celulares/Génicas (4 Equipas)',
        description: 'CGT manufatura - 4 equipas, turnos 12h, autólogas/allogénicas + vetores virais (AAV/lentivírus) + expansão bioreator + fill/finish GMP',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: coleta aférese + ativação/transdução (TIL/CAR-T) + controle vetor viral
            'OODDNN', // Team B: expansão bioreator (perfusão/perfusão tangencial) + fenotipagem + liberação
            'NNOODD', // Team C: produção vetores (HEK293/suspensão) + purificação cromatografia + titer/genoma
            'DDOONN', // Team D: fill/finish asséptico (CGT) + liofilização + serialização + cold chain -80°C/LN2
        ],
        industry: 'Biofabricação Terapias Celulares'
    },
    // Planetary Defense / Asteroid Deflection
    {
        name: 'Defesa Planetária - Desvio Asteroides (3 Equipas)',
        description: 'Defesa planetária - 3 equipas, turnos 12h, detecção/rastreamento (NEO) + cinético/ion-beam/gravity tractor + simulação impacto + coordenação internacional',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: survey óptico/radar (LSST/NEOWISE) + determinação órbita + probabilidade impacto
            'NNNNOOOOMMMM', // Team B: missão desvio (DART/kinetic/ion-beam/gravity) + navegação terminal + avaliação momentum
            'OOOOMMMMNNNN', // Team C: modelagem efeitos (tsunami/climático) + mitigação civil + protocolo ONU/SMPAG/IAWN
        ],
        industry: 'Defesa Planetária'
    },
    // Quantum Communication Networks / Quantum Internet
    {
        name: 'Comunicações Quânticas - Internet Quântica (3 Equipas)',
        description: 'Rede quântica - 3 equipas, turnos 12h, distribuição chaves quânticas (QKD) + repetidores quânticos + teleportação + nódes satélite/fibra',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: geração/distribuição chaves (QKD) + fontes fotão único + detetores SNSPD
            'NNNNOOOOMMMM', // Team B: repetidores quânticos (memórias/emaranhamento) + correção erros + purificação
            'OOOOMMMMNNNN', // Team C: ligações satélite-terra (free-space) + rede fibra confiável + gestão chaves clássicas
        ],
        industry: 'Comunicações Quânticas'
    },
    // Molten Salt Reactors / Advanced Nuclear (Thorium)
    {
        name: 'Reactores Sal Fundido - Tório/MSR (4 Equipas)',
        description: 'Reator sal fundido/tório - 4 equipas, turnos 12h, processamento sal online + reprocessamento piroquímico + refrigeração passiva + licenciamento',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: operação núcleo (sal combustível/coolant) + controlo redox + temperatura 700°C+
            'OODDNN', // Team B: processamento sal online (extração gases/actínideos) + reposição tório/URANIO
            'NNOODD', // Team C: sistemas segurança passiva (dreno congelado) + blindagem + instrumentação alta temperatura
            'DDOONN', // Team D: ciclo combustível (FLiBe/sal portador) + gestão resíduos + validação regulatória
        ],
        industry: 'Reactores Sal Fundido'
    },
    // Urban Air Mobility / eVTOL Operations
    {
        name: 'Mobilidade Aérea Urbana - eVTOL (4 Equipas)',
        description: 'eVTOL/vertiports - 4 equipas, turnos 10h/12h, operações voo urbano + carregamento baterias + gestão tráfego UTM + manutenção',
        teams: 4,
        shiftDuration: 10,
        weeklyHoursContract: 40,
        pattern: 'MMMTTTNNNFFF',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMTTTNNNFFF', // Team A: operações voo (piloto/autónomo) + vertiporto partida/chegada + passageiros
            'FFFMMMTTTNNN', // Team B: carregamento rápido (MW) + gestão baterias (swap/health) + infraestrutura energia
            'NNNFFFMMMTTT', // Team C: gestão tráfego UTM (corredores/desconflito) + comunicações 5G/6G + meteorologia urbana
            'TTTNNNFFFMMM', // Team D: manutenção linha (inspeção rotores/aviónicos) + certificação contínua + peças reserva
        ],
        industry: 'Mobilidade Aérea Urbana'
    },
    // Enhanced/Deep Geothermal Energy
    {
        name: 'Geotermia Profunda - Superhot Rock (4 Equipas)',
        description: 'Geotermia supercrítica - 4 equipas, turnos 12h, perfuração ultraprofunda (10km+) + fluidos supercríticos + estimulação + central binária',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: perfuração direcional (rotary/laser/plasma) + revestimento alta T/P + logging
            'OODDNN', // Team B: estimulação hidráulica/shear + monitoramento sísmico + gestão reservatório
            'NNOODD', // Team C: central potência binária (CO2/sCO2/ORC) + trocadores + turbinas + injeção
            'DDOONN', // Team D: monitoramento induzido sismicidade + qualidade água + conformidade ambiental + manutenção poço
        ],
        industry: 'Geotermia Profunda'
    },
    // Active Space Debris Removal
    {
        name: 'Remoção Ativa Detritos Espaciais - ADR (3 Equipas)',
        description: 'ADR missões - 3 equipas, turnos 12h, captura detritos (rede/gancho/laser) + desorbitar + verificação + operações proximidade',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: rendez-vous/proximidade + captura (rede/braço/ião) + acoplamento não-cooperativo
            'NNNNOOOOMMMM', // Team B: desorbitar controlado (vela/propulsão) + verificação reentrada + telemetria final
            'OOOOMMMMNNNN', // Team C: planejamento missão (alvos/prioridade) + licenciamento espacial + coordenação internacional IADC
        ],
        industry: 'Remoção Detritos Espaciais'
    },
    // Metal Additive Manufacturing at Industrial Scale
    {
        name: 'Fabrico Aditivo Metálico - Escala Industrial (4 Equipas)',
        description: 'AM metal larga escala - 4 equipas, turnos 12h, LPBF/DED/EBM multi-laser + pós-processamento (HIP/maquinação) + QC em linha + certificação',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: impressão (LPBF/DED/EBM) + gestão pó (reciclagem/sieving) + monitoramento melt pool
            'OODDNN', // Team B: tratamento térmico (HIP/alívio tensões) + maquinação CNC 5-eixos + acabamento superfície
            'NNOODD', // Team C: controlo qualidade (CT/tomografia/ultrassom) + metrologia dimensional + rastreabilidade lote
            'DDOONN', // Team D: qualificação processo/material + certificação (AMS/ASME/NADCAP) + digital twin + supply chain
        ],
        industry: 'Fabrico Aditivo Metálico'
    },
    // Biological Computing / DNA Data Storage
    {
        name: 'Computação Biológica - Armazenamento DNA (3 Equipas)',
        description: 'Armazenamento DNA - 3 equipas, turnos 12h, síntese oligos (enzimática/fotolitográfica) + sequenciação leitura + codificação erro + biblioteca fria',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: síntese DNA em massa (array/chip) + codificação (fountain/Reed-Solomon) + verificação QC
            'NNNNOOOOMMMM', // Team B: sequenciação leitura (nanopore/Illumina) + decodificação + correção erros + reconstrução dados
            'OOOOMMMMNNNN', // Team C: armazenamento frio (LN2/-80°C) + gestão biblioteca + indexação + recuperação seletiva + longevidade
        ],
        industry: 'Computação Biológica / DNA'
    },
    // Autonomous Maritime Surface Operations
    {
        name: 'Operações Marítimas Autónomas - USV (4 Equipas)',
        description: 'Navios superfície não tripulados - 4 equipas, turnos 12h, teleoperação/autonomia + sensores (lidar/radar/AIS) + COLREGs + centro controle terra',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: centro operações terra (ROC) + teleoperação múltiplos USV + planejamento missão
            'OODDNN', // Team B: autonomia navegação (evitamento/ COLREGs) + fusão sensores + comunicações satélite/LOS
            'NNOODD', // Team C: payload missão (hidrografia/inspeção/segurança) + processamento dados + transmissão tempo real
            'DDOONN', // Team D: logística lançamento/recuperação + manutenção cascos/propulsão + abastecimento + conformidade IMO
        ],
        industry: 'Operações Marítimas Autónomas'
    },
    // Lunar Mining / ISRU (In-Situ Resource Utilization)
    {
        name: 'Mineração Lunar - ISRU (3 Equipas)',
        description: 'Extração recursos lunares - 3 equipas, turnos 12h, escavação regolito + processamento oxigénio/água + fabricação aditiva in-situ + logística superfície',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: escavação/transporte regolito + robótica autónoma + processamento térmico/químico
            'NNNNOOOOMMMM', // Team B: extração oxigénio (H2/CH4 redução) + eletrólise água gelo + liquefação armazenamento
            'OOOOMMMMNNNN', // Team C: fabricação aditiva (regolito sinterizado) + construção habitats/estruturas + manutenção sistemas ISRU
        ],
        industry: 'Mineração Lunar / ISRU'
    },
    // Alternative Proteins / Precision Fermentation
    {
        name: 'Proteínas Alternativas - Fermentação Precisão (4 Equipas)',
        description: 'Fermentação precisão proteínas - 4 equipas, turnos 12h, biorreatores 200kL+ + downstream purificação + formulação + QC GMP contínuo',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: operação biorreatores (alimentação/controlo pH/DO/temperatura) + monitoramento metabolómico
            'OODDNN', // Team B: separação/purificação (centrífuga/ cromatografia/filtruação) + concentração + diafiltração
            'NNOODD', // Team C: formulação (texturização/extrusão) + ingredientes funcionais + embalagem aséptica + rastreabilidade
            'DDOONN', // Team D: controlo qualidade (analítica/microbiológico/sensorial) + validação processo + conformidade regulatória (EFSA/FDA)
        ],
        industry: 'Proteínas Alternativas / Fermentação Precisão'
    },
    // Hyperloop / Ultra-High-Speed Transport
    {
        name: 'Hiperloop - Operações Tubo Vácuo (4 Equipas)',
        description: 'Sistema hiperloop - 4 equipas, turnos 12h, gestão tubo vácuo + propulsão maglev + controle tráfego + segurança emergência + manutenção infraestrutura',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: centro controle operações (pods/tráfego/vácuo) + gestão emergências + comunicação passageiros
            'OODDNN', // Team B: manutenção tubo (bombas vácuo/vedação/inspeção) + infraestrutura pista/estacas + monitoramento estrutural
            'NNOODD', // Team C: sistemas propulsão (LIM/linear motor) + levitação magnética + gestão energia + criogenia supercondutores
            'DDOONN', // Team D: estações passageiros (embarque/segurança/UX) + logística cápsulas + certificação segurança + expansão rede
        ],
        industry: 'Hiperloop / Transporte Ultra-Rápido'
    },
    // Solar Radiation Management / Geoengineering
    {
        name: 'Geoengenharia Solar - Gestão Radiação (3 Equipas)',
        description: 'Gestão radiação solar (SRM) - 3 equipas, turnos 12h, injeção estratosfera aerossóis + monitoramento climático + modelação + governança internacional',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: operações lançamento (balões/aeronaves/artilharia) + dispersão partículas (SO2/CaCO3/diamante) + dosimetria
            'NNNNOOOOMMMM', // Team B: monitoramento atmosférico (LIDAR/satélite/radiossondas) + modelação impacto climático + verificação efeitos colaterais
            'OOOOMMMMNNNN', // Team C: governança (tratados/transparência/consentimento) + avaliação risco ético + coordenação internacional + plano término
        ],
        industry: 'Geoengenharia Solar / Gestão Radiação'
    },
    // Vertical Farming / Urban Agriculture
    {
        name: 'Agricultura Vertical - Fábricas Urbanas (4 Equipas)',
        description: 'Vertical farming indoor - 4 equipas, turnos 12h, cultivo hidropónico/aeropónico LED + climatização VPD + automação colheita + logística última milha',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 42,
        pattern: 'DDNNOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDNNOO', // Team A: gestão cultivo (receitas luz/nutrientes/CO2) + monitoramento fenotipagem + ciclo semente-colheita
            'OODDNN', // Team B: automação (robôs plantio/transplante/colheita) + sistemas transporte vertical + embalagem flow-pack
            'NNOODD', // Team C: infraestrutura (HVAC/desumidificação/CO2 enriquecimento) + gestão energia renovável + circularidade água/nutrientes
            'DDOONN', // Team D: qualidade alimentar (resíduos pesticidas/nutrientes/microbiologia) + rastreabilidade blockchain + distribuição urbana
        ],
        industry: 'Agricultura Vertical / Fábricas Urbanas'
    },
    // Photonic / Optical Computing
    {
        name: 'Computação Fotónica - Processadores Ópticos (3 Equipas)',
        description: 'Computação fotónica integrada - 3 equipas, turnos 12h, fabricação PICs (fotónica silício/nióbio) + teste wafers + packaging co-packaged optics + data centers',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: fabricação cleanroom (litografia/e-beam/gravação) + guias onda/acopladores/moduladores + metrologia óptica
            'NNNNOOOOMMMM', // Team B: teste caracterização (VNA/espectroscopia/olho diagrama) + qualificação confiabilidade + binning performance
            'OOOOMMMMNNNN', // Team C: packaging (chiplets/optical I/O/interposers) + integração CPO (co-packaged optics) + validação sistema data center
        ],
        industry: 'Computação Fotónica / Processadores Ópticos'
    },
    // Quantum Networks / Quantum Internet
    {
        name: 'Internet Quântica - Redes Quânticas (3 Equipas)',
        description: 'Rede quântica distribuição chaves/repetidores - 3 equipas, turnos 12h, QKD satélite/fibra + memórias quânticas + emaranhamento + criptografia pós-quântica híbrida',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: nós QKD (preparação/medição estados) + canais quânticos (fibra livre espaço) + sincronização relógios atómicos
            'NNNNOOOOMMMM', // Team B: repetidores quânticos (memórias/emaranhamento/troca) + purificação + correção erros quântica + taxas segredo
            'OOOOMMMMNNNN', // Team C: camada clássica (autenticação/sync/gestaão chaves) + integração PQC híbrida + orquestração rede + standardização ETSI/IETF
        ],
        industry: 'Internet Quântica / Redes Quânticas'
    },
    // Ocean Direct Air Capture / Ocean DAC
    {
        name: 'Captura Direta Oceânica - Ocean DAC (3 Equipas)',
        description: 'Remoção CO2 oceano - 3 equipas, turnos 12h, alcalinização oceânica/eletrólise água mar + medição MRV + impacto ecossistema + governação marinha',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: operações plataforma (eletrólise bipolar/alcalinização) + adição minerais (olivina/cal) + bombagem/ dispersão
            'NNNNOOOOMMMM', // Team B: monitoramento MRV (sensores pH/alcalinidade/DIC) + modelação biogeoquímica + verificação adicionalidade + certificação créditos
            'OOOOMMMMNNNN', // Team C: avaliação impacto (ecossistema/pescas/acidificação local) + licenciamento (LCM/IMO/UNCLOS) + engajamento stakeholders + economia azul
        ],
        industry: 'Captura Direta Oceânica / Ocean DAC'
    },
    // Pipeline Integrity / Cathodic Protection
    {
        name: 'Integridade de Dutos - Proteção Catódica (3 Equipas)',
        description: 'Monitoramento integridade dutos - 3 equipas, turnos 12h, inspeção pigging inteligente + proteção catódica (CC/galvânica) + detecção vazamentos fibra óptica + reparos subsea',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: operações pigging (MFL/UT/calibração) + mapeamento anomalia + reporte integridade + logística lançamento/recepção
            'NNNNOOOOMMMM', // Team B: proteção catódica (retificadores/ânodos/sacrifíciais) + monitoramento potencial (CIPS/DCVG) + interferências stray current + compliance NACE/API
            'OOOOMMMMNNNN', // Team C: detecção vazamentos (DAS/DTS fibra óptica/acústica) + resposta emergência + reparo (mangas/compressão/substituição) + recomissionamento
        ],
        industry: 'Integridade de Dutos / Proteção Catódica'
    },
    // Advanced Battery Recycling / Black Mass Processing
    {
        name: 'Reciclagem Baterias Avançada - Black Mass (4 Equipas)',
        description: 'Reciclagem hidrometalúrgica baterias LFP/NMC - 4 equipas, turnos 12h Panama, desmontagem segura + lixiviação seletiva + purificação solvente + precipitação carbonato/hidróxido',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'DDDDOOOONNNN',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDDDOOOONNNN', // Team A: recepção/descarregamento seguro (inertização N2/CO2) + desmontagem robótica (células/módulos/pack) + trituração inerte + separação frações
            'NNNNDDDDOOOO', // Team B: lixiviação ácida/redutora (H2SO4/H2O2) + extração solvente (D2EHPA/Cyanex/PC88A) + separação Co/Ni/Mn/Li + purificação impurezas
            'OOOONNNNDDDD', // Team C: precipitação seletiva (carbonato Li/hidróxido Ni/Co/Mn) + lavagem/secagem + controle qualidade (ICP/OES/XRD) + embalagem grau bateria
            'DDDDOOOONNNN', // Team D: gestão efluentes (tratamento água/recirculação) + recuperação grafito/eletrólito/separador + balanço massa/energia + certificação cadeia custódia
        ],
        industry: 'Reciclagem Baterias / Black Mass'
    },
    // Power Semiconductor Manufacturing (SiC/GaN)
    {
        name: 'Semicondutores Potência - SiC/GaN (4 Equipas)',
        description: 'Fabricacão wide-bandgap (SiC 200mm/GaN 200mm) - 4 equipas, turnos 12h, epitaxia CVD + processamento wafers (fotolitografia/gravação/implantação) + metalização/sinterização + teste/qualificação',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: epitaxia (SiC: CVD horiz/vert; GaN: MOCVD/HVPE) + caracterização (XRD/AFM/PL/IV) + defeitos micropipe/basal plane + uniformidade dopagem
            'NNNNOOOOMMMM', // Team B: processamento front-end (foto i-line/KrF/ArF + gravação ICP/RIE + implantação Al/N/P + ativação recozimento 1700C+) + isolamento borda/junção terminação
            'OOOOMMMMNNNN', // Team C: back-end (metalização Ni/Ti/Ag + sinterização prata/ligação fio Cu/Al + passivação SiN/SiO2) + wafer probe (IV/CV/HTRB/HTGB) + binning performance
            'MMMMNNNNOOOO', // Team D: packaging power (DBC/AMB/substrato Cu) + solda sinterização Ag/TLP + módulo (press-pack/transfer-mold) + teste final (clamping/short-circuit/avalanche) + qualificação AEC-Q101/JEDEC
        ],
        industry: 'Semicondutores Potência SiC/GaN'
    },
    // Green Hydrogen Liquefaction & Transport
    {
        name: 'Hidrogénio Verde - Liquefação e Transporte (4 Equipas)',
        description: 'Liquefação H2 verde (-253C) e logística criogénica - 4 equipas, turnos 12h Panama, compressão multi-estágio + ciclo Claude/Linde + armazenamento esférico + carregamento ISO/tube-trailer/navio',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'DDDDOOOONNNN',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDDDOOOONNNN', // Team A: compressão (reciprocante/diaphragm/iónico 30-90 bar) + purificação (PSA/TSA/membrana) + pré-resfriamento (N2/He) + alimentação cold-box
            'NNNNDDDDOOOO', // Team B: cold-box (trocadores placa-aleta + turbinas expansão + válvulas Joule-Thomson) + separação orto-para (catalisador Fe2O3/Cr2O3) + controle pureza (H2O/O2/N2/Ar < ppm)
            'OOOONNNNDDDD', // Team C: armazenamento (tanques esféricos vácuo/perlite/espuma + bombas criogênicas submersas) + carregamento (bunkering navio/balsa + tube-trailers ISO 40ft + dispensação 350/700 bar)
            'DDDDOOOONNNN', // Team D: instrumentação segurança (vazamento H2/chama invisível/pressão/vácuo) + gestão boil-off (reliquefação/combustão/celula combustível) + logística cadeia fria + certificação IMO/ADR/ISO
        ],
        industry: 'Hidrogénio Verde Liquefação / Transporte'
    },
    // Seismic Monitoring & Early Warning Systems
    {
        name: 'Monitoramento Sísmico - Alerta Precoce (3 Equipas)',
        description: 'Rede alerta precoce terremotos (EEW) - 3 equipas, turnos 8h/12h mistos, sensores banda larga/strong-motion + processamento tempo real (P-wave/PD) + disseminação alerta (CAP/Cell Broadcast/API) + coordenação proteção civil',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: operações rede (sítios superfície/profundo/ocean-bottom) + telemetria (satelite/4G/fibra/rádio) + controle qualidade (ruído/cruzamento/timing GPS/GNSS) + manutenção preventiva/corretiva
            'NNNNOOOOMMMM', // Team B: processamento EEW (ElarmS/EPIC/ShakeAlert/PIER) + estimação magnitude/localização tempo real (<3s) + previsão intensidade (GMPE/site-response) + geração alerta (magnitude/latência/confiabilidade)
            'OOOOMMMMNNNN', // Team C: disseminação multi-canal (sirene/TV/rádio/Cell Broadcast/app/API/sirenas industriais) + integração sistemas críticos (ferroviário/gás/eletricidade/barragens) + exercícios público + pós-evento validação (ground-truth/danos)
        ],
        industry: 'Monitoramento Sísmico / Alerta Precoce'
    },
    // Medical Isotope Production (Cyclotron/Reactor)
    {
        name: 'Isótopos Médicos - Ciclotrão/Reator (3 Equipas)',
        description: 'Produção radioisótopos diagnósticos/terapêuticos (F-18/C-11/Ga-68/Zn-62/Cu-64/Ac-225/Lu-177) - 3 equipas, turnos 12h, preparação alvos + irradiação (p/d/alpha/n) + radioquímica automatizada + QC/GMP liberação',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: preparação alvos (gás/fluido/sólido - H2O-18/CO2/Ni/Zn/Ra/Th) + carregamento ciclotrão (H-/p/d 10-30MeV) / reator (n térmico/rápido) + monitoramento feixe (corrente/perfil/ativação) + descomissão alvo
            'NNNNOOOOMMMM', // Team B: síntese radioquímica (módulos automatizados FASTlab/Explora/GE) + purificação (SPE/HPLC/destilação) + formulação (salina/etanol/ascorbato) + dispensação frascos/seringas estéreis + controle asepsia (isoladores/RABS)
            'OOOOMMMMNNNN', // Team C: QC completo (identidade/radioquímica/radiquímica/esterilidade/pirogênios/endotoxinas) + documentação lote (GMP/EudraLex/USP) + liberação pessoa qualificada (QP) + logística transporte (Tipo A/B/Excepted) + rastreabilidade decaimento
        ],
        industry: 'Produção Isótopos Médicos'
    },
    // Subsea Fiber Optic Cable Operations
    {
        name: 'Cabos Submarinos Fibra Óptica - Operações (4 Equipas)',
        description: 'Instalação/manutenção cabos submarinos transoceânicos - 4 equipas, turnos 12h Panama, navegação DP + ROV inspeção/enterramento + emenda fusão/fabricação junção + teste OTDR/caracterização + comissionamento sistema',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'DDDDOOOONNNN',
        startDate: '2025-01-01',
        teamPatterns: [
            'DDDDOOOONNNN', // Team A: navegação DP (classe 2/3) + levantamento rota (MBES/SSS/perfilador subfundo) + assentamento cabo (carrossel/tanque/estilingue) + controle tensão/velocidade + monitoramento posicionamento USBL/LBL
            'NNNNDDDDOOOO', // Team B: operações ROV (observação/classe trabalho) + inspeção visual/CP/UT + enterramento (arado/jato/perfuração) + proteção (colchões/rochas/mangas) + cruzamentos/aterros praia
            'OOOONNNNDDDD', // Team C: emenda fusão (arco/fusão núcleo revestido + proteção manga termoencolhível/mecânica) + fabricação junção (corpo pressão/vedação/validação fábrica) + teste OTDR bidirecional + caracterização dispersão/atenuação/PMD
            'DDDDOOOONNNN', // Team D: comissionamento sistema (laser/pump/ROADM/DCI) + integração CLS/NMS + teste aceitação fábrica/local (FAT/SAT) + documentação as-built + plano manutenção 25 anos + reserva capacidades (dark fiber)
        ],
        industry: 'Cabos Submarinos Fibra Óptica'
    },
    // Atmospheric Water Generation
    {
        name: 'Geração Atmosférica de Água - AWG Industrial (3 Equipas)',
        description: 'Produção água potável do ar (refrigeração/adsorção) - 3 equipas, turnos 12h, unidades AWG (compressão/dessecante/híbrido) + tratamento multi-barreiра (UV/RO/mineralização) + monitoramento qualidade (ISO 22000/WHO) + logística distribuição',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: operação unidades AWG (ciclo refrigeração: compressor/condensador/evaporador; adsorção: zeólita/MOF/sílica-gel + regeneração térmica) + controle ponto orvalho/eficiência energetica + manutenção filtros/trocas calor
            'NNNNOOOOMMMM', // Team B: tratamento água (pré-filtração carvão/cerâmica + osmose reversa/UF + UV-C/LED + mineralização calcita/magnesio + pH/ORP/condutividade) + validação multi-barreira (HACCP/ISO 22000) + engarrafamento/embalagem asseptica
            'OOOOMMMMNNNN', // Team C: monitoramento qualidade contínuo (IoT sensores: turbidez/Cl2/pH/TDS/microbiologia) + logística distribuição (caminhões isotérmicos/pontos coleta/kiosks solares) + gestão energia (solar+eolica+bateria+rede) + relatórios conformidade regulatória + engajamento comunidades
        ],
        industry: 'Geração Atmosférica de Água'
    },
    {
        name: 'Mineração Mar Profunda - Nódulos/SSC (4 Equipas)',
        description: 'Coleta nódulos polimetálicos 4000-6000m + elevação riser + processamento navio + gestão sedimentos/pluma - 4 equipas, turnos 12h Panama',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: pilotagem veículo coleta (ROV/AUV) + posicionamento GPS/acústico + coleta seletiva nódulos + monitoramento pluma sedimentos + sistemas elevação (bomba ar/riser)
            'NNNNOOOOMMMM', // Team B: processamento a bordo (lavagem/classificação/secagem) + separação minerais (Cu/Ni/Co/Mn/REE) + gestão rejeitos/água produção + certificação MRV (monitoramento/relatório/verificação)
            'OOOOMMMMNNNN', // Team C: manutenção equipamentos subsea (ROV intervenção/hidráulica/elétrica) + inspeção integridade riser/umbilical + logística abastecimento navio (combustível/peças/tripulação) + gestão resíduos perigosos
            'MMMMNNNNOOOO', // Team D: sala controle integrada (SCADA subsea + navegação dinâmica DP + monitoramento ambiental tempo real) + coordenação operações simultâneas (SIMOPS) + comunicação satélite + relatórios conformidade ISA/regulatório
        ],
        industry: 'Mineração Mar Profunda'
    },
    {
        name: 'Propulsão Nuclear Espacial - NTP/NEP (3 Equipas)',
        description: 'Desenvolvimento/teste propulsão térmica nuclear (NTP) e elétrica nuclear (NEP) - 3 equipas, turnos 12h, reatores espaciais + criogenia H2/LH2 + válvulas alta temperatura',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: montagem/integração reator (combustível HALEU/UN + moderador ZrH/BeO + refletor Be) + teste não-nuclear (vazão/pressão/vibração) + preparação ensaios nucleares (criticalidade/reatividade)
            'NNNNOOOOMMMM', // Team B: sistema propulsão criogênico (tanques LH2/LOX + bombas turbina + válvulas reguladoras + isolamento MLI/vácuo) + teste fluxo/pressão/choque térmico + integração bocais expansão (C-C/SiC)
            'OOOOMMMMNNNN', // Team C: instrumentação/telemetria (neutrões/gama/temperatura/pressão/vazão) + aquisição dados alta velocidade + simulação CFD/neutrónica (MCNP/SERPENT) + segurança radiológica (blindagem/contaminação/ALARA) + documentação NASA/DOE
        ],
        industry: 'Propulsão Nuclear Espacial'
    },
    {
        name: 'Computação Criogénica - Qubits Supercondutores (3 Equipas)',
        description: 'Operação/maintenance frigoríficos diluição (mK) para computação quântica - 3 equipas, turnos 12h, refrigeração adiabática + blindagem magnética + eletrónica controle qubits',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: operação frigoríficos diluição (mistura 3He/4He + compressores + trocadores calor + válvulas mistura) + monitoramento temperatura base (<15mK) + carga térmica + diagnóstico vazamentos (hélio mass spec)
            'NNNNOOOOMMMM', // Team B: eletrónica controle qubits (DAC/ADC + FPGA + microondas 4-12GHz + cabos atenuação/isolamento térmico) + calibração portas 1Q/2Q + correção erro superfície (surface code) + caracterização coerência (T1/T2/readout)
            'OOOOMMMMNNNN', // Team C: infraestrutura laboratório (blindagem μ-metal + filtramento EMI/RFI + aterramento estrela + UPS/gerador) + gestão hélio (liquefação/recuperação/pureza) + manutenção preventiva compressores/valves + segurança criogenia (asfixia/pressão)
        ],
        industry: 'Computação Criogénica'
    },
    {
        name: 'Materiais Quânticos Topológicos - Nano-fab (3 Equipas)',
        description: 'Fabricação materiais 2D/topológicos (grafeno/TMDs/isolantes topológicos) - 3 equipas, turnos 12h, e-beam litho + MBE/CVD + caracterização ARPES/STM',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: crescimento epitaxial (MBE/MOCVD/CVD) + controle fluxo/pressão/temperatura + heteroestruturas van der Waals (twistronics/ângulo mágico) + dopagem in-situ + RHEED/LEED monitoramento
            'NNNNOOOOMMMM', // Team B: nano-fabricação (e-beam litho + etching reativo/íons + deposição ALD/PVD + lift-off/transferência 2D) + litografia multi-camada + alinhamento nanométrico + metrologia SEM/AFM
            'OOOOMMMMNNNN', // Team C: caracterização quântica (ARPES + STM/STS + transporte magneto-elétrico + magneto-óptica Kerr/Faraday) + medições campo magnético alto (30T+) + temperatura ultra-baixa (mK) + análise topológica (número Chern/estado borda)
        ],
        industry: 'Materiais Quânticos Topológicos'
    },
    {
        name: 'Fusão Anêutica - p-B11 / He-3 (3 Equipas)',
        description: 'Pesquisa fusão anêutica (próton-boro11 / hélio-3) - 3 equipas, turnos 12h, confinamento IEC/field-reversed + diagnósticos plasma + captação energia direta',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: operação dispositivo fusão (IEC/poço potencial / FRC / tokamak esférico) + injeção combustível (p/B11/He-3) + aquecimento RF/neutro + diagnósticos plasma (interferometria/Thomson/neutrões)
            'NNNNOOOOMMMM', // Team B: sistema captação energia direta (coleta partículas carregadas + conversão eletrostática/indutiva + condicionamento potência) + blindagem radiação (nêutrons/gama) + validação ganho líquido (Q>1)
            'OOOOMMMMNNNN', // Team C: engenharia materiais (plasma-facing: W/Be/C-SiC + supercondutores HTS + isolamento vácuo) + gestão trítio/activation + simulação PIC/fluidos (Gkeyll/WARPX) + licenciamento regulatório nuclear
        ],
        industry: 'Fusão Anêutica'
    },
    {
        name: 'Biofabricação Órgãos - Bioprinting 4D (4 Equipas)',
        description: 'Bioprinting 4D órgãos/tecidos vascularizados - 4 equipas, turnos 12h, bioinks células-tronco + vascularização sacrificial + maturação biorreator + QC funcional',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: design CAD órgão (segmentação TC/MRI + modelagem vascular/arquitetura) + formulação bioinks (hidrogéis/alginato/gelatina/celulose + células iPSC/derivadas) + reologia/printabilidade
            'NNNNOOOOPPPPMMMM', // Team B: bioprinting multi-material (extrusão/inkjet/laser-assisted + resolução <50μm) + vascularização sacrificial (Pluronic/F127 + remoção térmica) + impressão 4D (resposta estímulo: pH/temperatura/luz)
            'OOOOPPPPMMMMNNNN', // Team C: maturação biorreator (perfusão pulsátil + condicionamento mecânico/elétrico + fatores crescimento + monitoramento metabolismo/viabilidade) + integração nervos/linfa + enxerto pré-vascularizado
            'PPPPMMMMNNNNOOOO', // Team D: controle qualidade funcional (histologia/imunofluorescência + fisiologia: contractilidade/barreira/filtration) + esterilização/embalagem + logística cadeia frio + assuntos regulatórios (FDA/EMA ATMP) + ensaios pré-clínicos
        ],
        industry: 'Biofabricação Órgãos'
    },
    {
        name: 'Computação Neuromórfica - Chips Spiking (4 Equipas)',
        description: 'Desenvolvimento chips neuromórficos (spiking neural networks) - 4 equipas, turnos 12h, design SNN + silício/MEMristors + algoritmo aprendizagem STDP + benchmark edge AI',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: arquitetura SNN (neurônios LIF/Izhikevich + sinapses STDP/R-STDP + topologia: feedforward/recorrente/convolucional) + mapeamento algoritmo (CNN→SNN / conversão taxa/latência) + simulação (Brian2/NEST/BindsNET)
            'NNNNOOOOPPPPMMMM', // Team B: design silício (CMOS 28nm/22nm/FD-SOI + memristores/RRAM/PCM + array crossbar + periféricos ADC/DAC/PWM) + layout/PDK + tapeout + caracterização elétrica (IV/retention/endurance)
            'OOOOPPPPMMMMNNNN', // Team C: sistema embarcado (FPGA/ASIC + RTOS + middleware neuromórfico + interface sensores: DVS/event-camera + atuadores) + benchmark (MNIST/N-MNIST/gesture/keyword spotting) + otimização energia/latência/throughput
            'PPPPMMMMNNNNOOOO', // Team D: software stack (compilador SNN + quantização/pruning + deployment edge: MCU/SoC/neuromorphic core) + API desenvolvedor (Python/Rust) + CI/CD teste hardware-in-loop + documentação + open-source community
        ],
        industry: 'Computação Neuromórfica'
    },
    {
        name: 'Energia Solar Espacial - SBSP Demonstrador (3 Equipas)',
        description: 'Demonstrador energia solar espacial (SBSP) - 3 equipas, turnos 12h, painéis fotovoltaicos espaciais + transmissão microondas/laser + retrodireção feixe + rectena terra',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: segmento espacial (painéis multi-junção III-V + concentração + deployável/estrutura leve + gestão térmica radiadores/heat pipes) + apontamento solar (sun sensor + reaction wheels/CMG) + tolerância radiação/anel Van Allen
            'NNNNOOOOMMMM', // Team B: transmissão potência (array faseado microondas 2.45/5.8GHz / laser 1.06/1.55μm + retrodireção pilot tone + eficiência DC-RF/DC-optical) + segurança (exclusão zona/voos/pássaros + ICC/ITU regulatório)
            'OOOOMMMMNNNN', // Team C: segmento terra (rectena array dipolos/retrodireção + conversão RF-DC >85% + integração rede/armazenamento + monitoramento campo EM + avaliação impacto ambiental/saúde) + operações lançamento/órbita (LEO/GEO/Molniya) + logística manutenção orbital
        ],
        industry: 'Energia Solar Espacial'
    },
    {
        name: 'Defesa Planetária - Desvio Asteroide (3 Equipas)',
        description: 'Missão defesa planetária (desvio asteroide cinético/íon) - 3 equipas, turnos 8h/12h, rastreamento NEO + caracterização + deflexão + coordenação IAWN/SMPAG',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: observação/astreamento (radar planetário 70m/300m + telescópios ópticos/IR + fotometria/astrometria + determinação órbita + previsão impacto Sentry/NEODyS)
            'NNNNOOOOMMMM', // Team B: missão desvio (impactador cinético DART-like / trator iônico / gravity tractor / nuclear standoff) + GNC (navegação relativa + apontamento autonôomo + correção trajetória) + validação Δv/momento transferido
            'OOOOMMMMNNNN', // Team C: coordenação internacional (IAWN alerta + SMPAG planejamento resposta + protocolo ONU COPUOS + comunicação pública/mitigação pânico) + análise risco residual (fragmentação/reentrada) + exercícios simulação (tabletop/real-time) + lições aprendidas/aprimoramento
        ],
        industry: 'Defesa Planetária'
    },
    // Molecular Nanotechnology / APM Nanofactories
    {
        name: 'Nanotecnologia Molecular - Nanofábricas APM (3 Equipas)',
        description: 'Fabricação atomicamente precisa (APM) - 3 equipas, turnos 12h, manipulação átomo-por-átomo (STM/AFM) + síntese mecanossintética + verificação estrutural (TEM/EDS) + controle contaminação classe 1',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: operação microscópio túnel/força atômica (STM/AFM) + manipulação átomos/moléculas individuais + síntese mecanossintética (pontas reativas + posicionamento sub-nm) + feedback tempo real
            'NNNNOOOOMMMM', // Team B: síntese molecular programada (rotores/engates/rolamentos diamante) + montagem hierárquica (nano→micro→macro) + verificação estrutural (TEM/EDS/Raman) + pureza 99.9999%
            'OOOOMMMMNNNN', // Team C: controle contaminação (classe ISO 1 / vácuo ultra-alto <10^-10 mbar) + gestão resíduos nano + monitoramento saúde ocupacional (nanopartículas) + certificação produto (ISO/TS 12901) + documentação rastreabilidade atômica
        ],
        industry: 'Nanotecnologia Molecular / Nanofábricas APM'
    },
    // Clinical Brain-Computer Interface
    {
        name: 'Interface Cérebro-Computador Clínica - BCI (4 Equipas)',
        description: 'Implantação/operação BCI invasiva/não-invasiva pacientes - 4 equipas, turnos 12h, neurocirurgia + decodificação neural + reabilitação + monitoramento crônico',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: neurocirurgia estereotáctica (robô/neuronavegação) + implantação microeletrodos (Utah/Neuropixels/SEEG) + mapeamento cortical (ECoG/MEG/fMRI) + fechamento craniano + ICU pós-op
            'NNNNOOOOPPPPMMMM', // Team B: decodificação neural tempo real (spikes/LFP/ondas lentas) + algoritmos ML (Kalman/RNN/Transformer) + calibração adaptativa + interface aplicações (cursor/prótese/fala/exoesqueleto)
            'OOOOPPPPMMMMNNNN', // Team C: reabilitação neurorobótica (treino BCI + feedback sensorial artificial + plasticidade Hebbiana) + terapia ocupacional/fonoaudiologia + avaliação funcional (FMA/ARAT/MOCA) + ajuste parâmetros
            'PPPPMMMMNNNNOOOO', // Team D: monitoramento crônico (impedância/sinal/tecido cicatricial) + telemedicina + atualização firmware/algoritmo OTA + gestão bateria/carregamento indutivo + ética/consentimento/controle dados neurais + coordenação regulatória (FDA/EMA/ANVISA)
        ],
        industry: 'Interface Cérebro-Computador Clínica'
    },
    // Natural / White Hydrogen
    {
        name: 'Hidrogénio Branco - Extração Geológica (3 Equipas)',
        description: 'Extração hidrogénio natural (branco/geo-H2) - 3 equipas, turnos 12h, perfuração ultradeep + separação membrana/PSA + purificação + injeção/reinjeção CO2',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: perfuração ultradeep (3-5km) + revestimento/cimentação HP/HT + teste formação (DST/MDT) + logging (gama/neutrão/ressonância nuclear) + conclusão poço (telas/empacotadores)
            'NNNNOOOOMMMM', // Team B: separação H2/CH4/N2/He (membranas poliméricas/metálicas + PSA + criogenia) + purificação (desoxidação/dessecção) + compressão 350-700 bar + medição vazão/composição (GC/MS)
            'OOOOMMMMNNNN', // Team C: monitoramento reservatório (pressão/temperatura/sismicidade induzida) + reinjeção CO2/água (EOR/armazenamento) + integridade poço (cement bond log/pressure testing) + conformidade ambiental (metano fugitivo/água) + logística transporte (tubulação/tubo-tubo/amônia)
        ],
        industry: 'Hidrogénio Branco / Geológico Natural'
    },
    // Chemical Recycling / Depolymerization
    {
        name: 'Reciclagem Química - Depolimerização Avançada (4 Equipas)',
        description: 'Depolimerização plásticos (PET/PU/PS/PMMA) para monómeros - 4 equipas, turnos 12h, pré-tratamento + pirólise/sólvólise/enzimática + purificação monómero + polimerização virgem',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: receção/resíduos plásticos mistos + triagem ótica (NIR/Raman) + pré-tratamento (lavagem/tricotomia/moagem) + remoção contaminantes (PVC/metais/orgânicos) + alimentação reator
            'NNNNOOOOPPPPMMMM', // Team B: reatores depolimerização (glicólise/meólise/aminólise PET + hidrólise alcalina/ácida PU + pirólise catalítica PS/PMMA + enzimática PETase/MHETase) + controle temperatura/pressão/catalisador + rendimento >95%
            'OOOOPPPPMMMMNNNN', // Team C: purificação monómeros (destilação/criSTALIZAÇÃO/extração/adsorção) + remoção corantes/aditivos/degradação + QC pureza (HPLC/GC/NMR) + recuperação solvente/catalisador
            'PPPPMMMMNNNNOOOO', // Team D: polimerização grau virgem (PET/rPET + PU reciclado + PS reciclado) + controle viscosidade/massa molar + certificação contato alimentar (EFSA/FDA) + LCA pegada carbono + logística cadeia circular (marcas/retalho/recicladores)
        ],
        industry: 'Reciclagem Química / Depolimerização'
    },
    // Solid-State Batteries Gigafactory
    {
        name: 'Baterias Estado Sólido - Gigafactory (4 Equipas)',
        description: 'Fabrico baterias estado sólido (sulfeto/óxido/polímero) - 4 equipas, turnos 12h, síntese eletrólito + cátodo/ânodo + laminação + formação/aging',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: síntese eletrólito sólido (LGPS/Li6PS5Cl/LLZO/LATP/PEO-based) + moagem mecânica/sinterização + caracterização condutividade iônica (>1 mS/cm) + estabilidade janela eletroquímica + pureza <ppm H2O/O2
            'NNNNOOOOPPPPMMMM', // Team B: cátodo (NMC/LFP/LNMO + ligante condutor) + ânodo (Li metal/Si/C + proteção interface) + revestimento slot-die/doctor blade + calandragem densidade + corte/slit + empilhamento (pouch/cilíndrico/prismático)
            'OOOOPPPPMMMMNNNN', // Team C: laminação quente (roll-to-roll + pressão/ temperatura controlada) + selagem pouch + injeção eletrólito (líquido residual/gel) + formação inicial (ciclos C/20-C/10) + degasificação + selagem final
            'PPPPMMMMNNNNOOOO', // Team D: envelhecimento (armazenamento alta temperatura + monitoramento impedância/tensão) + teste fim-de-linha (capacidade/IR/OCV/vazamento) + classificação (A/B/C) + rastreabilidade (genealogia célula/módulo/pack) + embalagem transporte (UN38.3)
        ],
        industry: 'Baterias Estado Sólido - Gigafactory'
    },
    // Qualified Metal Additive Manufacturing
    {
        name: 'Manufatura Aditiva Metais - Qualificada Aeroespacial/Médica (3 Equipas)',
        description: 'LPBF/DED qualificado (Ti6Al4V/Inconel/AlSi10Mg/CoCr) - 3 equipas, turnos 12h, preparação pó + impressão + tratamento térmico + inspeção NDT + certificação NADCAP/ISO 9001/AS9100',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: gestão pó (atomização gás/plasma + peneiramento 15-45μm/45-105μm + caracterização morfologia/fluidez/química + reciclagem pó + atmosfera inerte Ar/N2) + preparação build (suporte/orientação/nesting)
            'NNNNOOOOMMMM', // Team B: impressão LPBF (laser fibra 500-1000W + varredura galvô + estratégia hatching/ilhas + monitoramento in-situ: melt pool/pireometria/OCT) + DED (pó/fio + laser/arco + reparo/adição) + controle dimensional (CT/laser tracker)
            'OOOOMMMMNNNN', // Team C: tratamento térmico (HIP/alívio tensões/solubilização/envelhecimento + vácuo/Ar) + acabamento (CNC/EDM/polimento/shot peening) + inspeção NDT (CT/UT/ET/PT + densidade/porosidade <0.1%) + certificação material (ASTM F3001/F3302) + rastreabilidade digital (blockchain/digital twin)
        ],
        industry: 'Manufatura Aditiva Metais Qualificada'
    },
    // Quantum Communications QKD/Satellite
    {
        name: 'Comunicações Quânticas - QKD/Satélite (3 Equipas)',
        description: 'Rede QKD fibra/satélite (CV-QKD/DV-QKD/MDI-QKD) - 3 equipas, turnos 12h, geração/distribuição chaves + repetidores quânticos + integração rede clássica + segurança criptográfica',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: fontes quânticas (SPDC/SQLD/quantum dots + lasers pulsados 1550nm/780nm + modulação fase/amplitude/polarização) + detetores SNSPD/APD (eficiência >90%/dark count <1Hz) + geração chaves (BB84/E91/CV-QKD) + taxa chave >Mbps
            'NNNNOOOOMMMM', // Team B: canal quântico fibra (baixa perda/baixo ruído Raman + multiplexação DWDM/TDM) + satélite (órbita LEO/GEO + apontamento <μrad + link óptico downlink/uplink + estações terra móveis/fixas) + repetidores (memória quântica/entanglement swapping)
            'OOOOMMMMNNNN', // Team C: pós-processamento (sifting/correção erro/amplificação privacidade + autenticação Wegman-Carter) + integração rede clássica (SDN/NFV + PQC híbrido: Kyber/Dilithium) + gestão chaves (KMS/ETSI GS QKD 014) + certificação Common Criteria/EAL + monitoramento intrusão (QBER/ataque PNS/Trojan horse)
        ],
        industry: 'Comunicações Quânticas QKD/Satélite'
    },
    // Fast Reactors / Waste Transmutation
    {
        name: 'Reatores Rápidos - Transmutação Resíduos (4 Equipas)',
        description: 'Reator rápido refrigerado sódio/chumbo (SFR/LFR) transmutação actinídeos menores - 4 equipas, turnos 12h, operação reator + ciclo combustível fechado + piroprocessamento + segurança passiva',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: operação reator rápido (núcleo MOX/metal U-Pu-Zr + refrigerante Na/Pb-Bi + bombas EM/bombas imersas + trocadores calor intermediários + sistema shutdown passivo) + instrumentação nêutrons/temperatura/vazão + controle reatividade
            'NNNNOOOOPPPPMMMM', // Team B: ciclo combustível fechado (piroprocessamento eletroquímico: eletrorefinação/eletrorredução + recuperação U/Pu/Am/Cm/Np + fabricação combustível remoto (caixa quente) + reciclagem múltiplas passagens + balanço massa isotópica
            'OOOOPPPPMMMMNNNN', // Team C: gestão resíduos (vitrificação FP + matriz cerâmica/forma de vidro actinídeos + armazenamento geológico profundo + barreira engenheirada/bentonita) + monitoramento repositório (temperatura/pressão/geoquímica) + dose público <0.1 mSv/ano
            'PPPPMMMMNNNNOOOO', // Team D: segurança passiva (coeficiente vazio negativo + expansão Doppler + convecção natural refrigerante + contenção metálica) + análise acidentes severos (SAUNA/SAS4A) + licenciamento (IAEA SSR-2/1 + nacional) + formação operadores (simulador/treino cenários além-base) + salvaguardas (C/S medidas + IAEA)
        ],
        industry: 'Reatores Rápidos / Transmutação Resíduos'
    },
    // Quantum Computing Topological Fault-Tolerant
    {
        name: 'Computação Quântica Topológica - Tolerante a Falhas (3 Equipas)',
        description: 'Computação quântica topológica (anyons Majorana/parafermions) - 3 equipas, turnos 12h, braiding não-abeliano + códigos superfície + decodificação tempo real + arquitetura tolerante falhas intrínseca',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: operação qubits topológicos (nanofios Majorana/Josephson junctions + braiding portas Clifford + medição topológica) + síntese materiais (InAs/Al/EuS epitaxia MBE) + caracterização condutância quantizada (2e²/h)
            'NNNNOOOOMMMM', // Team B: correção erro quântica intrínseca (código superfície topológico / código cor códigos cor) + decodificação union-find/MWPM tempo real + latência <1μs + limiar erro >1% + overhead físico/lógico <10x
            'OOOOMMMMNNNN', // Team C: arquitetura escalável (interconexão qubits topológicos + bus fotónico/microondas + criogenia diluição mK + controle clássico FPGA/ASIC) + benchmark (factorização Shor / simulação Hubbard / QAOA) + roadmap milhões qubits lógicos
        ],
        industry: 'Computação Quântica Topológica'
    },
    // Meta-Materials Programmable
    {
        name: 'Materiais Meta-Programáveis - Nanofabricação (3 Equipas)',
        description: 'Metamateriais/nanomateriais reconfiguráveis (mecânicos/ópticos/térmicos/EM) - 3 equipas, turnos 12h, design inverso + nano-fabricação e-beam/FIB + caracterização multi-física + controle ativo',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: design inverso/topologia otimização (adjoint method / ML generativo + restrições fabricação) + meta-átomos (split-ring / dielétrico Mie / kirigami/auxético) + simulação multi-física (FDTD/FEM/COMSOL) + banda proibida / índice negativo / cloaking
            'NNNNOOOOMMMM', // Team B: nano-fabricação alta resolução (e-beam litho <10nm + FIB/He-IB milling + ALD conformal + transferência 2D/heteroestruturas) + processos CMOS-compatíveis (fundição multi-project wafer) + metrologia SEM/AFM/elipsometria
            'OOOOMMMMNNNN', // Team C: caracterização dinâmica (pump-probe fs/THz + micro-ondas/THz vectores + imagem campo próximo SNOM) + controle ativo (MEMS/VO2/ferroelétrico/gráfico + bias elétrico/térmico/óptico) + aplicações: antenas reconfiguráveis / lentes planas / camuflagem térmica / harvesting
        ],
        industry: 'Materiais Meta-Programáveis'
    },
    // Autonomous AI-Driven Synthesis / Self-Driving Labs
    {
        name: 'Síntese Autónoma IA-Driven - Self-Driving Labs (4 Equipas)',
        description: 'Laboratórios auto-dirigidos IA (descoberta materiais/fármacos/catalisadores) - 4 equipas, turnos 12h, planeamento IA (Bayes/RL/LLM) + robótica síntese/ensaios + loop fechado caracterizaçăo + base conhecimento',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: planeamento experimental IA (otimização Bayesiana / RL multi-objetivo / LLM agente químico + raciocínio causal + incerteza epistémica) + seleção candidatos (espaço busca 10⁶-10¹²) + priorização Pareto (propriedades/custo/sustentabilidade)
            'NNNNOOOOPPPPMMMM', // Team B: robótica síntese (líquido manipulador / dispensação acústica / microfluídica gota-a-gota + síntese fluxo contínuo / estado sólido) + paralelização 96-1536 poços + manipulação inerte (glovebox robótico) + rastreabilidade digital (blockchain/LIMS)
            'OOOOPPPPMMMMNNNN', // Team C: caracterização alta throughput (XRD/DRX rápida + Raman/IR imaging + UV-Vis/fluorescência + espectrometria massa autómata) + análise IA (reconhecimento padrões / deteção anomalias + extração parâmetros físicos) + feedback loop <30 min
            'PPPPMMMMNNNNOOOO', // Team D: base conhecimento (grafo conhecimento químico + literatura mineração NLP + dados FAIR/ontologias) + modelo fundação materiais (GNoME/MatBERT/ChemBERTa) + transfer learning domínios + publicação automática + IP/patentes + colaboração aberta (Open Science)
        ],
        industry: 'Síntese Autónoma IA-Driven'
    },
    // Space Habitat / Lunar ISRU Habitat
    {
        name: 'Habitação Espacial / ISRU Lunar (4 Equipas)',
        description: 'Habitat lunar/ISRU (regolito → oxigénio/água/metais + construção aditiva + suporte vida) - 4 equipas, turnos 12h, escavação/processamento + fabricação habitat + ECLSS + operações superfície',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: escavação/processamento regolito (rovers escavação + beneficiamento magnético/eletrostático + redução hidrogénio/molten salt electrolysis + extração O2/H2O/Fe/Al/Ti/Si) + pureza >99% + rendimento >80%
            'NNNNOOOOPPPPMMMM', // Team B: construção habitat (impressão 3D regolito/geopolímero + sinterização microondas/laser + revestimento radiação/micrometeoritos + arquitetura inflável/rígida híbrida) + integração ECLSS (ar/água/resíduos ciclo fechado >98%)
            'OOOOPPPPMMMMNNNN', // Team C: ECLSS/suporte vida (remoção CO2 zeólito/amina + eletrólise água + gestão térmica radiadores/heat pipes + monitoramento qualidade ar/água + redundância 3x + certificação NASA/ESA)
            'PPPPMMMMNNNNOOOO', // Team D: operações superfície (EVA robótica/humana + manutenção preventiva/preditiva + logística reabastecimento Gateway/Starship + ciência (geologia/astrobiologia/radioastronomia) + coordenação missão Houston/ESOC + protocolo Artemis/ILRS
        ],
        industry: 'Habitação Espacial / ISRU Lunar'
    },
    // Laser Fusion / Inertial Confinement Advanced
    {
        name: 'Fusão a Laser Avançada - Confinamento Inercial (4 Equipas)',
        description: 'Fusão confinamento inercial laser (NIF/LMJ/Shenguang/laser directo) - 4 equipas, turnos 12h, drivers laser alta energia + alvos criogénicos + diagnósticos ignição + ganho >1 repetível',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: drivers laser (Nd:glass/NF-fibra/Óxido Ti:Sa + amplificação chirped-pulse + conversão frequência 3ω/2ω + energia >2MJ/350kJ + precisão apontamento <50μm) + óptica adaptativa + proteção danos laser
            'NNNNOOOOPPPPMMMM', // Team B: alvos criogénicos (cápsula DT/HD camadas + casca diamante/polímero/Be + preenchimento camada β-DT 18-20K + caracterização rugosidade <1nm + injeção taxa >1Hz + rastreamento alvo)
            'OOOOPPPPMMMMNNNN', // Team C: diagnósticos ignição (neutrões tempo-voo + raios-X imagem + gama espectroscopia + partículas carregadas + interferometria VISAR + PIيون + resolução temporal <10ps + ganho >1 validação)
            'PPPPMMMMNNNNOOOO', // Team D: câmara reação/reciclagem (limpeza detritos + recuperação trítio + blindagem nêutrons/ativação + gestão calor + engenharia wall/blanket + licença regulatória + economia energia líquida + roadmap central comercial)
        ],
        industry: 'Fusão a Laser Avançada'
    },
    // Synthetic Biology De Novo Design
    {
        name: 'Biologia Sintética - Design De Novo (3 Equipas)',
        description: 'Design de novo genomas/organismos (células mínimas/organismos sintéticos) - 3 equipas, turnos 12h, design genoma computacional + síntese/montagem DNA + boot-up célula + evolução dirigida',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: design genoma computacional (modelos escala genoma / ML previsão fenótipo + essencialidade genes / vias metabólicas / regulação) + genoma mínimo (JCVI-syn3.0/4.0 + redução não-essencial + robustez ambiental) + circuitos genéticos ortogonais
            'NNNNOOOOMMMM', // Team B: síntese/montagem DNA (oligonucleótidos microarray + montagem Gibson/CPEC/levadura + clones BAC/YAC + verificação NGS/long-read PacBio/ONT) + erro <10⁻⁸ bp + escala megabase + custo <$0,01/bp
            'OOOOMMMMNNNN', // Team C: boot-up célula (transplantação genoma + citoplasma receptor + ativação replicação/transcrição/tradução + viabilidade >90%) + evolução dirigida (ALE quimiostato + seleção fitness + genómica populações + fixação mutações benéficas) + aplicações: biofabricação / biossensores / terapêutica
        ],
        industry: 'Biologia Sintética De Novo'
    },
    // Photonic Quantum Computing
    {
        name: 'Computação Quântica Fotónica - Cluster States (3 Equipas)',
        description: 'Computação quântica fotónica (estados cluster/medição-baseada) - 3 equipas, turnos 12h, fontes fotões únicos/entrelaçados + circuitos integrados SiN/LiNbO₃ + detetores SNSPD + correção erro fotónica',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: fontes quânticas (quantum dots/SiV/SiC/SPD + microcavidades Purcell + indistinguibilidade >99% + taxa >GHz + multiplexação temporal/espectral/espacial) + entrelaçamento (fusion gates tipo-I/II + cluster states 2D/3D + topologia Raussendorf)
            'NNNNOOOOMMMM', // Team B: circuitos integrados fotónicos (SiN/LiNbO₃/BTO + moduladores electro-ópticos >40GHz + faseadores térmicos/MEMS + perdas <0,1dB/cm + escalabilidade >1000 modos + packaging flip-chip/edge-coupling)
            'OOOOMMMMNNNN', // Team C: deteção/medição (SNSPD eficiência >98% / resolução número fotões + homodina/heterodina + feed-forward clássico <100ns + decodificação LDPC/GKP + tolerância perda >50% + benchmark (boson sampling / QFT / VQE fotónico)
        ],
        industry: 'Computação Quântica Fotónica'
    },
    // Space Elevator / Orbital Transport
    {
        name: 'Elevador Espacial / Transporte Orbital (3 Equipas)',
        description: 'Elevador espacial / tether orbital (nanotubos carbono/grafeno/boron nitride) - 3 equipas, turnos 12h, cabo mega-estrutura + climbers + âncora oceânica/equatorial + logística LEO/GEO/Lunar',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: cabo mega-estrutura (CNT/grafeno/BNNT resistência >100GPa + densidade <2g/cm³ + fabricação metro-escala + união/solda nano + revestimento proteção atômico oxigénio/UV/radiação) + tensão operacional 60-80GPa + fator segurança >2
            'NNNNOOOOMMMM', // Team B: climbers (propulsão elétrica/laser beaming + motores lineares + gestão térmica radiadores + carga útil 10-100t + velocidade 200km/h + tempo subida ~5 dias + redundância/fail-safe + docking autónomo)
            'OOOOMMMMNNNN', // Team C: âncora/operações (plataforma oceânica equatorial móvel + tensão ativa + evasão detritos/colisão + controle vibrações/modos + logística LEO/GEO/Lunar + custo <$100/kg vs $10k/kg foguete + roadmap demonstrador 2035/operacional 2045)
        ],
        industry: 'Elevador Espacial / Transporte Orbital'
    },
    // Neuromorphic Memristive Large-Scale
    {
        name: 'Computação Neuromórfica Memristiva - Larga Escala (4 Equipas)',
        description: 'Computação neuromórfica memristiva em larga escala (SNN/memristores RRAM/PCM/Oxide) - 4 equipas, turnos 12h, arquitetura spiking + STDP on-chip + inferência edge + treinamento in-situ + co-design hardware/algoritmo',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: design arquitetura (neurónios LIF/ALIF/SNN + topologia hierárquica/multicamada + plasticidade STDP/R-STDP + quantização baixa precisão + sparsity estruturada) + simulação (NEST/Brian2/Nengo + GPU/TPU) + métricas (energia/latência/precisão/throughput)
            'NNNNOOOOPPPPMMMM', // Team B: fabricação memristores (RRAM HfO₂/TaOₓ + PCM Ge₂Sb₂Te₅ + óxidos perovskita + crossbar 3D vertical + seletor 1T1R/1S1R) + variabilidade ciclo-a-ciclo <5% + retenção >10 anos + endurance >10¹² ciclos
            'OOOOPPPPMMMMNNNN', // Team C: integração sistema (CMOS 28nm/22nm/7nm + interposers 2.5D/3D + roteamento high-speed + gestão térmica microfluidica + power delivery) + compilador neuromórfico (mapeamento grafo → crossbar + otimização energia/latência) + benchmark (MNIST/CIFAR/Speech/RL edge)
            'PPPPMMMMNNNNOOOO', // Team D: deploy edge (inferência <1ms + consumo <10mW + aprendizagem contínua online + privacidade federada + atualização OTA modelo) + aplicações: visão eventos (DVS) / robótica / IoT / médica / defesa / autonomia veicular + roadmap exaescala neuromórfica
        ],
        industry: 'Computação Neuromórfica Memristiva'
    },
    // Advanced Magnetic Fusion Stellarator/Tokamak
    {
        name: 'Fusão Magnética Avançada - Stellarator/Tokamak (4 Equipas)',
        description: 'Fusão magnética avançada (stellarator otimizado / tokamak esférico / ST40 / SPARC / ITER) - 4 equipas, turnos 12h, supercondutores HTS REBCO + controle plasma tempo real + manta trítio + balanço energia líquido >Q=10',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: ímãs supercondutores HTS (REBCO fita 12T/20T + bobinas não-planares stellarator / tokamak esférico + proteção quench + corrente persistente) + criogenia hélio 4K/1.8K + forças Lorentz + alinhamento <mm
            'NNNNOOOOPPPPMMMM', // Team B: aquecimento/controle plasma (NBI 1MeV + ICRH/ECRH/LHCD + controle feedback tempo real <1ms + MHD estabilidade + ELM mitigação RMP/pellets + diagnósticos Thomson/reflectometria/bolômetros) + cenários avançados (H-mode/ITB/steady-state)
            'OOOOPPPPMMMMNNNN', // Team C: manta trítio (breeding >1.1 / Li₄SiO₄/Li₂TiO₃ + multiplicador nêutrons Be/Pb + extração permeação/He purge + purificação ISS/criogénica + inventário <1kg + ciclo auto-suficiente) + materiais plasma-facing (W mono-bloco / compósitos CFC / HTS tapes)
            'PPPPMMMMNNNNOOOO', // Team D: engenharia sistema (vaso vácuo / criostato / blindagem biológica + manutenção remota hot cell + licenciamento nuclear + economia LCOE <$50/MWh + roadmap DEMO/central comercial 2040s + supply chain HTS/ITER-grade)
        ],
        industry: 'Fusão Magnética Avançada'
    },
    // Near-Earth Asteroid Mining
    {
        name: 'Mineração Asteroides Próxima Terra (3 Equipas)',
        description: 'Mineração asteroides NEA (metais platina/terras raras/água/voláteis) - 3 equipas, turnos 12h, prospecção espectral + extração robótica + processamento in-situ + retorno carga útil / logística cis-lunar',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: prospecção/observação (telescópios terra/espaço + radar planetário + espectroscopia VIS/NIR/MIR + classificação taxonômica C/S/M/X + delta-v <6km/s + window lançamento) + caracterização forma/rotação/composição
            'NNNNOOOOMMMM', // Team B: extração robótica (anchoring microgravidade + perfuração/abração laser + coleta regolito/voláteis + processamento térmico/químico/eletroquímico in-situ + separação metais/água/O2 + pureza >99.9%) + ISRU integrado
            'OOOOMMMMNNNN', // Team C: logística retorno (veículo retorno reutilizável + aerocaptura/aerofrenagem + carga útil 10-100t + custo <$500/kg LEO) + mercado (PGMs/REEs/água propelente / construção orbital) + governança (Outer Space Treaty / Artemis Accords / partilha benefícios)
        ],
        industry: 'Mineração Asteroides Próxima Terra'
    },
    // Global Quantum Internet
    {
        name: 'Internet Quântica Global (3 Equipas)',
        description: 'Internet quântica global (repetidores quânticos / memórias atómicas/sólidas / satélites QKD / rede fibra+espaço) - 3 equipas, turnos 12h, distribuição entrelaçamento intercontinental + protocolos QKD/teletransporte + integração rede clássica',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: repetidores quânticos (memórias ensemble atómico Rb/Cs / vacância diamante NV/SiV / rare-earth íons YSO + tempo coerência >1s + fidelidade >99% + multiplexação temporal/espectral/espacial) + purificação entrelaçamento + swapping
            'NNNNOOOOMMMM', // Team B: segmento espaço (satélites LEO/MEO/GEO + fontes entrelaçamento SPDC/SQLD + apontamento <μrad + link óptico downlink >Gbps + estações terra adaptativas + constelação >100 sat) + segmento fibra (baixa perda <0.15dB/km + DWDM quântico+clássico)
            'OOOOMMMMNNNN', // Team C: pilha protocolo (QKD: BB84/E91/MDI/CV + teletransporte quântico / clock sincronização / sensorimetria distribuída) + camada controle (SDN quântico / roteamento entrelaçamento / QoS fidelidade/taxa) + integração PQC (Kyber/Dilithium) + certificação ETSI/ISO + casos uso: banca/governo/defesa/infraestrutura crítica
        ],
        industry: 'Internet Quântica Global'
    },
    // Distributed Biomanufacturing
    {
        name: 'Biofabricação Distribuída (4 Equipas)',
        description: 'Biofabricação distribuída / point-of-care (CGT/terapias celulares/vacinas mRNA/proteínas) - 4 equipas, turnos 12h, plataformas modulares autónomas + bioprocessamento contínuo + QC inline + logística cadeia frio descentralizada',
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: plataformas modulares (bióreatores single-use 50-500L + perfusão/tangential flow + automação PAT/NIR/Raman + controle modelo-preditivo + escalabilidade number-up/out) + digital twin + gêmeo virtual processo
            'NNNNOOOOPPPPMMMM', // Team B: bioprocessamento contínuo (expansão células T/NK/linfócitos + transdução viral/não-viral CRISPR/TCR/CAR + formulação fill-finish asséptica + liofilização + dose paciente personalizada) + tempo veia-veia <7 dias
            'OOOOPPPPMMMMNNNN', // Team C: QC inline/real-time (NGS/QC genómico + citometria fluxo + potência/segurança/esterilidade + release teste rápido <24h) + blockchain rastreabilidade + conformidade GMP/FDA/EMA/ANVISA + pharmacovigilância
            'PPPPMMMMNNNNOOOO', // Team D: rede distribuída (hubs regionais + spokes hospitalares + logística criogénica LN2/vapor phase + monitoramento IoT temperatura/choque + reabastecimento just-in-time) + economia (CAPEX/OPEX vs centralizado) + acesso equitativo global + preparação pandemia
        ],
        industry: 'Biofabricação Distribuída'
    },
    // Marine Alkalinity Geoengineering
    {
        name: 'Geoengenharia Marinha - Alcalinidade Oceânica (3 Equipas)',
        description: 'Aumento alcalinidade oceânica (OAE) / weathering aumentado / eletroquímica marinha - 3 equipas, turnos 12h, adição minerais alcalinos / eletrodíálise bipolar / monitoramento MRV + governança internacional',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: implantação alcalinidade (olivina/dunite/calcário moído <10μm + dispersão navios/plataformas / tubulações costeiras + dosagem 1-10 Gt/ano + cinética dissolução pH/TA/DIC) + ciclo vida (mineração/moagem/transporte/energia) + LCA emissões líquidas negativas
            'NNNNOOOOMMMM', // Team B: eletroquímica marinha (eletrodíálise bipolar / eletrolise água mar + produção H₂/alcalinidade + membranas AEM/CEM + energia renovável offshore eólica/solar + custos <$100/tCO₂) + acoplamento captura direta ar/oceano (DAC/OAE híbrido)
            'OOOOMMMMNNNN', // Team C: MRV/ecologia (monitoramento autonomo: gliders/boias/satélites + sensores pH/pCO₂/alcalinidade/nutrientes/O₂ + modelo biogeoquímico acoplado + impactos ecossistema: fitoplâncton/coral/acidificação) + governança (LC/LP/UNFCCC/CDR-CoP + consentimento livre prévio informado + equidade Norte/Sul)
        ],
        industry: 'Geoengenharia Marinha Alcalinidade'
    },
    // Direct Fusion Propulsion
    {
        name: 'Propulsão Fusão Direta - Motor Espacial (3 Equipas)',
        description: 'Propulsão fusão direta (DFD/PRF/ROC/MTF) - 3 equipas, turnos 12h, reator compacto aneutrónico (p-¹¹B/³He-D) / magnético inercial híbrido + exaustão plasma direta + impulso específico >10.000s + empuxo >10N',
        teams: 3,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOO',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOO', // Team A: núcleo fusão compacto (FRC/espelho magnético/estelarator miniaturizado + supercondutores HTS REBCO + β alto >30% + ignição/auto-sustentação + razão potência/massa >1kW/kg) + combustível aneutrónico (p-¹¹B/³He-D + captação energia direta partículas carregadas)
            'NNNNOOOOMMMM', // Team B: conversão energia direta (expansão magnética/nozzle magnético + separação carga + conversão eletrostática/indutiva + eficiência >80% + potência elétrica bordo >100kW) + gestão térmica (radiadores alta temperatura / heat pipes / PCM) + blindagem radiação tripulação/eletrónica
            'OOOOMMMMNNNN', // Team C: missão espaço profundo (Marte 30-90 dias / cinturão asteroides / Júpiter/Saturno / heliopausa) + arquitetura nave (habitat rotativo gravidade artificial + ISRU reabastecimento + autonomia IA + comunicações laser/quântica) + roadmap demonstrador 2030 / operacional 2040 + custo <$1B/missão
        ],
        industry: 'Propulsão Fusão Direta'
    },
    // Rotating Orbital Habitats Artificial Gravity
    {
        name: 'Habitats Orbitais Rotativos - Gravidade Artificial (4 Equipas)',
        description: "Habitats orbitais rotativos (estações Stanford Torus / O'Neill Cylinder / gravidade artificial 0.3-1g) - 4 equipas, turnos 12h, estrutura mega-escala + controle atitude/estabilidade + ECLSS fechado + logística reabastecimento + população 100-10.000",
        teams: 4,
        shiftDuration: 12,
        weeklyHoursContract: 40,
        pattern: 'MMMMNNNNOOOOPPPP',
        startDate: '2025-01-01',
        teamPatterns: [
            'MMMMNNNNOOOOPPPP', // Team A: estrutura/mecânica (materiais compósitos CFRP/alumínio-lítio / grafeno/CNT + raio 50-500m + rotação 1-3 RPM + tensão centrífuga + modos vibração/precessão/nutation + amortecimento ativo/passivo + montagem orbital robótica / lançamento Starship/SLS)
            'NNNNOOOOPPPPMMMM', // Team B: ECLSS/suporte vida (ciclo fechado ar/água/resíduos >99% + agricultura hidropónica/aeropónica/vertical + bioregenerativo algas/cianobactérias + redundância 4x + certificação NASA STD-3001) + saúde (contrabalanço gravidade artificial + exercício/farmacologia + monitoramento contínuo)
            'OOOOPPPPMMMMNNNN', // Team C: operações/segurança (controle atitude CMG/reaction wheels + propulsão elétrica station-keeping + evasão detritos/conjunção + blindagem radiação (polietileno/água/regolito) + abrigo tempestade solar + supressão incêndio microgravidade + evacuação emergência cápsula)
            'PPPPMMMMNNNNOOOO', // Team D: sociedade/economia (governança autónoma / lei espacial / propriedade / comércio interestelar) + ciência (microgravidade variável / astrobiologia / materiais / telescópios) + turismo / indústria orbital / hub logístico cis-lunar/Marte + roadmap: demonstrador 2035 / colónia 2050 / cidade orbital 2075
        ],
        industry: 'Habitats Orbitais Rotativos'
    },
];
