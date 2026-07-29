import { describe, it, expect } from 'vitest';
import { getStorageInfo, formatStorageSize, isQuotaExceeded } from '../storageQuota';

describe('storageQuota', () => {
  describe('formatStorageSize', () => {
    it('should format bytes', () => {
      expect(formatStorageSize(500)).toBe('500 B');
    });

    it('should format kilobytes', () => {
      expect(formatStorageSize(1500)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatStorageSize(2 * 1024 * 1024)).toBe('2.0 MB');
    });
  });

  describe('getStorageInfo', () => {
    it('should return storage info', () => {
      const info = getStorageInfo();
      expect(info).toHaveProperty('usedBytes');
      expect(info).toHaveProperty('estimatedQuota');
      expect(info).toHaveProperty('percentUsed');
      expect(info.percentUsed).toBeGreaterThanOrEqual(0);
      expect(info.percentUsed).toBeLessThanOrEqual(100);
    });
  });

  describe('isQuotaExceeded', () => {
    it('should return a boolean', () => {
      const result = isQuotaExceeded();
      expect(typeof result).toBe('boolean');
    });
  });
});
