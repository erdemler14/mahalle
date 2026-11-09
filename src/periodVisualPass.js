import * as THREE from 'three';
import { createArchitectureKit } from './architecturalKits.js';

// Optimised, procedural architectural and street-level art direction for Beyoğlu c. 1923.
// Historical references inform the visual vocabulary; this is a stylised simulation, not a survey reconstruction.
const hash = n => {
  const x = Math.sin(n * 127.1 + 79.7) * 43758.5453;
  return x - Math.floor(x);
};
const limit = (n, a, b) => Math.max(a, Math.min(b, n));
const HARBOR = '#477f91';
const isShop = property => ['Ticaret', 'İşletme', 'Atölye'].includes(property.type);

function material(color, roughness = 0.89, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}
function block(group, mat, width, height, depth, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
  mesh.position.set(x, y, z);
  mesh.receiveShadow = false;
  mesh.castShadow = false;
  group.add(mesh);
  return mesh;
}

export function makeHistoricFacadeMaps(renderer) {
  // White-ish maps are multiplied by each building's original facade colour.
  // Reused four times over the whole district to avoid one texture per building.
  const maps = [];
  for (let variant = 0; variant < 4; variant++) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8f5ec';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1900; i++) {
      const x = hash(i * 3 + variant * 101) * 256;
      const y = hash(i * 7 + variant * 113) * 256;
      const size = 0.5 + hash(i * 11 + variant * 21) * 3;
      const tone = Math.floor(196 + hash(i * 13 + variant * 91) * 49);
      ctx.fillStyle = 'rgba(' + tone + ',' + (tone - 4) + ',' + (tone - 10) + ',' + (0.018 + hash(i * 5) * 0.14) + ')';
      ctx.fillRect(x, y, size, size * 0.7);
    }
    for (let i = 0; i < 22; i++) {
      const x = hash(i * 7 + 120 + variant) * 256;
      const y = hash(i * 11 + 249 + variant) * 256;
      ctx.strokeStyle = 'rgba(89,81,70,0.07)';
      ctx.lineWidth = 0.55 + hash(i * 9) * 0.55;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 2 + hash(i * 17) * 9, y + 3 + hash(i * 23) * 13);
      ctx.lineTo(x - 1 + hash(i * 31) * 10, y + 11 + hash(i * 37) * 24);
      ctx.stroke();
    }
    // Limewashed masonry, modest age variation rather than destructive distress.
    const grain = new THREE.CanvasTexture(canvas);
    grain.colorSpace = THREE.SRGBColorSpace;
    grain.wrapS = THREE.RepeatWrapping;
    grain.wrapT = THREE.RepeatWrapping;
    grain.repeat.set(1.75, 2.2);
    grain.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    maps.push(grain);
  }
  return maps;
}

function makeWaterMap(renderer) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#cbd5d4';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 175; i++) {
    const x = hash(i * 19 + 37) * 256;
    const y = hash(i * 29 + 62) * 256;
    ctx.strokeStyle = i % 4 === 0 ? 'rgba(249,250,233,.31)' : 'rgba(67,101,111,.11)';
    ctx.lineWidth = 0.5 + hash(i * 5) * 1.1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 7, y - 2, x + 9 + hash(i * 3) * 16, y);
    ctx.stroke();
  }
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 8);
  map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  return map;
}

function makeMarketStall(scene, x, z, rotation = 0, palette = 0) {
  const group = new THREE.Group();
  const wood = material('#70503b');
  const iron = material('#454b42', 0.74, 0.2);
  const produce = [material('#a7784d'), material('#78845c'), material('#b4a478'), material('#995847')];
  const cloth = [
    material('#9a6b5f', 0.97), material('#657c74', 0.97),
    material('#9f8c6a', 0.97), material('#6b7562', 0.97)
  ][palette % 4];
  block(group, wood, 1.35, 0.10, 0.66, 0, 0.72, 0);
  for (const side of [-1, 1]) {
    block(group, wood, 0.08, 0.72, 0.08, side * 0.55, 0.35, 0);
    block(group, iron, 0.045, 1.64, 0.04, side * 0.58, 1.22, -0.20);
    block(group, wood, 0.43, 0.23, 0.36, side * 0.35, 0.81, 0.01);
  }
  const roof = block(group, cloth, 1.57, 0.065, 0.91, 0, 1.93, -0.12);
  roof.rotation.x = -0.09;
  for (let n = 0; n < 6; n++) {
    const mat = produce[(n + palette) % produce.length];
    for (let j = 0; j < 4; j++) {
      const piece = new THREE.Mesh(new THREE.IcosahedronGeometry(0.06 + (n % 2) * 0.017, 0), mat);
      piece.position.set(-0.48 + n * 0.19, 0.90 + j * 0.065, -0.07 + (j % 2) * 0.12);
      group.add(piece);
    }
  }
  group.position.set(x, 0, z);
  group.rotation.y = rotation;
  scene.add(group);
  return { group, roof };
}

