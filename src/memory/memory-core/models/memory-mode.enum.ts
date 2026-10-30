export enum MemoryMode {
  COUPLE = 'COUPLE',
  PERSONAL = 'PERSONAL',
}

export function isCoupleMemoryMode(mode?: string): boolean {
  if (!mode) return false;
  const normalized = mode.trim().toUpperCase();
  return normalized === MemoryMode.COUPLE || normalized === 'SHARED';
}
