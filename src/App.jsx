import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const properties = [
  { id: 1, name: 'Galata’da küçük dükkan', type: 'Ticaret', price: 420, rent: 32, x: -4.2, z: -1.1, color: '#d9c8ad', floors: 3, style: 'Galata taş cephesi' },
  { id: 2, name: 'Asmalımescit apartmanı', type: 'Konut', price: 860, rent: 58, x: 0, z: -3.2, color: '#c6b8a4', floors: 4, style: 'Cumba ve yüksek tavan' },
  { id: 3, name: 'Arka sokakta depo', type: 'Depo', price: 290, rent: 24, x: 4.1, z: -0.7, color: '#c7c0b3', floors: 2, style: 'Sade taş yapı' },
  { id: 4, name: 'Cadde üzeri han', type: 'Ticaret', price: 1250, rent: 94, x: -2.4, z: 4.1, color: '#d5c4a8', floors: 4, style: 'Ticaret hanı' },
  { id: 5, name: 'Meydan evi', type: 'Konut', price: 690, rent: 46, x: 3.2, z: 4.2, color: '#d4cbb9', floors: 3, style: 'Dar cepheli şehir evi' },
  { id: 6, name: 'Eski Rum evi', type: 'Konut', price: 740, rent: 49, x: -7.2, z: -5.2, color: '#c9b6a2', floors: 3, style: 'Ahşap cumba' },
  { id: 7, name: 'Şarap ve erzak dükkanı', type: 'Ticaret', price: 510, rent: 38, x: 7.0, z: -5.0, color: '#d8cbb4', floors: 3, style: 'Zemin kat dükkan' },
  { id: 8, name: 'Tünel yakınında apartman', type: 'Konut', price: 1120, rent: 76, x: -7.4, z: 2.8, color: '#c7c2b5', floors: 4, style: 'Geç Osmanlı apartmanı' },
  { id: 9, name: 'Matbaa atölyesi', type: 'Atölye', price: 620, rent: 45, x: 7.2, z: 2.7, color: '#cbbca6', floors: 2, style: 'Zanaat atölyesi' },
  { id: 10, name: 'İstiklal üzerinde mağaza', type: 'Ticaret', price: 1480, rent: 108, x: -5.6, z: 7.4, color: '#d7c8b0', floors: 4, style: 'Süslü ticaret cephesi' },
  { id: 11, name: 'Avlulu aile evi', type: 'Konut', price: 570, rent: 35, x: 0.1, z: 8.0, color: '#d0c3af', floors: 2, style: 'İç avlulu konut' },
  { id: 12, name: 'Küçük kahvehane', type: 'İşletme', price: 480, rent: 62, x: 5.5, z: 7.5, color: '#bfae98', floors: 2, style: 'Sokak kahvehanesi' }
];

