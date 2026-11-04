import * as THREE from 'three';

// Schematic 1923 Haliç harbour: the 1912 steel pontoon bridge, quay, piers,
// separate ferry approach corridors and original period ferry geometry.
// Scene positions are designed for Mahalle's fictional, compressed map scale.
const V = (x,y,z)=>new THREE.Vector3(x,y,z);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const materials={
  masonry: new THREE.MeshStandardMaterial({color:'#b6a996',roughness:.93}),
  masonryLight: new THREE.MeshStandardMaterial({color:'#d7c6ad',roughness:.91}),
  coping: new THREE.MeshStandardMaterial({color:'#817e74',roughness:.78}),
  bridgeIron: new THREE.MeshStandardMaterial({color:'#545c57',roughness:.67,metalness:.34}),
  brass: new THREE.MeshStandardMaterial({color:'#a89064',metalness:.37,roughness:.53}),
  timber: new THREE.MeshStandardMaterial({color:'#6f5743',roughness:.92}),
  tar: new THREE.MeshStandardMaterial({color:'#333e42',roughness:.72}),
  cream: new THREE.MeshStandardMaterial({color:'#e0d3bb',roughness:.83}),
  hull: new THREE.MeshStandardMaterial({color:'#323e43',roughness:.59,metalness:.18}),
  upper: new THREE.MeshStandardMaterial({color:'#efe6d3',roughness:.77}),
  glass: new THREE.MeshStandardMaterial({color:'#54747b',roughness:.42,metalness:.15}),
  burgundy: new THREE.MeshStandardMaterial({color:'#874947',roughness:.79}),
  seafoam: new THREE.MeshBasicMaterial({color:'#bed1cf',transparent:true,opacity:.25,side:THREE.DoubleSide,depthWrite:false}),
  lamp: new THREE.MeshStandardMaterial({color:'#fff1bc',emissive:'#ffd388',emissiveIntensity:.2,roughness:.6})
};
function block(parent,material,w,h,d,x,y,z,shadow=false){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
  mesh.position.set(x,y,z);mesh.receiveShadow=true;mesh.castShadow=shadow;
  parent.add(mesh);return mesh;
}
function cylinder(parent,mat,r,h,x,y,z,sides=10){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.1,h,sides),mat);
  m.position.set(x,y,z);parent.add(m);return m;
}
function walkway(parent, x,z, length,width, height, mat=materials.masonryLight){
  return block(parent,mat,length,height,width,x,height/2-.035,z);
}

