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
        name: '4.2.4.2.4.4',
        description: '5 equipas - 4 manhãs, 2 folgas, 4 tardes, 2 folgas, 4 noites, 4 folgas',
        teams: 5,
        shiftDuration: 8.93,
        weeklyHoursContract: 37.5,
        pattern: 'MMMMFFTTTTFFNNNNFFFF',
        startDate: '2024-01-01', // Generic start date
        teamPatterns: [
            'MMMMFFTTTTFFNNNNFFFF', // Team A
            'FFTTTTFFNNNNFFFFMMMM', // Team B (Offset 4)
            'TTFFNNNNFFFFMMMMFFTT', // Team C (Offset 8)
            'NNFFFFMMMMFFTTTTFFNN', // Team D (Offset 12)
            'FFFFMMMMFFTTTTFFNNNN', // Team E (Offset 16)
        ]
    },
    {
        name: '3.2',
        description: '5 equipas - 3 noites, 2 folgas, 3 tardes, 2 folgas, 3 manhãs, 2 folgas',
        teams: 5,
        shiftDuration: 8.93,
        weeklyHoursContract: 37.5,
        pattern: 'NNNFFTTTFFMMMFF',
        startDate: '2024-01-01', // Generic start date
        teamPatterns: [
            'NNNFFTTTFFMMMFF', // Team A
            'FFTTTFFMMMFFNNN', // Team B (Offset 3)
            'TTFFMMMFFNNNFFT', // Team C (Offset 6)
            'FMMMFFNNNFFTTTF', // Team D (Offset 9)
            'MFFNNNFFTTTFFMM', // Team E (Offset 12)
        ]
    },
    {
        name: 'Veralia',
        description: '5 equipas - Padrão complexo de 70 dias com rotação variável',
        teams: 5,
        shiftDuration: 8.93,
        weeklyHoursContract: 37.5,
        pattern: 'FFFFFFFFFFFFFFNNNNFTTTTFFMMMFNNNNFFTTTTFMMMFFNNNNFTTTTFFMMMFNNNNFTTTTT',
    },
    {
        name: 'Current',
        description: '4 equipas - Ciclo de 28 dias (Manhãs, Tardes, Noites)',
        teams: 4,
        shiftDuration: 8, // Assuming 8h shifts based on standard
        weeklyHoursContract: 40, // Assuming 40h based on standard
        pattern: 'TFNNNNMFMMMMMFMTTTTFNNNFFFTT', // Default pattern (Team A)
        startDate: '2025-01-01', // Reference date from Excel 2025
        teamPatterns: [
            'TFNNNNMFMMMMMFMTTTTFNNNFFFTT', // Team A
            'NNFFFTTTFNNNNMFMMMMMFMTTTTFN', // Team B
            'MTTTTFNNNFFFTTTFNNNNMFMMMMMF', // Team C
            'FMMMMMFMTTTTFNNNFFFTTTFNNNNM', // Team D
        ],
    },
];
