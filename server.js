const fs=require('fs'),path=require('path'),https=require('https'),http=require('http');
const dir='C:\\Users\\b0231\\Desktop\\step master';
const pfx=fs.readFileSync(path.join(dir,'server.pfx'));
const opts={pfx,pfxPassphrase:'pass123'};
const handler=(r,s)=>{
  let p=r.url==='/'?'/bot.html':r.url.split('?')[0].replace(/\/$/,'');
  if(!p) p='/bot.html';
  try{
    let c=fs.readFileSync(path.join(dir,p));
    let ct='text/plain';
    if(p.endsWith('.html')) ct='text/html';
    else if(p.endsWith('.js')) ct='application/javascript';
    else if(p.endsWith('.css')) ct='text/css';
    s.writeHead(200,{'Content-Type':ct,'Access-Control-Allow-Origin':'*'});
    s.end(c);
  }catch(e){
    s.writeHead(404);
    s.end('Not found');
  }
};
try{ https.createServer(opts,handler).listen(8443,()=>console.log('HTTPS on 8443')); }catch(e){ console.log('HTTPS SKIP:',e.message); }
http.createServer(handler).listen(8080,()=>console.log('HTTP on 8080'));
