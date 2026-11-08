import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9bd6ff);scene.fog=new THREE.Fog(0x9bd6ff,85,180);
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,300);const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;document.querySelector('#game').append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x7e9b73,2));const sun=new THREE.DirectionalLight(0xffffff,2);sun.position.set(30,55,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-80;sun.shadow.camera.right=80;sun.shadow.camera.top=80;sun.shadow.camera.bottom=-80;scene.add(sun);
const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.82});const grass=mat(0x83c77b),path=mat(0xdac4aa),wall=mat(0xffe7b8),roof=mat(0xb66d89),glass=mat(0x8dc4db),brown=mat(0x9a6d49);
function box(w,h,d,x,y,z,m,cast=true){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=true;scene.add(o);return o}
box(200,.2,200,0,-.15,0,grass,false);box(12,.08,95,0,.02,0,path,false);box(100,.08,9,0,.03,16,path,false);
function label(text,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=100;const ctx=c.getContext('2d');ctx.fillStyle='#ffffffeb';ctx.fillRect(0,0,512,100);ctx.fillStyle='#53318c';ctx.font='bold 40px Arial';ctx.textAlign='center';ctx.fillText(text,256,63);const tex=new THREE.CanvasTexture(c);const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false}));spr.position.set(x,y,z);spr.scale.set(9,1.75,1);scene.add(spr)}
function building(name,x,z,rooms){box(30,8,13,x,4,z,wall);box(32,.9,15,x,8.5,z,roof);box(30,1,2,x,1,z+7,mat(0xd9ae80));for(let i=0;i<6;i++){const xx=x-12+i*4.8;box(2.7,2.6,.12,xx,5.3,z+6.57,glass);box(2.7,2.6,.12,xx,1.9,z+6.57,glass)}label(name,x,10.4,z+7.5);rooms.forEach((r,i)=>label(r,x-10+i*10,3.6,z+7.2))}
// Khuôn viên mô phỏng dựa trên ảnh mặt tiền THPT AnhXtanh.
function facade(name,x,z,roomNames){
  const cream=mat(0xffdf8a),trim=mat(0xfff0b8),dark=mat(0x553b2d),rail=mat(0xfff7e4),red=mat(0xb3264c);
  box(34,11,10,x,5.5,z,cream);box(35,.55,11,x,11.1,z,trim);
  for(let level=0;level<3;level++){
    const base=level*3.55;
    for(let i=0;i<7;i++){
      const xx=x-14.5+i*4.8;
      // Cửa gỗ nâu, lan can và vòm sáng trên hành lang.
      box(2.5,2.25,.13,xx,base+1.65,z+5.09,dark);
      box(1.9,1.65,.15,xx,base+1.75,z+5.18,glass);
      box(3.5,.18,.25,xx,base+.95,z+5.35,rail);
      const arch=new THREE.Mesh(new THREE.TorusGeometry(1.63,.18,7,24,Math.PI),trim);
      arch.position.set(xx,base+3.12,z+5.25);scene.add(arch);
      box(.27,2.8,.3,xx-1.72,base+1.55,z+5.32,trim);
      box(.27,2.8,.3,xx+1.72,base+1.55,z+5.32,trim);
    }
    box(34,.25,1.3,x,base+.7,z+5.65,trim);
  }
  box(35,.35,1.5,x,11.15,z+5.7,trim);
  label(name,x,13.1,z+6.1);
  roomNames.forEach((r,i)=>label(r,x-10+i*10,2.8,z+6.25));
  // Biển trường đỏ và cụm cột trắng trung tâm.
  if(name.includes('ANHXTANH')){
    box(15,1.1,.2,x,8.25,z+6.05,red);
    label('THPT ANHXTANH · HẢI PHÒNG',x,8.45,z+6.5);
    for(let i=-2;i<=2;i++)box(.4,6,.4,x+i*1.5,3.5,z+6.15,rail);
  }
}
facade('THPT ANHXTANH · DÃY CHÍNH',0,-27,['KHỐI 10','KHỐI 11','KHỐI 12']);
facade('DÃY LỚP KHỐI 10',-38,-44,['10A1','10A2','10A3']);
facade('DÃY LỚP KHỐI 11 & 12',38,-44,['11A1','11A2','12A1']);
building('CĂN TIN',-33,40,['Bánh mì','Kem ống','Ô mai']);
building('THƯ VIỆN',32,40,['Sách','Đọc','Học']);
// Sân khấu, màn hình LED và cây bóng mát theo ảnh tham chiếu.
box(19,.7,8,0,.35,-9,mat(0xb95942));
box(17,5,.4,0,3.2,-12.7,mat(0x67469c));
label('SÂN KHẤU · SỰ KIỆN',0,6.7,-12.2);
// Nội thất nằm ở khu vực riêng, không còn lộ bàn ghế ra sân trường.
const interiors={}; const roomLabels=[];
function room(name,cx,cz,kind){
  const floor=mat(0xe6c9a4),wallmat=mat(0xfff0d1),wood=mat(0x956541);
  box(20,.2,16,cx,-.05,cz,floor);box(20,5,.25,cx,2.5,cz-8,wallmat);
  box(.25,5,16,cx-10,2.5,cz,wallmat);box(.25,5,16,cx+10,2.5,cz,wallmat);
  label(name,cx,5.8,cz-7.4);
  if(kind==='class'){
    box(7,2.3,.2,cx,2.8,cz-7.8,mat(0x24634d));box(3,1,1.4,cx,.6,cz-5,wood);
    for(let r=0;r<3;r++)for(let c=0;c<4;c++){const x=cx-7.4+c*4.7,z=cz-2+r*3.8;box(2.3,.16,1.1,x,.95,z,wood);box(2.1,.15,.65,x,.62,z+1,wood)}
    const teacher=avatar(0x39848e);teacher.position.set(cx,0,cz-6);scene.add(teacher);
  } else if(kind==='canteen'){
    box(7,1.2,2,cx, .6,cz-5,mat(0xe0a57a));label('QUẦY BÁN ĐỒ ĂN',cx,3,cz-5);
    for(let i=0;i<4;i++){const x=cx-6+(i%2)*12,z=cz+(i>1?4:0);box(3,.75,2,x,.7,z,wood)}
    const vendor=avatar(0xc87b6d);vendor.position.set(cx,0,cz-6);scene.add(vendor);
  }else{
    for(let i=0;i<5;i++){const x=cx-7+i*3.5;box(1.7,3,.8,x,1.5,cz-5,wood);for(let j=0;j<4;j++)box(1.5,.28,.85,x,.8+j*.65,cz-4.5,mat([0x4c8dbb,0xbd647b,0x75a66e][(i+j)%3]))}
    for(let i=0;i<3;i++)box(3,.8,1.4,cx-5+i*5,.6,cz+3,wood);
  }
  interiors[name]={x:cx,z:cz,kind};
}
room('LỚP 10A1',94,-26,'class');room('LỚP 11A1',120,-26,'class');room('LỚP 12A1',146,-26,'class');
room('CĂN TIN TUỔI THƠ',94,12,'canteen');room('THƯ VIỆN ANHXTANH',120,12,'library');
// Cầu thang mô phỏng: từng bậc và chiếu nghỉ, dùng E ở chân cầu thang.
function stairs(x,z){const stone=mat(0xd4bb95);for(let i=0;i<12;i++)box(3,.18+i*.22,1,x,.09+i*.11,z+i*.85,stone);box(5,.3,3,x,2.75,z+11,stone);label('CẦU THANG · E LÊN TẦNG',x,5,z+8)}
stairs(-18,-18);stairs(18,-18);
function tree(x,z){box(.6,3,.6,x,1.5,z,brown);const top=new THREE.Mesh(new THREE.SphereGeometry(2.3,10,8),mat(0x3e9864));top.position.set(x,4,z);top.castShadow=true;scene.add(top)}for(let i=-6;i<=6;i++){tree(-52,i*10);tree(52,i*10)}for(let x=-42;x<=42;x+=12)tree(x,62);
box(18,.4,2,0,2,74,mat(0x7b529e));label('CỔNG TRƯỜNG ANHXTANH',0,5,74);
function avatar(color){
 const g=new THREE.Group(),shirt=mat(color),skin=mat(0xffd0a6),pants=mat(0x344c70);
 const torso=new THREE.Mesh(new THREE.BoxGeometry(1.05,1.3,.58),shirt);torso.position.y=1.55;g.add(torso);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.42,12,10),skin);head.position.y=2.6;g.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.43,12,8,0,Math.PI*2,0,Math.PI*.45),mat(0x392e36));hair.position.y=2.7;g.add(hair);
 const limbs=[];
 for(const [x,y,length,material] of [[-.7,1.55,1.1,shirt],[.7,1.55,1.1,shirt],[-.3,.56,1.05,pants],[.3,.56,1.05,pants]]){
  const pivot=new THREE.Group();pivot.position.set(x,y+length*.42,0);const part=new THREE.Mesh(new THREE.BoxGeometry(.28,length,.3),material);part.position.y=-length*.42;pivot.add(part);g.add(pivot);limbs.push(pivot)
 }g.userData.limbs=limbs;return g;
}
const player=avatar(0x6d49bc);scene.add(player);player.position.set(0,0,14);const others=new Map();const npcs=[];for(let i=0;i<30;i++){const a=avatar([0x498cc2,0xe982a2,0x70aa75][i%3]);scene.add(a);npcs.push({mesh:a,x:(i%10-5)*8,z:((i/10)|0)*12+2,seed:i*.93})}
let inside=false,activeRoom='',floorLevel=0,returnPoint=new THREE.Vector3(0,0,14);let socket,id,coins=100,activeEvent='',joined=false,angle=0,simMinute=7*60+10;const keys={};const $=s=>document.querySelector(s);let toastTimer;function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',2600)}function msg(t){const el=document.createElement('div');el.textContent=t;$('#messages').append(el);$('#messages').scrollTop=9999;while($('#messages').children.length>30)$('#messages').firstChild.remove()}
function connect(name,grade){const protocol=location.protocol==='https:'?'wss':'ws';socket=new WebSocket(`${protocol}://${location.host}`);socket.onopen=()=>{socket.send(JSON.stringify({type:'join',name,grade}));$('#status').textContent='🟢 Đã kết nối máy chủ'};socket.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}if(m.type==='hello'){id=m.id;m.players.forEach(addRemote)}if(m.type==='joined'){if(m.player.id!==id)addRemote(m.player);else msg('Bạn đã vào trường!')}if(m.type==='moved'){const r=others.get(m.id);if(r){r.target.set(m.x,0,m.z);r.mesh.rotation.y=m.rotation}}if(m.type==='left'){const r=others.get(m.id);if(r){scene.remove(r.mesh);others.delete(m.id)}}if(m.type==='chat')msg(`${m.name}: ${m.text}`)};socket.onclose=()=>{$('#status').textContent='🔴 Mất kết nối · chơi ngoại tuyến';toast('Mất kết nối máy chủ')};socket.onerror=()=>toast('Không kết nối được máy chủ')}
function addRemote(p){if(others.has(p.id))return;const mesh=avatar(p.grade===10?0x5d83d0:p.grade===11?0x50a078:0xe19a54);mesh.position.set(p.x,0,p.z);scene.add(mesh);others.set(p.id,{mesh,target:new THREE.Vector3(p.x,0,p.z)})}
$('#start').onclick=()=>{const name=$('#name').value.trim()||'Hoc sinh';const grade=Number($('#grade').value);selectedGrade=grade;$('#join').style.display='none';joined=true;connect(name,grade);toast(`Chào mừng ${name} đến AnhXtanh!`)};
const menu=[['🥖 Bánh mì que',12],['🍬 Kẹo kéo',6],['🍟 Bim bim',8],['🥛 Sữa chua túi',10],['🍦 Kem ống',9],['🥗 Bánh tráng trộn',18],['🌭 Xúc xích',14],['🍮 Thạch rau câu',7],['🍋 Trà chanh',12],['🍑 Ô mai',8]];
$('#canteen').onclick=()=>{const d=$('#detail');d.replaceChildren();d.append(document.createTextNode('Căn tin tuổi thơ (xu mô phỏng): '));for(const [name,price]of menu){const b=document.createElement('button');b.textContent=`${name} · ${price} xu`;b.onclick=()=>{if(activeRoom!=='CĂN TIN TUỔI THƠ' && player.position.distanceTo(new THREE.Vector3(-33,0,40))>23)return toast('Hãy đến gần căn tin để mua!');if(coins<price)return toast('Không đủ xu!');coins-=price;$('#coins').textContent=`🪙 ${coins} xu`;toast('Đã mua '+name)};d.append(b)}};
const events=[['🌕 Trung Thu','Rước đèn và check-in sân trường',30],['💐 Ngày Nhà giáo 20/11','Gửi lời tri ân thầy cô',25],['🧧 Tết Nguyên Đán','Nhận lì xì đầu xuân',40],['🎒 Ngày hội tựu trường','Khám phá các dãy lớp',20]];const claimed=new Set();$('#events').onclick=()=>{const d=$('#detail');d.replaceChildren();for(const [name,description,reward]of events){const b=document.createElement('button');b.textContent=`${name} (+${reward} xu)`;b.title=description;b.onclick=()=>{activeEvent=name;$('#eventStatus').textContent=`🎊 ${name}`;if(claimed.has(name))return toast('Bạn đã nhận quà sự kiện này!');claimed.add(name);coins+=reward;$('#coins').textContent=`🪙 ${coins} xu`;toast(`Hoàn thành sự kiện! +${reward} xu`)};d.append(b)}};
const subjectPlan={10:['Toán','Ngữ văn','Tiếng Anh','Vật lí','Lịch sử','Tin học','Giáo dục thể chất'],11:['Ngữ văn','Toán','Hóa học','Tiếng Anh','Địa lí','Vật lí','Tin học'],12:['Toán','Tiếng Anh','Ngữ văn','Lịch sử','Vật lí','Hóa học','Giáo dục kinh tế và pháp luật']};
let selectedGrade=10;
function subjectFor(period){const m=/Tiết (\d+)/.exec(period);return m?(subjectPlan[selectedGrade][Number(m[1])-1]||'Tự học'):'Sinh hoạt / nghỉ';}
let lastPeriod='';const periods=[[435,480,'Tiết 1'],[485,530,'Tiết 2'],[530,550,'Ra chơi'],[550,595,'Tiết 3'],[600,645,'Tiết 4'],[650,695,'Tiết 5'],[780,825,'Tiết 6'],[830,875,'Tiết 7']];$('#schedule').onclick=()=>{const times=['7:15–8:00','8:05–8:50','9:10–9:55','10:00–10:45','10:50–11:35','13:00–13:45','13:50–14:35'];$('#detail').replaceChildren();times.forEach((t,i)=>{const line=document.createElement('div');line.textContent=`Tiết ${i+1} · ${t} · ${subjectPlan[selectedGrade][i]}`;$('#detail').append(line)});const note=document.createElement('small');note.textContent='Thời khóa biểu mẫu theo khối, chưa phải lịch chính thức của trường.';$('#detail').append(note)};
$('#chatForm').onsubmit=e=>{e.preventDefault();const input=$('#chatInput');const text=input.value.trim();if(text&&socket?.readyState===WebSocket.OPEN)socket.send(JSON.stringify({type:'chat',text}));else if(text)toast('Chat cần kết nối máy chủ');input.value=''};
const destinations=[
 {name:'LỚP 10A1',x:-38,z:-37},{name:'LỚP 11A1',x:38,z:-37},{name:'LỚP 12A1',x:0,z:-20},
 {name:'CĂN TIN TUỔI THƠ',x:-33,z:40},{name:'THƯ VIỆN ANHXTANH',x:32,z:40}
];
function interact(){
 if(inside){inside=false;activeRoom='';player.position.copy(returnPoint);$('#location').textContent='📍 Sân trường';toast('Đã trở lại sân trường');return}
 for(const stair of [-18,18]){if(Math.hypot(player.position.x-stair,player.position.z+18)<9){floorLevel=(floorLevel+1)%3;player.position.y=floorLevel*3.5;$('#location').textContent='📍 Tầng '+(floorLevel+1);toast('Bạn đang ở tầng '+(floorLevel+1)+' · Nhấn E để chuyển tầng');return}}
 const dest=destinations.find(d=>Math.hypot(player.position.x-d.x,player.position.z-d.z)<17);
 if(!dest){toast('Đến gần cửa lớp, căn tin, thư viện hoặc cầu thang rồi nhấn E');return}
 returnPoint.copy(player.position);inside=true;activeRoom=dest.name;floorLevel=0;const room=interiors[dest.name];player.position.set(room.x,0,room.z+5);$('#location').textContent='📍 '+dest.name;toast('Đã vào '+dest.name+' · Nhấn E để ra');
}
window.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName))return;keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e'&&!e.repeat)interact()});
$('#interact').onclick=interact;
window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();keys[b.dataset.key]=true});for(const event of ['pointerup','pointercancel','pointerleave'])b.addEventListener(event,()=>keys[b.dataset.key]=false)});let dragging=false,lastX=0;renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX});window.addEventListener('pointerup',()=>dragging=false);window.addEventListener('pointermove',e=>{if(dragging){angle-=(e.clientX-lastX)*.005;lastX=e.clientX}});
let last=performance.now(),sendAccumulator=0;function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;simMinute=(simMinute+dt*2)%1440;const mins=Math.floor(simMinute);$('#clock').textContent=`🕒 Giờ game: ${String(Math.floor(mins/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}`;const period=periods.find(p=>mins>=p[0]&&mins<p[1])?.[2]||'Giờ tự do';$('#period').textContent='🔔 '+period+' · '+(subjectFor(period));if(period!==lastPeriod){if(lastPeriod&&period.startsWith('Tiết'))toast('🔔 Vào '+period+'!');lastPeriod=period;}if(joined){let dx=Number(!!(keys.d||keys.arrowright))-Number(!!(keys.a||keys.arrowleft)),dz=Number(!!(keys.s||keys.arrowdown))-Number(!!(keys.w||keys.arrowup));if(dx||dz){const len=Math.hypot(dx,dz),speed=keys.shift?11:6;dx/=len;dz/=len;const mx=(dx*Math.cos(angle)+dz*Math.sin(angle))*speed*dt,mz=(dz*Math.cos(angle)-dx*Math.sin(angle))*speed*dt;player.position.x=THREE.MathUtils.clamp(player.position.x+mx,inside?interiors[activeRoom].x-8:-70,inside?interiors[activeRoom].x+8:70);player.position.z=THREE.MathUtils.clamp(player.position.z+mz,inside?interiors[activeRoom].z-6:-70,inside?interiors[activeRoom].z+6:78);player.rotation.y=Math.atan2(mx,mz);const limbs=player.userData.limbs;if(limbs){const a=Math.sin(now*.012)*.55;limbs[0].rotation.x=a;limbs[1].rotation.x=-a;limbs[2].rotation.x=-a;limbs[3].rotation.x=a}}sendAccumulator+=dt;if(sendAccumulator>.1){sendAccumulator=0;if(socket?.readyState===WebSocket.OPEN)socket.send(JSON.stringify({type:'move',x:player.position.x,z:player.position.z,rotation:player.rotation.y}))}}for(const n of npcs){const t=now*.00028+n.seed;n.mesh.position.set(n.x+Math.sin(t)*2,0,n.z+Math.cos(t)*2);n.mesh.rotation.y=-t}for(const r of others.values())r.mesh.position.lerp(r.target,Math.min(1,dt*8));const offset=new THREE.Vector3(Math.sin(angle)*(inside?8:14),inside?6:10,Math.cos(angle)*(inside?8:14));camera.position.lerp(player.position.clone().add(offset),Math.min(1,dt*5));camera.lookAt(player.position.x,2,player.position.z);renderer.render(scene,camera)}requestAnimationFrame(animate);addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
