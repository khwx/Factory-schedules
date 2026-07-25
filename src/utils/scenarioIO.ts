import type { Scenario } from '../types';

export function exportScenariosToJSON(scenarios: Scenario[]): void {
  const blob = new Blob([JSON.stringify(scenarios, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `factory-schedules-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importScenariosFromFile(): Promise<Scenario[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) { reject(new Error('No file selected')); return; }
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const { validateScenarios } = await import('./scenarioValidation');
        const valid = validateScenarios(data);
        resolve(valid);
      } catch (err) {
        reject(err);
      }
    };
    input.click();
  });
}
