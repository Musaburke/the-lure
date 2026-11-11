// Serves dist/ with the Content-Security-Policy from public/_headers, like Cloudflare will (:4401).
// Serves dist/ with the CSP from public/_headers, like Cloudflare will.
const http=require('http'),fs=require('fs'),path=require('path');
const root=require('path').join(__dirname,'..','dist');
const csp=fs.readFileSync(require('path').join(__dirname,'..','public','_headers'),'utf8').match(/Content-Security-Policy: (.*)/)[1];
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.ico':'image/x-icon'};
http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]); if(p.endsWith('/'))p+='index.html'; let f=path.join(root,p); if(!fs.existsSync(f)&&fs.existsSync(f+'.html'))f+='.html'; if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
 if(!fs.existsSync(f)){r.writeHead(404);return r.end('nf');} r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Content-Security-Policy':csp.replace("; upgrade-insecure-requests","")}); fs.createReadStream(f).pipe(r);}).listen(4401);
