import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveAutoBackup, getAutoBackup, clearAutoBackup, getBackupAge, formatBackupAge, BACKUP_INTERVAL } from '../backup';

describe('backup utils', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('should export BACKUP_INTERVAL of 5 minutes', () => {
        expect(BACKUP_INTERVAL).toBe(5 * 60 * 1000);
    });

    it('should return null when no backup exists', () => {
        expect(getAutoBackup()).toBeNull();
    });

    it('should save and retrieve a backup with timestamp and version', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-15T10:30:00Z'));
        const data = { scenarios: [1, 2, 3] };
        saveAutoBackup(data);

        const backup = getAutoBackup();
        expect(backup).not.toBeNull();
        expect(backup!.data).toEqual(data);
        expect(backup!.timestamp).toBe('2026-01-15T10:30:00.000Z');
    });

    it('should return null on corrupted backup', () => {
        localStorage.setItem('shiftsim_auto_backup', '{invalid');
        expect(getAutoBackup()).toBeNull();
    });

    it('should clear backup', () => {
        saveAutoBackup({ x: 1 });
        clearAutoBackup();
        expect(getAutoBackup()).toBeNull();
    });

    it('should compute backup age in milliseconds', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-15T10:30:00Z'));
        const timestamp = '2026-01-15T10:00:00.000Z';
        expect(getBackupAge(timestamp)).toBe(30 * 60 * 1000);
    });

    it('should format age as "agora mesmo" for less than a minute', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-15T10:00:30Z'));
        expect(formatBackupAge('2026-01-15T10:00:00.000Z')).toBe('agora mesmo');
    });

    it('should format age in minutes', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-15T10:05:00Z'));
        expect(formatBackupAge('2026-01-15T10:00:00.000Z')).toBe('ha 5 min');
    });

    it('should format age in hours', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-15T13:00:00Z'));
        expect(formatBackupAge('2026-01-15T10:00:00.000Z')).toBe('ha 3h');
    });

    it('should format age in days', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-18T10:00:00Z'));
        expect(formatBackupAge('2026-01-15T10:00:00.000Z')).toBe('ha 3 dia(s)');
    });
});