import { describe, it, expect } from 'vitest';
import { de } from '../de';
import { pt } from '../pt';

describe('German translation (de)', () => {
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
    const deKeys = getKeys(de);

    expect(deKeys.sort()).toEqual(ptKeys.sort());
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
    checkValues(de);
  });

  it('is distinct from Portuguese (pt)', () => {
    expect(de.header.title).toBe(pt.header.title); // brand name remains same
    expect(de.header.settings).not.toBe(pt.header.settings);
    expect(de.dashboard.generate).not.toBe(pt.dashboard.generate);
  });
});
