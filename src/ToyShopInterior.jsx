import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';

const wood='#755039',lightWood='#b38457',darkWood='#4d3025',wall='#e3cfac';
function material(color,roughness=.84,metalness=0){return new THREE.MeshStandardMaterial({color,roughness,metalness});}
function box(parent,mat,w,h,d,x,y,z,shadow=false){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
  m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;parent.add(m);return m;
}
function sphere(parent,mat,r,x,y,z){
  const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,7),mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;
}
function cylinder(parent,mat,r,h,x,y,z){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12),mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;
}
function labelTexture(text,background='#513b2b',foreground='#e9d6a7'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
  const c=canvas.getContext('2d');c.fillStyle=background;c.fillRect(0,0,512,128);
  c.strokeStyle='#cba96c';c.lineWidth=7;c.strokeRect(9,9,494,110);
  c.fillStyle=foreground;c.font='bold 42px Georgia,serif';c.textAlign='center';c.textBaseline='middle';
  c.fillText(text,256,67,480);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});
}
function sign(parent,text,x,y,z,w=2){
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.25),labelTexture(text));
  m.position.set(x,y,z);parent.add(m);return m;
}
function toyTrain(parent,x,y,z){
  const red=material('#923e38'),black=material('#303737'),gold=material('#c9a463',.52,.33);
  const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
  box(g,red,.64,.25,.23,0,.19,0);
  box(g,gold,.22,.23,.19,.14,.39,0);
  cylinder(g,black,.105,.22,-.17,.12,-.16).rotation.x=Math.PI/2;
  for(const q of [-.22,.2])for(const side of [-.18,.18]){
    const wheel=cylinder(g,black,.09,.035,q,.095,side);wheel.rotation.x=Math.PI/2;
  }
  cylinder(g,black,.075,.30,-.20,.42,0);
}
function rockingHorse(parent,x,y,z){
  const w=material('#a77348'),r=material('#5d3c2a');
  const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
  box(g,w,.18,.26,.57,0,.35,0);
  box(g,w,.18,.30,.18,0,.56,-.20);
  box(g,w,.13,.15,.26,0,.73,-.32);
  for(const z1 of [-.20,.21])for(const x1 of [-.11,.11])box(g,w,.055,.31,.06,x1,.17,z1);
  for(const xx of [-.12,.12])box(g,r,.08,.07,.92,xx,.055,0);
  box(g,r,.35,.045,.24,0,.48,0);
  box(g,r,.45,.045,.045,0,.69,-.11);
}
function doll(parent,x,y,z,index=0){
  const skin=material(index%2?'#bd8c6f':'#d9ae87'),dress=material(['#b3746f','#718e90','#bfa16a','#796989'][index%4]),hair=material('#453027');
  const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.10,.17,.32,9),dress);body.position.y=.22;g.add(body);
  sphere(g,skin,.105,0,.50,0);box(g,hair,.19,.055,.18,0,.60,-.015);
  for(const xx of [-.13,.13]){
    box(g,skin,.065,.22,.07,xx,.34,0);
    box(g,dress,.075,.12,.07,xx*.57,.055,0);
  }
}
function spinningTop(parent,x,y,z,index=0){
  const colors=['#c65f3e','#718e84','#c59b48','#835873'];
  const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
  cylinder(g,material(colors[index%4]),.105,.16,0,.13,0);
  cylinder(g,material('#b99c73'),.024,.18,0,.28,0);
  const point=new THREE.Mesh(new THREE.ConeGeometry(.078,.13,8),material('#d0af6d'));
  point.rotation.x=Math.PI;point.position.y=.035;g.add(point);
}
function teddy(parent,x,y,z){
  const brown=material('#a27b59'),dark=material('#5d3e2c');
  const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
  sphere(g,brown,.19,0,.20,0);sphere(g,brown,.16,0,.48,0);
  for(const xx of [-.135,.135]){
    sphere(g,brown,.075,xx,.59,0);
    sphere(g,brown,.085,xx*1.65,.25,0);
    sphere(g,brown,.09,xx,.07,.04);
  }
  sphere(g,dark,.040,0,.45,.14);
}
function addShelves(scene,walls){
  const shelf=material('#815638'),edge=material('#bc945d');
  const instances=[];
  for(const side of [-1,1]){
    // The back of the shelf reaches the wall, preserving a wide walkable aisle.
    for(const z of [-2.6,-.25,2.2]){
      const root=new THREE.Group();
      root.position.set(side*3.14,0,z);root.rotation.y=side>0?Math.PI/2:-Math.PI/2;
      box(root,shelf,1.84,.13,.92,0,.22,0);
      for(const y of [.64,1.36,2.06])box(root,shelf,1.84,.10,.88,0,y,0);
      for(const xx of [-.86,.86])box(root,edge,.082,2.22,.73,xx,1.16,-.06);
      for(let n=0;n<8;n++){
        const xx=-.70+(n%4)*.45,yy=(Math.floor(n/4)?1.43:.72), zz=-.035;
        if((n+z+side)%3===0)doll(root,xx,yy,zz,n);
        else if(n%2===0)toyTrain(root,xx,yy,zz);
        else spinningTop(root,xx,yy,zz,n);
      }
      scene.add(root);
      instances.push(root);
    }
  }
  return instances;
}
function room(scene){
  const floor=material('#9d7453'),wallMat=material(wall),trim=material(darkWood),plaster=material('#eee0c9');
  const glass=new THREE.MeshPhysicalMaterial({color:'#b3d1cd',roughness:.12,transmission:.86,transparent:true,opacity:.32,metalness:0,side:THREE.DoubleSide,depthWrite:false});
  box(scene,floor,7.4,.15,10.0,0,-.095,0);
  // Plank pattern as physical narrow floor gaps.
  const plank=material('#754e35');
  for(let x=-3.6;x<3.8;x+=.56)box(scene,plank,.015,.004,9.8,x,.001,0);
  for(const z of [-4.96,4.96])box(scene,wallMat,7.4,3.55,.17,0,1.78,z);
  for(const x of [-3.67,3.67])box(scene,wallMat,.15,3.55,10,x,1.78,0);
  box(scene,plaster,7.4,.10,10,0,3.5,0);
  for(const z of [-4.86,4.86])box(scene,trim,7.35,.12,.13,0,.18,z);
  for(const x of [-3.56,3.56])box(scene,trim,.12,.12,9.8,x,.18,0);
  // Street-facing storefront on +z: central glass entrance and two display windows.
  const entrance=material('#4b3326');
  box(scene,trim,.11,3.15,.1,-1.07,1.58,4.74);
  box(scene,trim,.11,3.15,.1,1.07,1.58,4.74);
  box(scene,trim,7.1,.18,.15,0,2.99,4.75);
  for(const x of [-2.26,2.26]){
    box(scene,glass,2.03,2.30,.022,x,1.62,4.65);
    box(scene,trim,.065,2.43,.13,x,1.62,4.72);
    box(scene,trim,2.03,.055,.13,x,1.53,4.72);
  }
  box(scene,glass,2.00,2.48,.024,0,1.61,4.67);
  box(scene,trim,2.03,.08,.13,0,.38,4.68);
  box(scene,trim,2.05,.08,.13,0,2.85,4.68);
  box(scene,trim,.05,2.42,.09,0,1.62,4.68);
  sphere(scene,material('#c49b55',.3,.5),.048,.12,1.44,4.53);
  // Shop sign indoors: old Istanbul retail lettering.
  sign(scene,'OYUNCAKÇI DÜKKÂNI',0,2.73,-4.73,3.2);
  // Ceiling fittings; bounded lights work on mobile.
  const ambient=new THREE.HemisphereLight('#fff3dd','#634932',2.1);scene.add(ambient);
  const sun=new THREE.DirectionalLight('#ffe7b5',1.7);sun.position.set(1,6,5);scene.add(sun);
  const fixtures=new THREE.Group();
  for(const z of [-2.5,1.8]){
    cylinder(fixtures,trim,.036,.42,0,3.22,z);
    sphere(fixtures,material('#d9c296',.5,.15),.20,0,2.92,z);
    const bulb=new THREE.PointLight('#ffdda6',.9,6);
    bulb.position.set(0,2.75,z);fixtures.add(bulb);
  }
  scene.add(fixtures);
  addShelves(scene);
  // Checkout counter is on the left, leaving circulation path.
  const counter=new THREE.Group();counter.position.set(-1.90,0,-3.4);
  box(counter,material('#7a4f35'),2.10,.92,.86,0,.48,0);
  box(counter,material('#b28a61'),2.24,.095,1.00,0,.98,0);
  box(counter,trim,.56,.28,.40,.55,1.15,-.16);
  cylinder(counter,material('#bba06d',.42,.3),.15,.095,-.60,1.11,.18);
  scene.add(counter);
  // A carpet guides the visitor from the entrance into the shop.
  box(scene,material('#86634d'),1.28,.012,5.1,.03,.015,.50);
  const lines=material('#bd9e76');
  for(const x of [-.54,.54])box(scene,lines,.035,.014,5.1,x,.027,.50);
  // Display of larger wooden toys and packed boxes.
  rockingHorse(scene,1.6,0,-3.36);
  teddy(scene,2.6,.12,-3.15);
  for(const [x,z] of [[2.3,-2.2],[2.68,-2.2],[2.33,-1.83]]){
    box(scene,material(lightWood),.29,.27,.29,x,.14,z);
  }
  for(let i=0;i<3;i++)doll(scene,-.8+i*.28,1.02,-3.66,i);
  // Wood shop display plinths beside the window.
  for(const x of [-2.25,2.25]){
    box(scene,material('#7a5134'),1.2,.42,.75,x,.24,4.03);
    if(x<0)toyTrain(scene,x,.43,4.0);else rockingHorse(scene,x,.43,4.0);
  }
  // A period poster on the right back wall.
  sign(scene,'TAHTA · BEZ · OYUN',1.85,2.48,-4.72,2.25);
}
export const TOY_SHOP_ID=48;
export const TOY_SHOP_ROOM={width:7.4,depth:10,eye:1.58,
  bounds:{minX:-3.12,maxX:3.12,minZ:-4.35,maxZ:4.15}};
