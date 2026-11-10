import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9bd6ff);scene.fog=new THREE.Fog(0x9bd6ff,85,180);
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,300);const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;document.querySelector('#game').append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x7e9b73,2));const sun=new THREE.DirectionalLight(0xffffff,2);sun.position.set(30,55,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-80;sun.shadow.camera.right=80;sun.shadow.camera.top=80;sun.shadow.camera.bottom=-80;scene.add(sun);
const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.82});const grass=mat(0x83c77b),path=mat(0xdac4aa),wall=mat(0xffe7b8),roof=mat(0xb66d89),glass=mat(0x8dc4db),brown=mat(0x9a6d49);
function box(w,h,d,x,y,z,m,cast=true){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=true;scene.add(o);return o}
box(200,.2,200,0,-.15,0,grass,false);box(12,.08,95,0,.02,0,path,false);box(100,.08,9,0,.03,16,path,false);
function label(text,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=100;const ctx=c.getContext('2d');ctx.fillStyle='#ffffffeb';ctx.fillRect(0,0,512,100);ctx.fillStyle='#53318c';ctx.font='bold 40px Arial';ctx.textAlign='center';ctx.fillText(text,256,63);const tex=new THREE.CanvasTexture(c);const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false}));spr.position.set(x,y,z);spr.scale.set(9,1.75,1);scene.add(spr);return spr}
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
    if(level>0){box(34,.15,.16,x,base+1.7,z+6.2,rail);for(let k=0;k<=22;k++)box(.12,1,.13,x-16.5+k*1.5,base+1.2,z+6.2,rail);}

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
facade('DÃY LỚP KHỐI 10 · BÊN TRÁI',-43,-25,['10A1','10A2','10A3']);
facade('DÃY LỚP KHỐI 11 & 12 · BÊN PHẢI',43,-25,['11A1','11A2','12A1']);
building('CĂN TIN',-33,40,['Bánh mì','Kem ống','Ô mai']);
building('THƯ VIỆN',32,40,['Sách','Đọc','Học']);
// V12: bãi đỗ xe phía trái, gần dãy lớp; lối đi đến thư viện phía phải.
const steel=mat(0x64748b),shade=mat(0x9fb6c5),whiteLine=mat(0xfaf7e7);
box(24,.08,23,-49,.04,16,mat(0xb9b8b2),false);
box(25,.35,24,-49,4.4,16,shade);
for(const px of [-60,-38])for(const pz of [5,27])box(.35,4.2,.35,px,2.2,pz,steel);
for(let i=0;i<5;i++){const x=-59+i*4.6;box(.15,.04,16,x,.12,16,whiteLine,false);}
label('KHU ĐỂ XE · DÃY TRÁI',-49,6.4,28);
box(8,.08,29,34,.05,21,path,false);
// V13: tường kín cao 12m, không còn khe hở nhìn xuyên qua tường.
const fence=mat(0xe9d6b5),gateMetal=mat(0x354d68),gateAccent=mat(0xf7d786);
for(const x of [-76,76]){box(.9,12,156,x,6,0,fence);box(1.3,.45,156,x,12.2,0,gateAccent);}
box(153,12,.9,0,6,-77,fence);box(153,.45,1.3,0,12.2,-77,gateAccent);
// Cổng chính hình chữ U ngược: hai trụ đứng + thanh ngang trên cao.
for(const x of [-44,44])box(64,12,.9,x,6,79,fence);
for(const x of [-12,12]){box(2.0,13.5,2.0,x,6.75,79,gateMetal);box(2.4,.55,2.3,x,13.7,79,gateAccent);}
box(26,2.1,2.2,0,13.1,79,gateMetal);label('CỔNG TRƯỜNG ANHXTANH',0,13.2,80.4);label('✨ LỚP 10C10 ✨',0,15.5,80.5);
// Hai cánh cổng mở sang hai bên, có nan kim loại rõ nét.
const gateLeafLeft=new THREE.Group(),gateLeafRight=new THREE.Group();
for(const [group,sign] of [[gateLeafLeft,-1],[gateLeafRight,1]]){
 const leaf=new THREE.Mesh(new THREE.BoxGeometry(11.4,6,.23),new THREE.MeshStandardMaterial({color:0x3d536c,transparent:true,opacity:.12,depthWrite:false}));leaf.position.set(-sign*5.7,3,0);group.add(leaf);
 for(let k=0;k<10;k++){
  const bar=new THREE.Mesh(new THREE.BoxGeometry(.17,5.7,.24),gateMetal);bar.position.set(-sign*(.5+k*1.13),3,0);group.add(bar);
 }
 for(const h of [1.1,5.3]){const bar=new THREE.Mesh(new THREE.BoxGeometry(11.5,.25,.3),gateMetal);bar.position.set(-sign*5.7,h,0);group.add(bar);}
 group.position.set(sign*11.2,0,78.7);group.rotation.y=sign*.58;scene.add(group);
}
// Sân khấu, màn hình LED và cây bóng mát theo ảnh tham chiếu.
box(19,.7,8,0,.35,-9,mat(0xb95942));
// V15: ẩn khối nền tím phía sau ảnh sân khấu.
label('SÂN KHẤU · SỰ KIỆN 20/11',0,9.5,-12.2);
label('20/11 · TRI ÂN THẦY CÔ',0,8.6,-12.0);
// Ảnh tập thể thầy cô trên bảng lớn của sân khấu (giữ nguyên ảnh người dùng cung cấp).
// Texture nằm ở mặt hướng về sân trường (+z), tránh bị che bởi tấm nền LED.
const teacherPhotoTexture=new THREE.TextureLoader().load('/anh-thay-co.jpg');
teacherPhotoTexture.colorSpace=THREE.SRGBColorSpace;
const teacherPhoto=new THREE.Mesh(
  new THREE.PlaneGeometry(8,6),
  new THREE.MeshBasicMaterial({map:teacherPhotoTexture,side:THREE.DoubleSide})
);
teacherPhoto.position.set(0,3.5,-12.43);
scene.add(teacherPhoto);
// Viền ảnh và biển kỷ niệm.
const photoFrame=mat(0xffe6a0);
box(8.35,.18,.18,0,6.6,-12.42,photoFrame);
box(8.35,.18,.18,0,.4,-12.42,photoFrame);
for(const x of [-4.15,4.15])box(.18,6.3,.18,x,3.5,-12.42,photoFrame);
label('ẢNH TẬP THỂ THẦY CÔ',0,7.6,-12.2);
// Quầy hoa 20/11 xuất hiện theo giờ Việt Nam (chỉ trong ngày 20/11).
const flowerStall=new THREE.Group();scene.add(flowerStall);
function stallBox(w,h,d,x,y,z,color){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));mesh.position.set(x,y,z);flowerStall.add(mesh);return mesh;}
stallBox(7,1.3,2,0,.7,0,0xd79d70);stallBox(7.5,.35,3,0,3.7,0,0xe86c96);
for(const x of [-3.1,3.1])stallBox(.2,3,.2,x,2,0,0x7a5264);
for(let i=0;i<9;i++){
 const x=-2.8+(i%5)*1.35,z=i<5?-.45:.5;
 const stem=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.9,6),mat(0x3b9c65));stem.position.set(x,1.75,z);flowerStall.add(stem);
 const petals=new THREE.Mesh(new THREE.SphereGeometry(.31,9,7),mat([0xff6b9b,0xffd45e,0xf29aba][i%3]));petals.position.set(x,2.25,z);flowerStall.add(petals);
}
flowerStall.position.set(-21,0,5);
const flowerStallLabel=label('QUẦY HOA TRI ÂN · 20/11',-21,5.6,5);


