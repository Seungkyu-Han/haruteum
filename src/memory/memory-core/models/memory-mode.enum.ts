export enum MemoryMode {
  TOGETHER = 'TOGETHER',
  SOLO = 'SOLO',
}

export function isCoupleMemoryMode(mode?: string): boolean {
  if (!mode) return false;
  const normalized = mode.trim().toUpperCase();
  return (
    normalized === MemoryMode.TOGETHER ||
    normalized === 'COUPLE' ||
    normalized === 'SHARED'
  );
}

