import { Scenario } from '../types';

interface SharedScenarioData {
    n?: string;
    t?: number;
    d?: number;
    w?: number;
    p?: string;
    tp?: string[];
    s?: string;
}

function encodeScenario(scenario: Scenario): string {
    const shareData: SharedScenarioData = {
        n: scenario.name,
        t: scenario.teams,
        d: scenario.shiftDuration,
        w: scenario.weeklyHoursContract,
        p: scenario.pattern,
        tp: scenario.teamPatterns,
        s: scenario.startDate,
    };

    return btoa(JSON.stringify(shareData));
}

function decodeScenario(encoded: string): SharedScenarioData | null {
    try {
        return JSON.parse(atob(encoded));
    } catch {
        return null;
    }
}

export function generateShareableLink(scenario: Scenario): string {
    const encoded = encodeScenario(scenario);
    const url = new URL(window.location.href);
    url.hash = `share=${encoded}`;
    url.search = '';
    return url.toString();
}

export function copyShareableLink(scenario: Scenario): void {
    const link = generateShareableLink(scenario);
    navigator.clipboard.writeText(link).catch(() => {
        const input = document.createElement('input');
        input.value = link;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    });
}

export function checkForSharedScenario(): SharedScenarioData | null {
    const hash = window.location.hash;
    const match = hash.match(/^#share=(.+)$/);
    if (!match) return null;

    const data = decodeScenario(match[1]);
    if (!data) return null;

    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    return data;
}