import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const properties = [
  { id: 1, name: 'Galata’da küçük dükkan', type: 'Ticaret', price: 420, rent: 32, x: -4.2, z: -1.1, color: '#d9c8ad', floors: 3, owned: false },
  { id: 2, name: 'Asmalımescit apartmanı', type: 'Konut', price: 860, rent: 58, x: 0, z: -3.2, color: '#c6b8a4', floors: 4, owned: false },
  { id: 3, name: 'Arka sokakta depo', type: 'Depo', price: 290, rent: 24, x: 4.1, z: -0.7, color: '#c7c0b3', floors: 2, owned: false },
  { id: 4, name: 'Cadde üzeri han', type: 'Ticaret', price: 1250, rent: 94, x: -2.4, z: 4.1, color: '#d5c4a8', floors: 4, owned: false },
  { id: 5, name: 'Meydan evi', type: 'Konut', price: 690, rent: 46, x: 3.2, z: 4.2, color: '#d4cbb9', floors: 3, owned: false }
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
      const w = idx === 3 ? 2.7 : 2.25;
      const d = idx === 1 ? 2.4 : 2.05;
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

      const windowMat = new THREE.MeshStandardMaterial({ color: '#65777a', roughness: 0.55, metalness: 0.05 });
      for (let floor = 0; floor < p.floors; floor++) {
        for (let col = 0; col < 2; col++) {
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 0.035), windowMat);
          win.position.set((col - 0.5) * 0.86, 0.48 + floor * 0.88, d / 2 + 0.022);
          group.add(win);
          const frame = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.055, 0.05), new THREE.MeshStandardMaterial({ color: '#f0e7d5' }));
          frame.position.set((col - 0.5) * 0.86, 0.48 + floor * 0.88, d / 2 + 0.045);
          group.add(frame);
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

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onClick = (event) => {
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
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.style.cursor = 'pointer';

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
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); } });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [owned]);

  return <div className="scene-host" ref={host} aria-label="Beyoğlu 1923 3D mahalle sahnesi" />;
}