// Bảng ghi công tại sân trường: công cụ hỗ trợ, không phải nhà tài trợ chính thức.
box(14,6,.35,24,3.3,-7,mat(0x3d315f));
box(14.5,.32,.6,24,6.45,-7,mat(0xe7c477));
box(14.5,.32,.6,24,.28,-7,mat(0xe7c477));
label('KIỆT & TRUNG ANH',24,5.45,-6.6);
label('DỰ ÁN ANHXTANH 20/11',24,4.35,-6.6);
label('CÔNG CỤ HỖ TRỢ DỰ ÁN',24,3.2,-6.6);
label('ChatGPT · GitHub · Render',24,2.05,-6.6);

// Nội thất nằm ở khu vực riêng, không còn lộ bàn ghế ra sân trường.
const interiors={}; const roomLabels=[];
const interiorObjects=[];let recordingInterior=false;let currentInteriorName='';const roomObjects={};
const originalAdd=scene.add.bind(scene);
scene.add=function(...objects){originalAdd(...objects);if(recordingInterior){interiorObjects.push(...objects);(roomObjects[currentInteriorName]??=[]).push(...objects)}};
function setInteriorVisible(name){for(const [room,objects] of Object.entries(roomObjects))for(const obj of objects)obj.visible=(room===name);}

