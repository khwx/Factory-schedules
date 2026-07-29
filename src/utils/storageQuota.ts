const QUOTA_WARN_THRESHOLD = 0.8; // 80%
const TEST_SIZE = 1024 * 10; // 10KB test string

function getEstimatedUsage(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key);
    if (value) {
      total += key.length + value.length;
    }
  }
  return total * 2; // UTF-16 encoding factor
}

export function getStorageInfo(): { usedBytes: number; estimatedQuota: number; percentUsed: number } {
  const usedBytes = getEstimatedUsage();
  let estimatedQuota = 5 * 1024 * 1024; // assume 5MB default

  try {
    // Try to detect actual quota by writing a test string
    const testKey = '_shiftsim_quota_test_';
    let totalWritten = 0;
    while (totalWritten < 5 * 1024 * 1024) {
      try {
        localStorage.setItem(testKey, 'x'.repeat(totalWritten + TEST_SIZE));
        totalWritten += TEST_SIZE;
      } catch {
        estimatedQuota = totalWritten + usedBytes;
        break;
      }
    }
    localStorage.removeItem(testKey);
  } catch {
    // if detection fails, use default estimate
  }

  const percentUsed = Math.min(100, Math.round((usedBytes / estimatedQuota) * 100));
  return { usedBytes, estimatedQuota, percentUsed };
}

export function isQuotaExceeded(): boolean {
  try {
    const { percentUsed } = getStorageInfo();
    return percentUsed >= QUOTA_WARN_THRESHOLD * 100;
  } catch {
    return false;
  }
}

export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
