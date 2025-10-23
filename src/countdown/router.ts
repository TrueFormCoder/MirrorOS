import express from "express";
import { randomUUID } from "crypto";
import { createCountdown, start, finalize, get, repair, deadline } from "./machine";
import type { CountdownConfig } from "./schema";

export const router = express.Router();

router.post("/", (req, res) => {
  try {
    const cfg = req.body as CountdownConfig;
    if (!cfg?.anchor) return res.status(400).json({ error: "anchor required" });
    const id = randomUUID();
    const rec = createCountdown(id, cfg);
    return res.status(201).json(rec);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/:id", (req, res) => {
  try {
    const rec = get(req.params.id);
    deadline(rec.id);
    return res.json(rec);
  } catch (e: any) {
    return res.status(404).json({ error: e.message });
  }
});

router.post("/:id/start", (req, res) => {
  try {
    const rec = start(req.params.id);
    return res.json(rec);
  } catch (e: any) {
    return res.status(404).json({ error: e.message });
  }
});

router.post("/:id/finalize", (req, res) => {
  try {
    const rec = finalize(req.params.id);
    return res.json(rec);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

router.post("/:id/repair", (req, res) => {
  try {
    const nextAnchorISO = req.body?.next_anchor_iso;
    if (!nextAnchorISO) return res.status(400).json({ error: "next_anchor_iso required" });
    const rec = repair(req.params.id, nextAnchorISO);
    return res.json(rec);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});
