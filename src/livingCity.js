import * as THREE from 'three';

// Decorative 1920s Pera simulation layer. It never mutates gameplay or ownership state.
const shopTypes = new Set(['Ticaret', 'İşletme', 'Atölye']);
const caféIds = new Set([12, 19, 25, 31, 35, 39]);
const marketIds = new Set([1, 7, 13, 18, 23, 34]);
const clamp01 = value => Math.max(0, Math.min(1, value));
const hash = n => ((Math.sin(n * 127.1 + 42.7) * 43758.5453) % 1 + 1) % 1;

export function cityLifePhase(hour) {
  if (hour >= 5 && hour < 9) return 'MAHALLE UYANIYOR';
  if (hour >= 9 && hour < 12) return 'DÜKKÂNLAR AÇIK';
  if (hour >= 12 && hour < 15) return 'ÖĞLE TELAŞI';
  if (hour >= 15 && hour < 19) return 'ÇARŞI HAREKETLİ';
  if (hour >= 19 && hour < 23) return 'AKŞAM BEYOĞLU';
  return 'GECE SESSİZLİĞİ';
}

function shopHours(property) {
  const name = String(property.name || '').toLocaleLowerCase('tr-TR');
  if (/fırın|ekmek|pastane/.test(name)) return [5, 18];
  if (/meyhane|gazino|kahve|kıraathane|lokanta|café|şarap/.test(name) || caféIds.has(property.id)) return [10, 24];
  if (/hamam/.test(name)) return [6, 22];
  if (/matbaa|atölye|terzi|imalathane/.test(name)) return [7, 19];
  if (/eczane|muayenehane|klinik/.test(name)) return [8, 21];
  return [8, 19];
}

function box(parent, material, size, position) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  parent.add(mesh);
  return mesh;
}