function room(name,cx,cz,kind){currentInteriorName=name;
  const floor=mat(0xe6c9a4),wallmat=mat(0xfff0d1),wood=mat(0x956541);
  box(20,.2,16,cx,-.05,cz,floor);box(20,5,.25,cx,2.5,cz-8,wallmat);
  box(.25,5,16,cx-10,2.5,cz,wallmat);box(.25,5,16,cx+10,2.5,cz,wallmat);
  // Trần nhà phong cách campus Mỹ: bán trong suốt để camera góc nhìn thứ ba vẫn thấy bên trong.
  const ceiling=new THREE.Mesh(new THREE.BoxGeometry(19.7,.18,15.7),new THREE.MeshStandardMaterial({color:0xf4f0e9,roughness:.9,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}));
  ceiling.position.set(cx,5.08,cz);scene.add(ceiling);
  // Hệ dầm trần, đèn LED âm trần và viền tường.
  for(let k=-1;k<=1;k++){
    box(19.4,.12,.15,cx,4.88,cz+k*4.7,mat(0xd7dce3));
    for(let j=-1;j<=1;j++){
      box(1.8,.055,.8,cx+j*5.6,4.81,cz+k*4.7,mat(0xfff9d7),false);
    }
  }
  box(19.3,.13,.2,cx,4.75,cz-7.75,mat(0xb9c4d1));
  box(19.3,.13,.2,cx,4.75,cz+7.75,mat(0xb9c4d1));
  label(name,cx,5.8,cz-7.4);
  if(kind==='class'){
    // Góc Văn hay chữ đẹp: bảng trưng bày, bài viết và giấy khen ở góc lớp.
    box(5.6,2.6,.12,cx+6.6,2.55,cz-7.55,mat(0xe7b66e));
    box(5.2,2.25,.14,cx+6.6,2.55,cz-7.44,mat(0xf8ead0));
    label('VĂN HAY · CHỮ ĐẸP',cx+6.6,4.35,cz-7.25);
    for(let i=0;i<3;i++){
      const x=cx+4.9+i*1.7;
      box(1.35,1.55,.08,x,2.45,cz-7.3,mat(i===1?0xfff7d2:0xffffff));
      for(let line=0;line<4;line++)box(1.0,.025,.09,x,2.85-line*.27,cz-7.23,mat(0x8a96ac),false);
    }
    box(4.4,.6,.6,cx+6.6,.32,cz-6.7,mat(0x9a755c));
    // Tủ học cụ và chậu cây tạo cảm giác lớp học có người sử dụng.
    box(2.3,1.5,.65,cx-8.4,.75,cz-6.6,mat(0xc6a57c));
    box(.55,.45,.55,cx+8.6,.3,cz-6.5,mat(0xc98c70));
    const plant=new THREE.Mesh(new THREE.SphereGeometry(.45,8,6),mat(0x4b9c6d));plant.position.set(cx+8.6,.85,cz-6.5);scene.add(plant);

    box(7,2.3,.2,cx,2.8,cz-7.8,mat(0x24634d));box(3,1,1.4,cx,.6,cz-5,wood);
    for(let r=0;r<3;r++)for(let c=0;c<4;c++){const x=cx-7.4+c*4.7,z=cz-2+r*3.8;box(2.3,.16,1.1,x,.95,z,wood);box(2.1,.15,.65,x,.62,z+1,wood);box(.9,.13,.85,x,.43,z+1.55,mat(0x7185a7));box(.9,.8,.14,x,.75,z+1.95,mat(0x7185a7))}
    const teacher=avatar(0x39848e);teacher.position.set(cx,0,cz-6);scene.add(teacher);
  } else if(kind==='canteen'){
    box(16,.25,2,cx,3.7,cz-6.8,mat(0x563b6f));
    label('CAMPUS FOOD COURT',cx,4.7,cz-6.6);
    box(13,1.2,2,cx,.6,cz-5,mat(0xc19b78));
    for(let k=0;k<5;k++){box(1.8,.12,1.2,cx-5.2+k*2.6,1.4,cz-4.9,mat([0xf5d273,0xd6b59a,0x8cb98a][k%3]));}
    for(let k=0;k<3;k++)box(4,.15,.7,cx-5+k*5,2.5,cz-7.65,mat(0xffe9ba));
    
    for(let i=0;i<4;i++){const x=cx-6+(i%2)*12,z=cz+(i>1?4:0);box(3,.75,2,x,.7,z,wood)}
    const vendor=avatar(0xc87b6d);vendor.position.set(cx,0,cz-6);scene.add(vendor);
  }else{
    box(16,.25,2,cx,3.8,cz-7,mat(0x304d70));
    label('CAMPUS LEARNING COMMONS',cx,4.7,cz-6.8);
    for(let i=0;i<6;i++){const x=cx-8+i*3.1;box(1.8,3.2,.8,x,1.6,cz-5.8,wood);for(let j=0;j<4;j++)box(1.6,.3,.85,x,.8+j*.7,cz-5.35,mat([0x4c8dbb,0xbd647b,0x75a66e][(i+j)%3]))}
    for(let i=0;i<3;i++){box(3.2,.5,1.6,cx-5+i*5,.5,cz+5,mat(0x527da0));box(3.2,.6,.35,cx-5+i*5,.8,cz+5.7,mat(0x527da0));}
    
    for(let i=0;i<3;i++)box(3,.8,1.4,cx-5+i*5,.6,cz+3,wood);
  }
  interiors[name]={x:cx,z:cz,kind};
}
recordingInterior=true;
room('LỚP 10A1',94,-26,'class');room('LỚP 11A1',120,-26,'class');room('LỚP 12A1',146,-26,'class');
room('CĂN TIN TUỔI THƠ',94,12,'canteen');room('THƯ VIỆN ANHXTANH',120,12,'library');
recordingInterior=false;setInteriorVisible(null);
// Cầu thang mô phỏng: từng bậc và chiếu nghỉ, dùng E ở chân cầu thang.
function stairs(x,z){
 const stone=mat(0xd4bb95),metal=mat(0xdfe7ef);
 // Đặt cầu thang trong khối nhà, không lòi ra sân.
 for(let i=0;i<12;i++){box(3,.18+i*.22,.78,x,.09+i*.11,z-4+i*.7,stone);}
 box(4,.22,2,x,2.75,z+4.9,stone);
 for(const side of [-1,1]){
  for(let i=0;i<7;i++){const zz=z-4+i*1.35;box(.09,1.1,.09,x+side*1.55,.7+i*.19,zz,metal);}
  const rail=box(.13,.13,10,x+side*1.55,2.12,z+.3,metal);rail.rotation.x=-.2;
 }
}
stairs(-13,-30);stairs(13,-30);

function tree(x,z){box(.6,3,.6,x,1.5,z,brown);const top=new THREE.Mesh(new THREE.SphereGeometry(2.3,10,8),mat(0x3e9864));top.position.set(x,4,z);top.castShadow=true;scene.add(top)}for(let i=-6;i<=6;i++){tree(-52,i*10);tree(52,i*10)}for(let x=-42;x<=42;x+=12)tree(x,62);
box(18,.4,2,0,2,74,mat(0x7b529e));label('CỔNG TRƯỜNG ANHXTANH',0,5,74);
box(15,4,.45,23,2.2,68,mat(0x3b4c77));
label('DỰ ÁN: KIỆT & TRUNG ANH',23,3.1,68.6);
label('ANHXTANH SCHOOL LIFE · 20/11',23,1.9,68.6);

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
// Các nhóm bạn vui chơi ở sân trường: chạy đuổi nhau và vẫy tay.
const playGroups=[];
for(let i=0;i<12;i++){const mesh=avatar([0x6d8ec7,0xf18b9c,0x6cb89e][i%3]);scene.add(mesh);playGroups.push({mesh,cx:(i%4-1.5)*9,cz:14+Math.floor(i/4)*9,phase:i*1.9});}

