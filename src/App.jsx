import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Peer from 'peerjs';

const properties = [
  { id: 1, name: 'Galata’da küçük dükkan', type: 'Ticaret', price: 420, rent: 32, x: -4.2, z: -1.1, color: '#d9b99c', floors: 3, style: 'Galata taş cephesi' },
  { id: 2, name: 'Asmalımescit apartmanı', type: 'Konut', price: 860, rent: 58, x: 0, z: -3.2, color: '#b9c9c4', floors: 4, style: 'Cumba ve yüksek tavan' },
  { id: 3, name: 'Arka sokakta depo', type: 'Depo', price: 290, rent: 24, x: 4.1, z: -0.7, color: '#d9c3a8', floors: 2, style: 'Sade taş yapı' },
  { id: 4, name: 'Cadde üzeri han', type: 'Ticaret', price: 1250, rent: 94, x: -2.4, z: 4.1, color: '#c6a9a1', floors: 4, style: 'Ticaret hanı' },
  { id: 5, name: 'Meydan evi', type: 'Konut', price: 690, rent: 46, x: 3.2, z: 4.2, color: '#d8d0b9', floors: 3, style: 'Dar cepheli şehir evi' },
  { id: 6, name: 'Eski Rum evi', type: 'Konut', price: 740, rent: 49, x: -7.2, z: -5.2, color: '#b6c0a7', floors: 3, style: 'Ahşap cumba' },
  { id: 7, name: 'Şarap ve erzak dükkanı', type: 'Ticaret', price: 510, rent: 38, x: 7.0, z: -5.0, color: '#d8bca5', floors: 3, style: 'Zemin kat dükkan' },
  { id: 8, name: 'Tünel yakınında apartman', type: 'Konut', price: 1120, rent: 76, x: -7.4, z: 2.8, color: '#b7c5ce', floors: 4, style: 'Geç Osmanlı apartmanı' },
  { id: 9, name: 'Matbaa atölyesi', type: 'Atölye', price: 620, rent: 45, x: 7.2, z: 2.7, color: '#cbb2a0', floors: 2, style: 'Zanaat atölyesi' },
  { id: 10, name: 'İstiklal üzerinde mağaza', type: 'Ticaret', price: 1480, rent: 108, x: -5.6, z: 7.4, color: '#dfc9a3', floors: 4, style: 'Süslü ticaret cephesi' },
  { id: 11, name: 'Avlulu aile evi', type: 'Konut', price: 570, rent: 35, x: 0.1, z: 8.0, color: '#c6b8cf', floors: 2, style: 'İç avlulu konut' },
  { id: 12, name: 'Küçük kahvehane', type: 'İşletme', price: 480, rent: 62, x: 5.5, z: 7.5, color: '#c5b9a4', floors: 2, style: 'Sokak kahvehanesi' }
];

const SAVE_KEY = 'mahalle-save-v1';
const DAILY_LIVING_COST = 2.5;
const venueTypesByProfession = {
  kolonyaci: ['Ticaret', 'Atölye'],
  leblebici: ['Ticaret', 'Depo', 'İşletme'],
  terzi: ['Atölye'],
  matbaaci: ['Atölye'],
  kahveci: ['İşletme', 'Ticaret'],
  amele: []
};
function supportsProfessionAt(property, professionId) {
  return Boolean(property && venueTypesByProfession[professionId]?.includes(property.type));
}

