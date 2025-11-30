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
    },
    {
        name: '3.2',
        description: '5 equipas - 3 noites, 2 folgas, 3 tardes, 2 folgas, 3 manhãs, 2 folgas',
        teams: 5,
        shiftDuration: 8.93,
        weeklyHoursContract: 37.5,
        pattern: 'NNNFFTTTFFMMMFF',
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
        name: 'Cimpor CPS FULL',
        description: '4 equipas - Ciclo de 28 dias (Manhãs, Tardes, Noites)',
        teams: 4,
        shiftDuration: 8, // Assuming 8h shifts based on standard
        weeklyHoursContract: 40, // Assuming 40h based on standard
        pattern: 'FNNNFFFTTTFNNNNMFMMMMMFMTTTT', // Default pattern (Team A)
        startDate: '2018-12-31', // Reference date from ICS
        teamPatterns: [
            'FNNNFFFTTTFNNNNMFMMMMMFMTTTT', // Team A
            'MFMTTTTFNNNFFFTTTFNNNNMFMMMM', // Team B
            'NMFMMMMMFMTTTTFNNNFFFTTTFNNN', // Team C
            'TTTFNNNNMFMMMMMFMTTTTFNNNFFF', // Team D
        ],
    },
];
