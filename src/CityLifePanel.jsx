import React from 'react';
import { storyForDay, normalizeNeighborhood, neighborhoodPulse } from './cityLifeEngine.js';

const fmt=v=>Number(v||0).toLocaleString('tr-TR',{maximumFractionDigits:1});
export default function CityLifePanel({properties,clock,ferryBusiness,neighborhood,stats,owned,cash,onChoice,busy=false}){
  const state=normalizeNeighborhood(neighborhood);
  const story=storyForDay(clock);
  const played=state.choices[story.key];
  const pulse=neighborhoodPulse({properties,clock,ferryBusiness,neighborhood:state,businessStats:stats});
  const shops=pulse.footfall.filter(p=>owned.includes(p.id)).sort((a,b)=>b.visits-a.visits).slice(0,5);
  return <section className="living-economy-panel" aria-label="Mahalle hikâyeleri ve yaşayan şehir ekonomisi">
    <div className="living-kicker">BEYOĞLU 1923 · YAŞAYAN ŞEHİR</div>
    <h2>Mahalle Nabzı</h2>
    <p className="living-intro">{pulse.description}. Sakinler evlerinden, iş yerlerine ve alışveriş noktalarına belirli yollarla gidiyor.</p>
    <div className="living-pulse-grid">
      <div><small>MAHALLE İTİBARI</small><strong>{Math.round(pulse.reputation)}<em>/100</em></strong><div className="living-meter"><span style={{width:pulse.reputation+'%'}}/></div></div>
      <div><small>TEDARİK GÜVENİ</small><strong>{Math.round(pulse.supplyTrust)}<em>/100</em></strong><div className="living-meter"><span style={{width:pulse.supplyTrust+'%'}}/></div></div>
      <div><small>BU SAATKİ MÜŞTERİLER</small><strong>{pulse.totalVisitors}</strong><span className="living-note">Sokak rotalarından modellenen ziyaretler</span></div>
      <div><small>HAREKETLİ İŞLETMELER</small><strong>{pulse.activeShops}</strong><span className="living-note">Müşteri alan dükkânlar</span></div>
    </div>
    <div className="living-street-note">
      <strong>Birbirine bağlı mahalle</strong>
      <p>Tramvay ve vapur hatları müşteri akışını etkiler. Güvenilir tedarik, depoya mal alırken maliyeti azaltabilir. Mahalle itibarı ve müşteri ziyaretleri gerçek saatlik satış ihtimaline yansır.</p>
    </div>
    <div className="living-story">
      <div className="living-story-top"><span>{story.historical?'TARİHÎ TARİH · KURGUSAL KARAKTER HİKÂYESİ':'MAHALLE HİKÂYESİ · KURGU'}</span><span>{clock.day}.{String(clock.month).padStart(2,'0')}.{clock.year}</span></div>
      <h3>{story.title}</h3>
      <div className="living-subtitle">{story.subtitle}</div>
      <p>{story.story}</p>
      {story.source&&<a href={story.source} target="_blank" rel="noreferrer">Tarihî olayın kaynağı</a>}
      {played
        ?<div className="living-story-result"><strong>BU HİKÂYEYİ TAMAMLADIN</strong><p>{played.reply}</p><small>Mahalle itibarı {played.reputation>0?'+':''}{played.reputation} · Tedarik güveni {played.supplyTrust>0?'+':''}{played.supplyTrust}</small></div>
        :<div className="living-decisions">{story.choices.map(choice=>
          <button key={choice.id} type="button" disabled={busy||Number(cash)<choice.cost} onClick={()=>onChoice(story,choice.id)}>
            <span><strong>{choice.label}</strong><small>İtibar {choice.reputation>0?'+'+choice.reputation:choice.reputation} · Tedarik {choice.supplyTrust>0?'+'+choice.supplyTrust:choice.supplyTrust}</small></span>
            <b>{choice.cost>0?'₺'+choice.cost:'ÜCRETSİZ'}</b>
          </button>)}</div>}
    </div>
    <div className="living-owned">
      <strong>SENİN DÜKKÂNLARINA GELENLER</strong>
      {shops.length?shops.map(shop=><div className="living-venue" key={shop.id}>
        <span>{shop.name}</span><strong>{shop.visits} müşteri · ×{fmt(shop.demand)} talep</strong>
      </div>):<p>Henüz işletme açmadın. Satın aldığında bu bölümde gerçek müşteri akışını, tramvay ve vapur erişimini göreceksin.</p>}
    </div>
    <small className="living-disclaimer">Mahalle nüfusu ve ticaret rakamları 1923'ten alınmış istatistikler değil, oyun içi simülasyon tahminleridir.</small>
  </section>;
}
