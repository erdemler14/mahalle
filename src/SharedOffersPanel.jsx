import React, {useState} from 'react';

const money = value => '₺' + Number(value || 0).toLocaleString('tr-TR',{maximumFractionDigits:2});

export default function SharedOffersPanel({offers=[],userId,onRespond,busy=false,error=''}) {
  const [counterAmounts,setCounterAmounts]=useState({});
  const current=offers.filter(o=>['pending','countered'].includes(o.status));
  const history=offers.filter(o=>!['pending','countered'].includes(o.status)).slice(0,4);
  const respond=(item,action)=>{
    const amount=action==='counter'?Number(counterAmounts[item.id]||item.price):null;
    onRespond(item,action,amount);
  };
  return <section className="shared-offers" aria-label="Ortak şehir mülk teklifleri">
    <div className="shared-offers-title"><strong>MÜLK TEKLİFLERİ</strong><span>{current.length} AÇIK</span></div>
    {error&&<div className="shared-offers-warning" role="status">{error}</div>}
    {!error&&!current.length&&<p className="shared-offers-empty">Şu anda cevap bekleyen teklif yok. Başkasına ait bir mülk seçip “Satın Alma Teklifi” gönder; burada takip edebilirsin.</p>}
    {current.map(offer=>{
      const buyer=offer.buyer_user_id===userId;
      const actionable=offer.status==='pending'?!buyer:buyer;
      return <article key={offer.id} className="shared-offer-card">
        <div className="shared-offer-top"><span>{offer.status==='countered'?'KARŞI TEKLİF':buyer?'GÖNDERİLDİ':'YENİ TEKLİF'}</span><strong>{money(offer.price)}</strong></div>
        <strong>{offer.property_name||('Mülk #'+offer.property_id)}</strong>
        <p>{buyer?'Satıcı: '+offer.seller_name:'Alıcı: '+offer.buyer_name}</p>
        {actionable
          ? <div className="shared-offer-actions">
            <button type="button" disabled={busy} onClick={()=>respond(offer,'accept')}>KABUL ET</button>
            {offer.status==='pending'&&<label>Karşı teklif (₺)<input aria-label="Karşı teklif tutarı" type="number" min="1" step=".01" value={counterAmounts[offer.id]??String(offer.price)} onChange={e=>setCounterAmounts(old=>({...old,[offer.id]:e.target.value}))}/><button type="button" disabled={busy} onClick={()=>respond(offer,'counter')}>KARŞI TEKLİF</button></label>}
            <button type="button" disabled={busy} className="offer-reject" onClick={()=>respond(offer,'reject')}>REDDET</button>
          </div>
          : <small>{buyer?'Mülk sahibinin cevabı bekleniyor.':'Alıcının karşı teklife cevabı bekleniyor.'}</small>}
      </article>;
    })}
    {!!history.length&&<details className="shared-offer-history"><summary>Önceki teklifler ({history.length})</summary>{history.map(offer=><div key={offer.id}>{offer.property_name||'Mülk #'+offer.property_id} · {money(offer.price)} · {offer.status==='accepted'?'Kabul edildi':offer.status==='rejected'?'Reddedildi':'İptal edildi'}</div>)}</details>}
    <p className="shared-offers-note">Ortak şehirde teklif ve devirler kayıtlıdır. Kabul edildiğinde mülk ve ücret eşzamanlı aktarılır; taraflardan birinin nakdi yetersizse devir yapılmaz.</p>
  </section>;
}
