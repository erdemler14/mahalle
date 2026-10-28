import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Peer from 'peerjs';

const properties = [
  { id: 1, name: 'Madam Eleni’nin Bakkal ve Şarküterisi', type: 'Ticaret', price: 1890, rent: 26, x: -4.2, z: -1.1, color: '#d9b99c', floors: 3, style: 'Galata taş cephesi' },
  { id: 2, name: 'Chryssoverghi Apartmanı', type: 'Konut', price: 3870, rent: 46, x: 0, z: -3.2, color: '#b9c9c4', floors: 4, style: 'Cumba ve yüksek tavan', units: 6 },
  { id: 3, name: 'Karaköy Levazımat Ambarı', type: 'Depo', price: 1305, rent: 19, x: 4.1, z: -0.7, color: '#d9c3a8', floors: 2, style: 'Sade taş yapı' },
  { id: 4, name: 'Şahin Bey Ticaret Hanı', type: 'Ticaret', price: 5625, rent: 75, x: -2.4, z: 4.1, color: '#c6a9a1', floors: 4, style: 'Ticaret hanı' },
  { id: 5, name: 'Meydancık’taki Ali Rıza Bey Evi', type: 'Konut', price: 3105, rent: 37, x: 3.2, z: 4.2, color: '#d8d0b9', floors: 3, style: 'Dar cepheli şehir evi', units: 4 },
  { id: 6, name: 'Petraki Kalfa Evi', type: 'Konut', price: 3330, rent: 39, x: -7.2, z: -5.2, color: '#b6c0a7', floors: 3, style: 'Ahşap cumba', units: 4 },
  { id: 7, name: 'Maison Vuccino Şarap ve Erzak', type: 'Ticaret', price: 2295, rent: 30, x: 7.0, z: -5.0, color: '#d8bca5', floors: 3, style: 'Zemin kat dükkan' },
  { id: 8, name: 'Apostolidis Apartmanı', type: 'Konut', price: 5040, rent: 61, x: -7.4, z: 2.8, color: '#b7c5ce', floors: 4, style: 'Geç Osmanlı apartmanı', units: 6 },
  { id: 9, name: 'Nuri Efendi Matbaa ve Mücellithanesi', type: 'Atölye', price: 2790, rent: 36, x: 7.2, z: 2.7, color: '#cbb2a0', floors: 2, style: 'Zanaat atölyesi' },
  { id: 10, name: 'Au Paon Konfeksiyon Mağazası', type: 'Ticaret', price: 6660, rent: 86, x: -5.6, z: 7.4, color: '#dfc9a3', floors: 4, style: 'Süslü ticaret cephesi' },
  { id: 11, name: 'Avlulu Hacı İsmail Efendi Evi', type: 'Konut', price: 2565, rent: 28, x: 0.1, z: 8.0, color: '#c6b8cf', floors: 2, style: 'İç avlulu konut', units: 4 },
  { id: 12, name: 'Hakkı Efendi’nin Kıraathanesi', type: 'İşletme', price: 2160, rent: 50, x: 5.5, z: 7.5, color: '#c5b9a4', floors: 2, style: 'Sokak kahvehanesi' },
  { id: 13, name: 'Schumacher’in Ekmek Fırını', type: 'İşletme', price: 2520, rent: 54, x: -10.5, z: -1.0, color: '#d9b28a', floors: 2, style: 'Taş fırın cephesi' },
  { id: 14, name: 'Kurban Usta’nın Kasap Dükkânı', type: 'Ticaret', price: 2655, rent: 56, x: 10.5, z: -1.0, color: '#b9a39a', floors: 2, style: 'Dar vitrinli dükkan' },
  { id: 15, name: 'Canzuch Eczahanesi', type: 'Ticaret', price: 3690, rent: 70, x: -10.5, z: 5.5, color: '#c2cbb6', floors: 3, style: 'Eski şehir eczanesi' },
  { id: 16, name: 'Narlıyan Kitap ve Kırtasiye', type: 'Ticaret', price: 2880, rent: 58, x: 10.5, z: 5.5, color: '#c6b69f', floors: 2, style: 'Ahşap raflı mağaza' },
  { id: 17, name: 'Hakkı Usta’nın Marangozhanesi', type: 'Atölye', price: 2340, rent: 38, x: -10.5, z: 10.5, color: '#b99a7d', floors: 2, style: 'Avlulu ahşap atölye' },
  { id: 18, name: 'Yorgo’nun Meyve ve Sebze Dükkânı', type: 'Ticaret', price: 1755, rent: 34, x: 10.5, z: 10.5, color: '#aebc91', floors: 1, style: 'Sokak manavı' },
  { id: 19, name: 'Hacı Salih’in Esnaf Lokantası', type: 'İşletme', price: 3420, rent: 67, x: -3.5, z: 12.5, color: '#c9a58d', floors: 2, style: 'Esnaf lokantası' },
  { id: 20, name: 'Karabet Usta’nın Demirci Ocağı', type: 'Atölye', price: 2745, rent: 43, x: 3.5, z: 12.5, color: '#9d9b9a', floors: 2, style: 'Küçük demirci ocağı' },
  { id: 21, name: 'Hacı Arif Paşa Hanı', type: 'Ticaret', price: 7560, rent: 94, x: -15.3, z: -10.2, color: '#c5b6a0', floors: 4, style: 'Yüksek tavanlı, kemerli girişli Galata hanı' },
  { id: 22, name: 'Galata Yokuşu’nda Zeki Bey Apartmanı', type: 'Konut', price: 4230, rent: 51, x: 15.2, z: -10.1, color: '#b8c5bd', floors: 4, style: 'Dar cepheli, ahşap cumbalı şehir evi', units: 6 },
  { id: 23, name: 'Madam Mari’nin Baharat ve Nebatat Dükkânı', type: 'Ticaret', price: 3195, rent: 44, x: -15.3, z: -4.8, color: '#d7c09d', floors: 2, style: 'Ahşap vitrinli mahalle aktarı' },
  { id: 24, name: 'Frej Apartmanı', type: 'Konut', price: 6030, rent: 74, x: 15.2, z: -4.7, color: '#c7b9b0', floors: 5, style: 'Taş cepheli, kat silmeli apartman', units: 8 },
  { id: 25, name: 'Café de Péra', type: 'İşletme', price: 4455, rent: 62, x: -15.3, z: 1.2, color: '#c7b89e', floors: 3, style: 'Köşe kahvesi ve açık oturma alanı' },
  { id: 26, name: 'Madam İfigenia’nın Terzihanesi', type: 'Atölye', price: 3060, rent: 39, x: 15.2, z: 1.2, color: '#c4b2a5', floors: 3, style: 'Dar cepheli zanaat dükkanı' },
  { id: 27, name: 'Rizzo Apartmanı', type: 'Konut', price: 7020, rent: 84, x: -15.3, z: 7.1, color: '#b8c3c9', floors: 5, style: 'Konsollu cumba ve dökme demir balkonlar', units: 8 },
  { id: 28, name: 'Sotiri Biraderler Kolonyacı ve Parfümeri', type: 'Ticaret', price: 3420, rent: 47, x: 15.2, z: 7.1, color: '#d6c3a8', floors: 2, style: 'Kepenkli, dar vitrinli bakkal' },
  { id: 29, name: 'Mavridis Biraderler Sabun İmalathanesi', type: 'Atölye', price: 3870, rent: 49, x: -15.3, z: 12.8, color: '#b9b3a6', floors: 2, style: 'Arka avlulu küçük imalathane' },
  { id: 30, name: 'Sıraselviler’de Crespi Apartmanı', type: 'Konut', price: 5355, rent: 66, x: 15.2, z: 12.8, color: '#c8b8c2', floors: 4, style: 'Üst katlarda kiralık daireleri olan apartman', units: 6 },
  { id: 31, name: 'Şeref Usta’nın Lokantası', type: 'İşletme', price: 5670, rent: 77, x: -5.5, z: 17.2, color: '#c7a18e', floors: 2, style: 'Sokak köşesinde eski usul lokanta' },
  { id: 32, name: 'Papadopulos Matbaa ve Kırtasiyesi', type: 'Atölye', price: 4185, rent: 54, x: 5.5, z: 17.2, color: '#b8b0a4', floors: 3, style: 'Baskı atölyesi ve kırtasiye' },
  { id: 33, name: 'Şevket Efendi’nin Berberhanesi', type: 'İşletme', price: 1980, rent: 42, x: 0, z: 20.5, color: '#b6a18c', floors: 2, style: 'Pera usulü berber dükkânı, pirinç aynalar ve ahşap koltuk' }
];

// Galata-style irregular street frontages: narrow blocks, staggered facades and varied angles.
properties.forEach((property, index) => {
  const frontage = Math.floor(index / 8);
  const slot = index % 8;
  const baseX = [-8.5, 8.5, -18.5, 18.5][frontage];
  const staggerX = [0.15, -0.65, 0.55, -0.25, 0.8, -0.45, 0.35, -0.1][slot];
  const staggerZ = [0.0, 0.7, -0.45, 0.35, -0.8, 0.55, -0.2, 0.25][(index * 3) % 8];
  property.x = baseX + staggerX * (frontage < 2 ? 0.85 : 1.35);
  property.z = -21.2 + slot * 5.85 + staggerZ;
  property.rotation = [0, -0.08, 0.045, 0.11, -0.055, 0.025, -0.1, 0.06][(index * 5 + 2) % 8];
});

const SAVE_KEY = 'mahalle-save-v1';
const SAVE_BACKUP_KEY = 'mahalle-save-v1-backup';
const DAILY_LIVING_COST = 2.5;
const SHOE_MATERIALS = [
  { id: 'deri', name: 'İşlenmiş deri', batch: 6, cost: 18 },
  { id: 'taban', name: 'Ayakkabı tabanı', batch: 6, cost: 12 },
  { id: 'iplik', name: 'Sağlam iplik', batch: 12, cost: 8 },
  { id: 'civi', name: 'Kunduracı çivisi', batch: 12, cost: 6 }
];
const SHOE_RECIPES = [
  { id: 'kundura', name: 'Günlük kundura', price: 18, recipe: { deri: 1, taban: 1, iplik: 2, civi: 2 } },
  { id: 'deri-ayakkabi', name: 'Kaliteli deri ayakkabı', price: 29, recipe: { deri: 2, taban: 1, iplik: 2, civi: 2 } },
  { id: 'ayakkabi-taban', name: 'Tamirlik tabanlı ayakkabı', price: 12, recipe: { deri: 1, taban: 2, iplik: 1, civi: 3 }, unlockLevel: 1 },
  { id: 'ince-deri-bot', name: 'İnce deri bot', price: 42, recipe: { deri: 3, taban: 2, iplik: 3, civi: 3 }, unlockLevel: 2 },
  { id: 'hanim-isyeri-ayakkabisi', name: 'Kadın şehir ayakkabısı', price: 48, recipe: { deri: 3, taban: 1, iplik: 4, civi: 2 }, unlockLevel: 3 },
  { id: 'el-yapimi-ustalik', name: 'Usta işi el dikişi kundura', price: 68, recipe: { deri: 4, taban: 2, iplik: 5, civi: 3 }, unlockLevel: 4 },
  { id: 'ozel-siparis-cizme', name: 'Özel sipariş binici çizmesi', price: 95, recipe: { deri: 5, taban: 3, iplik: 6, civi: 4 }, unlockLevel: 5 }
];
const STARTING_CASH = 800;
const STARTER_ECONOMY_VERSION = 2;
const venueTypesByProfession = {
  kolonyaci: ['Ticaret', 'Atölye'],
  leblebici: ['Ticaret', 'Depo', 'İşletme'],
  terzi: ['Atölye'],
  matbaaci: ['Atölye'],
  kahveci: ['İşletme', 'Ticaret'],
  firinci: ['İşletme', 'Ticaret'],
  kasap: ['Ticaret'],
  eczaci: ['Ticaret'],
  kitapci: ['Ticaret'],
  marangoz: ['Atölye', 'Depo'],
  manav: ['Ticaret', 'İşletme'],
  lokantaci: ['İşletme', 'Ticaret'],
  demirci: ['Atölye'],
  amele: []
};
function supportsProfessionAt(property, professionId) {
  return Boolean(property && venueTypesByProfession[professionId]?.includes(property.type));
}