// Emote hoạt ảnh gốc: mọi người chơi đều nhìn thấy khi kết nối máy chủ.
const emoteNames={wave:'👋 Vẫy tay',laugh:'😂 Cười vui',block:'🛡️ Chặn BM (trêu đùa)',dance:'🕺 Nhảy vui',highfive:'🙌 High-five'};
const emoteDuration={wave:2600,laugh:3200,block:2600,dance:4500,highfive:2200};
const activeEmotes=new Map();
function startEmote(mesh,key){if(!emoteNames[key])return;activeEmotes.set(mesh,{key,start:performance.now(),until:performance.now()+emoteDuration[key]});}
function animateEmote(mesh,now){
 const parts=mesh.userData.limbs;if(!parts)return;
 const e=activeEmotes.get(mesh);
 if(!e||now>=e.until){if(e)activeEmotes.delete(mesh);return;}
 const t=(now-e.start)/1000,l=parts;
 // Phục hồi trạng thái trung tính mỗi khung hình để tránh kẹt tay chân.
 for(const part of l){part.rotation.x=0;part.rotation.y=0;part.rotation.z=0;}
 if(e.key==='wave'){l[1].rotation.z=-2.35;l[1].rotation.x=Math.sin(t*12)*.42;}
 else if(e.key==='laugh'){l[0].rotation.x=-.6;l[1].rotation.x=-.6;l[0].rotation.z=.35;l[1].rotation.z=-.35;mesh.rotation.z=Math.sin(t*13)*.055;}
 else if(e.key==='block'){l[0].rotation.x=-1.5;l[1].rotation.x=-1.5;l[0].rotation.z=-.25;l[1].rotation.z=.25;}
 else if(e.key==='dance'){l[0].rotation.z=.7+Math.sin(t*8)*.6;l[1].rotation.z=-.7-Math.sin(t*8)*.6;l[2].rotation.x=Math.sin(t*9)*.55;l[3].rotation.x=-Math.sin(t*9)*.55;mesh.rotation.z=Math.sin(t*8)*.08;}
 else if(e.key==='highfive'){l[1].rotation.z=-2.65;l[0].rotation.z=.2;}
}
function selectEmote(key){if(!joined)return toast('Vào trường trước nhé!');startEmote(player,key);if(socket?.readyState===WebSocket.OPEN)socket.send(JSON.stringify({type:'emote',emote:key}));toast(emoteNames[key]);}
document.querySelectorAll('[data-emote]').forEach(b=>b.addEventListener('click',()=>selectEmote(b.dataset.emote)));
let inside=false,activeRoom='',floorLevel=0,returnPoint=new THREE.Vector3(0,0,14);let socket,id,coins=100,activeEvent='',joined=false,angle=0,pitch=.34,simMinute=7*60+10;const keys={};const $=s=>document.querySelector(s);let toastTimer;function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',2600)}function msg(t){const el=document.createElement('div');el.textContent=t;$('#messages').append(el);$('#messages').scrollTop=9999;while($('#messages').children.length>30)$('#messages').firstChild.remove()}
function connect(name,grade){const protocol=location.protocol==='https:'?'wss':'ws';socket=new WebSocket(`${protocol}://${location.host}`);socket.onopen=()=>{socket.send(JSON.stringify({type:'join',name,grade}));$('#status').textContent='🟢 Đã kết nối máy chủ'};socket.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}if(m.type==='hello'){id=m.id;m.players.forEach(addRemote)}if(m.type==='joined'){if(m.player.id!==id)addRemote(m.player);else msg('Bạn đã vào trường!')}if(m.type==='moved'){const r=others.get(m.id);if(r){r.target.set(m.x,0,m.z);r.mesh.rotation.y=m.rotation}}if(m.type==='left'){const r=others.get(m.id);if(r){scene.remove(r.mesh);others.delete(m.id)}}if(m.type==='emote'){const mesh=m.id===id?player:others.get(m.id)?.mesh;if(mesh)startEmote(mesh,m.emote)}if(m.type==='chat')msg(`${m.name}: ${m.text}`)};socket.onclose=()=>{$('#status').textContent='🔴 Mất kết nối · chơi ngoại tuyến';toast('Mất kết nối máy chủ')};socket.onerror=()=>toast('Không kết nối được máy chủ')}
function addRemote(p){if(others.has(p.id))return;const mesh=avatar(p.grade===10?0x5d83d0:p.grade===11?0x50a078:0xe19a54);mesh.position.set(p.x,0,p.z);scene.add(mesh);others.set(p.id,{mesh,target:new THREE.Vector3(p.x,0,p.z)})}
$('#start').onclick=()=>{const name=$('#name').value.trim()||'Hoc sinh';const grade=Number($('#grade').value);selectedGrade=grade;$('#join').style.display='none';joined=true;connect(name,grade);toast(`Chào mừng ${name} đến AnhXtanh!`)};
const menu=[['🥖 Bánh mì que',12],['🍬 Kẹo kéo',6],['🍟 Bim bim',8],['🥛 Sữa chua túi',10],['🍦 Kem ống',9],['🥗 Bánh tráng trộn',18],['🌭 Xúc xích',14],['🍮 Thạch rau câu',7],['🍋 Trà chanh',12],['🍑 Ô mai',8]];
$('#canteen').onclick=()=>{const d=$('#detail');d.replaceChildren();d.append(document.createTextNode('Căn tin tuổi thơ (xu mô phỏng): '));for(const [name,price]of menu){const b=document.createElement('button');b.textContent=`${name} · ${price} xu`;b.onclick=()=>{if(activeRoom!=='CĂN TIN TUỔI THƠ' && player.position.distanceTo(new THREE.Vector3(-33,0,40))>23)return toast('Hãy đến gần căn tin để mua!');if(coins<price)return toast('Không đủ xu!');coins-=price;$('#coins').textContent=`🪙 ${coins} xu`;toast('Đã mua '+name)};d.append(b)}};
// Quầy hoa 20/11: hàng giới hạn theo ngày Việt Nam; vật phẩm đã mua được giữ trong trình duyệt.
const FLOWER_KEY='anhxtanh-flower-v13';
function vietnamDateParts(){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());return Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));}
function isFlowerDay(){const d=vietnamDateParts();return d.day==='20'&&d.month==='11';}
function flowerInventory(){try{return JSON.parse(localStorage.getItem(FLOWER_KEY)||'{}')}catch{return {}}}
function showFlowerInventory(){const inv=flowerInventory();const n=Object.values(inv).reduce((a,b)=>a+Number(b||0),0);$('#flowerInventory').textContent=`💐 Hoa tri ân: ${n} bó${n?' · LIMITED':''}`;}
function buyFlower(){if(!joined)return toast('Vào trường trước nhé!');if(!isFlowerDay())return toast('Quầy chỉ bán ngày 20/11 (giờ Việt Nam)!');if(inside||player.position.distanceTo(new THREE.Vector3(-21,0,5))>15)return toast('Đến gần quầy hoa trên sân trường nhé!');if(coins<20)return toast('Cần 20 xu để mua một bó hoa!');const d=vietnamDateParts(),key=`${d.year}-11-20`;const inv=flowerInventory();inv[key]=(inv[key]||0)+1;try{localStorage.setItem(FLOWER_KEY,JSON.stringify(inv))}catch{return toast('Không lưu được túi đồ trên thiết bị này!')};coins-=20;$('#coins').textContent=`🪙 ${coins} xu`;showFlowerInventory();toast('💐 Đã nhận bó hoa 20/11 LIMITED!');}
$('#flowers').onclick=()=>{const d=$('#detail');d.replaceChildren();const intro=document.createElement('p');intro.textContent=isFlowerDay()?'💐 Quầy hoa mở ngày 20/11 · 20 xu/bó. Đến gần quầy để mua.':'🔒 Quầy hoa chỉ mở trong ngày 20/11 theo giờ Việt Nam. Hoa đã mua vẫn là vật phẩm LIMITED trong túi đồ.';d.append(intro);const btn=document.createElement('button');btn.textContent='💐 Mua bó hoa (20 xu)';btn.disabled=!isFlowerDay();btn.onclick=buyFlower;d.append(btn);const note=document.createElement('p');note.textContent='Hoa là vật phẩm kỷ niệm dành tặng thầy cô trong game. Túi đồ lưu trên trình duyệt hiện tại, chưa đồng bộ tài khoản.';d.append(note);};
showFlowerInventory();
// Nhạc chờ: người chơi chủ động bật; cần cung cấp file âm thanh được phép sử dụng.
const musicTracks=[{name:'Anh chút thôi',src:'/music/anh-chut-thoi.mp3'},{name:'Nơi này có anh',src:'/music/noi-nay-co-anh.mp3'}];
const bgMusic=new Audio();bgMusic.loop=false;bgMusic.volume=.35;let musicIndex=0;
const musicButton=$('#musicToggle');
function updateMusicButton(){musicButton.textContent=bgMusic.paused?'🔇 Bật nhạc chờ':'🎵 Tắt nhạc';}
function playMusic(index){musicIndex=index%musicTracks.length;bgMusic.src=musicTracks[musicIndex].src;bgMusic.play().then(()=>{updateMusicButton();toast('🎵 '+musicTracks[musicIndex].name)}).catch(()=>{bgMusic.pause();updateMusicButton();toast('Chưa có file nhạc hợp lệ trong public/music!')});}
musicButton.onclick=()=>{if(bgMusic.paused)playMusic(musicIndex);else{bgMusic.pause();updateMusicButton()}};
bgMusic.addEventListener('ended',()=>playMusic((musicIndex+1)%musicTracks.length));
const events=[['🌕 Trung Thu','Rước đèn và check-in sân trường',30],['💐 Ngày Nhà giáo 20/11','Gửi lời tri ân thầy cô',25],['🧧 Tết Nguyên Đán','Nhận lì xì đầu xuân',40],['🎒 Ngày hội tựu trường','Khám phá các dãy lớp',20]];const claimed=new Set();$('#events').onclick=()=>{const d=$('#detail');d.replaceChildren();for(const [name,description,reward]of events){const b=document.createElement('button');b.textContent=`${name} (+${reward} xu)`;b.title=description;b.onclick=()=>{activeEvent=name;$('#eventStatus').textContent=`🎊 ${name}`;if(claimed.has(name))return toast('Bạn đã nhận quà sự kiện này!');claimed.add(name);coins+=reward;$('#coins').textContent=`🪙 ${coins} xu`;toast(`Hoàn thành sự kiện! +${reward} xu`)};d.append(b)}};
const subjectPlan={10:['Toán','Ngữ văn','Tiếng Anh','Vật lí','Lịch sử','Tin học','Giáo dục thể chất'],11:['Ngữ văn','Toán','Hóa học','Tiếng Anh','Địa lí','Vật lí','Tin học'],12:['Toán','Tiếng Anh','Ngữ văn','Lịch sử','Vật lí','Hóa học','Giáo dục kinh tế và pháp luật']};
let selectedGrade=10;
function subjectFor(period){const m=/Tiết (\d+)/.exec(period);return m?(subjectPlan[selectedGrade][Number(m[1])-1]||'Tự học'):'Sinh hoạt / nghỉ';}
let lastPeriod='';const periods=[[435,480,'Tiết 1'],[485,530,'Tiết 2'],[530,550,'Ra chơi'],[550,595,'Tiết 3'],[600,645,'Tiết 4'],[650,695,'Tiết 5'],[780,825,'Tiết 6'],[830,875,'Tiết 7']];$('#schedule').onclick=()=>{const times=['7:15–8:00','8:05–8:50','9:10–9:55','10:00–10:45','10:50–11:35','13:00–13:45','13:50–14:35'];$('#detail').replaceChildren();times.forEach((t,i)=>{const line=document.createElement('div');line.textContent=`Tiết ${i+1} · ${t} · ${subjectPlan[selectedGrade][i]}`;$('#detail').append(line)});const note=document.createElement('small');note.textContent='Thời khóa biểu mẫu theo khối, chưa phải lịch chính thức của trường.';$('#detail').append(note)};
const quizBank={
'Toán':[['2x + 3 = 11. x bằng?', ['3','4','5'],1],['Tam giác có tổng ba góc bằng?', ['90°','180°','360°'],1]],
'Ngữ văn':[['Từ nào là từ láy?', ['Lung linh','Bàn ghế','Sách vở'],0]],
'Tiếng Anh':[['Quá khứ của go là?', ['goed','went','gone'],1]],
'Vật lí':[['Đơn vị SI của vận tốc?', ['m/s','kg','N'],0]],
'Lịch sử':[['Cách mạng tháng Tám diễn ra năm nào?', ['1945','1954','1975'],0]],
'Tin học':[['HTML dùng để?', ['Tạo cấu trúc trang web','Nén video','Chạy động cơ'],0]],
'Hóa học':[['Công thức hóa học của nước?', ['CO₂','H₂O','O₂'],1]],
'Địa lí':[['Trái Đất quay quanh?', ['Mặt Trời','Mặt Trăng','Sao Hỏa'],0]],
'Giáo dục thể chất':[['Khởi động trước vận động giúp?', ['Làm nóng cơ thể','Giảm tập trung','Không có tác dụng'],0]],
'Giáo dục kinh tế và pháp luật':[['Người mua hàng là chủ thể?', ['Tiêu dùng','Sản xuất','Trung gian'],0]]
};
let lastQuizKey='';
function showQuiz(){
 if(!inside||interiors[activeRoom]?.kind!=='class')return toast('Hãy vào lớp học để trả lời câu hỏi!');
 const subject=subjectFor($('#period').textContent.includes('Tiết')?($('#period').textContent.match(/Tiết \d+/)||[])[0]:'Tiết 1');
 const list=quizBank[subject]||quizBank['Toán'];
 const q=list[Math.floor(Math.random()*list.length)];const d=$('#detail');d.replaceChildren();
 const heading=document.createElement('strong');heading.textContent='📚 '+subject+': '+q[0];d.append(heading);
 q[1].forEach((answer,i)=>{const b=document.createElement('button');b.textContent=answer;b.onclick=()=>{toast(i===q[2]?'🎉 Chính xác!':'Chưa đúng, thử câu khác nhé!');d.replaceChildren()};d.append(b)});
}
$('#quiz').onclick=showQuiz;
$('#chatForm').onsubmit=e=>{e.preventDefault();const input=$('#chatInput');const text=input.value.trim();if(text&&socket?.readyState===WebSocket.OPEN)socket.send(JSON.stringify({type:'chat',text}));else if(text)toast('Chat cần kết nối máy chủ');input.value=''};
const destinations=[
 {name:'LỚP 10A1',x:-38,z:-37},{name:'LỚP 11A1',x:38,z:-37},{name:'LỚP 12A1',x:0,z:-20},
 {name:'CĂN TIN TUỔI THƠ',x:-33,z:40},{name:'THƯ VIỆN ANHXTANH',x:32,z:40}
];
function interact(){
 if(inside){setInteriorVisible(null);inside=false;activeRoom='';player.position.copy(returnPoint);$('#location').textContent='📍 Sân trường';toast('Đã trở lại sân trường');return}
 for(const stair of [-13,13]){if(Math.hypot(player.position.x-stair,player.position.z+23)<9){floorLevel=(floorLevel+1)%3;player.position.y=floorLevel*3.5;$('#location').textContent='📍 Tầng '+(floorLevel+1);toast('Bạn đang ở tầng '+(floorLevel+1)+' · Nhấn E để chuyển tầng');return}}
 const dest=destinations.find(d=>Math.hypot(player.position.x-d.x,player.position.z-d.z)<17);
 if(!dest){toast('Đến gần cửa lớp, căn tin, thư viện hoặc cầu thang rồi nhấn E');return}
 returnPoint.copy(player.position);setInteriorVisible(dest.name);inside=true;activeRoom=dest.name;floorLevel=0;const room=interiors[dest.name];player.position.set(room.x,0,room.z+5);$('#location').textContent='📍 '+dest.name;toast('Đã vào '+dest.name+' · Nhấn E để ra');
}
window.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName))return;keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e'&&!e.repeat)interact()});
$('#interact').onclick=interact;
window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();keys[b.dataset.key]=true});for(const event of ['pointerup','pointercancel','pointerleave'])b.addEventListener(event,()=>keys[b.dataset.key]=false)});let dragging=false,lastX=0,lastY=0;renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY});window.addEventListener('pointerup',()=>dragging=false);window.addEventListener('pointermove',e=>{if(dragging){angle-=(e.clientX-lastX)*.005;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-lastY)*.004,-.2,1.05);lastX=e.clientX;lastY=e.clientY}});


