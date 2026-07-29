import { useState, useEffect, useCallback } from 'react';
import { getStorageInfo, formatStorageSize } from '../utils/storageQuota';
import { AlertTriangle, X } from 'lucide-react';

export default function StorageWarning() {
  const [dismissed, setDismissed] = useState(false);
  const [info, setInfo] = useState(() => getStorageInfo());

  const check = useCallback(() => {
    setInfo(getStorageInfo());
  }, []);

  useEffect(() => {
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [check]);

  if (dismissed || info.percentUsed < 80) return null;

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 bg-amber-900/60 border border-amber-700 rounded-lg text-sm"
      role="alert"
    >
      <div className="flex items-center gap-2 text-amber-200">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>
          Armazenamento a {info.percentUsed}% — {formatStorageSize(info.usedBytes)} usado.
          Faça backup e limpe dados antigos nas Configurações.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-200 shrink-0"
        aria-label="Fechar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