function CityScene({ selected, owned, ownerByProperty = {}, playerId = 'solo', onSelect, hour, overlay }) {
  const host = useRef(null);
  const overlayRef = useRef(null);
  const selectRef = useRef(onSelect);
  const selectedRef = useRef(selected);
  const hourRef = useRef(hour);
  const cameraControlRef = useRef(null);
  useEffect(() => { selectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);
  useEffect(() => { hourRef.current = hour; }, [hour]);
  useEffect(() => {
    const property = properties.find(item => item.id === selected);
    if (property) cameraControlRef.current?.('focus', property);
  }, [selected]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const scene = new THREE.Scene();
    const dayBackground = new THREE.Color('#e8e6de');
    const duskBackground = new THREE.Color('#b9b7b0');
    const nightBackground = new THREE.Color('#202b3b');
    scene.background = dayBackground.clone();
    scene.fog = new THREE.Fog('#e8e6de', 42, 88);
    const camera = new THREE.PerspectiveCamera(38, el.clientWidth / el.clientHeight, 0.1, 160);
    camera.position.set(12, 13, 17);
    camera.lookAt(0, 0, 0);
    const isMobileScene = window.matchMedia('(max-width: 760px)').matches || navigator.maxTouchPoints > 0;
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobileScene, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileScene ? 1.35 : 1.8));
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

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: '#d8d5ca', roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.08;
    ground.receiveShadow = true;
    scene.add(ground);

    // Procedural, tileable cobblestone texture adds surface detail without hundreds of extra meshes.
    const cobbleCanvas = document.createElement('canvas');
    cobbleCanvas.width = 512; cobbleCanvas.height = 1024;
    const cobbleCtx = cobbleCanvas.getContext('2d');
    cobbleCtx.fillStyle = '#8e8d86'; cobbleCtx.fillRect(0, 0, 512, 1024);
    let cobbleSeed = 1923;
    const seededRandom = () => { cobbleSeed = (cobbleSeed * 1664525 + 1013904223) >>> 0; return cobbleSeed / 4294967296; };
    const stoneRows = 36;
    for (let row = 0; row < stoneRows; row++) {
      const y = row * (1024 / stoneRows);
      const rowHeight = 1024 / stoneRows;
      const offset = row % 2 ? -18 : 0;
      for (let x = offset - 70; x < 560; ) {
        const stoneW = 28 + seededRandom() * 24;
        const stoneH = rowHeight * (0.72 + seededRandom() * 0.18);
        const shade = Math.round(126 + seededRandom() * 42);
        cobbleCtx.fillStyle = `rgb(${shade},${shade - 1},${shade - 7})`;
        cobbleCtx.beginPath();
        cobbleCtx.moveTo(x + 2, y + 2);
        cobbleCtx.lineTo(x + stoneW - 3, y + seededRandom() * 4 + 2);
        cobbleCtx.lineTo(x + stoneW - seededRandom() * 4, y + stoneH);
        cobbleCtx.lineTo(x + seededRandom() * 5 + 2, y + stoneH - 2);
        cobbleCtx.closePath(); cobbleCtx.fill();
        cobbleCtx.strokeStyle = 'rgba(52,53,49,.34)'; cobbleCtx.lineWidth = 2; cobbleCtx.stroke();
        cobbleCtx.strokeStyle = 'rgba(242,235,218,.13)'; cobbleCtx.lineWidth = 1;
        cobbleCtx.beginPath(); cobbleCtx.moveTo(x + 4, y + 5); cobbleCtx.lineTo(x + stoneW - 6, y + 5); cobbleCtx.stroke();
        x += stoneW;
      }
    }
    for (let speck = 0; speck < 1800; speck++) {
      const shade = Math.round(70 + seededRandom() * 100);
      cobbleCtx.fillStyle = `rgba(${shade},${shade},${shade - 3},.16)`;
      cobbleCtx.fillRect(seededRandom() * 512, seededRandom() * 1024, 1 + seededRandom() * 2, 1 + seededRandom() * 2);
    }
    const cobbleTexture = new THREE.CanvasTexture(cobbleCanvas);
    cobbleTexture.colorSpace = THREE.SRGBColorSpace;
    cobbleTexture.wrapS = THREE.RepeatWrapping; cobbleTexture.wrapT = THREE.RepeatWrapping;
    cobbleTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    const streetMat = new THREE.MeshStandardMaterial({ color: '#d1cec5', map: cobbleTexture, roughness: 1 });
    const street = new THREE.Mesh(new THREE.PlaneGeometry(11.5, 48), streetMat);
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, 0, 0);
    street.receiveShadow = true;
    scene.add(street);
    const crossStreet = new THREE.Mesh(new THREE.PlaneGeometry(48, 3.4), streetMat);
    crossStreet.rotation.x = -Math.PI / 2;
    crossStreet.position.set(0, 0.005, -12.8);
    crossStreet.receiveShadow = true;
    scene.add(crossStreet);
    for (const sideX of [-13.5, 13.5]) {
      const sideStreet = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 48), streetMat);
      sideStreet.rotation.x = -Math.PI / 2;
      sideStreet.position.set(sideX, 0.002, 0);
      sideStreet.receiveShadow = true;
      scene.add(sideStreet);
    }

    const stoneMat = new THREE.MeshStandardMaterial({ color: '#c7c2b6', roughness: 1 });
    const curbMat = new THREE.MeshStandardMaterial({ color: '#d8d1c2', roughness: 0.96 });
    const pavingMats = ['#c7c2b6', '#bcb7aa', '#d1cabc'].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1 }));
    // Continuous sidewalks and stone curbs make the road read as a street, not a floating plane.
    for (const side of [-1, 1]) {
      const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 48), pavingMats[0]);
      sidewalk.rotation.x = -Math.PI / 2; sidewalk.position.set(side * 6.85, -0.005, 0); sidewalk.receiveShadow = true; scene.add(sidewalk);
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 48), curbMat);
      curb.position.set(side * 5.72, 0.035, 0); curb.receiveShadow = true; scene.add(curb);
      for (let z = -18; z <= 23; z += 1.35) {
        const tile = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.025, 1.22), pavingMats[Math.abs(Math.round(z * 10)) % 3]);
        tile.position.set(side * 6.85, 0.012, z); tile.receiveShadow = true; scene.add(tile);
      }
    }
    for (const side of [-1, 1]) {
      const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(48, 1.9), pavingMats[1]);
      sidewalk.rotation.x = -Math.PI / 2; sidewalk.position.set(0, 0.002, side * 5.55); sidewalk.receiveShadow = true; scene.add(sidewalk);
      const curb = new THREE.Mesh(new THREE.BoxGeometry(48, 0.12, 0.14), curbMat);
      curb.position.set(0, 0.035, side * 5.15); scene.add(curb);
    }
    // Galata tramway: twin steel rails, stone sleepers and overhead electric wires.
    const railMat = new THREE.MeshStandardMaterial({ color: '#555954', metalness: 0.62, roughness: 0.48 });
    const sleeperMat = new THREE.MeshStandardMaterial({ color: '#786c5b', roughness: 1 });
    for (const x of [-0.58, 0.58]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.045, 48), railMat);
      rail.position.set(x, 0.045, 0); rail.receiveShadow = true; scene.add(rail);
    }
    for (let z = -23; z <= 23; z += 0.72) {
      const sleeper = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.035, 0.13), sleeperMat);
      sleeper.position.set(0, 0.018, z); scene.add(sleeper);
    }
    const wireMat = new THREE.MeshStandardMaterial({ color: '#555b58', metalness: 0.55, roughness: 0.5 });
    const wirePoleMat = new THREE.MeshStandardMaterial({ color: '#4f554f', roughness: 0.8 });
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 48, 6), wireMat);
    wire.position.set(0, 4.15, 0); scene.add(wire);
    for (const z of [-21, -14, -7, 0, 7, 14, 21]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 4.1, 7), wirePoleMat);
      pole.position.set(2.85, 2.05, z); scene.add(pole);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.045, 0.045), wirePoleMat);
      arm.position.set(1.42, 4.0, z); scene.add(arm);
      const contact = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.9, 5), wireMat);
      contact.rotation.z = Math.PI / 2; contact.position.set(1.42, 4.12, z); scene.add(contact);
    }

    // Small horse-drawn carts add low-cost ambient motion to the historic streets.
    const traffic = [];
    const makeCart = (startZ, laneX, direction, bodyColor) => {
      const cart = new THREE.Group();
      const wood = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.9 });
      const dark = new THREE.MeshStandardMaterial({ color: '#49392c', roughness: 0.95 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: '#4a3c30', roughness: 0.95 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.28, 1.05), wood);
      body.position.set(0, 0.55, 0); body.castShadow = true; cart.add(body);
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.12, 0.3), dark);
      seat.position.set(0, 0.78, -0.28); cart.add(seat);
      for (const side of [-1, 1]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.09, 12), wheelMat);
        wheel.rotation.z = Math.PI / 2; wheel.position.set(side * 0.4, 0.34, 0.05); wheel.castShadow = true; cart.add(wheel);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.1, 8), dark);
        hub.rotation.z = Math.PI / 2; hub.position.set(side * 0.4, 0.34, 0.05); cart.add(hub);
      }
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.85), dark);
      shaft.position.set(0, 0.43, direction > 0 ? 0.88 : -0.88); cart.add(shaft);
      // More organic horse silhouette: rounded body, sloped neck, muzzle, ears, mane and jointed legs.
      const horseMat = new THREE.MeshStandardMaterial({ color: '#765039', roughness: 0.96 });
      const horseLightMat = new THREE.MeshStandardMaterial({ color: '#8d6548', roughness: 0.98 });
      const maneMat = new THREE.MeshStandardMaterial({ color: '#30251f', roughness: 1 });
      const hoofMat = new THREE.MeshStandardMaterial({ color: '#342b25', roughness: 1 });
      const horse = new THREE.Group();
      const torso = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 9), horseMat);
      torso.scale.set(0.43, 0.48, 1.02); torso.position.set(0, 0.77, 0); torso.castShadow = true; horse.add(torso);
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8), horseMat);
      shoulder.scale.set(0.78, 1.12, 0.92); shoulder.position.set(0, 0.78, 0.34); horse.add(shoulder);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.22, 0.67, 9), horseLightMat);
      neck.position.set(0, 1.05, 0.48); neck.rotation.x = -0.42; neck.castShadow = true; horse.add(neck);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), horseMat);
      head.scale.set(0.76, 1.12, 1.25); head.position.set(0, 1.36, 0.72); horse.add(head);
      const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), horseLightMat);
      muzzle.scale.set(0.8, 0.78, 1.15); muzzle.position.set(0, 1.27, 0.91); horse.add(muzzle);
      for (const side of [-1, 1]) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.19, 6), horseMat);
        ear.position.set(side * 0.11, 1.57, 0.69); ear.rotation.z = side * -0.16; horse.add(ear);
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 5), hoofMat);
        eye.position.set(side * 0.16, 1.39, 0.75); horse.add(eye);
      }
      const mane = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.48, 0.3), maneMat);
      mane.position.set(0, 1.22, 0.43); mane.rotation.x = -0.32; horse.add(mane);
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.075, 0.44, 7), maneMat);
      tail.position.set(0, 0.72, -0.49); tail.rotation.x = -0.45; horse.add(tail);
      const legs = [];
      for (const x of [-0.15, 0.15]) for (const z of [-0.3, 0.34]) {
        const leg = new THREE.Group();
        leg.position.set(x, 0.53, z);
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.31, 7), horseMat);
        upper.position.y = -0.12; leg.add(upper);
        const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.24, 7), horseLightMat);
        lower.position.y = -0.34; leg.add(lower);
        const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.11), hoofMat);
        hoof.position.set(0, -0.49, 0.015); leg.add(hoof);
        horse.add(leg); legs.push(leg);
      }
      horse.position.set(0, 0, direction > 0 ? 1.55 : -1.55);
      cart.add(horse);
      cart.position.set(laneX, 0, startZ);
      cart.rotation.y = direction > 0 ? 0 : Math.PI;
      scene.add(cart);
      traffic.push({ cart, laneX, direction, speed: 1.15 + Math.random() * 0.45, wheels: cart.children.filter(child => child.geometry?.type === 'CylinderGeometry'), legs: horse.children.filter(child => child.geometry?.type === 'BoxGeometry' && child.position.y === 0.28) });
    };
    makeCart(-18, -3.05, 1, '#79563b');
    makeCart(9, 3.05, -1, '#8a6240');

    const buildingMeshes = [];
    const addBuilding = (p, idx, isOwned, ownerInfo, currentPlayerId) => {
      const group = new THREE.Group();
      const isShopfront = ['Ticaret', 'İşletme'].includes(p.type) || [1, 4, 7, 9, 10, 12].includes(p.id);
      const isGrandFacade = p.floors >= 4 || [4, 8, 10, 21, 24, 27].includes(p.id);
      const isTimberHouse = [6, 11, 22, 30].includes(p.id);
      const w = [4, 10, 21, 24, 27].includes(p.id) ? 2.75 : [9, 25, 31].includes(p.id) ? 2.45 : 2.05;
      const d = [2, 8, 21, 24, 27].includes(p.id) ? 2.35 : 1.9;
      const floorHeight = isGrandFacade ? 0.91 : 0.88;
      const h = p.floors * floorHeight;
      const facadeColors = ['#d9c8ad', '#c6b8a4', '#c7c0b3', '#d5c4a8', '#d4cbb9', '#c9b6a2', '#d8cbb4', '#c7c2b5', '#cbbca6', '#d7c8b0', '#d0c3af', '#bfae98'];
      const baseColor = ownerInfo ? (ownerInfo.playerId === currentPlayerId ? '#b9c8b2' : '#b8c8d9') : (isOwned ? '#b9c8b2' : facadeColors[idx % facadeColors.length]);
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
      const windowCols = isGrandFacade || p.type === 'Konut' && p.floors >= 4 ? 3 : 2;
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
      if ([2, 5, 6, 8, 22, 24, 27, 30].includes(p.id) || (p.type === 'Konut' && p.floors >= 4)) {
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
      if ([2, 4, 8, 10, 21, 24, 27].includes(p.id) || (p.type === 'Konut' && p.floors >= 4)) {
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

        // Small product silhouettes make shop windows feel stocked without expensive assets.
        const displayColors = p.id === 15 ? ['#d8d0b9', '#78908a', '#b3a17e'] :
          [7, 23, 29].includes(p.id) ? ['#8c5947', '#c7a56b', '#6f8060'] :
          [12, 25, 31].includes(p.id) ? ['#9b7959', '#e0c99c', '#6f8b83'] :
          [9, 32].includes(p.id) ? ['#c6b89c', '#8d9aab', '#b56e55'] :
          ['#c7a56b', '#8c9a7c', '#b56e55'];
        for (let itemIndex = 0; itemIndex < 3; itemIndex++) {
          const item = new THREE.Mesh(
            new THREE.BoxGeometry(0.13, 0.17 + (itemIndex % 2) * 0.06, 0.12),
            new THREE.MeshStandardMaterial({ color: displayColors[itemIndex], roughness: 0.88 })
          );
          item.position.set(-w * 0.31 + itemIndex * 0.3, 0.34 + (itemIndex % 2) * 0.025, d / 2 + 0.13);
          item.castShadow = true;
          group.add(item);
        }
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
        ctx.fillStyle = '#f0dfb7'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // Storefronts use their actual in-world business names, not generic category labels.
        const displayName = String(p.name || 'Mahalle Dükkanı').normalize('NFC').toLocaleUpperCase('tr-TR');
        const words = displayName.split(/\s+/);
        const lines = [];
        let line = '';
        for (const word of words) {
          const candidate = line ? line + ' ' + word : word;
          if (ctx.measureText(candidate).width > 440 && line) { lines.push(line); line = word; }
          else line = candidate;
        }
        if (line) lines.push(line);
        const signLines = lines.slice(0, 2);
        ctx.font = 'bold ' + (signLines.some(text => text.length > 16) ? '25px' : signLines.some(text => text.length > 11) ? '30px' : '36px') + ' Georgia, serif';
        if (signLines.length === 1) ctx.fillText(signLines[0], 256, 64, 470);
        else {
          ctx.fillText(signLines[0], 256, 43, 470);
          ctx.fillText(signLines[1], 256, 84, 470);
        }
        const signTexture = new THREE.CanvasTexture(signCanvas);
        signTexture.colorSpace = THREE.SRGBColorSpace;
        const signMat = new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.8 });
        const signBoard = new THREE.Mesh(new THREE.BoxGeometry(w * 0.86, 0.28, 0.07), signMat);
        signBoard.position.set(0, 1.16, d / 2 + 0.09); group.add(signBoard);

        if ([1, 7, 10, 12, 23, 25, 28, 31].includes(p.id)) {
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
      // Face each main frontage toward the street.
      group.rotation.y = (p.x < 0 ? Math.PI / 2 : -Math.PI / 2) + (p.rotation || 0);
      group.userData.propertyId = p.id;
      scene.add(group);
      buildingMeshes.push(group);
    };

    properties.forEach((p, i) => addBuilding(p, i, owned.includes(p.id), ownerByProperty[p.id], playerId));

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
      b.position.set(side * (24.0 + (i % 3) * 0.8), 0, -20 + i * 4.3);
      scene.add(b);
    }

    // Close the gaps between landmark lots with attached late-Ottoman / early-Republic buildings.
    // The narrow parcels and shared side walls create a continuous Beyoglu street wall.
    const infillColors = ['#c9b8a4', '#d6c8b4', '#b9c4c0', '#c8b4a9', '#d8cbb8', '#b9c2ca', '#cdb9a5'];
    for (const frontageX of [-8.5, 8.5, -18.5, 18.5]) {
      const row = properties.filter(p => Math.abs(p.x - frontageX) < 2.5).sort((a, b) => a.z - b.z);
      for (let j = 0; j < row.length - 1; j++) {
        const gapZ = (row[j].z + row[j + 1].z) / 2;
        const facadeWidth = 3.75 + (j % 3) * 0.12;
        const depth = 2.15;
        const height = 2.15 + ((j + Math.round(Math.abs(frontageX))) % 4) * 0.55;
        const infill = new THREE.Group();
        const wallMat = new THREE.MeshStandardMaterial({ color: infillColors[(j + Math.round(Math.abs(frontageX))) % infillColors.length], roughness: 0.96 });
        const detailMat = new THREE.MeshStandardMaterial({ color: '#e6dac6', roughness: 0.92 });
        const glassMat = new THREE.MeshStandardMaterial({ color: '#52666a', roughness: 0.55 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(facadeWidth, height, depth), wallMat);
        body.position.y = height / 2; body.castShadow = true; body.receiveShadow = true; infill.add(body);
        const cornice = new THREE.Mesh(new THREE.BoxGeometry(facadeWidth + 0.12, 0.1, depth + 0.12), detailMat);
        cornice.position.y = height - 0.08; infill.add(cornice);
        const floorCount = Math.max(2, Math.floor(height / 0.9));
        for (let floor = 0; floor < floorCount; floor++) {
          for (let col = 0; col < 2; col++) {
            const wx = (col - 0.5) * 0.82;
            const win = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.42, 0.04), glassMat);
            win.position.set(wx, 0.48 + floor * 0.82, depth / 2 + 0.025); infill.add(win);
            const frame = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.055), detailMat);
            frame.position.set(wx, 0.72 + floor * 0.82, depth / 2 + 0.045); infill.add(frame);
            const sill = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.06), detailMat);
            sill.position.set(wx, 0.25 + floor * 0.82, depth / 2 + 0.045); infill.add(sill);
          }
        }
        infill.position.set(frontageX + (frontageX < 0 ? 0.1 : -0.1), 0, gapZ);
        infill.rotation.y = frontageX < 0 ? Math.PI / 2 : -Math.PI / 2;
        scene.add(infill);
      }
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
    tram.position.set(0, 0, -15);
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
    const coatColors = ['#303943', '#51413b', '#555b48', '#796044', '#393b42', '#765b58', '#46584e', '#6d6b63', '#343d49'];
    const trouserColors = ['#343638', '#484641', '#575148', '#3b4146'];
    const hatColors = ['#292c30', '#494137', '#5a5145'];
    const skinColors = ['#c99671', '#b77e5d', '#d3a17f', '#8f6048'];
    const makePedestrian = (axis, lane, phase, speed, direction, coatColor, hasHat, outfit = 0) => {
      const person = new THREE.Group();
      const coat = new THREE.MeshStandardMaterial({ color: coatColor, roughness: 0.96 });
      const skin = new THREE.MeshStandardMaterial({ color: skinColors[Math.floor(Math.random() * skinColors.length)], roughness: 1 });
      const trousers = new THREE.MeshStandardMaterial({ color: trouserColors[outfit % trouserColors.length], roughness: 1 });
      const shoes = new THREE.MeshStandardMaterial({ color: '#302f2c', roughness: 1 });
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.38, 0.14), coat);
      torso.position.y = 0.64;
      person.add(torso);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 9, 7), skin);
      head.position.y = 0.91;
      person.add(head);
      if (hasHat) {
        const hatMaterial = new THREE.MeshStandardMaterial({ color: hatColors[outfit % hatColors.length], roughness: 1 });
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(outfit % 4 === 0 ? 0.155 : 0.14, outfit % 4 === 0 ? 0.155 : 0.14, 0.035, 8), hatMaterial);
        brim.position.y = 1.015;
        person.add(brim);
        const crown = new THREE.Mesh(new THREE.CylinderGeometry(outfit % 4 === 0 ? 0.105 : 0.09, 0.105, outfit % 4 === 0 ? 0.085 : 0.11, 8), hatMaterial);
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
      pedestrians.push({ person, axis, lane, phase, speed, direction, leftLeg, rightLeg, leftArm, rightArm, crowdIndex: pedestrians.length });
    };
    const mainStreetLanes = [-2.65, -1.55, 1.25, 2.55];
    for (let i = 0; i < 18; i++) {
      makePedestrian('z', mainStreetLanes[i % mainStreetLanes.length], (i * 0.137) % 1, 0.022 + (i % 3) * 0.004, i % 2 === 0 ? 1 : -1, coatColors[i % coatColors.length], i % 4 !== 1, i);
    }
    const crossStreetLanes = [-1.1, 1.8, 2.65];
    for (let i = 0; i < 12; i++) {
      makePedestrian('x', crossStreetLanes[i % crossStreetLanes.length], (i * 0.173 + 0.09) % 1, 0.015 + (i % 2) * 0.004, i % 2 === 0 ? 1 : -1, coatColors[(i + 2) % coatColors.length], i % 3 !== 1, i + 2);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const target = new THREE.Vector3(0, 0, 0);
    const targetGoal = target.clone();
    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    let theta = Math.atan2(camera.position.x, camera.position.z);
    let radius = camera.position.distanceTo(target);
    let phi = Math.acos(camera.position.y / radius);
    let thetaGoal = theta;
    let radiusGoal = radius;
    let phiGoal = phi;
    let dragMode = 'pan';
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const placeCamera = () => {
      phi = clamp(phi, 0.28, 1.28);
      radius = clamp(radius, 5.5, 40);
      target.x = clamp(target.x, -34, 34);
      target.z = clamp(target.z, -34, 34);
      camera.position.set(
        target.x + radius * Math.sin(phi) * Math.sin(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(target);
    };
    cameraControlRef.current = (action, property) => {
      if (action === 'in') radiusGoal = clamp(radiusGoal * 0.82, 5.5, 40);
      else if (action === 'out') radiusGoal = clamp(radiusGoal * 1.22, 5.5, 55);
      else if (action === 'focus' && property) {
        targetGoal.set(clamp(property.x || 0, -34, 34), 0, clamp(property.z || 0, -34, 34));
        radiusGoal = Math.min(radiusGoal, 13);
        phiGoal = 0.72;
      } else {
        radiusGoal = 43; thetaGoal = Math.PI / 4; phiGoal = 0.78; targetGoal.set(0, 0, 0);
      }
    };
    const activePointers = new Map();
    let pinchDistance = 0;
    const pointerDistance = () => {
      const points = [...activePointers.values()];
      if (points.length < 2) return 0;
      return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    };
    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0 && event.button !== 2) return;
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      dragging = true;
      if (activePointers.size === 1) {
        moved = false; lastX = event.clientX; lastY = event.clientY;
        // Mouse: left drag rotates, right/shift drag pans. Touch: one finger rotates.
        dragMode = event.pointerType === 'touch' ? 'rotate' : (event.button === 2 || event.shiftKey ? 'pan' : 'rotate');
      } else {
        moved = true;
        pinchDistance = pointerDistance();
      }
      renderer.domElement.style.cursor = 'grabbing';
      renderer.domElement.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event) => {
      if (!activePointers.has(event.pointerId)) return;
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (activePointers.size >= 2) {
        const nextDistance = pointerDistance();
        if (pinchDistance > 0 && nextDistance > 0) {
          radiusGoal = clamp(radiusGoal * (pinchDistance / nextDistance), 5.5, 40);
          if (Math.abs(nextDistance - pinchDistance) > 1) moved = true;
        }
        pinchDistance = nextDistance;
        return;
      }
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      if (dragMode === 'rotate') {
        thetaGoal -= dx * 0.006;
        phiGoal = clamp(phiGoal + dy * 0.004, 0.28, 1.28);
      } else {
        const panScale = radiusGoal * 0.0017;
        targetGoal.x = clamp(targetGoal.x - dx * panScale * Math.cos(thetaGoal) + dy * panScale * Math.sin(thetaGoal) * 0.45, -42, 42);
        targetGoal.z = clamp(targetGoal.z + dx * panScale * Math.sin(thetaGoal) + dy * panScale * Math.cos(thetaGoal) * 0.45, -42, 42);
      }
      lastX = event.clientX; lastY = event.clientY;
    };
    const onPointerUp = (event) => {
      if (event?.pointerId != null) activePointers.delete(event.pointerId);
      dragging = activePointers.size > 0;
      pinchDistance = activePointers.size >= 2 ? pointerDistance() : 0;
      if (activePointers.size === 1) {
        const remaining = [...activePointers.values()][0];
        lastX = remaining.x; lastY = remaining.y;
      }
      if (!dragging) renderer.domElement.style.cursor = 'grab';
    };
    const onWheel = (event) => {
      event.preventDefault();
      // Exponential, clamped dolly input avoids large jumps on high-resolution trackpads.
      const zoomFactor = Math.exp(clamp(event.deltaY, -120, 120) * 0.00115);
      radiusGoal = clamp(radiusGoal * zoomFactor, 5.5, 55);
    };
    const onContextMenu = (event) => event.preventDefault();
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
    renderer.domElement.addEventListener('contextmenu', onContextMenu);
    renderer.domElement.style.cursor = 'grab';

    let frame;
    const startedAt = performance.now();
    let lastCameraFrame = startedAt;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const now = performance.now();
      const elapsed = (now - startedAt) / 1000;
      // Frame-rate-independent damping makes zoom, pan, rotate and focus glide into place.
      const delta = Math.min(0.05, Math.max(0, (now - lastCameraFrame) / 1000));
      lastCameraFrame = now;
      const ease = 1 - Math.exp(-delta * 10);
      radius += (radiusGoal - radius) * ease;
      theta += (thetaGoal - theta) * ease;
      phi += (phiGoal - phi) * ease;
      target.lerp(targetGoal, ease);
      placeCamera();
      traffic.forEach(({ cart, laneX, direction, speed, wheels, legs }) => {
        cart.position.z += direction * speed * delta;
        if (cart.position.z > 25) cart.position.z = -25;
        if (cart.position.z < -25) cart.position.z = 25;
        wheels.forEach(wheel => { wheel.rotation.x += direction * speed * delta * 2.4; });
        legs.forEach((leg, index) => { leg.rotation.x = Math.sin(elapsed * 7 + index * Math.PI) * 0.22; });
      });
      const currentHour = hourRef.current;
      const selectedProperty = properties.find(p => p.id === selectedRef.current);
      if (selectedProperty) {
        selectionRing.position.set(selectedProperty.x, 0.035, selectedProperty.z);
        if (overlayRef.current) {
          const anchor = new THREE.Vector3(selectedProperty.x, selectedProperty.floors * 0.88 + 0.65, selectedProperty.z);
          anchor.project(camera);
          const x = (anchor.x * 0.5 + 0.5) * el.clientWidth;
          const y = (-anchor.y * 0.5 + 0.5) * el.clientHeight;
          const visible = anchor.z > -1 && anchor.z < 1 && x > 0 && x < el.clientWidth && y > 0 && y < el.clientHeight;
          overlayRef.current.style.left = `${x}px`;
          overlayRef.current.style.top = `${y}px`;
          overlayRef.current.style.visibility = visible ? 'visible' : 'hidden';
        }
      }
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
      tram.position.z = -23 + ((elapsed * 1.45) % 46);
      const currentHour = hourRef.current ?? 12;
      const peakCrowd = currentHour >= 7 && currentHour < 9 ? 22 : currentHour >= 12 && currentHour < 14 ? 26 : currentHour >= 17 && currentHour < 20 ? 30 : currentHour >= 9 && currentHour < 17 ? 18 : currentHour >= 20 && currentHour < 22 ? 11 : 6;
      pedestrians.forEach((ped, i) => {
        ped.person.visible = ped.crowdIndex < peakCrowd;
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
      renderer.domElement.removeEventListener('contextmenu', onContextMenu);
      scene.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [owned, ownerByProperty, playerId]);

  return <div className="scene-host" ref={host} aria-label="Beyoğlu 1923 3D mahalle sahnesi"><div className="scene-building-overlay" ref={overlayRef}>{overlay}</div><div className="map-zoom-controls"><button type="button" aria-label="Yakınlaştır" title="Yakınlaştır" onClick={() => cameraControlRef.current?.('in')}>＋</button><button type="button" aria-label="Uzaklaştır" title="Uzaklaştır" onClick={() => cameraControlRef.current?.('out')}>−</button><button type="button" aria-label="Seçili binaya git" title="Seçili binaya git" onClick={() => cameraControlRef.current?.('focus', properties.find(item => item.id === selected))}>⌖</button><button type="button" aria-label="Haritayı sıfırla" title="Haritayı sıfırla" onClick={() => cameraControlRef.current?.('reset')}>⌂</button></div><div className="map-hint">Binaya tıkla: seç · Ara: mülk bul · Sürükle: haritayı döndür · Sağ tuş: taşı</div></div>;
}

function App({ session = null, supabase = null, authConfigured = false }) {
  const saveKey = session?.user?.id ? `${SAVE_KEY}:${session.user.id}` : SAVE_KEY;
  const saveBackupKey = session?.user?.id ? `${SAVE_BACKUP_KEY}:${session.user.id}` : SAVE_BACKUP_KEY;
  const [cloudReady, setCloudReady] = useState(!session || !supabase);
  const [sharedRentByProperty, setSharedRentByProperty] = useState({});
  const saveRef = useRef(undefined);
  if (saveRef.current === undefined) {
    try {
      saveRef.current = typeof window !== 'undefined'
        ? JSON.parse(window.localStorage.getItem(saveKey) || 'null') || {}
        : {};
    } catch {
      saveRef.current = {};
    }
  }
  const primarySaved = saveRef.current || {};
  let backupSaved = {};
  if (typeof window !== 'undefined') {
    try { backupSaved = JSON.parse(window.localStorage.getItem(saveBackupKey) || 'null') || {}; } catch { backupSaved = {}; }
  }
  const saved = !Array.isArray(primarySaved.owned) && Array.isArray(backupSaved.owned) && backupSaved.owned.length > 0
    ? backupSaved
    : primarySaved;
  const [steps, setSteps] = useState(() => Number.isFinite(saved.steps) ? saved.steps : 0);
  const [cash, setCash] = useState(() => {
    const hasProperty = Array.isArray(saved.owned) && saved.owned.length > 0;
    // Upgrade legacy fresh saves from the old ₺75 start to the new starter fund.
    if (!hasProperty && Number(saved.economyVersion || 0) < STARTER_ECONOMY_VERSION && (!Number.isFinite(saved.cash) || saved.cash <= 75)) return STARTING_CASH;
    return Number.isFinite(saved.cash) ? saved.cash : STARTING_CASH;
  });
  const [owned, setOwned] = useState(() => Array.isArray(saved.owned) ? saved.owned.filter(id => properties.some(p => p.id === id)) : []);
  const [rented, setRented] = useState(() => Array.isArray(saved.rented) ? saved.rented.filter(id => properties.some(p => p.id === id)) : []);
  const [unitOwners, setUnitOwners] = useState(() => saved.unitOwners && typeof saved.unitOwners === 'object' ? saved.unitOwners : {});
  const [unitRented, setUnitRented] = useState(() => saved.unitRented && typeof saved.unitRented === 'object' ? saved.unitRented : {});
  const [buildingLevels, setBuildingLevels] = useState(() => saved.buildingLevels && typeof saved.buildingLevels === 'object' ? saved.buildingLevels : {});
  const [selectedUnit, setSelectedUnit] = useState(1);
  const [selected, setSelected] = useState(() => properties.some(p => p.id === saved.selected) ? saved.selected : 1);
  const [mapSearch, setMapSearch] = useState(() => properties.find(p => p.id === saved.selected)?.name || properties[0].name);
  const [activeHudPanel, setActiveHudPanel] = useState(null);
  useEffect(() => { const property = properties.find(p => p.id === selected); if (property) setMapSearch(property.name); }, [selected]);
  const [notice, setNotice] = useState('');
  const [showPortfolio, setShowPortfolio] = useState(() => Boolean(saved.showPortfolio));
  const [portfolioDetailId, setPortfolioDetailId] = useState(null);
  const [professionId, setProfessionId] = useState(() => ['kolonyaci', 'leblebici', 'terzi', 'matbaaci', 'kahveci', 'firinci', 'kasap', 'eczaci', 'kitapci', 'marangoz', 'manav', 'lokantaci', 'demirci', 'amele'].includes(saved.professionId) ? saved.professionId : 'amele');
  const [hour, setHour] = useState(() => Number.isInteger(saved.hour) && saved.hour >= 0 && saved.hour <= 23 ? saved.hour : 8);
  const [day, setDay] = useState(() => Number.isInteger(saved.day) && saved.day >= 1 && saved.day <= 30 ? saved.day : 1);
  const [month, setMonth] = useState(() => Number.isInteger(saved.month) && saved.month >= 1 && saved.month <= 12 ? saved.month : 1);
  const [year, setYear] = useState(() => Number.isInteger(saved.year) && saved.year >= 1923 ? saved.year : 1923);
  const [workHours, setWorkHours] = useState(() => Number.isInteger(saved.workHours) && saved.workHours >= 0 ? saved.workHours : 0);
  const [careerHours, setCareerHours] = useState(() => Number.isInteger(saved.careerHours) && saved.careerHours >= 0 ? saved.careerHours : 0);
  const [shopPropertyId, setShopPropertyId] = useState(() => Number.isInteger(saved.shopPropertyId) ? saved.shopPropertyId : null);
  const [wineBottles, setWineBottles] = useState(() => Number.isInteger(saved.wineBottles) && saved.wineBottles >= 0 ? saved.wineBottles : 0);
  const [businessPlans, setBusinessPlans] = useState(() => saved.businessPlans && typeof saved.businessPlans === 'object' ? saved.businessPlans : {});
  const [stockByProperty, setStockByProperty] = useState(() => saved.stockByProperty && typeof saved.stockByProperty === 'object' ? saved.stockByProperty : {});
  const [businessStats, setBusinessStats] = useState(() => saved.businessStats && typeof saved.businessStats === 'object' ? saved.businessStats : {});
  const [pendingProductions, setPendingProductions] = useState({});
  const [productionNow, setProductionNow] = useState(Date.now());
  useEffect(() => { if (!Object.keys(pendingProductions).length) return; const timer = setInterval(() => setProductionNow(Date.now()), 250); return () => clearInterval(timer); }, [pendingProductions]);
  const productionTimersRef = useRef({});
  const [multiplayerRole, setMultiplayerRole] = useState('solo');
  const [multiplayerStatus, setMultiplayerStatus] = useState('Solo oyun');
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState(() => typeof saved.playerName === 'string' ? saved.playerName : '');
  const [opponentName, setOpponentName] = useState('Diğer oyuncu');
  const [ownerByProperty, setOwnerByProperty] = useState(() => Object.fromEntries(
    (Array.isArray(saved.owned) ? saved.owned : []).map(id => [id, {
      playerId: 'solo',
      name: typeof saved.playerName === 'string' && saved.playerName.trim() ? saved.playerName.trim() : 'Ben'
    }])
  ));
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [offerPriceInput, setOfferPriceInput] = useState('');
  const [offerComposerOpen, setOfferComposerOpen] = useState(false);
  const [marketValues, setMarketValues] = useState(() => saved.marketValues && typeof saved.marketValues === 'object' ? saved.marketValues : {});
  const playerId = multiplayerRole === 'host' || multiplayerRole === 'guest' ? multiplayerRole : (session?.user?.id || 'solo');
  const peerRef = useRef(null);
  const connectionRef = useRef(null);
  const actionRefs = useRef({});
  const snapshotRef = useRef(null);

  const sendPeerMessage = (message) => { if (connectionRef.current?.open) connectionRef.current.send(message); };
  const sendAction = () => false;
  const publishOwners = (nextOwners) => { setOwnerByProperty(nextOwners); sendPeerMessage({ type: 'world-update', owners: nextOwners, playerName: playerName.trim() || 'Oyuncu' }); };
  const getMarketValue = property => Math.max(1,Math.round((Number(marketValues[property.id])||property.price)*100)/100);
  const updateMarketValues = (nextYear,nextMonth) => setMarketValues(old=>Object.fromEntries(properties.map(property=>{
    const current=Number(old[property.id])||property.price;
    const cycle=Math.sin((nextYear-1923)*0.38+nextMonth*0.72)*0.0035;
    const inflation=0.004+Math.min(0.006,Math.max(-0.002,cycle));
    const area=[1,4,10,12].includes(property.id)?0.0022:[3,17,18].includes(property.id)?-0.0008:0;
    const demand=property.type==='Ticaret'?0.0012:property.type==='Konut'?0.0007:property.type==='Atölye'?0.0003:0;
    const next=current*(1+inflation+area+demand-0.001+(Math.random()-0.5)*0.018);
    return [property.id,Math.max(property.price*0.45,Math.min(property.price*3.5,Math.round(next*100)/100))];
  })));
  const sendOffer = () => {
    if(multiplayerRole==='solo'||!connectionRef.current?.open){setNotice('Teklifin ulaşması için iki oyuncunun da aynı odaya bağlı olması gerekir.');setMultiplayerStatus('Teklif gönderilemedi: oyuncu bağlantısı açık değil.');return;}
    const owner=ownerByProperty[active.id] || snapshotRef.current?.owners?.[active.id]; if(!owner||owner.playerId===playerId){setNotice('Bu mülk başka oyuncuya ait olmalı.');return;}
    const price=Math.round(Number(offerPriceInput)*100)/100;
    if(!Number.isFinite(price)||price<=0){setNotice('Geçerli bir teklif tutarı gir.');return;}
    if(cash<price){setNotice('Teklifin ₺'+price.toLocaleString('tr-TR')+' ama nakdin yeterli değil.');return;}
    const offer={id:String(Date.now())+'-'+Math.random().toString(36).slice(2,6),propertyId:active.id,price,fromPlayerId:playerId,toPlayerId:owner.playerId,fromName:playerName.trim()||(playerId==='host'?'Ev sahibi':'Oyuncu 2'),toName:owner.name,marketValue:getMarketValue(active)};
    sendPeerMessage({type:'offer',offer});setMultiplayerStatus(active.name+' için ₺'+price.toLocaleString('tr-TR')+' teklif gönderildi.');setNotice('Teklif gönderildi; karşı oyuncu kabul edebilir, reddedebilir veya karşı teklif verebilir.');setOfferComposerOpen(false);
  };
  const respondToOffer = (decision,counterPrice) => {
    if(!incomingOffer)return; const offer=incomingOffer; const property=properties.find(p=>p.id===offer.propertyId);
    if(incomingOffer.isCounter){
      if(decision==='accept' && property){const price=Number(incomingOffer.price);if(cash<price){setNotice('Karşı teklifi kabul etmek için nakdin yeterli değil.');return;}const nextOwners={...ownerByProperty,[property.id]:{playerId,name:playerName.trim()||(playerId==='host'?'Ev sahibi':'Oyuncu 2')}};setCash(v=>Math.max(0,Math.round((v-price)*100)/100));setOwned(old=>old.includes(property.id)?old:[...old,property.id]);setRented(old=>old.filter(id=>id!==property.id));setOwnerByProperty(nextOwners);sendPeerMessage({type:'offer-response',decision:'accept',accepted:true,offer:{...offer,price},owners:nextOwners});tell('Karşı teklif kabul edildi: '+property.name+' ₺'+price.toLocaleString('tr-TR'));}
      else sendPeerMessage({type:'offer-response',decision:'reject',accepted:false,offer,owners:ownerByProperty});setIncomingOffer(null);return;
    }
    if(decision==='counter'){const price=Math.round(Number(counterPrice)*100)/100;if(!Number.isFinite(price)||price<=0){setNotice('Geçerli bir karşı teklif gir.');return;}
      sendPeerMessage({type:'offer-response',decision:'counter',accepted:false,offer:{...offer,counterPrice:price},fromName:playerName.trim()||'Mülk sahibi',owners:ownerByProperty});setIncomingOffer(null);setMultiplayerStatus('Karşı teklif gönderildi: ₺'+price.toLocaleString('tr-TR'));return;}
    const accepted=decision==='accept';
    if(accepted&&property){setOwned(old=>old.filter(id=>id!==property.id));setRented(old=>old.filter(id=>id!==property.id));setCash(v=>Math.round((v+offer.price)*100)/100);const nextOwners={...ownerByProperty,[property.id]:{playerId:offer.fromPlayerId,name:offer.fromName}};publishOwners(nextOwners);tell(property.name+' satıldı. ₺'+offer.price.toLocaleString('tr-TR')+' tahsil edildi.');}
    sendPeerMessage({type:'offer-response',decision:accepted?'accept':'reject',accepted,offer,owners:accepted&&property?{...ownerByProperty,[offer.propertyId]:{playerId:offer.fromPlayerId,name:offer.fromName}}:ownerByProperty});setIncomingOffer(null);
  };
  const handleOfferResponse = message => {
    const offer=message?.offer;if(!offer)return;
    if(message.decision==='counter'&&offer.fromPlayerId===playerId){setIncomingOffer({...offer,price:offer.counterPrice,fromName:message.fromName||ownerByProperty[offer.propertyId]?.name||'Mülk sahibi',isCounter:true});setOfferPriceInput(String(offer.counterPrice));setMultiplayerStatus('Karşı teklif geldi: ₺'+Number(offer.counterPrice).toLocaleString('tr-TR'));return;}
    if(message.accepted&&offer.toPlayerId===playerId&&offer.fromPlayerId!==playerId){const property=properties.find(p=>p.id===offer.propertyId);if(property){setCash(v=>Math.round((v+Number(offer.price))*100)/100);setOwned(old=>old.filter(id=>id!==property.id));setRented(old=>old.filter(id=>id!==property.id));setOwnerByProperty(message.owners||ownerByProperty);tell(property.name+' karşı teklifle satıldı. ₺'+Number(offer.price).toLocaleString('tr-TR')+' tahsil edildi.');}setIncomingOffer(null);return;}
    if(message.accepted&&offer.fromPlayerId===playerId){const price=Number(offer.price);if(cash<price){setNotice('Teklif kabul edildi ancak nakdin artık yeterli değil.');return;}setCash(v=>Math.max(0,Math.round((v-price)*100)/100));setOwned(old=>old.includes(offer.propertyId)?old:[...old,offer.propertyId]);setRented(old=>old.filter(id=>id!==offer.propertyId));setOwnerByProperty(message.owners||ownerByProperty);tell((properties.find(p=>p.id===offer.propertyId)?.name||'Mülk')+' ₺'+price.toLocaleString('tr-TR')+' bedelle satın alındı.');setIncomingOffer(null);}
    else if(message.decision==='reject'&&offer.fromPlayerId===playerId){setIncomingOffer(null);setNotice('Satın alma teklifin reddedildi.');}
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
  const [log, setLog] = useState(() => Array.isArray(saved.log) && saved.log.length ? saved.log.slice(0, 5) : [{ id: 0, text: 'Beyoğlu’na geldin. Gündelik işlerle sermaye biriktir, ilk dükkânını al ve işletmeni büyüt.' }]);
  const professionOptions = [
    { id: 'kolonyaci', name: 'Kolonyacı', gross: 15, overhead: 7, description: 'Kolonya, koku ve kişisel bakım ürünleri.' },
    { id: 'leblebici', name: 'Leblebici', gross: 13, overhead: 4, description: 'Kuruyemiş ve leblebi; düşük sermayeli ticaret.' },
    { id: 'terzi', name: 'Terzi', gross: 16, overhead: 5, description: 'Siparişle çalışır; düzenli müşteri kazandırır.' },
    { id: 'matbaaci', name: 'Matbaacı', gross: 19, overhead: 9, description: 'Daha yüksek gelir, daha pahalı malzeme ve bakım.' },
    { id: 'kahveci', name: 'Kahveci', gross: 15, overhead: 10, description: 'Müşteri trafiğine ve sarf malzemesine bağlı.' },
    { id: 'firinci', name: 'Fırıncı', gross: 17, overhead: 11, description: 'Un, yakıt ve günlük üretim maliyeti.' },
    { id: 'kasap', name: 'Kasap', gross: 18, overhead: 12, description: 'Soğuk zincir yok; günlük taze ürün ve fire riski.' },
    { id: 'eczaci', name: 'Eczacı', gross: 18, overhead: 8, description: 'Daha pahalı stok, daha düşük satış hacmi.' },
    { id: 'kitapci', name: 'Kitapçı ve kırtasiyeci', gross: 14, overhead: 5, description: 'Kitap, defter ve yazı malzemeleri.' },
    { id: 'marangoz', name: 'Marangoz', gross: 18, overhead: 9, description: 'Sipariş, kereste ve atölye giderleri.' },
    { id: 'manav', name: 'Manav', gross: 14, overhead: 7, description: 'Günlük tedarik, hızlı satış ve bozulma riski.' },
    { id: 'lokantaci', name: 'Lokantacı', gross: 16, overhead: 13, description: 'Yemek satışı, malzeme ve günlük mutfak gideri.' },
    { id: 'demirci', name: 'Demirci', gross: 19, overhead: 10, description: 'Metal, kömür ve sipariş bazlı üretim.' },
    { id: 'amele', name: 'Gündelik işçi', gross: 13, overhead: 0, description: 'Dükkan gerekmez; çalıştığın saat kadar ücret.' }
  ];
  const tradeCatalog = {
    1: [{ id: 'kolonya', name: 'Kolonya ve koku', cost: 12, price: 2.2, units: 10 }, { id: 'sabun', name: 'Sabun ve bakım', cost: 9, price: 1.8, units: 10 }],
    4: [{ id: 'han', name: 'Han odası kiralama', cost: 0, price: 0, units: 0 }],
    7: [{ id: 'sarap-uretim', name: 'Ev yapımı şarap üretimi', cost: 8, price: 4.5, units: 4, production: true }, { id: 'sarap', name: 'Toptan şişe şarap', cost: 8, price: 4.5, units: 4 }, { id: 'erzak', name: 'Kuru erzak', cost: 10, price: 2.5, units: 8 }, { id: 'zeytin', name: 'Zeytin ve peynir', cost: 11, price: 3, units: 8 }],
    9: [{ id: 'baski', name: 'Basılı ilan ve evrak', cost: 14, price: 4, units: 6 }, { id: 'defter', name: 'Defter ve kırtasiye', cost: 10, price: 2.8, units: 8 }],
    10: [{ id: 'kumas', name: 'Kumaş ve hazır giyim', cost: 18, price: 5.5, units: 7 }, { id: 'ithalat', name: 'İthal küçük eşya', cost: 20, price: 6, units: 7 }, { id: 'kitap', name: 'Kitap ve kırtasiye', cost: 14, price: 4.2, units: 8 }],
    12: [{ id: 'kahve', name: 'Kahve ve çay', cost: 12, price: 3.5, units: 10 }, { id: 'tatli', name: 'Şerbet ve tatlı', cost: 10, price: 3, units: 8 }],
    13: [{ id: 'ekmek', name: 'Ekmek', cost: 8, price: 2.8, units: 8 }, { id: 'pogaca', name: 'Poğaça ve çörek', cost: 10, price: 4, units: 8 }],
    14: [{ id: 'et', name: 'Günlük et', cost: 18, price: 5.5, units: 5 }, { id: 'sakatat', name: 'Sakatat ve kemik suyu', cost: 10, price: 3.5, units: 5 }],
    15: [{ id: 'ilac', name: 'Temel ilaçlar', cost: 20, price: 6, units: 5 }, { id: 'bakim', name: 'Merhem ve bakım ürünleri', cost: 12, price: 4, units: 5 }],
    16: [{ id: 'kitap', name: 'Kitap', cost: 16, price: 5, units: 6 }, { id: 'kirtasiye', name: 'Defter ve kalem', cost: 10, price: 3.5, units: 6 }],
    17: [{ id: 'mobilya', name: 'Küçük ahşap eşya', cost: 18, price: 7, units: 4, production: true }, { id: 'tamir', name: 'Tamir ve marangozluk işi', cost: 10, price: 4, units: 4 }],
    18: [{ id: 'sebze', name: 'Mevsim sebzesi', cost: 9, price: 3, units: 5 }, { id: 'meyve', name: 'Meyve sepeti', cost: 12, price: 4, units: 5 }],
    19: [{ id: 'yemek', name: 'Günün yemeği', cost: 16, price: 5.5, units: 5 }, { id: 'corba', name: 'Çorba ve ekmek', cost: 10, price: 3.5, units: 5 }],
    20: [{ id: 'demir', name: 'Metal eşya', cost: 20, price: 7, units: 4, production: true }, { id: 'tamirat', name: 'Demir tamiratı', cost: 12, price: 4.5, units: 4 }],
    21: [{ id: 'han-odasi', name: 'Han odası kiralama', cost: 0, price: 0, units: 0 }, { id: 'koli', name: 'Toptan erzak ve yük', cost: 22, price: 7, units: 8 }],
    23: [{ id: 'aktar', name: 'Baharat ve şifalı otlar', cost: 12, price: 4.5, units: 8 }, { id: 'sabun', name: 'Sabun ve bakım', cost: 9, price: 3.2, units: 8 }],
    25: [{ id: 'kahve-galata', name: 'Kahve ve çay', cost: 12, price: 4.2, units: 10 }, { id: 'tatli-galata', name: 'Şerbet ve tatlı', cost: 10, price: 3.5, units: 8 }],
    26: [{ id: 'dikim', name: 'Özel dikim', cost: 16, price: 6.5, units: 5, production: true }, { id: 'tamir-giysi', name: 'Giysi tamiri', cost: 8, price: 4, units: 6 }],
    28: [{ id: 'bakkal', name: 'Temel erzak', cost: 13, price: 4, units: 10 }, { id: 'konserve', name: 'Kavanoz ve konserve', cost: 11, price: 3.6, units: 8 }],
    29: [{ id: 'sabun-imalat', name: 'Sabun üretimi', cost: 14, price: 6, units: 6, production: true }, { id: 'temizlik', name: 'Temizlik malzemesi', cost: 10, price: 3.8, units: 8 }],
    31: [{ id: 'lokanta-galata', name: 'Günün yemeği', cost: 16, price: 6.5, units: 8 }, { id: 'meze', name: 'Meze ve sıcak çorba', cost: 11, price: 4.5, units: 8 }],
    32: [{ id: 'baski-galata', name: 'Basılı ilan ve evrak', cost: 14, price: 5, units: 8 }, { id: 'kirtasiye-galata', name: 'Defter ve kırtasiye', cost: 10, price: 3.8, units: 8 }]
  };
  const profession = professionOptions.find(p => p.id === professionId) || professionOptions.find(p => p.id === 'amele');
  const active = properties.find(p => p.id === selected) || properties[0];
  const portfolioDetail = portfolioDetailId == null ? null : properties.find(p => p.id === portfolioDetailId) || null;
  const portfolio = properties.filter(p => owned.includes(p.id));
  const rentedProperties = portfolio.filter(p => rented.includes(p.id));
  const annualRent = portfolio.reduce((sum, p) => sum + p.rent * 12, 0);
  const realizedAnnualRent = rentedProperties.reduce((sum, p) => sum + p.rent * 12, 0);
  const unitRentIncome = Object.entries(unitRented).reduce((sum, [key, activeRent]) => { if (!activeRent) return sum; const [pid] = key.split(':'); const p = properties.find(item => item.id === Number(pid)); const unitOwner = unitOwners[key]; return sum + (p && unitOwner?.playerId === playerId ? p.rent / (p.units || 1) / 30 : 0); }, 0);
  const dailyRentIncome = rentedProperties.reduce((sum, p) => sum + p.rent / 30, 0) + unitRentIncome;
  const selectedVenueCompatible = owned.includes(active.id) && !rented.includes(active.id) && supportsProfessionAt(active, professionId);
  const hasSuitablePremise = portfolio.some(p => !rented.includes(p.id) && supportsProfessionAt(p, professionId));
  const [noticeId, setNoticeId] = useState(0);

  useEffect(() => {
    try {
      const previousSave = JSON.parse(window.localStorage.getItem(SAVE_KEY) || 'null');
      if (previousSave && Array.isArray(previousSave.owned) && previousSave.owned.length > 0) {
        window.localStorage.setItem(saveBackupKey, JSON.stringify(previousSave));
      }
      window.localStorage.setItem(saveKey, JSON.stringify({
        version: 3, economyVersion: STARTER_ECONOMY_VERSION, playerName, steps, cash, owned, rented, unitOwners, unitRented, buildingLevels, selected, showPortfolio, professionId, marketValues,
        hour, day, month, year, workHours, careerHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, businessStats, log: log.slice(0, 5)
      }));
    } catch {
      // The game remains playable if browser storage is disabled or full.
    }
  }, [playerName, steps, cash, owned, rented, unitOwners, unitRented, buildingLevels, selected, showPortfolio, professionId, marketValues, hour, day, month, year, workHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, businessStats, log]);

  useEffect(() => {
    if (!session || !supabase) { setCloudReady(true); return undefined; }
    let active = true;
    const userId = session.user.id;
    const displayName = String(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Mahalle sakini').slice(0, 24);
    const refreshWorld = async () => {
      const { data, error } = await supabase.from('world_properties').select('property_id,market_value,owner_user_id,owner_name,rented');
      if (error) throw error;
      if (!active || !Array.isArray(data)) return;
      const owners = {};
      const values = {};
      const mine = [];
      const rentState = {};
      for (const row of data) {
        if (row.owner_user_id) owners[row.property_id] = { playerId: row.owner_user_id, name: row.owner_name || 'Mahalle sakini' };
        if (row.owner_user_id === userId) mine.push(Number(row.property_id));
        rentState[row.property_id] = Boolean(row.rented);
        if (Number.isFinite(Number(row.market_value))) values[row.property_id] = Number(row.market_value);
      }
      setOwnerByProperty(owners);
      setSharedRentByProperty(rentState);
      setMarketValues(old => ({ ...old, ...values }));
      setOwned(mine);
    };
    const hydrate = async () => {
      try {
        const { error: profileError } = await supabase.from('player_profiles').upsert({
          user_id: userId, display_name: displayName, updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
        if (profileError) throw profileError;
        const { data: cloudSave, error: saveError } = await supabase.from('player_saves').select('state').eq('user_id', userId).maybeSingle();
        if (saveError) throw saveError;
        if (cloudSave?.state && Object.keys(cloudSave.state).length) {
          let state = cloudSave.state;
          const hasCloudProperty = Array.isArray(state.owned) && state.owned.length > 0;
          const needsStarterGrant = !hasCloudProperty && Number(state.economyVersion || 0) < STARTER_ECONOMY_VERSION && (!Number.isFinite(state.cash) || state.cash <= 75);
          if (needsStarterGrant) {
            state = { ...state, cash: STARTING_CASH, economyVersion: STARTER_ECONOMY_VERSION };
            const { error: migrationError } = await supabase.from('player_saves').upsert({ user_id: userId, state, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
            if (migrationError) throw migrationError;
          }
          if (typeof state.playerName === 'string') setPlayerName(state.playerName || displayName);
          if (Number.isFinite(state.steps)) setSteps(state.steps);
          if (Number.isFinite(state.cash)) setCash(state.cash);
          if (Array.isArray(state.rented)) setRented(state.rented.filter(id => properties.some(p => p.id === id)));
          if (properties.some(p => p.id === state.selected)) setSelected(state.selected);
          if (typeof state.showPortfolio === 'boolean') setShowPortfolio(state.showPortfolio);
          if (['kolonyaci','leblebici','terzi','matbaaci','kahveci','firinci','kasap','eczaci','kitapci','marangoz','manav','lokantaci','demirci','amele'].includes(state.professionId)) setProfessionId(state.professionId);
          if (state.marketValues && typeof state.marketValues === 'object') setMarketValues(state.marketValues);
          if (Number.isFinite(state.hour)) setHour(state.hour);
          if (Number.isFinite(state.day)) setDay(state.day);
          if (Number.isFinite(state.month)) setMonth(state.month);
          if (Number.isFinite(state.year)) setYear(state.year);
          if (Number.isFinite(state.workHours)) setWorkHours(state.workHours);
          if (Number.isFinite(state.careerHours)) setCareerHours(state.careerHours);
          if (state.shopPropertyId == null || properties.some(p => p.id === state.shopPropertyId)) setShopPropertyId(state.shopPropertyId ?? null);
          if (Number.isFinite(state.wineBottles)) setWineBottles(state.wineBottles);
          if (state.businessPlans && typeof state.businessPlans === 'object') setBusinessPlans(state.businessPlans);
          if (state.stockByProperty && typeof state.stockByProperty === 'object') setStockByProperty(state.stockByProperty);
          if (state.businessStats && typeof state.businessStats === 'object') setBusinessStats(state.businessStats);
          if (Array.isArray(state.log)) setLog(state.log.slice(0, 5));
          if (state.developments && typeof state.developments === 'object') setDevelopments(state.developments);
        } else {
          const initialState = { version: 2, economyVersion: STARTER_ECONOMY_VERSION, playerName: displayName, steps, cash: STARTING_CASH, owned: [], rented, selected, showPortfolio, professionId, marketValues, hour, day, month, year, workHours, careerHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, businessStats, log: log.slice(0, 5), developments };
          const { error } = await supabase.from('player_saves').upsert({ user_id: userId, state: initialState, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
          if (error) throw error;
          setPlayerName(displayName);
        }
        await refreshWorld();
        if (!active) return;
        setMultiplayerStatus('Ortak şehir bağlı · herkesin mülkleri aynı haritada');
        setCloudReady(true);
      } catch (error) {
        if (!active) return;
        setMultiplayerStatus('Ortak şehir bağlantı hatası · ' + (error?.message || 'veritabanı ayarlarını kontrol et'));
        setNotice('Ortak şehir açılamadı. Supabase migration ve erişim ayarlarını kontrol et.');
        setCloudReady(true);
      }
    };
    setCloudReady(false);
    hydrate();
    const channel = supabase.channel('mahalle-shared-city')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'world_properties' }, () => {
        refreshWorld().catch(error => { if (active) setMultiplayerStatus('Şehir güncellenemedi · ' + (error?.message || 'bağlantı hatası')); });
      })
      .subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, [session?.user?.id, supabase]);

  useEffect(() => {
    if (!session || !supabase || !cloudReady) return;
    const state = {
      version: 2, economyVersion: STARTER_ECONOMY_VERSION, playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues,
      hour, day, month, year, workHours, careerHours, shopPropertyId, wineBottles, businessPlans, stockByProperty,
      businessStats, log: log.slice(0, 5), developments
    };
    supabase.from('player_saves').upsert({ user_id: session.user.id, state, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .then(({ error }) => { if (error) setMultiplayerStatus('Kayıt eşitlenemedi · ' + error.message); });
  }, [session?.user?.id, supabase, cloudReady, playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues, hour, day, month, year, workHours, careerHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, businessStats, log, developments]);


  const tell = (text) => {
    setNotice(text);
    setNoticeId(v => v + 1);
    setLog(old => [{ id: Date.now(), text }, ...old].slice(0, 5));
  };

  const advanceHour = (work = false) => {
    if (sendAction('advanceHour', work)) return;

    if (hour === 5) {
      const nextDayRaw = day + 1;
      const nextDay = nextDayRaw > 30 ? 1 : nextDayRaw;
      const nextMonthRaw = month + (nextDayRaw > 30 ? 1 : 0);
      const nextMonth = nextMonthRaw > 12 ? 1 : nextMonthRaw;
      const business = settleDailyBusinesses();
      const maintenance = portfolio.reduce((sum, p) => sum + Math.max(0.01, Math.round((getMarketValue(p) * 0.003 / 365) * 100) / 100), 0);
      const dailyCost = DAILY_LIVING_COST + maintenance + business.costs;
      const dailyRent = Math.round(dailyRentIncome * 100) / 100;
      const dailyNet = dailyRent + business.revenue - dailyCost;
      setCash(v => Math.round((v + dailyNet) * 100) / 100);
      setDay(nextDay);
      setMonth(nextMonth);
      const nextYear = nextMonthRaw > 12 ? year + 1 : year;
      if (nextDayRaw > 30) updateMarketValues(nextYear, nextMonth);
      if (nextMonthRaw > 12) setYear(v => v + 1);
      setHour(6);
      setWorkHours(0);
      tell(`Yeni gün başladı. Kira +₺${dailyRent.toFixed(2)}, gün içi işletme satışları kasaya işlendi, yaşam ve bakım -₺${(DAILY_LIVING_COST + maintenance).toFixed(2)}, işletme gideri -₺${business.costs.toFixed(2)}; net ₺${dailyNet.toFixed(2)}.${business.entries.length ? ' ' + business.entries.slice(0, 3).join(' · ') : ''}`);
      return;
    }
    const isWorkingHour = hour >= 8 && hour < 19;
    const hourlySales = isWorkingHour ? processBusinessSales(1) : { revenue: 0, entries: [], salesByProperty: {}, stockChanges: {} };
    if (Object.keys(hourlySales.salesByProperty).length) setStockByProperty(old => ({ ...old, ...hourlySales.stockChanges }));
    if (Object.keys(hourlySales.salesByProperty).length) {
      setBusinessStats(old => {
        const next = { ...old };
        Object.entries(hourlySales.salesByProperty).forEach(([id, sale]) => {
          const previous = next[id] || { unitsSold: 0, revenue: 0, stockInvested: 0 };
          const productUnitsSold = { ...(previous.productUnitsSold || {}) }; Object.entries(sale.products || {}).forEach(([productId, productSale]) => { const oldProduct = productUnitsSold[productId] || { units: 0, revenue: 0 }; productUnitsSold[productId] = { units: oldProduct.units + productSale.units, revenue: Math.round((oldProduct.revenue + productSale.revenue) * 100) / 100 }; }); next[id] = { ...previous, productUnitsSold, unitsSold: previous.unitsSold + sale.units, revenue: Math.round((previous.revenue + sale.revenue) * 100) / 100 };
        });
        return next;
      });
    }
    let laborNet = 0;
    let detail = '';
    if (hourlySales.entries.length) {
      detail = 'İşletme satışları: ' + hourlySales.entries.join(' · ');
    }
    if (work && isWorkingHour) {
      const variance = 0.82 + Math.random() * 0.36;
      if (owned.length > 0 && !shopOpen) {
        laborNet = 0;
        detail = (detail ? detail + ' · ' : '') + 'Artık ücretli gündelik iş yerine mülküne odaklanmalısın; kendi iş yerini açıp stok hazırlayarak ve satış yaparak kazanabilirsin.';
      } else if (owned.length === 0) {
        const wage = Math.round(profession.gross * variance * 100) / 100;
        laborNet = wage;
        detail = (detail ? detail + ' · ' : '') + `Gündelik işçilik: saatlik ücret ${wage.toFixed(2)} oyun lirası`;
      } else if (!shopOpen && owned.length === 0) {
        const gross = Math.round(profession.gross * variance * 100) / 100;
        const supplies = Math.round((profession.overhead * 0.12 + 0.35) * 100) / 100;
        laborNet = gross - supplies;
        detail = (detail ? detail + ' · ' : '') + `${profession.name}: iş hasılatı ${gross.toFixed(2)}, malzeme ${supplies.toFixed(2)}`;
      } else {
        detail = (detail ? detail + ' · ' : '') + `${profession.name}: kendi iş yerindeki satışlar sürdü; ücret yerine işletme geliri kazandın`;
      }
      setWorkHours(v => v + 1);
      setCareerHours(v => v + 1);
      if (careerHours === 4 && owned.length === 0) tell('✦ HEDEF TAMAMLANDI: İlk 5 çalışma saatini tamamladın. Sıradaki hedefin ilk mülkünü edinmek.');
    } else if (work && !isWorkingHour) {
      detail = 'Bu saatte iş bulmak zor. Dinlenmeyi veya saati ilerletmeyi seçtin.';
    }
    // All owned businesses add their takings independently of the player's profession income.
    const net = hourlySales.revenue + laborNet;
    setCash(v => Math.max(0, Math.round((v + net) * 100) / 100));
    const nextHour = (hour + 1) % 24;
    setHour(nextHour);
    setSteps(v => v + 1);
    if (detail) tell(`${String(hour).padStart(2, '0')}:00 — ${detail}. Net değişim: ${net >= 0 ? '+' : ''}${net.toFixed(2)} oyun lirası.`);
    else tell(`${String(hour).padStart(2, '0')}:00 — Sokak sakin. Bu saatte düzenli bir gelir elde etmedin.`);
  };

  // Calendar-driven demand shocks: event dates use the game's 30-day monthly calendar.
  const activeEconomicEvents = () => {
    const events = [];
    const inDays = (m, days) => month === m && days.includes(day);
    const isFood = product => /kahve|tatli|ekmek|pogaca|et|sakatat|yemek|corba|erzak|zeytin|meyve|sebze|bakkal|konserve|koli|meze|sarap/i.test(product?.id || '');
    const isGiftOrRetail = product => /kumas|ithalat|kitap|kirtasiye|oyuncak|kolonya|sabun|bakim|saat|mobilya|cicek|cicekci/i.test((product?.id || '') + ' ' + (product?.name || ''));
    const isEntertainment = property => [12,19,25,31,53,55,56,57,58,59,62].includes(property?.id);
    const isBookshop = property => [9,16,32,45].includes(property?.id);
    const isPharmacy = property => property?.id === 15 || /eczane|eczacı/i.test(property?.name || '');
    const isBusiness = property => ['İşletme','Atölye','Ticaret'].includes(property?.type);

    if ((month === 12 && day >= 30) || (month === 1 && day <= 2)) {
      events.push({ id: 'new-year', name: 'Yılbaşı alışverişi', detail: 'Yılbaşı alışverişi ticareti canlandırıyor.', effect: (p, product) => ({ sales: isFood(product) || isGiftOrRetail(product) || isEntertainment(p) ? 1.35 : 1.08, chance: 1.18 }) });
    }
    if (inDays(12, [24,25,26])) {
      events.push({ id: 'christmas', name: 'Noel dönemi', detail: 'Noel dönemi hediyelik, yiyecek ve eğlence harcamalarını artırıyor.', effect: (p, product) => ({ sales: isGiftOrRetail(product) || isFood(product) || isEntertainment(p) ? 1.28 : 1.03, chance: 1.12 }) });
    }
    if (inDays(4, [23])) {
      events.push({ id: 'national-sovereignty', name: '23 Nisan', detail: '23 Nisan kutlamaları ailelerin yiyecek ve küçük alışveriş harcamalarını artırıyor.', effect: (p, product) => ({ sales: isFood(product) || isGiftOrRetail(product) || isEntertainment(p) ? 1.25 : 1.04, chance: 1.12 }) });
    }
    if (inDays(5, [1])) {
      events.push({ id: 'labour-day', name: '1 Mayıs', detail: '1 Mayıs nedeniyle ticari tempo yavaşlıyor; kahvehane ve yemek işletmeleri hareketleniyor.', effect: (p, product) => ({ sales: isFood(product) || isEntertainment(p) ? 1.12 : 0.88, chance: 0.92 }) });
    }
    if (inDays(5, [19])) {
      events.push({ id: 'youth-sports', name: '19 Mayıs', detail: '19 Mayıs etkinlikleri yeme-içme ve eğlence talebini yükseltiyor.', effect: (p, product) => ({ sales: isFood(product) || isEntertainment(p) ? 1.32 : 1.06, chance: 1.16 }) });
    }
    if (inDays(8, [30])) {
      events.push({ id: 'victory-day', name: '30 Ağustos', detail: 'Zafer Bayramı kutlamaları cadde ticaretini ve yeme-içme talebini artırıyor.', effect: (p, product) => ({ sales: isFood(product) || isGiftOrRetail(product) || isEntertainment(p) ? 1.28 : 1.05, chance: 1.14 }) });
    }
    if ((month === 10 && [28,29].includes(day))) {
      events.push({ id: 'republic-day', name: '29 Ekim Cumhuriyet Bayramı', detail: 'Cumhuriyet Bayramı kutlamaları nedeniyle merkezde alışveriş ve eğlence talebi artıyor.', effect: (p, product) => ({ sales: isFood(product) || isGiftOrRetail(product) || isEntertainment(p) ? 1.38 : 1.08, chance: 1.2 }) });
    }
    if (month === 9 && day >= 1 && day <= 5) {
      events.push({ id: 'school-opening', name: 'Okullar açılıyor', detail: 'Okul hazırlıkları kitapçı ve kırtasiyelerde satışları artırıyor.', effect: (p, product) => ({ sales: isBookshop(p) || /kitap|defter|kalem|kırtasiye/i.test((product?.id || '') + ' ' + (product?.name || '')) ? 1.75 : 0.96, chance: isBookshop(p) ? 1.45 : 0.98 }) });
    }
    if ([1,2,11,12].includes(month)) {
      events.push({ id: 'winter-illness', name: 'Kış hastalıkları', detail: 'Kış hastalıkları nedeniyle eczane talebi yükseldi; diğer işletmelerde müşteri trafiği azaldı.', effect: (p, product) => isPharmacy(p) ? { sales: 1.8, chance: 1.65 } : { sales: 0.78, chance: 0.82 } });
    }
    if ([6,7,8].includes(month)) {
      events.push({ id: 'summer-tourism', name: 'Yaz sezonu', detail: 'Yaz ziyaretçileri otel, kahve, lokanta ve eğlence işletmelerini canlandırıyor.', effect: (p, product) => ({ sales: isEntertainment(p) || [7,12,19,25,31,53,55,56,57,58,59,62].includes(p?.id) || isFood(product) ? 1.38 : 0.94, chance: isEntertainment(p) ? 1.3 : 1.02 }) });
    }
    if (month === 11 && day >= 15 && day <= 30) {
      events.push({ id: 'rainy-season', name: 'Yağışlı günler', detail: 'Yağışlı günlerde kahve, sıcak yemek ve tamir hizmetlerine talep kayıyor.', effect: (p, product) => ({ sales: /kahve|corba|tamir|tamirat|sakatat/i.test((product?.id || '') + ' ' + (product?.name || '')) ? 1.25 : 0.9, chance: 1.04 }) });
    }
    return events;
  };
  const getEconomicEventEffect = (property, product) => activeEconomicEvents().reduce((total, event) => {
    const effect = event.effect(property, product);
    return { sales: total.sales * effect.sales, chance: total.chance * effect.chance };
  }, { sales: 1, chance: 1 });

  const getBusinessSalesLevel = (propertyId) => {
    const sold = Number(businessStats[propertyId]?.unitsSold) || 0;
    return sold >= 60 ? 5 : sold >= 35 ? 4 : sold >= 15 ? 3 : sold >= 5 ? 2 : 1;
  };
  const STOCK_CAPACITY_BY_LEVEL = [0, 12, 24, 40, 60, 90];
  const STOCK_UPGRADE_COST_BY_LEVEL = [0, 0, 35, 80, 160, 300];
  const getInventoryState = (propertyId, value = stockByProperty[propertyId]) => {
    if (value && typeof value === 'object') return propertyId === 37 ? { materials: value.materials || {}, products: value.products || {} } : { products: value.products || {} };
    const qty = Math.max(0, Number(value) || 0);
    const legacyProduct = businessPlans[propertyId] || (tradeCatalog[propertyId] || []).find(item => item.price > 0)?.id;
    return { products: legacyProduct && qty ? { [legacyProduct]: qty } : {} };
  };
  const getProductStock = (propertyId, productId, value = stockByProperty[propertyId]) => Math.max(0, Number(getInventoryState(propertyId, value).products?.[productId]) || 0);
  const getTotalStock = (propertyId, value = stockByProperty[propertyId]) => Object.values(getInventoryState(propertyId, value).products || {}).reduce((sum, qty) => sum + Math.max(0, Number(qty) || 0), 0);
  const getProductionDuration = (propertyId, productId) => { const seed = String(productId || propertyId).split('').reduce((sum, char) => sum + char.charCodeAt(0), Number(propertyId) || 0); return 2500 + (seed % 6) * 1000; };
  const getPendingUnits = (propertyId) => Object.entries(pendingProductions).reduce((sum, [key, job]) => Number(key.split(':')[0]) === Number(propertyId) ? sum + (Number(job.units) || 0) : sum, 0);
  const getStockCapacity = (propertyId) => {
    const level = Math.max(1, Math.min(5, Number(businessStats[propertyId]?.stockCapacityLevel) || 1));
    return STOCK_CAPACITY_BY_LEVEL[level];
  };
  const processBusinessSales = (hours = 1) => {
    let revenue = 0;
    const localStocks = { ...stockByProperty };
    const entries = [];
    const salesByProperty = {};
    const addSale = (propertyId, productId, units, amount, detail) => {
      revenue += amount;
      const previous = salesByProperty[propertyId] || { units: 0, revenue: 0, products: {} };
      const productPrevious = previous.products?.[productId] || { units: 0, revenue: 0 };
      salesByProperty[propertyId] = { units: previous.units + units, revenue: Math.round((previous.revenue + amount) * 100) / 100, products: { ...(previous.products || {}), [productId]: { units: productPrevious.units + units, revenue: Math.round((productPrevious.revenue + amount) * 100) / 100 } } };
      if (detail && entries.length < 8) entries.push(detail);
    };
    for (let hourIndex = 0; hourIndex < hours; hourIndex++) {
      owned.forEach(propertyId => {
        if (rented.includes(propertyId)) return;
        const property = properties.find(item => item.id === propertyId);
        if (!property || !['İşletme', 'Atölye', 'Ticaret'].includes(property.type)) return;
        if (propertyId === 37) {
          const state = localStocks[37] && typeof localStocks[37] === 'object' ? localStocks[37] : { materials: {}, products: {} };
          const products = { ...(state.products || {}) };
          let changed = false;
          SHOE_RECIPES.forEach(shoe => {
            const stock = Math.max(0, Number(products[shoe.id]) || 0);
            if (!stock || Math.random() > 0.46) return;
            const eventEffect = getEconomicEventEffect(property, { id: shoe.id, name: shoe.name });
            const sold = Math.min(stock, Math.random() > 0.78 ? 2 : 1);
            const amount = Math.round(sold * shoe.price * eventEffect.sales * 100) / 100;
            products[shoe.id] = stock - sold;
            changed = true;
            addSale(37, shoe.id, sold, amount, property.name + ': ' + sold + ' çift ' + shoe.name + ' satıldı (+₺' + amount.toFixed(2) + ')');
          });
          if (changed) localStocks[37] = { ...state, materials: state.materials || {}, products };
          return;
        }
        const inventory = getInventoryState(propertyId, localStocks[propertyId]);
        const products = { ...(inventory.products || {}) };
        (tradeCatalog[propertyId] || []).filter(item => item.price > 0).forEach(product => {
          const serviceSale = Boolean(product.service);
          const stock = serviceSale ? 1 : Math.max(0, Number(products[product.id]) || 0);
          const soldBefore = Number(businessStats[propertyId]?.productUnitsSold?.[product.id]?.units) || 0;
          const reputation = Math.min(100, Math.floor(soldBefore * 1.5));
          const eventEffect = getEconomicEventEffect(property, product);
          const salesChance = Math.min(0.92, (0.34 + (reputation / 100) * 0.12) * eventEffect.chance);
          if ((!serviceSale && stock <= 0) || Math.random() > salesChance) return;
          const sold = serviceSale ? 1 : Math.min(stock, 1 + (Math.random() > 0.72 ? 1 : 0));
          const baseMultiplier = property.type === 'İşletme' ? 2.1 : property.type === 'Atölye' ? 2.0 : 1.7;
          const masteryLevel = soldBefore >= 60 ? 5 : soldBefore >= 35 ? 4 : soldBefore >= 15 ? 3 : soldBefore >= 5 ? 2 : 1;
          const takings = Math.round(sold * product.price * baseMultiplier * (1 + (masteryLevel - 1) * 0.03) * eventEffect.sales * 100) / 100;
          if (!serviceSale) products[product.id] = stock - sold;
          addSale(propertyId, product.id, sold, takings, property.name + ': ' + sold + ' adet ' + product.name + ' satıldı (+₺' + takings.toFixed(2) + ')');
        });
        localStocks[propertyId] = { ...inventory, products };
      });
    }
    return { revenue: Math.round(revenue * 100) / 100, entries, salesByProperty, stockChanges: localStocks };
  };

  const settleDailyBusinesses = () => {
    let operatingCosts = 0;
    const entries = [];
    owned.forEach(propertyId => {
      if (rented.includes(propertyId)) return;
      const property = properties.find(item => item.id === propertyId);
      if (!property || !['İşletme', 'Atölye', 'Ticaret'].includes(property.type)) return;
      const product = (tradeCatalog[propertyId] || []).find(item => item.id === businessPlans[propertyId]);
      if (!product || product.price <= 0) return;
      const dailyCost = property.type === 'İşletme' ? 4.5 : property.type === 'Atölye' ? 3.5 : 2.5;
      operatingCosts += dailyCost;
      const hasStock = getTotalStock(propertyId) > 0;
      if (!hasStock) {
        entries.push(property.name + ': stok bitti, günlük gider -₺' + dailyCost.toFixed(2));
      } else {
        entries.push(property.name + ': günlük işletme gideri -₺' + dailyCost.toFixed(2));
      }
    });
    return { revenue: 0, costs: Math.round(operatingCosts * 100) / 100, entries };
  };

  const sleepUntilMorning = () => {
    if (sendAction('sleepUntilMorning')) return;
    const nextDayRaw = day + 1;
    const nextDay = nextDayRaw > 30 ? 1 : nextDayRaw;
    const nextMonthRaw = month + (nextDayRaw > 30 ? 1 : 0);
    const nextMonth = nextMonthRaw > 12 ? 1 : nextMonthRaw;
    const business = settleDailyBusinesses();
    const sales = processBusinessSales(11);
    setStockByProperty(old => ({ ...old, ...sales.stockChanges }));
    if (Object.keys(sales.salesByProperty).length) {
      setBusinessStats(old => {
        const next = { ...old };
        Object.entries(sales.salesByProperty).forEach(([id, sale]) => {
          const previous = next[id] || { unitsSold: 0, revenue: 0, stockInvested: 0 };
          next[id] = { ...previous, unitsSold: previous.unitsSold + sale.units, revenue: Math.round((previous.revenue + sale.revenue) * 100) / 100 };
        });
        return next;
      });
    }
    const maintenance = portfolio.reduce((sum, p) => sum + Math.max(0.01, Math.round((getMarketValue(p) * 0.003 / 365) * 100) / 100), 0);
    const upkeep = DAILY_LIVING_COST + maintenance + business.costs;
    const rent = Math.round(dailyRentIncome * 100) / 100;
    const net = rent + business.revenue + sales.revenue - upkeep;
    setCash(v => Math.round((v + net) * 100) / 100);
    setDay(nextDay);
    setMonth(nextMonth);
    const nextYear = nextMonthRaw > 12 ? year + 1 : year;
    if (nextDayRaw > 30) updateMarketValues(nextYear, nextMonth);
    if (nextMonthRaw > 12) setYear(v => v + 1);
    setHour(6);
    setWorkHours(0);
    tell(`Gün kapandı. Kira +₺${rent.toFixed(2)}, satış geliri +₺${sales.revenue.toFixed(2)}, yaşam ve bakım -₺${(DAILY_LIVING_COST + maintenance).toFixed(2)}, işletme giderleri -₺${business.costs.toFixed(2)}. Net: ₺${net.toFixed(2)}.${sales.entries.length ? ' ' + sales.entries.slice(0, 5).join(' · ') : ' Bugün satış olmadı.'}`);
  };

  const selectBusinessPlan = (plan) => {
    if (sendAction('selectBusinessPlan', plan)) return;
    setBusinessPlans(old => ({ ...old, [active.id]: plan }));
    tell(`${active.name}: satış grubu ${(tradeCatalog[active.id] || []).find(item => item.id === plan)?.name || 'seçilmedi'} olarak ayarlandı. Satış için ayrıca stok almalısın.`);
  };

  const workAtSelectedBusiness = () => {
    if (!selectedVenueCompatible || rented.includes(active.id)) {
      tell('Bizzat çalışmak için mesleğine uygun, sana ait ve kirada olmayan bir iş yeri seçmelisin.');
      return;
    }
    if (hour < 8 || hour >= 19) {
      tell('Dükkanda çalışmak için mesai saatlerini beklemelisin (08.00–19.00).');
      return;
    }
    const item = (tradeCatalog[active.id] || []).find(product => product.id === businessPlans[active.id]);
    if (!item) {
      tell('Önce iş yerinde satacağın ürünü seç. Ardından stok alabilir veya üretim yapabilirsin.');
      return;
    }
    setClockRunning(false);
    if (item.production || !item.service) {
      const produced = 2;
      setStockByProperty(old => ({ ...old, [active.id]: (Number(old[active.id]) || 0) + produced }));
      tell(`${active.name} içinde bir saat üretim yaptın: ${item.name} için ${produced} adet stok hazırladın. Üretim stokunu artırdı; satış için oyunu ilerlet.`);
    } else {
      tell(`${active.name} içinde satışla ilgilendin. Bu saat ücret değil, stoktaki ürünlerin satış geliri kazandıracak.`);
    }
    advanceHour(true);
    setClockRunning(false);
  };

  const buyShoeMaterial = (materialId) => {
    if (!owned.includes(37) || rented.includes(37)) { tell('Hammadde almak için kunduracı sana ait olmalı ve kirada olmamalı.'); return; }
    const material = SHOE_MATERIALS.find(item => item.id === materialId); if (!material) return;
    const shoeState = stockByProperty[37] && typeof stockByProperty[37] === 'object' ? stockByProperty[37] : { materials: {}, products: {} };
    const materialStock = Math.max(0, Number(shoeState.materials?.[material.id]) || 0);
    const capacity = getStockCapacity(37);
    const quantity = Math.min(material.batch, Math.max(0, capacity - materialStock));
    if (quantity <= 0) { tell('Hammadde deposu dolu: ' + material.name + ' ' + materialStock + '/' + capacity + '. Önce üretim yaparak hammadde tüket.'); return; }
    const cost = Math.round(material.cost * quantity / material.batch * 100) / 100;
    if (cash < cost) { tell(material.name + ' için ₺' + cost + ' gerekiyor.'); return; }
    setCash(v => Math.round((v - cost) * 100) / 100);
    setStockByProperty(old => { const state = old[37] && typeof old[37] === 'object' ? old[37] : { materials: {}, products: {} }; return { ...old, 37: { materials: { ...(state.materials || {}), [material.id]: (Number(state.materials?.[material.id]) || 0) + quantity }, products: state.products || {} } }; });
    setBusinessStats(old => { const prev = old[37] || { unitsSold: 0, revenue: 0, stockInvested: 0 }; return { ...old, 37: { ...prev, stockInvested: Math.round((prev.stockInvested + cost) * 100) / 100 } }; });
    tell('Tedarik tamamlandı: ' + material.name + ' +' + quantity + ' birim. Maliyet ₺' + cost + '.');
  };
  const craftShoe = (shoeId) => {
    if (!owned.includes(37) || rented.includes(37)) { tell('Üretim için kunduracı sana ait olmalı ve kirada olmamalı.'); return; }
    const shoe = SHOE_RECIPES.find(item => item.id === shoeId); if (!shoe) return;
    const workshopLevel = getBusinessSalesLevel(37);
    if ((shoe.unlockLevel || 1) > workshopLevel) { tell(shoe.name + ' için kunduracı seviyesi ' + shoe.unlockLevel + ' gerekli. Şu an seviye ' + workshopLevel + '.'); return; }
    const state = stockByProperty[37] && typeof stockByProperty[37] === 'object' ? stockByProperty[37] : { materials: {}, products: {} };
    const materials = state.materials || {};
    const productStock = Number(state.products?.[shoe.id]) || 0;
    const capacity = getStockCapacity(37);
    if (getTotalStock(37) + getPendingUnits(37) + 1 > capacity) { tell('Vitrin deposu dolu: kapasite ' + capacity + ' çift. Üretim kuyruğu dahil stok sınırına ulaşıldı.'); return; }
    const missing = Object.entries(shoe.recipe).filter(([id, qty]) => (Number(materials[id]) || 0) < qty);
    if (missing.length) { tell('Hammadde eksik: ' + missing.map(([id, qty]) => (SHOE_MATERIALS.find(m => m.id === id)?.name || id) + ' ' + qty).join(', ') + '. Önce tedarik et.'); return; }
    const next = { ...materials }; Object.entries(shoe.recipe).forEach(([id, qty]) => { next[id] = (Number(next[id]) || 0) - qty; });
    const pendingKey = '37:' + shoe.id;
    const duration = getProductionDuration(37, shoe.id);
    setStockByProperty(old => { const current = old[37] && typeof old[37] === 'object' ? old[37] : { materials: {}, products: {} }; return { ...old, 37: { materials: next, products: current.products || {} } }; });
    setPendingProductions(old => ({ ...old, [pendingKey]: { units: (Number(old[pendingKey]?.units) || 0) + 1, readyAt: Date.now() + duration, name: shoe.name, propertyId: 37, productId: shoe.id } }));
    setTimeout(() => {
      setStockByProperty(old => { const current = old[37] && typeof old[37] === 'object' ? old[37] : { materials: {}, products: {} }; return { ...old, 37: { materials: current.materials || {}, products: { ...(current.products || {}), [shoe.id]: (Number(current.products?.[shoe.id]) || 0) + 1 } } }; });
      setPendingProductions(old => { const current = old[pendingKey]; if (!current) return old; const remaining = Math.max(0, (Number(current.units) || 0) - 1); if (remaining > 0) return { ...old, [pendingKey]: { ...current, units: remaining, readyAt: Date.now() + duration } }; const next = { ...old }; delete next[pendingKey]; return next; });
      tell('Üretim tamamlandı: 1 çift ' + shoe.name + '. Vitrine eklendi.');
    }, duration);
    tell('Üretim başladı: ' + shoe.name + '. Tahmini süre ' + (duration / 1000).toFixed(0) + ' saniye.');
  };

  const upgradeBusinessStorage = (propertyId) => {
    if (sendAction('upgradeBusinessStorage', propertyId)) return;
    if (!owned.includes(propertyId) || rented.includes(propertyId)) { tell('Depoyu genişletmek için işletme sana ait olmalı ve kirada olmamalı.'); return; }
    const stats = businessStats[propertyId] || { unitsSold: 0, stockCapacityLevel: 1 };
    const currentLevel = Math.max(1, Math.min(5, Number(stats.stockCapacityLevel) || 1));
    const businessLevel = getBusinessSalesLevel(propertyId);
    if (currentLevel >= 5) { tell('Depo en yüksek seviyede.'); return; }
    if (businessLevel < currentLevel + 1) { tell('Sonraki depo seviyesi için işletme seviyen ' + (currentLevel + 1) + ' olmalı. Şu an ' + businessLevel + '. seviyedesin. Daha fazla ürün sat.'); return; }
    const nextLevel = currentLevel + 1;
    const cost = STOCK_UPGRADE_COST_BY_LEVEL[nextLevel];
    if (cash < cost) { tell('Depo genişletmek için ₺' + cost + ' gerekiyor.'); return; }
    setCash(value => Math.round((value - cost) * 100) / 100);
    setBusinessStats(old => { const prev = old[propertyId] || { unitsSold: 0, revenue: 0, stockInvested: 0 }; return { ...old, [propertyId]: { ...prev, stockCapacityLevel: nextLevel, storageUpgradeSpent: (Number(prev.storageUpgradeSpent) || 0) + cost } }; });
    tell('Depo genişletildi: seviye ' + nextLevel + ', kapasite ' + STOCK_CAPACITY_BY_LEVEL[nextLevel] + ' birim. Ödenen: ₺' + cost + '.');
  };

  const stockBusiness = () => {
    if (sendAction('stockBusiness')) return;
    const item = (tradeCatalog[active.id] || []).find(product => product.id === businessPlans[active.id]);
    if (!owned.includes(active.id) || rented.includes(active.id)) { tell('Stok alabilmek için mülkün sahibi olmalı ve mülk kirada olmamalı.'); return; }
    if (!item || item.units <= 0) { tell('Bu mülk için henüz tedarik edilebilir ürün grubu yok.'); return; }
    if (cash < item.cost) { tell(`İlk stok için ₺${item.cost} gerekiyor.`); return; }
    const currentStock = getProductStock(active.id, item.id);
    const capacity = getStockCapacity(active.id);
    const pendingUnits = Number(pendingProductions[active.id + ':' + item.id]?.units) || 0;
    if (getTotalStock(active.id) + getPendingUnits(active.id) + item.units > capacity) { tell(`Depo dolu: kapasite ${capacity} adet, toplam stok ${getTotalStock(active.id)}, üretimde ${getPendingUnits(active.id)}. Önce satış bekle veya depo genişlet.`); return; }
    setCash(v => Math.round((v - item.cost) * 100) / 100);
    setBusinessStats(old => { const previous = old[active.id] || { unitsSold: 0, revenue: 0, stockInvested: 0 }; return { ...old, [active.id]: { ...previous, stockInvested: Math.round((previous.stockInvested + item.cost) * 100) / 100 } }; });
    if (item.production || !item.service) {
      const pendingKey = active.id + ':' + item.id;
      const duration = getProductionDuration(active.id, item.id);
      setPendingProductions(old => ({ ...old, [pendingKey]: { units: (Number(old[pendingKey]?.units) || 0) + item.units, readyAt: Date.now() + duration, name: item.name, propertyId: active.id, productId: item.id } }));
      setTimeout(() => {
        setStockByProperty(old => { const inventory = getInventoryState(active.id, old[active.id]); return { ...old, [active.id]: { ...inventory, products: { ...inventory.products, [item.id]: getProductStock(active.id, item.id, old[active.id]) + item.units } } }; });
        setPendingProductions(old => { const current = old[pendingKey]; if (!current) return old; const remaining = Math.max(0, (Number(current.units) || 0) - item.units); if (remaining > 0) return { ...old, [pendingKey]: { ...current, units: remaining, readyAt: Date.now() + duration } }; const next = { ...old }; delete next[pendingKey]; return next; });
        tell('Üretim tamamlandı: ' + item.name + ', ' + item.units + ' adet hazır. Vitrin stoğuna eklendi.');
      }, duration);
      tell(item.name + ' üretime alındı. Tahmini süre: ' + (duration / 1000).toFixed(0) + ' saniye. Tamamlanınca stok otomatik eklenecek.');
      return;
    }
    setStockByProperty(old => { const inventory = getInventoryState(active.id, old[active.id]); return { ...old, [active.id]: { ...inventory, products: { ...inventory.products, [item.id]: currentStock + item.units } } }; });
    tell('Tedarik tamamlandı: ' + item.name + ', ' + item.units + ' adet stok, maliyet ₺' + item.cost + '.');
  };

  const buy = async () => {
    if (active.type === 'Konut' && active.units) {
      const key = active.id + ':' + selectedUnit;
      if (unitOwners[key]) { tell('Bu daire zaten satın alınmış.'); return; }
      const price = Math.round(getMarketValue(active) * 1.18 / active.units);
      if (cash < price) { tell('Bu daire için ₺' + price.toLocaleString('tr-TR') + ' gerekiyor.'); return; }
      const next = { ...unitOwners, [key]: { playerId, name: playerName.trim() || 'Mahalle sakini', price } };
      setCash(v => Math.round((v - price) * 100) / 100); setUnitOwners(next);
      sendPeerMessage({type:'world-update', owners:ownerByProperty, unitOwners:next, playerName:playerName.trim() || 'Mahalle sakini'});
      tell(active.name + ' · ' + selectedUnit + '. daire satın alındı. Günlük kira potansiyeli ₺' + (active.rent / active.units / 30).toFixed(2) + '.');
      return;
    }
    if (session && supabase) {
      if (ownerByProperty[active.id] || owned.includes(active.id)) { tell('Bu mülkün zaten bir sahibi var.'); return; }
      try {
        const { data, error } = await supabase.rpc('claim_property', { p_property_id: active.id });
        if (error) throw error;
        const result = Array.isArray(data) ? data[0] : data;
        if (!result || !Number.isFinite(Number(result.cash))) throw new Error('Sunucudan geçerli satın alma sonucu alınamadı.');
        setCash(Number(result.cash));
        setOwned(old => old.includes(active.id) ? old : [...old, active.id]);
        setRented(old => old.filter(id => id !== active.id));
        setOwnerByProperty(old => ({ ...old, [active.id]: { playerId: session.user.id, name: result.owner_name || playerName.trim() || 'Mahalle sakini' } }));
        setShopPropertyId(null);
        setSteps(v => v + 1);
        tell(active.name + ' ortak şehirde satın alındı. Mülkiyet sunucuda güvenceye alındı.');
      } catch (error) { tell(error?.message || 'Mülk satın alınamadı. Bağlantını kontrol edip tekrar dene.'); }
      return;
    }
    if (owned.includes(active.id) || ownerByProperty[active.id]) { tell('Bu mülkün zaten bir sahibi var.'); return; }
    const purchasePrice = getMarketValue(active);
    if (cash < purchasePrice) { tell('Bu mülk için ₺' + purchasePrice.toLocaleString('tr-TR') + ' gerekiyor. Önce çalışıp birikim yap.'); return; }
    setCash(v => v - purchasePrice);
    setOwned(v => [...v, active.id]);
    setRented(v => v.filter(id => id !== active.id));
    publishOwners({ ...ownerByProperty, [active.id]: { playerId, name: playerName.trim() || (playerId === 'host' ? 'Ev sahibi' : playerId === 'guest' ? 'Oyuncu 2' : 'Ben') } });
    setShopPropertyId(null);
    setSteps(v => v + 1);
    tell(`${active.name} satın alındı. ${owned.length === 0 ? '✦ HEDEF TAMAMLANDI: İlk mülkünü edindin! ' : owned.length === 1 ? '✦ HEDEF TAMAMLANDI: İkinci mülkün portföyüne katıldı! ' : owned.length === 2 ? '✦ HEDEF TAMAMLANDI: Üç mülke ulaştın; mahallede yer edinmeye başladın. ' : ''}Şimdi bu mekanın desteklediği işletme türlerinden birini seçebilirsin.`);
  };

  const sellProperty = async () => {
    if (!owned.includes(active.id)) { tell('Yalnızca sahibi olduğun mülkü satabilirsin.'); return; }
    const property = active;
    const salePrice = Math.round(getMarketValue(property) * 0.95 * 100) / 100;
    if (typeof window !== 'undefined' && !window.confirm(`${property.name} mülkünü ₺${salePrice.toLocaleString('tr-TR')} bedelle satmak istiyor musun? Mevcut işletme stoğu satışa dahil değil ve sıfırlanacak.`)) return;
    if (session && supabase) {
      try {
        const { data, error } = await supabase.rpc('release_property', { p_property_id: property.id });
        if (error) throw error;
        const result = Array.isArray(data) ? data[0] : data;
        if (!result || !Number.isFinite(Number(result.cash))) throw new Error('Sunucudan geçerli satış sonucu alınamadı.');
        setCash(Number(result.cash));
        setOwned(v => v.filter(id => id !== property.id));
        setRented(v => v.filter(id => id !== property.id));
        setBusinessPlans(v => { const next = { ...v }; delete next[property.id]; return next; });
        setStockByProperty(v => { const next = { ...v }; delete next[property.id]; return next; });
        setBusinessStats(v => { const next = { ...v }; delete next[property.id]; return next; });
        setOwnerByProperty(v => { const next = { ...v }; delete next[property.id]; return next; });
        if (shopPropertyId === property.id) setShopPropertyId(null);
        tell(property.name + ' ortak şehirde satıldı. ₺' + Number(result.sale_price).toLocaleString('tr-TR') + ' tahsil edildi.');
      } catch (error) { tell(error?.message || 'Mülk satılamadı. Bağlantını kontrol edip tekrar dene.'); }
      return;
    }
    setCash(v => Math.round((v + salePrice) * 100) / 100);
    setOwned(v => v.filter(id => id !== property.id));
    setRented(v => v.filter(id => id !== property.id));
    setBusinessPlans(v => { const next = { ...v }; delete next[property.id]; return next; });
    setStockByProperty(v => { const next = { ...v }; delete next[property.id]; return next; });
    setBusinessStats(v => { const next = { ...v }; delete next[property.id]; return next; });
    const nextOwners = { ...ownerByProperty };
    delete nextOwners[property.id];
    publishOwners(nextOwners);
    if (shopPropertyId === property.id) setShopPropertyId(null);
    tell(`${property.name} satıldı. ₺${salePrice.toLocaleString('tr-TR')} tahsil edildi (piyasa bedelinin %95'i).`);
  };

  const toggleRent = async () => {
    if (sendAction('toggleRent')) return;
    if (session && supabase) {
      if (!owned.includes(active.id)) { tell('Kiraya verebilmek için önce bu mülkü satın almalısın.'); return; }
      const nextRented = !rented.includes(active.id);
      try {
        const { error } = await supabase.rpc('set_property_rented', { p_property_id: active.id, p_rented: nextRented });
        if (error) throw error;
        setRented(old => nextRented ? (old.includes(active.id) ? old : [...old, active.id]) : old.filter(id => id !== active.id));
        setSharedRentByProperty(old => ({ ...old, [active.id]: nextRented }));
        if (nextRented && shopPropertyId === active.id) setShopPropertyId(null);
        tell(nextRented ? active.name + ' ortak şehirde kiraya verildi.' : active.name + ' için kiracılık sona erdi.');
      } catch (error) { tell(error?.message || 'Kira durumu güncellenemedi.'); }
      return;
    }
    if (!owned.includes(active.id)) { tell('Kiraya verebilmek için önce bu mülkü satın almalısın.'); return; }
    if (rented.includes(active.id)) {
      setRented(v => v.filter(id => id !== active.id));
      tell(`${active.name} için kiracılık sona erdi. Bundan sonra kira tahsil edilmeyecek.`);
      return;
    }
    setRented(v => [...v, active.id]);
    if (shopPropertyId === active.id) setShopPropertyId(null);
    tell(`${active.name} kiraya verildi. ${rented.length === 0 ? '✦ HEDEF TAMAMLANDI: İlk kira gelirini başlattın! ' : ''}Günlük kira geliri: ${(active.rent / 30).toFixed(2)}; her yeni günde otomatik tahsil edilir.`);
  };

  const toggleShop = () => {
    if (sendAction('toggleShop')) return;
    if (!owned.includes(selected)) { tell('İşletme açmak için önce seçili mekanı satın almalısın.'); return; }
    if (!owned.includes(active.id) || rented.includes(active.id)) { tell('İşletmeyi açmak için sana ait ve kirada olmayan bir mülk seçmelisin.'); return; }
    setShopPropertyId(shopOpen ? null : selected);
    tell(shopOpen ? 'İşletme kapatıldı; satış ve stok giderleri durdu.' : `${active.name} açıldı. Çalışma saatlerinde satışlar ve stok giderleri işleyecek.`);
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
    if (session && supabase) { tell('Ortak şehirde yeni oyun sıfırlaması şimdilik kapalı; mülk sahipliğinin kaybolmaması için.'); return; }
    if (sendAction('resetGame')) return;
    if (typeof window !== 'undefined' && !window.confirm('Yeni oyun başlatılsın mı? Mevcut mahalle kaydı silinecek.')) return;
    setSteps(0); setCash(STARTING_CASH); setOwned([]); setRented([]); setSelected(1); setShowPortfolio(false);
    setProfessionId('amele'); setHour(8); setDay(1); setMonth(1); setYear(1923);
    setWorkHours(0); setCareerHours(0); setShopPropertyId(null); setWineBottles(0); setBusinessPlans({}); setStockByProperty({}); setBusinessStats({});
    setLog([{ id: Date.now(), text: 'Yeni bir hikaye başladı. Gündelik işçilikle sermaye biriktir veya uygun bir dükkan edin.' }]);
    setNotice('');
    try { window.localStorage.removeItem(saveKey); } catch {}
    tell('Yeni oyun başladı. Kayıt sıfırlandı.');
  };


  const applyWorldState = (message) => {
    if (!message || typeof message !== 'object') return;
    if (message.owners && typeof message.owners === 'object') setOwnerByProperty(message.owners);
    if (message.marketValues && typeof message.marketValues === 'object') setMarketValues(message.marketValues);
    if (message.hostName) setOpponentName(message.hostName);
  };

  const closeMultiplayer = () => {
    try { connectionRef.current?.close(); } catch {}
    try { peerRef.current?.destroy(); } catch {}
    connectionRef.current = null; peerRef.current = null;
    setMultiplayerRole('solo'); setMultiplayerStatus('Solo oyun'); setRoomCode('');
  };

  const peerErrorMessage = (error, joining = false) => {
    const type = error?.type || 'unknown';
    const messages = {
      'unavailable-id': 'Bu oda kodu kullanımda. Yeni oda açmayı dene.',
      'peer-unavailable': 'Bu oda bulunamadı. Ev sahibinden güncel kodu alıp tekrar dene.',
      'network': 'Sinyal sunucusuna ulaşılamıyor. İnternet bağlantısını kontrol et.',
      'server-error': 'Çoklu oyuncu sunucusu geçici olarak yanıt vermiyor.',
      'socket-error': 'Bağlantı sunucusuyla iletişim kesildi.',
      'socket-closed': 'Bağlantı sunucusu bağlantıyı kapattı.',
      'webrtc': 'Tarayıcılar arasında doğrudan bağlantı kurulamadı. Farklı ağlarda veya ağ güvenlik duvarı arkasında bu sorun oluşabilir.',
      'browser-incompatible': 'Bu tarayıcı çoklu oyuncu bağlantısını desteklemiyor.',
      'invalid-id': 'Oda kodu geçersiz.',
      'disconnected': 'Çoklu oyuncu sunucusuyla bağlantı kesildi.'
    };
    return messages[type] || (joining ? `Odaya bağlanılamadı (${type}). Oda kodunu kontrol edip tekrar dene.` : `Oda açılamadı (${type}). Tekrar dene.`);
  };

  const startRoom = () => {
    closeMultiplayer();
    const code = Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0');
    const peerId = 'mahalle' + code.toLowerCase();
    const hostName = playerName.trim() || 'Ev sahibi';
    setOwnerByProperty(Object.fromEntries(owned.map(id => [id, { playerId: 'host', name: hostName }])));
    setRoomCode(code);
    setMultiplayerStatus('Oda sunucuya kaydediliyor…');
    try {
      const peer = new Peer(peerId, { debug: 1 });
      peerRef.current = peer;
      peer.on('open', () => {
        setMultiplayerRole('host');
        setMultiplayerStatus('Oda hazır · kodu diğer oyuncuya gönder');
      });
      peer.on('connection', conn => {
        if (connectionRef.current?.open) { conn.close(); return; }
        connectionRef.current = conn;
        conn.on('open', () => {
          setMultiplayerStatus('Bağlantı kuruldu · oyuncu bilgisi bekleniyor');
          conn.send({ type: 'world-state', owners: snapshotRef.current?.owners || {}, unitOwners, marketValues: snapshotRef.current?.marketValues || {}, hostName });
        });
        conn.on('data', message => {
          if (message?.type === 'hello') {
            setOpponentName(message.playerName || 'Oyuncu 2');
            const mergedOwners = { ...(snapshotRef.current?.owners || {}), ...(message.owners || {}) };
            setOwnerByProperty(mergedOwners);
            conn.send({ type: 'world-state', owners: mergedOwners, unitOwners, marketValues, hostName });
            setMultiplayerStatus(`İki oyuncu bağlı · ${message.playerName || 'Oyuncu 2'}`);
          }
          if (message?.type === 'world-update' && message.owners && typeof message.owners === 'object') {
            if(message.unitOwners)setUnitOwners(message.unitOwners);
            setOwnerByProperty(message.owners);
            conn.send({ type: 'world-state', owners: message.owners, marketValues: message.marketValues || marketValues, hostName });
          }
          if(message?.type==='offer'&&message.offer){const offer=message.offer;if(offer.toPlayerId==='host'||ownerByProperty[offer.propertyId]?.playerId==='host'||snapshotRef.current?.owners?.[offer.propertyId]?.playerId==='host'){setIncomingOffer({...offer,fromName:offer.fromName||'Diğer oyuncu'});setOfferPriceInput(String(offer.price));setMultiplayerStatus('Yeni teklif: '+(properties.find(p=>p.id===offer.propertyId)?.name||'mülk')+' · ₺'+Number(offer.price).toLocaleString('tr-TR'));setNotice('Yeni mülk teklifi geldi. Teklif balonundan yanıt verebilirsin.');}}
          if(message?.type==='offer-response'){handleOfferResponse(message);conn.send({type:'world-state',owners:message.owners||ownerByProperty,marketValues,hostName});}
        });
        conn.on('error', error => setMultiplayerStatus('Oyuncu bağlantısı hatası: ' + (error?.type || 'bağlantı hatası')));
        conn.on('close', () => {
          if (connectionRef.current === conn) connectionRef.current = null;
          setMultiplayerStatus('Oyuncu ayrıldı · oda açık, aynı kodla tekrar katılabilir');
        });
      });
      peer.on('disconnected', () => setMultiplayerStatus('Oda sunucusuyla bağlantı kesildi. İnterneti kontrol et.'));
      peer.on('error', error => setMultiplayerStatus(peerErrorMessage(error)));
    } catch (error) {
      setMultiplayerStatus('Oda başlatılamadı: ' + (error?.message || 'beklenmeyen hata'));
    }
  };

  const joinRoom = () => {
    const code = joinCode.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      setMultiplayerStatus('Oda kodu 6 harf veya rakamdan oluşmalı.');
      return;
    }
    closeMultiplayer();
    setMultiplayerStatus('Oda aranıyor…');
    try {
      const peer = new Peer({ debug: 1 });
      peerRef.current = peer;
      peer.on('open', () => {
        setMultiplayerStatus('Oda bulunduysa bağlantı kuruluyor…');
        const conn = peer.connect('mahalle' + code.toLowerCase(), { reliable: true, serialization: 'json' });
        connectionRef.current = conn;
        let opened = false;
        const timeout = window.setTimeout(() => {
          if (!opened && connectionRef.current === conn) {
            setMultiplayerStatus('Bağlantı zaman aşımına uğradı. Oda kodunu ve ev sahibinin çevrimiçi olduğunu kontrol et.');
            try { conn.close(); } catch {}
          }
        }, 15000);
        conn.on('open', () => {
          opened = true;
          window.clearTimeout(timeout);
          setRoomCode(code);
          setMultiplayerRole('guest');
          setMultiplayerStatus('Bağlandı · oda bilgisi alınıyor');
          conn.send({
            type: 'hello',
            playerName: playerName.trim() || 'Oyuncu 2',
            owners: Object.fromEntries(owned.map(id => [id, { playerId: 'guest', name: playerName.trim() || 'Oyuncu 2' }]))
          });
        });
        conn.on('data', message => {
          if (message?.type === 'world-state') {
            applyWorldState(message); if(message.unitOwners)setUnitOwners(message.unitOwners);
            setMultiplayerStatus(`İki oyuncu bağlı · ev sahibi: ${message.hostName || 'Ev sahibi'}`);
          }
          if(message?.type==='offer'&&message.offer){const offer=message.offer;if(offer.toPlayerId==='guest'||ownerByProperty[offer.propertyId]?.playerId==='guest'||snapshotRef.current?.owners?.[offer.propertyId]?.playerId==='guest'){setIncomingOffer({...offer,fromName:offer.fromName||opponentName});setOfferPriceInput(String(offer.price));setMultiplayerStatus('Yeni teklif: '+(properties.find(p=>p.id===offer.propertyId)?.name||'mülk')+' · ₺'+Number(offer.price).toLocaleString('tr-TR'));setNotice('Yeni mülk teklifi geldi. Teklif balonundan yanıt verebilirsin.');}}
          if(message?.type==='offer-response'){handleOfferResponse(message);if(message.owners)setOwnerByProperty(message.owners);}
        });
        conn.on('error', error => {
          window.clearTimeout(timeout);
          setMultiplayerStatus(peerErrorMessage(error, true));
        });
        conn.on('close', () => {
          window.clearTimeout(timeout);
          if (connectionRef.current === conn) connectionRef.current = null;
          setMultiplayerStatus(opened ? 'Bağlantı kapandı · yeniden katılman gerekiyor' : 'Bağlantı kurulamadı. Ev sahibinin çevrimiçi olduğunu ve oda kodunu kontrol et.');
          setMultiplayerRole('solo');
        });
      });
      peer.on('disconnected', () => setMultiplayerStatus('Oda sunucusuyla bağlantı kesildi. İnterneti kontrol et.'));
      peer.on('error', error => setMultiplayerStatus(peerErrorMessage(error, true)));
    } catch (error) {
      setMultiplayerStatus('Odaya katılınamadı: ' + (error?.message || 'beklenmeyen hata'));
    }
  };

  snapshotRef.current = { owners: ownerByProperty, marketValues, hostName: playerName.trim() || 'Ev sahibi' };
  actionRefs.current = { advanceHour, sleepUntilMorning, clockTick: () => advanceHour(hour >= 8 && hour < 19), selectBusinessPlan, stockBusiness, buy, toggleRent, toggleShop, makeWine, resetGame, selectProperty, changeProfession };
  useEffect(() => {
    if (multiplayerRole === 'guest') return undefined;
    const timer = window.setInterval(() => actionRefs.current.clockTick?.(), 4000);
    return () => window.clearInterval(timer);
  }, [multiplayerRole]);
  useEffect(() => {
    if (multiplayerRole === 'host' && connectionRef.current?.open) connectionRef.current.send({ type: 'world-state', owners: ownerByProperty, marketValues, hostName: playerName.trim() || 'Ev sahibi' });
  }, [multiplayerRole, ownerByProperty, marketValues, playerName]);

  return <main className={'app-shell fullscreen-game ' + (activeHudPanel ? 'hud-open ' + (activeHudPanel === 'social' ? 'hud-social' : 'hud-panel-open hud-panel-' + activeHudPanel) : '')}>
    <header className="topbar hud-topbar">
      <a className="wordmark" href="#" aria-label="Mahalle ana sayfa"><span className="mark">M.</span><span>MAHALLE</span></a>
      <div className="top-center"><span className="live-dot" /> BEYOĞLU · {String(hour).padStart(2, '0')}:00</div>
      <div className="top-actions"><button className="reset-button" onClick={resetGame}>YENİ OYUN ↻</button><button className="avatar-button" onClick={() => setShowPortfolio(v => !v)} aria-label="Portföyü aç">CC</button></div>
    </header>

    <button type="button" className="hud-cash" aria-label="Cepteki sermaye ayrıntıları" onClick={() => setActiveHudPanel(activeHudPanel === 'cash' ? null : 'cash')}><span>₺</span><strong>{cash.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</strong><small>{cash > 0 ? 'SERMAYE' : 'SERMAYE BİTTİ'}</small></button>
    <nav className="hud-dock" aria-label="Oyun menüsü">
      <button className={activeHudPanel === 'property' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'property' ? null : 'property')} aria-label="Seçili mülk" title="Mülk"><span>⌂</span><small>MÜLK</small></button>
      <button className={activeHudPanel === 'business' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'business' ? null : 'business')} aria-label="İşletme ve stok" title="İşletme"><span>▤</span><small>İŞLETME</small></button>
      <button className={activeHudPanel === 'goals' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'goals' ? null : 'goals')} aria-label="Gelişim hedefleri" title="Hedefler"><span>◇</span><small>HEDEFLER</small></button>
      <button className={activeHudPanel === 'portfolio' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'portfolio' ? null : 'portfolio')} aria-label="Portföy" title="Portföy"><span>▦</span><small>PORTFÖY</small></button>
      <button className={activeHudPanel === 'time' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'time' ? null : 'time')} aria-label="Oyun zamanı" title="Zaman"><span>◷</span><small>ZAMAN</small></button>
      <button className={activeHudPanel === 'social' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'social' ? null : 'social')} aria-label="Çok oyunculu oda" title="Oyuncular"><span>♙</span><small>ODA</small></button>
      <button className={activeHudPanel === 'log' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'log' ? null : 'log')} aria-label="Mahalle günlüğü" title="Günlük"><span>≡</span><small>GÜNLÜK</small></button>
    </nav>
    {activeHudPanel && <button className="hud-dismiss" aria-label="Menüyü kapat" onClick={() => setActiveHudPanel(null)}>×</button>}
    <section className="intro-row">
      <div>
        <div className="eyebrow">SEZON 01 <span>/</span> İSTANBUL</div>
        <h1>BEYOĞLU <span>{year}</span></h1>
        <p className="intro-copy">Önce geçimini kur. Sonra dükkanını aç. Kendi hikayeni yaz.</p>
      </div>
      <div className="progress-control">
        <div className="date-label">OYUN TAKVİMİ · {String(day).padStart(2, '0')}/{String(month).padStart(2, '0')}/{year}</div>
        <div className="year-display">{String(hour).padStart(2, '0')}:00 <small>/ 24 SAAT</small></div>
        <button className="advance-button" onClick={sleepUntilMorning}>BİR GÜN İLERLET <span>↗</span></button>
      </div>
    </section>

    <section className="multiplayer-panel hud-multiplayer-panel">
      <div className="multiplayer-heading"><span className="live-dot" /> {session ? 'ORTAK BEYOĞLU · ÇEVRİMİÇİ ŞEHİR' : 'İKİ KİŞİLİK MAHALLE'}</div>
      <div className="multiplayer-status">{session ? (multiplayerStatus || 'Ortak şehir hazırlanıyor…') : multiplayerStatus}</div>
      {!authConfigured && <p className="small-note">Ortak şehir hesabı henüz yapılandırılmadı. Supabase projesi, migration ve Vercel ortam değişkenleri eklendiğinde hesapla giriş ve kalıcı ortak mülkiyet açılacak.</p>}
      {session ? <div className="multiplayer-controls">
        <div className="player-name-field">OYUNCU HESABI<input aria-label="Hesap e-postası" value={session.user.email || ''} readOnly /></div>
        <button className="room-leave-button" onClick={async () => { await supabase?.auth.signOut(); }}>ÇIKIŞ YAP</button>
      </div> : <div className="multiplayer-controls">
        <label className="player-name-field">OYUNCU ADIN<input aria-label="Oyuncu adı" value={playerName} onChange={e => setPlayerName(e.target.value.slice(0, 24))} placeholder="Adını yaz" maxLength={24} /></label>
        <button className="room-create-button" onClick={startRoom}>YENİ ODA AÇ</button>
        {roomCode && multiplayerRole === 'host' && <div className="room-code"><span>ODA KODU</span><strong>{roomCode}</strong><button onClick={() => { try { navigator.clipboard?.writeText(roomCode); setMultiplayerStatus('Oda kodu kopyalandı · arkadaşına gönder.'); } catch { setMultiplayerStatus('Oda kodun: ' + roomCode); } }}>KOPYALA</button></div>}
        <div className="room-join"><input aria-label="Oda kodu" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))} placeholder="6 HANELİ KOD" maxLength={6} /><button onClick={joinRoom}>ODAYA KATIL</button></div>
        {multiplayerRole !== 'solo' && <button className="room-leave-button" onClick={closeMultiplayer}>ODADAN AYRIL</button>}
      </div>}
      <p>{session ? 'Tek bir ortak şehirdesiniz. Mülk sahipliği herkes için ortaktır; paran, mesleğin, stokun ve oyun saatin yalnızca sana aittir.' : 'Herkes kendi parasını, mesleğini, stokunu ve portföyünü yönetir. Binaların sahipliği ortaktır; başka oyuncunun mülkü için satın alma teklifi gönderebilirsin. İnternet bağlantısı gerekir.'}</p>
      {incomingOffer && <div className="incoming-offer" role="alert"><strong>{incomingOffer.isCounter ? 'Karşı teklif geldi' : 'Yeni satın alma teklifi'}</strong><span>{incomingOffer.fromName}, {properties.find(p => p.id === incomingOffer.propertyId)?.name || 'bir mülk'} için ₺{Number(incomingOffer.price).toLocaleString('tr-TR')} teklif ediyor.</span><label>Teklif / karşı teklif (₺)<input type="number" min="1" value={offerPriceInput} onChange={e => setOfferPriceInput(e.target.value)} /></label><div><button onClick={() => respondToOffer('accept')}>KABUL ET</button><button onClick={() => respondToOffer('counter', offerPriceInput)}>KARŞI TEKLİF</button><button onClick={() => respondToOffer('reject')}>REDDET</button></div></div>}
    </section>

    <section className="game-layout fullscreen-layout">
      <div className="world-panel">
        <div className="world-topline"><span><span className="live-dot" /> BEYOĞLU MERKEZİ</span><label className="property-finder"><span>⌕</span><input aria-label="Mülk ara ve haritada göster" list="mahalle-property-options" placeholder="Mülk adı yaz..." value={mapSearch} onChange={event => { const value = event.target.value; setMapSearch(value); const match = properties.find(property => property.name.toLocaleLowerCase('tr-TR') === value.trim().toLocaleLowerCase('tr-TR')); if (match) selectProperty(match.id); }} /><datalist id="mahalle-property-options">{properties.map(property => <option key={property.id} value={property.name}>{owned.includes(property.id) ? 'Senin mülkün' : 'Satılık'}</option>)}</datalist><small>{properties.length} MÜLK</small></label><span className="world-year">OYUN DÜNYASI <i>·</i> {year}</span></div>
        <CityScene selected={selected} owned={owned} ownerByProperty={ownerByProperty} playerId={playerId} onSelect={selectProperty} hour={hour} overlay={<div className="scene-action-card">
          <div className="scene-action-eyebrow">SEÇİLİ BİNA · {String(active.id).padStart(2, '0')}</div><strong>{active.name}</strong>
          <span>{ownerByProperty[active.id] ? (ownerByProperty[active.id].playerId === playerId ? `Sahibi: ${ownerByProperty[active.id].name} (sen)` : `Sahibi: ${ownerByProperty[active.id].name}`) : 'Satılık'} · ₺{getMarketValue(active).toLocaleString('tr-TR')}</span>
          <div className="scene-action-buttons">
            {!ownerByProperty[active.id] && !owned.includes(active.id) && <button onClick={buy}>SATIN AL</button>}
            {ownerByProperty[active.id]?.playerId === playerId && owned.includes(active.id) && <button onClick={toggleRent}>{rented.includes(active.id) ? 'KİRACILIĞI BİTİR' : 'KİRAYA VER'}</button>}
            {owned.includes(active.id) && <button onClick={sellProperty}>MÜLKÜ SAT · ₺{Math.round(getMarketValue(active) * 0.95).toLocaleString('tr-TR')}</button>}
            {ownerByProperty[active.id] && ownerByProperty[active.id].playerId !== playerId && <><button onClick={() => { setOfferPriceInput(String(getMarketValue(active))); setOfferComposerOpen(v => !v); }}>SATIN ALMA TEKLİFİ</button>{offerComposerOpen && <div className="offer-composer"><label>Teklifin (₺)<input type="number" min="1" value={offerPriceInput} onChange={e => setOfferPriceInput(e.target.value)} /></label><small>Güncel piyasa değeri: ₺{getMarketValue(active).toLocaleString('tr-TR')}</small><button onClick={sendOffer}>TEKLİFİ GÖNDER</button></div>}</>}
            {owned.includes(active.id) && !rented.includes(active.id) && (tradeCatalog[active.id] || []).some(item => item.price > 0) && <span className="property-note">Ürün ve stok ayarlandığında işletme otomatik çalışır.</span>}
          </div>
        </div>} />
        <div className="map-legend"><span><i className="legend-dot available" /> SATILIK MÜLK</span><span><i className="legend-dot owned" /> SENİN MÜLKÜN</span><span className="map-hint">SÜRÜKLE: DÖNDÜR · KAYDIR: YAKINLAŞ · BİNAYA TIKLA</span></div>
        <div className="world-caption"><span>İSTANBUL / BEYOĞLU</span><span>GÜN {day} <i>·</i> SAAT {String(hour).padStart(2, '0')}:00</span></div>
        {activeEconomicEvents().length > 0 && <div className="economic-event-banner" role="status"><strong>TAKVİM ETKİNLİĞİ · {activeEconomicEvents().map(event => event.name).join(' + ')}</strong><span>{activeEconomicEvents()[0].detail}</span></div>}
      </div>

      <aside className={'side-panel hud-side-panel hud-panel-content-' + (activeHudPanel || 'none')} aria-label="Oyun menüsü">
        <section className="balance-card">
          <div className="card-label">02 / CEPTEKİ SERMAYE</div>
          <div className="balance-number"><span>₺</span>{cash.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</div>
          <div className="balance-foot"><span>Gün {day} · {workHours} saat çalıştın</span><span className={cash > 0 ? 'positive' : 'negative'}>{cash > 0 ? 'AYAKTA' : 'SERMAYE BİTTİ'}</span></div>
          <div className="balance-rule"><span style={{width: `${Math.min(100, cash / 500 * 100)}%`}} /></div>
        </section>

        <section className="progression-card" aria-label="Gelişim hedefi">
          <div className="progression-top"><span className="card-label">GELİŞİM ROTASI</span><span className="progression-step">{(() => { const completed = (careerHours >= 5 ? 1 : 0) + (owned.length >= 1 ? 1 : 0) + (owned.length >= 2 ? 1 : 0) + (rented.length >= 1 ? 1 : 0) + (owned.length >= 3 ? 1 : 0); return completed < 5 ? 'AŞAMA ' + String(completed + 1).padStart(2, '0') + ' / 05' : 'AŞAMA ' + String(6 + Math.floor(Math.max(0, careerHours - 5) / 5)).padStart(2, '0') + ' / ∞'; })()}</span></div>
          {(() => {
            const goals = [
              { id: 'work', title: 'İlk sermayeni oluştur', detail: 'Toplam 5 saat çalışarak meslek ritmini öğren.', current: careerHours, target: 5, unit: 'saat', done: careerHours >= 5, reward: 'Meslek deneyimi' },
              { id: 'first-property', title: 'İlk mülkünü edin', detail: 'Bir taşınmaz satın al ve portföyünü başlat.', current: owned.length, target: 1, unit: 'mülk', done: owned.length >= 1, reward: 'Gayrimenkul yatırımcısı' },
              { id: 'second-property', title: 'Küçük bir portföy kur', detail: 'İkinci taşınmazını alarak seçeneklerini artır.', current: owned.length, target: 2, unit: 'mülk', done: owned.length >= 2, reward: 'Portföy çeşitliliği' },
              { id: 'rental', title: 'İlk kira gelirini başlat', detail: 'Bir mülkünü kiraya ver; günlük gelirini büyüt.', current: rented.length, target: 1, unit: 'kiralık mülk', done: rented.length >= 1, reward: 'Düzenli gelir' },
              { id: 'third-property', title: 'Mahallede yer edin', detail: 'Üç mülke ulaşarak daha geniş bir portföy kur.', current: owned.length, target: 3, unit: 'mülk', done: owned.length >= 3, reward: 'Mahalle yatırımcısı' }
            ];
            const goal = goals.find(item => !item.done);
            if (!goal) { const extraHours = Math.max(0, careerHours - 5); const loopStage = 6 + Math.floor(extraHours / 5); const progress = extraHours % 5; const nextTarget = careerHours + (5 - progress); return <div className="progression-loop"><div className="progression-loop-kicker">SONSUZ GELİŞİM DÖNGÜSÜ</div><strong>Mahallede kalıcı bir iz bırak.</strong><span>İlk beş hedef tamamlandı. Bundan sonra her 5 yeni çalışma saati yeni bir gelişim aşaması açar.</span><div className="progression-loop-meter"><span style={{width: (progress / 5 * 100) + '%'}} /></div><div className="progression-loop-foot"><span>{progress}/5 saat</span><span>Sonraki aşama: {String(loopStage + 1).padStart(2, '0')}</span></div><div className="progression-loop-reward">Sonraki hedef: toplam {nextTarget} meslek saati · Yeni unvan: {loopStage >= 20 ? 'Mahallenin duayeni ' + loopStage : ['Usta esnaf', 'Mahalle kurucusu', 'Ticaret erbabı', 'Semtin siması'][Math.max(0, (loopStage - 6) % 4)]}</div></div>; }
            const ratio = Math.min(100, Math.round(goal.current / goal.target * 100));
            return <><div className="progression-title">{goal.title}</div><p className="progression-detail">{goal.detail}</p><div className="progression-meter"><span style={{ width: ratio + '%' }} /></div><div className="progression-foot"><span>{Math.min(goal.current, goal.target)} / {goal.target} {goal.unit}</span><span>{ratio}%</span></div><div className="progression-next"><span>BU HEDEFİN KATKISI</span><strong>{goal.reward}</strong></div></>;
          })()}
        </section>

        <section className="work-card">
          <div className="section-heading"><span>03 / VARDİYA</span><span className="count-tag">{steps.toString().padStart(3, '0')}</span></div>
          <div className="work-status"><span className="status-light active" />ZAMAN AKIYOR · 5 SN / SAAT</div>
          <button className="rest-button" onClick={sleepUntilMorning}>BİR GÜN İLERLET <span>↗</span></button>
          <p className="small-note">Oyun saati her 5 gerçek saniyede bir ilerler. Mesai saatlerinde seçtiğin mesleğe göre otomatik çalışırsın; stoklu işletmeler de satış yapar. Zaman kesintisiz akar; istersen bir günü tek hamlede ilerletebilirsin.</p>
        </section>

        <section className="property-card">
          <div className="section-heading hud-property-heading"><span>04 / MÜLKÜ İNCELE</span><span className="count-tag">{String(active.id).padStart(2, '0')}</span></div>
          <div className="property-type">{active.type.toUpperCase()}</div>
          <h2>{active.name}</h2>
          {ownerByProperty[active.id] && <div className="owner-chip">MÜLK SAHİBİ: {ownerByProperty[active.id].name}{ownerByProperty[active.id].playerId === playerId ? ' (SEN)' : ''}</div>}
          <p className="property-description">{active.style}. Bu taşınmazı alabilir, işletme olarak kullanabilir veya ileride kiraya verebilirsin.</p>
          <div className="property-stats">
            <div><span>Güncel piyasa değeri</span><strong>₺{getMarketValue(active).toLocaleString('tr-TR')}</strong></div>
            <div><span>Günlük kira</span><strong>₺{(active.rent / 30).toFixed(2)}</strong></div><div><span>Yıllık kira potansiyeli</span><strong>₺{(active.rent * 12).toLocaleString('tr-TR')}</strong></div>
            <div><span>Kat sayısı</span><strong>{active.floors} kat</strong></div>
            <div><span>Durum</span><strong className={owned.includes(active.id) ? 'owned-text' : ''}>{!owned.includes(active.id) ? 'SATILIK' : rented.includes(active.id) ? 'KİRADA' : 'PORTFÖYÜNDE'}</strong></div>
          </div>
          {active.type === 'Konut' && active.units ? <div className="unit-market"><div className="card-label">DAİRELER · {active.units} BAĞIMSIZ BÖLÜM</div><p>Bir daireyle başla. Binadaki tüm daireleri toplarsan binayı yenileyip kira potansiyelini artırabilirsin.</p><div className="unit-grid">{Array.from({length:active.units},(_,i)=>{const n=i+1,key=active.id+':'+n,o=unitOwners[key],mine=o?.playerId===playerId,price=Math.round(getMarketValue(active)*1.18/active.units);return <button key={key} className={'unit-tile '+(mine?'unit-mine':o?'unit-taken':'')} onClick={()=>setSelectedUnit(n)}><strong>{n}. daire</strong><small>{o?(o.name+(mine?' · SENİN':' · SATILDI')):'₺'+price.toLocaleString('tr-TR')}</small>{selectedUnit===n?<span>SEÇİLİ</span>:null}</button>})}</div><div className="unit-action"><span>Seçili daire: {selectedUnit} · Günlük kira potansiyeli ₺{(active.rent/active.units/30).toFixed(2)}</span>{!unitOwners[active.id+':'+selectedUnit] ? <button className="buy-button" onClick={buy}>DAİREYİ SATIN AL</button> : unitOwners[active.id+':'+selectedUnit].playerId===playerId ? <button className="rent-button" onClick={()=>{const k=active.id+':'+selectedUnit;setUnitRented(old=>({...old,[k]:!old[k]}));tell(unitRented[k]?'Dairenin kiralaması durduruldu.':'Daire kiraya verildi. Kira geliri göstergesi güncellendi.');}}>{unitRented[active.id+':'+selectedUnit]?'KİRAYI DURDUR':'DAİREYİ KİRAYA VER'}</button>:null}</div>{Array.from({length:active.units},(_,i)=>i+1).every(n=>unitOwners[active.id+':'+n]?.playerId===playerId)&&<div className="building-upgrade"><strong>BİNANIN TAMAMI SENİN</strong><p>Seviye {Number(buildingLevels[active.id])||1} · tüm dairelerin sahibi olduğun için binayı yenileyebilirsin.</p><button className="buy-button" onClick={()=>{const lv=Number(buildingLevels[active.id])||1,cost=Math.round(getMarketValue(active)*(0.2+lv*0.12));if(lv>=5){tell('Bina en yüksek seviyede.');return;}if(cash<cost){tell('Yenileme için ₺'+cost.toLocaleString('tr-TR')+' gerekiyor.');return;}setCash(v=>v-cost);setBuildingLevels(old=>({...old,[active.id]:lv+1}));setMarketValues(old=>({...old,[active.id]:Math.round(getMarketValue(active)*1.15*100)/100}));tell('Bina yenilendi: seviye '+(lv+1)+'. Değeri yükseldi.');}}>BİNAYI YENİLE · ₺{Math.round(getMarketValue(active)*((Number(buildingLevels[active.id])||1)*0.12+0.2)).toLocaleString('tr-TR')}</button></div>}</div> : !ownerByProperty[active.id] && <button className={owned.includes(active.id) ? 'buy-button is-owned' : 'buy-button'} onClick={buy} disabled={owned.includes(active.id)}>{owned.includes(active.id) ? 'MÜLK SENİN' : 'MÜLKÜ SATIN AL'} <span>{owned.includes(active.id) ? '✓' : '↗'}</span></button>}
          {ownerByProperty[active.id] && ownerByProperty[active.id].playerId !== playerId && <><button className="buy-button" onClick={() => { setOfferPriceInput(String(getMarketValue(active))); setOfferComposerOpen(v => !v); }}>SATIN ALMA TEKLİFİ GÖNDER <span>↗</span></button>{offerComposerOpen && <div className="offer-composer"><label>Teklifin (₺)<input type="number" min="1" value={offerPriceInput} onChange={e => setOfferPriceInput(e.target.value)} /></label><small>Piyasa değeri: ₺{getMarketValue(active).toLocaleString('tr-TR')}</small><button onClick={sendOffer}>TEKLİFİ GÖNDER</button></div>}</>}
          {owned.includes(active.id) && <button className="rent-button" onClick={toggleRent}>{rented.includes(active.id) ? 'KİRACIYI ÇIKAR' : 'KİRACI BUL VE KİRAYA VER'}</button>}
          {owned.includes(active.id) && <button className="sell-button" onClick={sellProperty}>MÜLKÜ SAT · ₺{Math.round(active.price * 0.9).toLocaleString('tr-TR')}</button>}
          {active.id === 37 && owned.includes(37) && !rented.includes(37) && (() => {
            const state = stockByProperty[37] && typeof stockByProperty[37] === 'object' ? stockByProperty[37] : { materials: {}, products: {} };
            const materials = state.materials || {}; const products = state.products || {};
            return <div className="business-plan shoe-workshop"><div className="card-label">KUNDURACI · TEDARİK / ÜRETİM / VİTRİN</div>
              <p className="profession-meta">Hammaddeleri tedarik et, reçeteye göre üret ve her ürünün stokunu ayrı izle.</p>
              <div className="storage-upgrade-panel"><div><span>DEPO SEVİYESİ {Number(businessStats[37]?.stockCapacityLevel) || 1}/5</span><strong>Ürün başına {getStockCapacity(37)} birim kapasite</strong><small>İşletme seviyesi {getBusinessSalesLevel(37)} · satış yaptıkça yeni depo kademeleri açılır.</small></div><button className="stock-button" onClick={() => upgradeBusinessStorage(37)} disabled={(Number(businessStats[37]?.stockCapacityLevel) || 1) >= 5 || getBusinessSalesLevel(37) < (Number(businessStats[37]?.stockCapacityLevel) || 1) + 1}>GENİŞLET · ₺{STOCK_UPGRADE_COST_BY_LEVEL[(Number(businessStats[37]?.stockCapacityLevel) || 1) + 1] || '—'}</button></div>
              <h3>1 · Hammadde deposu</h3>
              {SHOE_MATERIALS.map(m => { const amount = Number(materials[m.id]) || 0; const cap = getStockCapacity(37); const ratio = Math.min(100, Math.round(amount / cap * 100)); return <div className="material-stock-card" key={m.id}><div className="material-stock-head"><span>{m.name}</span><strong>{amount} / {cap}</strong></div><div className="material-stock-meter" role="img" aria-label={m.name + ' stok kapasitesi yüzde ' + ratio}><span style={{width: ratio + '%'}} /></div><button className="stock-button" onClick={() => buyShoeMaterial(m.id)} disabled={amount + m.batch > cap}>+{m.batch} · ₺{m.cost}</button></div>; })}
              <h3>2 · Üretim tezgâhı</h3>
              {SHOE_RECIPES.map(shoe => { const job = pendingProductions['37:' + shoe.id]; const sold = Number(businessStats[37]?.productUnitsSold?.[shoe.id]?.units) || 0; const missing = Object.entries(shoe.recipe).filter(([id, qty]) => (Number(materials[id]) || 0) < qty); const locked = (shoe.unlockLevel || 1) > getBusinessSalesLevel(37); return <div className={'shoe-product-row ' + (locked ? 'shoe-product-locked' : '')} key={shoe.id}><div><strong>{shoe.name}{locked ? ' 🔒' : ''}</strong><small>Reçete: {Object.entries(shoe.recipe).map(([id, qty]) => (SHOE_MATERIALS.find(m => m.id === id)?.name || id) + ' ×' + qty).join(' · ')}</small><small>Satış fiyatı: ₺{shoe.price} / çift · Tahmini hammadde maliyeti: ₺{Object.entries(shoe.recipe).reduce((sum,[id,qty])=>{const m=SHOE_MATERIALS.find(item=>item.id===id);return sum+(m?m.cost/m.batch*qty:0)},0).toLocaleString('tr-TR',{maximumFractionDigits:2})} · Brüt fark: ₺{(shoe.price-Object.entries(shoe.recipe).reduce((sum,[id,qty])=>{const m=SHOE_MATERIALS.find(item=>item.id===id);return sum+(m?m.cost/m.batch*qty:0)},0)).toLocaleString('tr-TR',{maximumFractionDigits:2})}</small><small>Satılan toplam: {sold}</small><small className={locked ? 'production-requirements' : missing.length ? 'production-requirements' : 'production-ready'}>{locked ? 'Kilitli · Kunduracı seviye ' + shoe.unlockLevel + ' gerekli' : missing.length ? 'Eksik hammadde: ' + missing.map(([id, qty]) => (SHOE_MATERIALS.find(m => m.id === id)?.name || id) + ' ' + Math.max(0, qty - (Number(materials[id]) || 0))).join(', ') : 'Üretime hazır · gerekli hammaddeler mevcut'}</small>{job && <small className="production-pending">Üretimde: {job.units} çift · yaklaşık {Math.max(0, Math.ceil((job.readyAt - productionNow) / 1000))} sn kaldı</small>}</div><button className="stock-button" onClick={() => craftShoe(shoe.id)} disabled={locked || Boolean(job) || missing.length > 0}>{locked ? 'SEVİYE KİLİDİ' : job ? 'ÜRETİLİYOR…' : missing.length ? 'HAMMADDE EKSİK' : '1 ÇİFT ÜRET'}</button></div>; })}
              <h3>3 · Vitrin stokları</h3>
              {SHOE_RECIPES.map(shoe => <div className="stock-line" key={shoe.id}><span>{shoe.name}</span><strong>{Number(products[shoe.id]) || 0} çift</strong></div>)}
            </div>;
          })()}
          {owned.includes(active.id) && !rented.includes(active.id) && active.id !== 37 && (tradeCatalog[active.id] || []).some(item => item.price > 0) && <div className="business-plan">
            <div className="card-label">İŞ MODELİ · TEDARİK · STOK</div>
            <label className="business-label" htmlFor="business-plan-select">Ne satacaksın?</label>
            <select id="business-plan-select" className="profession-select" value={businessPlans[active.id] || ''} onChange={e => selectBusinessPlan(e.target.value)}>
              <option value="">Ürün grubu seç</option>
              {(tradeCatalog[active.id] || []).map(item => <option key={item.id} value={item.id}>{item.name} · birim maliyet ₺{(item.units > 0 ? item.cost / item.units : 0).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} / satış ₺{item.price.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</option>)}
            </select>
            <div className="storage-upgrade-panel"><div><span>DEPO SEVİYESİ {Number(businessStats[active.id]?.stockCapacityLevel) || 1}/5</span><strong>Ürün başına {getStockCapacity(active.id)} adet kapasite</strong><small>İşletme seviyesi {getBusinessSalesLevel(active.id)} · sonraki kademe için satış yap.</small></div><button className="stock-button" onClick={() => upgradeBusinessStorage(active.id)} disabled={(Number(businessStats[active.id]?.stockCapacityLevel) || 1) >= 5 || getBusinessSalesLevel(active.id) < (Number(businessStats[active.id]?.stockCapacityLevel) || 1) + 1}>GENİŞLET · ₺{STOCK_UPGRADE_COST_BY_LEVEL[(Number(businessStats[active.id]?.stockCapacityLevel) || 1) + 1] || '—'}</button></div>

            {(() => { const stats = businessStats[active.id] || { unitsSold: 0, revenue: 0, stockInvested: 0 }; const level = stats.unitsSold >= 60 ? 5 : stats.unitsSold >= 35 ? 4 : stats.unitsSold >= 15 ? 3 : stats.unitsSold >= 5 ? 2 : 1; const thresholds = [0, 5, 15, 35, 60]; const nextTarget = thresholds[level]; const levelNames = ['Yeni açıldı', 'Mahalle esnafı', 'Tanıdık dükkan', 'Yerleşik işletme', 'Mahallenin gözdesi']; const ratio = level >= 5 ? 100 : Math.min(100, Math.round(stats.unitsSold / nextTarget * 100)); const masteryBonus = (level - 1) * 3; const reputation = Math.min(100, Math.floor(stats.unitsSold * 1.5)); const reputationLabel = reputation >= 75 ? 'Mahallenin sevilen yeri' : reputation >= 40 ? 'Düzenli müşteri kitlesi' : reputation >= 10 ? 'Adı duyulmaya başladı' : 'Müşteri kazanıyor'; return <div className="mastery-panel"><div className="mastery-head"><span className="card-label">İŞLETME USTALIĞI</span><strong>SEV. {level} · +%{masteryBonus} SATIŞ</strong></div><div className="mastery-name">{levelNames[level - 1]}</div><div className="mastery-meter"><span style={{width: ratio + '%'}} /></div><div className="mastery-foot"><span>{stats.unitsSold} ürün satıldı</span><span>{level >= 5 ? 'En yüksek ustalık' : nextTarget + ' satışa ilerle'}</span></div><div className="reputation-row"><div><span>MAHALLE İTİBARI</span><strong>{reputation}/100 · {reputationLabel}</strong></div><b>+{Math.round(reputation * 0.12)} puan satış fırsatı</b></div><div className="reputation-meter"><span style={{width: reputation + '%'}} /></div><div className="mastery-stats"><div><span>Toplam hasılat</span><strong>₺{stats.revenue.toLocaleString('tr-TR', {maximumFractionDigits: 2})}</strong></div><div><span>Stok yatırımı</span><strong>₺{stats.stockInvested.toLocaleString('tr-TR', {maximumFractionDigits: 2})}</strong></div><div><span>Hasılat − stok</span><strong className={stats.revenue - stats.stockInvested >= 0 ? 'mastery-positive' : 'mastery-negative'}>₺{(stats.revenue - stats.stockInvested).toLocaleString('tr-TR', {maximumFractionDigits: 2})}</strong></div></div><p className="mastery-note">Ustalık satılan ürünlerle artar. Hasılat − stok, kira ve günlük işletme giderleri düşülmeden önceki farktır.</p></div>; })()}
            <div className="stock-line"><span>Toplam stok / depo kapasitesi</span><strong>{getTotalStock(active.id)} / {getStockCapacity(active.id)} adet</strong></div>
            <div className="product-sales-panel"><div className="card-label">ÜRÜN BAZINDA SATIŞLAR</div>{(tradeCatalog[active.id] || []).filter(product => product.price > 0).map(product => { const sold = Number(businessStats[active.id]?.productUnitsSold?.[product.id]?.units) || 0; const pending = pendingProductions[active.id + ':' + product.id]; const inStock = getProductStock(active.id, product.id); return <div className="stock-line product-inventory-row" key={product.id}><span>{product.name}<small className="product-stock-meta">Stok: {inStock} · Satılan: {sold}{pending ? ' · Üretimde: ' + pending.units + ' (' + Math.max(0, Math.ceil((pending.readyAt - productionNow) / 1000)) + ' sn)' : ''}</small></span><strong>{sold} satıldı</strong></div>; })}</div>
            <div className="stock-line"><span>Parti alış maliyeti</span><strong>{(() => { const item = (tradeCatalog[active.id] || []).find(product => product.id === businessPlans[active.id]); return item ? `₺${item.cost.toLocaleString('tr-TR')} · ${item.units} adet` : '₺0'; })()}</strong></div>
            <div className="stock-line"><span>Birim maliyet / satış</span><strong>{(() => { const item = (tradeCatalog[active.id] || []).find(product => product.id === businessPlans[active.id]); return item && item.units > 0 ? `₺${(item.cost / item.units).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} / ₺${item.price.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '—'; })()}</strong></div>
            <div className="stock-line"><span>Parti başına tahmini brüt fark</span><strong>₺{(() => { const item = (tradeCatalog[active.id] || []).find(product => product.id === businessPlans[active.id]); return item ? (item.price * item.units - item.cost).toLocaleString('tr-TR', {maximumFractionDigits: 2}) : '0'; })()}</strong></div>
            <button className="stock-button" onClick={stockBusiness}>{(tradeCatalog[active.id] || []).find(item => item.id === businessPlans[active.id])?.service ? "HİZMETİ AÇ" : "ÜRETİM SİPARİŞİ VER"}</button>
            <p>Stoklu otomatik satışın yanında burada bizzat bir saat çalışıp ek gelir kazanabilirsin. Çalışma saati 08.00–19.00; manuel çalışınca zaman durur, tekrar başlatabilirsin.</p>
          </div>}

          {owned.includes(active.id) && (rented.includes(active.id)
            ? <div className="property-note"><span>i</span> Bu mülk kirada. İşletme satışları kiracılık bitene kadar durur.</div>
            : (tradeCatalog[active.id] || []).some(item => item.price > 0)
              ? <div className="property-note"><span>i</span> İşletme otomatik çalışır; ürün grubu seçip stok tedarik etmen yeterli.</div>
              : <div className="property-note"><span>i</span> Bu mülk şu an kira geliri veya başka kullanım için değerlendirilebilir.</div> )}
          <div className="property-note"><span>i</span> Mülk fiyatları şimdilik oyun dengesi için belirlenmiştir.</div>
        </section>

        <section className="portfolio-mini">
          <div className="section-heading"><span>05 / PORTFÖYÜN</span><button onClick={() => setShowPortfolio(v => !v)}>{showPortfolio ? 'KAPAT −' : 'TÜMÜNÜ GÖR +'}</button></div>
          {portfolio.length === 0 ? <div className="empty-portfolio"><span className="empty-icon">⌂</span><span>Henüz bir mülk edinmedin.</span></div> :
            portfolio.slice(0, 2).map(p => <button type="button" className="portfolio-row portfolio-row-button" key={p.id} onClick={() => { setPortfolioDetailId(p.id); setSelected(p.id); }}><span className="portfolio-thumb">⌂</span><span className="portfolio-name">{p.name}<small>{rented.includes(p.id) ? 'Kirada' : p.type} · Günlük kira ₺{(p.rent / 30).toFixed(2)}</small></span><span className="portfolio-value">₺{getMarketValue(p).toLocaleString("tr-TR")}</span></button>)}
          {showPortfolio && <div className="portfolio-expanded">
            {portfolio.length === 0 ? <p>İlk yatırımın burada görünecek.</p> : portfolio.map(p => <button type="button" className="portfolio-row portfolio-row-button" key={p.id} onClick={() => { setPortfolioDetailId(p.id); setSelected(p.id); }}><span className="portfolio-thumb">⌂</span><span className="portfolio-name">{p.name}<small>{rented.includes(p.id) ? 'Kirada - günlük ₺' + (p.rent / 30).toFixed(2) : 'Potansiyel günlük kira: ₺' + (p.rent / 30).toFixed(2)}</small></span><span className="portfolio-value">₺{getMarketValue(p).toLocaleString("tr-TR")}</span></button>)}
            <div className="portfolio-total">POTANSİYEL GÜNLÜK KİRA <strong>₺{portfolio.reduce((sum,p)=>sum+p.rent/30,0).toFixed(2)}</strong></div><div className="portfolio-total">KİRAYA VERİLENLERİN GÜNLÜK GELİRİ <strong>₺{dailyRentIncome.toFixed(2)}</strong></div><div className="portfolio-total">KİRAYA VERİLENLERİN YILLIK GELİRİ <strong>₺{realizedAnnualRent}</strong></div>
          </div>}
        </section>

        <section className="activity-card">
          <div className="section-heading"><span>06 / MAHALLE GÜNLÜĞÜ</span><span className="count-tag">CANLI</span></div>
          {log.map(item => <div className="log-line" key={item.id}><span className="log-square" />{item.text}</div>)}
        </section>
      </aside>
    </section>

    {portfolioDetail && <div className="property-modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setPortfolioDetailId(null); }}>
      <section className="property-modal" role="dialog" aria-modal="true" aria-label={portfolioDetail.name}>
        <div className="property-modal-top"><span>MÜLK DOSYASI · #{String(portfolioDetail.id).padStart(2, '0')}</span><button type="button" aria-label="Kapat" onClick={() => setPortfolioDetailId(null)}>×</button></div>
        <h2>{portfolioDetail.name}</h2>
        <p className="property-modal-subtitle">{portfolioDetail.type} · {portfolioDetail.floors} kat · {portfolioDetail.style}</p>
        <div className="property-modal-stats">
          <div><small>GÜNCEL PİYASA DEĞERİ</small><strong>₺{getMarketValue(portfolioDetail).toLocaleString('tr-TR')}</strong></div>
          <div><small>AYLIK KİRA POTANSİYELİ</small><strong>₺{portfolioDetail.rent.toLocaleString('tr-TR')}</strong></div>
          <div><small>GÜNLÜK KİRA</small><strong>₺{(portfolioDetail.rent / 30).toFixed(2)}</strong></div>
          <div><small>DURUM</small><strong>{rented.includes(portfolioDetail.id) ? 'Kirada' : 'Kendi kullanımında'}</strong></div>
        </div>
        <p className="property-modal-note">{rented.includes(portfolioDetail.id) ? 'Kira geliri her oyun günü otomatik hesaba geçer.' : 'Bu mülkü kiraya vererek günlük kira geliri elde edebilirsin. İşletme açtıysan ürün seçimi ve stok durumunu da yönetebilirsin.'}</p>
        <div className="property-modal-actions">
          <button type="button" onClick={() => { setSelected(portfolioDetail.id); setPortfolioDetailId(null); }}>HARİTADA GÖSTER</button>
          <button type="button" onClick={() => setPortfolioDetailId(null)}>KAPAT</button>
        </div>
      </section>
    </div>}
    <footer className="footer"><span>MAHALLE <i>©</i> 1923</span><span>GEÇMİŞİN İÇİNDE BİR GELECEK KUR.</span><span>PROTOTİP 0.4.0</span></footer>
    <div className="economy-note">Kayıt bu tarayıcıda otomatik saklanır. Ekonomi değerleri oynanabilir prototip varsayımlarıdır; doğrulanmış 1923 ücret ve fiyat verileri değildir.</div>
    {notice && <div className="toast" key={noticeId} role="status">{notice}</div>}
  </main>;
}

export default App;