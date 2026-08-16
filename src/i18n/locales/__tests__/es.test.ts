import { describe, it, expect } from 'vitest';
import { pt } from '../pt';
import { en } from '../en';
import { es } from '../es';

type Dict = Record<string, unknown>;

function flatten(obj: Dict, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object') {
            Object.assign(result, flatten(value as Dict, path));
        } else {
            result[path] = String(value);
        }
    }
    return result;
}

describe('Spanish (es) locale', () => {
    it('has the same key structure as pt and en', () => {
        const ptKeys = Object.keys(flatten(pt as Dict)).sort();
        const enKeys = Object.keys(flatten(en as Dict)).sort();
        const esKeys = Object.keys(flatten(es as Dict)).sort();

        expect(esKeys).toEqual(ptKeys);
        expect(esKeys).toEqual(enKeys);
    });

    it('provides non-empty string translations for every key', () => {
        const esFlat = flatten(es as Dict);
        for (const [key, value] of Object.entries(esFlat)) {
            expect(value.trim().length).toBeGreaterThan(0);
            expect(key).toBeTruthy();
        }
    });

    it('differs from the Portuguese translations (real translation)', () => {
        const ptFlat = flatten(pt as Dict);
        const esFlat = flatten(es as Dict);
        const differences = Object.entries(esFlat).filter(([k, v]) => ptFlat[k] !== v);
        expect(differences.length).toBeGreaterThan(0);
    });
});
