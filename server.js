'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {WebSocketServer,WebSocket}=require('ws');
const root=path.join(__dirname,'public');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end();return}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 if(pathname.includes('\0')){res.writeHead(400).end();return}
 const file=path.resolve(root,'.'+pathname.replace(/\/$/,'/index.html'));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 fs.stat(file,(err,st)=>{
  if(err||!st.isFile()){res.writeHead(404).end('Not found');return}
  fs.readFile(file,(e,data)=>{if(e){res.writeHead(500).end();return}
   res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; connect-src 'self' ws: wss:; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});
   res.end(req.method==='HEAD'?undefined:data)
  })
 })
});
const wss=new WebSocketServer({noServer:true,maxPayload:1024,perMessageDeflate:false});
const players=new Map(),ipConnections=new Map();let nextId=1;
const MAX_PLAYERS=70,MAX_PER_IP=5;
function send(ws,obj){if(ws.readyState===WebSocket.OPEN&&ws.bufferedAmount<100000)ws.send(JSON.stringify(obj))}
function broadcast(obj){for(const ws of wss.clients)send(ws,obj)}
server.on('upgrade',(req,socket,head)=>{
 const origin=req.headers.origin;
 // Only browsers on the same host can open websocket connections.
 if(!origin){socket.destroy();return}
 try{if(new URL(origin).host!==req.headers.host){socket.destroy();return}}catch{socket.destroy();return}
 const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').toString().split(',')[0].trim();
 if(wss.clients.size>=MAX_PLAYERS||(ipConnections.get(ip)||0)>=MAX_PER_IP){socket.destroy();return}
 wss.handleUpgrade(req,socket,head,ws=>{ws.clientIp=ip;ipConnections.set(ip,(ipConnections.get(ip)||0)+1);wss.emit('connection',ws,req)})
});
function validPosition(m){return Number.isFinite(m.x)&&Number.isFinite(m.z)&&Math.abs(m.x)<=75&&m.z>=-75&&m.z<=80}
wss.on('connection',ws=>{
 const id=String(nextId++),joinedAt=Date.now();let joined=false,lastMove=Date.now(),lastX=0,lastZ=14;
 let windowStart=Date.now(),count=0,lastChat=0,lastEmote=0;
 ws.isAlive=true;ws.on('pong',()=>ws.isAlive=true);
 send(ws,{type:'hello',id,players:[...players.values()]});
 ws.on('message',raw=>{
  const now=Date.now();
  if(now-windowStart>=1000){windowStart=now;count=0}
  if(++count>25){ws.close(1008,'Too many messages');return}
  let m;try{m=JSON.parse(raw.toString())}catch{return}
  if(!m||typeof m!=='object'||typeof m.type!=='string')return;
  if(m.type==='join'&&!joined){
   const name=String(m.name||'Học sinh').trim().slice(0,20).replace(/[<>&"']/g,'');
   const grade=[10,11,12].includes(Number(m.grade))?Number(m.grade):10;
   const player={id,name,grade,x:0,z:14,rotation:0};players.set(id,player);joined=true;
   broadcast({type:'joined',player});return
  }
  if(!joined)return;
  const player=players.get(id);
  if(m.type==='move'&&validPosition(m)){
   const dt=Math.max(.05,Math.min((now-lastMove)/1000,2));
   // allow brief movement bursts; reject impossible teleports.
   if(Math.hypot(m.x-lastX,m.z-lastZ)>Math.max(4,18*dt))return;
   lastMove=now;lastX=m.x;lastZ=m.z;player.x=m.x;player.z=m.z;
   player.rotation=Number.isFinite(m.rotation)?Math.max(-100,Math.min(100,m.rotation)):0;
   broadcast({type:'moved',id,x:player.x,z:player.z,rotation:player.rotation})
  }
  if(m.type==='emote'){
   const allowed=['wave','laugh','block','dance','highfive'];
   if(typeof m.emote!=='string'||!allowed.includes(m.emote)||now-lastEmote<900)return;
   lastEmote=now;broadcast({type:'emote',id,emote:m.emote});return;
  }
  if(m.type==='chat'){
   if(now-lastChat<800)return;lastChat=now;
   const message=String(m.text||'').trim().slice(0,100).replace(/[<>&"']/g,'');
   if(message)broadcast({type:'chat',id,name:player.name,text:message})
  }
 });
 ws.on('close',()=>{
  ipConnections.set(ws.clientIp,Math.max(0,(ipConnections.get(ws.clientIp)||1)-1));
  if(joined){players.delete(id);broadcast({type:'left',id})}
 })
});
const heartbeat=setInterval(()=>{for(const ws of wss.clients){if(!ws.isAlive){ws.terminate();continue}ws.isAlive=false;ws.ping()}},30000);
server.on('close',()=>clearInterval(heartbeat));
const port=Number(process.env.PORT)||3000;
server.listen(port,()=>console.log('AnhXtanh V13 server listening on '+port));
