import * as THREE from 'three';

// Near-field, physically shaded facade components for the 1923 Beyoğlu city.
// The existing architectural models stay interactive; only nearby detail groups
// become visible, keeping memory and draw calls manageable on mobile devices.
const fract = x => x - Math.floor(x);
const random = x => fract(Math.sin(x * 91.5 + 1.97) * 43758.5453);
const grandIds = new Set([4, 8, 10, 21, 24, 27, 40]);
const shopIds = new Set([1, 4, 7, 9, 10, 12]);

function roughNormalMap() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const i = (y * 256 + x) * 4;
    const stone = random((x >> 1) * 17 + (y >> 1) * 31) - 0.5;
    const sand = random(x * 7 + y * 137) - 0.5;
    // Neutral tangent-space normal, with shallow surface variation in x/y.
    image.data[i] = Math.round(128 + (sand + stone) * 12);
    image.data[i + 1] = Math.round(128 + (sand - stone) * 11);
    image.data[i + 2] = 254;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.4, 2.1);
  return texture;
}

function box(group, material, w, h, d, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  group.add(mesh);
  return mesh;
}

// One geometry and one draw call per material / property, however many windows.
function instanceBoxes(group, material, parts) {
  if (!parts.length) return;
  const obj = new THREE.Object3D();
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material, parts.length);
  parts.forEach(([x,y,z,w,h,d],i) => {
    obj.position.set(x,y,z);
    obj.scale.set(w,h,d);
    obj.rotation.set(0,0,0);
    obj.updateMatrix();
    mesh.setMatrixAt(i,obj.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();
  group.add(mesh);
}

export function createCloseupFacades({ properties, buildingMeshes, mobile = false, developments = {} }) {
  const stoneNormals = roughNormalMap();
  const stone = new THREE.MeshStandardMaterial({
    color: '#c5b7a1', roughness: 0.89, normalMap: stoneNormals,
    normalScale: new THREE.Vector2(0.30, 0.30)
  });
  const limestone = new THREE.MeshStandardMaterial({
    color: '#d9c8b0', roughness: 0.93, normalMap: stoneNormals,
    normalScale: new THREE.Vector2(0.18, 0.18)
  });
  const darkRecess = new THREE.MeshStandardMaterial({
    color: '#2c3839', roughness: 0.98
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#749699', metalness: 0.18, roughness: 0.12,
    clearcoat: 0.7, clearcoatRoughness: 0.1,
    transparent: true, opacity: 0.81, depthWrite: false
  });
  const darkWood = new THREE.MeshStandardMaterial({
    color: '#523c2d', metalness: 0.01, roughness: 0.74, normalMap: stoneNormals,
    normalScale: new THREE.Vector2(0.06, 0.06)
  });
  const woodTrim = new THREE.MeshStandardMaterial({
    color: '#977659', metalness: 0.03, roughness: 0.70
  });
  const brass = new THREE.MeshStandardMaterial({
    color: '#a89157', metalness: 0.65, roughness: 0.27
  });
  const iron = new THREE.MeshStandardMaterial({
    color: '#3e4743', metalness: 0.48, roughness: 0.55
  });
  const details = [];

  for (let index = 0; index < properties.length; index++) {
    const p = properties[index];
    const root = buildingMeshes[index];
    if (!root) continue;
    const width = Number(p.width) ||
      ([4, 10, 21, 24, 27, 40].includes(p.id) ? 2.75 : [9, 25, 31, 39].includes(p.id) ? 2.45 : 2.05);
    const depth = Number(p.depth) || ([2,8,21,24,27].includes(p.id) ? 2.35 : 1.9);
    const front = depth / 2;
    const grand = p.floors >= 4 || grandIds.has(p.id);
    const columns = grand || p.type === 'Konut' && p.floors >= 4 ? 3 : 2;
    const shopfront = ['Ticaret','İşletme'].includes(p.type) || shopIds.has(p.id);
    const heightStep = grand ? 0.91 : 0.88;
    const floors = p.floors + Math.max(0, Math.min(3, Number(developments[p.id]) || 0));
    const group = new THREE.Group();
    group.name = 'Close facade details ' + p.id;
    group.visible = false;
    root.add(group);

    const recessed = [], panes = [], trims = [], stonetrims = [], mullions = [], lintels = [];
    for (let floor = 0; floor < floors; floor++) {
      if (floor === 0 && shopfront) continue;
      if (mobile && floor > 2) continue;
      const cy = 0.48 + floor * heightStep;
      if (cy > floors * heightStep - 0.13) continue;
      for (let column = 0; column < columns; column++) {
        const cx = (column - (columns - 1) / 2) * (columns === 3 ? 0.67 : 0.86);
        recessed.push([cx,cy,front+0.079,0.37,0.485,0.018]);
        panes.push([cx,cy,front+0.102,0.307,0.401,0.012]);
        const solid = p.id % 5 === 0 ? woodTrim : limestone;
        trims.push([cx,cy + 0.225,front+0.131,0.39,0.044,0.074]);
        trims.push([cx,cy - 0.225,front+0.135,0.42,0.060,0.093]);
        mullions.push([cx,cy,front+0.134,0.022,0.411,0.029]);
        if (!mobile) {
          mullions.push([cx,cy + 0.02,front+0.136,0.33,0.020,0.028]);
          if (grand) {
            stonetrims.push([cx-0.225,cy,front+0.134,0.055,0.51,0.090]);
            stonetrims.push([cx+0.225,cy,front+0.134,0.055,0.51,0.090]);
            lintels.push([cx,cy+0.33,front+0.12,0.51,0.069,0.125]);
          }
        }
      }
    }
    instanceBoxes(group, darkRecess, recessed);
    instanceBoxes(group, glass, panes);
    instanceBoxes(group, limestone, trims);
    instanceBoxes(group, p.id % 3 === 0 ? iron : darkWood, mullions);
    instanceBoxes(group, stone, stonetrims);
    instanceBoxes(group, limestone, lintels);

    // Deep timber entry: raised panel, stone threshold, brass knockers and handle.
    const doorX = shopfront ? width * 0.32 : 0;
    const entry = box(group,darkWood,0.41,0.77,0.092,doorX,0.41,front+0.15);
    entry.castShadow = false;
    const panelHeight = shopfront ? 0.31 : 0.46;
    box(group,woodTrim,0.28,panelHeight,0.025,doorX,0.44,front+0.206);
    box(group,darkWood,0.23,panelHeight-0.06,0.026,doorX,0.44,front+0.225);
    box(group,limestone,0.57,0.055,0.27,doorX,0.06,front+0.17);
    box(group,iron,0.46,0.055,0.10,doorX,0.84,front+0.15);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.035,8,6),brass);
    knob.position.set(doorX+(p.id%2 ? -0.12:0.12),0.44,front+0.259);
    group.add(knob);
    const keyplate = box(group,brass,0.038,0.075,0.018,knob.position.x,0.43,front+0.238);

    // Subtle horizontal tooling and occasional limestone corner repair.
    if (!mobile) {
      const seams = [];
      for (let k = 0; k < 3; k++) {
        seams.push([
          (p.id % 2 ? 1 : -1) * (width * 0.41),
          0.28 + k * 0.135,
          front + 0.093, 0.18, 0.018, 0.018
        ]);
      }
      instanceBoxes(group,stone,seams);
      if (p.id % 4 === 0) {
        const mailSlot = box(group,brass,0.12,0.024,0.025,doorX,0.57,front+0.258);
        mailSlot.castShadow = false;
      }
    }
    details.push({group, root, id:p.id});
  }

  let tick = 0;
  function update(camera, activeId = null) {
    tick += 1;
    if (tick % 8) return;
    const threshold = mobile ? 13 : 19;
    const distanceSq = threshold * threshold;
    for (const item of details) {
      const dx = camera.position.x - item.root.position.x;
      const dz = camera.position.z - item.root.position.z;
      const distance = dx*dx + dz*dz;
      // GLB kit already supplies detailed windows and doors; avoid stacked duplicates.
      item.group.visible = !item.root.userData.hasGlbModel && (distance < distanceSq || item.id === activeId && distance < distanceSq*2);
    }
  }

  return { update, groups: details };
}
