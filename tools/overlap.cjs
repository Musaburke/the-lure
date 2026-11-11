// Scrolls the home page in 240 px steps at three screen sizes, lets the lens settle, and reports
// any resting position where it overlaps text. (Text passing over it mid-glide is by design: the
// text sits on a layer above the lens, as on ThoughtLab.) Needs the dev server on :4400 (npx astro dev --port 4400).
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({channel:'chrome'});
for (const [w,h] of [[1440,900],[1280,720],[1024,768]]) {
const p=await b.newPage({viewport:{width:w,height:h}});
await p.goto('http://localhost:4400/',{waitUntil:'networkidle'});
const H=await p.evaluate(()=>document.documentElement.scrollHeight);
let worst=[], frames=0;
for (let y=0;y<H;y+=240){ await p.evaluate(y=>window.scrollTo(0,y),y); await p.waitForTimeout(1100);
  const hits=await p.evaluate(()=>{const L=document.querySelector('[data-lens]').getBoundingClientRect();
    const cx=L.left+L.width/2, cy=L.top+L.height/2, R=L.width*0.46;
    const out=[]; for(const el of document.querySelectorAll('main h1,main h2,main h3,main p,main li,.msg')){const r=el.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight) continue;
      const nx=Math.max(r.left,Math.min(cx,r.right)), ny=Math.max(r.top,Math.min(cy,r.bottom)); const d=Math.hypot(nx-cx,ny-cy);
      if(d<R-4) out.push(el.tagName+':'+el.textContent.trim().slice(0,30)+' by '+Math.round(R-d)+'px');}
    return out;});
  if(hits.length){frames++; worst.push(y+' '+hits[0]);}
}
console.log(w+'x'+h,'frames with overlap:',frames, worst.slice(0,6));
await p.close();}
await b.close();})();
