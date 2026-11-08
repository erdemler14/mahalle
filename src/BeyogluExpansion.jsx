import React, { useEffect, useState } from 'react';

// Additive Beyoğlu expansion. Original property/world systems remain untouched.
// Historic names and district labels describe approximate historical placement.
const VENUES = [
  { id:'lebon', name:'Lebon Pastanesi', district:'Grande Rue de Péra / İstiklal', price:900, income:48, value:1450, opens:1923, desc:'Şairlerin ve yazarların uğrak pastanesi.' },
  { id:'nisuaz', name:'Nisuaz Pastanesi', district:'Ayhan Işık Sokak çevresi', price:720, income:42, value:1100, opens:1923, desc:'Gece sohbetleri ve edebiyat toplantıları.' },
  { id:'elhamra', name:'Elhamra Sineması', district:'İstiklal Caddesi', price:1800, income:96, value:2400, opens:1923, desc:'Sinema ve tiyatro gösterimleri.' },
  { id:'maxim', name:'Maxime Gece Kulübü', district:'Pera eğlence bölgesi', price:500, income:520, value:8500, opens:1923, desc:'Özel fırsat: satın alınca mülk değeri hemen 8.500 TL olur; günlük 520 TL getirir.' },
  { id:'tokatliyan', name:'Tokatlıyan Oteli', district:'İstiklal Caddesi', price:2200, income:130, value:3200, opens:1923, desc:'Seçkin konuklar ve konaklama.' },
  { id:'cicek', name:'Çiçek Pasajı', district:'İstiklal Caddesi', price:1350, income:82, value:1900, opens:1923, desc:'Pasaj dükkânları ve kiracı yönetimi.' },
  { id:'degustasyon', name:'Degüstasyon Lokantası', district:'Çiçek Pasajı', price:800, income:64, value:1250, opens:1928, desc:'1928 yılında açılır.' },
  { id:'tramway', name:'Elektrikli Tramvay İşletmesi', district:'Tünel / Beyoğlu güzergâhı', price:1400, income:90, value:2300, opens:1923, desc:'Hat, vagon, bilet ve sefer yönetimi.' }
];
const PEOPLE = [
  {name:'Yahya Kemal',text:'Bir şehrin ruhu, bazen bir pastane masasında saklıdır.',place:'Lebon'},
  {name:'Ahmet Haşim',text:'Beyoğlu akşamlarının bambaşka bir rengi var.',place:'Lebon'},
  {name:'İbrahim Çallı',text:'Yeni bir portre için ışık tam yerinde.',place:'Sanat çevresi'},
  {name:'Muhsin Ertuğrul',text:'Bu akşam gösteriye seyirci bulmam gerek.',place:'Elhamra'},
  {name:'Ali Bey',text:'Tramvay bugün biraz kalabalık, değil mi?',place:'Tramvay durağı'},
  {name:'Ayşe Hanım',text:'Mahallede yeni bir pastane açılmış.',place:'Nisuaz'}
];
const base = {fontFamily:'inherit', color:'#261f19'};
const small = {fontSize:12, opacity:.75};
const btn = {background:'#542b25',color:'#fff',border:0,borderRadius:8,padding:'9px 12px',fontWeight:750,cursor:'pointer'};
function loadState(key) {try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}}
export default function BeyogluExpansion({cash,setCash,year,month,day,saveKey}) {
  const key = saveKey + ':beyoglu-expansion-v1';
  const [data,setData] = useState(()=>loadState(key));
  const [open,setOpen] = useState(false);
  const [tab,setTab] = useState('venues');
  const [message,setMessage] = useState('');
  const [person,setPerson] = useState(0);
  const owned = Array.isArray(data.owned)?data.owned:[];
  const dateKey = year+'-'+month+'-'+day;
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(data))}catch{}},[key,data]);
  useEffect(()=>{
    // Calendar tick: daily yield only once per save/date, even across reloads.
    const state=loadState(key);
    const ids=Array.isArray(state.owned)?state.owned:[];
    if (!ids.length || state.lastPaid===dateKey) return;
    if (!state.lastPaid) {setData(s=>({...s,lastPaid:dateKey}));return;}
    const amount=VENUES.filter(v=>ids.includes(v.id)).reduce((n,v)=>n+v.income,0);
    if(amount>0) setCash(n=>Math.round((n+amount)*100)/100);
    setData(s=>({...s,lastPaid:dateKey}));
    setMessage('Beyoğlu işletmelerinden günlük gelir: +'+amount+' TL');
  },[key,dateKey,setCash]);
  const purchase=(v)=>{
    if(owned.includes(v.id))return;
    if(cash < v.price){setMessage('Bu işletme için yeterli paran yok.');return;}
    setCash(n=>Math.round((n-v.price)*100)/100);
    setData(s=>({...s,owned:[...(s.owned||[]),v.id],lastPaid:dateKey}));
    setMessage(v.id==='maxim'?'Maxime alındı! 500 TL bedelle mülk değeri hemen 8.500 TL oldu.':v.name+' satın alındı.');
  };
  const wealth=VENUES.filter(v=>owned.includes(v.id)).reduce((s,v)=>s+v.value,0);
  const earnings=VENUES.filter(v=>owned.includes(v.id)).reduce((s,v)=>s+v.income,0);
  return <div style={{...base,position:'fixed',left:14,bottom:82,zIndex:120,pointerEvents:'none'}}>
    <button style={{...btn,pointerEvents:'auto',boxShadow:'0 5px 25px #0005'}} onClick={()=>setOpen(x=>!x)} aria-expanded={open}>BEYOĞLU · İŞLETMELER {open?'×':'+'}</button>
    {open&&<section role="dialog" aria-label="Beyoğlu işletmeleri" style={{pointerEvents:'auto',marginTop:8,width:'min(390px,calc(100vw - 28px))',maxHeight:'min(70vh,630px)',overflowY:'auto',background:'#f8f0de',border:'1px solid #b79a79',borderRadius:13,padding:14,boxShadow:'0 13px 44px #0007'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <strong style={{fontSize:17}}>BEYOĞLU · 1920'LER</strong>
        <button onClick={()=>setOpen(false)} style={{border:0,background:'transparent',fontSize:22,cursor:'pointer'}}>×</button>
      </div>
      <div style={{...small,margin:'6px 0 10px'}}>Nakit: {Math.round(cash)} TL · Mülk değeri: {wealth} TL · Günlük gelir: {earnings} TL</div>
      <div style={{display:'flex',gap:7,marginBottom:12}}>
        {[['venues','İşletmeler'],['people','Karakterler'],['transport','Tramvay']].map(([id,label])=><button key={id} onClick={()=>setTab(id)} style={{...btn,padding:'7px 10px',background:tab===id?'#542b25':'#bba588',color:tab===id?'white':'#281e18'}}>{label}</button>)}
      </div>
      {message&&<p role="status" style={{fontSize:12,background:'#e8dbb8',borderRadius:8,padding:9}}>{message}</p>}
      {tab==='venues'&&VENUES.filter(v=>v.id!=='tramway').map(v=><article key={v.id} style={{borderTop:'1px solid #d8c7ab',padding:'10px 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',gap:10}}><strong>{v.name}</strong><strong>{owned.includes(v.id)?'SAHİP':v.price+' TL'}</strong></div>
        <div style={{...small,marginTop:3}}>{v.district} · +{v.income} TL/gün · Değer {v.value} TL</div>
        <div style={{...small,margin:'4px 0 7px'}}>{v.desc}</div>
        <button style={{...btn,padding:'6px 10px',opacity:owned.includes(v.id)||year<v.opens?.5:1}} disabled={owned.includes(v.id)||year<v.opens} onClick={()=>purchase(v)}>{owned.includes(v.id)?'Satın alındı':year<v.opens?v.opens+' yılında açılır':'Satın al'}</button>
      </article>)}
      {tab==='people'&&<div style={{padding:'12px 0'}}>
        <strong>{PEOPLE[person].name}</strong><div style={{...small}}>{PEOPLE[person].place}</div>
        <p style={{fontSize:14}}>“{PEOPLE[person].text}”</p>
        <button style={btn} onClick={()=>setPerson(i=>(i+1)%PEOPLE.length)}>Başka biriyle konuş</button>
        <p style={{...small,marginTop:15}}>Tarihî kişilere atfedilen diyaloglar oyun için kurgulanmıştır.</p>
      </div>}
      {tab==='transport'&&<div style={{padding:'8px 0'}}>
        <strong>Elektrikli Tramvay İşletmesi</strong>
        <p style={{...small}}>Tünel ve Beyoğlu hattında dönem tramvayları. Mevcut 3D tramvay ve ray sistemi korunur.</p>
        <p style={{fontSize:13}}>Satın alma: 1.400 TL · Günlük net gelir: 90 TL</p>
        <button style={btn} disabled={owned.includes('tramway')} onClick={()=>purchase(VENUES.find(v=>v.id==='tramway'))}>{owned.includes('tramway')?'İşletme senin':'İşletmeyi satın al'}</button>
      </div>}
    </section>}
  </div>;
}