// V15: small fireworks 22h; grand finale at 23:59 on November 20, VN time.
const FIREWORK_START=Date.parse('2026-11-09T17:00:00Z'),FIREWORK_END=Date.parse('2026-11-20T17:00:00Z');
const fireworks=[],fireworksColors=[0xffd36e,0xff86c8,0x9d8cff,0x70f1e0,0xffffff];
let fireworksElapsed=0;
function fireworkMode(){
 const now=Date.now();if(now<FIREWORK_START||now>=FIREWORK_END)return 'off';
 const vn=new Date(now+7*3600000);
 if(vn.getUTCMonth()===10&&vn.getUTCDate()===20&&vn.getUTCHours()===23&&vn.getUTCMinutes()===59)return 'grand';
 return vn.getUTCHours()===22?'small':'off';
}
function burstFirework(mode){
 const count=mode==='grand'?180:38,positions=new Float32Array(count*3),velocities=new Float32Array(count*3);
 const x=(Math.random()-.5)*48,y=22+Math.random()*15,z=-9+Math.random()*25;
 for(let i=0;i<count;i++){
  const a=Math.random()*Math.PI*2,b=Math.acos(2*Math.random()-1),v=(mode==='grand'?10:5)+Math.random()*(mode==='grand'?11:6),j=i*3;
  positions[j]=x;positions[j+1]=y;positions[j+2]=z;
  velocities[j]=Math.sin(b)*Math.cos(a)*v;velocities[j+1]=Math.cos(b)*v;velocities[j+2]=Math.sin(b)*Math.sin(a)*v;
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const material=new THREE.PointsMaterial({color:fireworksColors[Math.floor(Math.random()*fireworksColors.length)],size:mode==='grand'?.85:.4,transparent:true,opacity:1,depthWrite:false});
 const mesh=new THREE.Points(geometry,material);scene.add(mesh);fireworks.push({mesh,velocities,age:0,life:mode==='grand'?2.5:1.7});
}
function updateFireworks(dt){
 const mode=fireworkMode(),status=document.getElementById('fireworksStatus');
 if(status)status.textContent=mode==='grand'?'🎆 ĐẠI PHÁO HOA 20/11 · 23:59!':mode==='small'?'🎇 Pháo hoa nhỏ · 22:00–22:59':Date.now()>=FIREWORK_END?'🎆 Sự kiện đã kết thúc':'🎆 Chờ pháo hoa lúc 22:00';
 if(mode!=='off'&&!inside&&joined){
  fireworksElapsed+=dt;const interval=mode==='grand'?.3:3.3;
  if(fireworksElapsed>=interval){fireworksElapsed=0;burstFirework(mode);if(mode==='grand')burstFirework(mode);}
 }else fireworksElapsed=0;
 for(let i=fireworks.length-1;i>=0;i--){
  const f=fireworks[i];f.age+=dt;const attr=f.mesh.geometry.attributes.position;
  for(let j=0;j<attr.count;j++){
   const k=j*3;attr.array[k]+=f.velocities[k]*dt;attr.array[k+1]+=(f.velocities[k+1]-5*f.age)*dt;attr.array[k+2]+=f.velocities[k+2]*dt;
  }
  attr.needsUpdate=true;f.mesh.material.opacity=Math.max(0,1-f.age/f.life);
  if(f.age>=f.life){scene.remove(f.mesh);f.mesh.geometry.dispose();f.mesh.material.dispose();fireworks.splice(i,1);}
 }
}
// Small Peak Event: original cartoon animatronic-style mascots.
const peakBots=[];
function peakBot(x,z,color,rabbit){
 const group=new THREE.Group(),skin=mat(color),dark=mat(0x262334),eye=mat(0xfdf4d2);
 const part=(w,h,d,px,py,pz,m)=>{const obj=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);obj.position.set(px,py,pz);group.add(obj);return obj};
 part(1.5,1.7,.9,0,2,0,skin);part(1.45,1.35,1.15,0,3.65,0,skin);
 for(const side of [-1,1]){
  part(.32,.32,.15,side*.38,3.8,.61,eye);part(.12,.16,.17,side*.38,3.8,.7,dark);
  part(.35,1.25,.4,side*1.02,2.1,0,skin);part(.4,1.2,.5,side*.42,.75,0,skin);
  part(rabbit?.35:.5,rabbit?1.3:.55,.35,side*.48,rabbit?4.85:4.5,0,skin);
 }
 part(.75,.22,.2,0,3.2,.65,dark);part(.4,.25,.3,0,4.35,0,dark);
 group.position.set(x,0,z);scene.add(group);peakBots.push({group,seed:Math.random()*6.28});
}
peakBot(-19,10,0x8e7bd1,true);peakBot(19,10,0xd9a45d,false);peakBot(26,29,0x79b8c5,true);
function updatePeakBots(now){for(const b of peakBots){b.group.rotation.y=Math.sin(now*.0008+b.seed)*.35;b.group.position.y=Math.sin(now*.002+b.seed)*.13;}}
// Teaser bí mật: không ghi tên bài hát/nghệ sĩ hay nhúng âm thanh chưa được cấp phép.
const teaser=document.getElementById('secretMusicStatus');
if(teaser)teaser.textContent='🎵 UPCOMING SOON · Một bất ngờ âm nhạc đang được chuẩn bị ✨';