function makePontoonBridge(scene,isMobile){
  const bridge=new THREE.Group();
  bridge.name='1912 Galata steel floating bridge (stylised)';
  // Shoreline meeting the bridge on the Pera side and Eminönü end.
  walkway(bridge,24.95,0,4.4,5.8,.24,materials.masonry);
  walkway(bridge,56.55,0,5.7,5.8,.25,materials.masonry);
  const length=30.6,cx=40.7;
  block(bridge,materials.bridgeIron,length,.21,3.95,cx,.17,0);
  block(bridge,materials.timber,length,.055,3.6,cx,.30,0);
  // Continuous steel stringers and parapet guard rails along the navigable channel.
  for(const z of [-1.85,1.85]){
    block(bridge,materials.bridgeIron,length,.20,.16,cx,.24,z);
    block(bridge,materials.bridgeIron,length,.075,.10,cx,.92,z);
    block(bridge,materials.brass,length,.055,.075,cx,1.02,z);
    for(let x=26.5;x<55;x+=isMobile?2.2:1.2) {
      block(bridge,materials.bridgeIron,.075,.62,.075,x,.60,z);
    }
  }
  // Distinct double-tram rails running along the bridge's axis.
  for(const z of [-.39,.39]){
    block(bridge,materials.bridgeIron,length,.035,.055,cx,.345,z);
  }
  for(let x=26.5;x<55;x+=.87){
    block(bridge,materials.tar,.11,.018,1.18,x,.319,0);
  }
  // Visible floating pontoons, not columns planted in deep water.
  for(let x=28.4;x<54;x+=3.05){
    const float=block(bridge,materials.bridgeIron,1.85,.40,4.4,x,-.25,0);
    float.castShadow=!isMobile;
    for(const z of [-2.1,2.1])block(bridge,materials.coping,1.85,.12,.2,x,-.045,z);
  }
  // A framed central passage reads as a boat opening in the old bridge system.
  for(const x of [39.4,42.2]){
    for(const z of [-1.65,1.65]){
      block(bridge,materials.bridgeIron,.22,.8,.18,x,.67,z);
      block(bridge,materials.masonryLight,.38,.17,.38,x,1.12,z);
    }
  }
  // Period lighting and crossing kiosks (toll kiosks existed until 1930).
  const lamps=[];
  for(const x of [27.4,33.5,48,54.2]){
    for(const z of [-2.1,2.1]){
      cylinder(bridge,materials.bridgeIron,.052,1.75,x,1.07,z);
      const lantern=new THREE.Mesh(new THREE.SphereGeometry(.135,8,6),materials.lamp.clone());
      lantern.position.set(x,2.01,z);bridge.add(lantern);lamps.push(lantern.material);
    }
  }
  for(const x of [25.7,55.8]){
    block(bridge,materials.masonryLight,.75,1.17,.85,x,.87,-3.05);
    block(bridge,materials.timber,.90,.12,1.02,x,1.54,-3.05);
    block(bridge,materials.glass,.19,.34,.045,x,.99,-2.60);
  }
  // A handful of 1920s pedestrians walk across with small, non-blocking animation.
  const pedestrians=[];
  const coatColors=['#665547','#43545a','#755e53','#6d725c'];
  for(let i=0;i<(isMobile?5:10);i++){
    const person=new THREE.Group();
    const coat=new THREE.MeshStandardMaterial({color:coatColors[i%coatColors.length],roughness:.95});
    block(person,coat,.15,.31,.12,0,.55,0);
    const face=new THREE.Mesh(new THREE.SphereGeometry(.079,7,5),materials.masonryLight);
    face.position.y=.78;person.add(face);
    cylinder(person,materials.tar,.075,.065,0,.88,0);
    const legs=[];
    for(let side of [-1,1]){
      const leg=block(person,materials.tar,.05,.27,.06,side*.044,.25,0);
      legs.push(leg);
    }
    person.position.set(26.1+i*2.6,.30,i%2?1.18:-1.18);
    bridge.add(person);pedestrians.push({person,legs,i});
  }
  scene.add(bridge);
  return {
    lamps,pedestrians,
    update({hour,elapsed}) {
      const dusk=hour>=18||hour<=6;
      for(const lamp of lamps)lamp.emissiveIntensity=dusk?1.15:.12;
      for(const item of pedestrians){
        const {person,legs,i}=item, direction=i%2?-1:1;
        person.position.x=25.9+((i*3.1+elapsed*.28*direction+140)%30.1+30.1)%30.1;
        person.rotation.y=direction>0?Math.PI:0;
        legs[0].rotation.x=Math.sin(elapsed*4+i)*.22;
        legs[1].rotation.x=-Math.sin(elapsed*4+i)*.22;
      }
    }
  };
}

