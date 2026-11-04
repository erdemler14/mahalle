import React from 'react';
import {FERRY_LICENSE_PRICE,FERRY_UPGRADES,calculateFerryDay,normaliseFerryBusiness} from './ferryBusiness.js';

export default function FerryBusinessPanel({
  state, cash, day, month, year, hour,
  onPurchase, onUpgrade, disabled=false
}) {
  const business=normaliseFerryBusiness(state);
  const estimate=calculateFerryDay({...business,lastSettledKey:''},{year,month,day});
  const format=v=>'₺'+Number(v||0).toLocaleString('tr-TR',{maximumFractionDigits:2,minimumFractionDigits:0});
  const activeHour=hour>=6&&hour<=21;
  return <section className="ferry-enterprise-panel" aria-label="Haliç vapur hattı işletmeciliği">
    <div className="ferry-header">
      <span className="ferry-kicker">HALİÇ / 1923 · ULAŞIM İMTİYAZI</span>
      <span className={'ferry-status '+(business.owned?'owned':'available')}>{business.owned?'HAT SENİN':'SATIN ALINABİLİR'}</span>
      <h2>Haliç Vapur Hattı</h2>
      <p>Taş iskeleler arasında düzenli yolcu seferleri. Şehre bak, hattı işlet, gemi ve rıhtım hizmetlerini geliştir.</p>
    </div>
    <div className="ferry-stats">
      <div><span>HAT İMTİYAZI</span><strong>{format(FERRY_LICENSE_PRICE)}</strong></div>
      <div><span>GÜNÜN TAHMİNİ NET GELİRİ</span><strong>{business.owned?format(estimate.net):'—'}</strong></div>
      <div><span>SEFER DURUMU</span><strong>{activeHour?'GÜNDÜZ SEFERLERİ':'GECE / HAZIRLIK'}</strong></div>
      <div><span>FİLO</span><strong>{business.owned&&business.upgrades.secondFerry?'2 VAPUR':'1 VAPUR'}</strong></div>
    </div>
    {!business.owned
      ? <div className="ferry-license">
          <strong>Küçük vapur hattı işletme imtiyazı</strong>
          <p>200 TL, Mahalle'nin oyun içi satın alma bedelidir; tarihî bir şirketin gerçek satış fiyatı değildir. Hattı alınca gelir her oyun gününün sonunda hesaplanır.</p>
          <button type="button" className="ferry-purchase" disabled={disabled||cash<FERRY_LICENSE_PRICE}
            onClick={onPurchase}>
            {disabled?'KAYIT YÜKLENİYOR':cash<FERRY_LICENSE_PRICE?'BAKİYE YETERSİZ':'VAPUR HATTINI AL · ₺200'}
          </button>
          {cash<FERRY_LICENSE_PRICE&&<small>Almak için {format(FERRY_LICENSE_PRICE-cash)} daha biriktirmelisin.</small>}
        </div>
      : <div className="ferry-report">
          <div className="ferry-report-title">İŞLETME DEFTERİ</div>
          <div><span>Son günün yolcusu</span><strong>{business.lastPassengers} kişi</strong></div>
          <div><span>Son günün hasılatı</span><strong>{format(business.lastGross)}</strong></div>
          <div><span>Son günün gideri</span><strong>−{format(business.lastCost)}</strong></div>
          <div><span>Son net kazanç</span><strong>{format(business.lastNet)}</strong></div>
          <div><span>Toplam işletme neti</span><strong>{format(business.totalNet)}</strong></div>
          <small>{business.daysOperated} oyun günü çalıştı · Kazanç günlük kapanışta kasana yansır.</small>
        </div>}
    <div className="ferry-upgrade-heading"><strong>İSKELE VE SEFER GELİŞTİRMELERİ</strong><span>{FERRY_UPGRADES.filter(item=>business.upgrades[item.id]).length}/{FERRY_UPGRADES.length}</span></div>
    <div className="ferry-upgrade-list">
      {FERRY_UPGRADES.map(item=><div className={'ferry-upgrade '+(business.upgrades[item.id]?'purchased':'')} key={item.id}>
        <div><strong>{item.name}</strong><p>{item.detail}</p></div>
        <button type="button" disabled={disabled||!business.owned||business.upgrades[item.id]||cash<item.price}
          onClick={()=>onUpgrade(item.id)}>
          {business.upgrades[item.id]?'ALINDI':format(item.price)}
        </button>
      </div>)}
    </div>
    <p className="ferry-historical-note">Dönem notu: Galata Köprüsü 1912'de yenilendi; 1923'te tramvay ve yaya trafiği taşıyordu. Vapur seferleri Şirket-i Hayriye ve Haliç taşımacılığı gibi ayrı işletmelerle yürütülüyordu. Buradaki imtiyaz ve tarifeler oyuna özgüdür.</p>
  </section>;
}
