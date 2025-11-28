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
        name: 'Continental 4.2.4.2.4.4',
        description: '5 equipas - 4 manhãs, 2 folgas, 4 tardes, 2 folgas, 4 noites, 4 folgas',
        teams: 5,
        shiftDuration: 7.5,
        weeklyHoursContract: 37.5,
        pattern: 'MMMMFFTTTTFFNNNNFFFF',
    },
    {
        name: 'Continental 4.2.4.2.4.4 (40h)',
        description: '5 equipas - 4 manhãs, 2 folgas, 4 tardes, 2 folgas, 4 noites, 4 folgas',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMMMFFTTTTFFNNNNFFFF',
    },
];
