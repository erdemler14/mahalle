import React from 'react';
import {TRAMWAY_LICENSE_PRICE,TRAMWAY_UPGRADES,calculateTramwayDay,normaliseTramwayBusiness} from './tramwayBusiness.js';
export default function TramwayBusinessPanel({state,cash,day,month,year,hour,propertyOwned,onPurchase,onUpgrade,disabled=false}) {
  const business=normaliseTramwayBusiness(state);
  const estimate=calculateTramwayDay({...business,lastSettledKey:''},{year,month,day});
  const format=v=>'₺'+Number(v||0).toLocaleString('tr-TR',{maximumFractionDigits:2,minimumFractionDigits:0});
  const activeHour=hour>=6&&hour<=22;
  return <section className="ferry-enterprise-panel tramway-enterprise-panel" aria-label="Beyoğlu elektrikli tramvay işletmeciliği">
    <div className="ferry-header">
      <span className="ferry-kicker">BEYOĞLU / 1923 · ELEKTRİKLİ TRAMVAY</span>
      <span className={'ferry-status '+(business.owned?'owned':'available')}>{business.owned?'HAT SENİN':propertyOwned?'RUHSAT ALINABİLİR':'ÖNCE İŞLETME BİNASI'}</span>
      <h2>Beyoğlu Tramvay İşletmesi</h2><p>Vagonları sefere çıkar, bilet gelirini topla, hattı yeni duraklarla genişlet. Seferler günlük kapanışta hesaplanır.</p>
    </div>
    <div className="ferry-stats">
      <div><span>İŞLETME RUHSATI</span><strong>{format(TRAMWAY_LICENSE_PRICE)}</strong></div>
      <div><span>TAHMİNİ GÜNLÜK NET</span><strong>{business.owned?format(estimate.net):'—'}</strong></div>
      <div><span>SEFER DURUMU</span><strong>{activeHour?'SEFERDE':'GECE / GARAJDA'}</strong></div>
      <div><span>FİLO</span><strong>{business.owned&&business.upgrades.secondCar?'2 VAGON':'1 VAGON'}</strong></div>
    </div>
    {!business.owned?<div className="ferry-license">
      <strong>{propertyOwned?'Tramvay işletme ruhsatı':'Tramvay deposu henüz sana ait değil'}</strong>
      <p>{propertyOwned?'İşletmeyi faaliyete geçirmek için ruhsatı al. Gelir ve giderler her oyun günü sonunda hesaplanır.':'Önce haritadaki Beyoğlu Elektrikli Tramvay İşletmesi binasını satın al.'}</p>
      <button type="button" className="ferry-purchase" disabled={disabled||!propertyOwned||cash<TRAMWAY_LICENSE_PRICE} onClick={onPurchase}>{disabled?'KAYIT YÜKLENİYOR':!propertyOwned?'İŞLETME BİNASINI SATIN AL':cash<TRAMWAY_LICENSE_PRICE?'BAKİYE YETERSİZ':'TRAMVAYI İŞLET · '+format(TRAMWAY_LICENSE_PRICE)}</button>
      {propertyOwned&&cash<TRAMWAY_LICENSE_PRICE&&<small>Ruhsat için {format(TRAMWAY_LICENSE_PRICE-cash)} daha biriktirmelisin.</small>}
    </div>:<div className="ferry-report">
      <div className="ferry-report-title">TRAMVAY İŞLETME DEFTERİ</div>
      <div><span>Son günün yolcusu</span><strong>{business.lastPassengers} kişi</strong></div>
      <div><span>Bilet ve ek hasılat</span><strong>{format(business.lastGross)}</strong></div>
      <div><span>Enerji ve bakım gideri</span><strong>−{format(business.lastCost)}</strong></div>
      <div><span>Son net kazanç</span><strong>{format(business.lastNet)}</strong></div>
      <div><span>Toplam işletme neti</span><strong>{format(business.totalNet)}</strong></div>
      <small>{business.daysOperated} oyun günü çalıştı · Hasılat günlük kapanışta kasana yansır.</small>
    </div>}
    <div className="ferry-upgrade-heading"><strong>HAT VE VAGON GELİŞTİRMELERİ</strong><span>{TRAMWAY_UPGRADES.filter(item=>business.upgrades[item.id]).length}/{TRAMWAY_UPGRADES.length}</span></div>
    <div className="ferry-upgrade-list">{TRAMWAY_UPGRADES.map(item=><div className={'ferry-upgrade '+(business.upgrades[item.id]?'purchased':'')} key={item.id}>
      <div><strong>{item.name}</strong><p>{item.detail}</p></div><button type="button" disabled={disabled||!business.owned||business.upgrades[item.id]||cash<item.price} onClick={()=>onUpgrade(item.id)}>{business.upgrades[item.id]?'ALINDI':format(item.price)}</button>
    </div>)}</div>
    <p className="ferry-historical-note">Dönem notu: İstanbul'da elektrikli tramvay işletmesi 1914'te başladı. Bilet tarifeleri, yolcu sayıları ve işletme maliyetleri oyun dengesi için kurgulanmıştır.</p>
  </section>;
}