export function clampToyWalk(position){
  return {x:Math.max(TOY_SHOP_ROOM.bounds.minX,Math.min(TOY_SHOP_ROOM.bounds.maxX,position.x)),
    z:Math.max(TOY_SHOP_ROOM.bounds.minZ,Math.min(TOY_SHOP_ROOM.bounds.maxZ,position.z))};
}
export default function ToyShopInterior({onExit,property,owned=false,stock=0}){
  const canvasHost=useRef(null);
  const command=useRef({forward:false,back:false,left:false,right:false});
  const rotate=useRef({x:0,y:0});
  const onExitRef=useRef(onExit);
  useEffect(()=>{onExitRef.current=onExit},[onExit]);
  useEffect(()=>{
    const el=canvasHost.current;if(!el)return;
    const scene=new THREE.Scene();scene.background=new THREE.Color('#dfc8a8');
    room(scene);
    const cam=new THREE.PerspectiveCamera(70,1,.08,50);
    cam.position.set(0,TOY_SHOP_ROOM.eye,3.22);cam.rotation.order='YXZ';
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    const isMobile=window.matchMedia('(max-width:760px)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,isMobile?1.35:1.7));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.20;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText='display:block;width:100%;height:100%;touch-action:none;cursor:grab';
    const size=()=>{const w=Math.max(100,el.clientWidth),h=Math.max(100,el.clientHeight);
      cam.aspect=w/h;cam.updateProjectionMatrix();renderer.setSize(w,h,false);};
    size();
    const observer=new ResizeObserver(size);observer.observe(el);
    const clock=new THREE.Clock();
    let frame=0,rotationY=0,rotationX=0;
    const pointer=new Map();
    const pointerDown=e=>{pointer.set(e.pointerId,{x:e.clientX,y:e.clientY});renderer.domElement.setPointerCapture(e.pointerId)};
    const pointerMove=e=>{const old=pointer.get(e.pointerId);if(!old)return;
      const dx=e.clientX-old.x,dy=e.clientY-old.y;pointer.set(e.pointerId,{x:e.clientX,y:e.clientY});
      rotationY-=dx*.004;rotationX=THREE.MathUtils.clamp(rotationX-dy*.0035,-1.08,1.08);
    };
    const pointerUp=e=>pointer.delete(e.pointerId);
    renderer.domElement.addEventListener('pointerdown',pointerDown);
    renderer.domElement.addEventListener('pointermove',pointerMove);
    renderer.domElement.addEventListener('pointerup',pointerUp);
    renderer.domElement.addEventListener('pointercancel',pointerUp);
    const key=e=>{const k=e.key.toLowerCase();
      if(k==='escape'){onExitRef.current?.();return;}
      const map={w:'forward',arrowup:'forward',s:'back',arrowdown:'back',a:'left',arrowleft:'left',d:'right',arrowright:'right'};
      if(map[k]){command.current[map[k]]=e.type==='keydown';e.preventDefault();}
    };
    window.addEventListener('keydown',key);window.addEventListener('keyup',key);
    const blur=()=>{command.current={forward:false,back:false,left:false,right:false}};
    window.addEventListener('blur',blur);
    const animate=()=>{
      frame=requestAnimationFrame(animate);
      const delta=Math.min(clock.getDelta(),.05);
      rotationY+=rotate.current.x*delta;
      rotationX=THREE.MathUtils.clamp(rotationX+rotate.current.y*delta,-1.05,1.05);
      cam.rotation.set(rotationX,rotationY,0,'YXZ');
      const input=command.current;
      let f=Number(input.forward)-Number(input.back),s=Number(input.right)-Number(input.left);
      const length=Math.hypot(f,s);
      if(length){f/=length;s/=length;
        const speed=1.38*delta;
        const dx=(Math.sin(rotationY)*-f+Math.cos(rotationY)*s)*speed;
        const dz=(-Math.cos(rotationY)*f-Math.sin(rotationY)*s)*speed;
        const pos=clampToyWalk({x:cam.position.x+dx,z:cam.position.z+dz});
        // Central checkout desk is solid, no walking through furniture.
        const blocked=pos.x>-3.05&&pos.x<-.66&&pos.z>-3.99&&pos.z<-2.79;
        if(!blocked){cam.position.x=pos.x;cam.position.z=pos.z;}
      }
      if(frame%2===0){renderer.render(scene,cam);}
    };
    animate();
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('keydown',key);
      window.removeEventListener('keyup',key);window.removeEventListener('blur',blur);
      renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('pointermove',pointerMove);
      renderer.domElement.removeEventListener('pointerup',pointerUp);renderer.domElement.removeEventListener('pointercancel',pointerUp);
      scene.traverse(o=>{if(o.isMesh){o.geometry?.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];
        mats.forEach(m=>{m?.map?.dispose();m?.dispose();});}});
      renderer.dispose();renderer.domElement.remove();};
  },[]);
  const moveProps=(type)=>({onPointerDown:e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);command.current[type]=true;},
    onPointerUp:e=>{e.preventDefault();command.current[type]=false;},
    onPointerCancel:()=>{command.current[type]=false;},onLostPointerCapture:()=>{command.current[type]=false;}});
  return <div className="toy-interior-modal" role="dialog" aria-modal="true" aria-label="Oyuncakçı dükkânı içi">
    <div className="toy-interior-frame">
      <header className="toy-interior-top"><div><span className="toy-interior-kicker">MAHALLE / BEYOĞLU 1923 · İÇ MEKÂN TESTİ</span><h2>{property?.name||'Oyuncakçı Dükkânı'}</h2><small>Ahşap trenler · bez bebekler · sallanan atlar · vitrin</small></div><button type="button" onClick={onExit} aria-label="Oyuncakçıdan çık">← SOKAĞA DÖN</button></header>
      <div className="toy-interior-canvas" ref={canvasHost}/>
      <div className="toy-interior-bottom">
        <div className="toy-interior-caption"><strong>OYUNCAKÇININ İÇİNDE</strong><span>{owned?'Bu dükkân sana ait.':'Dükkânı satın almadan da gezebilirsin.'} {stock>0?'· Vitrindeki kayıtlı ürün: '+stock:''}</span><small>WASD / ok tuşları: yürü · Ekranı sürükle: etrafa bak · Esc: çık</small></div>
        <div className="toy-interior-pad" aria-label="İç mekânda hareket et">
          <button type="button" {...moveProps('left')} aria-label="Sola yürü">←</button>
          <button type="button" {...moveProps('forward')} aria-label="İleri yürü">↑</button>
          <button type="button" {...moveProps('back')} aria-label="Geri yürü">↓</button>
          <button type="button" {...moveProps('right')} aria-label="Sağa yürü">→</button>
        </div>
      </div>
    </div>
  </div>;
}
