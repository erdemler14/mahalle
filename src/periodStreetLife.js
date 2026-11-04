import * as THREE from 'three';

// Street-level life for the fictional, spatially coherent 1923 Karaköy/Pera.
// Small timed vignettes are staged on the dry quay and the inner market streets,
// never on the water plane or inside an owned property footprint.
const M={
  lime:new THREE.MeshStandardMaterial({color:'#d9c9ac',roughness:.97}),
  stone:new THREE.MeshStandardMaterial({color:'#a99d8b',roughness:.98}),
  timber:new THREE.MeshStandardMaterial({color:'#6a4c35',roughness:.92}),
  darkWood:new THREE.MeshStandardMaterial({color:'#3f352b',roughness:.88}),
  iron:new THREE.MeshStandardMaterial({color:'#3c4946',metalness:.25,roughness:.73}),
  brass:new THREE.MeshStandardMaterial({color:'#ab9062',metalness:.27,roughness:.56}),
  basket:new THREE.MeshStandardMaterial({color:'#9b7b4d',roughness:1}),
  foliage:new THREE.MeshStandardMaterial({color:'#758c59',roughness:1}),
  flowers:new THREE.MeshStandardMaterial({color:'#b76765',roughness:1}),
  produce:new THREE.MeshStandardMaterial({color:'#b4a354',roughness:1}),
  orange:new THREE.MeshStandardMaterial({color:'#bb7f49',roughness:1}),
  fabric:new THREE.MeshStandardMaterial({color:'#eee0c6',roughness:.99}),
  blue:new THREE.MeshStandardMaterial({color:'#697f83',roughness:.99}),
  awningA:new THREE.MeshStandardMaterial({color:'#8c5c4e',side:THREE.DoubleSide,roughness:1}),
  awningB:new THREE.MeshStandardMaterial({color:'#c4aa83',side:THREE.DoubleSide,roughness:1}),
  skin:new THREE.MeshStandardMaterial({color:'#cba081',roughness:1}),
  hair:new THREE.MeshStandardMaterial({color:'#41332a',roughness:1})
};
const outfits=['#6c554d','#4c6267','#8b6d58','#5b6655','#725f77','#6f6051','#45635d','#9a7c54'].map(color=>new THREE.MeshStandardMaterial({color,roughness:.98}));
const safeHash=n=>{const t=Math.sin(n*127.21+15.2)*31791.31;return t-Math.floor(t)};
function box(parent,material,size,pos,shadow=false){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material);
  mesh.position.set(...pos);mesh.castShadow=shadow;
  parent.add(mesh);return mesh;
}
function ball(parent,material,r,pos,scale=null){
  const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),material);
  mesh.position.set(...pos);if(scale)mesh.scale.set(...scale);
  parent.add(mesh);return mesh;
}
function pole(parent,mat,r,h,pos,segments=8){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.1,h,segments),mat);
  mesh.position.set(...pos);parent.add(mesh);return mesh;
}
function panelSign(parent,word,z=0){
  const canvas=document.createElement('canvas');canvas.width=384;canvas.height=100;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#4a4639';ctx.fillRect(0,0,384,100);
  ctx.strokeStyle='#c4ad7f';ctx.lineWidth=6;ctx.strokeRect(5,5,374,90);
  ctx.fillStyle='#f1dfbe';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='bold 35px Georgia,serif';ctx.fillText(word,192,52,352);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(1.62,.43),material);
  plane.position.set(0,1.96,z);parent.add(plane);
}
function makeStand(scene,{x,z,rotation=0,label='MANAV',goods='produce',canopy=0,level=0}){
  const group=new THREE.Group();
  const width=1.48;
  box(group,M.timber,[width,.11,.72],[0,.63,0]);
  for(const xx of [-.63,.63]){
    box(group,M.timber,[.075,.66,.09],[xx,.32,0]);
    pole(group,M.iron,.025,1.28,[xx,1.26,-.23]);
    box(group,M.iron,[.07,.09,.09],[xx,1.78,-.23]);
  }
  const canopyMaterial=canopy%2===0?M.awningA:M.awningB;
  const canopyRoof=box(group,canopyMaterial,[1.77,.045,1.08],[0,1.76,-.04]);
  canopyRoof.rotation.x=-.10;
  for(let i=0;i<9;i++){
    box(group,(i%2===0?M.awningA:M.awningB),[.196,.14,.023],[-.78+i*.196,1.67,.47]);
  }
  for(let col=0;col<5;col++){
    const crate=box(group,M.basket,[.22,.13,.33],[-.47+col*.23,.73,.015]);
    for(let n=0;n<3;n++){
      ball(group,goods==='flowers'?M.flowers:goods==='fish'?M.blue:[M.foliage,M.produce,M.orange][(col+canopy)%3],.065,
        [-.49+col*.23+n*.065,.84+(n%2)*.02,-.09+n*.09],[1,.75,1]);
    }
  }
  if(goods==='fish'){
    for(let i=0;i<5;i++){
      const fish=ball(group,M.blue,.085,[-.5+i*.22,.87,.26],[1.4,.55,.60]);
      fish.rotation.y=i*.37;
    }
  }
  const frontNote=new THREE.Mesh(new THREE.PlaneGeometry(1.16,.23),
    new THREE.MeshStandardMaterial({color:'#dad1ae',roughness:.99,side:THREE.DoubleSide}));
  frontNote.position.set(0,.56,.39);group.add(frontNote);
  // Shop sign is original period lettering, not a modern UI graphic.
  panelSign(group,label,-.26);
  group.position.set(x,level,z);group.rotation.y=rotation;
  scene.add(group);
  return group;
}
function makeHuman(scene,{x,z,role='buyer',index=0,facing=0,offsetY=0}){
  const group=new THREE.Group();
  const coat=outfits[index%outfits.length];
  const skirt=role==='flowerSeller'||role==='lady'||role==='passengerLady';
  box(group,coat,[skirt ? .27 : .26,.42,.18],[0,.62,0]);
  const face=new THREE.Mesh(new THREE.SphereGeometry(.116,9,7),M.skin);
  face.position.y=.99;group.add(face);
  box(group,M.fabric,[.14,.06,.18],[0,.86,.01]);
  if(skirt){
    const dress=new THREE.Mesh(new THREE.CylinderGeometry(.145,.245,.47,9),coat);
    dress.position.y=.31;group.add(dress);
  }
  const legs=[],arms=[];
  for(const side of [-1,1]){
    const leg=new THREE.Group();
    leg.position.set(side*.072,.44,0);
    box(leg,M.darkWood,[.075,.32,.1],[0,-.16,0]);
    box(leg,M.iron,[.115,.06,.175],[0,-.33,.045]);
    group.add(leg);legs.push(leg);
    const arm=new THREE.Group();
    arm.position.set(side*.17,.79,0);
    box(arm,coat,[.083,.32,.10],[0,-.16,0]);
    group.add(arm);arms.push(arm);
  }
  if(role==='porter'){
    box(group,M.timber,[.40,.30,.32],[0,.99,-.17]);
    box(group,M.iron,[.025,.30,.34],[0,.99,-.17]);
  }else if(role==='passenger'||role==='passengerLady'){
    box(group,M.basket,[.16,.23,.11],[.25,.32,.015]);
  }else if(role==='newspaper'){
    box(group,M.fabric,[.26,.28,.035],[.25,.49,.13]).rotation.z=-.16;
    box(group,M.iron,[.18,.015,.038],[.25,.61,.16]);
  }
  if(role==='child'){
    group.scale.setScalar(.78);
  }
  const brim=new THREE.Mesh(new THREE.CylinderGeometry(skirt?.17:.13,skirt?.17:.13,.026,10),M.hair);
  brim.position.y=1.085;group.add(brim);
  const crown=new THREE.Mesh(new THREE.CylinderGeometry(.087,.106,.11,10),M.hair);
  crown.position.y=1.142;group.add(crown);
  group.position.set(x,offsetY,z);group.rotation.y=facing;
  scene.add(group);
  return {group,legs,arms,x,z,role,index,phase:index*.95,isMoving:role==='passenger'||role==='porter'||role==='child',offsetY};
}
function makeParcelCart(scene,x,z,angle=0){
  const group=new THREE.Group();
  box(group,M.timber,[1.05,.21,1.74],[0,.65,0]);
  box(group,M.timber,[1.12,.42,.06],[0,.89,-.8]);
  for(const xx of [-.57,.57])for(const zz of [-.58,.62]){
    const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.085,12),M.iron);
    wheel.rotation.z=Math.PI/2;wheel.position.set(xx,.38,zz);group.add(wheel);
    pole(group,M.brass,.065,.11,[xx*1.04,.38,zz]);
  }
  for(let i=0;i<6;i++){
    const p=box(group,i%2?M.basket:M.timber,[.40,.24,.42],[-.24+i%2*.48,.88+Math.floor(i/2)*.26,-.50+Math.floor(i/2)*.45]);
    p.rotation.y=(i%2?-.12:.08);
  }
  box(group,M.timber,[.09,.07,1.15],[.39,.51,1.0]);
  box(group,M.timber,[.09,.07,1.15],[-.39,.51,1.0]);
  group.position.set(x,0,z);group.rotation.y=angle;scene.add(group);
}
function makeQuaysideProps(scene){
  const root=new THREE.Group();
  root.name='1923 quay human-scale equipment';
  for(const z of [-30,-27,-20,-12,4,8,23,28]){
    const x=24.55;
    for(const [i,radius] of [.13,.19].entries()) {
      const timber=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,.42+i*.05,10),M.timber);
      timber.rotation.z=Math.PI/2;timber.position.set(x-.13*i,.34,z-.44*i);
      root.add(timber);
    }
    const coil=new THREE.Mesh(new THREE.TorusGeometry(.18,.035,5,15),M.basket);
    coil.rotation.x=Math.PI/2;coil.position.set(x-.2,.20,z+.30);root.add(coil);
    for(let j=0;j<2;j++)box(root,M.timber,[.29,.22,.29],[x-.26+j*.37,.27,z-.80]);
  }
  // Public benches with visibly usable seating along the quay.
  for(const z of [-24.8,-6.4,7.2,24.8]){
    box(root,M.timber,[.96,.07,.30],[23.7,.54,z]);
    box(root,M.timber,[.96,.09,.07],[23.7,.75,z-.17]);
    for(const x of [23.35,24.05])box(root,M.iron,[.06,.44,.25],[x,.31,z]);
  }
  scene.add(root);
  return root;
}
function makeFlowers(scene,x,z){
  const root=new THREE.Group();
  for(let i=0;i<11;i++){
    const a=i*2.3999,dist=.18+Math.sqrt(i)*.12;
    const xx=Math.cos(a)*dist,zz=Math.sin(a)*dist;
    pole(root,M.foliage,.026,.22,[xx,.28,zz],5);
    ball(root,i%3?M.flowers:M.orange,.085,[xx,.43+(i%3)*.02,zz],[1.2,.8,1.1]);
  }
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(.37,.27,.3,12),M.basket);
  pot.position.y=.19;root.add(pot);
  root.position.set(x,0,z);scene.add(root);
}
export function createPeriodStreetLife({scene,properties=[],isMobile=false}){
  const people=[];
  const stalls=[];
  const props=makeQuaysideProps(scene);
  const marketStalls=[
    {x:-4.40,z:-17.3,label:'PAZAR',goods:'produce',canopy:0,rotation:Math.PI/2},
    {x:4.38,z:-14.0,label:'MEYVE',goods:'produce',canopy:1,rotation:-Math.PI/2},
    {x:-4.40,z:-4.7,label:'ÇİÇEK',goods:'flowers',canopy:2,rotation:Math.PI/2},
    {x:4.35,z:5.0,label:'BALIK',goods:'fish',canopy:3,rotation:-Math.PI/2},
    {x:-4.40,z:15.5,label:'SEBZE',goods:'produce',canopy:1,rotation:Math.PI/2}
  ];
  const display=marketStalls.slice(0,isMobile?3:5);
  for(const info of display) {
    stalls.push(makeStand(scene,info));
    const sellerX=info.x+(info.x>0?-.42:.42);
    people.push(makeHuman(scene,{x:sellerX,z:info.z+.38,role:info.goods==='flowers'?'flowerSeller':'seller',index:people.length,facing:info.rotation+.15}));
    people.push(makeHuman(scene,{x:info.x+(info.x>0?-.87:.87),z:info.z-1.05,role:people.length%2?'lady':'buyer',index:people.length+3,facing:info.rotation+Math.PI}));
  }
  // Fish market belongs on the pier promenade; the central street market alone
  // would leave the harbour looking deserted.
  stalls.push(makeStand(scene,{x:24.03,z:8.55,rotation:Math.PI/2,label:'BALIK',goods:'fish',canopy:2,level:.14}));
  people.push(makeHuman(scene,{x:23.32,z:8.90,role:'seller',index:people.length+9,offsetY:.15,facing:.15}));
  if(!isMobile) people.push(makeHuman(scene,{x:24.20,z:9.80,role:'passengerLady',index:people.length+7,offsetY:.15,facing:1.2}));
  // A merchant street is busy before dusk; stalls and crates face real pavements.
  const quayVignettes=[
    {x:24.34,z:-17.3,role:'passenger',facing:-Math.PI/2},
    {x:23.85,z:-16.4,role:'passengerLady',facing:-Math.PI/2},
    {x:24.35,z:-18.25,role:'porter',facing:.6},
    {x:24.22,z:15.8,role:'passenger',facing:-Math.PI/2},
    {x:23.65,z:17.1,role:'passengerLady',facing:-Math.PI/2},
    {x:24.43,z:18.5,role:'porter',facing:-.8},
    {x:24.41,z:-23.0,role:'newspaper',facing:.8},
    {x:24.15,z:24.45,role:'porter',facing:-.9},
    {x:24.22,z:28.3,role:'passenger',facing:-.9}
  ];
  for(const item of quayVignettes.slice(0,isMobile?5:9)){
    people.push(makeHuman(scene,{...item,index:people.length+3,offsetY:.15}));
  }
  const smallGroups=[
    [-2.9,-7.6,'child'],[-3.4,-8.1,'lady'],[2.8,-7.9,'buyer'],
    [3.1,12.6,'child'],[2.7,13.3,'passenger'],[-2.8,7.4,'buyer'],
    [-3.1,8.1,'lady'],[6.9,-23.3,'porter'],[-6.8,24.5,'passenger']
  ];
  for(const [x,z,role] of smallGroups.slice(0,isMobile?4:9)){
    people.push(makeHuman(scene,{x,z,role,index:people.length+2,facing:(safeHash(x*7+z)*2-1)*1.9}));
  }
  makeParcelCart(scene,19.0,-27.6,Math.PI*.35);
  makeFlowers(scene,21.95,19.8);
  makeFlowers(scene,-3.6,-3.9);

  // Newspaper posters by the piers, as opposed to a row of identical houses.
  const signs=[
    {id:63,text:'İSKELE KAHVESİ'},
    {id:64,text:'GAZETE · TÜTÜN'},
    {id:65,text:'DENİZ LEVAZIMATI'},
    {id:66,text:'RIHTIM AMBARI'}
  ];
  for(const item of signs) {
    const p=properties.find(property=>property.id===item.id);
    if(!p)continue;
    const group=new THREE.Group();
    panelSign(group,item.text,.0);
    // A freestanding waterfront sign; planar lettering faces the waterfront.
    group.position.set(24.45,0.14,p.z+.3);
    group.rotation.y=-Math.PI/2;
    scene.add(group);
  }
  let frames=0;
  function update({hour=12,elapsed=0,delta=0,weather={}}){
    const night=hour>=20||hour<6;
    const activeMarket=hour>=6&&hour<19;
    const quayOpen=hour>=6&&hour<22;
    const rain=!!weather.raining;
    for(let i=0;i<stalls.length;i++){
      const stall=stalls[i];
      const marketShopOpen=hour>=7&&hour<19;
      stall.visible=marketShopOpen;
    }
    for(const p of people) {
      let active=p.x>20?quayOpen:activeMarket;
      if(p.role==='porter')active=hour>=5&&hour<19;
      if(p.role==='child')active=hour>=8&&hour<18;
      if(p.role==='newspaper')active=hour>=6&&hour<20;
      if(p.role==='seller'||p.role==='flowerSeller')active=hour>=7&&hour<19;
      // A crowd has purpose. Rain reduces street standing but not dock workers.
      if(rain && p.index%4===0 && p.role!=='porter')active=false;
      p.group.visible=active;
      if(!active)continue;
      const t=elapsed*(p.isMoving ? .32 : .12)+p.phase;
      if(p.isMoving){
        p.group.position.x=p.x+Math.sin(t*.45)*.11;
        p.group.position.z=p.z+Math.cos(t*.7)*.24;
      }else{
        p.group.position.x=p.x+Math.sin(t*.3)*.018;
        p.group.position.z=p.z+Math.cos(t*.4)*.018;
      }
      p.group.rotation.y+=Math.sin(t)*delta*.018;
      for(let j=0;j<2;j++){
        p.legs[j].rotation.x=(j===0?1:-1)*Math.sin(t*3.0)*(p.isMoving ? .11 : .018);
        p.arms[j].rotation.x=(j===0?-1:1)*Math.sin(t*2.4)*.075;
      }
    }
    frames+=1;
  }
  return {update,get actorCount(){return people.length},get stallCount(){return stalls.length}};
}