function App() {
  const [year, setYear] = useState(1923);
  const [cash, setCash] = useState(1800);
  const [owned, setOwned] = useState([]);
  const [selected, setSelected] = useState(1);
  const [notice, setNotice] = useState('');
  const [speed, setSpeed] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const active = properties.find(p => p.id === selected) || properties[0];
  const portfolio = properties.filter(p => owned.includes(p.id));
  const totalRent = portfolio.reduce((sum, p) => sum + p.rent, 0);

  const advanceYear = () => {
    const next = year + 1;
    const income = totalRent;
    const inflation = 1 + (next - 1923) * 0.018;
    setCash(v => v + income);
    setYear(next);
    setNotice(income ? `${next} yılı başladı. ${income} ₺ kira geliri hesabına eklendi.` : `${next} yılı başladı. Henüz kira getiren bir mülkün yok.`);
    setTimeout(() => setNotice(''), 3800);
  };
  const buy = () => {
    if (owned.includes(active.id)) { setNotice('Bu mülk zaten portföyünde.'); return; }
    if (cash < active.price) { setNotice('Bu mülk için yeterli paran yok.'); return; }
    setCash(v => v - active.price);
    setOwned(v => [...v, active.id]);
    setNotice(`${active.name} portföyüne eklendi.`);
    setTimeout(() => setNotice(''), 3000);
  };

  return <main className="app-shell">
    <header className="topbar">
      <a className="wordmark" href="#" aria-label="Mahalle ana sayfa"><span className="mark">M.</span><span>mahalle</span></a>
      <div className="top-center"><span className="live-dot" /> TARİHSEL YAŞAM SİMÜLASYONU</div>
      <button className="avatar-button" onClick={() => setShowPortfolio(v => !v)} aria-label="Portföyü aç">CC</button>
    </header>

    <section className="intro-row">
      <div>
        <div className="eyebrow">BÖLÜM 01 <span>/</span> İSTANBUL</div>
        <h1>Beyoğlu, <span>{year}</span></h1>
        <p className="intro-copy">Bir mahalle. Bir başlangıç. Kuracağın bir hayat.</p>
      </div>
      <div className="date-control">
        <div className="date-label">TAKVİM</div>
        <div className="year-display">{year}</div>
        <button className="advance-button" onClick={advanceYear}>Yılı ilerlet <span>↗</span></button>
      </div>
    </section>

    <section className="game-layout">
      <div className="world-panel">
        <div className="world-topline"><span><span className="live-dot" /> BEYOĞLU MERKEZİ</span><span>3D TASLAK <i>·</i> {year}</span></div>
        <CityScene selected={selected} owned={owned} onSelect={setSelected} />
        <div className="map-legend"><span><i className="legend-dot available" /> Satılık mülk</span><span><i className="legend-dot owned" /> Senin mülkün</span><span className="map-hint">Binaları seçerek incele</span></div>
        <div className="world-caption"><span>İSTANBUL / BEYOĞLU</span><span>41° 01′ K <i>·</i> 28° 58′ D</span></div>
      </div>

      <aside className="side-panel">
        <section className="balance-card">
          <div className="card-label">KİŞİSEL VARLIK</div>
          <div className="balance-number"><span>₺</span>{cash.toLocaleString('tr-TR')}</div>
          <div className="balance-foot"><span>Başlangıç sermayesi</span><span className="positive">+{totalRent} ₺ / yıl</span></div>
          <div className="balance-rule"><span style={{width: `${Math.min(100, cash / 1800 * 100)}%`}} /></div>
        </section>

        <section className="property-card">
          <div className="section-heading"><span>MÜLKÜ İNCELE</span><span className="count-tag">0{active.id}</span></div>
          <div className="property-type">{active.type.toUpperCase()}</div>
          <h2>{active.name}</h2>
          <p className="property-description">Beyoğlu'nun gelişen sokaklarında, gelecekte değer kazanabilecek bir taşınmaz.</p>
          <div className="property-stats">
            <div><span>Satış bedeli</span><strong>₺{active.price.toLocaleString('tr-TR')}</strong></div>
            <div><span>Yıllık kira</span><strong>₺{active.rent.toLocaleString('tr-TR')}</strong></div>
            <div><span>Kat sayısı</span><strong>{active.floors} kat</strong></div>
            <div><span>Durum</span><strong className={owned.includes(active.id) ? 'owned-text' : ''}>{owned.includes(active.id) ? 'Portföyünde' : 'Satılık'}</strong></div>
          </div>
          <button className={owned.includes(active.id) ? 'buy-button is-owned' : 'buy-button'} onClick={buy} disabled={owned.includes(active.id)}>
            {owned.includes(active.id) ? 'Portföyünde' : 'Mülkü satın al'} <span>{owned.includes(active.id) ? '✓' : '↗'}</span>
          </button>
          <div className="property-note"><span>i</span> Satın aldığın mülkler her yıl kira geliri sağlar.</div>
        </section>

        <section className="portfolio-mini">
          <div className="section-heading"><span>PORTFÖYÜN</span><button onClick={() => setShowPortfolio(v => !v)}>{showPortfolio ? 'Kapat −' : 'Tümünü gör +'}</button></div>
          {portfolio.length === 0 ? <div className="empty-portfolio"><span className="empty-icon">⌂</span><span>Henüz bir mülk edinmedin.</span></div> :
            portfolio.slice(0, 2).map(p => <div className="portfolio-row" key={p.id}><span className="portfolio-thumb">⌂</span><span className="portfolio-name">{p.name}<small>{p.type} · Yıllık ₺{p.rent}</small></span><span className="portfolio-value">₺{p.price}</span></div>)}
          {showPortfolio && <div className="portfolio-expanded">
            {portfolio.length === 0 ? <p>İlk yatırımın burada görünecek.</p> : portfolio.map(p => <div className="portfolio-row" key={p.id}><span className="portfolio-thumb">⌂</span><span className="portfolio-name">{p.name}<small>Yıllık kira: ₺{p.rent}</small></span><span className="portfolio-value">₺{p.price}</span></div>)}
          </div>}
        </section>
      </aside>
    </section>

    <footer className="footer"><span>MAHALLE <i>©</i> 2026</span><span>GEÇMİŞİN İÇİNDE BİR GELECEK KUR.</span><span>PROTOTİP 0.1.0</span></footer>
    {notice && <div className="toast" role="status">{notice}</div>}
  </main>;
}

export default App;