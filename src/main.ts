/// <reference lib="dom" />

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app mount");
}

const commands = [
  "npm run dev  # Starts MirrorOS Countdown API",
  "npx wscat -c ws://localhost:3000/ws",
  "curl -X POST http://localhost:3000/api/countdown ...",
];

app.innerHTML = `
  <h1 style="margin-top:0;font-size:2.6rem;">🪞 MirrorOS Countdown Widget</h1>
  <p style="color:#d6b168;font-size:1.1rem;">Realtime ritual status + ws broadcast.</p>
  <section style="text-align:left;margin-top:2rem;">
    <h2 style="color:#f5f0e6;font-size:1.4rem;">Getting Started</h2>
    <ol style="line-height:1.8;">
      ${commands.map((c) => `<li><code>${c}</code></li>`).join("")}
    </ol>
  </section>
`;