function makeQuay(scene,isMobile){
  const harbor=new THREE.Group();
  harbor.name='Haliç quay and ferry piers';
  // A visible water-edge transition, matching the original near-bank promenade.
  block(harbor,materials.coping,.30,.45,72,25.58,-.14,0);
  for(const z of [-28,-17,-7,8,17,28]){
    // Rough masonry courses on the sea-facing retaining wall.
    block(harbor,materials.masonry,.25,.13,3.7,25.78,.11,z);
    for(const side of [-1,1]){
      const bollard=cylinder(harbor,materials.bridgeIron,.10,.40,25.45,.38,z+side*.86);
      cylinder(harbor,materials.brass,.13,.08,25.45,.61,z+side*.86);
    }
  }
  const pierLights=[];
  for(const z of [-17,16]){
    // This is a landing with its deck attached to land, not a slab stranded offshore.
    block(harbor,materials.masonry,3.9,.17,2.6,27.2,.16,z);
    block(harbor,materials.timber,2.9,.045,2.38,27.5,.29,z);
    for(const x of [26.4,28.4]){
      block(harbor,materials.bridgeIron,.16,.53,.13,x,-.14,z-1.08);
      block(harbor,materials.bridgeIron,.16,.53,.13,x,-.14,z+1.08);
    }
    // Ticket booth and waiting pavilion, distinct from the larger steamers.
    block(harbor,materials.cream,.93,.95,.88,26.35,.80,z-.20);
    block(harbor,materials.timber,1.15,.12,1.1,26.35,1.35,z-.20);
    block(harbor,materials.glass,.06,.37,.41,26.85,.85,z-.21);
    for(const zz of [z-1.06,z+1.06]){
      cylinder(harbor,materials.bridgeIron,.045,1.5,28.85,.99,zz);
      const lamp=new THREE.Mesh(new THREE.SphereGeometry(.13,8,7),materials.lamp.clone());
      lamp.position.set(28.85,1.76,zz);harbor.add(lamp);pierLights.push(lamp.material);
    }
    for(let i=0;i<3;i++)block(harbor,materials.timber,.36,.27,.34,26.0+.33*i,.27,z+1.44);
  }
  // Coastline stairs and stone slab divisions.
  const stairZ=-6.7;
  for(let step=0;step<5;step++)block(harbor,materials.masonryLight,.52,.085,1.3,25.3+step*.24,.12-step*.038,stairZ);
  for(let z=-32;z<34;z+=3)block(harbor,materials.coping,.11,.022,2.5,25.31,.23,z);
  // The historical dry-cleaner's waterfront building (x=27.2,z=22.5)
  // sits on a connected masonry extension, not on the animated water plane.
  block(harbor,materials.masonry,4.8,.28,7.4,27.5,-.012,22.5);
  block(harbor,materials.masonryLight,4.85,.09,7.5,27.5,.14,22.5);
  block(harbor,materials.coping,.18,.22,7.5,29.92,.04,22.5);
  for(const z of [19.9,22.5,25.0]) {
    cylinder(harbor,materials.bridgeIron,.09,.48,29.75,.35,z);
  }
  // Far-bank promenade closes the water basin and gives the Galata span a destination.
  block(harbor,materials.masonry,9.3,.32,74,60.38,-.06,0);
  block(harbor,materials.coping,.25,.52,74,55.66,-.13,0);
  for(let z=-29;z<34;z+=6){
    const h=1.4+((Math.abs(z)*7)%4)*.37;
    block(harbor,materials.cream,1.6,h,2.7,61.5,h/2+.12,z);
    block(harbor,materials.masonryLight,1.7,.13,2.8,61.5,h+.15,z);
  }
  // Stone pylons and lines visually connect the pier and bank.
  scene.add(harbor);
  return {group:harbor,pierLights, update(hour){for(const lamp of pierLights)lamp.emissiveIntensity=hour>=18||hour<=6?1.2:.12}};
}

