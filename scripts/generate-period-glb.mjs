// Offline-authored historical Pera architectural GLB kit. No network or new packages.
// Writes standards-compliant glTF 2.0 binary models with embedded PBR texture maps.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const outDir = path.resolve('public/models');
fs.mkdirSync(outDir, { recursive: true });
const profiles = ['grand', 'merchant', 'workshop', 'timber', 'han', 'cafe'];
const floorsSet = [2, 3, 4, 5];
const profilesInfo = {
  grand: { plaster: [0.77,0.70,0.64], stone: [0.84,0.78,0.68], roof:'mansard', columns:3 },
  merchant: { plaster: [0.78,0.73,0.64], stone: [0.81,0.75,0.65], roof:'gable', columns:2 },
  workshop: { plaster: [0.69,0.68,0.62], stone: [0.63,0.61,0.56], roof:'flat', columns:2 },
  timber: { plaster: [0.73,0.62,0.52], stone: [0.76,0.68,0.54], roof:'gable', columns:2 },
  han: { plaster: [0.77,0.73,0.65], stone: [0.85,0.79,0.67], roof:'flat', columns:3 },
  cafe: { plaster: [0.79,0.70,0.62], stone: [0.83,0.77,0.67], roof:'mansard', columns:3 }
};
const hash = n => {const x=Math.sin(n * 123.492+9.13)*43758.5453;return x-Math.floor(x)};
const clamp = v=>Math.min(255,Math.max(0,Math.floor(v)));
const MATERIAL_NAMES=['plaster','limestone','dark-wood','tile-roof','window-glass','iron','brass','awning','warm-window'];
const materialIndex=Object.fromEntries(MATERIAL_NAMES.map((name,i)=>[name,i]));

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const value of buffer) {
    crc ^= value;
    for (let i=0;i<8;i++) crc=(crc>>>1)^((crc&1)?0xedb88320:0);
  }
  return (crc^0xffffffff)>>>0;
}
function pngChunk(type,data) {
  const tag=Buffer.from(type,'ascii');
  const size=Buffer.alloc(4);size.writeUInt32BE(data.length,0);
  const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(Buffer.concat([tag,data])),0);
  return Buffer.concat([size,tag,data,crc]);
}
function texturePng(kind) {
  const size=128,raw=Buffer.alloc((size*4+1)*size);
  for(let y=0;y<size;y++){
    const row=y*(size*4+1);raw[row]=0;
    for(let x=0;x<size;x++){
      const index=row+1+x*4;const n=hash(x*17+y*37+kind*234)-.5;
      const low=hash(Math.floor(x/8)*23+Math.floor(y/8)*37+kind*191)-.5;
      let col;
      if(kind===0) {
        const val=234+n*28+low*20;
        col=[val,val-3,val-10];
        if(x%53<1&&y%9<3)col=[182,170,153];
      } else if(kind===1) {
        const rowNo=Math.floor(y/14), seam=(x+rowNo*13)%26;
        const border=(y%14===0||seam<=1);
        col=border?[111,78,62]:[185+n*36+low*22,139+n*28+low*18,108+n*24];
      } else {
        const grain=Math.sin(x*.14+Math.sin(y*.2))*9;
        col=[170+grain+n*16,142+grain*.6+n*14,113+n*14];
      }
      raw[index]=clamp(col[0]);raw[index+1]=clamp(col[1]);raw[index+2]=clamp(col[2]);raw[index+3]=255;
    }
  }
  const signature=Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;
  return Buffer.concat([signature,pngChunk('IHDR',ihdr),pngChunk('IDAT',zlib.deflateSync(raw,{level:9})),pngChunk('IEND',Buffer.alloc(0))]);
}
const textures=[texturePng(0),texturePng(1),texturePng(2)];
const round=v=>Math.round(v*10000)/10000;

