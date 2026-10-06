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
];