function makeSteamer(scene,variant=0){
  const boat=new THREE.Group();
  boat.name='Early 20th-century coal steamer '+variant;
  const hullShape=new THREE.Shape();
  hullShape.moveTo(-.9,-2.08);hullShape.lineTo(.9,-2.08);
  hullShape.lineTo(1.05,-1.45);hullShape.lineTo(1.05,1.35);
  hullShape.quadraticCurveTo(.82,2.15,0,2.40);
  hullShape.quadraticCurveTo(-.82,2.15,-1.05,1.35);
  hullShape.lineTo(-1.05,-1.45);hullShape.closePath();
  // Shape lives in xy; orient top surface into xz.
  const shapeGeo=new THREE.ExtrudeGeometry(hullShape,{steps:1,depth:.42,bevelEnabled:true,bevelSize:.075,bevelThickness:.065,bevelSegments:1});
  const hull=new THREE.Mesh(shapeGeo,materials.hull);
  hull.rotation.x=-Math.PI/2;
  hull.position.y=.24;
  hull.castShadow=true;boat.add(hull);
  block(boat,materials.timber,1.65,.11,3.7,0,.38,-.06);
  // Two passenger decks, pilothouse, rails and windows.
  block(boat,materials.upper,1.34,.74,2.67,0,.87,-.28);
  block(boat,materials.cream,1.56,.12,3.15,0,1.28,-.28);
  block(boat,materials.upper,.90,.47,.66,0,1.56,.71);
  block(boat,materials.timber,.98,.10,.79,0,1.85,.71);
  for(const x of [-.72,.72]){
    for(let z of [-1.32,-.76,-.2,.35]){
      block(boat,materials.glass,.025,.29,.32,x,1.00,z);
      block(boat,materials.timber,.038,.34,.04,x*.99,1.00,z+.18);
    }
    for(let z=-1.6;z<1.7;z+=.55)block(boat,materials.bridgeIron,.034,.30,.04,x*1.21,1.53,z);
    block(boat,materials.bridgeIron,.035,.055,3.2,x*1.21,1.71,-.05);
  }
  cylinder(boat,materials.burgundy,.20,.92,.0,1.85,-.37,12);
  cylinder(boat,materials.tar,.23,.11,0,2.33,-.37,12);
  const puffMaterial=new THREE.MeshBasicMaterial({color:'#e4ddd0',transparent:true,opacity:.20,depthWrite:false});
  const puffs=[];
  for(let i=0;i<3;i++){
    const puff=new THREE.Mesh(new THREE.SphereGeometry(.20,7,5),puffMaterial.clone());
    puff.position.set(0,2.43+i*.28,-.36);boat.add(puff);puffs.push(puff);
  }
  for(const z of [-1.63,1.37]){
    const halo=new THREE.Mesh(new THREE.SphereGeometry(.10,7,6),materials.lamp.clone());
    halo.position.set(0,1.55,z);boat.add(halo);
  }
  const wake=new THREE.Group();
  const transparent=materials.seafoam.clone();
  const wedge=new THREE.Mesh(new THREE.PlaneGeometry(2.4,4.8),transparent);
  wedge.rotation.x=-Math.PI/2;wedge.position.z=-3.4;
  wake.add(wedge);
  scene.add(wake);scene.add(boat);
  return {boat,wake,puffs,transparent,variant};
}

