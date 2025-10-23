export type SealCode = `Seal${string}`;
export type ISODate = string;

export interface CountdownConfig {
  anchor: ISODate | SealCode;
  grace_window?: string;   // ISO8601 duration, e.g., PT3H
  oracle_refs?: string[];
  care_min?: number;       // 0..1
  proof_min?: number;      // 0..1
  labels?: Record<string, string>;
  meta?: Record<string, unknown>;
}

export type CountdownState =
  | "INTENT"
  | "BONDED"
  | "MATURING"
  | "FINAL"
  | "REPAIR_REQUIRED";

export interface CountdownRecord {
  id: string;
  cfg: CountdownConfig;
  state: CountdownState;
  created_at: string;
  anchor_iso: string;
  grace_ms: number;
  last_update: string;
}
