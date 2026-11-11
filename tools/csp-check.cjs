// Opens every page against tools/csp-serve.cjs and reports CSP violations and console errors.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({channel:'chrome'});
for (const u of ['http://localhost:4401/','http://localhost:4401/practice','http://localhost:4401/sources']) for (const w of [1440,390]) {
const p=await b.newPage({viewport:{width:w,height:900}}); const errs=[];
p.on('console',m=>{if(m.type()==='error'||/Content Security Policy/.test(m.text()))errs.push(m.text().slice(0,160))}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(u,{waitUntil:'networkidle'});
const H=await p.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<H;y+=400){await p.evaluate(y=>scrollTo(0,y),y); await p.waitForTimeout(30);}
if(u.endsWith('4401/')){ await p.fill('#lc-input','bit.ly/abc'); await p.click('[data-linkcheck] button'); }
await p.waitForTimeout(500);
console.log(u,w,errs.length?errs:'no console errors');
await p.close();}
await b.close();})();
