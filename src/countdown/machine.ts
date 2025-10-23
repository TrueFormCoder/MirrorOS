import { CountdownConfig, CountdownRecord } from "./schema";
import { resolveSealToISO } from "./seal";
import { eventBus } from "./events";

const store = new Map<string, CountdownRecord>();

function isoNow(): string {
  return new Date().toISOString();
}

function resolveAnchorISO(anchor: string): string {
  if (anchor.startsWith("Seal")) {
    return resolveSealToISO(anchor);
  }
  const t = Date.parse(anchor);
  if (isNaN(t)) throw new Error("Invalid ISO anchor");
  return new Date(t).toISOString();
}

function msFromISODuration(d: string | undefined, fallbackMs = 0): number {
  if (!d) return fallbackMs;
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?$/i.exec(d);
  if (!m) return fallbackMs;
  const hours = Number(m[1] || 0);
  const mins = Number(m[2] || 0);
  return (hours * 60 + mins) * 60 * 1000;
}

export function createCountdown(id: string, cfg: CountdownConfig): CountdownRecord {
  const rec: CountdownRecord = {
    id,
    cfg,
    state: "BONDED",
    created_at: isoNow(),
    anchor_iso: resolveAnchorISO(String(cfg.anchor)),
    grace_ms: msFromISODuration(cfg.grace_window, 0),
    last_update: isoNow(),
  };
  store.set(id, rec);
  eventBus.emitEvent({ type: "countdown:update", record: rec });
  return rec;
}

export function start(id: string): CountdownRecord {
  const rec = must(id);
  if (rec.state === "BONDED") {
    rec.state = "MATURING";
    rec.last_update = isoNow();
    eventBus.emitEvent({ type: "countdown:update", record: rec });
  }
  return rec;
}

export function finalize(id: string): CountdownRecord {
  const rec = must(id);
  if (rec.state === "MATURING") {
    if (Date.now() >= Date.parse(rec.anchor_iso)) {
      rec.state = "FINAL";
      rec.last_update = isoNow();
      eventBus.emitEvent({ type: "countdown:final", record: rec });
    } else {
      throw new Error("Too early");
    }
  }
  return rec;
}

export function deadline(id: string): CountdownRecord {
  const rec = must(id);
  if (rec.state === "MATURING") {
    const now = Date.now();
    if (now >= Date.parse(rec.anchor_iso) + rec.grace_ms) {
      rec.state = "REPAIR_REQUIRED";
      rec.last_update = isoNow();
      eventBus.emitEvent({ type: "countdown:update", record: rec });
    }
  }
  return rec;
}

export function repair(id: string, nextAnchorISO: string): CountdownRecord {
  const rec = must(id);
  rec.state = "BONDED";
  rec.cfg.anchor = nextAnchorISO;
  rec.anchor_iso = nextAnchorISO;
  rec.last_update = isoNow();
  eventBus.emitEvent({ type: "countdown:repair", record: rec });
  return rec;
}

export function get(id: string): CountdownRecord { return must(id); }

function must(id: string): CountdownRecord {
  const rec = store.get(id);
  if (!rec) throw new Error("Not found");
  return rec;
}
