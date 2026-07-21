const BACKUP_KEY = 'shiftsim_auto_backup';
const BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function saveAutoBackup(data: unknown): void {
    try {
        const payload = {
            data,
            timestamp: new Date().toISOString(),
            version: 1,
        };
        localStorage.setItem(BACKUP_KEY, JSON.stringify(payload));
    } catch {
        // localStorage full or unavailable
    }
}

export function getAutoBackup(): { data: unknown; timestamp: string } | null {
    try {
        const raw = localStorage.getItem(BACKUP_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function clearAutoBackup(): void {
    localStorage.removeItem(BACKUP_KEY);
}

export function getBackupAge(timestamp: string): number {
    return Date.now() - new Date(timestamp).getTime();
}

export function formatBackupAge(timestamp: string): string {
    const age = getBackupAge(timestamp);
    const minutes = Math.floor(age / 60000);
    if (minutes < 1) return 'agora mesmo';
    if (minutes < 60) return `ha ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `ha ${hours}h`;
    const days = Math.floor(hours / 24);
    return `ha ${days} dia(s)`;
}

export { BACKUP_INTERVAL };
