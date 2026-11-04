import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Load real GLB architecture (PBR materials + baked embedded textures), not
// just extra procedural meshes. Existing buildings remain until each asset is ready.
const timberIds = new Set([6, 11, 22, 30]);
const landmarks = new Set([2, 4, 8, 10, 21, 24, 27, 30, 35, 40, 47]);
const cafes = new Set([12, 19, 25, 31, 35, 39]);

const widthFor = p => Number(p.width) ||
  ([4, 10, 21, 24, 27, 40].includes(p.id) ? 2.75 : [9, 25, 31, 39].includes(p.id) ? 2.45 : 2.05);
const depthFor = p => Number(p.depth) ||
  ([2, 8, 21, 24, 27].includes(p.id) ? 2.35 : 1.9);
const levelFor = (p, developments) => {
  const added = Math.max(0, Math.min(3, Number(developments[p.id]) || 0));
  return Math.max(2, Math.min(5, Math.round(p.floors + added)));
};
const styleFor = p => {
  if (timberIds.has(p.id)) return 'timber';
  if (cafes.has(p.id)) return 'cafe';
  if (p.type === 'Atölye' || p.type === 'Depo') return 'workshop';
  if (p.type === 'Konut') return (p.floors >= 4 || landmarks.has(p.id)) ? 'grand' : 'merchant';
  if ([4, 21, 47].includes(p.id)) return 'han';
  if (landmarks.has(p.id)) return 'grand';
  return 'merchant';
};
const assetName = (p, developments) => styleFor(p) + '-' + levelFor(p, developments);
const assetUrl = key => '/models/pera-' + key + '.glb';

export function createGlbArchitecture({
  properties, buildingMeshes, mobile = false, developments = {}, owned = [], ownerByProperty = {}, playerId = 'solo'
}) {
  const targets = new Map();
  const loaded = new Map();
  const glassMaterials = [];
  let disposed = false;
  let frames = 0;
  const loader = new GLTFLoader();
  const priority = new Set([1, 2, 4, 6, 7, 8, 10, 12, 13, 21, 22, 24, 25, 27, 30, 35, 40]);

  for (let index=0; index<properties.length; index++) {
    const p = properties[index];
    const group = buildingMeshes[index];
    if (!group || p.floors < 2) continue;
    // Mobile gets fewer near-invisible backstreet meshes, without compromising interaction.
    if (mobile && !priority.has(p.id) && index % 4 === 3) continue;
    const key = assetName(p,developments);
    if (!targets.has(key)) targets.set(key, []);
    targets.get(key).push({p,group,index});
  }

  const applyAsset = (key, template) => {
    if (disposed) return;
    for (const {p,group,index} of targets.get(key) || []) {
      if (!group.parent) continue;
      const variant = template.clone(true);
      const width=widthFor(p), depth=depthFor(p);
      const floorHeight=p.floors>=4?.91:.88;
      const height=(p.floors+Math.max(0,Math.min(3,Number(developments[p.id])||0)))*floorHeight;
      const templateLevels=levelFor(p,developments);
      variant.name='Mahalle GLB / '+key+' / property '+p.id;
      variant.scale.set(width/2.48, height/(templateLevels*.91), depth/2.05);

      // Every property owns its glass materials, allowing independent windows at night.
      const glass = [];
      variant.traverse(object => {
        if (!object.isMesh) return;
        object.castShadow = !mobile && (index % 3 === 0);
        object.receiveShadow = true;
        if (object.material?.name === 'Glass windows') {
          const mat=object.material.clone();
          mat.emissive = new THREE.Color('#f2c17a');
          mat.emissiveIntensity = 0;
          object.material=mat;
          glass.push(mat);
        } else if (object.material?.name === 'Lime plaster') {
          // Mild property-to-property tint, preserving period palettes and texture.
          const mat=object.material.clone();
          const tint = p.color ? new THREE.Color(p.color) : new THREE.Color('#d7c5b3');
          const neutral = new THREE.Color('#d7c5b3');
          mat.color.multiply(tint.lerp(neutral,.76));
          object.material=mat;
        }
      });
      // Keep ownership visible in the new architecture without repainting the whole block.
      const owner=ownerByProperty[p.id];
      const belongsToMe=owned.includes(p.id) || owner?.playerId===playerId;
      const ownedByOther=!!owner && !belongsToMe;
      if (belongsToMe || ownedByOther) {
        const plaque=new THREE.Mesh(new THREE.BoxGeometry(.16,.21,.075),
          new THREE.MeshStandardMaterial({color:belongsToMe?'#6eaa8a':'#8299b3',
            metalness:.25,roughness:.4}));
        plaque.position.set(-.75,.89,1.08);
        variant.add(plaque);
      }

      // Replacement happens only after a complete model load. The original facade
      // remains as a fallback if loading fails or the GLB bundle is absent.
      for (const child of group.children) child.visible = false;
      group.add(variant);
      group.userData.hasGlbModel = true;
      loaded.set(p.id,{group,variant,glass});
      for (const mat of glass) glassMaterials.push({mat,id:p.id});
    }
  };

  for (const key of targets.keys()) {
    loader.load(assetUrl(key),
      gltf => {if(!disposed)applyAsset(key,gltf.scene)},
      undefined,
      error => console.warn('Mahalle GLB unavailable, retaining procedural building:',key,error?.message || error)
    );
  }

  const update = hour => {
    if (disposed || ++frames%18!==0) return;
    const nighttime = hour>=19 || hour<6;
    const dusk = hour>=17 && hour<19;
    for (const {mat,id} of glassMaterials) {
      const active=nighttime || dusk && id % 3 !== 0;
      mat.emissiveIntensity=active ? (id%5===0?.25:.66) : .025;
    }
  };

  const dispose = () => {
    disposed=true;
    // Materials cloned per property aren't shared with other GLBs.
    for(const {mat} of glassMaterials) mat.dispose();
    for (const model of loaded.values()) {
      model.variant.traverse(object => {
        if (object.isMesh && object.material?.name==='Lime plaster') object.material.dispose();
      });
    }
    loaded.clear();
    glassMaterials.length=0;
  };
  return {update,dispose,get count(){return loaded.size}};
}