let last=performance.now(),sendAccumulator=0;function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;updateFireworks(dt);updatePeakBots(now);const vietnamClock=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date());const [vnHour,vnMinute]=vietnamClock.split(':').map(Number);const mins=vnHour*60+vnMinute;flowerStall.visible=isFlowerDay();flowerStallLabel.visible=isFlowerDay();$('#clock').textContent=`🕒 Giờ Việt Nam: ${String(Math.floor(mins/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}`;const period=periods.find(p=>mins>=p[0]&&mins<p[1])?.[2]||'Giờ tự do';$('#period').textContent='🔔 '+period+' · '+(subjectFor(period));if(period!==lastPeriod){if(lastPeriod&&period.startsWith('Tiết'))toast('🔔 Vào '+period+'!');lastPeriod=period;}if(joined){let dx=Number(!!(keys.d||keys.arrowright))-Number(!!(keys.a||keys.arrowleft)),dz=Number(!!(keys.s||keys.arrowdown))-Number(!!(keys.w||keys.arrowup));if(dx||dz){const len=Math.hypot(dx,dz),speed=keys.shift?11:6;dx/=len;dz/=len;const mx=(dx*Math.cos(angle)+dz*Math.sin(angle))*speed*dt,mz=(dz*Math.cos(angle)-dx*Math.sin(angle))*speed*dt;player.position.x=THREE.MathUtils.clamp(player.position.x+mx,inside?interiors[activeRoom].x-8:-70,inside?interiors[activeRoom].x+8:70);player.position.z=THREE.MathUtils.clamp(player.position.z+mz,inside?interiors[activeRoom].z-6:-70,inside?interiors[activeRoom].z+6:78);player.rotation.y=Math.atan2(mx,mz);const limbs=player.userData.limbs;if(limbs){const a=Math.sin(now*.012)*.55;limbs[0].rotation.x=a;limbs[1].rotation.x=-a;limbs[2].rotation.x=-a;limbs[3].rotation.x=a}}sendAccumulator+=dt;if(sendAccumulator>.1){sendAccumulator=0;if(!inside&&socket?.readyState===WebSocket.OPEN)socket.send(JSON.stringify({type:'move',x:player.position.x,z:player.position.z,rotation:player.rotation.y}))}}for(const n of npcs){const t=now*.00028+n.seed;n.mesh.position.set(n.x+Math.sin(t)*2,0,n.z+Math.cos(t)*2);n.mesh.rotation.y=-t;
  const run=(Math.sin(now*.00035+n.seed*3)>0.45);
  const swing=Math.sin(now*(run?.018:.009)+n.seed)* (run?.85:.35);
  const limbs=n.mesh.userData.limbs;
  if(limbs){limbs[0].rotation.x=swing;limbs[1].rotation.x=-swing;limbs[2].rotation.x=-swing;limbs[3].rotation.x=swing;}
  n.mesh.position.y=Math.max(0,Math.sin(now*(run?.019:.011)+n.seed)*.06);
}for(const p of playGroups){
 const t=now*.0018+p.phase;
 p.mesh.position.set(p.cx+Math.cos(t)*2.5,0,p.cz+Math.sin(t)*2.5);
 p.mesh.rotation.y=-t;
 const l=p.mesh.userData.limbs;
 const a=Math.sin(now*.018+p.phase)*.75;
 l[0].rotation.x=a;l[1].rotation.x=-a;l[2].rotation.x=-a;l[3].rotation.x=a;
 if(Math.sin(t*1.6)>0.75)l[0].rotation.z=-1.1;
 else l[0].rotation.z=0;
 }
 for(const r of others.values())r.mesh.position.lerp(r.target,Math.min(1,dt*8));
 for(const mesh of [player,...Array.from(others.values(),r=>r.mesh)]){if(!activeEmotes.has(mesh))mesh.rotation.z=0;animateEmote(mesh,now)}const radius=inside?8:14;const offset=new THREE.Vector3(Math.sin(angle)*radius*Math.cos(pitch),3+radius*Math.sin(pitch),Math.cos(angle)*radius*Math.cos(pitch));camera.position.lerp(player.position.clone().add(offset),Math.min(1,dt*5));camera.lookAt(player.position.x,2,player.position.z);renderer.render(scene,camera)}requestAnimationFrame(animate);addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

// V12: nút đóng riêng cho nội dung các bảng chức năng.
const detailBox=document.querySelector('#detail');const detailClose=document.querySelector('#closeDetail');
detailClose?.addEventListener('click',()=>{detailBox.replaceChildren();detailClose.hidden=true;});
for(const buttonId of ['canteen','events','schedule','quiz','flowers'])document.getElementById(buttonId)?.addEventListener('click',()=>{detailClose.hidden=false;});