export function createLivingCity({ scene, properties, buildingMeshes, isMobile = false, developments = {}, buildingLevels = {} }) {
  const shopfronts = [];
  const windows = [];
  const localPeople = [];
  const steam = [];
  const lanterns = [];
  const disposables = [];
  const stone = new THREE.MeshStandardMaterial({ color: '#bca991', roughness: 0.92 });
  const darkTimber = new THREE.MeshStandardMaterial({ color: '#65503d', roughness: 0.95 });
  const brass = new THREE.MeshStandardMaterial({ color: '#a58b5b', roughness: 0.6, metalness: 0.25 });
  const green = new THREE.MeshStandardMaterial({ color: '#556b54', roughness: 0.95 });
  const foliage = new THREE.MeshStandardMaterial({ color: '#6d8158', roughness: 1 });
  const pottery = new THREE.MeshStandardMaterial({ color: '#9b7962', roughness: 0.95 });
  const paper = new THREE.MeshStandardMaterial({ color: '#d5c6a5', roughness: 1 });
  const shutterMat = new THREE.MeshStandardMaterial({ color: '#6a5b4e', roughness: 0.82, metalness: 0.1 });
  const pavementDetail = new THREE.MeshStandardMaterial({ color: '#81786d', roughness: 1 });
  const glassMaterials = [];

  const makePlanter = (parent, x, z, scale = 1) => {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * scale, 0.10 * scale, 0.24 * scale, 9), pottery);
    pot.position.set(x, 0.15 * scale, z);
    parent.add(pot);
    const plant = new THREE.Mesh(new THREE.IcosahedronGeometry(0.19 * scale, 1), foliage);
    plant.position.set(x, 0.35 * scale, z);
    plant.scale.set(0.8, 1.15, 0.82);
    parent.add(plant);
  };

  function createCharacter(position, index, role) {
    const figure = new THREE.Group();
    const coatColors = ['#3c4f52', '#6c5145', '#575e4b', '#775f51', '#454453', '#665d45'];
    const coat = new THREE.MeshStandardMaterial({ color: coatColors[index % coatColors.length], roughness: 1 });
    const skin = new THREE.MeshStandardMaterial({ color: ['#d4a280', '#a97a5e', '#c39370', '#8b6350'][index % 4], roughness: 1 });
    const leather = new THREE.MeshStandardMaterial({ color: '#3d312b', roughness: 1 });
    const shirt = new THREE.MeshStandardMaterial({ color: '#d8cbb2', roughness: 1 });
    const body = box(figure, coat, [0.25, 0.39, 0.17], [0, 0.62, 0]);
    const collar = box(figure, shirt, [0.13, 0.065, 0.18], [0, 0.86, 0.01]);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 9, 8), skin);
    head.position.y = 0.97; figure.add(head);
    const legs = [];
    const arms = [];
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.07, 0.45, 0);
      box(leg, leather, [0.085, 0.32, 0.11], [0, -0.16, 0]);
      box(leg, leather, [0.10, 0.06, 0.17], [0, -0.32, 0.035]);
      figure.add(leg); legs.push(leg);
      const arm = new THREE.Group();
      arm.position.set(side * 0.16, 0.79, 0);
      box(arm, coat, [0.083, 0.32, 0.11], [0, -0.17, 0]);
      figure.add(arm); arms.push(arm);
    }
    if (index % 3 !== 1) {
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.026, 12), leather);
      brim.position.y = 1.09; figure.add(brim);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.107, 0.12, 12), leather);
      crown.position.y = 1.16; figure.add(crown);
    } else {
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.115, 8, 7), leather);
      hair.scale.set(1, 0.4, 0.9); hair.position.y = 1.06; figure.add(hair);
    }
    if (role === 'porter') {
      box(figure, darkTimber, [0.34, 0.26, 0.30], [0, 0.83, -0.19]);
      box(figure, paper, [0.25, 0.035, 0.23], [0, 0.97, -0.19]);
    } else if (role === 'shopper') {
      box(figure, pottery, [0.17, 0.21, 0.10], [0.28, 0.34, 0.02]);
    }
    figure.position.copy(position);
    figure.rotation.y = index % 2 ? Math.PI * 0.55 : -Math.PI * 0.38;
    figure.scale.setScalar(0.9 + (index % 3) * 0.04);
    scene.add(figure);
    return { figure, legs, arms, position: position.clone(), phase: index * 1.8, role, shopId: null, speed: 0.2 + hash(index) * 0.15 };
  }

  for (const property of properties) {
    const group = buildingMeshes.find(mesh => mesh.userData.propertyId === property.id);
    if (!group) continue;
    const w = Number(property.width) || ([4, 10, 21, 24, 27, 40].includes(property.id) ? 2.75 : [9, 25, 31, 39].includes(property.id) ? 2.45 : 2.05);
    const d = Number(property.depth) || ([2, 8, 21, 24, 27].includes(property.id) ? 2.35 : 1.9);
    const extraFloors = Math.max(0, Math.min(3, Number(developments[property.id]) || 0));
    const floors = property.floors + extraFloors;
    const front = d / 2;
    const shop = shopTypes.has(property.type);

    // Lit interiors are visibly different for every property and respect the game clock.
    const glow = new THREE.MeshStandardMaterial({
      color: '#a48d68', emissive: '#f5bc71', emissiveIntensity: 0,
      transparent: true, opacity: 0, roughness: 0.9, depthWrite: false
    });
    glassMaterials.push(glow);
    const cols = floors >= 4 ? 3 : 2;
    const floor = 1 + (property.id % Math.max(1, floors - 1));
    const y = 0.48 + Math.min(floors - 1, floor) * (floors >= 4 ? 0.91 : 0.88);
    for (let col = 0; col < cols; col++) {
      const x = (col - (cols - 1) / 2) * (cols === 3 ? 0.67 : 0.86);
      box(group, glow, [0.26, 0.33, 0.018], [x, y, front + 0.077]);
    }
    windows.push({ material: glow, id: property.id, residential: property.type === 'Konut' });

    // Architectural upgrades create real, visible details instead of HUD-only level changes.
    const level = Math.max(extraFloors, Math.max(0, Number(buildingLevels[property.id] || 1) - 1));
    if (level > 0) {
      box(group, brass, [w + 0.12, 0.055, 0.16], [0, floors * 0.89 - 0.10, front + 0.065]);
      if (level >= 2) {
        makePlanter(group, -w * 0.33, front + 0.42, 0.8);
        makePlanter(group, w * 0.33, front + 0.42, 0.8);
      }
      if (level >= 3) {
        for (const side of [-1, 1]) {
          box(group, brass, [0.09, 0.75, 0.10], [side * (w * 0.45), 0.60, front + 0.08]);
        }
      }
    }

    if (property.type === 'Konut' && property.id % 7 === 0) {
      // A few lived-in balconies carry drying linen, never a repetitive copy on every facade.
      const linenColor = new THREE.MeshStandardMaterial({ color: '#e5d9bf', side: THREE.DoubleSide, roughness: 1 });
      box(group, darkTimber, [0.84, 0.018, 0.018], [0, 1.87, front + 0.37]);
      const cloth = box(group, linenColor, [0.32, 0.28, 0.013], [-0.14, 1.73, front + 0.37]);
      cloth.rotation.z = -0.05;
    }

    if (!shop) continue;
    const [opening, closing] = shopHours(property);
    const shutter = box(group, shutterMat, [w * 0.61, 0.66, 0.045], [-w * 0.12, 1.02, front + 0.19]);
    const doorLanternMat = new THREE.MeshStandardMaterial({ color: '#ddba7b', emissive: '#ffb85c', emissiveIntensity: 0.1 });
    const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), doorLanternMat);
    lantern.position.set(w * 0.35, 1.14, front + 0.21);
    group.add(lantern);
    lanterns.push(doorLanternMat);
    shopfronts.push({ property, opening, closing, shutter, lamp: doorLanternMat, openProgress: 0 });

    if (marketIds.has(property.id)) {
      // Stock crates and produce give ground-floor shops their own silhouettes.
      for (let i = 0; i < 3; i++) {
        box(group, darkTimber, [0.24, 0.17 + (i % 2) * 0.05, 0.25], [-w * 0.4 + i * 0.29, 0.12, front + 0.39]);
        const produce = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 0), i % 2 ? green : pottery);
        produce.position.set(-w * 0.4 + i * 0.29, 0.24, front + 0.39);
        group.add(produce);
      }
    }
    if (caféIds.has(property.id)) {
      // Outdoor tables are placed in each property's local street-facing frame.
      for (const offset of [-0.50, 0.50]) {
        const z = front + 0.66;
        const tabletop = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.045, 12), darkTimber);
        tabletop.position.set(offset, 0.47, z); group.add(tabletop);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.035, 0.44, 7), brass);
        stem.position.set(offset, 0.23, z); group.add(stem);
        box(group, darkTimber, [0.20, 0.055, 0.24], [offset + 0.28, 0.31, z]);
        box(group, darkTimber, [0.04, 0.31, 0.24], [offset + 0.38, 0.48, z]);
      }
    }
    if (property.id === 13 || property.id === 19 || property.id === 31) {
      for (let i = 0; i < 3; i++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 7, 5),
          new THREE.MeshBasicMaterial({ color: '#ede3cf', transparent: true, opacity: 0.1, depthWrite: false })
        );
        puff.position.set(-0.3 + i * 0.19, 1.10, front + 0.33);
        group.add(puff);
        steam.push({ puff, base: puff.position.clone(), phase: i * 1.7 + property.id });
      }
    }
  }

  // Specific neighbourhood figures are attached to businesses, not random walk paths.
  const activeVenues = properties.filter(p => shopTypes.has(p.type) && (caféIds.has(p.id) || marketIds.has(p.id) || p.id % 6 === 0));
  for (let i = 0; i < Math.min(isMobile ? 10 : 16, activeVenues.length); i++) {
    const property = activeVenues[i];
    const group = buildingMeshes.find(mesh => mesh.userData.propertyId === property.id);
    if (!group) continue;
    const d = Number(property.depth) || ([2, 8, 21, 24, 27].includes(property.id) ? 2.35 : 1.9);
    group.updateWorldMatrix(true, false);
    const anchor = group.localToWorld(new THREE.Vector3(i % 2 ? 0.62 : -0.52, 0, d / 2 + 1.02));
    const role = i % 5 === 0 ? 'porter' : i % 3 === 0 ? 'shopper' : 'visitor';
    const person = createCharacter(anchor, i, role);
    person.shopId = property.id;
    localPeople.push(person);
  }

  // Warm practical lights reinforce the lanterns already present in CityScene.
  for (const [x, z] of (isMobile ? [[-3.65, -5], [3.65, 5]] : [[-3.65, -8], [3.65, -3.5], [-3.65, 3.5], [3.65, 8]])) {
    const light = new THREE.PointLight('#ffcf84', 0, 7.5, 2);
    light.position.set(x, 1.62, z);
    scene.add(light);
    lanterns.push(light);
  }

  // Low-cost rain points: independent of the camera, with a predictable monthly pattern.
  const dropCount = isMobile ? 100 : 210;
  const rainArray = new Float32Array(dropCount * 3);
  for (let i = 0; i < dropCount; i++) {
    rainArray[i * 3] = (hash(i + 2) - 0.5) * 44;
    rainArray[i * 3 + 1] = 0.8 + hash(i + 11) * 8;
    rainArray[i * 3 + 2] = (hash(i + 37) - 0.5) * 48;
  }
  const rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainArray, 3));
  const rainMaterial = new THREE.PointsMaterial({ color: '#becad1', size: 0.055, opacity: 0.5, transparent: true, depthWrite: false, sizeAttenuation: true });
  const rain = new THREE.Points(rainGeometry, rainMaterial);
  rain.visible = false;
  rain.frustumCulled = false;
  scene.add(rain);

  const ambientPaper = [];
  if (!isMobile) {
    for (let i = 0; i < 7; i++) {
      const scrap = box(scene, paper, [0.15, 0.004, 0.11], [((i * 11) % 17) - 8, 0.04, ((i * 17) % 31) - 15]);
      scrap.rotation.y = i * 0.73;
      ambientPaper.push(scrap);
    }
  }

  function update({ hour, day = 1, month = 1, elapsed, delta }) {
    const night = hour >= 19 || hour < 6;
    const dusk = hour >= 17 && hour < 19;
    const afternoon = hour >= 12 && hour < 17;
    const streetActivity = hour >= 7 && hour < 21;
    const weatherIndex = (day * 7 + month * 11) % 13;
    const raining = weatherIndex === 2 || weatherIndex === 6 || weatherIndex === 10;
    const damp = raining || (day * 7 + month * 11 - 7) % 13 === 2;

    for (const window of windows) {
      const lightOn = night
        ? (window.residential ? hash(window.id + day) > 0.20 : hash(window.id + day) > 0.56)
        : (dusk && hash(window.id + day) > 0.42);
      const target = lightOn ? (window.residential ? 0.8 : 0.48) : 0;
      window.material.opacity += (target - window.material.opacity) * Math.min(1, delta * 3);
      window.material.emissiveIntensity = 1.15 + Math.sin(elapsed * 0.19 + window.id) * 0.08;
    }
    for (const item of shopfronts) {
      const open = hour >= item.opening && hour < item.closing;
      item.openProgress += ((open ? 1 : 0) - item.openProgress) * Math.min(1, delta * 3.5);
      item.shutter.position.y = 0.53 + item.openProgress * 0.54;
      item.shutter.scale.y = Math.max(0.08, 1 - item.openProgress * 0.92);
      item.lamp.emissiveIntensity = open && (night || dusk) ? 1.7 : 0.08;
    }
    for (const light of lanterns) {
      if (light.isPointLight) light.intensity = night ? 1.25 : dusk ? 0.65 : 0;
    }
    for (const person of localPeople) {
      const related = shopfronts.find(shop => shop.property.id === person.shopId);
      const shopOpen = !!related && hour >= related.opening && hour < related.closing;
      const present = streetActivity && shopOpen && !(raining && hash(person.phase) < 0.28);
      person.figure.visible = present;
      if (!present) continue;
      const t = elapsed * person.speed + person.phase;
      const conversation = Math.sin(t * 0.4) > -0.25;
      person.figure.position.set(
        person.position.x + Math.sin(t * 0.72) * (conversation ? 0.07 : 0.25),
        person.position.y + Math.max(0, Math.sin(t * 4.5)) * (conversation ? 0.007 : 0.018),
        person.position.z + Math.cos(t * 0.48) * (conversation ? 0.07 : 0.28)
      );
      person.figure.rotation.y += Math.sin(t) * delta * 0.06;
      for (let j = 0; j < 2; j++) {
        person.legs[j].rotation.x = (j ? -1 : 1) * Math.sin(t * 4.5) * (conversation ? 0.03 : 0.2);
        person.arms[j].rotation.x = (j ? 1 : -1) * Math.sin(t * 2 + j) * (conversation ? 0.14 : 0.24);
      }
    }
    for (const item of steam) {
      const t = ((elapsed * 0.17 + item.phase * 0.22) % 1 + 1) % 1;
      item.puff.visible = hour >= 5 && hour < 22;
      item.puff.position.set(item.base.x + t * 0.10, item.base.y + t * 0.72, item.base.z + t * 0.08);
      item.puff.scale.setScalar(0.7 + t * 1.9);
      item.puff.material.opacity = 0.20 * (1 - t);
    }
    rain.visible = raining;
    if (raining) {
      const position = rainGeometry.attributes.position;
      for (let i = 0; i < dropCount; i++) {
        let y = position.getY(i) - delta * 8;
        if (y < 0.1) y = 7 + hash(i + Math.floor(elapsed * 4)) * 1.5;
        position.setXYZ(i, position.getX(i) + delta * 0.32, y, position.getZ(i));
        if (position.getX(i) > 22) position.setX(i, -22);
      }
      position.needsUpdate = true;
    }
    for (const scrap of ambientPaper) scrap.rotation.y += delta * (raining ? 0.02 : 0.10);
    return { raining, damp, night, dusk, afternoon };
  }

  function tramPosition(elapsed) {
    const phases = [[-23, -11, 7], [-11, -11, 2.4], [-11, 10, 12.4], [10, 10, 2.4], [10, 23, 7.6]];
    const total = phases.reduce((sum, phase) => sum + phase[2], 0);
    let t = elapsed % total;
    for (const [from, to, duration] of phases) {
      if (t < duration) return from + (to - from) * (t / duration);
      t -= duration;
    }
    return -23;
  }

  return { update, tramPosition };
}
