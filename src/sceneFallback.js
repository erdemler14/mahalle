// Graceful fallback for machines/browsers without a working WebGL2 context.
// This keeps the district visible and selectable instead of leaving a black canvas.
export function createSceneFallback(host, properties = [], onSelect = () => {}) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-label', 'Mahalle 1923 şehir haritası - uyumluluk görünümü');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;';
  const overlay = host.querySelector('.scene-building-overlay');
  if (overlay) overlay.style.visibility = 'hidden';
  host.insertBefore(canvas, host.firstChild);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    if (overlay) overlay.style.visibility = '';
    return () => {};
  }
  const bounds = {minX:-20,maxX:68,minZ:-39,maxZ:39};
  let scale = 1, offsetX = 0, offsetY = 0;
  const draw = () => {
    const width = Math.max(1,host.clientWidth), height = Math.max(1,host.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1,1.5);
    canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle = '#d8d4c9'; ctx.fillRect(0,0,width,height);
    const worldW=bounds.maxX-bounds.minX, worldH=bounds.maxZ-bounds.minZ;
    scale=Math.min((width-36)/worldW,(height-80)/worldH);
    offsetX=(width-worldW*scale)/2; offsetY=(height-worldH*scale)/2+8;
    const px=x=>offsetX+(x-bounds.minX)*scale;
    const py=z=>offsetY+(z-bounds.minZ)*scale;
    // Haliç and quay.
    ctx.fillStyle='#6e929c';ctx.fillRect(px(25.8),py(-39), (68-25.8)*scale,78*scale);
    ctx.fillStyle='#b6ad9d';ctx.fillRect(px(23.8),py(-39),2*scale,78*scale);
    // Main streets.
    ctx.fillStyle='#c2b9a8';
    for(const z of [-22,-7,8,23])ctx.fillRect(px(-20),py(z)-2,88*scale,4);
    for(const x of [-10,8,20])ctx.fillRect(px(x)-2,py(-39),4,78*scale);
    // Building footprints, coloured by use.
    for(const p of properties){
      const x=px(Number(p.x)||0), y=py(Number(p.z)||0);
      const w=Math.max(7,(Number(p.width)||2.1)*scale*.78), h=Math.max(6,(Number(p.depth)||1.9)*scale*.78);
      ctx.fillStyle=p.type==='Konut'?'#b99e85':p.type==='Atölye'?'#8c806e':p.type==='Depo'?'#9b927e':'#a77e68';
      ctx.fillRect(x-w/2,y-h/2,w,h);
      ctx.strokeStyle='#51473d';ctx.lineWidth=1;ctx.strokeRect(x-w/2,y-h/2,w,h);
    }
    ctx.fillStyle='#352f29';ctx.font='600 13px system-ui';ctx.fillText('MAHALLE · 1923',16,24);
    ctx.fillStyle='#51483e';ctx.font='12px system-ui';ctx.fillText('Uyumluluk görünümü · Bir binaya dokunarak seç',16,height-18);
  };
  const onClick=event=>{
    const rect=canvas.getBoundingClientRect();
    const x=(event.clientX-rect.left-offsetX)/scale+bounds.minX;
    const z=(event.clientY-rect.top-offsetY)/scale+bounds.minZ;
    const nearest=properties.map(p=>({p,d:Math.hypot((Number(p.x)||0)-x,(Number(p.z)||0)-z)})).sort((a,b)=>a.d-b.d)[0];
    if(nearest && nearest.d<2.8)onSelect(nearest.p.id);
  };
  const observer=new ResizeObserver(draw);
  observer.observe(host);canvas.addEventListener('click',onClick);draw();
  return ()=>{observer.disconnect();canvas.removeEventListener('click',onClick);canvas.remove();if(overlay)overlay.style.visibility='';};
}
