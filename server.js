const fs=require('fs'),path=require('path'),https=require('https'),http=require('http');
const dir='C:\\Users\\b0231\\Desktop\\step master';
const pfx=fs.readFileSync(path.join(dir,'server.pfx'));
const opts={pfx,pfxPassphrase:'pass123'};
const cache=new Map();
const ctMap={'html':'text/html','js':'application/javascript','css':'text/css'};
const handler=(r,s)=>{
  let p=r.url==='/'?'/bot.html':r.url.split('?')[0].replace(/\/$/,'');
  if(!p) p='/bot.html';
  const cached=cache.get(p);
  if(cached){ s.writeHead(200,{'Content-Type':cached.t,'Access-Control-Allow-Origin':'*'}); s.end(cached.d); return; }
  fs.readFile(path.join(dir,p),(err,c)=>{
    if(err){ s.writeHead(404); s.end('Not found'); return; }
    const ext=p.split('.').pop();
    const ct=ctMap[ext]||'text/plain';
    cache.set(p,{d:c,t:ct});
    if(cache.size>50){ const k=cache.keys().next().value; cache.delete(k); }
    s.writeHead(200,{'Content-Type':ct,'Access-Control-Allow-Origin':'*'});
    s.end(c);
  });
};
try{ https.createServer(opts,handler).listen(8443,()=>console.log('HTTPS on 8443')); }catch(e){ console.log('HTTPS SKIP:',e.message); }
http.createServer(handler).listen(8080,()=>console.log('HTTP on 8080'));
