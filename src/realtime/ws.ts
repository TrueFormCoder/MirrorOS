import { WebSocketServer } from "ws";
import type { Server } from "http";
import { eventBus } from "../countdown/events";

export function attachWs(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ type: "hello", ok: true, path: "/ws" }));
  });

  eventBus.on("countdown:update", (evt) => {
    broadcast(wss, evt);
  });
  eventBus.on("countdown:final", (evt) => {
    broadcast(wss, evt);
  });
  eventBus.on("countdown:repair", (evt) => {
    broadcast(wss, evt);
  });

  function broadcast(wss: WebSocketServer, data: unknown) {
    const msg = JSON.stringify(data);
    for (const client of wss.clients) {
      if (client.readyState === 1) client.send(msg);
    }
  }

  return wss;
}
