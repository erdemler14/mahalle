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
function makePerson(index,role,gender='male',custom={}){
  const group=new THREE.Group();
  const outfit=custom.coat ? new THREE.MeshStandardMaterial({color:custom.coat,roughness:.98}) : coats[index%coats.length];
  const woman=gender==='female';
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
  {id:'yahya-kemal',gender:'male',name:'Yahya Kemal Beyatlı',bio:'Şair ve yazar. 1920’lerde İstanbul ve Pera’nın edebiyat çevrelerinde yer alır.',homeId:70,visitId:71,dialogue:'Beyoğlu’nda bir pastane masası, bazen uzun bir şiirin başlangıcıdır.',hangouts:['literary','coffee','restaurant'],visitHours:[11,14,20],historicalBasis:'Kahvehane ve edebiyat sohbetleriyle ilişkilendirilen çevrelerden esinlenen, Pera içindeki kurmaca rota.'},
  {id:'ahmet-hasim',gender:'male',name:'Ahmet Haşim',bio:'Şair ve öğretmen; Fecr-i Âti topluluğunun önemli isimlerinden.',homeId:71,visitId:70,dialogue:'Akşam ışıkları bu sokağı bambaşka gösteriyor.',hangouts:['coffee','quiet','literary'],visitHours:[10,15,18],historicalBasis:'Kahvehanelere düşkünlüğü ve Mihran’ın Kahvesi çevresindeki anıları belgelenmiştir; Pera rotası oyun uyarlamasıdır.'},
  {id:'ibrahim-calli',gender:'male',name:'İbrahim Çallı',bio:"Ressam; Türk resminde izlenimci yaklaşımın önde gelen temsilcilerindendir. 1882’de doğdu, Sanâyi-i Nefîse’de eğitim gördü.",homeId:75,visitId:70,dialogue:'Bu şehrin her köşesi yeni bir resim olabilir.',hangouts:['art','coffee','book'],visitHours:[10,14,17]},
  {id:'muhsin-ertugrul',gender:'male',name:'Muhsin Ertuğrul',bio:"Tiyatro ve sinema yönetmeni, oyuncu. Türkiye’de çağdaş tiyatro ve sinemanın kurumsallaşmasında öncü rol oynadı.",homeId:72,visitId:74,dialogue:'Elhamra’da bu akşam yeni bir gösteri var.',hangouts:['cinema','theatre','cafe'],visitHours:[13,18,21]},
  {id:'ali-bey',gender:'male',name:'Ali Bey',bio:"Tramvay işletmesinde çalışan, kurmaca bir Pera sakini; dönemin şehir ulaşımını temsil eder.",homeId:77,visitId:75,dialogue:'Tramvayla pasaj arasında her gün gidip geliyorum.',hangouts:['coffee','market','restaurant'],visitHours:[8,13,19]},
  {id:'ayse-hanim',gender:'female',name:'Ayşe Hanım',bio:"Pera’da yaşayan kurmaca bir pastane müdavimi; gündelik şehir hayatını temsil eder.",homeId:71,visitId:75,dialogue:'Pastanenin önünde bugün çok kalabalık vardı.',hangouts:['pastry','market','cinema'],visitHours:[10,15,19]},
  {id:'resat-nuri',gender:'male',name:'Reşat Nuri Güntekin',bio:"Romancı, öykücü ve oyun yazarı. Çalıkuşu başta olmak üzere eserleriyle Cumhuriyet dönemi edebiyatının önemli isimlerindendir.",homeId:78,visitId:70,dialogue:'Bir şehrin hikâyesi, sokaklarında yaşayan insanlarla yazılır.',hangouts:['literary','coffee','book','restaurant'],visitHours:[11,15,20]},
  {id:'orhan-seyfi',gender:'male',name:'Orhan Seyfi Orhon',bio:"Şair, gazeteci ve yazar; Beş Hececiler topluluğunun üyelerindendir.",homeId:79,visitId:71,dialogue:'Bir şiir bazen bir pastane masasındaki sohbetten doğar.',hangouts:['literary','pastry','coffee','gazino'],visitHours:[11,16,20]},
  {id:'rusen-esref',gender:'male',name:'Ruşen Eşref Ünaydın',bio:"Yazar, gazeteci ve diplomat; mülakat türündeki eserleriyle tanınır.",homeId:78,visitId:72,dialogue:'Bugünkü gazete için Pera’dan birkaç satır not almalıyım.',hangouts:['press','coffee','literary','restaurant'],visitHours:[9,13,18]},
  {id:'mehmet-akif',gender:'male',name:'Mehmet Âkif Ersoy',bio:"Şair ve düşünür; İstiklâl Marşı’nın yazarıdır. Safahat adlı eseriyle tanınır.",homeId:74,visitId:78,dialogue:'Şehrin sesini dinlemek, insanı memleketin kendisine yaklaştırır.',hangouts:['quiet','coffee','book','restaurant'],visitHours:[10,14,18]},
  {id:'peyami-safa',gender:'male',name:'Peyami Safa',bio:"Romancı ve gazeteci; psikolojik romanları ve fikir yazılarıyla tanınır.",homeId:78,visitId:79,dialogue:'Pera’nın kalabalığında insan ruhunu gözlemlemek mümkün.',hangouts:['press','coffee','plak','cinema'],visitHours:[11,16,20]},
  {id:'cenap-sahabettin',gender:'male',name:'Cenap Şahabettin',bio:"Şair ve yazar; Servet-i Fünûn edebiyatının önde gelen isimlerindendir.",homeId:70,visitId:76,dialogue:'Güzel bir akşam, iyi bir sohbetle tamamlanır.',hangouts:['literary','restaurant','gazino','coffee'],visitHours:[12,17,21]},
  {id:'suleyman-nazif',gender:'male',name:'Süleyman Nazif',bio:"Şair, yazar ve gazeteci; güçlü hitabeti ve millî edebiyat çevresindeki yazılarıyla tanınır.",homeId:74,visitId:78,dialogue:'Şehrin hafızası, sokaklarında ve gazetelerinde yaşar.',hangouts:['press','literary','coffee','restaurant'],visitHours:[9,14,19]},
  {id:'huseyin-rahmi',gender:'male',name:'Hüseyin Rahmi Gürpınar',bio:"Romancı; İstanbul’un gündelik hayatını, mahallelerini ve toplumsal tiplerini mizahla anlattı.",homeId:75,visitId:70,dialogue:'İstanbul insanını seyretmek, başlı başına bir romandır.',hangouts:['meyhane','coffee','restaurant','pastry'],visitHours:[12,17,21]},
  {id:'abdulhak-sinasi',gender:'male',name:'Abdülhak Şinasi Hisar',bio:"Yazar; İstanbul’un geçmişini, Boğaziçi kültürünü ve hatıralarını anlattığı eserleriyle tanınır.",homeId:74,visitId:71,dialogue:'Eski İstanbul’un zarafeti küçük ayrıntılarda saklıdır.',hangouts:['literary','coffee','gazino','restaurant'],visitHours:[11,16,20]}
];

