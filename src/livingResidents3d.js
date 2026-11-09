import * as THREE from 'three';
import {
  getCityPopulation,visitIntent,walkWaypoints,interpolateWaypoints
} from './cityLifeEngine.js';

// Purposeful residents are a separate visual layer from ornamental crowds.
// Every person has a stable home, workplace and shopping preference.
// The same visitIntent() drives the actual economic footfall calculation.
const coats=['#3a4845','#66584a','#52636b','#8a695c','#484655','#796e58','#56715f','#9b8063']
  .map(color=>new THREE.MeshStandardMaterial({color,roughness:.98}));
const fabric=new THREE.MeshStandardMaterial({color:'#e0d1b4',roughness:1});
const hair=new THREE.MeshStandardMaterial({color:'#3f2e28',roughness:.95});
const leather=new THREE.MeshStandardMaterial({color:'#3a332e',roughness:.99});
const skin=[
  new THREE.MeshStandardMaterial({color:'#c98f72',roughness:1}),
  new THREE.MeshStandardMaterial({color:'#a5755b',roughness:1}),
  new THREE.MeshStandardMaterial({color:'#ddb090',roughness:1})
];
const carton=new THREE.MeshStandardMaterial({color:'#7b6349',roughness:.95});
function block(parent,mat,size,pos){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),mat);
  mesh.position.set(...pos);mesh.castShadow=false;
  parent.add(mesh);return mesh;
}
function makePerson(index,role){
  const group=new THREE.Group();
  const outfit=coats[index%coats.length];
  const woman=index%5===0;
  const child=role==='student';
  block(group,outfit,[.24,.38,.17],[0,.60,0]);
  block(group,fabric,[.14,.062,.182],[0,.84,.02]);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.11,9,8),skin[index%skin.length]);
  head.position.set(0,.98,0);group.add(head);
  const legs=[],arms=[];
  for(const side of [-1,1]){
    const leg=new THREE.Group();leg.position.set(side*.065,.43,0);
    block(leg,leather,[.082,.34,.104],[0,-.15,.005]);
    block(leg,leather,[.105,.06,.16],[0,-.32,.032]);
    group.add(leg);legs.push(leg);
    const arm=new THREE.Group();arm.position.set(side*.155,.80,0);
    block(arm,outfit,[.082,.32,.09],[0,-.16,0]);
    group.add(arm);arms.push(arm);
  }
  if(woman) {
    const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.14,.205,.4,9),outfit);
    skirt.position.y=.3;group.add(skirt);
  }
  const hat=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.028,12),hair);
  hat.position.y=1.095;group.add(hat);
  const crown=new THREE.Mesh(new THREE.CylinderGeometry(.09,.112,.13,12),hair);
  crown.position.y=1.16;group.add(crown);
  if(role==='porter'){
    block(group,carton,[.35,.31,.22],[0,.98,-.18]);
    block(group,leather,[.031,.29,.24],[0,.98,-.19]);
  }else if(index%3===0){
    const basket=block(group,carton,[.15,.19,.10],[.24,.35,-.015]);
    basket.rotation.y=.2;
  }
  group.scale.setScalar(child?.75:1);
  return {group,legs,arms,index,role};
}
// Walking is measured in world units per real second, NOT a percentage of the
// four-second game hour. This prevents characters from racing across the map.
export const WALK_SPEED = 0.62;
export const MAX_RENDERED_RESIDENTS = { mobile: 16, desktop: 36 };
export function stepResident(npc,seconds){
  const path=npc.path || [];
  if(path.length<2) return false;
  let available=Math.min(.12,Math.max(0,Number(seconds)||0))*WALK_SPEED*npc.journeySpeed;
  while(available>0&&npc.nextPoint<path.length){
    const end=path[npc.nextPoint];
    const x=end.x-npc.group.position.x,z=end.z-npc.group.position.z;
    const dist=Math.hypot(x,z);
    if(dist<.001){npc.nextPoint++;continue;}
    const step=Math.min(available,dist);
    npc.group.position.x+=x/dist*step;
    npc.group.position.z+=z/dist*step;
    // Smooth facing avoids an instant rotation at every corner.
    const target=Math.atan2(x,z);
    const difference=Math.atan2(Math.sin(target-npc.group.rotation.y),Math.cos(target-npc.group.rotation.y));
    npc.group.rotation.y+=difference*Math.min(1,seconds*5);
    available-=step;
    if(step>=dist-.001)npc.nextPoint++;
  }
  return npc.nextPoint<path.length;
}
// Named residents use the same low-poly rig and the same street movement as the city's other people.
const HISTORIC_PEOPLE=[
  {name:'Yahya Kemal Beyatlı',homeId:70,visitId:71,dialogue:'Beyoğlu’nda bir pastane masası, bazen uzun bir şiirin başlangıcıdır.'},
  {name:'Ahmet Haşim',homeId:71,visitId:70,dialogue:'Akşam ışıkları bu sokağı bambaşka gösteriyor.'},
  {name:'İbrahim Çallı',homeId:75,visitId:70,dialogue:'Bu şehrin her köşesi yeni bir resim olabilir.'},
  {name:'Muhsin Ertuğrul',homeId:72,visitId:74,dialogue:'Elhamra’da bu akşam yeni bir gösteri var.'},
  {name:'Ali Bey',homeId:77,visitId:75,dialogue:'Tramvayla pasaj arasında her gün gidip geliyorum.'},
  {name:'Ayşe Hanım',homeId:71,visitId:75,dialogue:'Pastanenin önünde bugün çok kalabalık vardı.'},
  {name:'Reşat Nuri Güntekin',homeId:78,visitId:70,dialogue:'Bir şehrin hikâyesi, sokaklarında yaşayan insanlarla yazılır.'},
  {name:'Orhan Seyfi Orhon',homeId:79,visitId:71,dialogue:'Bir şiir bazen bir pastane masasındaki sohbetten doğar.'},
  {name:'Ruşen Eşref Ünaydın',homeId:78,visitId:72,dialogue:'Bugünkü gazete için Pera’dan birkaç satır not almalıyım.'},
  {name:'Mehmet Âkif Ersoy',homeId:74,visitId:78,dialogue:'Şehrin sesini dinlemek, insanı memleketin kendisine yaklaştırır.'}
];
export function createLivingResidents({scene,properties,isMobile=false}){
  const roster=getCityPopulation(properties);
  // Keep the large simulated population for the economy but draw only a
  // lightweight crowd. Old 76/34 detailed rigs were expensive on phones.
  const activeLimit=Math.max(0,(isMobile?MAX_RENDERED_RESIDENTS.mobile:MAX_RENDERED_RESIDENTS.desktop)-HISTORIC_PEOPLE.length);
  const activePeople=roster.slice(0,activeLimit).map(person=>{
    const rig=makePerson(person.id,person.role);
    const home=properties.find(p=>p.id===person.homeId);
    const homeX=home?.x||0, homeZ=home?.z||0;
    rig.group.position.set(homeX,0,homeZ);
    scene.add(rig.group);
    return {...person,...rig,path:[],nextPoint:0,intent:null};
  });
  const historicResidents = HISTORIC_PEOPLE.map((person,i)=>{
    const rig=makePerson(i+112,'artist');
    const home=properties.find(p=>p.id===person.homeId);
    rig.group.position.set((home?.x||0)+(i%2?.8:-.8),0,(home?.z||0)+1.6);
    rig.group.userData.historicPerson=i;
    rig.group.name=person.name;
    scene.add(rig.group);
    return {...person,...rig,index:112+i,path:[],nextPoint:0,journeySpeed:.65,goingHome:false};
  });
  let currentKey='',lastElapsed=null,frame=0;
  function update({clock,elapsed,weather={}}){
    const dateKey=[clock.year,clock.month,clock.day,clock.hour].join('/');
    if(dateKey!==currentKey){
      currentKey=dateKey;
      for(const npc of historicResidents){
        const target=properties.find(p=>p.id===(npc.goingHome?npc.homeId:npc.visitId));
        npc.goingHome=!npc.goingHome;
        if(target){
          const here={x:npc.group.position.x,z:npc.group.position.z};
          const destination={x:target.x+(npc.index%2?.8:-.8),z:target.z+1.6};
          npc.path=[here,...walkWaypoints(here,destination).slice(1)];
          if(npc.path.length<2)npc.path=[here,destination];
          npc.nextPoint=1;
        }
      }
      for(const npc of activePeople){
        const intent=visitIntent(npc,clock,properties);
        npc.intent=intent;
        if(!intent)continue;
        const destination=walkWaypoints(intent.from,intent.to);
        const here={x:npc.group.position.x,z:npc.group.position.z};
        const upcoming=destination.slice(1);
        // We retain the NPC's actual previous position. Hour changes no longer
        // snap them back to their house, workplace or the start of a route.
        npc.path=[here,...upcoming];
        npc.nextPoint=1;
      }
    }
    const seconds=lastElapsed===null?0:Math.min(.12,Math.max(0,elapsed-lastElapsed));
    lastElapsed=elapsed;
    frame++;
    // 30 fps animation for residents, keeping the rest of the Three.js world
    // at its normal update rate. Time is accumulated from elapsed, not frames.
    if(frame%2===1)return;
    for(const npc of historicResidents){
      const moving=stepResident(npc,seconds*2);
      const stride=elapsed*4.5+npc.index;
      const pace=moving?1:.08;
      npc.group.position.y=.018+Math.abs(Math.sin(stride))*.008*pace;
      npc.legs[0].rotation.x=Math.sin(stride)*.17*pace;
      npc.legs[1].rotation.x=-Math.sin(stride)*.17*pace;
      npc.arms[0].rotation.x=-Math.sin(stride)*.13*pace;
      npc.arms[1].rotation.x=Math.sin(stride)*.13*pace;
      npc.group.visible=clock.hour>=6&&clock.hour<23;
    }
    for(const npc of activePeople){
      const intent=npc.intent;
      if(!intent){npc.group.visible=false;continue;}
      const evening=clock.hour>=23||clock.hour<6;
      const moving=stepResident(npc,seconds*2);
      const raining=!!weather.raining;
      npc.group.visible=(!evening||npc.role==='porter')&&!(raining&&npc.index%5===0);
      if(!npc.group.visible)continue;
      const pace=moving?1:0.15;
      const stride=elapsed*5.3+npc.index;
      npc.group.position.y=.018+Math.abs(Math.sin(stride))*.008*pace;
      npc.legs[0].rotation.x=Math.sin(stride)*.17*pace;
      npc.legs[1].rotation.x=-Math.sin(stride)*.17*pace;
      npc.arms[0].rotation.x=-Math.sin(stride)*.13*pace;
      npc.arms[1].rotation.x=Math.sin(stride)*.13*pace;
    }
  }
  function pick(raycaster){
    const hits=raycaster.intersectObjects(historicResidents.map(n=>n.group),true);
    for(const hit of hits){
      let root=hit.object;
      while(root && root.userData.historicPerson==null)root=root.parent;
      if(root && hit.distance<24) {
        const person=HISTORIC_PEOPLE[root.userData.historicPerson];
        return person ? {name:person.name,dialogue:person.dialogue} : null;
      }
    }
    return null;
  }
  return {update,pick,get residents(){return activePeople.length+historicResidents.length},get roster(){return roster}};
}