function CityScene({ selected, owned, onSelect, hour }) {
  const host = useRef(null);
  const selectRef = useRef(onSelect);
  const selectedRef = useRef(selected);
  const hourRef = useRef(hour);
  useEffect(() => { selectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);
  useEffect(() => { hourRef.current = hour; }, [hour]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const scene = new THREE.Scene();
    const dayBackground = new THREE.Color('#e8e6de');
    const duskBackground = new THREE.Color('#b9b7b0');
    const nightBackground = new THREE.Color('#202b3b');
    scene.background = dayBackground.clone();
    scene.fog = new THREE.Fog('#e8e6de', 30, 62);
    const camera = new THREE.PerspectiveCamera(38, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(12, 13, 17);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    el.appendChild(renderer.domElement);

    const hemisphere = new THREE.HemisphereLight('#fffaf0', '#89877f', 2.0);
    scene.add(hemisphere);
    const sun = new THREE.DirectionalLight('#fff5dd', 3.0);
    sun.position.set(-7, 15, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -22; sun.shadow.camera.right = 22; sun.shadow.camera.top = 22; sun.shadow.camera.bottom = -22;
    scene.add(sun);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: '#d8d5ca', roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.08;
    ground.receiveShadow = true;
    scene.add(ground);

    const streetMat = new THREE.MeshStandardMaterial({ color: '#aaa79e', roughness: 1 });
    const street = new THREE.Mesh(new THREE.PlaneGeometry(11.5, 38), streetMat);
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, 0, 0);
    street.receiveShadow = true;
    scene.add(street);
    const crossStreet = new THREE.Mesh(new THREE.PlaneGeometry(38, 9.2), streetMat);
    crossStreet.rotation.x = -Math.PI / 2;
    crossStreet.position.set(0, 0.005, 0.7);
    crossStreet.receiveShadow = true;
    scene.add(crossStreet);

    const stoneMat = new THREE.MeshStandardMaterial({ color: '#c7c2b6', roughness: 1 });
    const curbMat = new THREE.MeshStandardMaterial({ color: '#d8d1c2', roughness: 0.96 });
    const pavingMats = ['#c7c2b6', '#bcb7aa', '#d1cabc'].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1 }));
    // Continuous sidewalks and stone curbs make the road read as a street, not a floating plane.
    for (const side of [-1, 1]) {
      const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 38), pavingMats[0]);
      sidewalk.rotation.x = -Math.PI / 2; sidewalk.position.set(side * 6.85, -0.005, 0); sidewalk.receiveShadow = true; scene.add(sidewalk);
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 38), curbMat);
      curb.position.set(side * 5.72, 0.035, 0); curb.receiveShadow = true; scene.add(curb);
      for (let z = -18; z <= 18; z += 1.35) {
        const tile = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.025, 1.22), pavingMats[Math.abs(Math.round(z * 10)) % 3]);
        tile.position.set(side * 6.85, 0.012, z); tile.receiveShadow = true; scene.add(tile);
      }
    }
    for (const side of [-1, 1]) {
      const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(38, 1.9), pavingMats[1]);
      sidewalk.rotation.x = -Math.PI / 2; sidewalk.position.set(0, 0.002, side * 5.55); sidewalk.receiveShadow = true; scene.add(sidewalk);
      const curb = new THREE.Mesh(new THREE.BoxGeometry(38, 0.12, 0.14), curbMat);
      curb.position.set(0, 0.035, side * 5.15); scene.add(curb);
    }
    for (let i = -12; i <= 12; i += 2) {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.015, 0.75), stoneMat);
      dash.position.set(0, 0.02, i);
      scene.add(dash);
    }

    const buildingMeshes = [];
    const addBuilding = (p, idx, isOwned) => {
      const group = new THREE.Group();
      const shopIds = [1, 4, 7, 9, 10, 12];
      const isShopfront = shopIds.includes(p.id);
      const isGrandFacade = p.id === 4 || p.id === 8 || p.id === 10;
      const isTimberHouse = p.id === 6 || p.id === 11;
      const w = p.id === 4 || p.id === 10 ? 2.75 : p.id === 9 ? 2.45 : 2.05;
      const d = p.id === 2 || p.id === 8 ? 2.35 : 1.9;
      const floorHeight = p.id === 10 ? 0.94 : 0.88;
      const h = p.floors * floorHeight;
      const facadeColors = ['#d9c8ad', '#c6b8a4', '#c7c0b3', '#d5c4a8', '#d4cbb9', '#c9b6a2', '#d8cbb4', '#c7c2b5', '#cbbca6', '#d7c8b0', '#d0c3af', '#bfae98'];
      const baseColor = isOwned ? '#b9c8b2' : facadeColors[idx % facadeColors.length];
      const mat = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.94 });
      const trimMat = new THREE.MeshStandardMaterial({ color: isTimberHouse ? '#665044' : '#e9deca', roughness: 0.92 });
      const darkWood = new THREE.MeshStandardMaterial({ color: '#513d31', roughness: 0.92 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.position.y = h / 2;
      body.castShadow = true; body.receiveShadow = true; group.add(body);

      // Distinct rooflines: flat masonry parapets, a tiled hipped roof, and taller commercial cornices.
      const roofMat = new THREE.MeshStandardMaterial({ color: isTimberHouse ? '#744d3c' : isGrandFacade ? '#655e55' : '#756e62', roughness: 1 });
      if (isTimberHouse) {
        const roof = new THREE.Mesh(new THREE.ConeGeometry(w * 0.77, 0.72, 4), roofMat);
        roof.rotation.y = Math.PI / 4; roof.position.y = h + 0.34; roof.scale.z = d / w; roof.castShadow = true; group.add(roof);
      } else {
        const parapet = new THREE.Mesh(new THREE.BoxGeometry(w + 0.18, 0.18, d + 0.16), roofMat);
        parapet.position.y = h + 0.07; parapet.castShadow = true; group.add(parapet);
        const cornice = new THREE.Mesh(new THREE.BoxGeometry(w + 0.25, 0.09, d + 0.19), trimMat);
        cornice.position.y = h - 0.13; group.add(cornice);
        if (isGrandFacade) {
          const upperCornice = new THREE.Mesh(new THREE.BoxGeometry(w + 0.34, 0.075, d + 0.24), trimMat);
          upperCornice.position.y = h - floorHeight * 1.1; group.add(upperCornice);
        }
      }

      // Plaster mouldings and pilasters make the facades read as individual late-Ottoman / early-Republic buildings.
      for (const edge of [-1, 1]) {
        const pilaster = new THREE.Mesh(new THREE.BoxGeometry(isGrandFacade ? 0.12 : 0.075, h - 0.16, 0.075), trimMat);
        pilaster.position.set(edge * (w / 2 - 0.1), h / 2, d / 2 + 0.035); group.add(pilaster);
      }
      for (let floor = 1; floor < p.floors; floor++) {
        const belt = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, 0.045, 0.08), trimMat);
        belt.position.set(0, floor * floorHeight, d / 2 + 0.04); group.add(belt);
      }

      const windowMat = new THREE.MeshStandardMaterial({ color: '#50666a', roughness: 0.5, metalness: 0.04 });
      const glassGlow = new THREE.MeshStandardMaterial({ color: '#8b9b96', roughness: 0.42, metalness: 0.04 });
      const windowCols = p.id === 10 || p.id === 4 ? 3 : 2;
      for (let floor = 0; floor < p.floors; floor++) {
        for (let col = 0; col < windowCols; col++) {
          const x = (col - (windowCols - 1) / 2) * (windowCols === 3 ? 0.67 : 0.86);
          const y = 0.48 + floor * floorHeight;
          if (floor === 0 && isShopfront) continue;
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.34, floor === 0 ? 0.42 : 0.48, 0.04), windowMat);
          win.position.set(x, y, d / 2 + 0.025); group.add(win);
          const frame = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.055, 0.065), trimMat);
          frame.position.set(x, y + 0.25, d / 2 + 0.04); group.add(frame);
          const sill = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.06, 0.09), trimMat);
          sill.position.set(x, y - 0.24, d / 2 + 0.05); group.add(sill);
          const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.42, 0.055), trimMat);
          mullion.position.set(x, y, d / 2 + 0.055); group.add(mullion);
        }
      }

      // Cumbas project from the upper storeys, with visible brackets underneath.
      if (p.id === 2 || p.id === 5 || p.id === 6 || p.id === 8) {
        const bayY = Math.min(h - 0.48, floorHeight * (p.floors - 1.45));
        const bay = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, 0.7, 0.5), mat);
        bay.position.set(0, bayY, d / 2 + 0.2); bay.castShadow = true; group.add(bay);
        const bayWindow = new THREE.Mesh(new THREE.BoxGeometry(w * 0.62, 0.35, 0.035), glassGlow);
        bayWindow.position.set(0, bayY + 0.02, d / 2 + 0.47); group.add(bayWindow);
        for (const x of [-w * 0.25, w * 0.25]) {
          const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.3), darkWood);
          bracket.position.set(x, bayY - 0.48, d / 2 + 0.25); group.add(bracket);
        }
        const bayCap = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, 0.09, 0.62), trimMat);
        bayCap.position.set(0, bayY + 0.39, d / 2 + 0.22); group.add(bayCap);
      }

      // Shallow iron balconies on larger apartment and commercial facades.
      if ([2, 4, 8, 10].includes(p.id)) {
        const balconyY = floorHeight * 1.72;
        const balconyW = w * (p.id === 10 ? 0.72 : 0.58);
        const ironRail = new THREE.MeshStandardMaterial({ color: '#343c3b', roughness: 0.72, metalness: 0.35 });
        const stoneBalcony = new THREE.Mesh(new THREE.BoxGeometry(balconyW, 0.07, 0.42), trimMat);
        stoneBalcony.position.set(0, balconyY - 0.12, d / 2 + 0.2); group.add(stoneBalcony);
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(balconyW, 0.045, 0.045), ironRail);
        topRail.position.set(0, balconyY + 0.18, d / 2 + 0.4); group.add(topRail);
        for (let rail = 0; rail <= 6; rail++) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.29, 0.035), ironRail);
          post.position.set(-balconyW / 2 + rail * balconyW / 6, balconyY + 0.02, d / 2 + 0.4); group.add(post);
        }
        for (const side of [-1, 1]) {
          const returnRail = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.27, 0.32), ironRail);
          returnRail.position.set(side * balconyW / 2, balconyY + 0.02, d / 2 + 0.24); group.add(returnRail);
        }
      }

      // Ground-floor shopfronts: timber frames, deep display windows, a recessed door and striped awning.
      if (isShopfront) {
        const shopGlass = new THREE.MeshStandardMaterial({ color: p.id === 7 ? '#6f493d' : '#879a98', roughness: 0.35, metalness: 0.08 });
        const storefrontW = w * 0.66;
        const display = new THREE.Mesh(new THREE.BoxGeometry(storefrontW, 0.62, 0.045), shopGlass);
        display.position.set(-w * 0.12, 0.56, d / 2 + 0.055); group.add(display);
        const displayFrame = new THREE.Mesh(new THREE.BoxGeometry(storefrontW + 0.1, 0.07, 0.09), darkWood);
        displayFrame.position.set(-w * 0.12, 0.9, d / 2 + 0.07); group.add(displayFrame);
        const displaySill = new THREE.Mesh(new THREE.BoxGeometry(storefrontW + 0.1, 0.08, 0.09), darkWood);
        displaySill.position.set(-w * 0.12, 0.22, d / 2 + 0.07); group.add(displaySill);
        for (const x of [-w * 0.12 - storefrontW / 2, -w * 0.12 + storefrontW / 2]) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.78, 0.09), darkWood);
          post.position.set(x, 0.56, d / 2 + 0.075); group.add(post);
        }
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.78, 0.08), darkWood);
        door.position.set(w * 0.32, 0.4, d / 2 + 0.07); group.add(door);
        const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.48, 0.025), trimMat);
        doorPanel.position.set(w * 0.32, 0.43, d / 2 + 0.12); group.add(doorPanel);

        const signCanvas = document.createElement('canvas');
        signCanvas.width = 512; signCanvas.height = 128;
        const ctx = signCanvas.getContext('2d');
        ctx.fillStyle = p.id === 7 ? '#49362b' : p.id === 12 ? '#314538' : '#3d3027';
        ctx.fillRect(0, 0, 512, 128);
        ctx.strokeStyle = '#d5bd8c'; ctx.lineWidth = 5; ctx.strokeRect(8, 8, 496, 112);
        ctx.fillStyle = '#f0dfb7'; ctx.font = 'bold 42px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const sign = p.id === 7 ? 'SARAP & ERZAK' : p.id === 12 ? 'KAHVEHANE' : p.id === 9 ? 'MATBAA' : p.id === 10 ? 'MAGAZA' : p.id === 4 ? 'HAN' : 'TICARET';
        ctx.fillText(sign, 256, 64, 470);
        const signTexture = new THREE.CanvasTexture(signCanvas);
        signTexture.colorSpace = THREE.SRGBColorSpace;
        const signMat = new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.8 });
        const signBoard = new THREE.Mesh(new THREE.BoxGeometry(w * 0.86, 0.28, 0.07), signMat);
        signBoard.position.set(0, 1.16, d / 2 + 0.09); group.add(signBoard);

        if ([1, 7, 10, 12].includes(p.id)) {
          const awningColors = p.id === 7 ? ['#8b5145', '#e2c9a0'] : ['#a55f48', '#ead9b8'];
          for (let stripe = 0; stripe < 6; stripe++) {
            const awning = new THREE.Mesh(new THREE.BoxGeometry(w * 0.86 / 6, 0.07, 0.38), new THREE.MeshStandardMaterial({ color: awningColors[stripe % 2], roughness: 0.95 }));
            awning.position.set(-w * 0.43 + (stripe + 0.5) * (w * 0.86 / 6), 1.0, d / 2 + 0.28);
            awning.rotation.x = -0.1; group.add(awning);
          }
        }
      } else {
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.76, 0.07), darkWood);
        door.position.set(0, 0.38, d / 2 + 0.045); group.add(door);
      }

      // The commercial street corner has a shallow pediment, while smaller houses retain restrained roof details.
      if (p.id === 10) {
        const pediment = new THREE.Mesh(new THREE.ConeGeometry(w * 0.58, 0.42, 3), trimMat);
        pediment.rotation.y = Math.PI; pediment.position.set(0, h + 0.24, d / 2); pediment.scale.z = 0.45; group.add(pediment);
      }
      group.position.set(p.x, 0, p.z);
      group.userData.propertyId = p.id;
      scene.add(group);
      buildingMeshes.push(group);
    };

    properties.forEach((p, i) => addBuilding(p, i, owned.includes(p.id)));

    // A subtle pulsing ring makes the currently selected property easy to spot.
    const selectionRingMaterial = new THREE.MeshStandardMaterial({
      color: '#8b78ff', emissive: '#5e49d7', emissiveIntensity: 0.45,
      transparent: true, opacity: 0.78, roughness: 0.55
    });
    const selectionRing = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.045, 6, 32), selectionRingMaterial);
    selectionRing.rotation.x = -Math.PI / 2;
    selectionRing.position.y = 0.035;
    scene.add(selectionRing);

    // Background frontage has repeated window bays and cornices rather than blank cubes.
    const fillerColors = ['#c9b7a2', '#b8c5be', '#d8c3a9', '#c7a7a0', '#d9d0b9', '#b9c4d0', '#d8bda7', '#c7b9cf'];
    for (let i = 0; i < 10; i++) {
      const height = 2.5 + (i % 4) * 0.58;
      const width = 1.9 + (i % 3) * 0.22;
      const depth = 1.75;
      const facadeMat = new THREE.MeshStandardMaterial({ color: fillerColors[i % fillerColors.length], roughness: 0.94 });
      const detailMat = new THREE.MeshStandardMaterial({ color: '#e8deca', roughness: 0.9 });
      const glassMat = new THREE.MeshStandardMaterial({ color: '#526970', roughness: 0.5 });
      const b = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), facadeMat);
      body.position.y = height / 2; body.castShadow = true; body.receiveShadow = true; b.add(body);
      const cornice = new THREE.Mesh(new THREE.BoxGeometry(width + 0.16, 0.09, depth + 0.12), detailMat);
      cornice.position.y = height - 0.1; b.add(cornice);
      for (let floor = 0; floor < Math.max(2, Math.floor(height / 0.9)); floor++) {
        for (let col = 0; col < 2; col++) {
          const x = (col - 0.5) * 0.72;
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.42, 0.04), glassMat);
          win.position.set(x, 0.5 + floor * 0.78, depth / 2 + 0.025); b.add(win);
          const frame = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.055), detailMat);
          frame.position.set(x, 0.74 + floor * 0.78, depth / 2 + 0.045); b.add(frame);
          const sill = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.06), detailMat);
          sill.position.set(x, 0.26 + floor * 0.78, depth / 2 + 0.045); b.add(sill);
        }
      }
      const side = i % 2 === 0 ? -1 : 1;
      b.position.set(side * (10.0 + (i % 3) * 1.0), 0, -13 + i * 2.9);
      scene.add(b);
    }

    // A small, understated period tram on the street.
    const tram = new THREE.Group();
    const tramBody = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.05, 2.6), new THREE.MeshStandardMaterial({ color: '#8b5145', roughness: 0.8 }));
    tramBody.position.y = 0.78; tramBody.castShadow = true; tram.add(tramBody);
    const tramRoof = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.12, 2.68), new THREE.MeshStandardMaterial({ color: '#e6ddc9' }));
    tramRoof.position.y = 1.36; tram.add(tramRoof);
    const tramWindowMat = new THREE.MeshStandardMaterial({ color: '#9eaca8', metalness: 0.1, roughness: 0.35 });
    for (let i = 0; i < 3; i++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.34, 0.035), tramWindowMat);
      win.position.set(-0.4 + i * 0.4, 0.91, 1.315); tram.add(win);
    }
    tram.position.set(-0.1, 0, -7.4);
    scene.add(tram);

    // Street furniture: period-style lamps, small trees and pavement edges.
    const ironMat = new THREE.MeshStandardMaterial({ color: '#4f554f', roughness: 0.8 });
    const lampGlass = new THREE.MeshStandardMaterial({ color: '#e6dfc9', emissive: '#b8a77b', emissiveIntensity: 0.28 });
    for (const z of [-8, -3.5, 3.5, 8]) {
      for (const side of [-1, 1]) {
        const lamp = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.07, 1.65, 8), ironMat);
        pole.position.y = 0.82; lamp.add(pole);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.05), ironMat);
        arm.position.set(side * 0.13, 1.55, 0); lamp.add(arm);
        const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.2), lampGlass);
        lantern.position.set(side * 0.27, 1.42, 0); lamp.add(lantern);
        lamp.position.set(side * 3.65, 0, z);
        scene.add(lamp);
      }
    }
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#7b6b57', roughness: 1 });
    const leafMat = new THREE.MeshStandardMaterial({ color: '#7e8c70', roughness: 1 });
    for (const [x, z] of [[-5.1,-7.2],[5.2,-7.1],[-5.4,6.2],[5.3,6.1]]) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.17, 1.0, 7), trunkMat);
      trunk.position.y = 0.5; tree.add(trunk);
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), leafMat);
      crown.position.y = 1.38; crown.scale.set(1, 1.15, 0.95); crown.castShadow = true; tree.add(crown);
      tree.position.set(x, 0, z); scene.add(tree);
    }

    // Small, low-poly pedestrians give the street a continuous sense of life.
    const pedestrians = [];
    const coatColors = ['#3f5a68', '#75534a', '#65734f', '#9a794c', '#4a4c54', '#8d6661', '#53675b'];
    const skinColors = ['#c99671', '#b77e5d', '#d3a17f', '#8f6048'];
    const makePedestrian = (axis, lane, phase, speed, direction, coatColor, hasHat) => {
      const person = new THREE.Group();
      const coat = new THREE.MeshStandardMaterial({ color: coatColor, roughness: 0.96 });
      const skin = new THREE.MeshStandardMaterial({ color: skinColors[Math.floor(Math.random() * skinColors.length)], roughness: 1 });
      const trousers = new THREE.MeshStandardMaterial({ color: '#4b4c49', roughness: 1 });
      const shoes = new THREE.MeshStandardMaterial({ color: '#302f2c', roughness: 1 });
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.38, 0.14), coat);
      torso.position.y = 0.64;
      person.add(torso);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 9, 7), skin);
      head.position.y = 0.91;
      person.add(head);
      if (hasHat) {
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.035, 8), new THREE.MeshStandardMaterial({ color: '#393a37', roughness: 1 }));
        brim.position.y = 1.015;
        person.add(brim);
        const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.105, 0.11, 8), new THREE.MeshStandardMaterial({ color: '#393a37', roughness: 1 }));
        crown.position.y = 1.08;
        person.add(crown);
      }
      const makeLimb = (x, y, material, width, height, depth) => {
        const pivot = new THREE.Group();
        pivot.position.set(x, y, 0);
        const limb = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
        limb.position.y = -height / 2;
        pivot.add(limb);
        person.add(pivot);
        return pivot;
      };
      const leftLeg = makeLimb(-0.065, 0.43, trousers, 0.085, 0.28, 0.095);
      const rightLeg = makeLimb(0.065, 0.43, trousers, 0.085, 0.28, 0.095);
      const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.055, 0.15), shoes);
      leftShoe.position.set(-0.065, 0.035, 0.025); person.add(leftShoe);
      const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.055, 0.15), shoes);
      rightShoe.position.set(0.065, 0.035, 0.025); person.add(rightShoe);
      const leftArm = makeLimb(-0.17, 0.77, coat, 0.075, 0.29, 0.09);
      const rightArm = makeLimb(0.17, 0.77, coat, 0.075, 0.29, 0.09);
      person.scale.setScalar(0.92 + Math.random() * 0.13);
      person.traverse(obj => { if (obj.isMesh) obj.castShadow = false; });
      scene.add(person);
      pedestrians.push({ person, axis, lane, phase, speed, direction, leftLeg, rightLeg, leftArm, rightArm });
    };
    const mainStreetLanes = [-2.65, -1.55, 1.25, 2.55];
    for (let i = 0; i < 9; i++) {
      makePedestrian('z', mainStreetLanes[i % mainStreetLanes.length], (i * 0.137) % 1, 0.022 + (i % 3) * 0.004, i % 2 === 0 ? 1 : -1, coatColors[i % coatColors.length], i % 3 !== 1);
    }
    const crossStreetLanes = [-1.1, 1.8, 2.65];
    for (let i = 0; i < 6; i++) {
      makePedestrian('x', crossStreetLanes[i % crossStreetLanes.length], (i * 0.173 + 0.09) % 1, 0.015 + (i % 2) * 0.004, i % 2 === 0 ? 1 : -1, coatColors[(i + 2) % coatColors.length], i % 3 === 0);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const target = new THREE.Vector3(0, 0, 0);
    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    let theta = Math.atan2(camera.position.x, camera.position.z);
    let radius = camera.position.distanceTo(target);
    let phi = Math.acos(camera.position.y / radius);
    const placeCamera = () => {
      phi = Math.max(0.35, Math.min(1.18, phi));
      radius = Math.max(12, Math.min(30, radius));
      camera.position.set(
        target.x + radius * Math.sin(phi) * Math.sin(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(target);
    };
    const onPointerDown = (event) => {
      dragging = true; moved = false; lastX = event.clientX; lastY = event.clientY;
      renderer.domElement.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      theta -= dx * 0.006;
      phi += dy * 0.004;
      lastX = event.clientX; lastY = event.clientY;
      placeCamera();
    };
    const onPointerUp = () => { dragging = false; };
    const onWheel = (event) => {
      event.preventDefault();
      radius += event.deltaY * 0.018;
      placeCamera();
    };
    const onClick = (event) => {
      if (moved) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(buildingMeshes, true);
      for (const hit of hits) {
        let obj = hit.object;
        while (obj && obj.userData.propertyId == null) obj = obj.parent;
        if (obj?.userData.propertyId != null) { selectRef.current(obj.userData.propertyId); break; }
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.style.cursor = 'grab';

    let frame;
    const startedAt = Date.now();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const elapsed = (Date.now() - startedAt) / 1000;
      const currentHour = hourRef.current;
      const selectedProperty = properties.find(p => p.id === selectedRef.current);
      if (selectedProperty) selectionRing.position.set(selectedProperty.x, 0.035, selectedProperty.z);
      const pulse = 1 + Math.sin(elapsed * 2.4) * 0.035;
      selectionRing.scale.setScalar(pulse);
      const isNight = currentHour >= 19 || currentHour < 6;
      const isDusk = !isNight && (currentHour < 8 || currentHour >= 17);
      const lightColor = isNight ? nightBackground : isDusk ? duskBackground : dayBackground;
      scene.background.copy(lightColor);
      scene.fog.color.copy(lightColor);
      hemisphere.intensity = isNight ? 0.72 : isDusk ? 1.2 : 2.0;
      sun.intensity = isNight ? 0.28 : isDusk ? 1.35 : 3.0;
      lampGlass.emissiveIntensity = isNight ? 1.15 : isDusk ? 0.55 : 0.18;
      tram.position.x = -0.1 + Math.sin(Date.now() * 0.00015) * 0.8;
      pedestrians.forEach((ped, i) => {
        const progress = (elapsed * ped.speed + ped.phase) % 1;
        const stride = elapsed * ped.speed * Math.PI * 24 + i;
        if (ped.axis === 'z') {
          ped.person.position.set(ped.lane, 0.015 + Math.abs(Math.sin(stride)) * 0.018, ped.direction > 0 ? -11 + progress * 22 : 11 - progress * 22);
          ped.person.rotation.y = ped.direction > 0 ? 0 : Math.PI;
        } else {
          ped.person.position.set(ped.direction > 0 ? -12 + progress * 24 : 12 - progress * 24, 0.015 + Math.abs(Math.sin(stride)) * 0.018, ped.lane);
          ped.person.rotation.y = ped.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
        }
        ped.leftLeg.rotation.x = Math.sin(stride) * 0.48;
        ped.rightLeg.rotation.x = -Math.sin(stride) * 0.48;
        ped.leftArm.rotation.x = -Math.sin(stride) * 0.3;
        ped.rightArm.rotation.x = Math.sin(stride) * 0.3;
      });
      renderer.render(scene, camera);
    };
    animate();
    const resize = () => {
      if (!el.clientWidth || !el.clientHeight) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); } });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [owned]);

  return <div className="scene-host" ref={host} aria-label="Beyoğlu 1923 3D mahalle sahnesi" />;
}