const venueKeywords={
  literary:/pastane|kahve|kitabevi|kitap|lokanta|gazete/i,
  coffee:/kahvehane|kıraathane|kahve|café|cafe|pastane/i,
  quiet:/kahvehane|kıraathane|kitabevi|kitap|pastane/i,
  pastry:/pastane|fırın|firin|şekerleme/i,
  cinema:/sinem|elhamra|tiyatro/i,
  theatre:/tiyatro|sinem|elhamra|gazino/i,
  art:/kitabevi|matbaa|pasaj|pastane|galeri/i,
  book:/kitabevi|kitap|matbaa|gazete/i,
  press:/matbaa|gazete|kitabevi/i,
  restaurant:/lokanta|meyhane|restoran|şarküteri/i,
  meyhane:/meyhane|lokanta/i,
  gazino:/gazino|maxim|musiki/i,
  plak:/plak|gramofon|gazino/i,
  market:/pasaj|çiçek|cicek|dükkân|dukkan|mağaza|magaza/i
};
function historicVenueFor(person,properties,clock){
  const hour=Number(clock.hour)||0;
  const tags=person.hangouts||['coffee','literary'];
  const candidates=properties.filter(p=>p.id!==person.homeId&&p.type!=='Konut'&&p.type!=='Depo'&&
    (p.opens==null||Number(clock.year)>=p.opens) &&
    (p.type==='İşletme'||p.type==='Ticaret'||p.type==='Atölye'));
  const scored=candidates.map(p=>{
    const name=String(p.name||'')+' '+String(p.style||'');
    let score=0;
    tags.forEach((tag,index)=>{if(venueKeywords[tag]?.test(name))score+=6-index*.45;});
    if(hour<11&&/pastane|kahve|kıraathane|kitabevi/i.test(name))score+=2;
    if(hour>=18&&/meyhane|gazino|lokanta|sinem|tiyatro/i.test(name))score+=3;
    if(hour>=22&&!/gazino|meyhane/i.test(name))score-=4;
    const seed=Math.abs(Math.sin((person.index+1)*71.17+(p.id||0)*19.31+(clock.day||1)*7.13+(clock.hour||0)*3.71));
    return {p,score:score+seed*2.4,seed};
  }).filter(x=>x.score>1.5).sort((a,b)=>b.score-a.score);
  if(!scored.length)return properties.find(p=>p.id===person.visitId)||properties.find(p=>p.id===person.homeId);
  // Choose among several good fits, not a single fixed venue. Seeded by day/hour
  // so each character has varied but reproducible habits.
  const pool=scored.slice(0,Math.min(7,scored.length));
  const seed=Math.abs(Math.sin((person.index+3)*31.7+(clock.day||1)*11.3+(clock.hour||0)*5.9));
  return pool[Math.floor(seed*pool.length)].p;
}

