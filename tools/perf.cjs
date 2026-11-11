// Frame times and long tasks while scrolling the production build, at normal speed and 4x CPU
// slowdown. Needs: npm run build && npx astro preview --port 4402.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({channel:'chrome'});
for (const rate of [1,4]) {
const p=await b.newPage({viewport:{width:1440,height:900}});
const cdp=await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate',{rate});
await p.addInitScript(()=>{window.__lt=[];new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lt.push(Math.round(e.duration))}).observe({type:'longtask',buffered:true}); window.__frames=[]; let last=performance.now(); const f=(t)=>{window.__frames.push(t-last); last=t; requestAnimationFrame(f)}; requestAnimationFrame(f);});
await p.goto('http://localhost:4402/',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
await p.evaluate(()=>{window.__lt=[];window.__frames=[];});
await p.mouse.move(700,450);
for(let k=0;k<120;k++){ await p.mouse.wheel(0,180); await p.waitForTimeout(40); }
const r=await p.evaluate(()=>{const f=window.__frames.slice(5); f.sort((a,b)=>a-b); const avg=f.reduce((a,b)=>a+b,0)/f.length; return {longtasks:window.__lt, frames:f.length, avgMs:avg.toFixed(1), p95:f[Math.floor(f.length*0.95)].toFixed(1), over50:f.filter(x=>x>50).length};});
console.log('cpu x'+rate, JSON.stringify(r));
await p.close();}
await b.close();})();
