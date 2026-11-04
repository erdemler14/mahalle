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
export function createLivingResidents({scene,properties,isMobile=false}){
  const roster=getCityPopulation(properties);
  const activePeople=roster.slice(0,isMobile?34:76).map(person=>{
    const rig=makePerson(person.id,person.role);
    scene.add(rig.group);
    return {...person,...rig,path:[],intent:null};
  });
  let currentKey='',changeElapsed=0,frame=0;
  const locations=new Map(properties.map(p=>[p.id,p]));
  function update({clock,elapsed,delta,weather={}}){
    const dateKey=[clock.year,clock.month,clock.day,clock.hour].join('/');
    if(dateKey!==currentKey){
      currentKey=dateKey;
      changeElapsed=elapsed;
      for(const npc of activePeople){
        const intent=visitIntent(npc,clock,properties);
        npc.intent=intent;
        npc.path=intent?walkWaypoints(intent.from,intent.to):[];
      }
    }
    const progress=Math.min(1,Math.max(0,(elapsed-changeElapsed)/4.1));
    for(const npc of activePeople){
      const intent=npc.intent;
      if(!intent){npc.group.visible=false;continue;}
      const purpose=intent.purpose;
      const evening=clock.hour>=23||clock.hour<6;
      const indoors=(purpose==='home'||purpose==='work');
      const shopper=purpose==='shop';
      const disappear=indoors?progress>.18:shopper?progress>.91:progress>.97;
      const raining=!!weather.raining;
      npc.group.visible=(!evening||npc.role==='porter')&&!disappear &&
        !(raining&&npc.index%5===0);
      if(!npc.group.visible)continue;
      // Residents never wander randomly: each route follows sidewalks and
      // the next destination is their real shop, home, workplace or quay.
      const journey=shopper||purpose==='commute';
      const location=journey
        ?interpolateWaypoints(npc.path,Math.min(.999,progress*npc.journeySpeed))
        :interpolateWaypoints(npc.path,0);
      npc.group.position.set(location.x,.018+Math.abs(Math.sin(elapsed*9+npc.index))*.012,location.z);
      npc.group.rotation.y=journey?location.angle:Math.sin(npc.index)*.65;
      const walk=journey?.26:.025;
      npc.legs[0].rotation.x=Math.sin(elapsed*8.2+npc.index)*walk;
      npc.legs[1].rotation.x=-Math.sin(elapsed*8.2+npc.index)*walk;
      npc.arms[0].rotation.x=-Math.sin(elapsed*8.2+npc.index)*walk*.75;
      npc.arms[1].rotation.x=Math.sin(elapsed*8.2+npc.index)*walk*.75;
    }
    frame++;
  }
  return {update,get residents(){return activePeople.length},get roster(){return roster}};
}