function makeBird(scene, index) {
  const bird = new THREE.Group();
  const grey = new THREE.MeshBasicMaterial({ color: '#f0e9dc', side: THREE.DoubleSide });
  const wing = new THREE.BufferGeometry();
  wing.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0, 0.13, 0.012, 0.075, 0.52, 0.03, 0.12
  ], 3));
  wing.computeVertexNormals();
  const left = new THREE.Group();
  left.add(new THREE.Mesh(wing, grey));
  const right = new THREE.Group();
  const flipped = new THREE.Mesh(wing, grey);
  flipped.scale.x = -1;
  right.add(flipped);
  bird.add(left, right);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.09, 7, 5), grey);
  body.scale.set(1, 0.50, 1.35);
  bird.add(body);
  bird.scale.setScalar(0.85 + hash(index * 11) * 0.4);
  scene.add(bird);
  return { bird, left, right, index };
}

function makeBoat(scene, x, z, index) {
  const group = new THREE.Group();
  const hull = material(index % 2 ? '#665343' : '#4f554d');
  const deck = material('#c0a98b');
  const rail = material('#473e34');
  block(group, hull, 1.45, 0.40, 3.20, 0, 0.06, 0);
  const bow = new THREE.Mesh(new THREE.ConeGeometry(0.71, 0.94, 4), hull);
  bow.rotation.x = Math.PI / 2;
  bow.rotation.y = Math.PI / 4;
  bow.position.set(0, 0.05, 1.97);
  group.add(bow);
  block(group, deck, 1.22, 0.06, 2.53, 0, 0.28, -0.05);
  block(group, rail, 0.07, 0.36, 2.2, -0.63, 0.42, -0.03);
  block(group, rail, 0.07, 0.36, 2.2, 0.63, 0.42, -0.03);
  for (const zz of [-0.8, 0.5]) block(group, deck, 1.05, 0.06, 0.28, 0, 0.45, zz);
  const oarL = block(group, rail, 1.55, 0.035, 0.075, -1.0, 0.44, 0.28);
  const oarR = block(group, rail, 1.55, 0.035, 0.075, 1.0, 0.44, -0.18);
  group.position.set(x, 0.08, z);
  group.rotation.y = 0.13 + index * 0.5;
  scene.add(group);
  return { group, originX: x, originZ: z, oarL, oarR, phase: index * 2.3 };
}