export function createLivingResidents({scene,properties,isMobile=false,onVisit=()=>{},avatarProfile={}}){
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
  // The player's own persistent persona is a visible resident in the shared streets.
  let playerRig=makePerson(901,'player',avatarProfile.gender||'male',avatarProfile);
  playerRig.group.name='Oyuncu karakteri';
  playerRig.group.position.set(2.5,0,1.2);
  playerRig.group.userData.isPlayerAvatar=true;
  scene.add(playerRig.group);
  let playerPath=[],playerNext=0,playerTarget={x:2.5,z:1.2},playerLastDestination=-1;
  function applyAvatarProfile(profile={}){
    const position=playerRig.group.position.clone(),rotation=playerRig.group.rotation.y;
    scene.remove(playerRig.group);
    playerRig=makePerson(901,'player',profile.gender||'male',profile);
    playerRig.group.name='Oyuncu karakteri';playerRig.group.position.copy(position);playerRig.group.rotation.y=rotation;playerRig.group.userData.isPlayerAvatar=true;scene.add(playerRig.group);
  }
  const historicResidents = HISTORIC_PEOPLE.map((person,i)=>{
    const rig=makePerson(i+112,'artist',person.gender || 'male');
    const home=properties.find(p=>p.id===person.homeId);
    rig.group.position.set((home?.x||0)+(i%2?.8:-.8),0,(home?.z||0)+1.6);
    rig.group.userData.historicPerson=i;
    rig.group.userData.historicPersonId=person.id;
    rig.group.userData.historicPersonName=person.name;
    // Distinctive, period-appropriate recognition marker: a small brass medallion above the head.
    const markerGroup=new THREE.Group();
    const medallion=new THREE.Mesh(new THREE.CircleGeometry(.16,16),new THREE.MeshStandardMaterial({color:'#c5a35d',metalness:.58,roughness:.42,side:THREE.DoubleSide,emissive:'#5b431c',emissiveIntensity:.16}));
    medallion.position.set(0,1.43,0);markerGroup.add(medallion);
    const center=new THREE.Mesh(new THREE.CircleGeometry(.057,12),new THREE.MeshStandardMaterial({color:'#f4e6c4',roughness:.8,side:THREE.DoubleSide}));
    center.position.set(0,1.435,.006);markerGroup.add(center);
    const pin=new THREE.Mesh(new THREE.SphereGeometry(.035,8,8),new THREE.MeshStandardMaterial({color:'#6c392e',roughness:.7}));
    pin.position.set(0,1.44,.015);markerGroup.add(pin);
    rig.group.add(markerGroup);
    // Larger floating brass identity marker: clearly visible and easy to hit.
    const halo=new THREE.Mesh(new THREE.TorusGeometry(.22,.035,8,20),new THREE.MeshStandardMaterial({color:'#d9b66e',metalness:.45,roughness:.48,emissive:'#70521e',emissiveIntensity:.28}));
    halo.position.set(0,1.78,0);markerGroup.add(halo);
    const hitTarget=new THREE.Mesh(new THREE.SphereGeometry(.38,10,8),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
    hitTarget.position.set(0,1.78,0);hitTarget.userData.historicHitTarget=true;markerGroup.add(hitTarget);
    rig.group.userData.historicMarker=markerGroup;
    rig.group.name=person.name;
    scene.add(rig.group);
    return {...person,...rig,index:112+i,path:[],nextPoint:0,journeySpeed:.65,goingHome:false,insideUntil:0,visitCount:0};
  });
  let currentKey='',lastElapsed=null,frame=0,avatarElapsed=0;
  function update({clock,elapsed,weather={}}){
    const dateKey=[clock.year,clock.month,clock.day,clock.hour].join('/');
    if(dateKey!==currentKey){
      currentKey=dateKey;
      const playerMoving=stepResident({group:playerRig.group,path:playerPath,nextPoint:playerNext,journeySpeed:.52},seconds*2);\n    // Keep the current path index after stepResident mutates it.\n    // (The lightweight wrapper shares the path but owns its cursor.)\n    const playerWalker={group:playerRig.group,path:playerPath,nextPoint:playerNext,journeySpeed:.52};\n    stepResident(playerWalker,seconds*2);playerNext=playerWalker.nextPoint;\n    const playerStride=elapsed*4.7;playerRig.group.position.y=.018+Math.abs(Math.sin(playerStride))*.009*(playerMoving?1:.08);playerRig.legs[0].rotation.x=Math.sin(playerStride)*.19*(playerMoving?1:.08);playerRig.legs[1].rotation.x=-Math.sin(playerStride)*.19*(playerMoving?1:.08);playerRig.arms[0].rotation.x=-Math.sin(playerStride)*.14*(playerMoving?1:.08);playerRig.arms[1].rotation.x=Math.sin(playerStride)*.14*(playerMoving?1:.08);playerRig.group.visible=clock.hour>=6&&clock.hour<23;\n    for(const npc of historicResidents){
        const target=npc.goingHome ? properties.find(p=>p.id===npc.homeId) : historicVenueFor(npc,properties,clock);
        npc.goingHome=!npc.goingHome;
        if(target){
          const here={x:npc.group.position.x,z:npc.group.position.z};
          const destination={x:target.x+(npc.index%2?.8:-.8),z:target.z+((target.depth||2.4)/2)+.22};
          npc.path=[here,...walkWaypoints(here,destination).slice(1)];
          npc.pathTargetId=target.id;
          if(npc.path.length<2)npc.path=[here,destination];
          npc.nextPoint=1;
          npc.justVisited=false;
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
      if(elapsed < npc.insideUntil){npc.group.visible=false;continue;}
      if(npc.insideUntil && elapsed >= npc.insideUntil){npc.group.visible=true;npc.insideUntil=0;}
      const moving=stepResident(npc,seconds*2);
      if(!moving && npc.path.length>1 && npc.nextPoint>=npc.path.length && npc.pathTargetId && npc.pathTargetId!==npc.homeId && !npc.justVisited){
        npc.justVisited=true;npc.visitCount++;onVisit(npc.pathTargetId);
        npc.insideUntil=elapsed+18+((npc.index*7)%24);npc.group.visible=false;
      } else if(moving) npc.justVisited=false;
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
    // Resolve the nearest hit to its own resident root. Never infer a person's
    // identity from a shared mesh index or a mutable array position.
    const hits=raycaster.intersectObjects(historicResidents.map(n=>n.group),true);
    for(const hit of hits){
      let root=hit.object;
      while(root && root.userData.historicPersonId==null)root=root.parent;
      if(!root)continue;
      const person=historicResidents.find(npc=>npc.group===root);
      if(!person || !person.id)continue;
      return {id:person.id,name:person.name,gender:person.gender,bio:person.bio || person.dialogue,dialogue:person.dialogue};
    }
    return null;
  }
  return {update,pick,setAvatarProfile:applyAvatarProfile,get residents(){return activePeople.length+historicResidents.length+1},get roster(){return roster}};
}