export function createHarborScene({scene, oldFerry, isMobile=false, ferryStateRef}) {
  // Old boat remains mounted as rollback geometry, but is not displayed alongside the new ferry.
  oldFerry.visible=false;
  const bridge=makePontoonBridge(scene,isMobile);
  const coast=makeQuay(scene,isMobile);
  const steamer=makeSteamer(scene);
  const second=makeSteamer(scene,1);
  // Route remains safely north/south of the bridge navigation opening (z=0).
  const routes=[
    [V(30.8,.08,-17.2),V(32.1,.08,-20),V(34.9,.08,-24.6),V(38,.08,-29),V(40.4,.08,-30),V(35.2,.08,-25.3),V(31.1,.08,-20),V(30.8,.08,-17.2)],
    [V(30.8,.08,16.6),V(32.3,.08,20),V(35.6,.08,26),V(40.1,.08,29),V(41,.08,27),V(35.1,.08,22.2),V(31.1,.08,18.1),V(30.8,.08,16.6)]
  ];
  const curves=routes.map(points=>new THREE.CatmullRomCurve3(points,true,'catmullrom',.25));
  const upgradeCargo=new THREE.Group();
  // Loose cargo is only shown after the operator purchases quay freight handling.
  for(let i=0;i<7;i++) {
    const crate=block(upgradeCargo,materials.timber,.43,.31,.40,26.2+i%3*.47,.38,14.45+Math.floor(i/3)*.44);
    crate.rotation.y=(i%3)*.12;
    block(upgradeCargo,materials.brass,.05,.32,.043,crate.position.x,.38,crate.position.z+.22);
  }
  scene.add(upgradeCargo);
  const ticketOffice=new THREE.Group();
  block(ticketOffice,materials.burgundy,.86,.28,.075,26.38,1.27,-16.43);
  block(ticketOffice,materials.brass,.94,.04,.09,26.38,1.45,-16.43);
  scene.add(ticketOffice);
  const dayMarker=new THREE.Group();
  for(const point of [-.4,.4])block(dayMarker,materials.brass,.06,.17,.05,point,.34,0);
  dayMarker.position.set(29.65,.1,-17.2);scene.add(dayMarker);

  function animateSteamer(ferry,routeIndex,elapsed,phase,hour,active,owned) {
    ferry.boat.visible=active;
    ferry.wake.visible=active && hour>=6 && hour<=22;
    if(!active)return;
    const cycle=45, operating=hour>=6 && hour<=21;
    const progress=operating?((elapsed+phase)%cycle)/cycle:0;
    // Pause alongside quay before embarking again.
    const t=progress<.15?0:progress>.96?0:clamp((progress-.15)/.81,0,1);
    const curve=curves[routeIndex];
    const point=curve.getPoint(t);
    const tangent=curve.getTangent(t);
    ferry.boat.position.copy(point);
    ferry.boat.position.y=.04+Math.sin(elapsed*.9+phase)*.018;
    ferry.boat.rotation.y=Math.atan2(tangent.x,tangent.z);
    ferry.boat.rotation.z=Math.sin(elapsed*.75+phase)*.018;
    ferry.wake.position.copy(point);
    ferry.wake.position.y=-.008;
    ferry.wake.rotation.y=ferry.boat.rotation.y;
    ferry.transparent.opacity=progress<.16||progress>.95?.02:.18+Math.sin(elapsed*2)*.035;
    for(let i=0;i<ferry.puffs.length;i++){
      const puff=ferry.puffs[i],progress=((elapsed*.28+phase+i*.3)%1+1)%1;
      puff.position.y=2.45+progress*.85;
      puff.position.x=Math.sin(elapsed*.25+i)*progress*.2;
      puff.scale.setScalar(.45+progress*1.1);
      puff.material.opacity=.18*(1-progress);
    }
  }

  function update({hour=12,elapsed=0,day=1,month=1}) {
    bridge.update({hour,elapsed});
    coast.update(hour);
    const business=ferryStateRef?.current||{};
    const upgrade=business.upgrades||{};
    // The transport company is a visible public service before purchase;
    // ownership changes livery and adds capacity instead of conjuring ferry transport.
    dayMarker.visible=business.owned===true;
    ticketOffice.visible=business.owned===true && !!upgrade.ticketOffice;
    upgradeCargo.visible=business.owned===true && !!upgrade.cargoHold;
    animateSteamer(steamer,0,elapsed,0,hour,true,business.owned);
    animateSteamer(second,1,elapsed,21,hour,business.owned===true && !!upgrade.secondFerry,!!business.owned);
    steamer.boat.scale.setScalar(1);
    steamer.boat.traverse(obj=>{
      if(obj.isMesh && obj.material===materials.burgundy)obj.material.emissiveIntensity=business.owned?.18:0;
    });
    if(upgrade.nightService && (hour>=19||hour<6)){
      for(const ferry of [steamer,second])ferry.boat.traverse(obj=>{
        if(obj.isMesh && obj.material?.emissive && obj.material!==materials.burgundy)obj.material.emissiveIntensity=.9;
      });
    }
  }
  return {update, bridge, coast, steamer, second, dispose(){oldFerry.visible=true;}};
}