function CityScene({ selected, owned, onSelect }) {
  const host = useRef(null);
  const selectRef = useRef(onSelect);
  const selectedRef = useRef(selected);
  useEffect(() => { selectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e8e6de');
    scene.fog = new THREE.Fog('#e8e6de', 22, 48);
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

    scene.add(new THREE.HemisphereLight('#fffaf0', '#89877f', 2.0));
    const sun = new THREE.DirectionalLight('#fff5dd', 3.0);
    sun.position.set(-7, 15, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: '#d8d5ca', roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.08;
    ground.receiveShadow = true;
    scene.add(ground);

    const streetMat = new THREE.MeshStandardMaterial({ color: '#aaa79e', roughness: 1 });
    const street = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 28), streetMat);
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, 0, 0);
    street.receiveShadow = true;
    scene.add(street);
    const crossStreet = new THREE.Mesh(new THREE.PlaneGeometry(28, 5.8), streetMat);
    crossStreet.rotation.x = -Math.PI / 2;
    crossStreet.position.set(0, 0.005, 0.7);
    crossStreet.receiveShadow = true;
    scene.add(crossStreet);

    const stoneMat = new THREE.MeshStandardMaterial({ color: '#efede5', roughness: 1 });
    for (let i = -12; i <= 12; i += 2) {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.015, 0.75), stoneMat);
      dash.position.set(0, 0.02, i);
      scene.add(dash);
    }

    const buildingMeshes = [];
    const addBuilding = (p, idx, isOwned) => {
      const group = new THREE.Group();
      const w = idx === 3 || idx === 9 ? 2.7 : 2.05;
      const d = idx === 1 ? 2.4 : 1.9;
      const h = p.floors * 0.88;
      const mat = new THREE.MeshStandardMaterial({ color: isOwned ? '#a9b6a4' : p.color, roughness: 0.92 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.position.y = h / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, 0.14, d + 0.12), new THREE.MeshStandardMaterial({ color: '#756e62', roughness: 1 }));
      roof.position.y = h + 0.07;
      roof.castShadow = true;
      group.add(roof);

      // Subtle cornice and pilasters inspired by late Ottoman / early 20th-century facades.
      const trimMat = new THREE.MeshStandardMaterial({ color: '#eee3d0', roughness: 0.9 });
      const cornice = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.09, d + 0.16), trimMat);
      cornice.position.y = h - 0.12; group.add(cornice);
      for (const edge of [-1, 1]) {
        const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.09, h - 0.12, 0.07), trimMat);
        pilaster.position.set(edge * (w / 2 - 0.12), h / 2, d / 2 + 0.045); group.add(pilaster);
      }
      if (p.style.toLowerCase().includes('cumba')) {
        const bay = new THREE.Mesh(new THREE.BoxGeometry(w * 0.68, 0.62, 0.52), mat);
        bay.position.set(0, h * 0.67, d / 2 + 0.22); bay.castShadow = true; group.add(bay);
        const bayCap = new THREE.Mesh(new THREE.BoxGeometry(w * 0.76, 0.08, 0.62), trimMat);
        bayCap.position.set(0, h * 0.67 + 0.34, d / 2 + 0.22); group.add(bayCap);
      }

      const windowMat = new THREE.MeshStandardMaterial({ color: '#65777a', roughness: 0.55, metalness: 0.05 });
      for (let floor = 0; floor < p.floors; floor++) {
        for (let col = 0; col < 2; col++) {
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 0.035), windowMat);
          win.position.set((col - 0.5) * 0.86, 0.48 + floor * 0.88, d / 2 + 0.022);
          group.add(win);
          const frame = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.055, 0.05), new THREE.MeshStandardMaterial({ color: '#f0e7d5' }));
          frame.position.set((col - 0.5) * 0.86, 0.48 + floor * 0.88, d / 2 + 0.045);
          group.add(frame);
          const sill = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.06, 0.08), trimMat);
          sill.position.set((col - 0.5) * 0.86, 0.25 + floor * 0.88, d / 2 + 0.05); group.add(sill);
        }
      }
      const door = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.76, 0.06), new THREE.MeshStandardMaterial({ color: '#66574a' }));
      door.position.set(0, 0.38, d / 2 + 0.035);
      group.add(door);
      group.position.set(p.x, 0, p.z);
      group.userData.propertyId = p.id;
      scene.add(group);
      buildingMeshes.push(group);
    };

    properties.forEach((p, i) => addBuilding(p, i, owned.includes(p.id)));

    // Distant street frontage to frame the playable block.
    const fillerMat = new THREE.MeshStandardMaterial({ color: '#c8c0b1', roughness: 1 });
    for (let i = 0; i < 8; i++) {
      const height = 2.2 + (i % 3) * 0.55;
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.65, height, 1.6), fillerMat);
      const side = i % 2 === 0 ? -1 : 1;
      b.position.set(side * (7.2 + (i % 2) * 1.1), height / 2, -10 + i * 2.8);
      b.castShadow = true; b.receiveShadow = true; scene.add(b);
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
    const animate = () => {
      frame = requestAnimationFrame(animate);
      tram.position.x = -0.1 + Math.sin(Date.now() * 0.00015) * 0.8;
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
  const [steps, setSteps] = useState(0);
  const [cash, setCash] = useState(75);
  const [owned, setOwned] = useState([]);
  const [selected, setSelected] = useState(1);
  const [notice, setNotice] = useState('');
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [professionId, setProfessionId] = useState('leblebici');
  const [hour, setHour] = useState(8);
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(1923);
  const clockAction = useRef(null);
  const [workHours, setWorkHours] = useState(0);
  const [shopOpen, setShopOpen] = useState(false);
  const [log, setLog] = useState([{ id: 0, text: 'Beyoğlu’na geldin. Geçimini kurmak için bir meslek seç.' }]);
  const professionOptions = [
    { id: 'kolonyaci', name: 'Kolonyacı', gross: 5.2, overhead: 7, description: 'Kolonya, koku ve kişisel bakım ürünleri.' },
    { id: 'leblebici', name: 'Leblebici', gross: 4.2, overhead: 4, description: 'Kuruyemiş ve leblebi; düşük sermayeli ticaret.' },
    { id: 'terzi', name: 'Terzi', gross: 6.1, overhead: 5, description: 'Siparişle çalışır; düzenli müşteri kazandırır.' },
    { id: 'matbaaci', name: 'Matbaacı', gross: 7.3, overhead: 9, description: 'Daha yüksek gelir, daha pahalı malzeme ve bakım.' },
    { id: 'kahveci', name: 'Kahveci', gross: 5.6, overhead: 10, description: 'Müşteri trafiğine ve sarf malzemesine bağlı.' },
    { id: 'amele', name: 'Gündelik işçi', gross: 3.7, overhead: 0, description: 'Dükkan gerekmez; çalıştığın saat kadar ücret.' }
  ];
  const profession = professionOptions.find(p => p.id === professionId) || professionOptions[1];
  const portfolio = properties.filter(p => owned.includes(p.id));
  const annualRent = portfolio.reduce((sum, p) => sum + p.rent, 0);
  const [noticeId, setNoticeId] = useState(0);

  const tell = (text) => {
    setNotice(text);
    setNoticeId(v => v + 1);
    setLog(old => [{ id: Date.now(), text }, ...old].slice(0, 5));
  };

  const advanceHour = (work = false) => {
    if (hour === 5) {
      const nextDayRaw = day + 1;
      const nextDay = nextDayRaw > 30 ? 1 : nextDayRaw;
      const nextMonthRaw = month + (nextDayRaw > 30 ? 1 : 0);
      const nextMonth = nextMonthRaw > 12 ? 1 : nextMonthRaw;
      const overhead = profession.overhead;
      const maintenance = portfolio.reduce((sum, p) => sum + Math.max(0.01, Math.round((p.price * 0.003 / 365) * 100) / 100), 0);
      const monthlyRent = nextDayRaw > 30 ? Math.round((portfolio.reduce((sum, p) => sum + p.rent, 0) / 12) * 100) / 100 : 0;
      setCash(v => Math.max(0, Math.round((v - overhead - maintenance + monthlyRent) * 100) / 100));
      setDay(nextDay);
      setMonth(nextMonth);
      if (nextMonthRaw > 12) setYear(v => v + 1);
      setHour(6);
      setWorkHours(0);
      tell(`Yeni gün başladı. Günlük geçim gideri: ${overhead} oyun lirası; mülk bakımı: ${maintenance}. ${monthlyRent ? `Ay sonu kira tahsilatı: +${monthlyRent}.` : ''}`);
      return;
    }
    const isWorkingHour = hour >= 8 && hour < 19;
    let net = 0;
    let detail = '';
    if (work && isWorkingHour) {
      const variance = 0.82 + Math.random() * 0.36;
      const gross = Math.round(profession.gross * variance * 100) / 100;
      net = gross;
      detail = `${profession.name}: saatlik hasılat ${gross.toFixed(2)}; günlük giderler gün sonunda hesaplanacak`;
      setWorkHours(v => v + 1);
    } else if (work && !isWorkingHour) {
      detail = 'Bu saatte iş bulmak zor. Dinlenmeyi veya saati ilerletmeyi seçtin.';
    }
    if (shopOpen && owned.length > 0 && hour >= 7 && hour < 21) {
      const shopGross = Math.round((2.2 + Math.random() * 3.8) * 100) / 100;
      const stockCost = Math.round((1.1 + Math.random() * 1.5) * 100) / 100;
      const shopNet = shopGross - stockCost;
      net += shopNet;
      detail += `${detail ? ' · ' : ''}Dükkan satışı ${shopGross.toFixed(2)}, stok ${stockCost.toFixed(2)}`;
    }
    setCash(v => Math.max(0, Math.round((v + net) * 100) / 100));
    const nextHour = (hour + 1) % 24;
    setHour(nextHour);
    setSteps(v => v + 1);
    if (detail) tell(`${String(hour).padStart(2, '0')}:00 — ${detail}. Net değişim: ${net >= 0 ? '+' : ''}${net.toFixed(2)} oyun lirası.`);
    else tell(`${String(hour).padStart(2, '0')}:00 — Sokak sakin. Bu saatte düzenli bir gelir elde etmedin.`);
  };

  const sleepUntilMorning = () => {
    const nextDayRaw = day + 1;
    const nextDay = nextDayRaw > 30 ? 1 : nextDayRaw;
    const nextMonthRaw = month + (nextDayRaw > 30 ? 1 : 0);
    const nextMonth = nextMonthRaw > 12 ? 1 : nextMonthRaw;
    const upkeep = profession.overhead + portfolio.reduce((sum, p) => sum + Math.max(0.01, Math.round((p.price * 0.003 / 365) * 100) / 100), 0);
    const rent = nextDayRaw > 30 ? Math.round((annualRent / 12) * 100) / 100 : 0;
    setCash(v => Math.max(0, Math.round((v - upkeep + rent) * 100) / 100));
    setDay(nextDay);
    setMonth(nextMonth);
    if (nextMonthRaw > 12) setYear(v => v + 1);
    setHour(6);
    setWorkHours(0);
    tell(`Geceyi geçirdin. Günlük giderler işlendi.${rent ? ` Ay sonu kira tahsilatı: +${rent} oyun lirası.` : ''}`);
  };

  const buy = () => {
    if (owned.includes(active.id)) { tell('Bu mülk zaten portföyünde.'); return; }
    if (cash < active.price) { tell('Bu mülk için yeterli sermayen yok. Önce çalışıp birikim yap.'); return; }
    setCash(v => v - active.price);
    setOwned(v => [...v, active.id]);
    setSteps(v => v + 1);
    tell(`${active.name} satın alındı. Şimdi bu mekanın desteklediği işletme türlerinden birini seçebilirsin.`);
  };

  clockAction.current = () => advanceHour(false);
  useEffect(() => {
    const timer = window.setInterval(() => clockAction.current?.(), 20000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleShop = () => {
    if (owned.length === 0) { tell('İşletme açmak için önce bir mülk edinmelisin.'); return; }
    setShopOpen(v => !v);
    tell(shopOpen ? 'Dükkan kapatıldı; satış ve stok giderleri durdu.' : 'Dükkan açıldı. Açık olduğu saatlerde satış ve stok maliyeti işleyecek.');
  };

  return <main className="app-shell">
    <header className="topbar">
      <a className="wordmark" href="#" aria-label="Mahalle ana sayfa"><span className="mark">M.</span><span>MAHALLE</span></a>
      <div className="top-center"><span className="live-dot" /> BİR BEYOĞLU YAŞAM SİMÜLASYONU</div>
      <button className="avatar-button" onClick={() => setShowPortfolio(v => !v)} aria-label="Portföyü aç">CC</button>
    </header>

    <section className="intro-row">
      <div>
        <div className="eyebrow">SEZON 01 <span>/</span> İSTANBUL</div>
        <h1>BEYOĞLU <span>{year}</span></h1>
        <p className="intro-copy">Bir meslek seç. Bir sokak kur. Kendi hikayeni yaz.</p>
      </div>
      <div className="progress-control">
        <div className="date-label">OYUN TAKVİMİ · {String(day).padStart(2, '0')}/{String(month).padStart(2, '0')}/{year}</div>
        <div className="year-display">{String(hour).padStart(2, '0')}:00 <small>/ 24 SAAT</small></div>
        <button className="advance-button" onClick={() => advanceHour(false)}>{hour === 5 ? 'YENİ GÜNE GEÇ' : 'SAATİ İLERLET'} <span>▶</span></button>
      </div>
    </section>

    <section className="game-layout">
      <div className="world-panel">
        <div className="world-topline"><span><span className="live-dot" /> BEYOĞLU MERKEZİ</span><span>OYUN DÜNYASI <i>·</i> {year}</span></div>
        <CityScene selected={selected} owned={owned} onSelect={setSelected} />
        <div className="map-legend"><span><i className="legend-dot available" /> SATILIK MÜLK</span><span><i className="legend-dot owned" /> SENİN MÜLKÜN</span><span className="map-hint">SÜRÜKLE: DÖNDÜR · KAYDIR: YAKINLAŞ · BİNAYA TIKLA</span></div>
        <div className="world-caption"><span>İSTANBUL / BEYOĞLU</span><span>GÜN {day} <i>·</i> SAAT {String(hour).padStart(2, '0')}:00</span></div>
      </div>

      <aside className="side-panel">
        <section className="balance-card profession-card">
          <div className="card-label">01 / MESLEK SEÇİMİ</div>
          <select className="profession-select" value={professionId} onChange={e => setProfessionId(e.target.value)}>
            {professionOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <p className="profession-description">{profession.description}</p>
          <div className="profession-meta">Saatlik hasılat ≈ {profession.gross.toFixed(2)} · Günlük gider {profession.overhead} oyun lirası</div>
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
          <button className="work-button" onClick={() => advanceHour(true)} disabled={hour >= 22 || hour < 6}>1 SAAT ÇALIŞ <span>＋</span></button>
          <button className="rest-button" onClick={sleepUntilMorning}>UYU · YENİ GÜNE GEÇ <span>↗</span></button>
          <p className="small-note">Çalıştığın saatte gelir elde edersin. Dükkanın açıksa satışlar saat ilerledikçe işler.</p>
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
            <div><span>Durum</span><strong className={owned.includes(active.id) ? 'owned-text' : ''}>{owned.includes(active.id) ? 'PORTFÖYÜNDE' : 'SATILIK'}</strong></div>
          </div>
          <button className={owned.includes(active.id) ? 'buy-button is-owned' : 'buy-button'} onClick={buy} disabled={owned.includes(active.id)}>
            {owned.includes(active.id) ? 'MÜLK SENİN' : 'MÜLKÜ SATIN AL'} <span>{owned.includes(active.id) ? '✓' : '↗'}</span>
          </button>
          {owned.includes(active.id) && <button className="operate-button" onClick={toggleShop}>{shopOpen ? 'İŞLETMENİ KAPAT' : 'DÜKKANI İŞLETMEYE AÇ'}</button>}
          <div className="property-note"><span>i</span> Mülk fiyatları şimdilik oyun dengesi için belirlenmiştir.</div>
        </section>

        <section className="portfolio-mini">
          <div className="section-heading"><span>05 / PORTFÖYÜN</span><button onClick={() => setShowPortfolio(v => !v)}>{showPortfolio ? 'KAPAT −' : 'TÜMÜNÜ GÖR +'}</button></div>
          {portfolio.length === 0 ? <div className="empty-portfolio"><span className="empty-icon">⌂</span><span>Henüz bir mülk edinmedin.</span></div> :
            portfolio.slice(0, 2).map(p => <div className="portfolio-row" key={p.id}><span className="portfolio-thumb">⌂</span><span className="portfolio-name">{p.name}<small>{p.type} · Yıllık ₺{p.rent}</small></span><span className="portfolio-value">₺{p.price}</span></div>)}
          {showPortfolio && <div className="portfolio-expanded">
            {portfolio.length === 0 ? <p>İlk yatırımın burada görünecek.</p> : portfolio.map(p => <div className="portfolio-row" key={p.id}><span className="portfolio-thumb">⌂</span><span className="portfolio-name">{p.name}<small>Yıllık kira: ₺{p.rent}</small></span><span className="portfolio-value">₺{p.price}</span></div>)}
            <div className="portfolio-total">YILLIK KİRA POTANSİYELİ <strong>₺{annualRent}</strong></div>
          </div>}
        </section>

        <section className="activity-card">
          <div className="section-heading"><span>06 / MAHALLE GÜNLÜĞÜ</span><span className="count-tag">CANLI</span></div>
          {log.map(item => <div className="log-line" key={item.id}><span className="log-square" />{item.text}</div>)}
        </section>
      </aside>
    </section>

    <footer className="footer"><span>MAHALLE <i>©</i> 1923</span><span>GEÇMİŞİN İÇİNDE BİR GELECEK KUR.</span><span>PROTOTİP 0.3.0</span></footer>
    <div className="economy-note">Ekonomi değerleri oynanabilir prototip varsayımlarıdır; doğrulanmış 1923 ücret ve fiyat verileri değildir.</div>
    {notice && <div className="toast" key={noticeId} role="status">{notice}</div>}
  </main>;
}

export default App;