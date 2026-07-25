import type { Scenario } from '../types';

export function validateScenario(data: unknown): data is Scenario {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if (typeof obj.id !== 'string' || !obj.id) return false;
  if (typeof obj.name !== 'string' || !obj.name) return false;
  if (typeof obj.teams !== 'number' || obj.teams < 1 || obj.teams > 100) return false;
  if (typeof obj.shiftDuration !== 'number' || obj.shiftDuration < 1 || obj.shiftDuration > 24) return false;
  if (typeof obj.pattern !== 'string' || !/^[MTNF]+$/.test(obj.pattern)) return false;

  if (obj.weeklyHoursContract !== undefined && (typeof obj.weeklyHoursContract !== 'number' || obj.weeklyHoursContract < 1)) return false;
  if (obj.hidden !== undefined && typeof obj.hidden !== 'boolean') return false;
  if (obj.teamPatterns !== undefined) {
    if (!Array.isArray(obj.teamPatterns)) return false;
    if (!obj.teamPatterns.every((p: unknown) => typeof p === 'string' && /^[MTNF]+$/.test(p))) return false;
  }
  if (obj.startDate !== undefined && typeof obj.startDate !== 'string') return false;
  if (obj.description !== undefined && typeof obj.description !== 'string') return false;

  return true;
}

export function validateScenarios(data: unknown): Scenario[] {
  if (!Array.isArray(data)) return [];
  return data.filter(validateScenario);
}

export function loadValidatedScenarios(): Scenario[] {
  try {
    const saved = localStorage.getItem('shiftsim_scenarios');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    const valid = validateScenarios(parsed);
    const removed = Array.isArray(parsed) ? parsed.length - valid.length : 0;
    if (removed > 0) {
      console.warn(`[scenarioValidation] Removed ${removed} invalid scenario(s) from localStorage`);
      localStorage.setItem('shiftsim_scenarios', JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
}
