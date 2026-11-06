import { describe, it, expect } from 'vitest';
import { PRESET_SCENARIOS, PresetScenario } from '../presetScenarios';
import { INDUSTRY_KEY_MAP } from '../../components/PresetSelector';
import { validateScenario } from '../../utils/scenarioValidation';
import type { Scenario } from '../../types';

/** Convert a preset into the Scenario shape persisted in localStorage. */
const toScenario = (preset: PresetScenario, index: number): Scenario => ({
    id: `preset-${index}`,
    name: preset.name,
    teams: preset.teams,
    shiftDuration: preset.shiftDuration,
    weeklyHoursContract: preset.weeklyHoursContract,
    pattern: preset.pattern,
    teamPatterns: preset.teamPatterns,
    startDate: preset.startDate,
    description: preset.description,
});

describe('PRESET_SCENARIOS integrity', () => {
    it('exposes at least one preset', () => {
        expect(PRESET_SCENARIOS.length).toBeGreaterThan(0);
    });

    it('uses only canonical shift characters (M/T/N/F)', () => {
        const invalid: string[] = [];
        PRESET_SCENARIOS.forEach((preset) => {
            if (!/^[MTNF]+$/.test(preset.pattern)) {
                invalid.push(`${preset.name}: pattern "${preset.pattern}"`);
            }
            preset.teamPatterns?.forEach((teamPattern, idx) => {
                if (!/^[MTNF]+$/.test(teamPattern)) {
                    invalid.push(`${preset.name}: teamPatterns[${idx}] "${teamPattern}"`);
                }
            });
        });
        expect(invalid).toEqual([]);
    });

    it('defines exactly one team pattern per team', () => {
        const invalid = PRESET_SCENARIOS
            .filter((preset) => preset.teamPatterns && preset.teamPatterns.length !== preset.teams)
            .map((preset) => `${preset.name}: ${preset.teams} teams vs ${preset.teamPatterns?.length} patterns`);
        expect(invalid).toEqual([]);
    });

    it('keeps every team pattern aligned with the default pattern', () => {
        const invalid: string[] = [];
        PRESET_SCENARIOS.forEach((preset) => {
            if (preset.teamPatterns && preset.pattern !== preset.teamPatterns[0]) {
                invalid.push(`${preset.name}: pattern "${preset.pattern}" != teamPatterns[0] "${preset.teamPatterns[0]}"`);
            }
            preset.teamPatterns?.forEach((teamPattern, idx) => {
                if (teamPattern.length !== preset.pattern.length) {
                    invalid.push(`${preset.name}: teamPatterns[${idx}] length ${teamPattern.length} != ${preset.pattern.length}`);
                }
            });
        });
        expect(invalid).toEqual([]);
    });

    it('maps every preset industry to an i18n key', () => {
        const industries = [...new Set(
            PRESET_SCENARIOS
                .map((preset) => preset.industry)
                .filter((industry): industry is string => Boolean(industry)),
        )];
        const missing = industries.filter((industry) => !(industry in INDUSTRY_KEY_MAP));
        expect(missing).toEqual([]);
    });

    it('passes validateScenario so presets are not dropped on reload', () => {
        const results = PRESET_SCENARIOS.map(toScenario).map((scenario) => ({
            name: scenario.name,
            valid: validateScenario(scenario),
        }));
        const invalid = results.filter((result) => !result.valid).map((result) => result.name);
        expect(invalid).toEqual([]);
    });
});