function App() {
  const saveRef = useRef(undefined);
  if (saveRef.current === undefined) {
    try {
      saveRef.current = typeof window !== 'undefined'
        ? JSON.parse(window.localStorage.getItem(SAVE_KEY) || 'null') || {}
        : {};
    } catch {
      saveRef.current = {};
    }
  }
  const saved = saveRef.current || {};
  const [steps, setSteps] = useState(() => Number.isFinite(saved.steps) ? saved.steps : 0);
  const [cash, setCash] = useState(() => Number.isFinite(saved.cash) ? saved.cash : 75);
  const [owned, setOwned] = useState(() => Array.isArray(saved.owned) ? saved.owned.filter(id => properties.some(p => p.id === id)) : []);
  const [rented, setRented] = useState(() => Array.isArray(saved.rented) ? saved.rented.filter(id => properties.some(p => p.id === id)) : []);
  const [selected, setSelected] = useState(() => properties.some(p => p.id === saved.selected) ? saved.selected : 1);
  const [notice, setNotice] = useState('');
  const [showPortfolio, setShowPortfolio] = useState(() => Boolean(saved.showPortfolio));
  const [professionId, setProfessionId] = useState(() => ['kolonyaci', 'leblebici', 'terzi', 'matbaaci', 'kahveci', 'amele'].includes(saved.professionId) ? saved.professionId : 'amele');
  const [hour, setHour] = useState(() => Number.isInteger(saved.hour) && saved.hour >= 0 && saved.hour <= 23 ? saved.hour : 8);
  const [day, setDay] = useState(() => Number.isInteger(saved.day) && saved.day >= 1 && saved.day <= 30 ? saved.day : 1);
  const [month, setMonth] = useState(() => Number.isInteger(saved.month) && saved.month >= 1 && saved.month <= 12 ? saved.month : 1);
  const [year, setYear] = useState(() => Number.isInteger(saved.year) && saved.year >= 1923 ? saved.year : 1923);
  const clockAction = useRef(null);
  const [workHours, setWorkHours] = useState(() => Number.isInteger(saved.workHours) && saved.workHours >= 0 ? saved.workHours : 0);
  const [shopPropertyId, setShopPropertyId] = useState(() => Number.isInteger(saved.shopPropertyId) ? saved.shopPropertyId : null);
  const [wineBottles, setWineBottles] = useState(() => Number.isInteger(saved.wineBottles) && saved.wineBottles >= 0 ? saved.wineBottles : 0);
  const [businessPlans, setBusinessPlans] = useState(() => saved.businessPlans && typeof saved.businessPlans === 'object' ? saved.businessPlans : {});
  const [stockByProperty, setStockByProperty] = useState(() => saved.stockByProperty && typeof saved.stockByProperty === 'object' ? saved.stockByProperty : {});
  const [multiplayerRole, setMultiplayerRole] = useState('solo');
  const [multiplayerStatus, setMultiplayerStatus] = useState('Solo oyun');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const peerRef = useRef(null);
  const connectionRef = useRef(null);
  const actionRefs = useRef({});
  const snapshotRef = useRef(null);

  const sendAction = (action, ...payload) => {
    if (multiplayerRole === 'guest') {
      if (connectionRef.current?.open) connectionRef.current.send({ type: 'action', action, payload });
      else setMultiplayerStatus('Bağlantı koptu. Odaya yeniden katıl.');
      return true;
    }
    return false;
  };
  const selectProperty = (id) => {
    if (sendAction('selectProperty', id)) return;
    setSelected(id);
  };
  const changeProfession = (id) => {
    if (sendAction('changeProfession', id)) return;
    setProfessionId(id);
    setShopPropertyId(null);
  };

  const shopOpen = shopPropertyId === selected;
  const [log, setLog] = useState(() => Array.isArray(saved.log) && saved.log.length ? saved.log.slice(0, 5) : [{ id: 0, text: 'Beyoğlu’na geldin. Geçimini kurmak için bir meslek seç.' }]);
  const professionOptions = [
    { id: 'kolonyaci', name: 'Kolonyacı', gross: 5.2, overhead: 7, description: 'Kolonya, koku ve kişisel bakım ürünleri.' },
    { id: 'leblebici', name: 'Leblebici', gross: 4.2, overhead: 4, description: 'Kuruyemiş ve leblebi; düşük sermayeli ticaret.' },
    { id: 'terzi', name: 'Terzi', gross: 6.1, overhead: 5, description: 'Siparişle çalışır; düzenli müşteri kazandırır.' },
    { id: 'matbaaci', name: 'Matbaacı', gross: 7.3, overhead: 9, description: 'Daha yüksek gelir, daha pahalı malzeme ve bakım.' },
    { id: 'kahveci', name: 'Kahveci', gross: 5.6, overhead: 10, description: 'Müşteri trafiğine ve sarf malzemesine bağlı.' },
    { id: 'amele', name: 'Gündelik işçi', gross: 3.7, overhead: 0, description: 'Dükkan gerekmez; çalıştığın saat kadar ücret.' }
  ];
  const tradeCatalog = {
    1: [{ id: 'kolonya', name: 'Kolonya ve koku', cost: 12, price: 2.2, units: 10 }, { id: 'sabun', name: 'Sabun ve bakım', cost: 9, price: 1.8, units: 10 }],
    4: [{ id: 'han', name: 'Han odası kiralama', cost: 0, price: 0, units: 0 }],
    7: [{ id: 'sarap-uretim', name: 'Ev yapımı şarap üretimi', cost: 8, price: 4.5, units: 4, production: true }, { id: 'sarap', name: 'Toptan şişe şarap', cost: 8, price: 4.5, units: 4 }, { id: 'erzak', name: 'Kuru erzak', cost: 10, price: 2.5, units: 8 }, { id: 'zeytin', name: 'Zeytin ve peynir', cost: 11, price: 3, units: 8 }],
    9: [{ id: 'baski', name: 'Basılı ilan ve evrak', cost: 14, price: 4, units: 6 }, { id: 'defter', name: 'Defter ve kırtasiye', cost: 10, price: 2.8, units: 8 }],
    10: [{ id: 'kumas', name: 'Kumaş ve hazır giyim', cost: 18, price: 5.5, units: 7 }, { id: 'ithalat', name: 'İthal küçük eşya', cost: 20, price: 6, units: 7 }, { id: 'kitap', name: 'Kitap ve kırtasiye', cost: 14, price: 4.2, units: 8 }],
    12: [{ id: 'kahve', name: 'Kahve ve çay', cost: 12, price: 3.5, units: 10 }, { id: 'tatli', name: 'Şerbet ve tatlı', cost: 10, price: 3, units: 8 }]
  };
  const profession = professionOptions.find(p => p.id === professionId) || professionOptions[5];
  const active = properties.find(p => p.id === selected) || properties[0];
  const portfolio = properties.filter(p => owned.includes(p.id));
  const rentedProperties = portfolio.filter(p => rented.includes(p.id));
  const annualRent = portfolio.reduce((sum, p) => sum + p.rent, 0);
  const realizedAnnualRent = rentedProperties.reduce((sum, p) => sum + p.rent, 0);
  const selectedVenueCompatible = owned.includes(active.id) && !rented.includes(active.id) && supportsProfessionAt(active, professionId);
  const hasSuitablePremise = portfolio.some(p => !rented.includes(p.id) && supportsProfessionAt(p, professionId));
  const [noticeId, setNoticeId] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify({
        version: 1, steps, cash, owned, rented, selected, showPortfolio, professionId,
        hour, day, month, year, workHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, log: log.slice(0, 5)
      }));
    } catch {
      // The game remains playable if browser storage is disabled or full.
    }
  }, [steps, cash, owned, rented, selected, showPortfolio, professionId, hour, day, month, year, workHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, log]);

  const tell = (text) => {
    setNotice(text);
    setNoticeId(v => v + 1);
    setLog(old => [{ id: Date.now(), text }, ...old].slice(0, 5));
  };

  const advanceHour = (work = false) => {
    if (sendAction('advanceHour', work)) return;
    if (work && professionId !== 'amele' && !selectedVenueCompatible) {
      tell(`${profession.name} olarak çalışmak için seçili mekana uygun bir iş yeri edinmelisin. Şimdilik Gündelik işçi seçerek ücret kazanabilirsin.`);
      return;
    }
    if (hour === 5) {
      const nextDayRaw = day + 1;
      const nextDay = nextDayRaw > 30 ? 1 : nextDayRaw;
      const nextMonthRaw = month + (nextDayRaw > 30 ? 1 : 0);
      const nextMonth = nextMonthRaw > 12 ? 1 : nextMonthRaw;
      const businessOverhead = professionId !== 'amele' && hasSuitablePremise ? profession.overhead : 0;
      const maintenance = portfolio.reduce((sum, p) => sum + Math.max(0.01, Math.round((p.price * 0.003 / 365) * 100) / 100), 0);
      const dailyCost = DAILY_LIVING_COST + businessOverhead + maintenance;
      const monthlyRent = nextDayRaw > 30 ? Math.round((realizedAnnualRent / 12) * 100) / 100 : 0;
      setCash(v => Math.max(0, Math.round((v - dailyCost + monthlyRent) * 100) / 100));
      setDay(nextDay);
      setMonth(nextMonth);
      if (nextMonthRaw > 12) setYear(v => v + 1);
      setHour(6);
      setWorkHours(0);
      tell(`Yeni gün başladı. Yaşam gideri: ${DAILY_LIVING_COST}; işletme gideri: ${businessOverhead}; mülk bakımı: ${maintenance}. ${monthlyRent ? `Ay sonu kira tahsilatı: +${monthlyRent}.` : ''}`);
      return;
    }
    const isWorkingHour = hour >= 8 && hour < 19;
    let net = 0;
    let detail = '';
    if (work && isWorkingHour) {
      const variance = 0.82 + Math.random() * 0.36;
      if (professionId === 'amele') {
        const wage = Math.round(profession.gross * variance * 100) / 100;
        net = wage;
        detail = `Gündelik işçilik: saatlik ücret ${wage.toFixed(2)} oyun lirası`;
      } else if (!shopOpen) {
        const gross = Math.round(profession.gross * variance * 100) / 100;
        const supplies = Math.round((profession.overhead * 0.12 + 0.35) * 100) / 100;
        net = gross - supplies;
        detail = `${profession.name}: iş hasılatı ${gross.toFixed(2)}, malzeme ${supplies.toFixed(2)}`;
      } else {
        detail = `${profession.name}: dükkanında çalıştın; günün satışları ayrıca hesaplanacak`;
      }
      setWorkHours(v => v + 1);
    } else if (work && !isWorkingHour) {
      detail = 'Bu saatte iş bulmak zor. Dinlenmeyi veya saati ilerletmeyi seçtin.';
    }
    if (shopPropertyId !== null && owned.includes(shopPropertyId) && !rented.includes(shopPropertyId) && hour >= 8 && hour < 19) {
      const property = properties.find(p => p.id === shopPropertyId);
      const product = (tradeCatalog[property?.id] || []).find(item => item.id === businessPlans[property?.id]);
      const stock = stockByProperty[property?.id] || 0;
      if (product && product.price > 0 && stock > 0 && Math.random() < 0.72) {
        const sold = Math.min(stock, Math.random() < 0.22 ? 2 : 1);
        const revenue = Math.round(sold * product.price * 100) / 100;
        net += revenue;
        setStockByProperty(old => ({ ...old, [property.id]: Math.max(0, (old[property.id] || 0) - sold) }));
        detail += `${detail ? ' · ' : ''}${product.name}: ${sold} adet satıldı, ciro +₺${revenue.toFixed(2)}`;
      } else if (!product) {
        detail += `${detail ? ' · ' : ''}Dükkan açık ancak satış için ürün grubu ve ilk stok gerekli`;
      } else if (stock <= 0) {
        detail += `${detail ? ' · ' : ''}${product.name} stoğu bitti; tedarik yapılmalı`;
      }
    }
    setCash(v => Math.max(0, Math.round((v + net) * 100) / 100));
    const nextHour = (hour + 1) % 24;
    setHour(nextHour);
    setSteps(v => v + 1);
    if (detail) tell(`${String(hour).padStart(2, '0')}:00 — ${detail}. Net değişim: ${net >= 0 ? '+' : ''}${net.toFixed(2)} oyun lirası.`);
    else tell(`${String(hour).padStart(2, '0')}:00 — Sokak sakin. Bu saatte düzenli bir gelir elde etmedin.`);
  };

  const sleepUntilMorning = () => {
    if (sendAction('sleepUntilMorning')) return;
    const nextDayRaw = day + 1;
    const nextDay = nextDayRaw > 30 ? 1 : nextDayRaw;
    const nextMonthRaw = month + (nextDayRaw > 30 ? 1 : 0);
    const nextMonth = nextMonthRaw > 12 ? 1 : nextMonthRaw;
    const businessOverhead = professionId !== 'amele' && hasSuitablePremise ? profession.overhead : 0;
    const maintenance = portfolio.reduce((sum, p) => sum + Math.max(0.01, Math.round((p.price * 0.003 / 365) * 100) / 100), 0);
    const upkeep = DAILY_LIVING_COST + businessOverhead + maintenance;
    const rent = nextDayRaw > 30 ? Math.round((realizedAnnualRent / 12) * 100) / 100 : 0;
    setCash(v => Math.max(0, Math.round((v - upkeep + rent) * 100) / 100));
    setDay(nextDay);
    setMonth(nextMonth);
    if (nextMonthRaw > 12) setYear(v => v + 1);
    setHour(6);
    setWorkHours(0);
    tell(`Geceyi geçirdin. Günlük giderler işlendi.${rent ? ` Ay sonu kira tahsilatı: +${rent} oyun lirası.` : ''}`);
  };

  const selectBusinessPlan = (plan) => {
    if (sendAction('selectBusinessPlan', plan)) return;
    setBusinessPlans(old => ({ ...old, [active.id]: plan }));
    tell(`${active.name}: satış grubu ${(tradeCatalog[active.id] || []).find(item => item.id === plan)?.name || 'seçilmedi'} olarak ayarlandı. Satış için ayrıca stok almalısın.`);
  };

  const stockBusiness = () => {
    if (sendAction('stockBusiness')) return;
    const item = (tradeCatalog[active.id] || []).find(product => product.id === businessPlans[active.id]);
    if (!owned.includes(active.id) || rented.includes(active.id)) { tell('Stok alabilmek için mülkün sahibi olmalı ve mülk kirada olmamalı.'); return; }
    if (!item || item.units <= 0) { tell('Bu mülk için henüz tedarik edilebilir ürün grubu yok.'); return; }
    if (cash < item.cost) { tell(`İlk stok için ₺${item.cost} gerekiyor.`); return; }
    setCash(v => Math.round((v - item.cost) * 100) / 100);
    setStockByProperty(old => ({ ...old, [active.id]: (old[active.id] || 0) + item.units }));
    tell(`${item.production ? 'Üretim tamamlandı' : 'Tedarik tamamlandı'}: ${item.name}, ${item.units} adet stok, maliyet ₺${item.cost}.`);
  };

  const buy = () => {
    if (sendAction('buy')) return;
    if (owned.includes(active.id)) { tell('Bu mülk zaten portföyünde.'); return; }
    if (cash < active.price) { tell('Bu mülk için yeterli sermayen yok. Önce çalışıp birikim yap.'); return; }
    setCash(v => v - active.price);
    setOwned(v => [...v, active.id]);
    setRented(v => v.filter(id => id !== active.id));
    setShopPropertyId(null);
    setSteps(v => v + 1);
    tell(`${active.name} satın alındı. Şimdi bu mekanın desteklediği işletme türlerinden birini seçebilirsin.`);
  };

  const toggleRent = () => {
    if (sendAction('toggleRent')) return;
    if (!owned.includes(active.id)) { tell('Kiraya verebilmek için önce bu mülkü satın almalısın.'); return; }
    if (rented.includes(active.id)) {
      setRented(v => v.filter(id => id !== active.id));
      tell(`${active.name} için kiracılık sona erdi. Bundan sonra kira tahsil edilmeyecek.`);
      return;
    }
    setRented(v => [...v, active.id]);
    if (shopPropertyId === active.id) setShopPropertyId(null);
    tell(`${active.name} kiraya verildi. Oyun takviminde ay sonuna gelince kira tahsil edilecek.`);
  };

  clockAction.current = () => advanceHour(false);
  useEffect(() => {
    const timer = window.setInterval(() => clockAction.current?.(), 20000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleShop = () => {
    if (sendAction('toggleShop')) return;
    if (!owned.includes(selected)) { tell('İşletme açmak için önce seçili mekanı satın almalısın.'); return; }
    if (!selectedVenueCompatible) { tell('Seçtiğin meslek bu mekanla uyumlu değil. Uygun bir mülk veya meslek seç.'); return; }
    setShopPropertyId(shopOpen ? null : selected);
    tell(shopOpen ? 'İşletme kapatıldı; satış ve stok giderleri durdu.' : `${profession.name} işletmesi açıldı. Çalışma saatlerinde satışlar ve stok giderleri işleyecek.`);
  };

  const makeWine = () => {
    if (sendAction('makeWine')) return;
    if (!owned.includes(7)) { tell('Şarap üretmek için önce Şarap ve erzak dükkanını satın almalısın.'); return; }
    if (rented.includes(7)) { tell('Dükkan kiradayken üretim yapamazsın. Önce kiracılığı sona erdir.'); return; }
    if (cash < 8) { tell('Bir üretim partisi için 8 oyun lirası gerekiyor.'); return; }
    setCash(v => Math.round((v - 8) * 100) / 100);
    setWineBottles(v => v + 4);
    setSteps(v => v + 1);
    tell('Üretim tamamlandı: 4 şişe ev yapımı şarap hazır. Dükkanını açtığında stoktan satış yapılabilir.');
  };

  const resetGame = () => {
    if (sendAction('resetGame')) return;
    if (typeof window !== 'undefined' && !window.confirm('Yeni oyun başlatılsın mı? Mevcut mahalle kaydı silinecek.')) return;
    setSteps(0); setCash(75); setOwned([]); setRented([]); setSelected(1); setShowPortfolio(false);
    setProfessionId('amele'); setHour(8); setDay(1); setMonth(1); setYear(1923);
    setWorkHours(0); setShopPropertyId(null); setWineBottles(0); setBusinessPlans({}); setStockByProperty({});
    setLog([{ id: Date.now(), text: 'Yeni bir hikaye başladı. Gündelik işçilikle sermaye biriktir veya uygun bir dükkan edin.' }]);
    setNotice('');
    try { window.localStorage.removeItem(SAVE_KEY); } catch {}
    tell('Yeni oyun başladı. Kayıt sıfırlandı.');
  };


  const applySnapshot = (state) => {
    if (!state || typeof state !== 'object') return;
    setSteps(state.steps ?? 0); setCash(state.cash ?? 75);
    setOwned(Array.isArray(state.owned) ? state.owned : []);
    setRented(Array.isArray(state.rented) ? state.rented : []);
    setSelected(properties.some(p => p.id === state.selected) ? state.selected : 1);
    setProfessionId(state.professionId || 'amele');
    setHour(state.hour ?? 8); setDay(state.day ?? 1); setMonth(state.month ?? 1); setYear(state.year ?? 1923);
    setWorkHours(state.workHours ?? 0); setShopPropertyId(state.shopPropertyId ?? null);
    setWineBottles(state.wineBottles ?? 0);
    setBusinessPlans(state.businessPlans || {}); setStockByProperty(state.stockByProperty || {});
    setLog(Array.isArray(state.log) ? state.log.slice(0, 5) : []);
  };

  const closeMultiplayer = () => {
    try { connectionRef.current?.close(); } catch {}
    try { peerRef.current?.destroy(); } catch {}
    connectionRef.current = null; peerRef.current = null;
    setMultiplayerRole('solo'); setMultiplayerStatus('Solo oyun'); setRoomCode('');
  };

  const startRoom = () => {
    closeMultiplayer();
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setRoomCode(code); setMultiplayerStatus('Oda açılıyor…');
    try {
      const peer = new Peer('mahalle-' + code.toLowerCase());
      peerRef.current = peer;
      peer.on('open', () => { setMultiplayerRole('host'); setMultiplayerStatus('Oda hazır · ikinci oyuncu bekleniyor'); });
      peer.on('connection', conn => {
        if (connectionRef.current?.open) { conn.close(); return; }
        connectionRef.current = conn;
        conn.on('open', () => {
          setMultiplayerStatus('İki oyuncu bağlı · sen ev sahibisin');
          conn.send({ type: 'state', state: snapshotRef.current });
        });
        conn.on('data', message => {
          if (message?.type === 'hello') conn.send({ type: 'state', state: snapshotRef.current });
          if (message?.type === 'action' && typeof message.action === 'string') {
            const handler = actionRefs.current[message.action];
            if (typeof handler === 'function') handler(...(Array.isArray(message.payload) ? message.payload : []));
          }
        });
        conn.on('close', () => { connectionRef.current = null; setMultiplayerStatus('Oyuncu ayrıldı · oda açık'); });
      });
      peer.on('error', error => { setMultiplayerStatus('Bağlantı hatası: ' + (error?.type || 'oda açılamadı')); });
    } catch {
      setMultiplayerStatus('Çoklu oyuncu bağlantısı başlatılamadı.');
    }
  };

  const joinRoom = () => {
    const code = joinCode.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) { setMultiplayerStatus('Oda kodu 6 harf veya rakamdan oluşmalı.'); return; }
    closeMultiplayer();
    setMultiplayerStatus('Odaya bağlanılıyor…');
    try {
      const peer = new Peer();
      peerRef.current = peer;
      peer.on('open', () => {
        const conn = peer.connect('mahalle-' + code.toLowerCase(), { reliable: true });
        connectionRef.current = conn;
        conn.on('open', () => {
          setRoomCode(code); setMultiplayerRole('guest'); setMultiplayerStatus('Bağlandı · oyun ev sahibinin dünyasıyla eşitleniyor');
          conn.send({ type: 'hello' });
        });
        conn.on('data', message => {
          if (message?.type === 'state') applySnapshot(message.state);
        });
        conn.on('close', () => { connectionRef.current = null; setMultiplayerStatus('Bağlantı kapandı · yeniden katılman gerekiyor'); setMultiplayerRole('solo'); });
      });
      peer.on('error', error => { setMultiplayerStatus('Odaya bağlanılamadı: ' + (error?.type || 'bağlantı hatası')); });
    } catch {
      setMultiplayerStatus('Çoklu oyuncu bağlantısı başlatılamadı.');
    }
  };

  snapshotRef.current = { steps, cash, owned, rented, selected, professionId, hour, day, month, year, workHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, log };
  actionRefs.current = { advanceHour, sleepUntilMorning, selectBusinessPlan, stockBusiness, buy, toggleRent, toggleShop, makeWine, resetGame, selectProperty, changeProfession };
  useEffect(() => {
    if (multiplayerRole === 'host' && connectionRef.current?.open) {
      connectionRef.current.send({ type: 'state', state: snapshotRef.current });
    }
  }, [multiplayerRole, steps, cash, owned, rented, selected, professionId, hour, day, month, year, workHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, log]);

  return <main className="app-shell">
    <header className="topbar">
      <a className="wordmark" href="#" aria-label="Mahalle ana sayfa"><span className="mark">M.</span><span>MAHALLE</span></a>
      <div className="top-center"><span className="live-dot" /> BİR BEYOĞLU YAŞAM SİMÜLASYONU</div>
      <div className="top-actions"><button className="reset-button" onClick={resetGame}>YENİ OYUN ↻</button><button className="avatar-button" onClick={() => setShowPortfolio(v => !v)} aria-label="Portföyü aç">CC</button></div>
    </header>

    <section className="intro-row">
      <div>
        <div className="eyebrow">SEZON 01 <span>/</span> İSTANBUL</div>
        <h1>BEYOĞLU <span>{year}</span></h1>
        <p className="intro-copy">Önce geçimini kur. Sonra dükkanını aç. Kendi hikayeni yaz.</p>
      </div>
      <div className="progress-control">
        <div className="date-label">OYUN TAKVİMİ · {String(day).padStart(2, '0')}/{String(month).padStart(2, '0')}/{year}</div>
        <div className="year-display">{String(hour).padStart(2, '0')}:00 <small>/ 24 SAAT</small></div>
        <button className="advance-button" onClick={() => advanceHour(false)}>{hour === 5 ? 'YENİ GÜNE GEÇ' : 'SAATİ İLERLET'} <span>▶</span></button>
      </div>
    </section>

    <section className="multiplayer-panel">
      <div className="multiplayer-heading"><span className="live-dot" /> İKİ KİŞİLİK MAHALLE</div>
      <div className="multiplayer-status">{multiplayerStatus}</div>
      <div className="multiplayer-controls">
        <button className="room-create-button" onClick={startRoom}>YENİ ODA AÇ</button>
        {roomCode && multiplayerRole === 'host' && <div className="room-code"><span>ODA KODU</span><strong>{roomCode}</strong><button onClick={() => { try { navigator.clipboard?.writeText(roomCode); setMultiplayerStatus('Oda kodu kopyalandı · arkadaşına gönder.'); } catch { setMultiplayerStatus('Oda kodun: ' + roomCode); } }}>KOPYALA</button></div>}
        <div className="room-join"><input aria-label="Oda kodu" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))} placeholder="6 HANELİ KOD" maxLength={6} /><button onClick={joinRoom}>ODAYA KATIL</button></div>
        {multiplayerRole !== 'solo' && <button className="room-leave-button" onClick={closeMultiplayer}>ODADAN AYRIL</button>}
      </div>
      <p>Odayı açan oyuncu ortak oyunun ev sahibidir. İkinci oyuncunun işlemleri ev sahibine gönderilir; para, mülk, saat ve stok bilgileri aynı oyun durumundan paylaşılır. İnternet bağlantısı gerekir.</p>
    </section>

    <section className="game-layout">
      <div className="world-panel">
        <div className="world-topline"><span><span className="live-dot" /> BEYOĞLU MERKEZİ</span><span>OYUN DÜNYASI <i>·</i> {year}</span></div>
        <CityScene selected={selected} owned={owned} onSelect={selectProperty} hour={hour} />
        <div className="map-legend"><span><i className="legend-dot available" /> SATILIK MÜLK</span><span><i className="legend-dot owned" /> SENİN MÜLKÜN</span><span className="map-hint">SÜRÜKLE: DÖNDÜR · KAYDIR: YAKINLAŞ · BİNAYA TIKLA</span></div>
        <div className="world-caption"><span>İSTANBUL / BEYOĞLU</span><span>GÜN {day} <i>·</i> SAAT {String(hour).padStart(2, '0')}:00</span></div>
      </div>

      <aside className="side-panel">
        <section className="balance-card profession-card">
          <div className="card-label">01 / MESLEK SEÇİMİ</div>
          <select className="profession-select" value={professionId} onChange={e => changeProfession(e.target.value)}>
            {professionOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <p className="profession-description">{profession.description}</p>
          <div className="profession-meta">Saatlik hasılat ≈ {profession.gross.toFixed(2)} · Günlük işletme gideri {profession.overhead} oyun lirası</div>
          <div className="profession-meta">{professionId === 'amele' ? 'Dükkan gerekmez; ücretli iş bulup sermaye biriktirebilirsin.' : hasSuitablePremise ? 'Mesleğine uygun bir mülkün var.' : 'Bu meslek için uygun bir dükkan veya atölye edinmen gerekiyor.'}</div>
        </section>

        <section className="balance-card">
          <div className="card-label">02 / CEPTEKİ SERMAYE</div>
          <div className="balance-number"><span>₺</span>{cash.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</div>
          <div className="balance-foot"><span>Gün {day} · {workHours} saat çalıştın</span><span className={cash > 0 ? 'positive' : 'negative'}>{cash > 0 ? 'AYAKTA' : 'SERMAYE BİTTİ'}</span></div>
          <div className="balance-rule"><span style={{width: `${Math.min(100, cash / 500 * 100)}%`}} /></div>
        </section>

        <section className="work-card">
          <div className="section-heading"><span>03 / VARDİYA</span><span className="count-tag">{steps.toString().padStart(3, '0')}</span></div>
          <div className="work-status"><span className={hour >= 8 && hour < 19 ? 'status-light active' : 'status-light'} />{hour >= 8 && hour < 19 ? 'ÇALIŞMA SAATLERİ' : 'MESAİ DIŞI'}</div>
          <button className="work-button" onClick={() => advanceHour(true)} disabled={hour < 8 || hour >= 19}>1 SAAT ÇALIŞ <span>＋</span></button>
          <button className="rest-button" onClick={sleepUntilMorning}>UYU · YENİ GÜNE GEÇ <span>↗</span></button>
          <p className="small-note">Gündelik işçi olarak dükkansız çalışabilirsin. Diğer mesleklerde seçili ve sahip olduğun mekanın mesleğe uygun olması gerekir. Açık işletmenin satışları saat ilerledikçe işler.</p>
        </section>

        <section className="property-card">
          <div className="section-heading"><span>04 / MÜLKÜ İNCELE</span><span className="count-tag">{String(active.id).padStart(2, '0')}</span></div>
          <div className="property-type">{active.type.toUpperCase()}</div>
          <h2>{active.name}</h2>
          <p className="property-description">{active.style}. Bu taşınmazı alabilir, işletme olarak kullanabilir veya ileride kiraya verebilirsin.</p>
          <div className="property-stats">
            <div><span>Satış bedeli</span><strong>₺{active.price.toLocaleString('tr-TR')}</strong></div>
            <div><span>Yıllık kira</span><strong>₺{active.rent.toLocaleString('tr-TR')}</strong></div>
            <div><span>Kat sayısı</span><strong>{active.floors} kat</strong></div>
            <div><span>Durum</span><strong className={owned.includes(active.id) ? 'owned-text' : ''}>{!owned.includes(active.id) ? 'SATILIK' : rented.includes(active.id) ? 'KİRADA' : 'PORTFÖYÜNDE'}</strong></div>
          </div>
          <button className={owned.includes(active.id) ? 'buy-button is-owned' : 'buy-button'} onClick={buy} disabled={owned.includes(active.id)}>
            {owned.includes(active.id) ? 'MÜLK SENİN' : 'MÜLKÜ SATIN AL'} <span>{owned.includes(active.id) ? '✓' : '↗'}</span>
          </button>
          {owned.includes(active.id) && <button className="rent-button" onClick={toggleRent}>{rented.includes(active.id) ? 'KİRACIYI ÇIKAR' : 'KİRACI BUL VE KİRAYA VER'}</button>}
          {owned.includes(active.id) && !rented.includes(active.id) && (tradeCatalog[active.id] || []).some(item => item.price > 0) && <div className="business-plan">
            <div className="card-label">İŞ MODELİ · TEDARİK · STOK</div>
            <label className="business-label" htmlFor="business-plan-select">Ne satacaksın?</label>
            <select id="business-plan-select" className="profession-select" value={businessPlans[active.id] || ''} onChange={e => selectBusinessPlan(e.target.value)}>
              <option value="">Ürün grubu seç</option>
              {(tradeCatalog[active.id] || []).map(item => <option key={item.id} value={item.id}>{item.name} · alış ₺{item.cost} / satış ₺{item.price}</option>)}
            </select>
            <div className="stock-line"><span>Mevcut stok</span><strong>{stockByProperty[active.id] || 0} adet</strong></div>
            <div className="stock-line"><span>İlk tedarik maliyeti</span><strong>₺{((tradeCatalog[active.id] || []).find(item => item.id === businessPlans[active.id]) || {cost: 0}).cost}</strong></div>
            <div className="stock-line"><span>Parti başına tahmini brüt fark</span><strong>₺{(() => { const item = (tradeCatalog[active.id] || []).find(product => product.id === businessPlans[active.id]); return item ? (item.price * item.units - item.cost).toLocaleString('tr-TR', {maximumFractionDigits: 2}) : '0'; })()}</strong></div>
            <button className="stock-button" onClick={stockBusiness}>{(tradeCatalog[active.id] || []).find(item => item.id === businessPlans[active.id])?.production ? "ÜRETİM YAP / STOK EKLE" : "TEDARİK ET / STOK AL"}</button>
            <p>Satış ancak işletme açıkken ve stok varken gerçekleşir. Ürün alımı kasadan düşer; satış geliri stok azaldıkça kaydedilir.</p>
          </div>}

          {owned.includes(active.id) && (rented.includes(active.id)
            ? <div className="property-note"><span>i</span> Bu mülk kirada. İşletmek için önce kiracılığı sona erdir.</div>
            : selectedVenueCompatible
              ? <button className="operate-button" onClick={toggleShop}>{shopOpen ? 'İŞLETMENİ KAPAT' : 'DÜKKANI İŞLETMEYE AÇ'}</button>
              : <div className="property-note"><span>i</span> Bu mekanı işletmek için üstteki meslek seçiminden uygun bir iş seç.</div> )}
          <div className="property-note"><span>i</span> Mülk fiyatları şimdilik oyun dengesi için belirlenmiştir.</div>
        </section>

        <section className="portfolio-mini">
          <div className="section-heading"><span>05 / PORTFÖYÜN</span><button onClick={() => setShowPortfolio(v => !v)}>{showPortfolio ? 'KAPAT −' : 'TÜMÜNÜ GÖR +'}</button></div>
          {portfolio.length === 0 ? <div className="empty-portfolio"><span className="empty-icon">⌂</span><span>Henüz bir mülk edinmedin.</span></div> :
            portfolio.slice(0, 2).map(p => <div className="portfolio-row" key={p.id}><span className="portfolio-thumb">⌂</span><span className="portfolio-name">{p.name}<small>{p.type} · Yıllık ₺{p.rent}</small></span><span className="portfolio-value">₺{p.price}</span></div>)}
          {showPortfolio && <div className="portfolio-expanded">
            {portfolio.length === 0 ? <p>İlk yatırımın burada görünecek.</p> : portfolio.map(p => <div className="portfolio-row" key={p.id}><span className="portfolio-thumb">⌂</span><span className="portfolio-name">{p.name}<small>Yıllık kira: ₺{p.rent}</small></span><span className="portfolio-value">₺{p.price}</span></div>)}
            <div className="portfolio-total">POTANSİYEL YILLIK KİRA <strong>₺{annualRent}</strong></div><div className="portfolio-total">KİRAYA VERİLENLERİN YILLIK GELİRİ <strong>₺{realizedAnnualRent}</strong></div>
          </div>}
        </section>

        <section className="activity-card">
          <div className="section-heading"><span>06 / MAHALLE GÜNLÜĞÜ</span><span className="count-tag">CANLI</span></div>
          {log.map(item => <div className="log-line" key={item.id}><span className="log-square" />{item.text}</div>)}
        </section>
      </aside>
    </section>

    <footer className="footer"><span>MAHALLE <i>©</i> 1923</span><span>GEÇMİŞİN İÇİNDE BİR GELECEK KUR.</span><span>PROTOTİP 0.4.0</span></footer>
    <div className="economy-note">Kayıt bu tarayıcıda otomatik saklanır. Ekonomi değerleri oynanabilir prototip varsayımlarıdır; doğrulanmış 1923 ücret ve fiyat verileri değildir.</div>
    {notice && <div className="toast" key={noticeId} role="status">{notice}</div>}
  </main>;
}

export default App;