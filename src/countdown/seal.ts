/**
 * Simple Seal → ISO resolver.
 * Extend this map with canonical Prophecy Calendar values.
 */
export const SEAL_MAP: Record<string, string> = {
  "Seal11.13": "2025-11-13T11:13:00Z",
  "Seal2.14": "2026-02-14T14:00:00Z"
};

export function resolveSealToISO(seal: string): string {
  const iso = SEAL_MAP[seal];
  if (!iso) throw new Error(`Unknown Seal code: ${seal}`);
  return iso;
}
