import { describe, it, expect } from 'vitest';
import { fr } from '../fr';
import { pt } from '../pt';

describe('French translation (fr)', () => {
  it('has the exact same keys structure as pt', () => {
    const getKeys = (obj: Record<string, any>, prefix = ''): string[] =>
      Object.keys(obj).reduce((res: string[], key) => {
        const val = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          return [...res, ...getKeys(val, path)];
        }
        return [...res, path];
      }, []);

    const ptKeys = getKeys(pt);
    const frKeys = getKeys(fr);

    expect(frKeys.sort()).toEqual(ptKeys.sort());
  });

  it('has non-empty string values', () => {
    const checkValues = (obj: Record<string, any>) => {
      Object.values(obj).forEach(val => {
        if (typeof val === 'object' && val !== null) {
          checkValues(val);
        } else {
          expect(typeof val).toBe('string');
          expect((val as string).trim().length).toBeGreaterThan(0);
        }
      });
    };
    checkValues(fr);
  });

  it('is distinct from Portuguese (pt)', () => {
    expect(fr.header.title).toBe(pt.header.title); // brand name remains same
    expect(fr.header.settings).not.toBe(pt.header.settings);
    expect(fr.dashboard.generate).not.toBe(pt.dashboard.generate);
  });
});
