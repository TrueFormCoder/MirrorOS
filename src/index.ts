import http from "http";
import express from "express";
import cors from "cors";
import { router as countdown } from "./countdown/router";
import { attachWs } from "./realtime/ws";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/countdown", countdown);

const server = http.createServer(app);
attachWs(server);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
server.listen(PORT, () => {
  console.log(`🪞 MirrorOS API + WS on http://localhost:${PORT} (ws: /ws)`);
});