class Architecture {
  constructor(style,floors) {
    this.style=style;this.floors=floors;this.profile=profilesInfo[style];
    this.groups=Object.fromEntries(MATERIAL_NAMES.map(name=>[name,{positions:[],normals:[],uvs:[],indices:[]}]));
    this.w=2.48;this.d=2.05;this.storyHeight=.91;this.h=floors*this.storyHeight;
  }
  tri(material,a,b,c,uvs=[[0,0],[1,0],[0,1]]) {
    const g=this.groups[material], start=g.positions.length/3;
    const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2];
    const vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
    const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
    const magnitude=Math.hypot(nx,ny,nz)||1;
    const normal=[nx/magnitude,ny/magnitude,nz/magnitude];
    for(let i=0;i<3;i++){
      const p=[a,b,c][i];g.positions.push(...p.map(round));
      g.normals.push(...normal.map(round));g.uvs.push(...uvs[i].map(round));
    }
    g.indices.push(start,start+1,start+2);
  }
  quad(material,a,b,c,d,uv=[1,1]) {
    const uvv=[[0,0],[uv[0],0],[uv[0],uv[1]],[0,uv[1]]];
    this.tri(material,a,b,c,[uvv[0],uvv[1],uvv[2]]);
    this.tri(material,a,c,d,[uvv[0],uvv[2],uvv[3]]);
  }
  box(material,cx,cy,cz,w,h,d) {
    if(w<=0||h<=0||d<=0)throw Error('Invalid box size');
    const x0=cx-w/2,x1=cx+w/2,y0=cy-h/2,y1=cy+h/2,z0=cz-d/2,z1=cz+d/2;
    this.quad(material,[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[w*.48,h*.48]);
    this.quad(material,[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[w*.48,h*.48]);
    this.quad(material,[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[d*.48,h*.48]);
    this.quad(material,[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[d*.48,h*.48]);
    this.quad(material,[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],[w*.48,d*.48]);
    this.quad(material,[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[w*.48,d*.48]);
  }
  lintel(x,y,z,w=.46) {
    this.box('limestone',x,y+.27,z+.038,w,.071,.14);
    this.box('limestone',x,y-.26,z+.055,w+.045,.075,.17);
  }
  window(x,y,z,w=.36,h=.45,axis='z',side=1,curved=false) {
    if(axis==='z') {
      const front=z+side*.015;
      this.box('dark-wood',x,y,front,w+.1,h+.1,.12);
      this.box('window-glass',x,y,front+side*.082,w,h,.023);
      this.box('dark-wood',x,y,front+side*.100,.024,h+.028,.035);
      this.box('dark-wood',x,y+.012,front+side*.103,w+.02,.022,.034);
      this.box('limestone',x,y+h*.56,front+side*.065,w+.18,.07,.17);
      this.box('limestone',x,y-h*.55,front+side*.065,w+.21,.085,.19);
      if(curved) {
        for(let i=0;i<7;i++){
          const angle=Math.PI*i/6;
          this.box('limestone',x+Math.cos(angle)*w*.58,y+h*.52+Math.sin(angle)*.17,front+side*.082,.072,.065,.14);
        }
      }
    }else{
      const sx=x+side*.036;
      this.box('dark-wood',sx,y,z,.12,h+.11,w+.09);
      this.box('window-glass',sx+side*.082,y,z,.025,h,w);
      this.box('dark-wood',sx+side*.1,y,z,.031,h+.02,.026);
      this.box('dark-wood',sx+side*.1,y+.01,z,.033,.02,w+.015);
      this.box('limestone',sx+side*.07,y+h*.55,z,.17,.062,w+.11);
      this.box('limestone',sx+side*.07,y-h*.55,z,.17,.078,w+.15);
    }
  }
  cylinder(material,x,y,z,r,h,segments=10) {
    const step=Math.PI*2/segments;
    for(let i=0;i<segments;i++){
      const a=i*step,b=(i+1)*step;
      const p0=[x+Math.cos(a)*r,y-h/2,z+Math.sin(a)*r];
      const p1=[x+Math.cos(b)*r,y-h/2,z+Math.sin(b)*r];
      const p2=[x+Math.cos(b)*r,y+h/2,z+Math.sin(b)*r];
      const p3=[x+Math.cos(a)*r,y+h/2,z+Math.sin(a)*r];
      this.quad(material,p0,p1,p2,p3,[.12,h]);
    }
  }
  roof() {
    const w=this.w,d=this.d,h=this.h;
    if(this.profile.roof==='flat') {
      this.box('tile-roof',0,h+.10,0,w+.25,.22,d+.25);
      this.box('limestone',0,h+.01,d/2+.09,w+.3,.13,.17);
      this.box('limestone',0,h+.01,-d/2-.09,w+.3,.13,.17);
      for(let s of [-1,1])this.box('limestone',s*(w/2+.08),h+.01,0,.15,.14,d+.1);
    }else if(this.profile.roof==='gable'){
      const rise=this.style==='timber'?.72:.63,extra=.12;
      const l=-w/2-extra,r=w/2+extra,f=d/2+.12,b=-d/2-.12;
      this.quad('tile-roof',[l,h,f],[0,h+rise,f],[0,h+rise,b],[l,h,b],[1.2,1.2]);
      this.quad('tile-roof',[0,h+rise,f],[r,h,f],[r,h,b],[0,h+rise,b],[1.2,1.2]);
      this.tri('plaster',[l,h,f],[r,h,f],[0,h+rise,f]);
      this.tri('plaster',[r,h,b],[l,h,b],[0,h+rise,b]);
      this.box('limestone',0,h+.02,f,w+.22,.1,.12);
      this.box('limestone',0,h+.02,b,w+.22,.1,.12);
    }else{
      const q=.31;
      const a=-w/2-.1,b=-w*q,c=w*q,dw=w/2+.1,front=d/2+.10,back=-d/2-.10,rise=.82;
      const profile=[[a,h],[b,h+rise],[c,h+rise],[dw,h]];
      for(let i=0;i<3;i++){
        const v=profile[i],u=profile[i+1];
        this.quad('tile-roof',[v[0],v[1],front],[u[0],u[1],front],[u[0],u[1],back],[v[0],v[1],back],[1,1]);
      }
      this.quad('tile-roof',[b,h+rise,front],[c,h+rise,front],[c,h+rise,back],[b,h+rise,back],[1,1]);
      this.tri('limestone',[a,h,front],[dw,h,front],[b,h+rise,front]);
      this.tri('limestone',[dw,h,front],[c,h+rise,front],[b,h+rise,front]);
      this.tri('limestone',[dw,h,back],[a,h,back],[b,h+rise,back]);
      this.tri('limestone',[dw,h,back],[b,h+rise,back],[c,h+rise,back]);
      this.box('limestone',0,h+.05,front,w+.19,.1,.12);
      for(const x of [-.52,.52]) {
        if(this.floors>=3){
          this.box('dark-wood',x,h+.48,front+.12,.35,.32,.16);
          this.box('window-glass',x,h+.48,front+.22,.26,.23,.04);
          this.box('limestone',x,h+.69,front+.16,.44,.08,.20);
        }
      }
    }
  }
  storefront() {
    const isShop=['merchant','cafe','workshop','han'].includes(this.style);
    const front=this.d/2;
    this.box('limestone',0,.07,front+.14,this.w+.18,.14,.22);
    this.box('dark-wood',isShop?.43:0,.44,front+.12,.57,.82,.16);
    const doorX=isShop?.43:0;
    this.box('dark-wood',doorX,.44,front+.22,.43,.7,.035);
    for(const y of [.22,.52]){
      this.box('dark-wood',doorX,y,front+.25,.35,.22,.025);
      this.box('limestone',doorX,y+.11,front+.27,.38,.025,.04);
    }
    this.box('brass',doorX+.12,.45,front+.30,.032,.075,.042);
    for(const x of [doorX-.31,doorX+.31]){
      this.box('limestone',x,.48,front+.12,.085,.94,.15);
    }
    this.box('limestone',doorX,.95,front+.1,.68,.11,.17);
    if(isShop) {
      for(const x of [-.74,-.26]) {
        if(Math.abs(x-doorX)<.4)continue;
        this.box('dark-wood',x,.55,front+.11,.40,.64,.12);
        this.box('window-glass',x,.55,front+.19,.30,.54,.03);
        this.box('dark-wood',x,.55,front+.23,.025,.57,.028);
      }
      this.box('dark-wood',0,1.11,front+.15,this.w*.91,.21,.15);
      this.box('limestone',0,1.24,front+.18,this.w*.96,.06,.19);
      if(this.style==='cafe'||this.style==='merchant') {
        // Projected striped canvas, metal supports and hanging valance.
        for(let i=0;i<10;i++){
          const x=-this.w*.43+(i+.5)*(this.w*.86/10);
          this.box(i%2?'awning':'limestone',x,1.13,front+.49,this.w*.86/10,.04,.65);
          this.box(i%2?'awning':'limestone',x,.99,front+.78,this.w*.86/10,.14,.027);
        }
        for(const x of [-.88,.88])this.box('iron',x,1.13,front+.48,.035,.04,.67);
      }
    }
    this.box('dark-wood',0,.44,-front-.13,.6,.78,.15);
    this.box('brass',.15,.44,-front-.23,.03,.05,.04);
  }
  build() {
    const p=this.profile,w=this.w,d=this.d,h=this.h,f=this.floors;
    this.box('plaster',0,h/2,0,w,h,d);
    this.box('limestone',0,.10,0,w+.08,.20,d+.08);
    this.box('limestone',0,h-.12,d/2+.07,w+.21,.12,.19);
    this.box('limestone',0,h-.12,-d/2-.07,w+.21,.12,.19);
    for(let floor=1;floor<f;floor++){
      if(this.style==='grand'||this.style==='han') this.box('limestone',0,floor*this.storyHeight,d/2+.045,w+.12,.08,.14);
    }
    for(const side of [-1,1]){
      if(this.style==='grand'||this.style==='han'){
        this.box('limestone',side*(w/2-.08),h/2,d/2+.07,.14,h-.15,.12);
        for(let j=0;j<f;j++)this.box('limestone',side*(w/2-.08),j*this.storyHeight+.23,d/2+.14,.25,.14,.23);
      }else{
        this.box(this.style==='timber'?'dark-wood':'limestone',side*(w/2-.08),h/2,d/2+.03,.10,h-.17,.11);
      }
    }
    const cols=p.columns;
    const spread=cols===3?.71:.78;
    for(let floor=1;floor<f;floor++){
      const y=(floor+.50)*this.storyHeight;
      for(let col=0;col<cols;col++){
        const x=(col-(cols-1)/2)*spread;
        const curved=(this.style==='grand'&&floor===f-1)||(this.style==='han'&&floor===1);
        this.window(x,y,d/2+.035,cols===3?.33:.41,.46,'z',1,curved);
        this.window(x,y,-d/2-.035,cols===3?.33:.41,.46,'z',-1,false);
        if(this.style==='grand'&&floor===1&&col===Math.floor(cols/2)){
          this.box('limestone',x,y-.36,d/2+.30,.64,.07,.60);
          for(let k=0;k<5;k++){
            this.box('iron',x-.24+k*.12,y-.10,d/2+.51,.02,.47,.025);
          }
          this.box('iron',x,y+.12,d/2+.52,.61,.035,.03);
        }
      }
      for(let side of [-1,1])for(let z of [-.42,.42]){
        this.window(side*(w/2+.023),y,z,.36,.40,'x',side,false);
      }
    }
    if(f===2){
      for(let col=0;col<cols;col++)this.window((col-(cols-1)/2)*spread,1.4*this.storyHeight,-d/2-.035,.32,.42,'z',-1,false);
    }
    this.storefront();
    this.roof();
    if(this.style==='timber'){
      for(const x of [-w*.44,w*.44]){
        this.box('dark-wood',x,h/2,d/2+.11,.11,h-.2,.12);
      }
      for(let y=this.storyHeight;y<h;y+=this.storyHeight)this.box('dark-wood',0,y,d/2+.13,w*.92,.09,.12);
    }
    if(this.style==='workshop'){
      for(let x of [-.62,.62]){
        this.box('iron',x,.63,d/2+.22,.025,.83,.04);
        this.box('iron',x,.73,d/2+.22,.34,.025,.04);
      }
      this.box('iron',0,h+.31,-.25,.26,.62,.26);
      this.box('limestone',0,h+.65,-.25,.34,.07,.34);
    }
    if(this.style==='cafe') {
      for(let x of [-.85,.85]){
        this.box('iron',x,.35,d/2+1.02,.035,.72,.035);
        this.cylinder('limestone',x,.72,d/2+1.02,.16,.05);
      }
    }
    if(this.style==='grand'&&f>=4){
      for(let x of [-.90,.90]){
        this.box('iron',x,h+.62,-.34,.23,1.0,.23);
        this.box('limestone',x,h+1.16,-.34,.35,.08,.35);
      }
    }
  }
  makeGlb() {
    this.build();
    const rawParts=[],views=[],accessors=[],primitives=[];
    let binaryLength=0;
    const push=(b,target=null)=>{
      const pad=(4-(binaryLength%4))%4;
      if(pad){rawParts.push(Buffer.alloc(pad));binaryLength+=pad}
      const id=views.length;
      views.push({buffer:0,byteOffset:binaryLength,byteLength:b.length,...(target?{target}:{})});
      rawParts.push(b);binaryLength+=b.length;
      return id;
    };
    function accessor(view,componentType,count,type,min=null,max=null) {
      const obj={bufferView:view,componentType,count,type};
      if(min)obj.min=min;if(max)obj.max=max;
      const id=accessors.length;accessors.push(obj);return id;
    }
    for(let i=0;i<MATERIAL_NAMES.length;i++){
      const group=this.groups[MATERIAL_NAMES[i]];
      if(!group.indices.length)continue;
      const pos=new Float32Array(group.positions), nor=new Float32Array(group.normals), uv=new Float32Array(group.uvs);
      const maxIndex=Math.max(...group.indices);
      const idx=maxIndex<65536?new Uint16Array(group.indices):new Uint32Array(group.indices);
      const buffer=b=>Buffer.from(b.buffer,b.byteOffset,b.byteLength);
      const positionView=push(buffer(pos),34962);
      const normalView=push(buffer(nor),34962);
      const uvView=push(buffer(uv),34962);
      const indexView=push(buffer(idx),34963);
      const xs=[],ys=[],zs=[];
      for(let j=0;j<group.positions.length;j+=3){xs.push(group.positions[j]);ys.push(group.positions[j+1]);zs.push(group.positions[j+2])}
      const posAccessor=accessor(positionView,5126,pos.length/3,'VEC3',
        [Math.min(...xs),Math.min(...ys),Math.min(...zs)],[Math.max(...xs),Math.max(...ys),Math.max(...zs)]);
      const normalAccessor=accessor(normalView,5126,nor.length/3,'VEC3');
      const uvAccessor=accessor(uvView,5126,uv.length/2,'VEC2');
      const indexAccessor=accessor(indexView,idx instanceof Uint16Array?5123:5125,idx.length,'SCALAR');
      primitives.push({attributes:{POSITION:posAccessor,NORMAL:normalAccessor,TEXCOORD_0:uvAccessor},indices:indexAccessor,material:i});
    }
    const imageViews=textures.map(img=>push(img));
    const mats=[
      {name:'Lime plaster',pbrMetallicRoughness:{baseColorFactor:[...this.profile.plaster,1],baseColorTexture:{index:0},metallicFactor:0,roughnessFactor:.92}},
      {name:'Sandstone mouldings',pbrMetallicRoughness:{baseColorFactor:[...this.profile.stone,1],baseColorTexture:{index:0},metallicFactor:0,roughnessFactor:.89}},
      {name:'Dark stained timber',pbrMetallicRoughness:{baseColorFactor:[.40,.29,.21,1],baseColorTexture:{index:2},metallicFactor:0,roughnessFactor:.78}},
      {name:'Period roof tiles',pbrMetallicRoughness:{baseColorFactor:[.78,.72,.69,1],baseColorTexture:{index:1},metallicFactor:0,roughnessFactor:.85}},
      {name:'Glass windows',pbrMetallicRoughness:{baseColorFactor:[.29,.48,.48,1],metallicFactor:.10,roughnessFactor:.23},doubleSided:true},
      {name:'Wrought iron',pbrMetallicRoughness:{baseColorFactor:[.19,.22,.20,1],metallicFactor:.61,roughnessFactor:.54}},
      {name:'Patinated brass',pbrMetallicRoughness:{baseColorFactor:[.61,.49,.28,1],metallicFactor:.65,roughnessFactor:.35}},
      {name:'Weathered canvas',pbrMetallicRoughness:{baseColorFactor:[.47,.28,.25,1],metallicFactor:0,roughnessFactor:1}},
      {name:'Warm window interiors',pbrMetallicRoughness:{baseColorFactor:[.65,.52,.39,1],metallicFactor:0,roughnessFactor:.78},
        emissiveFactor:[.26,.17,.09]}
    ];
    const gltf={
      asset:{version:'2.0',generator:'Mahalle Pera Architectural Kit v1',copyright:'Original geometry and textures for Mahalle, 2026'},
      scene:0,scenes:[{nodes:[0]}],nodes:[{name:this.style+'_'+this.floors+'floors',mesh:0}],
      meshes:[{name:'Pera '+this.style+' '+this.floors+' levels',primitives}],
      materials:mats,images:imageViews.map(id=>({mimeType:'image/png',bufferView:id})),
      textures:[{source:0,sampler:0},{source:1,sampler:0},{source:2,sampler:0}],
      samplers:[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}],
      accessors,bufferViews:views,buffers:[{byteLength:binaryLength}]
    };
    let json=Buffer.from(JSON.stringify(gltf));
    json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]);
    let bin=Buffer.concat(rawParts);
    bin=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]);
    const total=12+8+json.length+8+bin.length;
    const header=Buffer.alloc(20);
    header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(total,8);
    header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);
    const binHeader=Buffer.alloc(8);
    binHeader.writeUInt32LE(bin.length,0);binHeader.writeUInt32LE(0x004e4942,4);
    return Buffer.concat([header,json,binHeader,bin]);
  }
}
const manifest={version:1,source:'original generated Pera-style architecture',format:'glTF 2.0 GLB',models:{}};
for(const style of profiles)for(const floors of floorsSet){
  const filename='pera-'+style+'-'+floors+'.glb';
  const model=new Architecture(style,floors);
  const binary=model.makeGlb();
  fs.writeFileSync(path.join(outDir,filename),binary);
  manifest.models[style+'-'+floors]={path:'/models/'+filename,bytes:binary.length,width:model.w,height:model.h,depth:model.d};
}
fs.writeFileSync(path.join(outDir,'manifest.json'),JSON.stringify(manifest,null,2));
console.log('Generated '+Object.keys(manifest.models).length+' original 1920s Pera GLB assets.');
