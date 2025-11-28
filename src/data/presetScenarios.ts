export interface PresetScenario {
    name: string;
    description: string;
    teams: number;
    shiftDuration: number;
    weeklyHoursContract: number;
    pattern: string;
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
];
