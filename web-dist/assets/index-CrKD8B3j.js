(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function c(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=c(e);fetch(e.href,t)}})();const s=document.querySelector("#app");if(!s)throw new Error("Missing #app mount");const l=["npm run dev  # Starts MirrorOS Countdown API","npx wscat -c ws://localhost:3000/ws","curl -X POST http://localhost:3000/api/countdown ..."];s.innerHTML=`
  <h1 style="margin-top:0;font-size:2.6rem;">🪞 MirrorOS Countdown Widget</h1>
  <p style="color:#d6b168;font-size:1.1rem;">Realtime ritual status + ws broadcast.</p>
  <section style="text-align:left;margin-top:2rem;">
    <h2 style="color:#f5f0e6;font-size:1.4rem;">Getting Started</h2>
    <ol style="line-height:1.8;">
      ${l.map(n=>`<li><code>${n}</code></li>`).join("")}
    </ol>
  </section>
`;