export function createPeriodVisualPass({ scene, properties, buildingMeshes, isMobile = false, waterMaterial = null, renderer, developments = {} }) {
  const sandstone = material('#c8bba1', 0.96);
  const limestone = material('#b0a28e', 0.98);
  const darkStone = material('#8b8275', 0.97);
  const oldIron = material('#424843', 0.78, 0.23);
  const timber = material('#66503e');
  const copper = material('#847d66', 0.72, 0.34);
  const paper = material('#ded3b9', 0.99);
  const soot = material('#655b51', 0.99);
  const developedTrim = material('#c8ad7b', 0.65, 0.28);
  const chimneyGroups = [];
  const architectureKit = createArchitectureKit(renderer, { mobile: isMobile });

  for (let index = 0; index < properties.length; index++) {
    const property = properties[index];
    if (isMobile && index % 3 === 2) continue;
    const group = buildingMeshes[index];
    if (!group) continue;
    const w = Number(property.width) || ([4, 10, 21, 24, 27, 40].includes(property.id) ? 2.75 : [9, 25, 31, 39].includes(property.id) ? 2.45 : 2.05);
    const d = Number(property.depth) || ([2, 8, 21, 24, 27].includes(property.id) ? 2.35 : 1.9);
    const floorHeight = property.floors >= 4 ? 0.91 : 0.88;
    const addedFloors = limit(Number(developments[property.id]) || 0, 0, 3);
    const height = (property.floors + addedFloors) * floorHeight;
    const frontage = d / 2;
    const count = Math.max(1, Math.min(4, property.floors - 1));
    const fancy = property.floors >= 4 || [4, 10, 21, 24, 27].includes(property.id);
    const palette = index % 4 === 0 ? limestone : sandstone;
    const details = index % 5 !== 4;

    // Raised foundations, recessed seams, and stone corner quoins lend mass to box-built houses.
    if (details) {
      block(group, palette, w + 0.09, 0.10, d + 0.06, 0, 0.10, 0);
      block(group, darkStone, w + 0.04, 0.045, 0.072, 0, 0.24, frontage + 0.036);
      for (const side of [-1, 1]) {
        const x = side * (w / 2 - 0.075);
        const levels = fancy ? 4 : 3;
        for (let k = 0; k < levels; k++) {
          const y = 0.50 + k * (height - 0.65) / Math.max(1, levels - 1);
          block(group, palette, 0.17, 0.11, 0.11, x, y, frontage + 0.055);
        }
      }
    }

    if (fancy) {
      // Door header and architraves; foreground silhouette changes noticeably in street view.
      const entranceX = isShop(property) ? w * 0.30 : 0;
      const entranceY = 0.82;
      const arch = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.038, 5, 18, Math.PI), sandstone);
      arch.position.set(entranceX, entranceY, frontage + 0.125);
      group.add(arch);
      block(group, palette, 0.10, 0.78, 0.12, entranceX - 0.23, 0.42, frontage + 0.07);
      block(group, palette, 0.10, 0.78, 0.12, entranceX + 0.23, 0.42, frontage + 0.07);
      if (!isMobile) {
        // Short keystones and sill embellishments on upper storeys.
        for (let k = 1; k <= Math.min(count, 3); k++) {
          const y = 0.48 + k * floorHeight + 0.30;
          const kstone = block(group, sandstone, 0.13, 0.13, 0.09, 0, y, frontage + 0.09);
          kstone.rotation.z = (index % 2 ? -1 : 1) * 0.045;
        }
      }
    }

    if (index % 3 === 1 && height > 1.5) {
      // Copper rainwater downpipe on the facade corner.
      const x = w * 0.46;
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.026, height - 0.3, 7), copper);
      pipe.position.set(x, height / 2, frontage + 0.095);
      group.add(pipe);
      block(group, oldIron, 0.12, 0.035, 0.075, x, 0.45, frontage + 0.095);
    }

    if (index % 4 === 0 && property.type !== 'Depo') {
      const chimney = new THREE.Group();
      block(chimney, soot, 0.26, 0.55, 0.24, 0, 0.29, 0);
      block(chimney, darkStone, 0.34, 0.09, 0.30, 0, 0.58, 0);
      chimney.position.set(-w * 0.28, height + 0.11, -d * 0.15);
      group.add(chimney);
      chimneyGroups.push({ chimney, p: property.id });
    }

    // Bracketed shop signs, folded canvas, period doorway street lighting.
    if (isShop(property) && details) {
      for (const side of [-1, 1]) {
        const post = block(group, timber, 0.065, 0.50, 0.10, side * (w * 0.43), 1.28, frontage + 0.13);
        post.rotation.z = side * 0.05;
        block(group, oldIron, 0.08, 0.07, 0.29, side * (w * 0.38), 1.48, frontage + 0.18);
      }
      if (index % 4 === 2) {
        // Projected folded fabric in front of shopfront, without obscuring clickable building.
        const fabric = index % 2 ? material('#86725e') : material('#6e7568');
        const valance = block(group, fabric, w * 0.85, 0.11, 0.045, 0, 0.93, frontage + 0.58);
        valance.rotation.x = -0.08;
      }
    }

    if (index % 6 === 0) {
      // A small enamelled street number plate.
      const enamel = material('#354844', 0.53, 0.15);
      block(group, enamel, 0.18, 0.16, 0.023, -w * 0.37, 0.77, frontage + 0.095);
      block(group, paper, 0.10, 0.018, 0.027, -w * 0.37, 0.77, frontage + 0.113);
    }
    if (property.id === 73) {
      // Maxim: a distinctive 1920s Pera cabaret frontage with an Art Deco marquee.
      const decoGold = material('#b18a4d', 0.62, 0.38);
      const midnight = material('#26313a', 0.76, 0.12);
      const warmGlass = new THREE.MeshStandardMaterial({color:'#e9c98c',emissive:'#b77b36',emissiveIntensity:.48,roughness:.4});
      block(group, midnight, w * .88, .38, .13, 0, 1.48, frontage + .17);
      block(group, decoGold, w * .94, .055, .17, 0, 1.70, frontage + .18);
      block(group, decoGold, .09, .62, .10, -w * .40, 1.43, frontage + .17);
      block(group, decoGold, .09, .62, .10, w * .40, 1.43, frontage + .17);
      for (let lamp = -2; lamp <= 2; lamp++) {
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(.045, 8, 8), warmGlass);
        bulb.position.set(lamp * .30, 1.49, frontage + .255);
        group.add(bulb);
      }
      const canopy = block(group, material('#6a3430'), w * .92, .10, .62, 0, 1.12, frontage + .34);
      canopy.rotation.x = -.10;
      for (const side of [-1, 1]) {
        const fin = block(group, decoGold, .07, .78, .08, side * (w * .48), 1.35, frontage + .24);
        fin.rotation.z = side * -.04;
      }
    }
    architectureKit.decorate({ group, property, width: w, depth: d, height, floorHeight, index });
  }


  // Continuous, restrained Pera street surface: compacted dark limestone setts,
  // subtly irregular joints and worn stone gutters. Pavers sit almost flush with the ground.
  const streetGroup = new THREE.Group();
  const streetBed = new THREE.MeshStandardMaterial({color:'#817c72',roughness:1});
  const settMats = [
    new THREE.MeshStandardMaterial({color:'#999286',roughness:1}),
    new THREE.MeshStandardMaterial({color:'#8d877c',roughness:1}),
    new THREE.MeshStandardMaterial({color:'#77736b',roughness:1}),
    new THREE.MeshStandardMaterial({color:'#a49b8c',roughness:1})
  ];
  const settGeo = new THREE.BoxGeometry(.38,.018,.28);
  const dummy = new THREE.Object3D();
  const laneCenters = [-23.2,-13.0,3.0,13.0,23.0];
  for(let lane=0;lane<laneCenters.length;lane++){
    const x=laneCenters[lane], width=4.0, length=47;
    const bed=new THREE.Mesh(new THREE.PlaneGeometry(width,length),streetBed);
    bed.rotation.x=-Math.PI/2;bed.position.set(x,-.031,0);bed.receiveShadow=true;streetGroup.add(bed);
    const count=(isMobile?110:220);
    const meshes=settMats.map(mat=>{const m=new THREE.InstancedMesh(settGeo,mat,count);m.receiveShadow=true;m.castShadow=false;streetGroup.add(m);return m;});
    const cols=10, rows=Math.ceil(count/cols);
    for(let k=0;k<count;k++){
      const row=Math.floor(k/cols),col=k%cols;
      const seed=hash(lane*10000+k*17+9);
      dummy.position.set(x+(col-(cols-1)/2)*.39+(row%2)*.19,-.018+seed*.0015,-23+row*(46/rows));
      dummy.rotation.set(0,(seed-.5)*.12,0);
      dummy.scale.set(.92+seed*.12,1,.88+seed*.16);
      dummy.updateMatrix();
      meshes[Math.floor(seed*settMats.length)].setMatrixAt(k,dummy.matrix);
    }
    meshes.forEach(m=>{m.instanceMatrix.needsUpdate=true;});
    // Worn, lighter limestone gutters define the carriageway without looking like a tiled grid.
    const gutterMat=new THREE.MeshStandardMaterial({color:'#aaa18f',roughness:1});
    for(const side of [-1,1]){
      const gutter=new THREE.Mesh(new THREE.BoxGeometry(.16,.025,length),gutterMat);
      gutter.position.set(x+side*(width/2-.08),-.012,0);gutter.receiveShadow=true;streetGroup.add(gutter);
    }
  }
  scene.add(streetGroup);

  const markets = [
    [-4.6, -17.2, Math.PI * 0.08, 0],
    [4.6, 12.3, -Math.PI * 0.10, 1],
    [-4.55, 17.8, Math.PI * 0.06, 2],
  ].slice(0, isMobile ? 2 : 3).map(([x,z,r,p]) => makeMarketStall(scene,x,z,r,p));

  // A small waterfront activity layer rather than empty blue geometry.
  const boats = (isMobile ? [[33,-23],[40,16]] : [[33,-23],[40,16],[34,23]]).map(([x,z],i)=>makeBoat(scene,x,z,i));
  const birds = Array.from({length: isMobile ? 3 : 7}, (_,i)=>makeBird(scene,i));
  const waterMap = waterMaterial ? makeWaterMap(renderer) : null;
  if (waterMaterial && waterMap) {
    waterMaterial.map = waterMap;
    waterMaterial.needsUpdate = true;
  }

  // Scene-level puddles are activated by rain; geometry lies slightly above the cobbles.
  const puddleMaterial = new THREE.MeshStandardMaterial({
    color: HARBOR, metalness: 0.32, roughness: 0.28, transparent: true,
    opacity: 0.22, depthWrite: false, side: THREE.DoubleSide
  });
  const puddles = [];
  for (let i = 0; i < (isMobile ? 4 : 11); i++) {
    const radius = 0.36 + hash(i + 42) * 0.38;
    const puddle = new THREE.Mesh(new THREE.CircleGeometry(radius, 18), puddleMaterial);
    puddle.rotation.x = -Math.PI / 2;
    puddle.position.set((i % 2 ? 1 : -1) * (4.4 + hash(i * 7) * 0.8), 0.032, -20 + i * (isMobile ? 10.2 : 3.9));
    puddle.scale.y = 0.4 + hash(i * 3 + 17) * 0.6;
    puddle.visible = false;
    scene.add(puddle);
    puddles.push(puddle);
  }

  // Two near-silent, very light sources help stalls read in evening conditions.
  const marketLights = markets.map(({group})=>{
    const light = new THREE.PointLight('#ffcf99', 0, 3.2, 2);
    light.position.set(0, 1.45, 0);
    group.add(light);
    return light;
  });

  function update({ hour, elapsed, delta, weather = {} }) {
    const night = hour >= 19 || hour < 6;
    const dusk = hour >= 17 && hour < 19;
    const damp = !!weather.damp;
    for (const puddle of puddles) puddle.visible = damp;
    for (const light of marketLights) light.intensity = night ? 0.6 : dusk ? 0.35 : 0;
    if (waterMap) {
      waterMap.offset.y = (waterMap.offset.y + delta * 0.004) % 1;
      waterMap.offset.x = (waterMap.offset.x + delta * 0.001) % 1;
    }
    for (const boat of boats) {
      const t = elapsed * 0.21 + boat.phase;
      boat.group.position.x = boat.originX + Math.sin(t * 0.21) * 0.43;
      boat.group.position.z = boat.originZ + Math.cos(t * 0.34) * 0.56;
      boat.group.rotation.z = Math.sin(t * 2.1) * 0.027;
      boat.group.rotation.x = Math.cos(t * 1.8) * 0.022;
      boat.oarL.rotation.y = Math.sin(t * 0.8) * 0.09;
      boat.oarR.rotation.y = -Math.sin(t * 0.8) * 0.09;
    }
    for (const item of birds) {
      const i = item.index;
      const t = elapsed * (0.19 + hash(i + 4) * 0.075) + i * 1.8;
      item.bird.position.set(
        34 + Math.cos(t) * (7 + hash(i * 13) * 5),
        7 + Math.sin(t * 0.9) * 1.9 + i * 0.23,
        -11 + Math.sin(t) * (16 + hash(i * 9) * 6)
      );
      item.bird.rotation.y = -t + Math.PI / 2;
      const flap = Math.sin(elapsed * (3.2 + (i % 3)) + i) * 0.34;
      item.left.rotation.z = flap;
      item.right.rotation.z = -flap;
    }
    for (const item of chimneyGroups) {
      item.chimney.rotation.y = Math.sin(elapsed * 0.04 + item.p) * 0.005;
    }
    for (const {roof} of markets) roof.rotation.z = Math.sin(elapsed * 0.65) * 0.005;
  }
  return { update };
}
