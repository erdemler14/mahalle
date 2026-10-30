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
  { id: 28, name: 'Sotiri Biraderler Kolonyacı ve Parfümeri', type: 'Ticaret', price: 3420, rent: 47, x: 15.2, z: 7.1, color: '#d6c3a8', floors: 2, style: 'Kepenkli, dar vitrinli parfümeri', history: 'Geç Osmanlı döneminde Beyoğlu’nda kolonya, sabun ve Avrupa esansları satan küçük aile dükkânlarından esinlenir.' },
  { id: 29, name: 'Mavridis Biraderler Sabun İmalathanesi', type: 'Atölye', price: 3870, rent: 49, x: -15.3, z: 12.8, color: '#b9b3a6', floors: 2, style: 'Arka avlulu küçük imalathane' },
  { id: 30, name: 'Sıraselviler’de Crespi Apartmanı', type: 'Konut', price: 5355, rent: 66, x: 15.2, z: 12.8, color: '#c8b8c2', floors: 4, style: 'Üst katlarda kiralık daireleri olan apartman', units: 6 },
  { id: 31, name: 'Şeref Usta’nın Lokantası', type: 'İşletme', price: 5670, rent: 77, x: -5.5, z: 17.2, color: '#c7a18e', floors: 2, style: 'Sokak köşesinde eski usul lokanta' },
  { id: 32, name: 'Papadopulos Matbaa ve Kırtasiyesi', type: 'Atölye', price: 4185, rent: 54, x: 5.5, z: 17.2, color: '#b8b0a4', floors: 3, style: 'Baskı atölyesi ve kırtasiye' },
  { id: 33, name: 'Şevket Efendi’nin Berberhanesi', type: 'İşletme', price: 1980, rent: 42, x: 0, z: 20.5, color: '#b6a18c', floors: 2, style: 'Pera usulü berber dükkânı, pirinç aynalar ve ahşap koltuk' },
  { id: 34, name: 'Çiçekçi Dükkânı', type: 'Ticaret', price: 2475, rent: 38, x: 20.5, z: 18.4, color: '#c4b6a6', floors: 2, style: 'Vitrininde çiçekler ve saksılar bulunan küçük çiçekçi' },
  { id: 35, name: 'Haliç Gazinosu', type: 'İşletme', price: 3350, rent: 245, x: 21.2, z: 12.2, color: '#a88c73', floors: 2, style: 'Haliç kıyısında teraslı, deniz manzaralı gazino' },
  { id: 36, name: 'Kohen Hemşireler Kitabevi', type: 'Ticaret', price: 2100, rent: 42, x: 20.7, z: 5.3, color: '#bca98e', floors: 2, width: 2.35, depth: 1.9, style: 'Tünel Pasajı içinde dar cepheli, küçük tarihî kitabevi', history: '1918’de açılan tarihî kitabevinden esinlenir; yabancı dilde kitap, roman, sözlük ve kırtasiye ürünleriyle tanınır.' },
  { id: 39, name: 'Sokrat Kıraathanesi', type: 'İşletme', price: 2850, rent: 52, x: -20.5, z: -5.3, color: '#c5b9a4', floors: 2, width: 2.5, depth: 2.1, style: 'Sokrat adıyla bilinen mahalle kıraathanesi', history: 'Dönemin mahalle kahvehanelerini temsil eder; kahve, çay, şerbet ve küçük tatlılar sunar.' },
  { id: 40, name: 'Tarihi Mahalle Hamamı', type: 'İşletme', price: 8200, rent: 165, x: -20.5, z: 5.3, color: '#b9aa94', floors: 1, width: 4.0, depth: 3.2, style: 'Yüksek kubbeli, geniş soyunmalık ve sıcaklık bölümleri olan tarihî hamam', history: 'Geç Osmanlı İstanbul’undaki mahalle hamamlarından esinlenen, yıkanma ve kese hizmeti sunan kamusal yapı.' },
  { id: 41, name: 'Pera Buharlı Kuru Temizleme', type: 'İşletme', price: 3650, rent: 68, x: 27.2, z: 22.5, color: '#b9c5c5', floors: 2, width: 2.8, depth: 2.3, style: 'Pirinç askılıklı, geniş vitrinli ve arka bölümünde buharlı ütüleme yapılan şehirli kuru temizleme dükkânı', history: '1910’ların Pera’sındaki modern şehir hizmetlerinden esinlenir. Görünürde takım elbise, palto ve hassas kumaş temizliği yapar; ancak kasasındaki olağan dışı nakit hareketleri onu mahallenin en riskli yatırımlarından biri hâline getirir.' },
  { id: 42, name: 'Dr. Deniz Hanım Muayenehanesi', type: 'İşletme', price: 4850, rent: 82, x: -27.5, z: -15.5, color: '#b8c8b7', floors: 2, width: 2.6, depth: 2.2, style: 'Bekleme odalı, ahşap kapılı hekim muayenehanesi', history: 'Dr. Deniz Hanım mahalle sakinlerine muayene, ev ziyareti ve temel tedavi hizmetleri sunar.' },
  { id: 43, name: 'Avukat Nihat Bey Hukuk Bürosu', type: 'İşletme', price: 4450, rent: 76, x: -22.5, z: -15.5, color: '#b9b6ca', floors: 2, width: 2.6, depth: 2.2, style: 'Hukuk kitapları, yazı masası ve müvekkil kabul odası', history: 'Dava takibi, dilekçe ve sözleşme hizmeti sunan dönem hukuk bürosu.' },
  { id: 44, name: 'Diş Tabibi Rauf Bey Kliniği', type: 'İşletme', price: 4250, rent: 72, x: -17.5, z: -15.5, color: '#c9c7b8', floors: 2, width: 2.5, depth: 2.1, style: 'Dişçi koltuğu ve küçük tedavi odası bulunan klinik', history: 'Dönemin diş tabipliği ve ağız sağlığı hizmetlerinden esinlenir.' },
  { id: 45, name: 'Mühendislik ve Mimarlık Bürosu', type: 'İşletme', price: 4650, rent: 78, x: -12.5, z: -15.5, color: '#c7b8a5', floors: 2, width: 2.7, depth: 2.2, style: 'Rulo planlar, çizim masası ve teknik kitaplık', history: 'Yapı keşfi, proje çizimi ve teknik danışmanlık sunar.' },
  { id: 46, name: 'SMMM ve Muhasebe Yazıhanesi', type: 'İşletme', price: 3950, rent: 66, x: -7.5, z: -15.5, color: '#c5b8a8', floors: 2, width: 2.5, depth: 2.1, style: 'Defterler, hesap cetvelleri ve evrak dolabı bulunan yazıhane', history: 'Esnaf defterleri, hesap tutma ve vergi evrakı hizmeti sunar.' },
  { id: 47, name: 'Beyoğlu Ticaret ve Meslek Mektebi', type: 'İşletme', price: 12800, rent: 180, x: -2.5, z: -15.5, color: '#b7c4cf', floors: 3, width: 3.2, depth: 2.7, style: 'Üç katlı tarihî eğitim binası, amfiler ve meslek sınıfları', history: 'Hekimlik, hukuk, eczacılık ve teknik meslekler için uzun süreli ücretli eğitimler sunar.' }
];

// Short, period-grounded vignettes give every building a distinct neighbourhood memory.
  const propertyStories = {
    1: "1910’larda Eleni Hanım’ın dükkânı sabah erkenden açılır; çevredeki aileler peynir, zeytin ve günlük erzak için önce buraya uğrardı.",
    2: "Bu apartmanın üst katlarında Levanten aileler ve bekâr memurlar oturur; girişteki kapıcı, gelen mektupları ve şehir dedikodularını herkesten önce duyardı.",
    3: "Rıhtıma yakın bu ambar, gemilerden indirilen kumaş toplarını, kahve çuvallarını ve ithal ev eşyasını dükkânlara dağıtan küçük tüccarların uğrak yeriydi.",
    4: "Şahin Bey, Anadolu’dan gelen tüccarlara oda ve depo yeri verirdi; hanın avlusunda her sabah yük arabaları ve pazarlık sesleri birbirine karışırdı.",
    5: "Meydancık’taki bu evin cumbasından sokağa bakan Ali Rıza Bey, mahalleye gelen yeni esnafı ve değişen dükkân tabelalarını yıllardır not ederdi.",
    6: "Petraki Kalfa’nın yaptığı taş işçiliğiyle tanınan ev, dar merdiveni ve avlu kuyusuyla eski Beyoğlu’nun zanaatkâr ailelerini hatırlatırdı.",
    7: "Maison Vuccino’da şarap fıçılarıyla peynir sandıkları yan yana dururdu; dükkân, Pera lokantalarına ve evlerine erzak alan müşterilere hizmet verirdi.",
    8: "Apostolidis Apartmanı’nın balkonlarında çamaşırlar kurur, girişindeki küçük bekleme alanında kiracılar kira ve tamirat haberlerini konuşurdu.",
    9: "Nuri Efendi’nin matbaasında davetiye, ticari makbuz ve gazete ilanları basılırdı; geceleri bile kurşun harflerin sesi sokaktan duyulurdu.",
    10: "Au Paon, vitrinindeki yeni kesim ceketler ve Avrupa kumaşlarıyla dikkat çekerdi; terziler sabah ölçü alır, akşamüstü son prova için müşterileri beklerdi.",
    11: "Avlulu Hacı İsmail Efendi Evi’nde aile toplantıları avluda yapılır, kapı önündeki taş sekide komşular günün haberlerini paylaşırdı.",
    12: "Hakkı Efendi’nin kıraathanesinde gazeteler yüksek sesle okunur; tüccarlar, hamallar ve memurlar bir bardak çay eşliğinde şehirdeki gelişmeleri tartışırdı.",
    13: "Schumacher’in fırınından çıkan sıcak somunlar daha gün doğmadan mahalleye dağılır, fırının önünde işe yetişmeye çalışanlar sıraya girerdi.",
    14: "Kurban Usta sabah erkenden dükkânını açar, kasap kâğıdına sardığı etleri mahalle evlerine ve yakındaki lokantalara hazırlardı.",
    15: "Canzuch Eczahanesi’nin raflarında cam şişeler, tentürler ve merhem kavanozları sıralanır; eczacı hem reçete hazırlar hem de mahallelinin derdini dinlerdi.",
    16: "Narlıyan’ın raflarında romanlar, sözlükler ve okul defterleri bulunurdu; öğrenciler sınav öncesi, memurlar ise yeni çıkan gazeteleri almak için uğrardı.",
    17: "Hakkı Usta’nın marangozhanesinden rende kokusu eksik olmazdı; apartman kapıları, masa ayakları ve dükkân rafları burada sipariş üzerine yapılırdı.",
    18: "Yorgo’nun tezgâhına sabah kasalarla meyve ve sebze gelirdi; taze ürün seçmek isteyen ev hanımları en iyi domatesin hangi kasada olduğunu bilirdi.",
    19: "Hacı Salih’in esnaf lokantası, öğle arasında çorba ve tencere yemeği arayan hamalların, kâtiplerin ve dükkân sahiplerinin ortak sofrasıydı.",
    20: "Karabet Usta’nın ocağında at nalı, kapı menteşesi ve soba parçası dövülürdü; çekiç sesi yokuştan geçenlere atölyenin açık olduğunu haber verirdi.",
    21: "Hacı Arif Paşa Hanı’nda taşradan gelen tüccarlar kalır, mallarını depolar ve ertesi günkü satış için kahve içerek hesap tutardı.",
    22: "Galata Yokuşu’ndaki Zeki Bey Apartmanı, limanla Pera arasındaki hareketli hayatın ortasında memurlara ve küçük tüccarlara ev sahipliği yapardı.",
    23: "Madam Mari’nin dükkânında tarçın, karanfil, ıhlamur ve şifalı otlar kesekâğıtlarına tartılır; bazı karışımlar aileden aileye aktarılan tariflerle hazırlanırdı.",
    24: "Frej Apartmanı’nın gösterişli cephesi, yeni şehir hayatının ve apartman kültürünün simgesiydi; girişinde faytonlar ve ziyaretçiler eksik olmazdı.",
    25: "Café de Péra’da kahve fincanları, gazete sayfaları ve piyano sesi birbirine karışır; sanatçılarla tüccarlar aynı masalarda buluşurdu.",
    26: "Madam İfigenia’nın terzihanesinde kumaşlar ölçülür, prova günleri deftere yazılırdı; iyi dikilmiş bir palto müşterinin yıllarca sakladığı bir yatırımdı.",
    27: "Rizzo Apartmanı’nın dar merdivenleri farklı diller konuşan kiracıları aynı avluya taşır; kapıcı her dairenin küçük sırlarını bilirdi.",
    29: "Mavridis Biraderler, sabun kazanlarını arka avluda kaynatır; zeytinyağı ve kokulu otlarla hazırlanan kalıpları kurutup dükkânlara gönderirdi.",
    30: "Crespi Apartmanı’nda üst katların pencereleri Sıraselviler’e bakardı; yeni kiracılar taşındıkça apartmanın girişinde farklı diller ve alışkanlıklar buluşurdu.",
    31: "Şeref Usta’nın lokantası akşamları da canlı kalırdı; tiyatrodan çıkanlar ve geç saatte çalışanlar evlerine dönmeden önce sıcak bir tabak yemek yerdi.",
    32: "Papadopulos’un matbaa ve kırtasiyesinde okul defterleriyle ticari evraklar aynı tezgahta satılır, acil ilan ve davetiyeler kısa sürede basılırdı.",
    33: "Şevket Efendi’nin berberhanesinde ustura her sabah bilenir, müşteriler tıraş olurken mahalle haberlerini ve limana gelen gemileri konuşurdu.",
    34: "Çiçekçi dükkânının önünde mevsimine göre karanfil, gül ve sümbül dizilirdi; buketler nişanlara, ziyaretlere ve tiyatro açılışlarına gönderilirdi.",
    35: "Haliç Gazinosu’nda akşamları fasıl heyeti sahne alır, mutfaktan meze tabakları çıkar, masalarda tüccarlar ve tiyatro müdavimleri şehrin gündemini tartışırdı."
  };
  properties.forEach(property => { if (propertyStories[property.id]) property.history = propertyStories[property.id]; });

// Galata-style irregular street frontages: narrow blocks, staggered facades and varied angles.
properties.forEach((property, index) => {
  const frontage = Math.floor(index / 8);
  const slot = index % 8;
  const baseX = [-8.5, 8.5, -18.5, 18.5, -27.2][frontage % 5];
  const staggerX = [0.15, -0.65, 0.55, -0.25, 0.8, -0.45, 0.35, -0.1][slot];
  const staggerZ = [0.0, 0.7, -0.45, 0.35, -0.8, 0.55, -0.2, 0.25][(index * 3) % 8];
  property.x = baseX + staggerX * (frontage < 2 ? 0.85 : 1.35);
  property.z = -21.2 + slot * 5.85 + staggerZ;
  property.rotation = [0, -0.08, 0.045, 0.11, -0.055, 0.025, -0.1, 0.06][(index * 5 + 2) % 8];
});
// Keep the new waterfront businesses on the eastern edge of the walkable district.
Object.assign(properties.find(property => property.id === 34), { x: 20.4, z: 18.4, rotation: -0.04 });
Object.assign(properties.find(property => property.id === 35), { x: 21.1, z: 11.8, rotation: -0.08 });
Object.assign(properties.find(property => property.id === 36), { x: 20.7, z: 5.3, rotation: -0.05 });
Object.assign(properties.find(property => property.id === 39), { x: -20.5, z: -5.3, rotation: 0.02 });
Object.assign(properties.find(property => property.id === 40), { x: -20.5, z: 5.3, rotation: 0.01 });
Object.assign(properties.find(property => property.id === 41), { x: 27.2, z: 22.5, rotation: -0.03 });

const SAVE_KEY = 'mahalle-save-v1';
const SAVE_BACKUP_KEY = 'mahalle-save-v1-backup';
const DAILY_LIVING_COST = 0.5;
// Safe defaults for the property-tax calculations used by the deployed game bundle.
const PROPERTY_TAX_RATES = Object.freeze({
  Konut: 0.0010,
  Depo: 0.0015,
  Ticaret: 0.0020,
  Atölye: 0.0020,
  İşletme: 0.0022
});
const PROPERTY_TAX_PROGRESSIVE = Object.freeze([1, 1, 1.25, 1.25, 1.6, 1.6, 1.6, 2, 2, 2, 2, 2.5]);
const SHOE_MATERIALS = [
  { id: 'deri', name: 'İşlenmiş deri', batch: 4, cost: 24 },
  { id: 'taban', name: 'Ayakkabı tabanı', batch: 4, cost: 16 },
  { id: 'iplik', name: 'Sağlam iplik', batch: 6, cost: 6 },
  { id: 'civi', name: 'Kunduracı çivisi', batch: 6, cost: 6 }
];
const SHOE_RECIPES = [
  { id: 'kundura', name: 'Günlük kundura', price: 14, recipe: { deri: 1, taban: 1 }, unlockLevel: 1 },
  { id: 'deri-ayakkabi', name: 'Kaliteli deri ayakkabı', price: 25, recipe: { deri: 2, taban: 1, iplik: 2 }, unlockLevel: 2 },
  { id: 'ayakkabi-taban', name: 'Tamirlik tabanlı ayakkabı', price: 25, recipe: { deri: 1, taban: 2, iplik: 1, civi: 3 }, unlockLevel: 3 },
  { id: 'ince-deri-bot', name: 'İnce deri bot', price: 45, recipe: { deri: 3, taban: 2, iplik: 3, civi: 3 }, unlockLevel: 4 },
  { id: 'hanim-isyeri-ayakkabisi', name: 'Kadın şehir ayakkabısı', price: 39, recipe: { deri: 3, taban: 1, iplik: 4, civi: 2 }, unlockLevel: 4 },
  { id: 'el-yapimi-ustalik', name: 'Usta işi el dikişi kundura', price: 56, recipe: { deri: 4, taban: 2, iplik: 5, civi: 3 }, unlockLevel: 5 },
  { id: 'ozel-siparis-cizme', name: 'Özel sipariş binici çizmesi', price: 73, recipe: { deri: 5, taban: 3, iplik: 6, civi: 4 }, unlockLevel: 5 }
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

function CityScene({ selected, owned, ownerByProperty = {}, playerId = 'solo', onSelect, onUniversity, hour, overlay }) {
  const host = useRef(null);
  const overlayRef = useRef(null);
  const selectRef = useRef(onSelect);
  const selectedRef = useRef(selected);
  const hourRef = useRef(hour);
  const cameraControlRef = useRef(null);
  const [cameraMode, setCameraMode] = useState('rotate');
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

    // Haliç waterfront: open water, stone quay, promenade and small mooring posts.
    const halicWaterMat = new THREE.MeshStandardMaterial({
      color: '#477f91', roughness: 0.28, metalness: 0.12,
      transparent: true, opacity: 0.94
    });
    const halicWater = new THREE.Mesh(new THREE.PlaneGeometry(42, 72, 1, 1), halicWaterMat);
    halicWater.rotation.x = -Math.PI / 2;
    halicWater.position.set(47.5, -0.12, 0);
    halicWater.receiveShadow = true;
    scene.add(halicWater);

    const quayMat = new THREE.MeshStandardMaterial({ color: '#b6ad9c', roughness: 0.96 });
    const quayEdgeMat = new THREE.MeshStandardMaterial({ color: '#77766f', roughness: 0.9 });
    const quay = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.18, 72), quayMat);
    quay.position.set(22.9, 0.02, 0);
    quay.receiveShadow = true;
    scene.add(quay);
    const quayLip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 72), quayEdgeMat);
    quayLip.position.set(25.45, 0.09, 0);
    quayLip.castShadow = true;
    scene.add(quayLip);

    const quayTileMat = new THREE.MeshStandardMaterial({ color: '#c9c0b0', roughness: 1 });
    for (let z = -34; z <= 34; z += 2.2) {
      const tile = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.035, 1.95), quayTileMat);
      tile.position.set(22.9, 0.125, z);
      tile.receiveShadow = true;
      scene.add(tile);
    }
    const mooringMat = new THREE.MeshStandardMaterial({ color: '#4c4942', metalness: 0.35, roughness: 0.65 });
    for (const z of [-30, -21, -12, -3, 6, 15, 24, 33]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.72, 8), mooringMat);
      post.position.set(25.0, 0.34, z);
      post.castShadow = true;
      scene.add(post);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 8), quayEdgeMat);
      cap.position.set(25.0, 0.74, z);
      scene.add(cap);
    }

    // A small period-style passenger boat gives the inlet a readable scale.
    const ferry = new THREE.Group();
    const hullMat = new THREE.MeshStandardMaterial({ color: '#463c34', roughness: 0.72 });
    const cabinMat = new THREE.MeshStandardMaterial({ color: '#e1d4bb', roughness: 0.88 });
    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.42, 4.6), hullMat);
    hull.position.y = 0.02; ferry.add(hull);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.62, 1.75), cabinMat);
    cabin.position.set(0, 0.48, -0.15); ferry.add(cabin);
    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.55, 8), new THREE.MeshStandardMaterial({ color: '#6d4b37', roughness: 0.85 }));
    chimney.position.set(0, 1.02, 0.65); ferry.add(chimney);
    ferry.position.set(34.5, 0.15, -12);
    ferry.rotation.y = 0.22;
    scene.add(ferry);

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
      const isGrandFacade = p.floors >= 4 || [4, 8, 10, 21, 24, 27, 40].includes(p.id);
      const isTimberHouse = [6, 11, 22, 30].includes(p.id);
      const w = Number(p.width) || ([4, 10, 21, 24, 27, 40].includes(p.id) ? 2.75 : [9, 25, 31, 39].includes(p.id) ? 2.45 : 2.05);
      const d = Number(p.depth) || ([2, 8, 21, 24, 27].includes(p.id) ? 2.35 : 1.9);
      const floorHeight = isGrandFacade ? 0.91 : 0.88;
      const h = p.floors * floorHeight;
      // Muted Pera palette: lime plaster, faded ochre, dusty rose and blue-grey masonry.
      const facadeColors = ['#d7c5a8', '#b9b1a1', '#c9b7a8', '#d8c8ad', '#c1c6bf', '#c9ad9d', '#d6c7b6', '#b8b7ad', '#d3c0a4', '#c4b4a2', '#d2c9b8', '#b7a899', '#c5c8c0', '#cdb7a7'];
      const baseColor = ownerInfo ? (ownerInfo.playerId === currentPlayerId ? '#b9c8b2' : '#b8c8d9') : (isOwned ? '#b9c8b2' : facadeColors[(idx * 5 + p.id * 3) % facadeColors.length]);
      const mat = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.94 });
      const trimMat = new THREE.MeshStandardMaterial({ color: isTimberHouse ? '#665044' : (isGrandFacade ? '#e5d7bd' : '#e2d3b9'), roughness: 0.94 });
      const darkWood = new THREE.MeshStandardMaterial({ color: isTimberHouse ? '#4a3025' : '#594033', roughness: 0.96 });
      const fadedWood = new THREE.MeshStandardMaterial({ color: '#78604a', roughness: 1 });
      const ironDetail = new THREE.MeshStandardMaterial({ color: '#353d3b', roughness: 0.8, metalness: 0.22 });
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
          // Narrow painted timber shutters and lintels echo late-Ottoman Pera apartment windows.
          if (floor > 0 && (p.id + floor + col) % 3 !== 0) {
            for (const side of [-1, 1]) {
              const shutter = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.39, 0.035), fadedWood);
              shutter.position.set(x + side * 0.225, y, d / 2 + 0.035);
              group.add(shutter);
              const shutterSlat = new THREE.Mesh(new THREE.BoxGeometry(0.067, 0.025, 0.012), darkWood);
              shutterSlat.position.set(x + side * 0.225, y - 0.06, d / 2 + 0.056);
              group.add(shutterSlat);
            }
            const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.045, 0.075), trimMat);
            lintel.position.set(x, y + 0.29, d / 2 + 0.04); group.add(lintel);
          }
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
        const shopLabel = String(p.name || '').toLocaleLowerCase('tr-TR');
        // Match the actual Pera businesses by their property IDs first; names vary historically.
        const productKind = ({13:'bakery',15:'pharmacy',16:'books',26:'fabric',34:'flowers',36:'books',39:'cafe',12:'cafe',25:'cafe',40:'hamam',41:'dryclean',43:'office',45:'office'})[p.id] ||
          (/fırın|pastane|ekmek|tatlı|şekerleme/.test(shopLabel) ? 'bakery' :
          /eczane|eczahanesi|aktar|şifa|ilaç/.test(shopLabel) ? 'pharmacy' :
          /kumaş|terzi|manifatura|tekstil/.test(shopLabel) ? 'fabric' :
          /kitap|kırtasiye|sahaf|kitabevi/.test(shopLabel) ? 'books' :
          /kahve|kahvehane|kıraathane|meyhane|şarap|içki/.test(shopLabel) ? 'cafe' :
          /çiçek|bahçe/.test(shopLabel) ? 'flowers' : 'general');
        const displayColors = productKind === 'bakery' ? ['#c69b5c','#e0c58c','#a66d45'] :
          productKind === 'pharmacy' ? ['#7e9b86','#d8c9a8','#b7c8c0'] :
          productKind === 'fabric' ? ['#8e5d59','#526b77','#c2a66f'] :
          productKind === 'books' ? ['#70483a','#b79b70','#3e5147'] :
          productKind === 'cafe' ? ['#604638','#c6a46c','#eee0c4'] :
          productKind === 'flowers' ? ['#9a6c79','#b5a86f','#71866b'] :
          productKind === 'hamam' ? ['#b5a78c','#d4c5a4','#8e9b91'] :
          productKind === 'dryclean' ? ['#6e7f8c','#a9a8a0','#6c5145'] :
          productKind === 'office' ? ['#80694e','#b7a27c','#3f4d4b'] : ['#c7a56b','#8c9a7c','#b56e55'];
        for (let itemIndex = 0; itemIndex < 3; itemIndex++) {
          const color = new THREE.MeshStandardMaterial({ color: displayColors[itemIndex], roughness: 0.88 });
          let item;
          if (productKind === 'bakery') {
            item = new THREE.Mesh(new THREE.SphereGeometry(0.095, 8, 6), color);
            item.scale.set(1.25, 0.72, 0.9);
          } else if (productKind === 'pharmacy' || productKind === 'cafe') {
            item = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.18, 8), color);
          } else if (productKind === 'fabric') {
            item = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.2, 8), color);
            item.rotation.z = Math.PI / 2;
          } else if (productKind === 'flowers') {
            item = new THREE.Mesh(new THREE.SphereGeometry(0.105, 7, 6), color);
            item.scale.set(1,0.8,1);
          } else if (productKind === 'books' || productKind === 'office') {
            item = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2 + (itemIndex % 2) * 0.07, 0.13), color);
            item.rotation.z = itemIndex === 1 ? 0.08 : 0;
          } else if (productKind === 'hamam') {
            item = new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,0.12,10),color);
          } else if (productKind === 'dryclean') {
            item = new THREE.Mesh(new THREE.BoxGeometry(0.16,0.25,0.045),color);
          } else {
            item = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2 + (itemIndex % 2) * 0.06, 0.13), color);
          }
          item.position.set(-w * 0.31 + itemIndex * 0.3, 0.34 + (itemIndex % 2) * 0.025, d / 2 + 0.13);
          item.castShadow = true;
          group.add(item);
          if (productKind === 'dryclean') {
            const hanger = new THREE.Mesh(new THREE.ConeGeometry(0.13,0.1,3),new THREE.MeshStandardMaterial({color:'#a18a63',roughness:0.7}));
            hanger.position.set(item.position.x,item.position.y+0.17,item.position.z);
            hanger.rotation.y=Math.PI;group.add(hanger);
          }
          if (productKind === 'flowers') {
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.018,0.16,5),new THREE.MeshStandardMaterial({color:'#647854',roughness:1}));
            stem.position.set(item.position.x,item.position.y-0.12,item.position.z);group.add(stem);
          }
          if (productKind === 'pharmacy' || productKind === 'cafe') {
            const stopper = new THREE.Mesh(new THREE.CylinderGeometry(0.022,0.022,0.035,8), darkWood);
            stopper.position.set(item.position.x, item.position.y + 0.105, item.position.z);
            group.add(stopper);
          }
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
        signCanvas.width = 512; signCanvas.height = 160;
        const ctx = signCanvas.getContext('2d');
        // Painted shop signs, restrained brass edging and period-inspired serif lettering.
        const signPalettes = [
          ['#35443b', '#d8c29a', '#efe2c5'], ['#49352d', '#c5a16d', '#f0dfbb'],
          ['#344652', '#cbb98f', '#eee1c8'], ['#6a3f36', '#d5b98b', '#f4e4c8'],
          ['#4d4a3e', '#c6b48b', '#eee0c4'], ['#554456', '#d0b68c', '#f0dfc3']
        ];
        const signPalette = signPalettes[(p.id * 7) % signPalettes.length];
        ctx.fillStyle = signPalette[0];
        ctx.fillRect(0, 0, 512, 160);
        ctx.strokeStyle = signPalette[1]; ctx.lineWidth = 4; ctx.strokeRect(8, 8, 496, 144);
        ctx.strokeStyle = signPalette[1]; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(28, 22); ctx.lineTo(484, 22); ctx.moveTo(28, 138); ctx.lineTo(484, 138); ctx.stroke();
        ctx.fillStyle = signPalette[2]; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
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
        ctx.font = '600 ' + (signLines.some(text => text.length > 16) ? '23px' : signLines.some(text => text.length > 11) ? '28px' : '34px') + ' Georgia, "Times New Roman", serif';
        if (signLines.length === 1) ctx.fillText(signLines[0], 256, 80, 462);
        else {
          ctx.fillText(signLines[0], 256, 59, 462);
          ctx.fillText(signLines[1], 256, 101, 462);
        }
        const signTexture = new THREE.CanvasTexture(signCanvas);
        signTexture.colorSpace = THREE.SRGBColorSpace;
        const signMat = new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.8 });
        const signBoard = new THREE.Mesh(new THREE.BoxGeometry(w * 0.86, 0.34, 0.07), signMat);
        signBoard.position.set(0, 1.17, d / 2 + 0.09); group.add(signBoard);
        const signBracketMat = ironDetail;
        for (const side of [-1, 1]) {
          const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.17, 0.12), signBracketMat);
          bracket.position.set(side * w * 0.37, 1.0, d / 2 + 0.12); group.add(bracket);
        }

        if ([1, 7, 10, 12, 23, 25, 28, 31].includes(p.id)) {
          const awningPalette = { 1:['#6c7c68','#e2d2b5'], 7:['#854c3f','#e0c9a6'], 10:['#596d78','#e0d2b7'], 12:['#596c57','#e5d8be'], 23:['#8b5945','#e4d0b0'], 25:['#6d7770','#e4d8c2'], 28:['#7c5147','#e5d1b1'], 31:['#687b73','#e4d6ba'] };
          const awningColors = awningPalette[p.id] || ['#8b5145', '#e2c9a0'];
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
      if (p.id === 10 || isGrandFacade) {
        const pediment = new THREE.Mesh(new THREE.ConeGeometry(w * (p.id === 10 ? 0.58 : 0.42), p.id === 10 ? 0.42 : 0.28, 3), trimMat);
        pediment.rotation.y = Math.PI; pediment.position.set(0, h + (p.id === 10 ? 0.24 : 0.16), d / 2); pediment.scale.z = 0.45; group.add(pediment);
        const crest = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), ironDetail);
        crest.position.set(0, h + (p.id === 10 ? 0.45 : 0.29), d / 2 + 0.06); group.add(crest);
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
    const tramLowerPanel = new THREE.Mesh(new THREE.BoxGeometry(1.27,0.23,2.62),new THREE.MeshStandardMaterial({color:'#4d5147',roughness:0.86}));
    tramLowerPanel.position.y=0.38; tram.add(tramLowerPanel);
    const tramGoldLine = new THREE.Mesh(new THREE.BoxGeometry(1.28,0.035,2.63),new THREE.MeshStandardMaterial({color:'#c4a66e',metalness:0.28,roughness:0.62}));
    tramGoldLine.position.y=0.53; tram.add(tramGoldLine);
    const tramRoof = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.12, 2.68), new THREE.MeshStandardMaterial({ color: '#e6ddc9', roughness:0.92 }));
    tramRoof.position.y = 1.36; tram.add(tramRoof);
    const tramWindowMat = new THREE.MeshStandardMaterial({ color: '#9eaca8', metalness: 0.1, roughness: 0.35, emissive:'#b79c67',emissiveIntensity:0.08 });
    for (let i = 0; i < 3; i++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.34, 0.035), tramWindowMat);
      win.position.set(-0.4 + i * 0.4, 0.91, 1.315); tram.add(win);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.33,0.045,0.055),new THREE.MeshStandardMaterial({color:'#e3d5b8',roughness:0.9}));
      frame.position.set(-0.4+i*0.4,1.1,1.34);tram.add(frame);
    }
    const tramDoor = new THREE.Mesh(new THREE.BoxGeometry(0.25,0.7,0.05),new THREE.MeshStandardMaterial({color:'#594236',roughness:0.9}));
    tramDoor.position.set(0.48,0.72,-0.52);tram.add(tramDoor);
    const tramDoorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.15,0.28,0.025),tramWindowMat);
    tramDoorGlass.position.set(0.48,0.9,-0.49);tram.add(tramDoorGlass);
    const tramLampMat = new THREE.MeshStandardMaterial({color:'#f2dfad',emissive:'#e6b967',emissiveIntensity:0.4,roughness:0.4});
    for(const x of [-0.38,0.38]){
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.075,8,6),tramLampMat);
      lamp.position.set(x,0.62,1.35);tram.add(lamp);
    }
    const routeBoard = new THREE.Mesh(new THREE.BoxGeometry(0.42,0.19,0.055),new THREE.MeshStandardMaterial({color:'#34463b',roughness:0.9}));
    routeBoard.position.set(0,1.48,1.34);tram.add(routeBoard);
    const routeNumber = new THREE.Mesh(new THREE.BoxGeometry(0.16,0.08,0.018),new THREE.MeshStandardMaterial({color:'#e8d6ac',roughness:0.8}));
    routeNumber.position.set(0,1.48,1.38);tram.add(routeNumber);
    const tramWheelMat = new THREE.MeshStandardMaterial({color:'#393a36',metalness:0.45,roughness:0.6});
    for(const z of [-0.78,0.78])for(const x of [-0.5,0.5]){
      const wheel=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.075,10),tramWheelMat);
      wheel.rotation.z=Math.PI/2;wheel.position.set(x,0.22,z);tram.add(wheel);
      const hub=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,0.085,8),new THREE.MeshStandardMaterial({color:'#b6a16f',metalness:0.45,roughness:0.5}));
      hub.rotation.z=Math.PI/2;hub.position.set(x*1.03,0.22,z);tram.add(hub);
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

    // Pera street details: timber benches, stone planters and municipal notice boards.
    const benchWood = new THREE.MeshStandardMaterial({ color: '#72513a', roughness: 0.96 });
    const benchIron = new THREE.MeshStandardMaterial({ color: '#39423d', roughness: 0.82, metalness: 0.18 });
    const planterStone = new THREE.MeshStandardMaterial({ color: '#aaa18f', roughness: 1 });
    const planterSoil = new THREE.MeshStandardMaterial({ color: '#65523e', roughness: 1 });
    const planterLeaf = new THREE.MeshStandardMaterial({ color: '#687b5c', roughness: 1 });
    const posterWood = new THREE.MeshStandardMaterial({ color: '#4b392c', roughness: 0.98 });
    const posterPaper = new THREE.MeshStandardMaterial({ color: '#e2d2b1', roughness: 1 });
    for (const [x, z, rot] of [[-6.82,-10.8,0],[6.82,10.8,Math.PI]]) {
      const bench = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.05,0.07,0.28),benchWood);
      seat.position.y=0.42; bench.add(seat);
      for (let slat=0;slat<3;slat++) {
        const backSlat = new THREE.Mesh(new THREE.BoxGeometry(1.05,0.065,0.055),benchWood);
        backSlat.position.set(0,0.61+slat*0.12,-0.105); bench.add(backSlat);
      }
      for (const side of [-1,1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.065,0.43,0.24),benchIron);
        leg.position.set(side*0.39,0.21,0); bench.add(leg);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.055,0.2,0.3),benchIron);
        arm.position.set(side*0.47,0.51,0); bench.add(arm);
      }
      bench.position.set(x,0,z); bench.rotation.y=rot; scene.add(bench);
    }
    for (const [x,z] of [[-6.85,-4.6],[6.85,4.6],[-6.85,14.2],[6.85,-14.2]]) {
      const planter = new THREE.Group();
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.22,0.34,10),planterStone);
      pot.position.y=0.17; planter.add(pot);
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.035,10),planterSoil);
      soil.position.y=0.34; planter.add(soil);
      for (let leaf=0;leaf<5;leaf++) {
        const sprig = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16,0),planterLeaf);
        const angle=leaf*Math.PI*2/5;
        sprig.position.set(Math.cos(angle)*0.12,0.48+(leaf%2)*0.08,Math.sin(angle)*0.12);
        sprig.scale.set(0.8,1.3,0.75); planter.add(sprig);
      }
      planter.position.set(x,0,z); scene.add(planter);
    }
    // Period municipal notice board: paper notices instead of modern advertising panels.
    const noticeBoard = new THREE.Group();
    const noticeFrame = new THREE.Mesh(new THREE.BoxGeometry(0.78,1.12,0.09),posterWood);
    noticeFrame.position.y=0.92; noticeBoard.add(noticeFrame);
    const noticePaper = new THREE.Mesh(new THREE.BoxGeometry(0.64,0.91,0.025),posterPaper);
    noticePaper.position.set(0,0.94,0.058); noticeBoard.add(noticePaper);
    for (let row=0;row<5;row++) {
      const rule = new THREE.Mesh(new THREE.BoxGeometry(row===0?0.42:0.48,0.018,0.012),posterWood);
      rule.position.set(0,1.23-row*0.13,0.078); noticeBoard.add(rule);
    }
    for (const side of [-1,1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.065,0.62,0.065),posterWood);
      leg.position.set(side*0.27,0.31,0); noticeBoard.add(leg);
    }
    noticeBoard.position.set(6.9,0,-0.1); noticeBoard.rotation.y=-0.12; scene.add(noticeBoard);

    // Small, low-poly pedestrians give the street a continuous sense of life.
    const pedestrians = [];
    const coatColors = ['#303943', '#51413b', '#555b48', '#796044', '#393b42', '#765b58', '#46584e', '#6d6b63', '#343d49'];
    const trouserColors = ['#343638', '#484641', '#575148', '#3b4146'];
    const hatColors = ['#292c30', '#494137', '#5a5145'];
    const skinColors = ['#c99671', '#b77e5d', '#d3a17f', '#8f6048'];
    const makePedestrian = (axis, lane, phase, speed, direction, coatColor, hasHat, outfit = 0, female = false) => {
      const person = new THREE.Group();
      const outfitColors = ['#76515b', '#536d68', '#9a7950', '#625a78', '#8b6250', '#52647a'];
      const clothingColor = female ? outfitColors[outfit % outfitColors.length] : coatColor;
      const coat = new THREE.MeshStandardMaterial({ color: clothingColor, roughness: 0.96 });
      const skin = new THREE.MeshStandardMaterial({ color: skinColors[Math.floor(Math.random() * skinColors.length)], roughness: 1 });
      const trousers = new THREE.MeshStandardMaterial({ color: trouserColors[outfit % trouserColors.length], roughness: 1 });
      const shoes = new THREE.MeshStandardMaterial({ color: '#302f2c', roughness: 1 });
      const torso = new THREE.Mesh(new THREE.BoxGeometry(female ? 0.21 : 0.23, 0.38, 0.14), coat);
      torso.position.y = 0.64;
      person.add(torso);
      if (female) {
        // Long, period-appropriate skirt: wider hem, narrow waist.
        const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.13, 0.38, 8, 1), coat);
        skirt.position.y = 0.405;
        person.add(skirt);
        // A small collar and hair tucked beneath the hat make the silhouette distinct at street scale.
        const hair = new THREE.MeshStandardMaterial({ color: ['#382c25', '#514037', '#6b4935'][outfit % 3], roughness: 1 });
        const bun = new THREE.Mesh(new THREE.SphereGeometry(0.065, 7, 6), hair);
        bun.position.set(0, 0.94, -0.055);
        person.add(bun);
      }
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 9, 7), skin);
      head.position.y = 0.91;
      person.add(head);
      if (hasHat || female) {
        const hatMaterial = new THREE.MeshStandardMaterial({ color: female ? ['#51433b', '#625747', '#393d43', '#79654f'][outfit % 4] : hatColors[outfit % hatColors.length], roughness: 1 });
        const brimRadius = female ? 0.19 : (outfit % 4 === 0 ? 0.155 : 0.14);
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(brimRadius, brimRadius, female ? 0.025 : 0.035, 8), hatMaterial);
        brim.position.y = 1.015;
        person.add(brim);
        const crown = new THREE.Mesh(new THREE.CylinderGeometry(female ? 0.075 : (outfit % 4 === 0 ? 0.105 : 0.09), female ? 0.09 : 0.105, female ? 0.07 : (outfit % 4 === 0 ? 0.085 : 0.11), 8), hatMaterial);
        crown.position.y = female ? 1.06 : 1.08;
        person.add(crown);
        if (female) {
          const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.076, 0.008, 4, 8), new THREE.MeshStandardMaterial({ color: outfitColors[outfit % outfitColors.length], roughness: 1 }));
          ribbon.rotation.x = Math.PI / 2;
          ribbon.position.y = 1.075;
          person.add(ribbon);
        }
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
      const leftLeg = makeLimb(-0.065, 0.43, female ? coat : trousers, female ? 0.065 : 0.085, 0.28, 0.095);
      const rightLeg = makeLimb(0.065, 0.43, female ? coat : trousers, female ? 0.065 : 0.085, 0.28, 0.095);
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
      const female = i % 3 === 0; // Keep a visible, mixed crowd rather than an all-male street.
      makePedestrian('z', mainStreetLanes[i % mainStreetLanes.length], (i * 0.137) % 1, 0.022 + (i % 3) * 0.004, i % 2 === 0 ? 1 : -1, coatColors[i % coatColors.length], female || i % 4 !== 1, i, female);
    }
    const crossStreetLanes = [-1.1, 1.8, 2.65];
    for (let i = 0; i < 12; i++) {
      const female = i % 3 === 1;
      makePedestrian('x', crossStreetLanes[i % crossStreetLanes.length], (i * 0.173 + 0.09) % 1, 0.015 + (i % 2) * 0.004, i % 2 === 0 ? 1 : -1, coatColors[(i + 2) % coatColors.length], female || i % 3 !== 1, i + 2, female);
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
    let dragMode = 'rotate';
    let leftDragMode = 'rotate';
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
      if (action === 'mode') { leftDragMode = property === 'pan' ? 'pan' : 'rotate'; return; }
      if (action === 'in') radiusGoal = clamp(radiusGoal * 0.84, 8, 40);
      else if (action === 'out') radiusGoal = clamp(radiusGoal * 1.18, 8, 48);
      else if (action === 'focus' && property) {
        targetGoal.set(clamp(property.x || 0, -34, 34), 0.8, clamp(property.z || 0, -34, 34));
        radiusGoal = 13;
        phiGoal = 0.82;
      } else if (action === 'view') {
        if (property === 'street') { phiGoal = 1.12; radiusGoal = 25; thetaGoal = 0; targetGoal.set(0,0,0); }
        else if (property === 'top') { phiGoal = 0.34; radiusGoal = 34; thetaGoal = 0; targetGoal.set(0,0,0); }
        else { phiGoal = 0.72; thetaGoal = Math.PI / 4; radiusGoal = 34; targetGoal.set(0,0,0); }
      } else if (action === 'rotate') {
        thetaGoal += (property === 'left' ? -1 : 1) * Math.PI / 8;
      } else if (action === 'tilt') {
        phiGoal = clamp(phiGoal + (property === 'up' ? -0.12 : 0.12), 0.3, 1.18);
      } else if (action === 'pan') {
        const step = radiusGoal * 0.12;
        if (property === 'left') targetGoal.x = clamp(targetGoal.x - step, -34, 34);
        else if (property === 'right') targetGoal.x = clamp(targetGoal.x + step, -34, 34);
        else if (property === 'up') targetGoal.z = clamp(targetGoal.z - step, -34, 34);
        else if (property === 'down') targetGoal.z = clamp(targetGoal.z + step, -34, 34);
      } else {
        radiusGoal = 34; thetaGoal = Math.PI / 4; phiGoal = 0.72; targetGoal.set(0, 0, 0);
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
        // The selected mode controls left-drag and one-finger gestures. Right-drag always rotates.
        dragMode = event.pointerType === 'touch' ? leftDragMode : (event.button === 2 ? 'rotate' : leftDragMode);
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
      let selectedBuilding = false;
      for (const hit of hits) {
        let obj = hit.object;
        while (obj && obj.userData.propertyId == null) obj = obj.parent;
        if (obj?.userData.propertyId != null) { selectRef.current(obj.userData.propertyId); selectedBuilding = true; break; }
      }
      // Empty-space clicks do not unexpectedly change the camera; use explicit zoom controls.
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

  return <div className="scene-host" ref={host} aria-label="Beyoğlu 1923 3D mahalle sahnesi"><div className="scene-building-overlay" ref={overlayRef}>{overlay}</div><div className="map-camera-toolbar"><div className="map-view-presets" role="group" aria-label="Kamera görünümü"><button type="button" title="Mahallenin genel görünümü" onClick={() => cameraControlRef.current?.('view','iso')}>Mahalle</button><button type="button" title="Sokak seviyesine yaklaş" onClick={() => cameraControlRef.current?.('view','street')}>Sokak</button><button type="button" title="Yukarıdan plan görünümü" onClick={() => cameraControlRef.current?.('view','top')}>Üstten</button></div><div className="map-camera-tools"><button type="button" className={cameraMode === 'rotate' ? 'active' : ''} aria-pressed={cameraMode === 'rotate'} aria-label="Sürükleyerek döndür" title="Sol tuşla sürükleyerek haritayı döndür" onClick={() => { setCameraMode('rotate'); cameraControlRef.current?.('mode','rotate'); }}>⟳ Döndür</button><button type="button" className={cameraMode === 'pan' ? 'active' : ''} aria-pressed={cameraMode === 'pan'} aria-label="Haritayı taşıma modu" title="Sol tuşla sürükleyerek haritayı taşı" onClick={() => { setCameraMode('pan'); cameraControlRef.current?.('mode','pan'); }}>✥ Taşı</button><button type="button" aria-label="Sola döndür" title="Sola döndür" onClick={() => cameraControlRef.current?.('rotate','left')}>↶</button><button type="button" aria-label="Sağa döndür" title="Sağa döndür" onClick={() => cameraControlRef.current?.('rotate','right')}>↷</button><button type="button" aria-label="Açıyı yükselt" title="Açıyı yükselt" onClick={() => cameraControlRef.current?.('tilt','up')}>↑</button><button type="button" aria-label="Açıyı alçalt" title="Açıyı alçalt" onClick={() => cameraControlRef.current?.('tilt','down')}>↓</button></div></div><div className="map-zoom-controls"><button type="button" aria-label="Yakınlaştır" title="Yakınlaştır" onClick={() => cameraControlRef.current?.('in')}>＋</button><button type="button" aria-label="Uzaklaştır" title="Uzaklaştır" onClick={() => cameraControlRef.current?.('out')}>−</button><button type="button" aria-label="Seçili binaya odaklan" title="Seçili binaya odaklan" onClick={() => cameraControlRef.current?.('focus', properties.find(item => item.id === selected))}>⌖</button><button type="button" aria-label="Haritayı ortala" title="Haritayı ortala" onClick={() => cameraControlRef.current?.('reset')}>⌂</button><button type="button" aria-label="Üniversite ve meslek eğitimleri" title="Üniversite ve meslek eğitimleri" onClick={() => onUniversity?.()}>▤</button></div><div className="map-hint">Sürükle: taşı · Sağ tuş: döndür · Tekerlek: yakınlaştır · Oklar: kamera açısı</div></div>;
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
  const [buildingStoryId, setBuildingStoryId] = useState(null);
  const [mapSearch, setMapSearch] = useState(() => properties.find(p => p.id === saved.selected)?.name || properties[0].name);
  const [activeHudPanel, setActiveHudPanel] = useState(null);
  useEffect(() => { const property = properties.find(p => p.id === selected); if (property) setMapSearch(property.name); }, [selected]);
  const [notice, setNotice] = useState('');
  const [businessAlert, setBusinessAlert] = useState(null);
  const [dailySalesLog, setDailySalesLog] = useState(() => Array.isArray(saved.dailySalesLog) ? saved.dailySalesLog : []);
  const [dailySalesRevenue, setDailySalesRevenue] = useState(() => Math.max(0, Number(saved.dailySalesRevenue) || 0));
  const [careerReputation, setCareerReputation] = useState(() => Math.max(0, Math.min(100, Number(saved.careerReputation) || 0)));
  const [enrolledCourse, setEnrolledCourse] = useState(() => saved.enrolledCourse && typeof saved.enrolledCourse === 'object' ? saved.enrolledCourse : null);
  const [certificates, setCertificates] = useState(() => Array.isArray(saved.certificates) ? saved.certificates : []);
  const [zReport, setZReport] = useState(null);
  useEffect(() => { if (!zReport) return; const timer = setTimeout(() => setZReport(null), 15000); return () => clearTimeout(timer); }, [zReport]);
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
  const [autoSupplyByProperty, setAutoSupplyByProperty] = useState(() => saved.autoSupplyByProperty && typeof saved.autoSupplyByProperty === 'object' ? saved.autoSupplyByProperty : {});
  const [pendingProductions, setPendingProductions] = useState(() => saved.pendingProductions && typeof saved.pendingProductions === 'object' ? saved.pendingProductions : {});
  const productionProcessingRef = useRef({});
  const [productionBatch, setProductionBatch] = useState('1');
  const [orders, setOrders] = useState(() => Array.isArray(saved.orders) ? saved.orders : []);
  const [ordersDateKey, setOrdersDateKey] = useState(() => typeof saved.ordersDateKey === 'string' ? saved.ordersDateKey : '');
  const [focusedOrderId, setFocusedOrderId] = useState(null);
  const [dailyTasks, setDailyTasks] = useState(() => Array.isArray(saved.dailyTasks) ? saved.dailyTasks : []);
  const [dailyTasksDateKey, setDailyTasksDateKey] = useState(() => typeof saved.dailyTasksDateKey === 'string' ? saved.dailyTasksDateKey : '');
  const [eventChain, setEventChain] = useState(() => saved.eventChain && typeof saved.eventChain === 'object' ? saved.eventChain : { periodKey: '', deliveries: 0, claimedMilestones: [] });
  const [experience, setExperience] = useState(() => Math.max(0, Number(saved.experience) || 0));
  // Always initialize the development map before save/load effects can reference it.
  const [developments, setDevelopments] = useState(() => saved.developments && typeof saved.developments === 'object' ? saved.developments : {});
  const playerLevel = 1 + Math.floor(experience / 100);
  const levelExperience = experience % 100;
  const [selectedShoeId, setSelectedShoeId] = useState('kundura');
  const [productionNow, setProductionNow] = useState(Date.now());
  useEffect(() => {
    if (!Object.keys(pendingProductions).length) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setProductionNow(now);
      Object.entries(pendingProductions).forEach(([key, job]) => {
        if (!job || !job.units || !job.readyAt || now < Number(job.readyAt)) return;
        const lockKey = key + ':' + job.readyAt;
        if (productionProcessingRef.current[lockKey]) return;
        productionProcessingRef.current[lockKey] = true;
        const duration = Math.max(500, Number(job.duration) || 2500);
        const completedUnits = Math.min(Number(job.units) || 0, 1 + Math.floor((now - Number(job.readyAt)) / duration));
        if (completedUnits <= 0) return;
        const propertyId = Number(job.propertyId || key.split(':')[0]);
        const productId = job.productId || key.split(':').slice(1).join(':');
        setStockByProperty(old => {
          const current = getInventoryState(propertyId, old[propertyId]);
          return { ...old, [propertyId]: { materials: current.materials || {}, products: { ...(current.products || {}), [productId]: (Number(current.products?.[productId]) || 0) + completedUnits } } };
        });
        setPendingProductions(old => {
          const current = old[key];
          if (!current || Number(current.readyAt) !== Number(job.readyAt)) return old;
          const remaining = Math.max(0, (Number(current.units) || 0) - completedUnits);
          if (remaining > 0) return { ...old, [key]: { ...current, units: remaining, readyAt: Number(current.readyAt) + duration * completedUnits } };
          const next = { ...old }; delete next[key]; return next;
        });
        if (completedUnits >= Number(job.units)) tell('Üretim tamamlandı: ' + (job.name || productId) + ' ×' + completedUnits + '. Ürünler depoya eklendi.');
      });
    }, 500);
    return () => clearInterval(timer);
  }, [pendingProductions]);
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
    setBuildingStoryId(id);
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
    28: [{ id: 'kolonya', name: 'Kolonya ve koku', cost: 12, price: 4.2, units: 8 }, { id: 'parfum', name: 'Parfüm ve esans', cost: 18, price: 6.5, units: 6 }, { id: 'sabun-parfum', name: 'Sabun ve bakım seti', cost: 14, price: 4.8, units: 8 }],
    29: [{ id: 'sabun-imalat', name: 'Sabun üretimi', cost: 14, price: 6, units: 6, production: true }, { id: 'temizlik', name: 'Temizlik malzemesi', cost: 10, price: 3.8, units: 8 }],
    31: [{ id: 'lokanta-galata', name: 'Günün yemeği', cost: 16, price: 6.5, units: 8 }, { id: 'meze', name: 'Meze ve sıcak çorba', cost: 11, price: 4.5, units: 8 }],
    32: [{ id: 'baski-galata', name: 'Basılı ilan ve evrak', cost: 14, price: 5, units: 8 }, { id: 'kirtasiye-galata', name: 'Defter ve kırtasiye', cost: 10, price: 3.8, units: 8 }],
    34: [{ id: 'buketi', name: 'Mevsim çiçekleri buketi', cost: 10, price: 4, units: 8 }, { id: 'saksi-cicegi', name: 'Saksı çiçeği', cost: 12, price: 4.8, units: 6 }, { id: 'cenaze-celengi', name: 'Çelenk ve tören aranjmanı', cost: 18, price: 7, units: 4 }, { id: 'gul-demeti', name: 'Gül demeti', cost: 14, price: 5.5, units: 6 }],
    36: [{id:'kitap-kohen',name:'Yabancı dilde roman',cost:12,price:4.2,units:8},{id:'sozluk-kohen',name:'Sözlük ve dil kitabı',cost:16,price:5.5,units:6},{id:'kirtasiye-kohen',name:'Defter, kalem ve mürekkep',cost:8,price:3,units:10},{id:'nadir-eser-kohen',name:'Nadir ve ciltli eser',cost:24,price:8,units:4}],
    39: [{id:'kahve-sokrat',name:'Türk kahvesi',cost:8,price:3,units:10},{id:'cay-sokrat',name:'Çay ve şerbet',cost:6,price:2.5,units:10},{id:'tatli-sokrat',name:'Lokum ve küçük tatlı',cost:8,price:3.2,units:8}],
    40: [{id:'hamam-giris',name:'Hamam giriş ücreti',cost:5,price:3.5,units:12},{id:'kese',name:'Kese ve köpük hizmeti',cost:7,price:5,units:8},{id:'hamam-havlu',name:'Havlu ve peştamal',cost:8,price:3.5,units:8}],
    41: [{id:'takim-temizleme',name:'Takım elbise temizliği',cost:12,price:6,units:8},{id:'palto-temizleme',name:'Palto ve kaban temizliği',cost:14,price:7,units:6},{id:'ipek-temizleme',name:'İpek ve hassas kumaş bakımı',cost:18,price:9,units:4},{id:'utu-paket',name:'Ütüleme ve paketleme',cost:8,price:4,units:10}]
  };

  // Commercial ownership is independent of the character's former profession.
  // Product tiers unlock from actual sales; premium goods need a more developed supply chain.
  const advancedProducts = {
    4: [['han-odasi-gunluk','Günlük han odası',12,5,6,1],['esnaf-konaklama','Esnaf konaklaması',16,7,5,2],['uzun-konaklama','Uzun süreli konaklama',22,9,4,3],['ticaret-yolcusu','Ticaret yolcusu paketi',30,12,3,4],['ust-duzey-suit','Üst kat özel oda',40,16,2,5]],
    1: [['konserve-erzak','Konserve ve ithal erzak',14,3.4,8,2],['kahve-ithal','İthal kahve ve kakao',18,4.5,6,3],['hediyelik-set','Hediye ve tuvalet seti',22,6.2,5,4],['ithal-parfum','İthal Fransız parfümü',30,8.5,4,5]],
    21: [['han-konaklama','Han odası ve yatak takımı',14,5.5,6,1],['ambar-koli','Toptan erzak ve yük',22,7,8,2],['ticaret-deposu','Ticaret kervanı ambar hizmeti',28,9,5,3],['uzun-konaklama-han','Uzun süreli han konaklaması',34,11,4,4],['buyuk-tuccar-odasi','Büyük tüccar odası',42,14,3,5]],
    7: [['masa-sarabi','Fıçıdan sofra şarabı',14,3.8,8,2],['ozel-rezerv','Özel mahzen şarabı',22,6.5,5,3],['ithal-peynir','İthal peynir ve şarküteri',25,7.5,5,4],['koleksiyon-sarabi','Mahzen seçkisi',34,10,3,5]],
    9: [['davetiye','Davetiye ve kartvizit',15,5,6,2],['ciltli-defter','Ciltli defter',19,6.2,5,3],['kitap-baski','Küçük tiraj kitap baskısı',24,8,4,4],['sanat-baski','Sanat baskısı ve afiş',32,10.5,3,5]],
    10: [['hazir-elbise','Hazır şehir elbisesi',22,7,6,2],['yün-palto','Yün palto ve ceket',28,9,5,3],['ipek-eldiven','İpek aksesuar ve eldiven',34,11,4,4],['paris-modasi','Paris modası özel seri',42,14,3,5]],
    12: [['turk-kahvesi','Özenli Türk kahvesi',14,4.5,8,2],['lokum-tabagi','Lokum ve şerbet tabağı',16,5.2,7,3],['ithal-pasta','Pasta ve pastane tatlısı',22,7.5,5,4],['ozel-kahve','Özel harman kahve',28,9.5,4,5]],
    13: [['simit','Simit ve açma',12,4.2,8,2],['sutlu-corek','Sütlü çörek ve çörek otu',15,5.5,6,3],['pastane','Pasta ve tatlı çörek',22,7.5,5,4],['ozel-ekmek','Özel mayalı ekmek',28,9,4,5]],
    14: [['kiyma','Kıyma ve köfte harcı',15,5,6,2],['sucuk','Sucuk ve pastırma',22,7.5,5,3],['kuzu-secme','Seçme kuzu eti',28,9.5,4,4],['ozel-sarkuteri','Şarküteri ve özel kesim',36,12,3,5]],
    15: [['bitkisel-tentur','Bitkisel tentür ve damla',14,5,6,2],['oksuruk-surubu','Öksürük şurubu ve pastil',17,6.5,5,3],['sargilik-gaz','Sargı bezi ve antiseptik',20,7.5,5,4],['ithal-ilac','İthal ilaç ve özel preparat',30,11,3,5]],
    16: [['roman-serisi','Yeni romanlar',15,5.2,6,2],['resim-defteri','Resim defteri ve boya',18,6.5,5,3],['ithal-kalem','İthal dolma kalem',25,9,4,4],['ansiklopedi','Ciltli eser ve ansiklopedi',32,12,3,5]],
    17: [['tabure','Ahşap tabure',15,5.5,5,2],['sandik','Çeyiz sandığı',22,8,4,3],['masa','Oymalı masa',30,11,3,4],['vitrin-dolap','Vitrin dolabı',38,14,2,5]],
    18: [['narenciye','Narenciye kasası',13,4.5,5,2],['mevsim-sepeti','Mevsimlik meyve sepeti',16,6,4,3],['ithal-meyve','İthal meyve',22,8,3,4],['seckin-urun','Seçme meyve ve sebze',28,10,3,5]],
    19: [['ev-yemegi','Zeytinyağlı ev yemeği',14,5,6,2],['etli-yemek','Etli tencere yemeği',20,7.5,5,3],['tatli-lokanta','Sütlü tatlı',22,8.5,4,4],['usta-menusu','Usta menüsü',30,12,3,5]],
    20: [['menteşe','Menteşe ve nal',15,5.5,5,2],['alet-takimi','El aleti takımı',22,8,4,3],['ocak-demiri','Dövme demir eşya',30,11,3,4],['ozel-demir','Özel sipariş ferforje',38,14,2,5]],
    23: [['bitki-karisimi','Özel bitki karışımları',14,5,6,2],['baharat-seti','Baharat sandığı',18,6.5,5,3],['aktar-merhemi','Bitkisel merhem',24,8.5,4,4],['ithal-baharat','İthal baharat',32,11,3,5]],
    25: [['filtre-kahve','Kahve harmanı ve lokum',15,5.2,8,2],['serbet','Gül şerbeti ve tatlı',18,6.5,6,3],['pasta','Pasta ve pastane tabağı',24,9,5,4],['salon-kahvesi','Salon kahvesi özel harmanı',32,12,4,5]],
    26: [['elbise','Günlük şehir elbisesi',18,7,5,2],['palto','Yün palto',25,10,4,3],['gelinlik','Özel gün elbisesi',32,13,3,4],['moda-dikim','Pera modası özel dikim',42,17,2,5]],
    28: [['kolonya-28','Kolonya şişesi',12,4.2,8,2],['esans-28','Esans ve parfüm',18,6.5,6,3],['sabun-28','Kokulu sabun ve bakım seti',14,4.8,8,4],['hediye-parfum-28','Hediye parfüm kutusu',24,8,4,5]],
    36: [['yeni-roman-kohen','Yeni çıkan roman',15,5.2,6,2],['resimli-kitap-kohen','Resimli kitap ve çocuk yayını',12,4.2,8,3],['ithal-kalem-kohen','İthal dolma kalem',25,9,4,4],['ansiklopedi-kohen','Ciltli eser ve ansiklopedi',32,12,3,5]],
    29: [['lavanta-sabun','Lavanta sabunu',17,6.5,6,2],['kokulu-sabun','Kokulu misafir sabunu',22,8.5,5,3],['kolonya-uretim','Kolonya ve esans',28,11,4,4],['otel-seti','Otel sabun seti',36,14,3,5]],
    31: [['pilav','Pilav ve zeytinyağlı',15,5.5,7,2],['kebap','Kebap ve ızgara',22,8,5,3],['tatli-galata','Günün tatlısı',25,9.5,4,4],['usta-sofrasi','Usta sofrası',34,13,3,5]],
    32: [['davetiye-galata','Davetiye ve kartvizit',15,5.5,7,2],['ciltli-eser','Ciltli kitap ve defter',21,7.5,5,3],['afis','Renkli afiş ve ilan',28,10,4,4],['prestij-baski','Prestijli sanat baskısı',36,13,3,5]],
    33: [['ilk-tiras','Tıraş ve sakal bakımı',6,3.2,8,1],['sakal-bakimi','Sakal bakımı ve kolonya',10,4.8,6,2],['sac-kesimi','Saç kesimi ve şekillendirme',15,6.5,5,3],['damat-tirasi','Damat tıraşı ve bakım',22,9.5,4,4],['ustura-seti','Usta işi tıraş ve sıcak havlu',30,13,3,5]]
  };
  Object.entries(advancedProducts).forEach(([id, rows]) => {
    if (!tradeCatalog[id]) tradeCatalog[id] = [];
    rows.forEach(([productId, name, cost, price, units, unlockLevel]) => {
      if (!tradeCatalog[id].some(item => item.id === productId)) tradeCatalog[id].push({ id: productId, name, cost, price, units, unlockLevel });
    });
  });
  // Canonical product catalog: only the active commercial properties below are exposed.
  // Each shop has a distinct range; older expansion catalogs with colliding IDs are overridden.
  const canonicalCatalog = {
    42: [
      {id:'dr-muayene',name:'Genel hekim muayenesi',cost:0,price:28,units:0,service:true},
      {id:'dr-ev',name:'Ev ziyareti ve hasta değerlendirmesi',cost:0,price:46,units:0,service:true},
      {id:'dr-rapor',name:'Sağlık raporu ve reçete düzenleme',cost:0,price:18,units:0,service:true},
      {id:'dr-tedavi',name:'Küçük müdahale ve pansuman',cost:0,price:38,units:0,service:true},
      {id:'dr-takip',name:'Kontrol muayenesi',cost:0,price:16,units:0,service:true}
    ],
    43: [
      {id:'av-danisma',name:'Hukuki danışma görüşmesi',cost:0,price:24,units:0,service:true},
      {id:'av-dilekce',name:'Dilekçe ve ihtarname hazırlanması',cost:0,price:38,units:0,service:true},
      {id:'av-sozlesme',name:'Sözleşme hazırlanması',cost:0,price:52,units:0,service:true},
      {id:'av-dava',name:'Dava ve duruşma takibi',cost:0,price:85,units:0,service:true},
      {id:'av-tapu',name:'Tapu ve ticari işlem danışmanlığı',cost:0,price:46,units:0,service:true}
    ],
    44: [
      {id:'dis-muayene',name:'Diş muayenesi',cost:0,price:22,units:0,service:true},
      {id:'dis-cekim',name:'Diş çekimi',cost:0,price:48,units:0,service:true},
      {id:'dis-dolgu',name:'Dolgu tedavisi',cost:0,price:62,units:0,service:true},
      {id:'dis-temiz',name:'Diş taşı temizliği',cost:0,price:36,units:0,service:true},
      {id:'dis-protez',name:'Protez ve ölçü işlemi',cost:0,price:75,units:0,service:true}
    ],
    45: [
      {id:'muh-proje',name:'Mimari proje çizimi',cost:0,price:95,units:0,service:true},
      {id:'muh-kesif',name:'Yapı keşfi ve metraj',cost:0,price:48,units:0,service:true},
      {id:'muh-ruhsat',name:'İmar ve ruhsat dosyası hazırlığı',cost:0,price:68,units:0,service:true},
      {id:'muh-tadilat',name:'Tadilat planı ve teknik danışmanlık',cost:0,price:42,units:0,service:true},
      {id:'muh-denetim',name:'Şantiye kontrol ziyareti',cost:0,price:34,units:0,service:true}
    ],
    46: [
      {id:'smmm-defter',name:'Esnaf defteri tutma',cost:0,price:32,units:0,service:true},
      {id:'smmm-beyan',name:'Vergi beyannamesi hazırlama',cost:0,price:28,units:0,service:true},
      {id:'smmm-hesap',name:'Aylık hesap ve kasa mutabakatı',cost:0,price:24,units:0,service:true},
      {id:'smmm-ucret',name:'Ücret ve bordro hesabı',cost:0,price:22,units:0,service:true},
      {id:'smmm-ticari',name:'Ticari defter açılış ve kapanış işlemi',cost:0,price:38,units:0,service:true}
    ],
    3: [
      {id:'ambar-depolama',name:'Sandık ve yük depolama hizmeti',cost:10,price:23,units:8,service:true},
      {id:'ambar-yukleme',name:'Yükleme ve hamal hizmeti',cost:12,price:27,units:8,service:true},
      {id:'ambar-sevkiyat',name:'Karaköy içi sevkiyat',cost:16,price:36,units:6,service:true},
      {id:'ambar-sandik',name:'Tahta sevk sandığı',cost:14,price:31,units:6},
      {id:'ambar-toptan',name:'Ticari mal kabul ve tasnif paketi',cost:20,price:45,units:4,service:true}
    ],
    1: [
      {id:'bakkal-bakliyat',name:'Bakliyat ve kuru erzak',cost:12,price:24,units:8},
      {id:'bakkal-sarkuteri',name:'Peynir, zeytin ve şarküteri',cost:16,price:34,units:6},
      {id:'bakkal-kahve',name:'Çay, kahve ve şeker',cost:12,price:26,units:8},
      {id:'bakkal-konserve',name:'Konserve, turşu ve salamura',cost:10,price:22,units:8},
      {id:'bakkal-ithal',name:'İthal erzak ve özel lezzetler',cost:20,price:44,units:5}
    ],
    4: [
      {id:'sahin-oda',name:'Han odası geceliği',cost:18,price:39,units:8,service:true},
      {id:'sahin-yatak',name:'Yatak ve çarşaflı konaklama',cost:22,price:48,units:6,service:true},
      {id:'sahin-kahvalti',name:'Tüccar kahvaltısı',cost:12,price:27,units:8},
      {id:'sahin-depo',name:'Ticaret sandığı depolama',cost:10,price:23,units:8,service:true},
      {id:'sahin-ozel',name:'Uzun konaklama ve hamal paketi',cost:28,price:62,units:4,service:true}
    ],
    7: [
      {id:'vuc-sarap',name:'Fıçıdan sofra şarabı',cost:14,price:30,units:8},
      {id:'vuc-erzak',name:'Kuru erzak ve bakliyat',cost:12,price:26,units:8},
      {id:'vuc-meze',name:'Olgun peynir ve zeytin',cost:14,price:31,units:6},
      {id:'vuc-rezerv',name:'Mahzen seçkisi ve yıllanmış şarap',cost:24,price:54,units:4},
      {id:'vuc-ithal',name:'İthal peynir ve özel şarküteri',cost:22,price:49,units:5}
    ],
    9: [
      {id:'nuri-evrak',name:'Basılı ilan ve ticari evrak',cost:14,price:30,units:8},
      {id:'nuri-defter',name:'Ciltli defter ve kayıt defteri',cost:12,price:26,units:8},
      {id:'nuri-davetiye',name:'Davetiye ve kartvizit baskısı',cost:16,price:35,units:6},
      {id:'nuri-kitap',name:'Küçük tiraj kitap baskısı',cost:22,price:49,units:4},
      {id:'nuri-sanat',name:'Sanat baskısı ve renkli afiş',cost:25,price:56,units:4}
    ],
    10: [
      {id:'paon-kumas',name:'Kumaş ve hazır giyim',cost:18,price:39,units:7},
      {id:'paon-elbise',name:'Hazır şehir elbisesi',cost:22,price:48,units:6},
      {id:'paon-palto',name:'Yün palto ve ceket',cost:28,price:62,units:5},
      {id:'paon-ipek',name:'İpek aksesuar ve eldiven',cost:34,price:76,units:4},
      {id:'paon-paris',name:'Paris modası özel seri',cost:42,price:95,units:3}
    ],
    12: [
      {id:'hak-kahve',name:'Türk kahvesi ve çay',cost:12,price:26,units:10},
      {id:'hak-serbet',name:'Şerbet ve limonata',cost:10,price:22,units:8},
      {id:'hak-lokum',name:'Lokum ve küçük tatlı tabağı',cost:12,price:26,units:8},
      {id:'hak-nargile',name:'Nargile ve köz servisi',cost:14,price:31,units:6,service:true},
      {id:'hak-oyun',name:'Tavla ve oyun masası servisi',cost:8,price:18,units:8,service:true}
    ],
    13: [
      {id:'sch-ekmek',name:'Taş fırın ekmeği',cost:8,price:18,units:10},
      {id:'sch-pogaca',name:'Poğaça, açma ve çörek',cost:10,price:22,units:8},
      {id:'sch-simit',name:'Simit ve susamlı halka',cost:9,price:20,units:8},
      {id:'sch-tatli',name:'Sütlü çörek ve tatlı hamur işi',cost:14,price:31,units:6},
      {id:'sch-ozel',name:'Ekşi mayalı özel ekmek',cost:18,price:40,units:5}
    ],
    14: [
      {id:'kurban-et',name:'Günlük dana ve kuzu eti',cost:18,price:39,units:6},
      {id:'kurban-sakatat',name:'Sakatat ve kemik suyu',cost:11,price:24,units:6},
      {id:'kurban-kiyma',name:'Kıyma ve köfte harcı',cost:15,price:33,units:6},
      {id:'kurban-sucuk',name:'Sucuk ve pastırma',cost:22,price:49,units:5},
      {id:'kurban-secme',name:'Seçme kuzu eti ve özel kesim',cost:28,price:63,units:4}
    ],
    15: [
      {id:'canz-ilac',name:'Temel ilaç ve eczane preparatı',cost:20,price:44,units:5},
      {id:'canz-merhem',name:'Merhem ve bakım ürünü',cost:12,price:26,units:5},
      {id:'canz-sargi',name:'Sargı bezi, pamuk ve antiseptik',cost:14,price:31,units:6},
      {id:'canz-bitki',name:'Bitkisel tentür ve damla',cost:16,price:36,units:5},
      {id:'canz-ithal',name:'İthal ilaç ve özel preparat',cost:28,price:63,units:3}
    ],
    16: [
      {id:'narl-kitap',name:'Roman ve yeni çıkan kitaplar',cost:16,price:35,units:6},
      {id:'narl-defter',name:'Defter, kalem ve mürekkep',cost:10,price:22,units:8},
      {id:'narl-resim',name:'Resim defteri ve boya takımı',cost:14,price:31,units:6},
      {id:'narl-kalem',name:'İthal dolma kalem',cost:24,price:54,units:4},
      {id:'narl-nadir',name:'Ciltli eser ve ansiklopedi',cost:32,price:72,units:3}
    ],
    17: [
      {id:'hak-tabure',name:'Ahşap tabure ve sandalye',cost:15,price:33,units:5,production:true},
      {id:'hak-sandik',name:'Çeyiz sandığı ve saklama sandığı',cost:22,price:49,units:4,production:true},
      {id:'hak-masa',name:'Oymalı masa',cost:30,price:67,units:3,production:true},
      {id:'hak-dolap',name:'Vitrin ve el yapımı dolap',cost:38,price:86,units:2,production:true},
      {id:'hak-tamir',name:'Mobilya tamiri ve cilalama',cost:8,price:18,units:5,service:true}
    ],
    18: [
      {id:'yor-sebze',name:'Mevsim sebzesi kasası',cost:9,price:20,units:8},
      {id:'yor-meyve',name:'Taze meyve sandığı',cost:12,price:26,units:8},
      {id:'yor-narenciye',name:'Narenciye ve üzüm sepeti',cost:13,price:29,units:6},
      {id:'yor-kurut',name:'Kurutmalık ve salamura ürün',cost:10,price:22,units:6},
      {id:'yor-secme',name:'Seçme meyve ve özel ürün sepeti',cost:20,price:45,units:4}
    ],
    19: [
      {id:'salih-corba',name:'Günün çorbası ve ekmek',cost:10,price:22,units:8},
      {id:'salih-yemek',name:'Esnaf usulü tencere yemeği',cost:16,price:35,units:6},
      {id:'salih-zeytinyagli',name:'Zeytinyağlı ve meze tabağı',cost:14,price:31,units:6},
      {id:'salih-et',name:'Etli günlük menü',cost:22,price:49,units:5},
      {id:'salih-usta',name:'Usta menüsü ve tatlı',cost:28,price:63,units:4}
    ],
    20: [
      {id:'kar-nal',name:'Nal, menteşe ve bağlantı demiri',cost:15,price:33,units:5,production:true},
      {id:'kar-alet',name:'El aleti takımı',cost:22,price:49,units:4,production:true},
      {id:'kar-demir',name:'Dövme demir eşya',cost:30,price:67,units:3,production:true},
      {id:'kar-ferforje',name:'Özel sipariş ferforje',cost:38,price:86,units:2,production:true},
      {id:'kar-tamir',name:'Kapı, kilit ve demir tamiri',cost:9,price:20,units:5,service:true}
    ],
    21: [
      {id:'arif-oda',name:'Han odası ve yatak takımı',cost:18,price:40,units:8,service:true},
      {id:'arif-konaklama',name:'Uzun süreli tüccar konaklaması',cost:24,price:54,units:6,service:true},
      {id:'arif-ambar',name:'Ambar ve yükleme hizmeti',cost:14,price:31,units:8,service:true},
      {id:'arif-kahvalti',name:'Tüccar kahvaltısı ve ikram',cost:13,price:29,units:6},
      {id:'arif-ozel',name:'Özel oda ve hamal paketi',cost:30,price:68,units:3,service:true}
    ],
    23: [
      {id:'mari-baharat',name:'Baharat ve şifalı ot demeti',cost:12,price:26,units:8},
      {id:'mari-yag',name:'Bitkisel yağ ve tentür özü',cost:14,price:31,units:6},
      {id:'mari-sabun',name:'Doğal sabun ve bakım yağı',cost:12,price:26,units:6},
      {id:'mari-merhem',name:'Bitkisel merhem ve macun',cost:18,price:40,units:5},
      {id:'mari-ithal',name:'İthal baharat ve özel karışım',cost:26,price:59,units:4}
    ],
    25: [
      {id:'pera-kahve',name:'Seçme kahve ve espresso harmanı',cost:14,price:31,units:8},
      {id:'pera-serbet',name:'Gül şerbeti ve limonata',cost:11,price:24,units:8},
      {id:'pera-pasta',name:'Pasta, tart ve profiterol',cost:18,price:40,units:6},
      {id:'pera-kakao',name:'Kakao ve çikolatalı tatlı',cost:20,price:45,units:5},
      {id:'pera-salon',name:'Salon kahvesi ve özel tatlı servisi',cost:26,price:59,units:4,service:true}
    ],
    26: [
      {id:'ifi-tamir',name:'Giysi tamiri ve tadilat',cost:8,price:18,units:6,service:true},
      {id:'ifi-elbise',name:'Ölçüye göre şehir elbisesi',cost:18,price:40,units:5,production:true},
      {id:'ifi-palto',name:'Yün palto ve ceket dikimi',cost:25,price:56,units:4,production:true},
      {id:'ifi-gelinlik',name:'Özel gün ve gelinlik dikimi',cost:32,price:72,units:3,production:true},
      {id:'ifi-moda',name:'Pera modası özel dikim',cost:42,price:95,units:2,production:true}
    ],
    28: [
      {id:'sot-kolonya',name:'Limon ve gül kolonyası',cost:12,price:26,units:8},
      {id:'sot-esans',name:'Fransız parfüm esansı',cost:18,price:40,units:6},
      {id:'sot-sabun',name:'Kokulu sabun ve bakım seti',cost:14,price:31,units:8},
      {id:'sot-hediye',name:'Hediye parfüm kutusu',cost:24,price:54,units:4},
      {id:'sot-luks',name:'İthal parfüm ve özel esans',cost:32,price:72,units:3}
    ],
    29: [
      {id:'mav-kalip',name:'Kalıp sabun',cost:12,price:26,units:8,production:true},
      {id:'mav-lavanta',name:'Lavanta ve defne sabunu',cost:16,price:36,units:6,production:true},
      {id:'mav-misafir',name:'Kokulu misafir sabunu',cost:20,price:45,units:5,production:true},
      {id:'mav-kolonya',name:'Kolonya ve esans üretimi',cost:26,price:59,units:4,production:true},
      {id:'mav-otel',name:'Konaklama işletmeleri için sabun seti',cost:34,price:77,units:3,production:true}
    ],
    31: [
      {id:'seref-meze',name:'Meze, zeytin ve peynir tabağı',cost:12,price:26,units:8},
      {id:'seref-corba',name:'Sıcak çorba ve fırın ekmeği',cost:11,price:24,units:8},
      {id:'seref-balik',name:'Günün balığı ve ızgara',cost:20,price:45,units:5},
      {id:'seref-yemek',name:'Etli yemek ve pilav',cost:18,price:40,units:6},
      {id:'seref-usta',name:'Usta menüsü ve özel meze',cost:28,price:63,units:4}
    ],
    32: [
      {id:'papa-evrak',name:'Ticari evrak ve ilan baskısı',cost:14,price:31,units:8},
      {id:'papa-defter',name:'Defter ve kayıt defteri',cost:12,price:26,units:8},
      {id:'papa-kalem',name:'Kalem, hokka ve cetvel',cost:10,price:22,units:8},
      {id:'papa-davetiye',name:'Davetiye ve kartvizit baskısı',cost:18,price:40,units:6},
      {id:'papa-cilt',name:'Ciltli defter ve özel baskı',cost:24,price:54,units:4}
    ],
    33: [
      {id:'berber-tiras',name:'Ustura tıraşı',cost:8,price:16,units:8,service:true},
      {id:'berber-sakal',name:'Sakal düzeltme ve bakım',cost:7,price:14,units:8,service:true},
      {id:'berber-sac',name:'Saç kesimi ve tarama',cost:9,price:18,units:8,service:true},
      {id:'berber-yikama',name:'Sıcak havlu ve saç yıkama',cost:6,price:13,units:8,service:true},
      {id:'berber-kolonya',name:'Kolonya ve saç losyonu',cost:12,price:24,units:8}
    ],
    34: [
      {id:'cicek-mevsim',name:'Mevsim çiçekleri buketi',cost:12,price:25,units:8},
      {id:'cicek-gul',name:'Gül demeti',cost:15,price:32,units:6},
      {id:'cicek-saksi',name:'Saksı çiçeği',cost:14,price:29,units:6},
      {id:'cicek-celenk',name:'Tören ve cenaze çelengi',cost:22,price:46,units:4},
      {id:'cicek-dugun',name:'Düğün ve nişan aranjmanı',cost:26,price:54,units:4},
      {id:'cicek-kurumsal',name:'Otel ve mağaza haftalık çiçek düzenlemesi',cost:18,price:39,units:5,service:true}
    ],
    35: [
      {id:'gazino-meze',name:'Gazino meze tabağı',cost:14,price:30,units:8},
      {id:'gazino-icecek',name:'Şerbet, limonata ve içecek',cost:12,price:26,units:8},
      {id:'gazino-sicak',name:'Sıcak yemek servisi',cost:20,price:43,units:6},
      {id:'gazino-masa',name:'Teras masa servisi',cost:18,price:38,units:6,service:true},
      {id:'gazino-musiki',name:'Canlı musiki gecesi bileti',cost:16,price:34,units:8,service:true},
      {id:'gazino-loca',name:'Özel loca ve davet paketi',cost:28,price:62,units:3,service:true}
    ],
    38: [
      {id:'galata-raki',name:'Galata usulü rakı kadehi',cost:16,price:35,units:8},
      {id:'galata-sarap',name:'Fıçıdan sofra şarabı',cost:14,price:31,units:8},
      {id:'galata-meze',name:'Soğuk meze ve zeytinyağlı tabağı',cost:13,price:29,units:8},
      {id:'galata-balik',name:'Günün balığı ve ızgara',cost:21,price:47,units:5},
      {id:'galata-deniz',name:'Kalamar, midye ve deniz mahsulü',cost:24,price:54,units:4},
      {id:'galata-usta',name:'Meyhaneci sofrası ve özel meze seçkisi',cost:29,price:65,units:4}
    ],
    36: [
      {id:'kohen-roman',name:'Yabancı dilde roman',cost:15,price:32,units:6},
      {id:'kohen-sozluk',name:'Sözlük ve dilbilgisi kitabı',cost:16,price:34,units:6},
      {id:'kohen-tarih',name:'Tarih ve seyahat kitabı',cost:18,price:38,units:6},
      {id:'kohen-kirtasiye',name:'Defter, kalem ve mürekkep',cost:10,price:22,units:8},
      {id:'kohen-nadir',name:'Nadir ciltli eser',cost:26,price:58,units:3},
      {id:'kohen-siparis',name:'Yurt dışından özel kitap siparişi',cost:20,price:46,units:4,service:true}
    ],
    39: [
      {id:'sokrat-dibek',name:'Dibek kahvesi',cost:10,price:22,units:10},
      {id:'sokrat-cay',name:'İnce belli bardakta çay',cost:8,price:17,units:10},
      {id:'sokrat-serbet',name:'Ev yapımı şerbet',cost:9,price:19,units:8},
      {id:'sokrat-lokum',name:'Kahve yanı lokum tabağı',cost:11,price:23,units:8},
      {id:'sokrat-nargile',name:'Nargile ve köz servisi',cost:13,price:28,units:6,service:true},
      {id:'sokrat-oyun',name:'Tavla ve oyun masası servisi',cost:5,price:12,units:8,service:true}
    ],
    40: [
      {id:'hamam-giris',name:'Hamam giriş ve yıkanma hizmeti',cost:12,price:27,units:8,service:true},
      {id:'hamam-kese',name:'Kese ve köpük hizmeti',cost:10,price:23,units:8,service:true},
      {id:'hamam-tellak',name:'Tellak ve özel bakım hizmeti',cost:16,price:35,units:6,service:true},
      {id:'hamam-masaj',name:'Yağlı masaj ve bakım',cost:18,price:39,units:5,service:true},
      {id:'hamam-havlu',name:'Peştamal ve havlu seti',cost:14,price:29,units:8},
      {id:'hamam-ozel',name:'Özel oda ve dinlenme paketi',cost:20,price:46,units:4,service:true}
    ],
    41: [
      {id:'dry-takim',name:'Takım elbise kuru temizleme',cost:14,price:30,units:8,service:true},
      {id:'dry-palto',name:'Palto ve kaban temizliği',cost:16,price:35,units:6,service:true},
      {id:'dry-ipek',name:'İpek ve hassas kumaş bakımı',cost:20,price:44,units:4,service:true},
      {id:'dry-utu',name:'Ütüleme ve kolalama',cost:10,price:22,units:8,service:true},
      {id:'dry-leke',name:'Özel leke çıkarma',cost:12,price:27,units:6,service:true},
      {id:'dry-perde',name:'Perde ve ev tekstili temizliği',cost:22,price:48,units:4,service:true}
    ]
  };
  Object.entries(canonicalCatalog).forEach(([id, items]) => { tradeCatalog[id] = items; });
  Object.values(tradeCatalog).forEach(items => items.forEach((item, index) => { item.unlockLevel = Math.min(5, index + 1); }));
  const businessMaterialProfiles = {
    pharmacy: { name: 'Eczahane', materials: [{id:'ecz-ot',name:'Şifalı ot ve etkin madde',batch:6,cost:9},{id:'ecz-sise',name:'Cam şişe ve kavanoz',batch:6,cost:8},{id:'ecz-sargi',name:'Sargı bezi ve temiz pamuk',batch:6,cost:10},{id:'ecz-ambalaj',name:'Etiket ve kâğıt ambalaj',batch:8,cost:7}], recipes: [['ecz-ot',1,'ecz-sise',1],['ecz-ot',2,'ecz-sise',1],['ecz-ot',1,'ecz-ambalaj',2],['ecz-sargi',2,'ecz-ambalaj',1],['ecz-ot',2,'ecz-sise',2]] },
    food: { name: 'Gıda', materials: [{id:'gida-un',name:'Un ve tahıl',batch:8,cost:8},{id:'gida-yag',name:'Yağ ve süt ürünleri',batch:6,cost:9},{id:'gida-urun',name:'Taze gıda ve et',batch:6,cost:12},{id:'gida-baharat',name:'Baharat ve maya',batch:8,cost:7}], recipes: [['gida-un',2,'gida-yag',1],['gida-urun',1,'gida-baharat',1],['gida-urun',2,'gida-yag',1],['gida-un',1,'gida-baharat',1],['gida-urun',2,'gida-baharat',1]] },
    textile: { name: 'Kumaş', materials: [{id:'kum-kumas',name:'Kumaş topu',batch:6,cost:12},{id:'kum-iplik',name:'İplik ve düğme',batch:8,cost:8},{id:'kum-aksesuar',name:'Dantel ve aksesuar',batch:6,cost:10}], recipes: [['kum-kumas',1,'kum-iplik',1],['kum-kumas',2,'kum-iplik',1],['kum-kumas',2,'kum-aksesuar',1],['kum-kumas',2,'kum-iplik',2],['kum-kumas',3,'kum-aksesuar',2]] },
    paper: { name: 'Matbaa ve kitap', materials: [{id:'kagit',name:'Kâğıt ve karton',batch:8,cost:9},{id:'baski-murekkep',name:'Baskı mürekkebi',batch:6,cost:10},{id:'cilt-malzemesi',name:'Cilt bezi ve tutkal',batch:6,cost:12}], recipes: [['kagit',2,'baski-murekkep',1],['kagit',1,'cilt-malzemesi',1],['kagit',2,'baski-murekkep',2],['kagit',3,'cilt-malzemesi',2],['kagit',3,'baski-murekkep',2]] },
    wood: { name: 'Marangoz', materials: [{id:'ahsap',name:'Kereste',batch:6,cost:12},{id:'marangoz-civi',name:'Çivi ve bağlantı',batch:8,cost:7},{id:'ahsap-cila',name:'Cila ve tutkal',batch:6,cost:9}], recipes: [['ahsap',1,'marangoz-civi',1],['ahsap',2,'marangoz-civi',1],['ahsap',2,'ahsap-cila',1],['ahsap',3,'ahsap-cila',1],['ahsap',3,'marangoz-civi',2]] },
    metal: { name: 'Demirci', materials: [{id:'demir-hammadde',name:'Demir külçe',batch:6,cost:14},{id:'komur',name:'Kömür',batch:8,cost:8},{id:'baglanti',name:'Perçin ve bağlantı',batch:8,cost:7}], recipes: [['demir-hammadde',1,'komur',1],['demir-hammadde',2,'komur',1],['demir-hammadde',2,'baglanti',1],['demir-hammadde',3,'komur',2],['demir-hammadde',3,'baglanti',2]] },
    soap: { name: 'Sabun imalatı', materials: [{id:'sabun-yag',name:'Yağ ve sabun bazı',batch:6,cost:11},{id:'sabun-esans',name:'Koku ve bitki özü',batch:6,cost:10},{id:'sabun-kagit',name:'Kalıp ve ambalaj',batch:8,cost:7}], recipes: [['sabun-yag',1,'sabun-kagit',1],['sabun-yag',1,'sabun-esans',1],['sabun-yag',2,'sabun-esans',1],['sabun-yag',2,'sabun-kagit',2],['sabun-yag',2,'sabun-esans',2]] },
    lodging: { name: 'Han ve konaklama', materials: [{id:'han-carsaf',name:'Çarşaf ve yatak takımı',batch:6,cost:12},{id:'han-sabun',name:'Sabun ve temizlik malzemesi',batch:8,cost:8},{id:'han-erzak',name:'Kahvaltılık ve ikramlık',batch:6,cost:10},{id:'han-yakit',name:'Isıtma yakıtı ve lamba yağı',batch:6,cost:9}], recipes: [['han-carsaf',1,'han-sabun',1],['han-carsaf',1,'han-erzak',1],['han-carsaf',2,'han-sabun',1],['han-erzak',2,'han-yakit',1],['han-carsaf',2,'han-erzak',2]] },
    general: { name: 'Ticari mal', materials: [{id:'toptan',name:'Toptan mal kolisi',batch:8,cost:12},{id:'ambalaj',name:'Kâğıt ve ambalaj',batch:8,cost:7},{id:'cam',name:'Cam, teneke ve kavanoz',batch:6,cost:9}], recipes: [['toptan',1,'ambalaj',1],['toptan',1,'cam',1],['toptan',2,'ambalaj',1],['toptan',2,'cam',1],['toptan',3,'ambalaj',2]] },
    service: { name: 'Hizmet', materials: [{id:'sabun-berber',name:'Sabun ve tıraş malzemesi',batch:8,cost:8},{id:'kolonya-berber',name:'Kolonya ve bakım ürünü',batch:6,cost:9},{id:'alet-berber',name:'Ustura ve bakım aleti',batch:4,cost:12}], recipes: [['sabun-berber',1,'kolonya-berber',1],['sabun-berber',1,'alet-berber',1],['kolonya-berber',1,'alet-berber',1],['sabun-berber',2,'kolonya-berber',1],['kolonya-berber',2,'alet-berber',1]] }
  };
  // Business-specific supply chains: recipes follow the actual product range of each shop,
  // rather than every shop drawing from the same generic "food" or "trade" list.
  const shopSpecificProfiles = {
    dryclean: { name: 'Kuru temizleme', materials: [{id:'dry-solvent',name:'Temizleme sıvısı',batch:6,cost:12},{id:'dry-steam',name:'Buhar ve ütüleme sarfı',batch:8,cost:7},{id:'dry-care',name:'Hassas kumaş bakım ürünü',batch:6,cost:10},{id:'dry-wrap',name:'Kâğıt ve giysi kılıfı',batch:10,cost:5}], recipes: [['dry-solvent',1,'dry-steam',1],['dry-solvent',1,'dry-care',1],['dry-steam',1,'dry-wrap',1]] },
    grocery: { name: 'Bakkal ve şarküteri', materials: [
      {id:'bak-koku',name:'Kolonya ve esans',batch:6,cost:10},{id:'bak-cam',name:'Cam şişe ve kavanoz',batch:6,cost:9},
      {id:'bak-sabun',name:'Sabun bazı ve bakım yağı',batch:6,cost:10},{id:'bak-erzak',name:'Toptan erzak kolisi',batch:8,cost:12},
      {id:'bak-kahve',name:'Kahve ve kakao',batch:6,cost:12},{id:'bak-ambalaj',name:'Kâğıt ve hediye ambalajı',batch:8,cost:7}
    ], recipes: [['bak-koku',1,'bak-cam',1],['bak-sabun',1,'bak-ambalaj',1],['bak-erzak',1,'bak-cam',1],['bak-kahve',1,'bak-cam',1],['bak-koku',2,'bak-cam',1]] },
    wine: { name: 'Şarap ve erzak', materials: [
      {id:'sarap-sira',name:'Şıra ve üzüm',batch:8,cost:12},{id:'sarap-sise',name:'Şişe ve mantar',batch:8,cost:9},
      {id:'sarap-etiket',name:'Etiket ve ambalaj',batch:8,cost:7},{id:'sarap-erzak',name:'Kuru erzak',batch:8,cost:10},
      {id:'sarap-meze',name:'Zeytin ve peynir',batch:6,cost:12}
    ], recipes: [['sarap-sira',1,'sarap-sise',1],['sarap-sira',2,'sarap-sise',1],['sarap-erzak',1,'sarap-etiket',1],['sarap-meze',1,'sarap-erzak',1],['sarap-sira',3,'sarap-sise',2]] },
    clothing: { name: 'Konfeksiyon ve perakende', materials: [
      {id:'konf-kumas',name:'Kumaş topu',batch:6,cost:12},{id:'konf-iplik',name:'İplik ve düğme',batch:8,cost:8},
      {id:'konf-aksesuar',name:'Dantel ve aksesuar',batch:6,cost:10},{id:'konf-ithal',name:'Toptan ithal eşya',batch:6,cost:15},
      {id:'konf-kagit',name:'Kitap ve kâğıt ürünleri',batch:8,cost:9}
    ], recipes: [['konf-kumas',1,'konf-iplik',1],['konf-ithal',1,'konf-aksesuar',1],['konf-kagit',1,'konf-ithal',1],['konf-kumas',2,'konf-iplik',2],['konf-kumas',2,'konf-aksesuar',2]] },
    coffee: { name: 'Kahvehane ve kafe', materials: [
      {id:'kahve-cekirdek',name:'Kahve çekirdeği ve çay',batch:8,cost:12},{id:'kahve-seker',name:'Şeker ve süt',batch:8,cost:9},
      {id:'kahve-surup',name:'Şerbet ve tatlı malzemesi',batch:6,cost:10},{id:'kahve-kakao',name:'Kakao ve ithal kahve',batch:6,cost:14},
      {id:'kahve-ikram',name:'Fincan ve servis malzemesi',batch:8,cost:7}
    ], recipes: [['kahve-cekirdek',1,'kahve-ikram',1],['kahve-seker',1,'kahve-surup',1],['kahve-kakao',1,'kahve-ikram',1],['kahve-surup',2,'kahve-seker',1],['kahve-kakao',2,'kahve-ikram',1]] },
    bakery: { name: 'Fırın', materials: [
      {id:'fir-un',name:'Un ve tahıl',batch:8,cost:8},{id:'fir-maya',name:'Maya ve tuz',batch:8,cost:7},
      {id:'fir-yag',name:'Tereyağı ve süt',batch:6,cost:10},{id:'fir-seker',name:'Şeker ve tatlı malzemesi',batch:8,cost:9},
      {id:'fir-ambalaj',name:'Kâğıt torba ve ambalaj',batch:8,cost:6}
    ], recipes: [['fir-un',2,'fir-maya',1],['fir-un',1,'fir-yag',1],['fir-un',1,'fir-seker',1],['fir-yag',2,'fir-seker',1],['fir-un',2,'fir-yag',2]] },
    butcher: { name: 'Kasap', materials: [
      {id:'kas-et',name:'Taze et',batch:6,cost:16},{id:'kas-kemik',name:'Kemik ve sakatat',batch:6,cost:10},
      {id:'kas-baharat',name:'Tuz ve baharat',batch:8,cost:7},{id:'kas-kagit',name:'Kasap kâğıdı ve ambalaj',batch:8,cost:6},
      {id:'kas-yag',name:'Yağ ve iç yağı',batch:6,cost:9}
    ], recipes: [['kas-et',1,'kas-kagit',1],['kas-kemik',1,'kas-baharat',1],['kas-et',2,'kas-kagit',1],['kas-et',1,'kas-yag',1],['kas-et',2,'kas-baharat',1]] },
    greengrocer: { name: 'Manav', materials: [
      {id:'man-sebze',name:'Mevsim sebzesi',batch:8,cost:9},{id:'man-meyve',name:'Taze meyve',batch:8,cost:11},
      {id:'man-sepet',name:'Sepet ve sandık',batch:8,cost:7},{id:'man-kurutma',name:'Kurutmalık ve konserve malzemesi',batch:6,cost:10}
    ], recipes: [['man-sebze',1,'man-sepet',1],['man-meyve',1,'man-sepet',1],['man-sebze',2,'man-sepet',1],['man-meyve',2,'man-kurutma',1],['man-meyve',2,'man-sebze',1]] },
    restaurant: { name: 'Lokanta ve mutfak', materials: [
      {id:'lok-et',name:'Et ve taze sebze',batch:6,cost:13},{id:'lok-tahil',name:'Tahıl ve ekmek',batch:8,cost:8},
      {id:'lok-yag',name:'Yemeklik yağ ve süt',batch:6,cost:9},{id:'lok-baharat',name:'Baharat ve ot',batch:8,cost:7},
      {id:'lok-meze',name:'Meze ve çorbalık malzeme',batch:6,cost:10}
    ], recipes: [['lok-et',1,'lok-tahil',1],['lok-meze',1,'lok-baharat',1],['lok-et',1,'lok-yag',1],['lok-tahil',1,'lok-meze',1],['lok-et',2,'lok-baharat',1]] },
    spice: { name: 'Baharat ve nebatat', materials: [
      {id:'aktar-ot',name:'Şifalı ot ve baharat',batch:8,cost:10},{id:'aktar-kavanoz',name:'Kavanoz ve kâğıt kese',batch:8,cost:7},
      {id:'aktar-yag',name:'Bitkisel yağ ve öz',batch:6,cost:11},{id:'aktar-sabun',name:'Sabun ve bakım bazı',batch:6,cost:10}
    ], recipes: [['aktar-ot',1,'aktar-kavanoz',1],['aktar-sabun',1,'aktar-kavanoz',1],['aktar-ot',2,'aktar-kavanoz',1],['aktar-yag',1,'aktar-kavanoz',1],['aktar-ot',2,'aktar-yag',1]] },
    flower: { name: 'Çiçekçi', materials: [{id:'cicek-taze',name:'Taze kesme çiçek',batch:10,cost:12},{id:'cicek-yesillik',name:'Yeşillik ve dolgu dalı',batch:10,cost:7},{id:'cicek-saksi',name:'Saksı, toprak ve gübre',batch:8,cost:10},{id:'cicek-kagit',name:'Ambalaj kâğıdı ve kurdele',batch:10,cost:6},{id:'cicek-tel',name:'Aranjman teli ve sünger',batch:8,cost:8}], recipes: [['cicek-taze',3,'cicek-kagit',1],['cicek-saksi',1,'cicek-yesillik',1],['cicek-taze',5,'cicek-tel',1],['cicek-taze',4,'cicek-yesillik',2],['cicek-taze',6,'cicek-kagit',2]] },
    perfumery: { name: 'Kolonyacı ve parfümeri', materials: [
      {id:'par-alkol',name:'Kolonya alkolü',batch:8,cost:10},{id:'par-esans',name:'Parfüm esansı',batch:6,cost:13},
      {id:'par-cam',name:'Cam şişe',batch:8,cost:8},{id:'par-sabun',name:'Sabun ve bakım yağı',batch:6,cost:10},
      {id:'par-kutu',name:'Etiket ve hediye kutusu',batch:8,cost:7}
    ], recipes: [['par-alkol',1,'par-esans',1],['par-sabun',1,'par-kutu',1],['par-alkol',1,'par-cam',1],['par-esans',2,'par-cam',1],['par-esans',2,'par-cam',1]] }
  };
  // Distinct supply chains for every active commercial property. Similar businesses may sell
  // related goods, but their procurement items remain specific to the shop and its operating model.
  const BUSINESS_SPECIFIC_PROFILES = {
    58: {
      name:'Haliç Gazinosu — özel tedarik',
      materials:[
        {id:'halic58-mutfak',name:'Gazino mutfağı meze ve sıcak yemek erzağı',batch:8,cost:14},
        {id:'halic58-icecek',name:'Şerbet, limonata ve içecek fıçısı',batch:8,cost:11},
        {id:'halic58-servis',name:'Masa örtüsü, tabak ve servis takımı',batch:8,cost:10},
        {id:'halic58-sahne',name:'Nota, sahne aksesuarı ve müzik sarfı',batch:6,cost:13},
        {id:'halic58-yakit',name:'Mutfak ve sahne aydınlatma yakıtı',batch:8,cost:9}
      ],
      recipes:[
        ['halic58-mutfak',1,'halic58-servis',1],
        ['halic58-icecek',1,'halic58-servis',1],
        ['halic58-sahne',1,'halic58-yakit',1]
      ],
      productRules:[
        {match:/giriş|giris|bilet/i,recipe:[['halic58-sahne',1],['halic58-yakit',1]]},
        {match:/masa|servis/i,recipe:[['halic58-mutfak',1],['halic58-servis',1]]},
        {match:/musiki|müzik|muzik|sahne/i,recipe:[['halic58-sahne',1],['halic58-yakit',1]]}
      ]
    },
    55: {
      name:'Pansiyon tedariki',
      materials:[
        {id:'pans-yatak',name:'Çarşaf, yastık kılıfı ve nevresim',batch:6,cost:12},
        {id:'pans-temizlik',name:'Kat temizliği ve dezenfektan',batch:8,cost:8},
        {id:'pans-kahvalti',name:'Kahvaltılık peynir, zeytin ve yumurta',batch:6,cost:14},
        {id:'pans-banyo',name:'Sabun, şampuan ve banyo sarfı',batch:8,cost:9},
        {id:'pans-camasir',name:'Çamaşır yıkama ve ütü sarfı',batch:6,cost:10}
      ],
      recipes:[['pans-yatak',1,'pans-temizlik',1],['pans-kahvalti',1,'pans-banyo',1]],
      productRules:[
        {match:/kahvaltı|kahvalti|yemek/i,recipe:[['pans-kahvalti',1]]},
        {match:/oda|konaklama|gecelik/i,recipe:[['pans-yatak',1],['pans-temizlik',1],['pans-banyo',1]]}
      ]
    },
    56: {
      name:'Otel işletmesi',
      materials:[
        {id:'otel-nevresim',name:'Otel tipi çarşaf, nevresim ve yastık kılıfı',batch:8,cost:18},
        {id:'otel-temizlik',name:'Kat hizmetleri temizlik ve dezenfeksiyon ürünleri',batch:8,cost:12},
        {id:'otel-banyo',name:'Şampuan, duş jeli, sabun ve buklet seti',batch:8,cost:14},
        {id:'otel-camasir',name:'Çamaşırhane deterjanı ve ütü sarfı',batch:8,cost:13},
        {id:'otel-mutfak',name:'Mutfak erzağı, süt ürünleri ve kahvaltılık',batch:8,cost:20},
        {id:'otel-icecek',name:'Su, kahve, çay ve minibar içecekleri',batch:8,cost:16},
        {id:'otel-bakim',name:'Teknik bakım parçaları ve ampuller',batch:6,cost:15},
        {id:'otel-amenity',name:'Misafir terliği ve kişisel bakım seti',batch:8,cost:11}
      ],
      recipes:[['otel-nevresim',1,'otel-temizlik',1],['otel-banyo',1,'otel-camasir',1],['otel-mutfak',1,'otel-icecek',1]],
      productRules:[
        {match:/oda|suit|konaklama|gecelik/i,recipe:[['otel-nevresim',1],['otel-temizlik',1],['otel-banyo',1],['otel-amenity',1]]},
        {match:/yemek|kahvaltı|kahvalti|restoran/i,recipe:[['otel-mutfak',1],['otel-icecek',1]]},
        {match:/bakım|bakim|temizlik/i,recipe:[['otel-temizlik',1],['otel-bakim',1]]}
      ]
    },
    3: { name:'Karaköy levazımat ambarı', materials:[{id:'ambar-cuva',name:'Keten yük çuvalı ve bağlama ipi',batch:8,cost:8},{id:'ambar-sandik',name:'Tahta yük sandığı',batch:6,cost:12},{id:'ambar-kantar',name:'Kantar, mühür ve sevk etiketi',batch:8,cost:7},{id:'ambar-koruma',name:'Yağlı bez ve yük koruma örtüsü',batch:6,cost:9}], recipes:[['ambar-cuva',1,'ambar-kantar',1],['ambar-sandik',1,'ambar-koruma',1]], productRules:[{match:/depo|ambar|saklama|yük|yuk|taşıma|tasima/i,recipe:[['ambar-cuva',1],['ambar-sandik',1],['ambar-kantar',1]]}] },
    1: { name:'Bakkal ve şarküteri', materials:[{id:'el-bakkal-erzak',name:'Bakliyat ve kuru erzak çuvalı',batch:8,cost:12},{id:'el-bakkal-sarku',name:'Peynir, zeytin ve şarküteri kasası',batch:6,cost:14},{id:'el-bakkal-cay',name:'Çay ve kahve paketi',batch:8,cost:10},{id:'el-bakkal-konserve',name:'Konserve ve turşu kavanozu',batch:8,cost:9},{id:'el-bakkal-kagit',name:'Kesekağıdı ve tartı ambalajı',batch:10,cost:5},{id:'el-bakkal-kolonyaci',name:'Kolonya, esans ve koku şişesi kolisi',batch:6,cost:11},{id:'el-bakkal-sabun',name:'Sabun ve kişisel bakım ürünü kolisi',batch:6,cost:10}], recipes:[['el-bakkal-erzak',1,'el-bakkal-kagit',1],['el-bakkal-sarku',1,'el-bakkal-kagit',1],['el-bakkal-cay',1,'el-bakkal-konserve',1]], productRules:[{match:/kolonya|koku|esans|parfüm|parfum/i,recipe:[['el-bakkal-kolonyaci',1],['el-bakkal-kagit',1]]},{match:/sabun|bakım|bakim/i,recipe:[['el-bakkal-sabun',1],['el-bakkal-kagit',1]]},{match:/peynir|zeytin|pastirma|şarküteri|sarkuteri/i,recipe:[['el-bakkal-sarku',1],['el-bakkal-kagit',1]]},{match:/kahve|çay|cay|kakao/i,recipe:[['el-bakkal-cay',1],['el-bakkal-kagit',1]]},{match:/konserve|turşu|tursu|erzak|bakliyat/i,recipe:[['el-bakkal-erzak',1],['el-bakkal-konserve',1]]}] },
    4: { name:'Ticaret hanı ve konaklama', materials:[{id:'sahin-han-carsaf',name:'Yıkanmış çarşaf ve yatak takımı',batch:6,cost:14},{id:'sahin-han-temizlik',name:'Oda temizliği ve sabun sarfı',batch:8,cost:8},{id:'sahin-han-kahvalti',name:'Kahvaltılık erzak tepsisi',batch:6,cost:12},{id:'sahin-han-lamba',name:'Lamba yağı ve ısıtma yakıtı',batch:8,cost:9},{id:'sahin-han-ikram',name:'Misafir ikramı ve oda suyu',batch:8,cost:7}], recipes:[['sahin-han-carsaf',1,'sahin-han-temizlik',1],['sahin-han-kahvalti',1,'sahin-han-ikram',1],['sahin-han-lamba',1,'sahin-han-temizlik',1]], productRules:[{match:/kahvaltı|kahvalti|ikram|oda suyu/i,recipe:[['sahin-han-kahvalti',1],['sahin-han-ikram',1]]},{match:/çarşaf|carsaf|yatak|temizlik|sabun/i,recipe:[['sahin-han-carsaf',1],['sahin-han-temizlik',1]]}] },
    7: { name:'Şarap ve erzak mahzeni', materials:[{id:'vuc-uzum',name:'Şaraplık üzüm ve şıra',batch:8,cost:14},{id:'vuc-sise',name:'Şişe, mantar ve mühür',batch:8,cost:10},{id:'vuc-meze',name:'Olgun peynir ve zeytin sandığı',batch:6,cost:13},{id:'vuc-kiler',name:'Kuru erzak ve bakliyat',batch:8,cost:10},{id:'vuc-etiket',name:'Mahzen etiketi ve sargı',batch:10,cost:6}], recipes:[['vuc-uzum',1,'vuc-sise',1],['vuc-kiler',1,'vuc-etiket',1],['vuc-meze',1,'vuc-kiler',1]], productRules:[{match:/şarap|sarap|üzüm|uzum|şıra|sira|mahzen|fıçı|fici/i,recipe:[['vuc-uzum',1],['vuc-sise',1],['vuc-etiket',1]]},{match:/peynir|zeytin|meze/i,recipe:[['vuc-meze',1],['vuc-kiler',1]]},{match:/erzak|bakliyat|kuru/i,recipe:[['vuc-kiler',1],['vuc-etiket',1]]}] },
    9: { name:'Matbaa ve mücellithane', materials:[{id:'nuri-kagit',name:'Baskı kâğıdı ve karton tabaka',batch:8,cost:10},{id:'nuri-murekkep',name:'Matbaa mürekkebi ve boya',batch:6,cost:11},{id:'nuri-harf',name:'Kurşun harf ve baskı sarfı',batch:6,cost:13},{id:'nuri-cilt',name:'Cilt bezi, tutkal ve iplik',batch:6,cost:12},{id:'nuri-zarf',name:'Zarf, klişe ve kesim firesi',batch:10,cost:7}], recipes:[['nuri-kagit',2,'nuri-murekkep',1],['nuri-kagit',1,'nuri-cilt',1],['nuri-kagit',2,'nuri-harf',1]], productRules:[{match:/baski|basılı|ilan|evrak|afiş|afis|kartvizit|davetiye/i,recipe:[['nuri-kagit',2],['nuri-murekkep',1],['nuri-harf',1]]},{match:/defter|cilt|kitap/i,recipe:[['nuri-kagit',1],['nuri-cilt',1]]}] },
    10: { name:'Konfeksiyon mağazası', materials:[{id:'paon-kumas',name:'Hazır giyim kumaş topu',batch:6,cost:14},{id:'paon-iplik',name:'Dikiş ipliği, düğme ve kopça',batch:8,cost:8},{id:'paon-aksesuar',name:'Şapka, eldiven ve moda aksesuarı',batch:6,cost:13},{id:'paon-ithal',name:'Paris işi hazır giyim partisi',batch:5,cost:18},{id:'paon-ambalaj',name:'Kıyafet kâğıdı ve mağaza kutusu',batch:8,cost:7},{id:'paon-kitap',name:'Kitap, defter ve kırtasiye toptan kolisi',batch:6,cost:12}], recipes:[['paon-kumas',1,'paon-iplik',1],['paon-ithal',1,'paon-ambalaj',1],['paon-kumas',2,'paon-aksesuar',1]], productRules:[{match:/kitap|kırtasiye|kirtasiye|defter|kalem/i,recipe:[['paon-kitap',1],['paon-ambalaj',1]]},{match:/kumaş|kumas|elbise|palto|ceket|giyim|pantolon|gömlek|gomlek/i,recipe:[['paon-kumas',1],['paon-iplik',1],['paon-ambalaj',1]]},{match:/ipek|eldiven|aksesuar|moda|ithal|eşya|esya/i,recipe:[['paon-ithal',1],['paon-aksesuar',1],['paon-ambalaj',1]]}] },
    12: { name:'Hakkı Efendi kıraathanesi', materials:[{id:'hak-kahve',name:'Kavrulmuş kahve ve çekirdek',batch:8,cost:13},{id:'hak-cay',name:'Çay yaprağı ve şeker',batch:8,cost:9},{id:'hak-serbet',name:'Şerbet şurubu ve limon',batch:6,cost:10},{id:'hak-odun',name:'Semaver kömürü ve odun',batch:8,cost:8},{id:'hak-fincan',name:'Fincan, bardak ve servis tabağı',batch:8,cost:7}], recipes:[['hak-kahve',1,'hak-fincan',1],['hak-cay',1,'hak-odun',1],['hak-serbet',1,'hak-fincan',1]], productRules:[{match:/kahve|çekirdek|cekirdek/i,recipe:[['hak-kahve',1],['hak-fincan',1],['hak-odun',1]]},{match:/çay|cay|şerbet|serbet/i,recipe:[['hak-cay',1],['hak-serbet',1],['hak-fincan',1]]},{match:/tatlı|tatli|lokum|pasta/i,recipe:[['hak-cay',1],['hak-fincan',1]]}] },
    13: { name:'Schumacher ekmek fırını', materials:[{id:'sch-un',name:'Taş değirmen unu',batch:8,cost:9},{id:'sch-maya',name:'Ekşi maya, tuz ve kabartıcı',batch:8,cost:7},{id:'sch-yag',name:'Tereyağı ve süt',batch:6,cost:11},{id:'sch-seker',name:'Şeker, yumurta ve çörek otu',batch:8,cost:10},{id:'sch-odun',name:'Fırın odunu ve çıra',batch:8,cost:8}], recipes:[['sch-un',2,'sch-maya',1],['sch-un',1,'sch-yag',1],['sch-un',1,'sch-seker',1]], productRules:[{match:/ekmek|somun|mayalı/i,recipe:[['sch-un',2],['sch-maya',1],['sch-odun',1]]},{match:/poğaça|pogaca|çörek|corek|simit|açma|acma/i,recipe:[['sch-un',1],['sch-yag',1],['sch-seker',1],['sch-odun',1]]},{match:/pasta|tatlı|tatli|şeker|seker/i,recipe:[['sch-un',1],['sch-seker',1],['sch-yag',1]]}] },
    14: { name:'Kurban Usta kasap', materials:[{id:'kurban-et',name:'Günlük dana ve kuzu karkası',batch:6,cost:18},{id:'kurban-sakatat',name:'Kemik, sakatat ve ilikli parça',batch:6,cost:11},{id:'kurban-baharat',name:'Tuz, baharat ve sucuk harcı',batch:8,cost:8},{id:'kurban-kagit',name:'Kasap kâğıdı ve sicim',batch:10,cost:6},{id:'kurban-yag',name:'İç yağı ve kavurma yağı',batch:6,cost:9}], recipes:[['kurban-et',1,'kurban-kagit',1],['kurban-sakatat',1,'kurban-baharat',1],['kurban-et',1,'kurban-yag',1]], productRules:[{match:/sakatat|kemik|ilik|suyu/i,recipe:[['kurban-sakatat',1],['kurban-baharat',1]]},{match:/sucuk|pastırma|pastirma|köfte|kofte|kıyma|kiyma/i,recipe:[['kurban-et',1],['kurban-baharat',1],['kurban-kagit',1]]},{match:/et|kuzu|dana|şarküteri|sarkuteri/i,recipe:[['kurban-et',1],['kurban-kagit',1]]}] },
    15: { name:'Canzuch eczahanesi', materials:[{id:'canz-ot',name:'Şifalı ot, tentür ve etkin madde',batch:6,cost:11},{id:'canz-sise',name:'Eczane şişesi ve damlalık',batch:8,cost:8},{id:'canz-sargi',name:'Steril sargı, pamuk ve gazlı bez',batch:8,cost:10},{id:'canz-merhem',name:'Merhem bazı ve bitkisel yağ',batch:6,cost:10},{id:'canz-etiket',name:'Doz etiketi ve kâğıt kutu',batch:10,cost:6}], recipes:[['canz-ot',1,'canz-sise',1],['canz-merhem',1,'canz-etiket',1],['canz-sargi',1,'canz-etiket',1]], productRules:[{match:/ilaç|ilac|tentür|tentur|damla|şurup|surup|pastil/i,recipe:[['canz-ot',1],['canz-sise',1],['canz-etiket',1]]},{match:/merhem|bakım|bakim/i,recipe:[['canz-merhem',1],['canz-etiket',1]]},{match:/sargı|sargi|antiseptik|pamuk/i,recipe:[['canz-sargi',1],['canz-etiket',1]]}] },
    16: { name:'Narlıyan kitap ve kırtasiye', materials:[{id:'narl-kitap',name:'Yeni kitap ve süreli yayın kolisi',batch:6,cost:14},{id:'narl-kagit',name:'Defter kâğıdı ve çizim kâğıdı',batch:8,cost:9},{id:'narl-murekkep',name:'Mürekkep, kalem ucu ve kurşun kalem',batch:8,cost:8},{id:'narl-cilt',name:'Cilt bezi ve kitap tutkalı',batch:6,cost:12},{id:'narl-nadir',name:'Nadir eser ve ithal yayın sandığı',batch:4,cost:18}], recipes:[['narl-kitap',1,'narl-kagit',1],['narl-kagit',1,'narl-murekkep',1],['narl-kitap',1,'narl-cilt',1]], productRules:[{match:/kitap|roman|ansiklopedi|eser|sözlük|sozluk/i,recipe:[['narl-kitap',1],['narl-cilt',1]]},{match:/defter|kalem|kırtasiye|kirtasiye|boya|mürekkep|murekkep/i,recipe:[['narl-kagit',1],['narl-murekkep',1]]},{match:/nadir|ciltli|ithal/i,recipe:[['narl-nadir',1],['narl-cilt',1]]}] },
    17: { name:'Hakkı Usta marangozhanesi', materials:[{id:'hak-kereste',name:'Kesilmiş kereste ve tahta',batch:6,cost:14},{id:'hak-civi',name:'Çivi, vida ve ahşap bağlantı',batch:8,cost:7},{id:'hak-cila',name:'Cila, vernik ve tutkal',batch:6,cost:10},{id:'hak-dokuma',name:'Döşemelik kumaş ve dolgu',batch:6,cost:11}], recipes:[['hak-kereste',1,'hak-civi',1],['hak-kereste',2,'hak-cila',1],['hak-kereste',2,'hak-dokuma',1]], productRules:[{match:/tamir|onarım|onarim/i,recipe:[['hak-civi',1],['hak-cila',1]]},{match:/tabure|sandalye|masa|dolap|sandık|s andik|vitrin|mobilya/i,recipe:[['hak-kereste',2],['hak-civi',1],['hak-cila',1]]},{match:/döşeme|doseme|koltuk/i,recipe:[['hak-kereste',1],['hak-dokuma',1],['hak-cila',1]]}] },
    18: { name:'Yorgo manav', materials:[{id:'yor-sebze',name:'Günlük mevsim sebzesi kasası',batch:8,cost:10},{id:'yor-meyve',name:'Taze meyve sandığı',batch:8,cost:12},{id:'yor-sepet',name:'Hasır sepet ve ahşap kasa',batch:8,cost:7},{id:'yor-kurut',name:'Kurutmalık ve salamura malzemesi',batch:6,cost:10}], recipes:[['yor-sebze',1,'yor-sepet',1],['yor-meyve',1,'yor-sepet',1],['yor-meyve',2,'yor-kurut',1]], productRules:[{match:/meyve|narenciye|elma|armut|üzüm|uzum/i,recipe:[['yor-meyve',1],['yor-sepet',1]]},{match:/sebze|yeşillik|yesillik|domates/i,recipe:[['yor-sebze',1],['yor-sepet',1]]},{match:/kurut|konserve|salamura/i,recipe:[['yor-meyve',1],['yor-kurut',1]]}] },
    19: { name:'Hacı Salih esnaf lokantası', materials:[{id:'salih-et',name:'Günlük et ve kemik suyu',batch:6,cost:14},{id:'salih-tahil',name:'Pirinç, bulgur ve ekmek',batch:8,cost:9},{id:'salih-yag',name:'Yemeklik yağ, yoğurt ve süt',batch:6,cost:10},{id:'salih-sebze',name:'Soğan, sebze ve bakliyat',batch:8,cost:9},{id:'salih-baharat',name:'Baharat, salça ve taze ot',batch:8,cost:7}], recipes:[['salih-et',1,'salih-tahil',1],['salih-sebze',1,'salih-baharat',1],['salih-tahil',1,'salih-yag',1]], productRules:[{match:/çorba|corba|ekmek|tahıl|tahil|pilav/i,recipe:[['salih-tahil',1],['salih-sebze',1],['salih-baharat',1]]},{match:/meze|zeytinyağlı|zeytinyagli|sebze/i,recipe:[['salih-sebze',1],['salih-yag',1],['salih-baharat',1]]},{match:/et|yemek|menü|menu|köfte|kofte/i,recipe:[['salih-et',1],['salih-sebze',1],['salih-baharat',1]]}] },
    20: { name:'Karabet demirci ocağı', materials:[{id:'kar-demir',name:'Dövülebilir demir külçesi',batch:6,cost:16},{id:'kar-komur',name:'Ocak kömürü ve kok',batch:8,cost:9},{id:'kar-percin',name:'Perçin, menteşe ve nal parçası',batch:8,cost:8},{id:'kar-sap',name:'Ahşap sap ve alet kabzası',batch:6,cost:9}], recipes:[['kar-demir',1,'kar-komur',1],['kar-demir',2,'kar-percin',1],['kar-demir',2,'kar-sap',1]], productRules:[{match:/tamir|kalay|hizmet/i,recipe:[['kar-komur',1],['kar-percin',1]]},{match:/nal|menteşe|mentese|bağlantı|baglanti/i,recipe:[['kar-demir',1],['kar-percin',1],['kar-komur',1]]},{match:/alet|metal|dövme|dovme|ferforje|demir/i,recipe:[['kar-demir',2],['kar-komur',1],['kar-sap',1]]}] },
    21: { name:'Hacı Arif Paşa Hanı', materials:[{id:'arif-carsaf',name:'Han odası çarşafı ve yatak takımı',batch:6,cost:15},{id:'arif-temizlik',name:'Kat temizliği ve sabun sarfı',batch:8,cost:8},{id:'arif-kahvalti',name:'Tüccar kahvaltısı ve ikram tepsisi',batch:6,cost:13},{id:'arif-lamba',name:'Lamba yağı ve soba yakıtı',batch:8,cost:9},{id:'arif-yuk',name:'Ambar ipi, çuval ve taşıma bezi',batch:8,cost:8}], recipes:[['arif-carsaf',1,'arif-temizlik',1],['arif-kahvalti',1,'arif-temizlik',1],['arif-yuk',1,'arif-lamba',1]], productRules:[{match:/kahvaltı|kahvalti|ikram/i,recipe:[['arif-kahvalti',1],['arif-temizlik',1]]},{match:/ambar|yük|yuk|depo|taşıma|tasima/i,recipe:[['arif-yuk',1],['arif-lamba',1]]},{match:/çarşaf|carsaf|oda|konaklama|yatak/i,recipe:[['arif-carsaf',1],['arif-temizlik',1]]}] },
    23: { name:'Madam Mari aktar ve nebatat', materials:[{id:'mari-ot',name:'Şifalı ot, kök ve baharat demeti',batch:8,cost:11},{id:'mari-yag',name:'Bitkisel yağ ve tentür özü',batch:6,cost:12},{id:'mari-kavanoz',name:'Kavanoz, şişe ve kâğıt kese',batch:8,cost:8},{id:'mari-sabun',name:'Doğal sabun bazı ve bakım yağı',batch:6,cost:10}], recipes:[['mari-ot',1,'mari-kavanoz',1],['mari-yag',1,'mari-kavanoz',1],['mari-sabun',1,'mari-kavanoz',1]], productRules:[{match:/sabun|bakım|bakim/i,recipe:[['mari-sabun',1],['mari-kavanoz',1]]},{match:/yağ|yag|öz|tentür|tentur|merhem/i,recipe:[['mari-yag',1],['mari-kavanoz',1]]},{match:/baharat|ot|bitki|şifalı|sifali/i,recipe:[['mari-ot',1],['mari-kavanoz',1]]}] },
    25: { name:'Café de Péra', materials:[{id:'pera-kahve',name:'Seçme kahve çekirdeği',batch:8,cost:14},{id:'pera-kakao',name:'Kakao, krema ve pastacılık çikolatası',batch:6,cost:13},{id:'pera-sut',name:'Süt, şeker ve yumurta',batch:8,cost:10},{id:'pera-serbet',name:'Gül şerbeti ve meyve özü',batch:6,cost:11},{id:'pera-servis',name:'Porselen fincan ve servis takımı',batch:6,cost:12}], recipes:[['pera-kahve',1,'pera-servis',1],['pera-sut',1,'pera-serbet',1],['pera-kakao',1,'pera-servis',1]], productRules:[{match:/kahve|çekirdek|cekirdek/i,recipe:[['pera-kahve',1],['pera-servis',1]]},{match:/pasta|tatlı|tatli|profiterol|ekler|tart|kek|kurabiye/i,recipe:[['pera-kakao',1],['pera-sut',1],['pera-servis',1]]},{match:/şerbet|serbet|limonata|içecek|icecek/i,recipe:[['pera-serbet',1],['pera-sut',1],['pera-servis',1]]}] },
    26: { name:'Madam İfigenia terzihanesi', materials:[{id:'ifi-kumas',name:'Müşteri ölçüsüne uygun kumaş',batch:6,cost:14},{id:'ifi-iplik',name:'İpek iplik, düğme ve kopça',batch:8,cost:9},{id:'ifi-astar',name:'Astar, tela ve dikiş malzemesi',batch:6,cost:11},{id:'ifi-dantel',name:'Dantel, kurdele ve özel aksesuar',batch:6,cost:13}], recipes:[['ifi-kumas',1,'ifi-iplik',1],['ifi-kumas',2,'ifi-astar',1],['ifi-kumas',2,'ifi-dantel',1]], productRules:[{match:/tamir/i,recipe:[['ifi-iplik',1],['ifi-astar',1]]},{match:/gelinlik|özel gün|ozel gun|ipek|moda|elbise|palto|ceket|dikim/i,recipe:[['ifi-kumas',1],['ifi-iplik',1],['ifi-astar',1],['ifi-dantel',1]]}] },
    28: { name:'Sotiri kolonyacı ve parfümeri', materials:[{id:'sot-alkol',name:'Kolonya alkolü ve saf esans bazı',batch:8,cost:11},{id:'sot-esans',name:'Fransız parfüm esansı',batch:6,cost:15},{id:'sot-cam',name:'Cam şişe, tıpa ve damlalık',batch:8,cost:9},{id:'sot-sabun',name:'Kokulu sabun ve bakım yağı',batch:6,cost:10},{id:'sot-kutu',name:'Etiket, kurdele ve hediye kutusu',batch:8,cost:7}], recipes:[['sot-alkol',1,'sot-esans',1],['sot-sabun',1,'sot-kutu',1],['sot-esans',1,'sot-cam',1]], productRules:[{match:/kolonya|parfüm|parfum|esans|koku/i,recipe:[['sot-alkol',1],['sot-esans',1],['sot-cam',1],['sot-kutu',1]]},{match:/sabun|bakım|bakim/i,recipe:[['sot-sabun',1],['sot-kutu',1]]},{match:/hediye|kutu|set/i,recipe:[['sot-esans',1],['sot-cam',1],['sot-kutu',1]]}] },
    29: { name:'Mavridis sabun imalathanesi', materials:[{id:'mav-yag',name:'Zeytinyağı ve sabun yağı',batch:6,cost:12},{id:'mav-kostik',name:'Sabun bazı ve kostik',batch:6,cost:10},{id:'mav-esans',name:'Lavanta, defne ve koku özü',batch:6,cost:11},{id:'mav-kalip',name:'Sabun kalıbı, kâğıt ve etiket',batch:8,cost:7}], recipes:[['mav-yag',1,'mav-kostik',1],['mav-yag',1,'mav-esans',1],['mav-yag',1,'mav-kalip',1]], productRules:[{match:/temizlik|kalıp sabun|kalip sabun/i,recipe:[['mav-yag',1],['mav-kostik',1],['mav-kalip',1]]},{match:/lavanta|kokulu|otel|sabun|kolonya|esans/i,recipe:[['mav-yag',1],['mav-esans',1],['mav-kalip',1]]}] },
    31: { name:'Şeref Usta lokantası', materials:[{id:'seref-balik',name:'Günlük balık ve et',batch:6,cost:16},{id:'seref-meze',name:'Meze, yoğurt ve zeytinyağlı',batch:8,cost:10},{id:'seref-ekmek',name:'Fırın ekmeği ve tahıl',batch:8,cost:9},{id:'seref-yag',name:'Zeytinyağı ve yemeklik yağ',batch:6,cost:11},{id:'seref-baharat',name:'Baharat, limon ve taze ot',batch:8,cost:8}], recipes:[['seref-balik',1,'seref-ekmek',1],['seref-meze',1,'seref-yag',1],['seref-balik',1,'seref-baharat',1]], productRules:[{match:/meze|peynir|zeytin|çorba|corba/i,recipe:[['seref-meze',1],['seref-yag',1],['seref-baharat',1]]},{match:/balık|balik|et|ızgara|izgara|kebap/i,recipe:[['seref-balik',1],['seref-baharat',1],['seref-yag',1]]},{match:/yemek|pilav|zeytinyağlı|zeytinyagli|tatlı|tatli/i,recipe:[['seref-ekmek',1],['seref-meze',1],['seref-yag',1]]}] },
    32: { name:'Papadopulos matbaa ve kırtasiye', materials:[{id:'papa-kagit',name:'Baskı kâğıdı ve karton',batch:8,cost:10},{id:'papa-murekkep',name:'Matbaa mürekkebi ve baskı boyası',batch:6,cost:12},{id:'papa-kalem',name:'Kalem, mürekkep hokkası ve cetvel',batch:8,cost:9},{id:'papa-cilt',name:'Cilt bezi ve defter teli',batch:6,cost:11},{id:'papa-harf',name:'Kurşun harf ve klişe',batch:6,cost:13}], recipes:[['papa-kagit',2,'papa-murekkep',1],['papa-kagit',1,'papa-kalem',1],['papa-kagit',1,'papa-cilt',1]], productRules:[{match:/baski|ilan|evrak|davetiye|afiş|afis/i,recipe:[['papa-kagit',2],['papa-murekkep',1],['papa-harf',1]]},{match:/defter|kırtasiye|kirtasiye|kalem/i,recipe:[['papa-kagit',1],['papa-kalem',1],['papa-cilt',1]]}] },
    33: { name:'Şevket Efendi berberhanesi', materials:[{id:'sev-sabun',name:'Tıraş sabunu ve köpük',batch:8,cost:8},{id:'sev-jilet',name:'Ustura bileme ve jilet sarfı',batch:6,cost:10},{id:'sev-havlu',name:'Temiz havlu ve sıcak su',batch:8,cost:8},{id:'sev-kolonya',name:'Kolonya ve saç losyonu',batch:6,cost:10},{id:'sev-yag',name:'Bıyık balmı ve saç yağı',batch:6,cost:11}], recipes:[['sev-sabun',1,'sev-havlu',1],['sev-jilet',1,'sev-havlu',1],['sev-kolonya',1,'sev-yag',1]], productRules:[{match:/sabun|tıraş|tiras|bakım|bakim/i,recipe:[['sev-sabun',1],['sev-havlu',1]]},{match:/kolonya|saç|sac|losyon|bıyık|biyik/i,recipe:[['sev-kolonya',1],['sev-yag',1]]},{match:/ustura|jilet|tıraş|tiras/i,recipe:[['sev-jilet',1],['sev-havlu',1]]}] },
    34: { name:'Çiçekçi', materials:[{id:'cicek-taze',name:'Taze kesme çiçek',batch:10,cost:12},{id:'cicek-yesillik',name:'Yeşillik ve dolgu dalı',batch:10,cost:7},{id:'cicek-saksi',name:'Saksı, toprak ve gübre',batch:8,cost:10},{id:'cicek-kagit',name:'Ambalaj kâğıdı ve kurdele',batch:10,cost:6},{id:'cicek-tel',name:'Aranjman teli ve sünger',batch:8,cost:8}], recipes:[['cicek-taze',3,'cicek-kagit',1],['cicek-saksi',1,'cicek-yesillik',1],['cicek-taze',5,'cicek-tel',1]], productRules:[{match:/saksı|saksi|toprak|gübre|gubre/i,recipe:[['cicek-saksi',1],['cicek-yesillik',1]]},{match:/çelenk|tören|toren|aranjman/i,recipe:[['cicek-taze',5],['cicek-tel',1],['cicek-yesillik',2],['cicek-kagit',1]]},{match:/gül|gul|demet|buket|çiçek|cicek|kolonya/i,recipe:[['cicek-taze',3],['cicek-yesillik',1],['cicek-kagit',1]]}] },
    35: { name:'Haliç Gazinosu', materials:[{id:'halic-mutfak',name:'Gazino mutfağı meze ve sıcak yemek stoğu',batch:8,cost:14},{id:'halic-icecek',name:'Şerbet, limonata ve içecek fıçısı',batch:8,cost:11},{id:'halic-servis',name:'Masa örtüsü, tabak ve servis takımı',batch:8,cost:10},{id:'halic-sahne',name:'Nota, sahne aksesuarı ve müzik sarfı',batch:6,cost:13},{id:'halic-yakit',name:'Mutfak ve sahne aydınlatma yakıtı',batch:8,cost:9}], recipes:[['halic-mutfak',1,'halic-servis',1],['halic-icecek',1,'halic-servis',1],['halic-sahne',1,'halic-yakit',1]], productRules:[{match:/meze|lokum|akide|helva|badem|yemek|atıştırmalık|atistirmalik/i,recipe:[['halic-mutfak',1],['halic-servis',1]]},{match:/limonata|şerbet|serbet|içecek|icecek|şarap|sarap/i,recipe:[['halic-icecek',1],['halic-servis',1]]},{match:/müzik|muzik|sahne|musiki|bilet|gazino|giriş|giris/i,recipe:[['halic-sahne',1],['halic-yakit',1]]}] },
    36: { name:'Kohen Hemşireler Kitabevi', materials:[{id:'kohen-yabanci',name:'Yabancı dilde kitap ve roman sandığı',batch:6,cost:15},{id:'kohen-sozluk',name:'Sözlük ve dilbilgisi kitabı partisi',batch:6,cost:14},{id:'kohen-kirtasiye',name:'Mürekkep, defter ve kalem',batch:8,cost:9},{id:'kohen-nadir',name:'Nadir ciltli eser ve ithal yayın',batch:4,cost:20}], recipes:[['kohen-yabanci',1,'kohen-kirtasiye',1],['kohen-sozluk',1,'kohen-kirtasiye',1],['kohen-nadir',1,'kohen-kirtasiye',1]], productRules:[{match:/sözlük|sozluk|dil kitabı|dil kitabi/i,recipe:[['kohen-sozluk',1],['kohen-kirtasiye',1]]},{match:/kırtasiye|kirtasiye|defter|kalem|mürekkep|murekkep/i,recipe:[['kohen-kirtasiye',1]]},{match:/nadir|ciltli|ansiklopedi|eser/i,recipe:[['kohen-nadir',1],['kohen-kirtasiye',1]]},{match:/roman|kitap|yayın|yayin/i,recipe:[['kohen-yabanci',1],['kohen-kirtasiye',1]]}] },
    39: { name:'Sokrat Kıraathanesi', materials:[{id:'sokrat-kahve',name:'Dibek kahvesi ve kahve çekirdeği',batch:8,cost:12},{id:'sokrat-cay',name:'Çay, şeker ve limon',batch:8,cost:9},{id:'sokrat-serbet',name:'Şerbet özü ve lokum',batch:8,cost:10},{id:'sokrat-fincan',name:'Porselen fincan ve bardak',batch:8,cost:8}], recipes:[['sokrat-kahve',1,'sokrat-fincan',1],['sokrat-cay',1,'sokrat-fincan',1],['sokrat-serbet',1,'sokrat-fincan',1]], productRules:[{match:/kahve/i,recipe:[['sokrat-kahve',1],['sokrat-fincan',1]]},{match:/çay|cay|şerbet|serbet/i,recipe:[['sokrat-cay',1],['sokrat-serbet',1],['sokrat-fincan',1]]},{match:/lokum|tatlı|tatli/i,recipe:[['sokrat-serbet',1],['sokrat-cay',1]]}] },
    40: { name:'Tarihi Mahalle Hamamı', materials:[{id:'hamam-havlu',name:'Peştamal, havlu ve çarşaf',batch:8,cost:10},{id:'hamam-sabun',name:'Zeytinyağlı sabun ve köpük',batch:8,cost:9},{id:'hamam-kese',name:'Kese ve tellak sarfı',batch:8,cost:9},{id:'hamam-yag',name:'Masaj yağı ve bakım özü',batch:6,cost:12},{id:'hamam-yakit',name:'Kazan yakıtı ve sıcak su gideri',batch:8,cost:10}], recipes:[['hamam-havlu',1,'hamam-sabun',1],['hamam-kese',1,'hamam-sabun',1],['hamam-yag',1,'hamam-havlu',1]], productRules:[{match:/havlu|peştamal|pestamal|kese|sabun/i,recipe:[['hamam-havlu',1],['hamam-sabun',1],['hamam-yakit',1]]},{match:/masaj|bakım|bakim|yağ|yag/i,recipe:[['hamam-yag',1],['hamam-havlu',1],['hamam-yakit',1]]}] },
    41: { name:'Pera Buharlı Kuru Temizleme', materials:[{id:'pera-dry-solvent',name:'Kuru temizleme solventi',batch:6,cost:14},{id:'pera-dry-steam',name:'Buhar kazanı yakıtı ve ütü sarfı',batch:8,cost:9},{id:'pera-dry-care',name:'İpek ve hassas kumaş bakım solüsyonu',batch:6,cost:12},{id:'pera-dry-wrap',name:'Askı, kâğıt giysi kılıfı ve etiket',batch:10,cost:7},{id:'pera-dry-starch',name:'Kolalama ve leke çıkarıcı',batch:6,cost:11}], recipes:[['pera-dry-solvent',1,'pera-dry-steam',1],['pera-dry-solvent',1,'pera-dry-care',1],['pera-dry-steam',1,'pera-dry-wrap',1]], productRules:[{match:/ipek|hassas/i,recipe:[['pera-dry-solvent',1],['pera-dry-care',1],['pera-dry-wrap',1]]},{match:/ütü|utu|paket|kılıf|kilif/i,recipe:[['pera-dry-steam',1],['pera-dry-wrap',1]]},{match:/takım|takim|palto|kaban|temizleme/i,recipe:[['pera-dry-solvent',1],['pera-dry-steam',1],['pera-dry-starch',1],['pera-dry-wrap',1]]}] }
  };

  const MEYHANE_PROFILE = {
    name:'Galata Meyhanesi — meyhane tedariki',
    materials:[
      {id:'meyhane-icki',name:'Rakı, şarap ve bira fıçıları',batch:6,cost:18},
      {id:'meyhane-balik',name:'Günlük balık ve deniz mahsulü kasası',batch:6,cost:17},
      {id:'meyhane-meze',name:'Peynir, zeytin ve soğuk meze erzağı',batch:8,cost:12},
      {id:'meyhane-yag',name:'Zeytinyağı, limon ve taze ot',batch:8,cost:9},
      {id:'meyhane-ekmek',name:'Ekmek, un ve meze pidesi',batch:8,cost:8},
      {id:'meyhane-servis',name:'Kadeh, rakı bardağı ve sofra takımı',batch:6,cost:11},
      {id:'meyhane-yakit',name:'Mutfak kömürü ve ocak odunu',batch:8,cost:8}
    ],
    recipes:[
      ['meyhane-icki',1,'meyhane-servis',1],
      ['meyhane-meze',1,'meyhane-yag',1],
      ['meyhane-balik',1,'meyhane-yakit',1],
      ['meyhane-ekmek',1,'meyhane-meze',1],
      ['meyhane-balik',1,'meyhane-meze',2]
    ],
    productRules:[
      {match:/rakı|raki|şarap|sarap|bira|içki|icki|fıçı|fici|kadeh/i,recipe:[['meyhane-icki',1],['meyhane-servis',1]]},
      {match:/balık|balik|deniz mahsulü|deniz mahsulu|ızgara|izgara|kalamar|midye|karides/i,recipe:[['meyhane-balik',1],['meyhane-yakit',1],['meyhane-yag',1]]},
      {match:/meze|peynir|zeytin|turşu|tursu|salamura/i,recipe:[['meyhane-meze',1],['meyhane-yag',1],['meyhane-servis',1]]},
      {match:/ekmek|pide|hamur/i,recipe:[['meyhane-ekmek',1],['meyhane-yakit',1]]},
      {match:/sofra|masa|servis|rakı masası|raki masasi/i,recipe:[['meyhane-servis',1],['meyhane-meze',1]]}
    ]
  };
  const getBusinessProfile = (propertyId) => {
    const id = Number(propertyId);
    const propertyName = String(properties.find(property => property.id === id)?.name || '').toLocaleLowerCase('tr-TR');
    // Match by the actual business name as well as its ID: newly added meyhanes
    // must never inherit the unrelated generic wholesale/packaging supply chain.
    if (id === 38 || /meyhane|meyhaneci|taverna/.test(propertyName)) return MEYHANE_PROFILE;
    // Professional offices sell time and expertise, not physical inventory.
    if ([42, 43, 44, 45, 46].includes(id)) return { name: ({42:'Dr. Deniz Hanım Muayenehanesi',43:'Avukat Nihat Bey Hukuk Bürosu',44:'Diş Tabibi Rauf Bey Kliniği',45:'Mühendislik ve Mimarlık Bürosu',46:'SMMM ve Muhasebe Yazıhanesi'})[id], materials: [], recipes: [], productRules: [] };
    // The playable property IDs end at 41; hotel-like lodging venues are IDs 4 and 21.
    // Do not rely on obsolete IDs 55/56 that are not present in the property registry.
    if (id === 4) return {
      name:'Şahin Bey Ticaret Hanı — konaklama tedariki',
      materials:[
        {id:'sahin-han-carsaf',name:'Temiz çarşaf, nevresim ve yastık kılıfı',batch:6,cost:14},
        {id:'sahin-han-temizlik',name:'Oda temizliği ve yüzey dezenfektanı',batch:8,cost:8},
        {id:'sahin-han-kahvalti',name:'Kahvaltılık peynir, zeytin ve yumurta',batch:6,cost:12},
        {id:'sahin-han-lamba',name:'Lamba yağı ve ısıtma yakıtı',batch:8,cost:9},
        {id:'sahin-han-ikram',name:'Misafir sabunu, su ve ikramlık',batch:8,cost:7}
      ],
      recipes:[['sahin-han-carsaf',1,'sahin-han-temizlik',1],['sahin-han-kahvalti',1,'sahin-han-ikram',1],['sahin-han-lamba',1,'sahin-han-temizlik',1]],
      productRules:[
        {match:/kahvaltı|kahvalti|ikram/i,recipe:[['sahin-han-kahvalti',1],['sahin-han-ikram',1]]},
        {match:/oda|konaklama|gecelik|yatak/i,recipe:[['sahin-han-carsaf',1],['sahin-han-temizlik',1],['sahin-han-ikram',1]]},
        {match:/depo|ambar|taşıma|tasima/i,recipe:[['sahin-han-lamba',1],['sahin-han-temizlik',1]]}
      ]
    };
    if (id === 21) return {
      name:'Hacı Arif Paşa Hanı — konaklama tedariki',
      materials:[
        {id:'arif-carsaf',name:'Han odası çarşafı ve yatak takımı',batch:6,cost:15},
        {id:'arif-temizlik',name:'Kat temizliği ve sabun sarfı',batch:8,cost:8},
        {id:'arif-kahvalti',name:'Tüccar kahvaltısı ve ikram tepsisi',batch:6,cost:13},
        {id:'arif-lamba',name:'Lamba yağı ve soba yakıtı',batch:8,cost:9},
        {id:'arif-yuk',name:'Ambar ipi, çuval ve taşıma bezi',batch:8,cost:8}
      ],
      recipes:[['arif-carsaf',1,'arif-temizlik',1],['arif-kahvalti',1,'arif-temizlik',1],['arif-yuk',1,'arif-lamba',1]],
      productRules:[
        {match:/kahvaltı|kahvalti|ikram|erzak/i,recipe:[['arif-kahvalti',1],['arif-temizlik',1]]},
        {match:/ambar|yük|yuk|depo|taşıma|tasima/i,recipe:[['arif-yuk',1],['arif-lamba',1]]},
        {match:/çarşaf|carsaf|oda|konaklama|yatak/i,recipe:[['arif-carsaf',1],['arif-temizlik',1]]}
      ]
    };
    // Explicit high-priority mapping for the gazino, which also had a generic legacy profile.
    if (id === 40) return {
      name:'Tarihi Mahalle Hamamı — hamam ve bakım tedariki',
      materials:[
        {id:'hamam-kese-stok',name:'Kese lifi ve doğal sabun',batch:8,cost:9},
        {id:'hamam-yag',name:'Gülsuyu ve bakım yağı',batch:6,cost:11},
        {id:'hamam-tekstil',name:'Temiz peştamal ve havlu demeti',batch:8,cost:10},
        {id:'hamam-yakit',name:'Külhan odunu ve kömür',batch:8,cost:8},
        {id:'hamam-su',name:'Su ısıtma ve kazan bakım sarfı',batch:6,cost:9}
      ],
      recipes:[['hamam-kese-stok',1,'hamam-yakit',1],['hamam-yag',1,'hamam-tekstil',1],['hamam-yakit',1,'hamam-su',1]],
      productRules:[
        {match:/giriş|yıkanma|yikanma|hamam/i,recipe:[['hamam-yakit',1],['hamam-su',1]]},
        {match:/kese|köpük|kopuk|tellak/i,recipe:[['hamam-kese-stok',1],['hamam-yakit',1]]},
        {match:/masaj|bakım|bakim|özel oda|ozel oda/i,recipe:[['hamam-yag',1],['hamam-tekstil',1]]},
        {match:/havlu|peştamal|pestamal/i,recipe:[['hamam-tekstil',1],['hamam-yakit',1]]}
      ]
    };
    if (id === 33) return {
      name:'Şevket Efendi’nin Berberhanesi — berber sarfı',
      materials:[
        {id:'berber-jilet',name:'Ustura jileti ve bileme taşı',batch:8,cost:7},
        {id:'berber-sabun',name:'Tıraş sabunu ve kolonya',batch:8,cost:8},
        {id:'berber-havlu',name:'Temiz havlu ve önlük',batch:8,cost:7},
        {id:'berber-yag',name:'Saç yağı ve bakım losyonu',batch:6,cost:9},
        {id:'berber-dezenf',name:'Makas ve tarak temizleme sarfı',batch:8,cost:6}
      ],
      recipes:[['berber-jilet',1,'berber-sabun',1],['berber-havlu',1,'berber-dezenf',1],['berber-yag',1,'berber-havlu',1]],
      productRules:[
        {match:/tıraş|tiras|sakal|ustura/i,recipe:[['berber-jilet',1],['berber-sabun',1]]},
        {match:/saç|sac|kesim|fön|fon|şekil|sekil/i,recipe:[['berber-havlu',1],['berber-dezenf',1]]},
        {match:/kolonya|bakım|bakim|yağ|yag/i,recipe:[['berber-yag',1],['berber-sabun',1]]}
      ]
    };
    if (id === 35) return {
      name:'Haliç Gazinosu',
      materials:[
        {id:'halic-mutfak',name:'Gazino mutfağı meze ve sıcak yemek stoğu',batch:8,cost:14},
        {id:'halic-icecek',name:'Şerbet, limonata ve içecek fıçısı',batch:8,cost:11},
        {id:'halic-servis',name:'Masa örtüsü, tabak ve servis takımı',batch:8,cost:10},
        {id:'halic-sahne',name:'Nota, sahne aksesuarı ve müzik sarfı',batch:6,cost:13},
        {id:'halic-yakit',name:'Mutfak ve sahne aydınlatma yakıtı',batch:8,cost:9}
      ],
      recipes:[['halic-mutfak',1,'halic-servis',1],['halic-icecek',1,'halic-servis',1],['halic-sahne',1,'halic-yakit',1]],
      productRules:[
        {match:/meze|lokum|akide|helva|badem|yemek|atıştırmalık|atistirmalik/i,recipe:[['halic-mutfak',1],['halic-servis',1]]},
        {match:/limonata|şerbet|serbet|içecek|icecek|şarap|sarap/i,recipe:[['halic-icecek',1],['halic-servis',1]]},
        {match:/müzik|muzik|sahne|musiki|bilet|gazino|giriş|giris/i,recipe:[['halic-sahne',1],['halic-yakit',1]]}
      ]
    };
    if (BUSINESS_SPECIFIC_PROFILES[id]) return BUSINESS_SPECIFIC_PROFILES[id];
    if (id === 1) return shopSpecificProfiles.grocery;
    if (id === 7) return shopSpecificProfiles.wine;
    if (id === 10) return shopSpecificProfiles.clothing;
    if ([12,25].includes(id)) return shopSpecificProfiles.coffee;
    if (id === 13) return shopSpecificProfiles.bakery;
    if (id === 14) return shopSpecificProfiles.butcher;
    if (id === 15) return businessMaterialProfiles.pharmacy;
    if (id === 18) return shopSpecificProfiles.greengrocer;
    if ([19,31].includes(id)) return shopSpecificProfiles.restaurant;
    if (id === 23) return shopSpecificProfiles.spice;
    if (id === 28) return shopSpecificProfiles.perfumery;
    if (id === 34) return businessMaterialProfiles.flower;
    if (id === 36) return businessMaterialProfiles.paper;
    if (id === 39) return shopSpecificProfiles.coffee;
    // ID 40 has a dedicated hamam procurement profile above; do not fall back to generic service supplies.
    if (id === 41) return shopSpecificProfiles.dryclean;
    // The school sells instruction and training, not retail goods or packaging.
    if (id === 47) return { name:'Beyoğlu Ticaret ve Meslek Mektebi', materials:[], recipes:[], productRules:[] };
    if ([4,21].includes(id)) return businessMaterialProfiles.lodging;
    if ([9,16,32].includes(id)) return businessMaterialProfiles.paper;
    if ([26].includes(id)) return businessMaterialProfiles.textile;
    if ([17].includes(id)) return businessMaterialProfiles.wood;
    if ([20].includes(id)) return businessMaterialProfiles.metal;
    if ([29].includes(id)) return businessMaterialProfiles.soap;
    if ([33].includes(id)) return businessMaterialProfiles.service;
    if ([13,14,18,19,12,25].includes(id)) return businessMaterialProfiles.food;
    if ([10,26].includes(id)) return businessMaterialProfiles.textile;
    // Fail closed instead of assigning unrelated wholesale cartons and packaging
    // to a newly introduced business whose supply chain has not yet been defined.
    return { name:'Tedarik profili tanımlanmamış işletme', materials:[], recipes:[], productRules:[] };
  };
  const getBusinessRecipe = (propertyId, product) => {
    const id = Number(propertyId);
    if (product?.service) return [];
    const key = String((product?.id || '') + ' ' + (product?.name || '')).toLocaleLowerCase('tr-TR');
    // Explicit product-to-supply recipes prevent a shop's entire range from sharing one generic recipe.
    const recipeByProduct = {
      1: [
        {match:/kolonya|parfüm|koku|esans/, recipe:[['bak-koku',1],['bak-cam',1]]},
        {match:/sabun|bakım/, recipe:[['bak-sabun',1],['bak-ambalaj',1]]},
        {match:/konserve|erzak/, recipe:[['bak-erzak',1],['bak-cam',1]]},
        {match:/kahve|kakao/, recipe:[['bak-kahve',1],['bak-cam',1]]},
        {match:/hediye|set/, recipe:[['bak-koku',1],['bak-ambalaj',1]]}
      ],
      7: [
        {match:/şarap|sarap|üzüm|şişe/, recipe:[['sarap-sira',1],['sarap-sise',1]]},
        {match:/erzak|ambar|koli/, recipe:[['sarap-erzak',1],['sarap-etiket',1]]},
        {match:/zeytin|peynir|meze/, recipe:[['sarap-meze',1],['sarap-erzak',1]]}
      ],
      10: [
        {match:/kumaş|kumas|giyim|dikim|giysi|terzi/, recipe:[['konf-kumas',1],['konf-iplik',1]]},
        {match:/ithal|eşya|esya/, recipe:[['konf-ithal',1],['konf-aksesuar',1]]},
        {match:/kitap|kırtasiye|kirtasiye/, recipe:[['konf-kagit',1],['konf-ithal',1]]}
      ],
      12: [
        {match:/kahve|çay|cay/, recipe:[['kahve-cekirdek',1],['kahve-ikram',1]]},
        {match:/tatlı|tatli|şerbet|serbet/, recipe:[['kahve-seker',1],['kahve-surup',1]]},
        {match:/ithal|kakao/, recipe:[['kahve-kakao',1],['kahve-ikram',1]]}
      ],
      13: [
        {match:/ekmek|somun/, recipe:[['fir-un',2],['fir-maya',1]]},
        {match:/poğaça|pogaca|çörek|corek/, recipe:[['fir-un',1],['fir-yag',1]]},
        {match:/tatlı|tatli|şeker|seker/, recipe:[['fir-un',1],['fir-seker',1]]}
      ],
      14: [
        {match:/sakatat|kemik|suyu/, recipe:[['kas-kemik',1],['kas-baharat',1]]},
        {match:/et|kıyma|kiyma|sucuk/, recipe:[['kas-et',1],['kas-kagit',1]]},
        {match:/yağ|yag/, recipe:[['kas-et',1],['kas-yag',1]]}
      ],
      18: [
        {match:/meyve|elma|armut|üzüm|uzum/, recipe:[['man-meyve',1],['man-sepet',1]]},
        {match:/konserve|kurut/, recipe:[['man-meyve',1],['man-kurutma',1]]},
        {match:/sebze|yeşillik|yesillik/, recipe:[['man-sebze',1],['man-sepet',1]]}
      ],
      19: [
        {match:/çorba|corba|ekmek/, recipe:[['lok-tahil',1],['lok-meze',1]]},
        {match:/meze|sıcak|sicak/, recipe:[['lok-meze',1],['lok-baharat',1]]},
        {match:/yemek|günün|gunun|et/, recipe:[['lok-et',1],['lok-yag',1]]}
      ],
      23: [
        {match:/sabun|bakım|bakim/, recipe:[['aktar-sabun',1],['aktar-kavanoz',1]]},
        {match:/yağ|yag|öz|oz/, recipe:[['aktar-yag',1],['aktar-kavanoz',1]]},
        {match:/baharat|ot|aktar/, recipe:[['aktar-ot',1],['aktar-kavanoz',1]]}
      ],
      25: [
        {match:/kahve|çay|cay/, recipe:[['kahve-cekirdek',1],['kahve-ikram',1]]},
        {match:/tatlı|tatli|şerbet|serbet/, recipe:[['kahve-seker',1],['kahve-surup',1]]},
        {match:/ithal|kakao/, recipe:[['kahve-kakao',1],['kahve-ikram',1]]}
      ],
      28: [
        {match:/kolonya|parfüm|parfum|koku|esans/, recipe:[['par-alkol',1],['par-esans',1],['par-cam',1]]},
        {match:/sabun|bakım|bakim/, recipe:[['par-sabun',1],['par-kutu',1]]},
        {match:/hediye|kutu|set/, recipe:[['par-esans',1],['par-kutu',1],['par-cam',1]]},
        {match:/ithal|konserve|erzak/, recipe:[['bak-erzak',1],['bak-cam',1]]}
      ],
      41: [
        {match:/takım|takim|palto|kaban|temizleme/, recipe:[['dry-solvent',1],['dry-steam',1]]},
        {match:/ipek|hassas|kumaş|kumas/, recipe:[['dry-solvent',1],['dry-care',1]]},
        {match:/ütü|utu|paket/, recipe:[['dry-steam',1],['dry-wrap',1]]}
      ],
      34: [
        {match:/saksı|saksi|toprak|gübre|gubre/, recipe:[['cicek-saksi',1],['cicek-yesillik',1]]},
        {match:/çelenk|tören|toren|aranjman/, recipe:[['cicek-taze',5],['cicek-tel',1],['cicek-yesillik',2]]},
        {match:/gül|gul|demet|buket|çiçek|cicek/, recipe:[['cicek-taze',3],['cicek-yesillik',1],['cicek-kagit',1]]}
      ],
      31: [
        {match:/çorba|corba|ekmek/, recipe:[['lok-tahil',1],['lok-meze',1]]},
        {match:/meze|sıcak|sicak/, recipe:[['lok-meze',1],['lok-baharat',1]]},
        {match:/yemek|günün|gunun|et/, recipe:[['lok-et',1],['lok-yag',1]]}
      ]
    };
    const profile = getBusinessProfile(propertyId);
    if (!profile.materials?.length || !profile.recipes?.length) return [];
    const customRule = profile.productRules?.find(entry => entry.match.test(key));
    if (customRule && customRule.recipe.every(([materialId, qty]) => profile.materials.some(material => material.id === materialId) && qty > 0)) {
      return customRule.recipe.map(([materialId, qty]) => ({ id: materialId, qty }));
    }
    const validMaterialIds = new Set(profile.materials.map(material => material.id));
    const specific = (recipeByProduct[id] || []).find(entry => entry.match.test(key));
    if (specific && specific.recipe.every(([materialId, qty]) => validMaterialIds.has(materialId) && qty > 0)) return specific.recipe.map(([materialId, qty]) => ({ id: materialId, qty }));
    const recipe = profile.recipes[Math.min(4, Math.max(0, (Number(product?.unlockLevel) || 1) - 1))] || profile.recipes[0];
    return [{id:recipe[0],qty:recipe[1]},{id:recipe[2],qty:recipe[3]}];
  };
  const getBusinessRecipeCost = (propertyId, product) => {
    if (!product || product.service) return 0;
    const profile = getBusinessProfile(propertyId);
    return Math.round(getBusinessRecipe(propertyId, product).reduce((sum, part) => {
      const material = profile.materials.find(item => item.id === part.id);
      return sum + (material ? material.cost / material.batch * part.qty : 0);
    }, 0) * 100) / 100;
  };
  const getUnlockedBusinessMaterials = (propertyId, level = getBusinessSalesLevel(propertyId), product = null) => {
    const profile = getBusinessProfile(propertyId);
    const professionalOffice = [42, 43, 44, 45, 46].includes(Number(propertyId));
    const products = (tradeCatalog[propertyId] || []).filter(item => (!professionalOffice || !item.service) && item.price > 0 && (item.unlockLevel || 1) <= level && isPlayerProductUnlocked(item));
    const recipeMaterialIds = new Set();
    products.forEach(item => getBusinessRecipe(propertyId, item).forEach(part => recipeMaterialIds.add(part.id)));
    // Keep the supply list tied to the recipes of products this business can actually make.
    return profile.materials.filter(material => recipeMaterialIds.has(material.id));
  };
  // Keep production goods at a modest, sustainable gross margin of roughly 28%.
  // Catalog prices remain the minimum floor for established retail/luxury goods.
  const getBusinessSalePrice = (propertyId, product) => {
    if (!product) return 0;
    if (product.service) return Math.round((Number(product.price) || 0) * 100) / 100;
    const recipeCost = getBusinessRecipeCost(propertyId, product);
    return Math.round(Math.max(Number(product.price) || 0, recipeCost * 1.38) * 100) / 100;
  };

  const profession = professionOptions.find(p => p.id === professionId) || professionOptions.find(p => p.id === 'amele');
  const active = properties.find(p => p.id === selected) || properties[0];
  const universityCourseBranches = [
    { id:'accounting', name:'Ticari Muhasebe ve Defter Tutma', profession:'matbaaci', baseCost:1200, baseHours:48, baseRep:5, requiredHours:0, requiredRep:0, detail:'Esnaf defteri, kasa mutabakatı, vergi kayıtları ve ticari finans.' },
    { id:'engineering', name:'Yapı Keşfi ve Teknik Çizim', profession:'demirci', baseCost:1500, baseHours:60, baseRep:6, requiredHours:8, requiredRep:0, detail:'Metraj, teknik çizim, malzeme hesabı ve saha kontrolü.' },
    { id:'law', name:'Hukuk Usulü ve Dava Takibi', profession:'avukat', baseCost:1800, baseHours:72, baseRep:8, requiredHours:15, requiredRep:3, detail:'Dilekçe, delil, duruşma ve dosya yönetimi.' },
    { id:'medical', name:'Klinik Uygulamalar ve Hasta Bakımı', profession:'doktor', baseCost:2200, baseHours:96, baseRep:8, requiredHours:20, requiredRep:5, detail:'Klinik uygulama, hasta güvenliği ve kayıt disiplini.' },
    { id:'pharmacy', name:'Eczacılık ve İlaç Hazırlama', profession:'eczaci', baseCost:2000, baseHours:84, baseRep:8, requiredHours:24, requiredRep:5, detail:'İlaç hazırlama, reçete okuma ve eczane kayıtları.' },
    { id:'medicine', name:'Hekimlik Esasları ve Klinik Pratik', profession:'doktor', baseCost:2600, baseHours:120, baseRep:10, requiredHours:35, requiredRep:10, detail:'Klinik değerlendirme, hasta takibi ve ileri uygulamalar.' }
  ];
  const universityCourses = universityCourseBranches.flatMap(branch => Array.from({ length:10 }, (_, index) => {
    const level = index + 1;
    const previousId = level === 1 ? null : branch.id + '-level-' + (level - 1);
    const id = level === 1 ? branch.id : branch.id + '-level-' + level;
    return {
      id, branchId:branch.id, level, previousId,
      name:branch.name + ' · Seviye ' + level,
      profession:branch.profession,
      cost:Math.round(branch.baseCost * Math.pow(level, 1.42)),
      hours:Math.round(branch.baseHours * (1 + (level - 1) * 0.38)),
      rep:Math.min(20, branch.baseRep + Math.floor((level - 1) * 1.5)),
      requiredHours:branch.requiredHours + (level - 1) * 8,
      requiredRep:branch.requiredRep + (level - 1) * 2,
      detail:branch.detail + ' Seviye ' + level + ': ileri vaka ve uygulamalar.',
      wageBonus:0.005
    };
  }));
  const startUniversityCourse = course => {
    if (enrolledCourse) { tell('Devam eden eğitimin var. Önce onu tamamlamalısın.'); return; }
    if (careerHours < (course.requiredHours || 0) || careerReputation < (course.requiredRep || 0)) { tell('Bu eğitime erişmek için önce meslek deneyimi ve itibar kazanmalısın.'); return; }
    if (course.previousId && !certificates.some(c => c.id === course.previousId)) { tell('Bu seviyeye kaydolmak için önce aynı dalın bir önceki seviyesini tamamlamalısın.'); return; }
    if (certificates.some(c => c.id === course.id)) { tell('Bu sertifikayı zaten aldın.'); return; }
    if (cash < course.cost) { tell('Eğitim ücreti için ₺' + course.cost + ' gerekiyor.'); return; }
    setCash(v => Math.round((v - course.cost) * 100) / 100);
    setEnrolledCourse({ ...course, startedAt: gameHourIndex(), endsAt: gameHourIndex() + course.hours });
    tell(course.name + ' başladı. Tamamlamak için ' + course.hours + ' oyun saati gerekiyor.');
  };
  const claimUniversityCertificate = () => {
    if (!enrolledCourse || gameHourIndex() < enrolledCourse.endsAt) { tell('Eğitim henüz tamamlanmadı. Derslere devam et.'); return; }
    setCertificates(old => [...old, { id: enrolledCourse.id, branchId: enrolledCourse.branchId || enrolledCourse.id, level: enrolledCourse.level || 1, name: enrolledCourse.name, profession: enrolledCourse.profession, wageBonus: enrolledCourse.wageBonus || 0.005, earnedAt: gameHourIndex() }]);
    setCareerReputation(old => Math.min(100, old + enrolledCourse.rep));
    tell('Sertifika alındı: ' + enrolledCourse.name + '. Mesleki itibar +' + enrolledCourse.rep + '; kalıcı saatlik kazanç bonusu +%0,5.');
    setEnrolledCourse(null);
  };
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
        hour, day, month, year, workHours, careerHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, businessStats, autoSupplyByProperty, pendingProductions, orders, ordersDateKey, dailyTasks, dailyTasksDateKey, eventChain, log: log.slice(0, 5)
      }));
    } catch {
      // The game remains playable if browser storage is disabled or full.
    }
  }, [playerName, steps, cash, owned, rented, unitOwners, unitRented, buildingLevels, selected, showPortfolio, professionId, marketValues, hour, day, month, year, workHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, businessStats, autoSupplyByProperty, pendingProductions, orders, ordersDateKey, dailyTasks, dailyTasksDateKey, eventChain, log]);

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
          if (state.autoSupplyByProperty && typeof state.autoSupplyByProperty === 'object') setAutoSupplyByProperty(state.autoSupplyByProperty);
          if (state.businessStats && typeof state.businessStats === 'object') setBusinessStats(state.businessStats);
          if (state.pendingProductions && typeof state.pendingProductions === 'object') setPendingProductions(state.pendingProductions);
          if (Array.isArray(state.orders)) setOrders(state.orders);
          if (typeof state.ordersDateKey === 'string') setOrdersDateKey(state.ordersDateKey);
          if (Array.isArray(state.dailyTasks)) setDailyTasks(state.dailyTasks);
          if (typeof state.dailyTasksDateKey === 'string') setDailyTasksDateKey(state.dailyTasksDateKey);
          if (state.eventChain && typeof state.eventChain === 'object') setEventChain(state.eventChain);
          if (Number.isFinite(Number(state.experience))) setExperience(Math.max(0, Number(state.experience) || 0));
          if (Array.isArray(state.log)) setLog(state.log.slice(0, 5));
          if (state.developments && typeof state.developments === 'object') setDevelopments(state.developments);
        } else {
          const initialState = { version: 2, economyVersion: STARTER_ECONOMY_VERSION, playerName: displayName, steps, cash: STARTING_CASH, owned: [], rented, selected, showPortfolio, professionId, marketValues, hour, day, month, year, workHours, careerHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, businessStats, autoSupplyByProperty, pendingProductions, orders, ordersDateKey, dailyTasks, dailyTasksDateKey, experience, careerReputation, enrolledCourse, certificates, log: log.slice(0, 5), developments };
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
      businessStats, autoSupplyByProperty, pendingProductions, orders, ordersDateKey, dailyTasks, dailyTasksDateKey, eventChain, experience, dailySalesLog, dailySalesRevenue, careerReputation, enrolledCourse, certificates, log: log.slice(0, 5), developments
    };
    supabase.from('player_saves').upsert({ user_id: session.user.id, state, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .then(({ error }) => { if (error) setMultiplayerStatus('Kayıt eşitlenemedi · ' + error.message); });
  }, [session?.user?.id, supabase, cloudReady, playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues, hour, day, month, year, workHours, careerHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, businessStats, autoSupplyByProperty, pendingProductions, orders, ordersDateKey, dailyTasks, dailyTasksDateKey, eventChain, experience, dailySalesLog, dailySalesRevenue, careerReputation, enrolledCourse, certificates, log, developments]);


  const tell = (text) => {
    setNotice(text);
    setNoticeId(v => v + 1);
    setLog(old => [{ id: Date.now(), text }, ...old].slice(0, 5));
  };

  const gameHourIndex = (y = year, m = month, d = day, h = hour) => (((y * 12 + (m - 1)) * 30 + (d - 1)) * 24 + h);
  const currentGameDateKey = year + '-' + month + '-' + day;
  const updateDailyTask = (taskId, amount = 1) => setDailyTasks(old => old.map(task => task.id === taskId && !task.claimed ? { ...task, progress: Math.min(task.target, (Number(task.progress) || 0) + amount) } : task));
  const makeDailyTasks = () => [
    { id: 'produce', title: 'Üretim hattını çalıştır', detail: 'Üretim kuyruğuna toplam 3 ürün ekle.', target: 3, progress: 0, reward: 55, xp: 15, claimed: false },
    { id: 'sell-products', title: 'Tezgâhı boş bırakma', detail: 'İşletmelerinde toplam 5 ürün sat.', target: 5, progress: 0, reward: 70, xp: 18, claimed: false },
    { id: 'accept-orders', title: 'Yeni müşteri kazan', detail: '2 müşteri siparişini kabul et.', target: 2, progress: 0, reward: 45, xp: 12, claimed: false },
    { id: 'deliver-order', title: 'Sözünü tut', detail: 'Bir müşteri siparişini teslim et.', target: 1, progress: 0, reward: 85, xp: 25, claimed: false }
  ];
  const createDailyOrders = () => {
    const candidates = owned.filter(id => !rented.includes(id) && (tradeCatalog[id] || []).some(product => product.price > 0 && !product.service && (product.unlockLevel || 1) <= getBusinessSalesLevel(id) && isPlayerProductUnlocked(product)));
    const ordersForDay = [];
    candidates.forEach(propertyId => {
      const catalog = (tradeCatalog[propertyId] || []).filter(product => product.price > 0 && !product.service && (product.unlockLevel || 1) <= getBusinessSalesLevel(propertyId) && isPlayerProductUnlocked(product));
      if (!catalog.length) return;
      const product = catalog[Math.floor(Math.random() * catalog.length)];
      const quantity = 2 + Math.floor(Math.random() * 4);
      const reward = Math.round(getBusinessSalePrice(propertyId, product) * quantity * (1.12 + Math.random() * 0.18));
      ordersForDay.push({ id: currentGameDateKey + ':' + propertyId + ':' + product.id + ':' + ordersForDay.length, propertyId, productId: product.id, productName: product.name, propertyName: properties.find(p => p.id === propertyId)?.name || 'İşletme', quantity, reward, createdAt: gameHourIndex(), expiresAt: gameHourIndex() + 8 + Math.floor(Math.random() * 17), status: 'available' });
    });
    // Time-limited event orders: extra rewards for preparing stock before a neighborhood fair.
    const fairActive = month >= 1 && month <= 12 && day >= 8 && day <= 14;
    if (fairActive) {
      const eventCandidates = candidates.flatMap(propertyId => {
        const property = properties.find(p => p.id === propertyId);
        const propertyName = property?.name || '';
        const catalog = (tradeCatalog[propertyId] || []).filter(product =>
          product.price > 0 && !product.service && (product.unlockLevel || 1) <= getBusinessSalesLevel(propertyId) && isPlayerProductUnlocked(product)
        );
        const eligible = catalog.filter(product => {
          const text = (product.id || '') + ' ' + (product.name || '') + ' ' + propertyName;
          return /pastane|fırın|firin|unlu mamul|börek|borek|çiçekçi|cicekci|çiçek|cicek|buket|kahvehane|kahve|kafe|gazino|lokanta/i.test(text);
        });
        return eligible.map(product => ({ propertyId, property, product }));
      });
      eventCandidates.sort(() => Math.random() - 0.5).slice(0, 2).forEach(({propertyId, property, product}, index) => {
        const quantity = 3 + Math.floor(Math.random() * 4);
        const base = getBusinessSalePrice(propertyId, product) * quantity;
        const reward = Math.round(base * (1.45 + Math.random() * 0.25));
        ordersForDay.push({
          id: currentGameDateKey + ':fair:' + propertyId + ':' + product.id + ':' + index,
          propertyId, productId: product.id, productName: product.name,
          propertyName: property?.name || 'İşletme', quantity, reward,
          createdAt: gameHourIndex(), expiresAt: gameHourIndex() + 8 + Math.floor(Math.random() * 9),
          status: 'available', eventOrder: true, eventName: 'Mahalle Şenliği'
        });
      });
    }
    // Level 3, 5 and 7 unlock one extra daily offer each (up to eight).
    const offerLimit = Math.min(8, 5 + Math.floor(Math.max(0, playerLevel - 1) / 2));
    return ordersForDay.sort(() => Math.random() - 0.5).slice(0, offerLimit);
  };
  useEffect(() => {
    const hasOrderEligibleBusiness = owned.some(id => !rented.includes(id) && (tradeCatalog[id] || []).some(product => product.price > 0 && (product.unlockLevel || 1) <= getBusinessSalesLevel(id) && isPlayerProductUnlocked(product)));
    if (ordersDateKey !== currentGameDateKey) {
      // Keep accepted orders alive across the in-game day boundary; their own expiry
      // clock decides when they fail. Refresh only the unaccepted daily offers.
      const now = gameHourIndex();
      setOrders(old => {
        const activeAccepted = old.filter(order =>
          order.status === 'accepted' && Number(order.expiresAt) > now
        );
        return [...activeAccepted, ...createDailyOrders()];
      });
      setOrdersDateKey(currentGameDateKey);
    } else if (orders.length === 0 && hasOrderEligibleBusiness) {
      setOrders(createDailyOrders());
      setOrdersDateKey(currentGameDateKey);
    }
    if (dailyTasksDateKey !== currentGameDateKey) {
      setDailyTasks(makeDailyTasks());
      setDailyTasksDateKey(currentGameDateKey);
    }
  }, [currentGameDateKey, owned, rented, ordersDateKey, orders.length, dailyTasksDateKey]);
  useEffect(() => {
    const now = gameHourIndex();
    setOrders(old => {
      let changed = false;
      const next = old.map(order => {
        if ((order.status === 'available' || order.status === 'accepted') && Number(order.expiresAt) <= now) { changed = true; return { ...order, status: 'expired' }; }
        return order;
      });
      return changed ? next : old;
    });
  }, [year, month, day, hour]);
  const eventPeriodKey = year + '-' + month;
  useEffect(() => {
    if (day >= 8 && day <= 14 && eventChain.periodKey !== eventPeriodKey) {
      setEventChain({ periodKey: eventPeriodKey, deliveries: 0, claimedMilestones: [] });
    }
  }, [eventPeriodKey, day, eventChain.periodKey]);
  const openOrderProduction = (order) => {
    if (!order || !owned.includes(order.propertyId) || rented.includes(order.propertyId)) {
      tell('Bu sipariş için önce ilgili işletmenin sahibi olmalısın.');
      return;
    }
    setSelected(order.propertyId);
    setBusinessPlans(oldPlans => ({ ...oldPlans, [order.propertyId]: order.productId }));
    setFocusedOrderId(order.id);
    setProductionBatch(String(Math.min(10, Math.max(1, Number(order.quantity) - getProductStock(order.propertyId, order.productId)))));
    setActiveHudPanel('business');
    const ready = getProductStock(order.propertyId, order.productId);
    tell(order.productName + ' üretim ekranı açıldı. Sipariş için ' + Math.max(0, Number(order.quantity) - ready) + ' adet daha gerekiyor; doğru ürün seçildi.');
  };
  const acceptCustomerOrder = (orderId) => {
    const order = orders.find(item => item.id === orderId);
    if (!order || order.status !== 'available') return;
    setOrders(old => old.map(item => item.id === orderId ? { ...item, status: 'accepted' } : item));
    updateDailyTask('accept-orders', 1);
    tell('Sipariş kabul edildi: ' + order.quantity + ' adet ' + order.productName + '. Teslim süresini kaçırma.');
  };
  const deliverCustomerOrder = (orderId) => {
    const order = orders.find(item => item.id === orderId);
    if (!order || order.status !== 'accepted') return;
    if (!owned.includes(order.propertyId) || rented.includes(order.propertyId)) { tell('Siparişi teslim etmek için ilgili işletmenin sahibi olmalı ve işletme kirada olmamalı.'); return; }
    const stock = getProductStock(order.propertyId, order.productId);
    if (stock < order.quantity) { tell('Yeterli hazır ürün yok. Gerekli: ' + order.quantity + ', depoda: ' + stock + '.'); return; }
    setStockByProperty(old => {
      const inventory = getInventoryState(order.propertyId, old[order.propertyId]);
      return { ...old, [order.propertyId]: { materials: inventory.materials, products: { ...inventory.products, [order.productId]: Math.max(0, stock - order.quantity) } } };
    });
    setCash(old => Math.round((old + order.reward) * 100) / 100);
    setBusinessStats(old => {
      const stats = old[order.propertyId] || {};
      const productStats = stats.productUnitsSold || {};
      const itemStats = productStats[order.productId] || {};
      return { ...old, [order.propertyId]: { ...stats, unitsSold: (Number(stats.unitsSold) || 0) + order.quantity, revenue: Math.round(((Number(stats.revenue) || 0) + order.reward) * 100) / 100, productUnitsSold: { ...productStats, [order.productId]: { ...itemStats, units: (Number(itemStats.units) || 0) + order.quantity, revenue: Math.round(((Number(itemStats.revenue) || 0) + order.reward) * 100) / 100 } } } };
    });
    setOrders(old => old.map(item => item.id === orderId ? { ...item, status: 'completed' } : item));
    updateDailyTask('deliver-order', 1);
    if (order.eventOrder) {
      const nextDeliveries = (eventChain.periodKey === eventPeriodKey ? Number(eventChain.deliveries) || 0 : 0) + 1;
      const milestones = [1, 2, 3];
      const milestoneRewards = { 1: 100, 2: 200, 3: 400 };
      const reached = milestones.find(step => step === nextDeliveries && !(eventChain.periodKey === eventPeriodKey && (eventChain.claimedMilestones || []).includes(step)));
      setEventChain({ periodKey: eventPeriodKey, deliveries: nextDeliveries, claimedMilestones: [...(eventChain.periodKey === eventPeriodKey ? eventChain.claimedMilestones || [] : []), ...(reached ? [reached] : [])] });
      if (reached) {
        const bonus = milestoneRewards[reached];
        setCash(oldCash => Math.round((oldCash + bonus) * 100) / 100);
        const bonusXp = reached * 10;
        setExperience(oldXp => Math.max(0, Number(oldXp) || 0) + bonusXp);
        tell('Mahalle Şenliği zinciri: ' + reached + '/3 aşama! Ek ödül +₺' + bonus + ' ve ' + bonusXp + ' XP.');
      } else {
        tell('Etkinlik siparişi teslim edildi. Şenlik zinciri: ' + Math.min(3, nextDeliveries) + '/3 aşama.');
      }
    } else {
      tell('Sipariş teslim edildi: ' + order.quantity + ' adet ' + order.productName + '. Ödül +₺' + order.reward.toLocaleString('tr-TR') + '.');
    }
  };
  const claimDailyTask = (taskId) => {
    const task = dailyTasks.find(item => item.id === taskId);
    if (!task || task.progress < task.target || task.claimed) return;
    setCash(old => Math.round((old + task.reward) * 100) / 100);
    const previousExperience = Math.max(0, Number(experience) || 0);
    const gainedExperience = Math.max(0, Number(task.xp) || 0);
    const previousLevel = 1 + Math.floor(previousExperience / 100);
    const nextExperience = previousExperience + gainedExperience;
    const nextLevel = 1 + Math.floor(nextExperience / 100);
    setExperience(nextExperience);
    setDailyTasks(old => old.map(item => item.id === taskId ? { ...item, claimed: true } : item));
    tell('Günlük görev tamamlandı: ' + task.title + '. Ödül +₺' + task.reward + ' ve ' + gainedExperience + ' XP.' + (nextLevel > previousLevel ? ' SEVİYE ATLADIN! Artık ' + nextLevel + '. seviyedesin.' : ''));
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
      const dailyRent = Math.round((properties.filter(p => owned.includes(p.id) && rented.includes(p.id)).reduce((sum, p) => sum + Number(p.rent || 0) / 30, 0) + Object.entries(unitRented).reduce((sum, [key, activeRent]) => { if (!activeRent) return sum; const [pid] = key.split(':'); const p = properties.find(item => item.id === Number(pid)); const unitOwner = unitOwners[key]; return sum + (p && unitOwner?.playerId === playerId ? Number(p.rent || 0) / (p.units || 1) / 30 : 0); }, 0)) * 100) / 100;
      const dryCleanOwned = owned.includes(41) && !rented.includes(41);
      let dryCleanDelta = 0;
      let dryCleanNews = '';
      if (dryCleanOwned) {
        // High, irregular fictional profits are balanced by a real risk of costly raids.
        const roll = Math.random();
        if (roll < 0.17) {
          dryCleanDelta = Math.round(250 + Math.random() * 1750);
          dryCleanNews = ` Pera Buharlı Kuru Temizleme'de olağan dışı nakit tahsilatı: +₺${dryCleanDelta.toLocaleString('tr-TR')}! Bu kazanç şüpheleri de artırıyor.`;
          setBusinessAlert({ type: 'windfall', title: 'Beklenmedik Nakit!', amount: dryCleanDelta, message: 'Pera Buharlı Kuru Temizleme’de olağan dışı bir nakit tahsilatı gerçekleşti. Kazanç kasana eklendi; ancak şüphe seviyesi de yükseliyor.' });
        } else if (roll > 0.91) {
          dryCleanDelta = -Math.round(450 + Math.random() * 3550);
          dryCleanNews = ` KURU TEMİZLEMEYE BASKIN! Kayıt dışı işlemler tespit edildi; ceza ve el koyma toplamı -₺${Math.abs(dryCleanDelta).toLocaleString('tr-TR')}.`;
          setBusinessAlert({ type: 'raid', title: 'KURU TEMİZLEMEYE BASKIN!', amount: dryCleanDelta, message: 'Denetim ekipleri kayıt dışı işlemleri tespit etti. Ceza ve el koyma bedeli kasandan düşüldü.' });
        }
      }
      const reportRows = [...dailySalesLog];
      if (business.entries.length) reportRows.push(...business.entries.map(text => ({ text, kind: 'daily' })));
      const daySalesRevenue = Math.max(0, Number(dailySalesRevenue) || 0);
      setZReport({ date: `${day}.${String(month).padStart(2, '0')}.${year}`, nextDate: `${nextDay}.${String(nextMonth).padStart(2, '0')}.${nextMonthRaw > 12 ? year + 1 : year}`, rows: reportRows, totalRevenue: daySalesRevenue, costs: Number(dailyCost) || 0, rent: Number(dailyRent) || 0, net: Number(dailyRent + daySalesRevenue - dailyCost + dryCleanDelta) || 0, dryCleanDelta });
      setDailySalesLog([]);
      setDailySalesRevenue(0);
      const dailyNet = dailyRent + business.revenue - dailyCost + dryCleanDelta;
      setCash(v => Math.round((v + dailyNet) * 100) / 100);
      setDay(nextDay);
      setMonth(nextMonth);
      const nextYear = nextMonthRaw > 12 ? year + 1 : year;
      if (nextDayRaw > 30) updateMarketValues(nextYear, nextMonth);
      if (nextMonthRaw > 12) setYear(v => v + 1);
      setHour(6);
      setWorkHours(0);
      tell(`Yeni gün başladı. Kira +₺${dailyRent.toFixed(2)}, gün içi işletme satışları kasaya işlendi, yaşam ve bakım -₺${(DAILY_LIVING_COST + maintenance).toFixed(2)}, işletme gideri -₺${business.costs.toFixed(2)}; net ₺${dailyNet.toFixed(2)}.${business.entries.length ? ' ' + business.entries.slice(0, 3).join(' · ') : ''}${dryCleanNews}`);
      return;
    }
    const isWorkingHour = hour >= 8 && hour < 19;
    const hourlySales = isWorkingHour ? processBusinessSales(1) : { revenue: 0, entries: [], salesByProperty: {}, stockChanges: {} };
    const unitsSoldThisHour = Object.values(hourlySales.salesByProperty || {}).reduce((sum, sale) => sum + (Number(sale.units) || 0), 0);
    if (unitsSoldThisHour > 0) updateDailyTask('sell-products', unitsSoldThisHour);
    if (hourlySales.stockoutAlerts?.length) {
      const alert = hourlySales.stockoutAlerts[0];
      tell('STOK BİTTİ: ' + alert.propertyName + ' — ' + alert.productName + '. Yeniden üretim yap.');
    }
    if (hourlySales.entries.length) setDailySalesLog(old => [...old, ...hourlySales.entries.map(text => ({ text, kind: 'sale' }))].slice(-80));
    if (hourlySales.revenue > 0) setDailySalesRevenue(old => Math.round(((Number(old) || 0) + hourlySales.revenue) * 100) / 100);
    // Optional auto-replenishment: when selected product stock falls to 2 or fewer units,
    // top up enough ingredients for a small batch and enqueue production if budget/storage allow.
    const autoStockChanges = { ...hourlySales.stockChanges };
    const autoPendingChanges = { ...pendingProductions };
    const autoStatsChanges = {};
    let autoCashSpent = 0;
    const autoNotes = [];
    owned.forEach(propertyId => {
      if (!autoSupplyByProperty[propertyId] || rented.includes(propertyId)) return;
      const products = (tradeCatalog[propertyId] || []).filter(product => (product.unlockLevel || 1) <= getBusinessSalesLevel(propertyId) && isPlayerProductUnlocked(product));
      const product = products.find(item => item.id === businessPlans[propertyId]) || products[0];
      if (!product || product.service || !getBusinessRecipe(propertyId, product).length) return;
      const inventory = getInventoryState(propertyId, autoStockChanges[propertyId] || stockByProperty[propertyId]);
      const pendingKey = propertyId + ':' + product.id;
      const pending = autoPendingChanges[pendingKey];
      const readyStock = Math.max(0, Number(inventory.products?.[product.id]) || 0);
      if (readyStock + (Number(pending?.units) || 0) > 2) return;
      const profile = getBusinessProfile(propertyId);
      const recipe = getBusinessRecipe(propertyId, product);
      const unlocked = new Set(getUnlockedBusinessMaterials(propertyId).map(item => item.id));
      const capacity = getMaterialCapacity(propertyId);
      const currentRaw = Object.entries(inventory.materials || {}).reduce((sum,[id,amount]) => sum + (unlocked.has(id) ? Math.max(0,Number(amount)||0) : 0),0);
      const productSpace = Math.max(0,getStockCapacity(propertyId)-getTotalStock(propertyId, inventory)-getPendingUnits(propertyId));
      const batch = Math.min(5, productSpace);
      if (batch <= 0) return;
      const deficits = recipe.map(part => {
        const material = profile.materials.find(item => item.id === part.id);
        const have = Math.max(0,Number(inventory.materials?.[part.id])||0);
        return { ...part, material, missing: Math.max(0,part.qty*batch-have) };
      }).filter(part => part.missing > 0);
      if (deficits.some(part => !part.material || !unlocked.has(part.id))) return;
      if (currentRaw + deficits.reduce((sum,part)=>sum+part.missing,0) > capacity) return;
      const cost = Math.round(deficits.reduce((sum,part)=>sum+part.material.cost*part.missing/part.material.batch,0)*100)/100;
      if (cash - autoCashSpent < cost) return;
      const nextMaterials = { ...(inventory.materials || {}) };
      deficits.forEach(part => { nextMaterials[part.id]=(Number(nextMaterials[part.id])||0)+part.missing; });
      recipe.forEach(part => { nextMaterials[part.id]=(Number(nextMaterials[part.id])||0)-part.qty*batch; });
      autoCashSpent += cost;
      const now = Date.now();
      const duration = getProductionDuration(propertyId, product.id);
      const existingUnits = Number(pending?.units) || 0;
      const readyAt = existingUnits > 0 ? (Number(pending.readyAt) || now + duration) : now + duration;
      const finishAt = (existingUnits > 0 ? Math.max(now,Number(pending.finishAt)||Number(pending.readyAt)||now) : now) + duration*batch;
      autoPendingChanges[pendingKey] = { units: existingUnits+batch, readyAt, finishAt, duration, name: product.name, propertyId, productId: product.id };
      autoStockChanges[propertyId] = { materials: nextMaterials, products: inventory.products || {} };
      const previous = businessStats[propertyId] || { unitsSold: 0, revenue: 0, stockInvested: 0 };
      autoStatsChanges[propertyId] = { ...previous, stockInvested: Math.round(((Number(previous.stockInvested)||0)+cost)*100)/100 };
      autoNotes.push(propertyId);
    });
    if (autoCashSpent > 0) {
      setCash(value => Math.round((value-autoCashSpent)*100)/100);
      setStockByProperty(old => ({ ...old, ...autoStockChanges }));
      setPendingProductions(autoPendingChanges);
      setBusinessStats(old => ({ ...old, ...autoStatsChanges }));
      if (autoNotes.length) tell('Otomatik tedarik ve üretim kuyruğu: ' + autoNotes.map(id => properties.find(item => item.id === id)?.name || 'İşletme').join(', ') + '. Gider ₺' + autoCashSpent.toLocaleString('tr-TR') + '.');
    } else if (Object.keys(hourlySales.salesByProperty).length) setStockByProperty(old => ({ ...old, ...hourlySales.stockChanges }));
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
        const educationBonus = certificates.reduce((sum, certificate) => sum + (Number(certificate.wageBonus) || 0.005), 0);
        const wage = Math.round(profession.gross * (1 + educationBonus) * variance * 100) / 100;
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
    // Seven-day recurring neighborhood fair: players can prepare inventory before demand spikes.
    if (day >= 8 && day <= 14) {
      events.push({ id: 'neighborhood-fair', name: 'Mahalle Şenliği', detail: 'Yedi gün süren mahalle şenliğinde pastane, fırın, kahvehane, çiçekçi ve eğlence yerlerinde talep yükseliyor. Eczane dışındaki sakin ve uzmanlaşmış dükkânlarda müşteri trafiği bir miktar düşüyor; yüksek talep stok yoksa satışa dönüşmez.', effect: (p, product) => {
        const propertyName = p?.name || '';
        const productText = (product?.id || '') + ' ' + (product?.name || '');
        const bakery = /pastane|fırın|firin|unlu mamul|börek|borek/i.test(propertyName + ' ' + productText);
        const flowers = /çiçek|cicek|buket|çiçekçi|cicekci/i.test(propertyName + ' ' + productText);
        const cafe = /kahvehane|kahve|kafe|lokanta|gazino|meyhane|restoran/i.test(propertyName);
        const entertainment = isEntertainment(p);
        const pharmacy = isPharmacy(p);
        const winner = bakery || flowers || cafe || entertainment;
        if (pharmacy) return { sales: 0.94, chance: 0.94 };
        return winner
          ? { sales: bakery ? 1.75 : flowers ? 1.65 : 1.4, chance: bakery || flowers ? 1.45 : 1.28 }
          : { sales: 0.9, chance: 0.9 };
      } });
    }
    // Multi-day cultural and neighborhood events create distinct winners and losers.
    if (month === 10 && day >= 12 && day <= 16) {
      events.push({ id: 'beyoglu-film-festival', name: 'Beyoğlu Film Festivali', detail: 'Beş gün süren film gösterimleri ve gece seansları çevredeki gazino, kahvehane, lokanta ve kitapçılara ziyaretçi çekiyor; bazı sakin sokaklarda gürültü artıyor.', effect: (p, product) => {
        const entertainment = isEntertainment(p);
        const food = isFood(product);
        const books = isBookshop(p) || /kitap|sinema|film|dergi/i.test((product?.id || '') + ' ' + (product?.name || ''));
        const busy = entertainment || food || books;
        return { sales: busy ? (entertainment ? 1.55 : food ? 1.32 : 1.25) : 0.94, chance: entertainment ? 1.35 : busy ? 1.16 : 0.94 };
      } });
    }
    if (month === 4 && day >= 10 && day <= 14) {
      events.push({ id: 'beyoglu-book-days', name: 'Beyoğlu Kitap Günleri', detail: 'Pasajlarda düzenlenen kitap günleri kitabevleri ve kırtasiyeleri canlandırıyor; yeme-içme trafiği de bir miktar artıyor.', effect: (p, product) => {
        const books = isBookshop(p) || /kitap|defter|kalem|kırtasiye|kirtasiye/i.test((product?.id || '') + ' ' + (product?.name || ''));
        return { sales: books ? 1.65 : isFood(product) ? 1.12 : 0.96, chance: books ? 1.4 : 1.02 };
      } });
    }
    if (month === 6 && day >= 20 && day <= 23) {
      events.push({ id: 'street-music-week', name: 'Sokak Müzikleri Haftası', detail: 'Meydandaki açık hava konserleri kahvehane, gazino ve lokantalara müşteri getiriyor; bazı dükkânlarda kalabalık nedeniyle alışveriş zorlaşıyor.', effect: (p, product) => {
        const entertainment = isEntertainment(p);
        return { sales: entertainment ? 1.42 : isFood(product) ? 1.22 : 0.92, chance: entertainment ? 1.25 : isFood(product) ? 1.12 : 0.95 };
      } });
    }
    if (month === 3 && day >= 5 && day <= 7) {
      events.push({ id: 'spring-flower-market', name: 'Bahar Çiçek Pazarı', detail: 'Üç günlük çiçek pazarı çiçekçi ve bahçıvanları hareketlendiriyor; meydan çevresindeki geçişler kalabalıklaşıyor.', effect: (p, product) => {
        const flowers = /cicek|çiçek|buket|gul-demeti|saksi-cicegi/i.test((p?.name || '') + ' ' + (product?.id || '') + ' ' + (product?.name || ''));
        return { sales: flowers ? 1.85 : isFood(product) ? 1.08 : 0.96, chance: flowers ? 1.55 : 1.02 };
      } });
    }
    return events;
  };
  const getEconomicEventEffect = (property, product) => activeEconomicEvents().reduce((total, event) => {
    const effect = event.effect(property, product);
    return { sales: total.sales * effect.sales, chance: total.chance * effect.chance };
  }, { sales: 1, chance: 1 });

  const getBusinessSalesLevel = (propertyId) => {
    const sold = Number(businessStats[propertyId]?.unitsSold) || 0;
    const thresholds = [0, 5, 15, 35, 60, 100, 150, 220, 310, 430, 580, 760, 980, 1250, 1600];
    let level = 1;
    for (let index = 1; index < thresholds.length; index++) { if (sold >= thresholds[index]) level = index + 1; else break; }
    return Math.min(15, level);
  };
  // Global player progression complements each shop's own sales-based mastery.
  // Catalog tiers 1–2 stay accessible early; tiers 3–5 require player levels 2–4.
  const getPlayerUnlockLevel = (item) => Math.max(1, Number(item?.playerUnlockLevel) || Math.max(1, (Number(item?.unlockLevel) || 1) - 1));
  const isPlayerProductUnlocked = (item) => getPlayerUnlockLevel(item) <= playerLevel;
  const STOCK_CAPACITY_BY_LEVEL = [0, 24, 40, 60, 90, 130, 175, 230, 300, 380, 480, 600, 740, 900, 1100, 1350];
  const STOCK_UPGRADE_COST_BY_LEVEL = [0, 0, 35, 80, 160, 300, 550, 950, 1600, 2600, 4100, 6400, 9800, 15000, 23000, 35000];
  const getInventoryState = (propertyId, value = stockByProperty[propertyId]) => {
    if (value && typeof value === 'object') return { materials: value.materials || {}, products: value.products || {} };
    const qty = Math.max(0, Number(value) || 0);
    const legacyProduct = businessPlans[propertyId] || (tradeCatalog[propertyId] || []).find(item => item.price > 0)?.id;
    return { products: legacyProduct && qty ? { [legacyProduct]: qty } : {} };
  };
  const getProductStock = (propertyId, productId, value = stockByProperty[propertyId]) => Math.max(0, Number(getInventoryState(propertyId, value).products?.[productId]) || 0);
  const getTotalStock = (propertyId, value = stockByProperty[propertyId]) => Object.values(getInventoryState(propertyId, value).products || {}).reduce((sum, qty) => sum + Math.max(0, Number(qty) || 0), 0);
  const getProductionDuration = (propertyId, productId) => { const seed = String(productId || propertyId).split('').reduce((sum, char) => sum + char.charCodeAt(0), Number(propertyId) || 0); return 2500 + (seed % 6) * 1000; };
  const getPendingUnits = (propertyId) => Object.entries(pendingProductions).reduce((sum, [key, job]) => Number(key.split(':')[0]) === Number(propertyId) ? sum + (Number(job.units) || 0) : sum, 0);
  const getWarehouseLevel = (propertyId) => Math.max(1, Math.min(15, Number(businessStats[propertyId]?.stockCapacityLevel) || 1));
  const getWarehouseProfileKey = (propertyId) => {
    const id = Number(propertyId);
    if (id === 37) return 'shoe';
    const propertyName = String(properties.find(property => property.id === id)?.name || '').toLocaleLowerCase('tr-TR');
    if ([35,38].includes(id) || /meyhane|meyhaneci|taverna|gazino/.test(propertyName)) return 'food';
    if ([4,21].includes(id)) return 'lodging';
    if (id === 15) return 'pharmacy';
    if ([13,14,18,19,12,25].includes(id)) return 'food';
    if ([10,26].includes(id)) return 'textile';
    if ([9,16,32].includes(id)) return 'paper';
    if (id === 17) return 'wood';
    if (id === 20) return 'metal';
    if (id === 29) return 'soap';
    if (id === 33) return 'service';
    return 'general';
  };
  // Each business has its own warehouse. Raw materials and finished goods have separate,
  // property-specific capacities; neither inventory is shared between businesses.
  const MATERIAL_WAREHOUSE_BASE = { shoe: 36, lodging: 40, pharmacy: 36, food: 48, textile: 36, paper: 48, wood: 36, metal: 30, soap: 36, service: 30, general: 40 };
  const PRODUCT_WAREHOUSE_BASE = { shoe: 24, lodging: 20, pharmacy: 24, food: 30, textile: 24, paper: 36, wood: 24, metal: 20, soap: 24, service: 18, general: 30 };
  const WAREHOUSE_LEVEL_MULTIPLIER = [0, 1, 1.55, 2.25, 3.15, 4.3, 5.7, 7.4, 9.5, 12, 15, 18.5, 22.5, 27, 32.5, 39];
  const getMaterialCapacity = (propertyId) => Math.round((MATERIAL_WAREHOUSE_BASE[getWarehouseProfileKey(propertyId)] || 40) * WAREHOUSE_LEVEL_MULTIPLIER[getWarehouseLevel(propertyId)]);
  const getStockCapacity = (propertyId) => Math.round((PRODUCT_WAREHOUSE_BASE[getWarehouseProfileKey(propertyId)] || 30) * WAREHOUSE_LEVEL_MULTIPLIER[getWarehouseLevel(propertyId)]);
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
          const stock = Math.max(0, Number(products[product.id]) || 0);
          const soldBefore = Number(businessStats[propertyId]?.productUnitsSold?.[product.id]?.units) || 0;
          const reputation = Math.min(100, Math.floor(soldBefore * 1.5));
          const eventEffect = getEconomicEventEffect(property, product);
          const salesChance = Math.min(0.92, (0.34 + (reputation / 100) * 0.12) * eventEffect.chance);
          if ((!serviceSale && stock <= 0) || Math.random() > salesChance) return;
          const sold = serviceSale ? 1 : Math.min(stock, 1 + (Math.random() > 0.72 ? 1 : 0));
          const baseMultiplier = 1;
          const masteryLevel = soldBefore >= 60 ? 5 : soldBefore >= 35 ? 4 : soldBefore >= 15 ? 3 : soldBefore >= 5 ? 2 : 1;
          const salePrice = getBusinessSalePrice(propertyId, product);
          const takings = Math.round(sold * salePrice * (1 + (masteryLevel - 1) * 0.02) * eventEffect.sales * 100) / 100;
          if (!serviceSale) products[product.id] = stock - sold;
          addSale(propertyId, product.id, sold, takings, property.name + ': ' + sold + ' adet ' + product.name + ' satıldı (+₺' + takings.toFixed(2) + ')');
        });
        localStocks[propertyId] = { ...inventory, products };
      });
    }
    const stockoutAlerts = [];
    Object.entries(salesByProperty).forEach(([propertyId, sale]) => {
      const property = properties.find(item => item.id === Number(propertyId));
      Object.entries(sale.products || {}).forEach(([productId]) => {
        const before = getProductStock(Number(propertyId), productId, stockByProperty[propertyId]);
        const after = getProductStock(Number(propertyId), productId, localStocks[propertyId]);
        if (before > 0 && after <= 0) {
          const product = Number(propertyId) === 37
            ? SHOE_RECIPES.find(item => item.id === productId)
            : (tradeCatalog[propertyId] || []).find(item => item.id === productId);
          stockoutAlerts.push({ propertyId: Number(propertyId), productId, propertyName: property?.name || 'İşletme', productName: product?.name || productId });
        }
      });
    });
    const officialFees = Object.entries(salesByProperty).reduce((sum, [propertyId, sale]) => {
      if (![42,43,44,45,46].includes(Number(propertyId))) return sum;
      return sum + Object.entries(sale.products || {}).reduce((subtotal, [productId, itemSale]) => {
        const product = (tradeCatalog[Number(propertyId)] || []).find(item => item.id === productId);
        return subtotal + (product?.service ? Number(itemSale.revenue || 0) * 0.04 : 0);
      }, 0);
    }, 0);
    const roundedOfficialFees = Math.round(officialFees * 100) / 100;
    const officialFeeEntries = roundedOfficialFees > 0 ? [`Mesleki hizmetlerden damga vergisi ve işlem harcı (%4) -₺${roundedOfficialFees.toFixed(2)}`] : [];
    return { revenue: Math.round(revenue * 100) / 100, officialFees: roundedOfficialFees, officialFeeEntries, entries, salesByProperty, stockChanges: localStocks, stockoutAlerts };
  };

  const settleDailyBusinesses = () => {
    let operatingCosts = 0;
    const entries = [];
    const professionalFees = {42:1.2,43:1.4,44:1.5,45:1.1,46:1.0};
    owned.forEach(propertyId => {
      if (rented.includes(propertyId) || !professionalFees[propertyId]) return;
      const property = properties.find(item => item.id === propertyId);
      if (!property) return;
      const fee = professionalFees[propertyId];
      operatingCosts += fee;
      entries.push(`${property.name}: ruhsat, kayıt ve mesleki evrak gideri -₺${fee.toFixed(2)}`);
    });
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
    if (sales.stockoutAlerts?.length) {
      const alert = sales.stockoutAlerts[0];
      tell('STOK BİTTİ: ' + alert.propertyName + ' — ' + alert.productName + '. Yeniden üretim yap.');
    }
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
    const rent = Math.round((properties.filter(p => owned.includes(p.id) && rented.includes(p.id)).reduce((sum, p) => sum + Number(p.rent || 0) / 30, 0) + Object.entries(unitRented).reduce((sum, [key, activeRent]) => { if (!activeRent) return sum; const [pid] = key.split(':'); const p = properties.find(item => item.id === Number(pid)); const unitOwner = unitOwners[key]; return sum + (p && unitOwner?.playerId === playerId ? Number(p.rent || 0) / (p.units || 1) / 30 : 0); }, 0)) * 100) / 100;
    const totalCosts = upkeep + sales.officialFees;
    const net = rent + business.revenue + sales.revenue - totalCosts;
    const reportRows = [...dailySalesLog, ...sales.entries.map(text => ({ text, kind: 'sale' })), ...business.entries.map(text => ({ text, kind: 'daily' }))];
    setZReport({ date: `${day}.${String(month).padStart(2, '0')}.${year}`, nextDate: `${nextDay}.${String(nextMonth).padStart(2, '0')}.${nextMonthRaw > 12 ? year + 1 : year}`, rows: [...reportRows, ...sales.officialFeeEntries.map(text => ({ text, kind: 'daily' }))], totalRevenue: Math.round(((Number(dailySalesRevenue) || 0) + sales.revenue + business.revenue) * 100) / 100, costs: totalCosts, rent, net });
    setDailySalesLog([]);
    setDailySalesRevenue(0);
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
    const item = (tradeCatalog[active.id] || []).find(product => product.id === plan);
    tell(item?.service ? `${active.name}: ${item.name} hizmeti seçildi. Ürün stoğu ve hammadde gerekmez; müşteri talebi geldikçe hizmet geliri oluşur.` : `${active.name}: satış grubu ${item?.name || 'seçilmedi'} olarak ayarlandı. Satış için ayrıca stok almalısın.`);
  };

  const workAtSelectedBusiness = () => {
    if (!owned.includes(active.id) || rented.includes(active.id)) {
      tell('Bir işletmeyi bizzat yönetmek için sahibi olmalı ve kiraya vermemiş olmalısın.');
      return;
    }
    if (hour < 8 || hour >= 19) { tell('Dükkanda çalışmak için mesai saatlerini beklemelisin (08.00–19.00).'); return; }
    const item = (tradeCatalog[active.id] || []).find(product => product.id === businessPlans[active.id]);
    if (!item || item.price <= 0) { tell('Önce işletmenin ürün veya hizmet grubunu seç.'); return; }
    tell(`${active.name}: ${item.name} işine bizzat odaklandın. Gelirin stoklu satışlardan ve müşteri talebinden oluşur; meslek seçimin işletme sahipliğini sınırlamaz.`);
    setClockRunning(false); advanceHour(true); setClockRunning(false);
  };

  const buyShoeMaterial = (materialId) => {
    if (!owned.includes(37) || rented.includes(37)) { tell('Hammadde almak için kunduracı sana ait olmalı ve kirada olmamalı.'); return; }
    const material = SHOE_MATERIALS.find(item => item.id === materialId); if (!material) return;
    const shoeState = stockByProperty[37] && typeof stockByProperty[37] === 'object' ? stockByProperty[37] : { materials: {}, products: {} };
    const materialStock = Math.max(0, Number(shoeState.materials?.[material.id]) || 0);
    const capacity = getMaterialCapacity(37);
    const totalRawStock = SHOE_MATERIALS.reduce((sum, item) => sum + Math.max(0, Number(shoeState.materials?.[item.id]) || 0), 0);
    const freeCapacity = Math.max(0, capacity - totalRawStock);
    const quantity = Math.min(material.batch, freeCapacity);
    if (quantity <= 0) { tell('Bu işletmenin hammadde deposu dolu (' + totalRawStock + '/' + capacity + ' birim). Üretim yaparak yer açabilir veya depoyu genişletebilirsin.'); return; }
    const cost = Math.round(material.cost * quantity / material.batch * 100) / 100;
    if (cash < cost) { tell(material.name + ' için ₺' + cost + ' gerekiyor.'); return; }
    setCash(v => Math.round((v - cost) * 100) / 100);
    setStockByProperty(old => { const state = old[37] && typeof old[37] === 'object' ? old[37] : { materials: {}, products: {} }; return { ...old, 37: { materials: { ...(state.materials || {}), [material.id]: (Number(state.materials?.[material.id]) || 0) + quantity }, products: state.products || {} } }; });
    setBusinessStats(old => { const prev = old[37] || { unitsSold: 0, revenue: 0, stockInvested: 0 }; return { ...old, 37: { ...prev, stockInvested: Math.round((prev.stockInvested + cost) * 100) / 100 } }; });
    tell('Tedarik tamamlandı: ' + material.name + ' +' + quantity + ' birim. Maliyet ₺' + cost + '.');
  };
  const craftShoe = (shoeId, requestedBatch = productionBatch) => {
    if (!owned.includes(37) || rented.includes(37)) { tell('Üretim için kunduracı sana ait olmalı ve kirada olmamalı.'); return; }
    const shoe = SHOE_RECIPES.find(item => item.id === shoeId); if (!shoe) return;
    const level = getBusinessSalesLevel(37);
    if ((shoe.unlockLevel || 1) > level) { tell(shoe.name + ' için kunduracı seviyesi ' + shoe.unlockLevel + ' gerekli. Şu an seviye ' + level + '.'); return; }
    if (!isPlayerProductUnlocked(shoe)) { tell(shoe.name + ' kilitli. Oyuncu seviyesi ' + getPlayerUnlockLevel(shoe) + ' olduğunda açılacak.'); return; }
    const state = stockByProperty[37] && typeof stockByProperty[37] === 'object' ? stockByProperty[37] : { materials: {}, products: {} };
    const materials = state.materials || {};
    const materialLimit = Object.entries(shoe.recipe).reduce((limit, [id, qty]) => Math.min(limit, Math.floor((Number(materials[id]) || 0) / qty)), Infinity);
    const productCapacity = Math.max(0, getStockCapacity(37) - getTotalStock(37) - getPendingUnits(37));
    const requested = requestedBatch === 'max' ? Math.min(materialLimit, productCapacity) : Math.max(1, Number(requestedBatch) || 1);
    const quantity = Math.min(requested, materialLimit, productCapacity);
    if (quantity <= 0) {
      if (productCapacity <= 0) tell('Vitrin deposu dolu. Satış oldukça yer açılır veya depo genişletilebilir.');
      else tell('Hammadde yetersiz: ' + Object.entries(shoe.recipe).filter(([id, qty]) => (Number(materials[id]) || 0) < qty).map(([id, qty]) => (SHOE_MATERIALS.find(m => m.id === id)?.name || id) + ' ×' + Math.max(0, qty - (Number(materials[id]) || 0))).join(', '));
      return;
    }
    if (quantity < requested) tell('Hammadde veya vitrin kapasitesi nedeniyle ' + quantity + ' çift üretim kuyruğa alınacak.');
    const next = { ...materials };
    Object.entries(shoe.recipe).forEach(([id, qty]) => { next[id] = (Number(next[id]) || 0) - qty * quantity; });
    const pendingKey = '37:' + shoe.id;
    const duration = getProductionDuration(37, shoe.id);
    const existingJob = pendingProductions[pendingKey];
    const now = Date.now();
    const existingUnits = Number(existingJob?.units) || 0;
    const firstReadyAt = existingUnits > 0 ? (Number(existingJob.readyAt) || now + duration) : now + duration;
    const previousFinish = existingUnits > 0 ? Math.max(now, Number(existingJob.finishAt) || Number(existingJob.readyAt) || now) : now;
    const completionAt = previousFinish + duration * quantity;
    setStockByProperty(old => { const current = old[37] && typeof old[37] === 'object' ? old[37] : { materials: {}, products: {} }; return { ...old, 37: { materials: next, products: current.products || {} } }; });
    setPendingProductions(old => {
      const current = old[pendingKey]; const currentUnits = Number(current?.units) || 0;
      return { ...old, [pendingKey]: { units: currentUnits + quantity, readyAt: currentUnits > 0 ? (Number(current.readyAt) || firstReadyAt) : firstReadyAt, finishAt: completionAt, duration, name: shoe.name, propertyId: 37, productId: shoe.id } };
    });
    updateDailyTask('produce', quantity);

    tell((existingUnits > 0 ? 'Üretim kuyruğuna eklendi: ' : 'Üretim başladı: ') + shoe.name + ' ×' + quantity + '. İlk çift yaklaşık ' + Math.max(1, Math.ceil((firstReadyAt - now) / 1000)) + ' saniye içinde hazır olacak.');
  };

  const upgradeBusinessStorage = (propertyId) => {
    if (sendAction('upgradeBusinessStorage', propertyId)) return;
    if (!owned.includes(propertyId) || rented.includes(propertyId)) { tell('Depoyu genişletmek için işletme sana ait olmalı ve kirada olmamalı.'); return; }
    const stats = businessStats[propertyId] || { unitsSold: 0, stockCapacityLevel: 1 };
    const currentLevel = Math.max(1, Math.min(15, Number(stats.stockCapacityLevel) || 1));
    const businessLevel = getBusinessSalesLevel(propertyId);
    if (currentLevel >= 15) { tell('Depo en yüksek seviye olan 15. kademede.'); return; }
    if (businessLevel < currentLevel + 1) { tell('Sonraki depo seviyesi için işletme seviyen ' + (currentLevel + 1) + ' olmalı. Şu an ' + businessLevel + '. seviyedesin. Daha fazla ürün sat.'); return; }
    const nextLevel = currentLevel + 1;
    const cost = STOCK_UPGRADE_COST_BY_LEVEL[nextLevel];
    if (cash < cost) { tell('Depo genişletmek için ₺' + cost + ' gerekiyor.'); return; }
    setCash(value => Math.round((value - cost) * 100) / 100);
    setBusinessStats(old => { const prev = old[propertyId] || { unitsSold: 0, revenue: 0, stockInvested: 0 }; return { ...old, [propertyId]: { ...prev, stockCapacityLevel: nextLevel, storageUpgradeSpent: (Number(prev.storageUpgradeSpent) || 0) + cost } }; });
    tell('Depo genişletildi: seviye ' + nextLevel + '/15. Hammadde kapasitesi ' + getMaterialCapacity(propertyId) + ', ürün kapasitesi ' + getStockCapacity(propertyId) + ' birim oldu. Ödenen: ₺' + cost.toLocaleString('tr-TR') + '.');
  };

  const buyBusinessMaterial = (propertyId, materialId) => {
    if (!owned.includes(propertyId) || rented.includes(propertyId)) { tell('Hammadde tedariki için işletmenin sahibi olmalı ve kiraya vermemiş olmalısın.'); return; }
    const profile = getBusinessProfile(propertyId);
    const material = profile.materials.find(item => item.id === materialId);
    if (!material) return;
    const inventory = getInventoryState(propertyId);
    const current = Math.max(0, Number(inventory.materials?.[materialId]) || 0);
    const capacity = getMaterialCapacity(propertyId);
    const validMaterialIds = new Set(getUnlockedBusinessMaterials(propertyId).map(item => item.id));
    const totalRawStock = Object.entries(inventory.materials || {}).reduce((sum, [id, amount]) => sum + (validMaterialIds.has(id) ? Math.max(0, Number(amount) || 0) : 0), 0);
    const quantity = Math.min(material.batch, Math.max(0, capacity - totalRawStock));
    if (quantity <= 0) { tell('Hammadde deposu dolu. Depoyu genişlet veya üretim yap.'); return; }
    const cost = Math.round(material.cost * quantity / material.batch * 100) / 100;
    if (cash < cost) { tell(material.name + ' tedariki için ₺' + cost + ' gerekiyor.'); return; }
    setCash(value => Math.round((value - cost) * 100) / 100);
    setStockByProperty(old => { const state = getInventoryState(propertyId, old[propertyId]); return { ...old, [propertyId]: { materials: { ...state.materials, [materialId]: current + quantity }, products: state.products } }; });
    setBusinessStats(old => { const previous = old[propertyId] || { unitsSold: 0, revenue: 0, stockInvested: 0 }; return { ...old, [propertyId]: { ...previous, stockInvested: Math.round(((Number(previous.stockInvested)||0) + cost)*100)/100 } }; });
    tell('Tedarik tamamlandı: ' + material.name + ' +' + quantity + ' birim, ₺' + cost + '.');
  };
  const buyRecipeMaterials = (propertyId, product, requestedBatch = productionBatch) => {
    if (!product) return;
    if (!owned.includes(propertyId) || rented.includes(propertyId)) { tell('Toplu tedarik için işletmenin sahibi olmalı ve kiraya vermemiş olmalısın.'); return; }
    const profile = getBusinessProfile(propertyId);
    const recipe = getBusinessRecipe(propertyId, product);
    const inventory = getInventoryState(propertyId);
    const unlocked = new Set(getUnlockedBusinessMaterials(propertyId, getBusinessSalesLevel(propertyId), product).map(item => item.id));
    const capacity = getMaterialCapacity(propertyId);
    const currentTotal = Object.entries(inventory.materials || {}).reduce((sum,[id,amount]) => sum + (unlocked.has(id) ? Math.max(0,Number(amount)||0) : 0),0);
    const freeCapacity = Math.max(0,capacity-currentTotal);
    const productCapacity = Math.max(0,getStockCapacity(propertyId)-getTotalStock(propertyId)-getPendingUnits(propertyId));
    const batch = requestedBatch === 'max' ? productCapacity : Math.min(Math.max(1,Number(requestedBatch)||1),productCapacity);
    if (batch <= 0) { tell('Hazır ürün deposunda yer yok. Önce satış bekle veya ürün deposunu genişlet.'); return; }
    const deficits = recipe.map(part => {
      const material = profile.materials.find(item => item.id === part.id);
      const have = Math.max(0,Number(inventory.materials?.[part.id])||0);
      return { ...part, material, missing: Math.max(0,part.qty*batch-have) };
    }).filter(part => part.missing > 0);
    if (!deficits.length) { tell('Seçili üretim miktarı (' + batch + ') için gerekli tüm hammaddeler hazır. Doğrudan üretime başlayabilirsin.'); return; }
    if (deficits.some(part => !part.material || !unlocked.has(part.id))) { tell('Bu ürün için gereken hammaddelerden bazıları henüz açılmamış.'); return; }
    const neededSpace = deficits.reduce((sum,part)=>sum+part.missing,0);
    if (neededSpace > freeCapacity) { tell('Bu parti için ' + neededSpace + ' birim boş hammadde alanı gerekiyor; depoda yalnızca ' + freeCapacity + ' birim yer var. Üretim partisini küçült veya depoyu genişlet.'); return; }
    const totalCost = Math.round(deficits.reduce((sum,part)=>sum+part.material.cost*part.missing/part.material.batch,0)*100)/100;
    if (cash < totalCost) { tell('Seçili ' + batch + ' adetlik üretim için toplu tedarik ₺'+totalCost.toLocaleString('tr-TR')+' tutuyor; bakiyen ₺'+cash.toLocaleString('tr-TR')+'. Üretim partisini küçült veya para biriktir.'); return; }
    const nextMaterials = { ...(inventory.materials||{}) };
    deficits.forEach(part => { nextMaterials[part.id]=(Number(nextMaterials[part.id])||0)+part.missing; });
    setCash(value=>Math.round((value-totalCost)*100)/100);
    setStockByProperty(old=>{ const state=getInventoryState(propertyId,old[propertyId]); return {...old,[propertyId]:{materials:nextMaterials,products:state.products}}; });
    setBusinessStats(old=>{const previous=old[propertyId]||{unitsSold:0,revenue:0,stockInvested:0};return {...old,[propertyId]:{...previous,stockInvested:Math.round(((Number(previous.stockInvested)||0)+totalCost)*100)/100}};});
    tell('Toplu tedarik tamamlandı: '+deficits.map(part=>part.material.name+' +'+part.missing).join(', ')+'. Toplam ₺'+totalCost.toLocaleString('tr-TR')+'. Üretime geçebilirsin.');
  };

  const stockBusiness = () => {
    if (sendAction('stockBusiness')) return;
    const propertyId = active.id;
    const availableProducts = (tradeCatalog[propertyId] || []).filter(product => (product.unlockLevel || 1) <= getBusinessSalesLevel(propertyId) && isPlayerProductUnlocked(product));
    const item = availableProducts.find(product => product.id === businessPlans[propertyId]) || availableProducts[0];
    if (!owned.includes(propertyId) || rented.includes(propertyId)) { tell('İşletmeyi yönetmek için sahibi olmalı ve kiraya vermemiş olmalısın.'); return; }
    if (!item || item.price <= 0) { tell('Önce satışa sunacağın ürün veya hizmeti seç.'); return; }
    const level = getBusinessSalesLevel(propertyId);
    if ((item.unlockLevel || 1) > level) { tell(item.name + ' için işletme seviyesi ' + item.unlockLevel + ' gerekli. Şu an seviye ' + level + '.'); return; }
    if (!isPlayerProductUnlocked(item)) { tell(item.name + ' kilitli. Oyuncu seviyesi ' + getPlayerUnlockLevel(item) + ' olduğunda açılacak.'); return; }
    const inventory = getInventoryState(propertyId);
    const recipe = getBusinessRecipe(propertyId, item);
    const materialLimit = recipe.reduce((limit, part) => Math.min(limit, Math.floor((Number(inventory.materials?.[part.id]) || 0) / part.qty)), Infinity);
    const capacity = getStockCapacity(propertyId);
    const capacityLimit = Math.max(0, capacity - getTotalStock(propertyId) - getPendingUnits(propertyId));
    const requested = productionBatch === 'max' ? Math.min(materialLimit, capacityLimit) : Math.max(1, Number(productionBatch) || 1);
    const quantity = Math.min(requested, materialLimit, capacityLimit);
    if (quantity <= 0) {
      if (capacityLimit <= 0) tell('Ürün deposu dolu. Satış yapıldıkça yer açılır veya depo yükseltilebilir.');
      else tell('Hammadde yetersiz. Üretim için gereken miktarları aşağıdan tedarik et.');
      return;
    }
    if (quantity < requested) tell('Depo veya hammadde sınırı nedeniyle ' + quantity + ' adet üretim kuyruğa alınıyor.');
    const nextMaterials = { ...inventory.materials };
    recipe.forEach(part => { nextMaterials[part.id] = (Number(nextMaterials[part.id]) || 0) - part.qty * quantity; });
    const pendingKey = propertyId + ':' + item.id;
    const duration = getProductionDuration(propertyId, item.id);
    const existingJob = pendingProductions[pendingKey];
    const now = Date.now();
    const existingUnits = Number(existingJob?.units) || 0;
    const firstReadyAt = existingUnits > 0 ? (Number(existingJob.readyAt) || now + duration) : now + duration;
    const previousFinish = existingUnits > 0 ? Math.max(now, Number(existingJob.finishAt) || Number(existingJob.readyAt) || now) : now;
    const completionAt = previousFinish + duration * quantity;
    setStockByProperty(old => { const state = getInventoryState(propertyId, old[propertyId]); return { ...old, [propertyId]: { materials: nextMaterials, products: state.products } }; });
    setPendingProductions(old => {
      const current = old[pendingKey];
      const currentUnits = Number(current?.units) || 0;
      return { ...old, [pendingKey]: { units: currentUnits + quantity, readyAt: currentUnits > 0 ? (Number(current.readyAt) || firstReadyAt) : firstReadyAt, finishAt: completionAt, duration, name: item.name, propertyId, productId: item.id } };
    });
    updateDailyTask('produce', quantity);

    tell((existingUnits > 0 ? 'Üretim kuyruğuna eklendi: ' : 'Üretim başladı: ') + item.name + ' ×' + quantity + '. İlk ürün yaklaşık ' + Math.max(1, Math.ceil((firstReadyAt - now) / 1000)) + ' sn içinde hazır.');
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
        const { data, error } = await supabase.rpc('release_property', { p_property_id: property.id, p_market_value: getMarketValue(property), p_current_cash: cash });
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
    tell(`${active.name} kiraya verildi. Günlük kira: ₺${(active.rent / 30).toFixed(2)}. Gelir her oyun gününün sonunda, saat 05.00'ten 06.00'ya geçerken kasaya eklenir.`);
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
  actionRefs.current = { advanceHour, sleepUntilMorning, clockTick: () => advanceHour(false), selectBusinessPlan, stockBusiness, buy, toggleRent, toggleShop, makeWine, resetGame, selectProperty, changeProfession };
  useEffect(() => {
    // Each player has a private calendar and economy, so guests also advance their own clock.
    // Keep the latest callback in actionRefs to avoid stale closures without resetting the timer.
    const timer = window.setInterval(() => {
      try {
        const tick = actionRefs.current.clockTick;
        if (typeof tick === 'function') tick();
      } catch (error) {
        console.error('Mahalle oyun saati ilerletilemedi:', error);
      }
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (multiplayerRole === 'host' && connectionRef.current?.open) connectionRef.current.send({ type: 'world-state', owners: ownerByProperty, marketValues, hostName: playerName.trim() || 'Ev sahibi' });
  }, [multiplayerRole, ownerByProperty, marketValues, playerName]);

  return <main className={'app-shell fullscreen-game ' + (activeHudPanel ? 'hud-open ' + (activeHudPanel === 'social' ? 'hud-social' : 'hud-panel-open hud-panel-' + activeHudPanel) : '')}>
    <header className="topbar hud-topbar">
      <a className="wordmark" href="#" aria-label="Mahalle ana sayfa"><span className="mark">M.</span><span>MAHALLE</span></a>
      <div className="top-center"><span className="live-dot" /> BEYOĞLU · {String(day).padStart(2, '0')} {['OCAK','ŞUBAT','MART','NİSAN','MAYIS','HAZİRAN','TEMMUZ','AĞUSTOS','EYLÜL','EKİM','KASIM','ARALIK'][month - 1]} {year} · {String(hour).padStart(2, '0')}:00</div>
      <div className="top-actions"><button className="reset-button" onClick={resetGame}>YENİ OYUN ↻</button><button className="avatar-button" onClick={() => setShowPortfolio(v => !v)} aria-label="Portföyü aç">CC</button></div>
    </header>

    <button type="button" className="hud-cash" aria-label="Cepteki sermaye ayrıntıları" onClick={() => setActiveHudPanel(activeHudPanel === 'cash' ? null : 'cash')}><span>₺</span><strong>{cash.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</strong><small>{cash > 0 ? 'SERMAYE' : 'SERMAYE BİTTİ'}</small></button>
    <nav className="hud-dock" aria-label="Oyun menüsü">
      <button className={activeHudPanel === 'property' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'property' ? null : 'property')} aria-label="Seçili mülk" title="Mülk"><span>⌂</span><small>MÜLK</small></button>
      <button className={activeHudPanel === 'business' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'business' ? null : 'business')} aria-label="İşletme ve stok" title="İşletme"><span>▤</span><small>İŞLETME</small></button>
      <button className={activeHudPanel === 'goals' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'goals' ? null : 'goals')} aria-label="Gelişim hedefleri" title="Hedefler"><span>◇</span><small>HEDEFLER</small></button>
      <button className={activeHudPanel === 'orders' ? 'active' : ''} onClick={() => setActiveHudPanel(activeHudPanel === 'orders' ? null : 'orders')} aria-label="Siparişler ve görevler" title="Siparişler"><span>▣</span><small>SİPARİŞ</small></button>
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
        <div className="world-topline"><span><span className="live-dot" /> BEYOĞLU MERKEZİ</span><label className="property-finder"><span>⌕</span><input aria-label="Mülk ara ve haritada göster" list="mahalle-property-options" placeholder="Mülk adı yaz..." value={mapSearch} onChange={event => { const value = event.target.value; setMapSearch(value); const match = properties.find(property => property.name.toLocaleLowerCase('tr-TR') === value.trim().toLocaleLowerCase('tr-TR')); if (match) { selectProperty(match.id); setMapSearch(''); } }} /><datalist id="mahalle-property-options">{properties.map(property => <option key={property.id} value={property.name}>{owned.includes(property.id) ? 'Senin mülkün' : 'Satılık'}</option>)}</datalist><small>{properties.length} MÜLK</small></label><span className="world-year">OYUN DÜNYASI <i>·</i> {year}</span></div>
        <CityScene selected={selected} owned={owned} ownerByProperty={ownerByProperty} playerId={playerId} onSelect={selectProperty} onUniversity={() => setActiveHudPanel(v => v === 'university' ? null : 'university')} hour={hour} overlay={<div className="scene-action-card">
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
        {buildingStoryId != null && (() => { const storyProperty = properties.find(item => item.id === buildingStoryId); if (!storyProperty) return null; const storyText = storyProperty.history || storyProperty.style || 'Bu yapı, 1920’lerin Beyoğlu’sunda mahallenin gündelik yaşamının bir parçası.'; return <aside className="building-history-popover" role="status" aria-live="polite"><button className="building-history-close" type="button" aria-label="Bilgilendirmeyi kapat" onClick={() => setBuildingStoryId(null)}>×</button><span className="building-history-kicker">PERA · DÖNEM NOTU</span><h3>{storyProperty.name}</h3><p>{storyText.length > 300 ? storyText.slice(0,297).trimEnd() + '…' : storyText}</p></aside>; })()}
        <div className="map-legend"><span><i className="legend-dot available" /> SATILIK MÜLK</span><span><i className="legend-dot owned" /> SENİN MÜLKÜN</span><span className="map-hint">SÜRÜKLE: DÖNDÜR · KAYDIR: YAKINLAŞ · BİNAYA TIKLA</span></div>
        <div className="world-caption"><span>İSTANBUL / BEYOĞLU</span><span>{String(day).padStart(2, '0')} {['OCAK','ŞUBAT','MART','NİSAN','MAYIS','HAZİRAN','TEMMUZ','AĞUSTOS','EYLÜL','EKİM','KASIM','ARALIK'][month - 1]} {year} <i>·</i> {String(hour).padStart(2, '0')}:00</span></div>
        {activeEconomicEvents().length > 0
          ? <div className="economic-event-banner" role="status"><strong>TAKVİM ETKİNLİĞİ · {activeEconomicEvents().map(event => event.name).join(' + ')}</strong><span>{activeEconomicEvents()[0].detail}</span></div>
          : <div className="economic-event-banner upcoming-event-banner" role="status"><strong>YAKLAŞAN ETKİNLİK · MAHALLE ŞENLİĞİ</strong><span>Her ayın 8–14. günleri. {day < 8 ? 'Başlamasına ' + (8 - day) + ' oyun günü kaldı.' : 'Bir sonraki şenliğe yaklaşık ' + (30 - day + 8) + ' oyun günü kaldı.'} Pastane ve çiçekçi stoklarını önceden hazırla; etkinlikte stok yoksa satış gerçekleşmez.</span></div>}
      </div>

      <aside className={'side-panel hud-side-panel hud-panel-content-' + (activeHudPanel || 'none')} aria-label="Oyun menüsü">
        <section className="orders-panel">
          <div className="card-label">MAHALLE PAZARI · SİPARİŞLER</div><h2>Müşteri talepleri</h2>
          <div className="event-chain-card">
            <div className="event-chain-kicker">SÜRELİ ETKİNLİK · HER AYIN 8–14. GÜNLERİ</div>
            <strong>Mahalle Şenliği: Sipariş Zinciri</strong>
            <p>Şenlik siparişlerini teslim ederek 3 aşamalı zinciri tamamla. Normal sipariş ödülüne ek olarak her aşamada bonus kazanırsın.</p>
            <div className="event-chain-steps">{[1,2,3].map(step => <span key={step} className={(eventChain.periodKey === eventPeriodKey && (eventChain.claimedMilestones || []).includes(step) ? 'done' : '')}>{step === 1 ? '₺100' : step === 2 ? '₺200' : '₺400'}<small>{step * 10} XP</small></span>)}</div>
            <div className="event-chain-progress"><span style={{width: (Math.min(3, eventChain.periodKey === eventPeriodKey ? Number(eventChain.deliveries) || 0 : 0) / 3 * 100) + '%'}} /></div>
            <small>{Math.min(3, eventChain.periodKey === eventPeriodKey ? Number(eventChain.deliveries) || 0 : 0)}/3 şenlik siparişi teslim edildi · {day >= 8 && day <= 14 ? 'Etkinlik devam ediyor' : day < 8 ? 'Etkinlik yakında başlayacak' : 'Etkinlik sona erdi'}</small>
          </div>
          <p className="orders-intro">Siparişi kabul et, ürünleri üret ve süresi dolmadan teslim et.</p>
          {orders.length === 0 && <div className="orders-empty">Bugün uygun sipariş yok. İşletme satın alıp işletmeye başladığında müşteri talepleri burada görünür.</div>}
          {orders.map(order => {
            const stock = getProductStock(order.propertyId, order.productId);
            const hoursLeft = Math.max(0, Number(order.expiresAt) - gameHourIndex());
            const statusLabel = order.status === 'completed' ? 'TESLİM EDİLDİ' : order.status === 'expired' ? 'SÜRESİ DOLDU' : order.status === 'accepted' ? 'KABUL EDİLDİ' : 'YENİ TALEP';
            return <article className={'customer-order-card order-' + order.status} key={order.id}>
              <div className="customer-order-top"><span>{order.propertyName}</span><b className={order.eventOrder ? 'order-kind-event' : ''}>{order.eventOrder ? 'ŞENLİK SİPARİŞİ' : statusLabel}</b></div><h3>{order.productName}</h3>
              {order.eventOrder && <div className="event-order-note"><span>✦</span> Süreli etkinlik · Ek ödül · {Math.max(0, Number(order.expiresAt) - gameHourIndex())} oyun saati kaldı</div>}
              <div className="customer-order-meta"><span>İstenen miktar <strong>{order.quantity} adet</strong></span><span>Hazır stok <strong>{stock} / {order.quantity}</strong></span></div>
              <div className="customer-order-stock-meter"><span style={{width: Math.min(100, stock / Math.max(1, order.quantity) * 100) + '%'}} /></div>
              <div className="customer-order-reward"><strong>₺{Number(order.reward).toLocaleString('tr-TR')}</strong><span>{order.status === 'completed' ? 'Ödül tahsil edildi' : order.status === 'expired' ? 'Süre doldu' : hoursLeft + ' oyun saati kaldı'}</span></div>
              {order.status === 'available' && <button className="stock-button order-primary-button" onClick={() => acceptCustomerOrder(order.id)}>SİPARİŞİ KABUL ET <span>→</span></button>}
              {order.status === 'accepted' && stock < order.quantity && <div className="order-production-hint"><span className="order-production-icon">↗</span><div><strong>Üretim gerekiyor</strong><small>{order.quantity - stock} adet daha hazırla. İşletmenin üretim ekranına doğrudan geçebilirsin.</small></div></div>}
              {order.status === 'accepted' && stock < order.quantity && owned.includes(order.propertyId) && !rented.includes(order.propertyId) && <button className="stock-button order-production-button" onClick={() => openOrderProduction(order)}><span>⚒</span> ÜRETİME GİT <span>↗</span></button>}
              {order.status === 'accepted' && stock >= order.quantity && <button className="stock-button order-primary-button" onClick={() => deliverCustomerOrder(order.id)}>SİPARİŞİ TESLİM ET <span>✓</span></button>}
            </article>;
          })}
        </section>
        <section className="daily-tasks-panel">
          <div className="card-label">GÖREV PANOSU · SEVİYE {playerLevel} · {levelExperience}/100 XP</div><h2>Bugünün hedefleri</h2>
          <div className="daily-xp-track"><div className="daily-xp-copy"><span>SONRAKİ SEVİYE</span><strong>{100 - levelExperience} XP kaldı</strong></div><div className="daily-task-meter"><span style={{width: levelExperience + '%'}} /></div></div>
          <div className="level-unlock-note">{playerLevel < 7 ? 'Seviye ' + (playerLevel < 3 ? 3 : playerLevel < 5 ? 5 : 7) + ' hedefi: ' + (playerLevel < 3 ? 'ek sipariş fırsatı açılır.' : playerLevel < 5 ? 'bir sipariş daha açılır.' : 'en yüksek günlük sipariş sayısına ulaşırsın.') : 'Günlük sipariş kapasitesinin tamamı açıldı.'}</div>
          <p className="orders-intro">Üret, satış yap ve siparişleri tamamla. Ödülleri kendin topla; görevler her oyun günü yenilenir.</p>
          {dailyTasks.map(task => <div className="daily-task-row" key={task.id}>
            <div className="daily-task-head"><strong>{task.title}</strong><span>{Math.min(task.progress,task.target)}/{task.target}</span></div><p>{task.detail}</p>
            <div className="daily-task-meter"><span style={{width: Math.min(100, Math.round(task.progress / task.target * 100)) + '%'}} /></div>
            <div className="daily-task-foot"><span>₺{task.reward} + {task.xp} XP</span><button className="stock-button" onClick={() => claimDailyTask(task.id)} disabled={task.progress < task.target || task.claimed}>{task.claimed ? 'ALINDI' : task.progress < task.target ? 'DEVAM ET' : 'ÖDÜLÜ AL'}</button></div>
          </div>)}
        </section>
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
          <p className="property-description">{active.style}. {active.history ? active.history + " " : ""}Bu taşınmazı alabilir, işletme olarak kullanabilir veya ileride kiraya verebilirsin.</p>
          <div className="property-stats">
            <div><span>Güncel piyasa değeri</span><strong>₺{getMarketValue(active).toLocaleString('tr-TR')}</strong></div>
            <div><span>Günlük kira</span><strong>₺{(active.rent / 30).toFixed(2)}</strong></div><div><span>Yıllık kira potansiyeli</span><strong>₺{(active.rent * 12).toLocaleString('tr-TR')}</strong></div>
            <div><span>Kat sayısı</span><strong>{active.floors} kat</strong></div>
            <div><span>Durum</span><strong className={owned.includes(active.id) ? 'owned-text' : ''}>{!owned.includes(active.id) ? 'SATILIK' : rented.includes(active.id) ? 'KİRADA' : 'PORTFÖYÜNDE'}</strong></div>
          </div>
          {active.type === 'Konut' && active.units ? <div className="unit-market"><div className="card-label">DAİRELER · {active.units} BAĞIMSIZ BÖLÜM</div><p>Bir daireyle başla. Binadaki tüm daireleri toplarsan binayı yenileyip kira potansiyelini artırabilirsin.</p><div className="unit-grid">{Array.from({length:active.units},(_,i)=>{const n=i+1,key=active.id+':'+n,o=unitOwners[key],mine=o?.playerId===playerId,price=Math.round(getMarketValue(active)*1.18/active.units);return <button key={key} className={'unit-tile '+(mine?'unit-mine':o?'unit-taken':'')} onClick={()=>setSelectedUnit(n)}><strong>{n}. daire</strong><small>{o?(o.name+(mine?' · SENİN':' · SATILDI')):'₺'+price.toLocaleString('tr-TR')}</small>{selectedUnit===n?<span>SEÇİLİ</span>:null}</button>})}</div><div className="unit-action"><span>Seçili daire: {selectedUnit} · Günlük kira potansiyeli ₺{(active.rent/active.units/30).toFixed(2)}</span>{!unitOwners[active.id+':'+selectedUnit] ? <button className="buy-button" onClick={buy}>DAİREYİ SATIN AL</button> : unitOwners[active.id+':'+selectedUnit].playerId===playerId ? <button className="rent-button" onClick={()=>{const k=active.id+':'+selectedUnit;setUnitRented(old=>({...old,[k]:!old[k]}));tell(unitRented[k]?'Dairenin kiralaması durduruldu.':'Daire kiraya verildi. Kira geliri göstergesi güncellendi.');}}>{unitRented[active.id+':'+selectedUnit]?'KİRAYI DURDUR':'DAİREYİ KİRAYA VER'}</button>:null}</div>{Array.from({length:active.units},(_,i)=>i+1).every(n=>unitOwners[active.id+':'+n]?.playerId===playerId)&&<div className="building-upgrade"><strong>BİNANIN TAMAMI SENİN</strong><p>Seviye {Number(buildingLevels[active.id])||1} · tüm dairelerin sahibi olduğun için binayı yenileyebilirsin.</p><button className="buy-button" onClick={()=>{const lv=Number(buildingLevels[active.id])||1,cost=Math.round(getMarketValue(active)*(0.2+lv*0.12));if(lv>=5){tell('Bina en yüksek seviyede.');return;}if(cash<cost){tell('Yenileme için ₺'+cost.toLocaleString('tr-TR')+' gerekiyor.');return;}setCash(v=>v-cost);setBuildingLevels(old=>({...old,[active.id]:lv+1}));setMarketValues(old=>({...old,[active.id]:Math.round(getMarketValue(active)*1.15*100)/100}));tell('Bina yenilendi: seviye '+(lv+1)+'. Değeri yükseldi.');}}>BİNAYI YENİLE · ₺{Math.round(getMarketValue(active)*((Number(buildingLevels[active.id])||1)*0.12+0.2)).toLocaleString('tr-TR')}</button></div>}</div> : !ownerByProperty[active.id] && <button className={owned.includes(active.id) ? 'buy-button is-owned' : 'buy-button'} onClick={buy} disabled={owned.includes(active.id)}>{owned.includes(active.id) ? 'MÜLK SENİN' : 'MÜLKÜ SATIN AL'} <span>{owned.includes(active.id) ? '✓' : '↗'}</span></button>}
          {ownerByProperty[active.id] && ownerByProperty[active.id].playerId !== playerId && <><button className="buy-button" onClick={() => { setOfferPriceInput(String(getMarketValue(active))); setOfferComposerOpen(v => !v); }}>SATIN ALMA TEKLİFİ GÖNDER <span>↗</span></button>{offerComposerOpen && <div className="offer-composer"><label>Teklifin (₺)<input type="number" min="1" value={offerPriceInput} onChange={e => setOfferPriceInput(e.target.value)} /></label><small>Piyasa değeri: ₺{getMarketValue(active).toLocaleString('tr-TR')}</small><button onClick={sendOffer}>TEKLİFİ GÖNDER</button></div>}</>}
          {owned.includes(active.id) && <button className="rent-button" onClick={toggleRent}>{rented.includes(active.id) ? 'KİRACIYI ÇIKAR' : 'KİRACI BUL VE KİRAYA VER'}</button>}
          {owned.includes(active.id) && <button className="sell-button" onClick={sellProperty}>MÜLKÜ SAT · ₺{Math.round(getMarketValue(active) * 0.95).toLocaleString('tr-TR')}</button>}
          {active.id === 37 && owned.includes(37) && !rented.includes(37) && (() => {
            const state = stockByProperty[37] && typeof stockByProperty[37] === 'object' ? stockByProperty[37] : { materials: {}, products: {} };
            const materials = state.materials || {}; const products = state.products || {};
            return <div className="business-plan production-console shoe-workshop"><div className="production-console-head"><div><span className="card-label">ÜRETİM ATÖLYESİ</span><h3>Kunduracı</h3><p>Ürünü seç, gerekli hammaddeleri tedarik et ve üretimi sıraya koy. Her çift için malzemeler üretim başında depodan düşer.</p></div><div className="production-level-chip"><strong>SEV. {getBusinessSalesLevel(37)}/5</strong><small>{Math.max(0, [0,5,15,35,60][getBusinessSalesLevel(37)] - (Number(businessStats[37]?.unitsSold)||0))} satışla seviye atla</small></div></div>
              <div className="storage-upgrade-panel"><div><span>DEPO SEVİYESİ {Number(businessStats[37]?.stockCapacityLevel) || 1}/15</span><strong>Ürün başına {getStockCapacity(37)} birim kapasite</strong><small>İşletme seviyesi {getBusinessSalesLevel(37)} · satış yaptıkça yeni depo kademeleri açılır.</small></div><button className="stock-button" onClick={() => upgradeBusinessStorage(37)} disabled={(Number(businessStats[37]?.stockCapacityLevel) || 1) >= 15 || getBusinessSalesLevel(37) < (Number(businessStats[37]?.stockCapacityLevel) || 1) + 1}>GENİŞLET · ₺{STOCK_UPGRADE_COST_BY_LEVEL[(Number(businessStats[37]?.stockCapacityLevel) || 1) + 1] || '—'}</button></div>
              <div className="shoe-inventory-summary production-quick-stats">
                <div><span>HAMMADDE</span><strong>{SHOE_MATERIALS.reduce((sum,m)=>sum+(Number(materials[m.id])||0),0)} / {getMaterialCapacity(37)}</strong><small>birim depoda</small></div>
                <div><span>ÜRETİMDE</span><strong>{getPendingUnits(37)}</strong><small>çift kuyrukta</small></div>
                <div><span>VİTRİN</span><strong>{getTotalStock(37)} / {getStockCapacity(37)}</strong><small>çift satışa hazır</small></div>
              </div>
              <h3 className="production-section-title">1 · Hammadde deposu</h3>
              <p className="production-helper">Bu kunduracının kendi hammade deposudur. Kapasite diğer işletmelerle paylaşılmaz; farklı hammaddeler aynı depo alanını kullanır. Üretime bastığında reçetedeki hammaddeler hemen düşer.</p>
              {SHOE_MATERIALS.filter(m => SHOE_RECIPES.filter(shoe => (shoe.unlockLevel || 1) <= getBusinessSalesLevel(37) && isPlayerProductUnlocked(shoe)).some(shoe => Object.prototype.hasOwnProperty.call(shoe.recipe, m.id))).map(m => {
                const amount = Number(materials[m.id]) || 0;
                const cap = getMaterialCapacity(37);
                const totalRaw = SHOE_MATERIALS.reduce((sum,item)=>sum+(Number(materials[item.id])||0),0);
                const quantity = Math.min(m.batch, Math.max(0, cap-totalRaw));
                const cost = Math.round(m.cost*quantity/m.batch*100)/100;
                const ratio = Math.min(100, Math.round(amount / cap * 100));
                return <div className="material-stock-card" key={m.id}>
                  <div className="material-stock-head"><span>{m.name}</span><strong>{amount} adet</strong></div>
                  <div className="material-stock-meter" role="img" aria-label={m.name + ' stok kapasitesi yüzde ' + ratio}><span style={{width: ratio + '%'}} /></div>
                  <button className="stock-button" onClick={() => buyShoeMaterial(m.id)} disabled={quantity<=0 || cash<cost}>{quantity>0 ? '+'+quantity+' · ₺'+cost : 'DEPO DOLU'}</button>
                </div>;
              })}
              <h3 className="production-section-title">2 · Üretim tezgâhı</h3>
              {(() => {
                const unlockedShoes = SHOE_RECIPES.filter(shoe => (shoe.unlockLevel || 1) <= getBusinessSalesLevel(37) && isPlayerProductUnlocked(shoe));
                const selectedShoe = unlockedShoes.find(shoe => shoe.id === selectedShoeId) || unlockedShoes[0];
                if (!selectedShoe) return <p className="production-helper">Üretim için önce işletme seviyesini yükselt.</p>;
                const job = pendingProductions['37:' + selectedShoe.id];
                const missing = Object.entries(selectedShoe.recipe).filter(([id, qty]) => (Number(materials[id]) || 0) < qty);
                const materialLimit = Object.entries(selectedShoe.recipe).reduce((limit,[id,qty])=>Math.min(limit,Math.floor((Number(materials[id])||0)/qty)),Infinity);
                const productCapacity = Math.max(0,getStockCapacity(37)-getTotalStock(37)-getPendingUnits(37));
                const requested = productionBatch === 'max' ? Math.min(materialLimit,productCapacity) : Math.max(1,Number(productionBatch)||1);
                const quantity = Math.min(requested,materialLimit,productCapacity);
                const cost = Object.entries(selectedShoe.recipe).reduce((sum,[id,qty])=>{const m=SHOE_MATERIALS.find(item=>item.id===id);return sum+(m?m.cost/m.batch*qty:0)},0);
                return <div className="shoe-production-workbench">
                  <label className="business-label" htmlFor="shoe-product-select">Üretilecek ürün</label>
                  <select id="shoe-product-select" className="profession-select production-product-select" value={selectedShoe.id} onChange={e=>setSelectedShoeId(e.target.value)}>
                    {unlockedShoes.map(shoe=><option key={shoe.id} value={shoe.id}>{shoe.name}</option>)}
                  </select>
                  <div className="shoe-selected-recipe">
                    <strong>{selectedShoe.name}</strong>
                    <small>Gerekli hammaddeler: {Object.entries(selectedShoe.recipe).map(([id,qty])=>(SHOE_MATERIALS.find(m=>m.id===id)?.name||id)+' × '+qty).join(' · ')}</small>
                    <small>Satış fiyatı: ₺{selectedShoe.price}/çift · Tahmini maliyet: ₺{cost.toLocaleString('tr-TR',{maximumFractionDigits:2})} · Brüt fark: ₺{(selectedShoe.price-cost).toLocaleString('tr-TR',{maximumFractionDigits:2})}</small>
                    {job && <small className="production-pending">Kuyrukta {job.units} çift · sıradaki {Math.max(0,Math.ceil((job.readyAt-productionNow)/1000))} sn</small>}
                    <small className={missing.length?'production-requirements':'production-ready'}>{missing.length?'Eksik hammadde: '+missing.map(([id,qty])=>(SHOE_MATERIALS.find(m=>m.id===id)?.name||id)+' × '+Math.max(0,qty-(Number(materials[id])||0))).join(', '):'Üretim için gerekli hammaddeler mevcut'}</small>
                  </div>
                  <div className={`auto-supply-panel ${autoSupplyByProperty[active.id] ? 'auto-supply-enabled' : ''}`}><div className="auto-supply-copy"><span className="auto-supply-icon">↻</span><div><strong>Otomatik tedarik ve üretim</strong><small>Stok 2 adede düştüğünde, yeterli bakiye ve depo alanı varsa 5 adede kadar üretim başlatır.</small></div></div><button type="button" className="auto-supply-toggle" aria-pressed={Boolean(autoSupplyByProperty[active.id])} onClick={() => setAutoSupplyByProperty(old => ({ ...old, [active.id]: !old[active.id] }))}>{autoSupplyByProperty[active.id] ? 'AÇIK · KAPAT' : 'KAPALI · AÇ'}</button></div>
                <div className="production-batch-picker"><span>ÜRETİM PARTİSİ</span><div>{[['1','1 çift'],['5','5 çift'],['10','10 çift'],['max','Maks.']].map(([value,label])=><button type="button" key={value} className={String(productionBatch)===value?'active':''} onClick={()=>setProductionBatch(value)}>{label}</button>)}</div></div>
                  <button className="stock-button production-primary-action" onClick={()=>craftShoe(selectedShoe.id,productionBatch)} disabled={missing.length>0||quantity<=0}>{quantity<=0?(productCapacity<=0?'VİTRİN DEPOSU DOLU':'HAMMADDE EKSİK'):(job?'KUYRUĞA '+quantity+' ÇİFT EKLE':quantity+' ÇİFT ÜRET')}</button>
                  <p className="production-action-hint">{quantity>0?quantity+' çift üretilebilir. Üretim başında gerekli hammaddeler depodan düşer.':productCapacity<=0?'Vitrin deposu dolu; satış bekle veya depoyu genişlet.':'Hammadde tedarik et veya daha küçük parti seç.'}</p>
                </div>;
              })()}
              <h3 className="production-section-title">3 · Vitrin stokları</h3>
              {SHOE_RECIPES.filter(shoe => (shoe.unlockLevel || 1) <= getBusinessSalesLevel(37) && isPlayerProductUnlocked(shoe) || (Number(products[shoe.id]) || 0) > 0 || !!pendingProductions['37:' + shoe.id]).map(shoe => <div className="stock-line" key={shoe.id}><span>{shoe.name}</span><strong>{Number(products[shoe.id]) || 0} çift</strong></div>)}
            </div>;
          })()}
          {owned.includes(active.id) && !rented.includes(active.id) && active.id !== 37 && (tradeCatalog[active.id] || []).some(item => item.price > 0) && <div className="business-plan production-console">
            {(() => {
              const level = getBusinessSalesLevel(active.id);
              const allProducts = (tradeCatalog[active.id] || []).filter(item => item.price > 0);
              const availableProducts = allProducts.filter(item => (item.unlockLevel || 1) <= level && isPlayerProductUnlocked(item));
              const selectedProduct = availableProducts.find(item => item.id === businessPlans[active.id]) || availableProducts[0];
              const profile = getBusinessProfile(active.id);
              const inventory = getInventoryState(active.id);
              const recipe = selectedProduct ? getBusinessRecipe(active.id, selectedProduct) : [];
              const missing = recipe.filter(part => (Number(inventory.materials?.[part.id]) || 0) < part.qty);
              const unlockedMaterials = getUnlockedBusinessMaterials(active.id, level, selectedProduct);
              const validMaterialIds = new Set(getUnlockedBusinessMaterials(active.id, level).map(material => material.id));
              const totalRaw = Object.entries(inventory.materials || {}).reduce((sum, [id, amount]) => sum + (validMaterialIds.has(id) ? Math.max(0, Number(amount) || 0) : 0), 0);
              const materialCapacity = getMaterialCapacity(active.id);
              const freeCapacity = Math.max(0, materialCapacity - totalRaw);
              const pending = selectedProduct ? pendingProductions[active.id + ':' + selectedProduct.id] : null;
              const canProduce = !!selectedProduct && !missing.length && getTotalStock(active.id) + getPendingUnits(active.id) < getStockCapacity(active.id);
              const sold = Number(businessStats[active.id]?.unitsSold) || 0;
              const thresholds = [0, 5, 15, 35, 60];
              const nextTarget = thresholds[level];
              if ([42, 43, 44, 45, 46].includes(Number(active.id))) {
                const serviceProducts = (tradeCatalog[active.id] || []).filter(item => item.service && item.price > 0);
                const serviceLevel = getBusinessSalesLevel(active.id);
                const selectedService = serviceProducts.find(item => item.id === businessPlans[active.id]) || serviceProducts.find(item => (item.unlockLevel || 1) <= serviceLevel && isPlayerProductUnlocked(item)) || serviceProducts[0];
                const stats = businessStats[active.id] || { unitsSold: 0, revenue: 0, productUnitsSold: {} };
                return <div className="service-console">
                  <div className="production-console-head"><div><span className="card-label">MESLEKİ HİZMET OFİSİ</span><h3>{profile.name}</h3><p>Ürün, hammadde ve depo yönetimi yok. Hizmet seç; müşteri talebi geldikçe ücret doğrudan kasaya yazılır.</p></div><div className="production-level-chip"><strong>SEV. {serviceLevel}/15</strong><small>{stats.unitsSold} hizmet tamamlandı</small></div></div>
                  <div className="production-quick-stats"><div><span>TOPLAM HİZMET GELİRİ</span><strong>₺{Number(stats.revenue || 0).toLocaleString('tr-TR',{maximumFractionDigits:2})}</strong></div><div><span>HİZMET SAYISI</span><strong>{Number(stats.unitsSold)||0}</strong></div><div><span>TEDARİK GİDERİ</span><strong>₺0</strong></div></div>
                  <div className="production-materials-head"><strong>Hizmet kataloğu</strong><span>{serviceProducts.filter(item => (item.unlockLevel || 1) <= serviceLevel && isPlayerProductUnlocked(item)).length}/{serviceProducts.length} açık</span></div>
                  <p className="service-catalog-intro">Bir hizmet kartını seçerek ofisinin ana hizmetini belirle. Her ofiste tek bir hizmet grubu etkin olur; stok veya ambalaj gerekmez.</p>
                  <div className="service-catalog-list">{serviceProducts.map(item => { const itemStats = stats.productUnitsSold?.[item.id] || {}; const unlocked = (item.unlockLevel || 1) <= serviceLevel && isPlayerProductUnlocked(item); const chosen = businessPlans[active.id] === item.id; return <div className={`service-catalog-row ${chosen ? 'service-catalog-row-selected' : ''}`} key={item.id}><div className="service-catalog-copy"><strong>{unlocked ? '◈' : '🔒'} {item.name}</strong><small>{unlocked ? `Tarife ₺${getBusinessSalePrice(active.id,item).toLocaleString('tr-TR',{maximumFractionDigits:2})} · Tamamlanan ${Number(itemStats.units)||0}` : `İşletme seviyesi ${item.unlockLevel} ile açılır`}</small></div><button className="stock-button" disabled={!unlocked} onClick={() => selectBusinessPlan(item.id)}>{chosen ? '✓ SEÇİLİ' : unlocked ? 'HİZMETİ SEÇ' : 'KİLİTLİ'}</button></div>; })}</div>
                  <div className="mastery-panel"><div className="mastery-head"><span className="card-label">MESLEKİ İTİBAR</span><strong>SEV. {serviceLevel}/15</strong></div><div className="mastery-name">{serviceLevel >= 10 ? 'Mahallenin aranan uzmanı' : serviceLevel >= 5 ? 'Yerleşik meslek ofisi' : serviceLevel >= 2 ? 'Tanınırlık kazanıyor' : 'Yeni açılmış ofis'}</div><div className="mastery-meter"><span style={{width: Math.min(100,serviceLevel/15*100)+'%'}} /></div><div className="mastery-foot"><span>{Number(stats.unitsSold)||0} hizmet tamamlandı</span><span>{serviceLevel >= 15 ? 'En üst seviye' : 'Hizmet verdikçe gelişir'}</span></div></div>
                </div>;
              }
              return <>
                <div className="production-console-head">
                  <div><span className="card-label">ÜRETİM ATÖLYESİ</span><h3>{profile.name}</h3><p>Ürünü seç; o ürüne ait hammaddeleri tedarik et ve üretimi sıraya koy.</p></div>
                  <div className="production-level-chip"><strong>SEV. {level}/5</strong><small>{level === 5 ? 'Usta işletme' : Math.max(0, nextTarget - sold) + ' satışla seviye atla'}</small></div>
                </div>
                {(() => { const order = orders.find(item => item.id === focusedOrderId && item.status === 'accepted' && item.propertyId === active.id); if (!order) return null; const ready = getProductStock(active.id, order.productId); const needed = Math.max(0, Number(order.quantity) - ready); return <div className="focused-order-production"><div className="focused-order-top"><span>↗ SİPARİŞTEN ÜRETİME</span><button type="button" onClick={() => setFocusedOrderId(null)} aria-label="Sipariş hedefini kapat">×</button></div><strong>{order.productName} · {order.propertyName}</strong><div className="focused-order-count"><span>Hazır <b>{ready}</b></span><span>Hedef <b>{order.quantity}</b></span><span>Üretilecek <b>{needed}</b></span></div><div className="customer-order-stock-meter"><span style={{width: Math.min(100, ready / Math.max(1, order.quantity) * 100) + '%'}} /></div><small>Ürün otomatik seçildi. Aşağıda eksik hammaddeleri tedarik edip üretimi başlatabilirsin.</small></div>; })()}
                <div className="production-quick-stats">
                  <div><span>HAMMADDE DEPOSU</span><strong>{totalRaw}/{materialCapacity}</strong></div>
                  <div><span>ÜRETİMDE</span><strong>{getPendingUnits(active.id)}</strong></div>
                  <div><span>HAZIR ÜRÜN</span><strong>{getTotalStock(active.id)}/{getStockCapacity(active.id)}</strong></div>
                </div>
                {allProducts.some(item => (item.unlockLevel || 1) <= level && !isPlayerProductUnlocked(item)) && <div className="global-unlock-list"><strong>SEVİYEYLE AÇILAN ÜRÜNLER</strong>{allProducts.filter(item => (item.unlockLevel || 1) <= level && !isPlayerProductUnlocked(item)).slice(0, 3).map(item => <div key={item.id}><span>🔒 {item.name}</span><small>Oyuncu seviyesi {getPlayerUnlockLevel(item)}</small></div>)}</div>}
                <label className="business-label" htmlFor="business-plan-select">Üretilecek ürün</label>
                <select id="business-plan-select" className="profession-select production-product-select" value={selectedProduct?.id || ''} onChange={e => selectBusinessPlan(e.target.value)}>
                  {availableProducts.map(item => <option key={item.id} value={item.id}>{item.name} · ₺{getBusinessSalePrice(active.id, item).toLocaleString('tr-TR', {maximumFractionDigits:2})}</option>)}
                </select>
                {selectedProduct && <div className="production-recipe-compact">
                  <div><strong>{selectedProduct.name}</strong><span>Satış ₺{getBusinessSalePrice(active.id, selectedProduct).toLocaleString('tr-TR', {maximumFractionDigits:2})} · Hammadde ₺{getBusinessRecipeCost(active.id, selectedProduct).toLocaleString('tr-TR', {maximumFractionDigits:2})}</span></div>
                  <p>{recipe.map(part => { const material = profile.materials.find(m => m.id === part.id); const amount = Number(inventory.materials?.[part.id]) || 0; return (material?.name || part.id) + ' ' + amount + '/' + part.qty; }).join('  ·  ')}</p>
                  {missing.length > 0 && <small className="production-missing">Eksik: {missing.map(part => { const material = profile.materials.find(m => m.id === part.id); return (material?.name || part.id) + ' ×' + (part.qty - (Number(inventory.materials?.[part.id]) || 0)); }).join(', ')}</small>}
                  {pending && <small className="production-queue-note">Kuyrukta {pending.units} adet · sıradaki {Math.max(0, Math.ceil((pending.readyAt - productionNow) / 1000))} sn</small>}
                </div>}
                <div className="production-materials-head production-materials-toolbar"><div><strong>Hammaddeler</strong><span>{unlockedMaterials.length} çeşit açık</span></div><button type="button" className="bulk-supply-button" onClick={() => buyRecipeMaterials(active.id, selectedProduct, productionBatch)} disabled={!selectedProduct}>⚡ Eksikleri topluca tedarik et</button></div>
                <div className="production-materials-list">
                  {unlockedMaterials.map(material => {
                    const amount = Number(inventory.materials?.[material.id]) || 0;
                    const quantity = Math.min(material.batch, freeCapacity);
                    const cost = Math.round(material.cost * quantity / material.batch * 100) / 100;
                    return <div className="production-material-row" key={material.id}>
                      <div><strong>{material.name}</strong><small>Stokta {amount} · +{quantity} adet · ₺{cost}</small></div>
                      <button className="stock-button" onClick={() => buyBusinessMaterial(active.id, material.id)} disabled={quantity <= 0 || cash < cost}>{quantity > 0 ? 'TEDARİK ET' : 'DEPO DOLU'}</button>
                    </div>;
                  })}
                </div>
                {selectedProduct && getProductStock(active.id, selectedProduct.id) === 0 && !pending && <div className="production-stockout-alert"><span>!</span><div><strong>STOK TÜKENDİ</strong><small>{selectedProduct.name} satışta yok. Üretim kuyruğuna ekleyerek stoğu yenile.</small></div></div>}
                <div className="production-batch-picker"><span>ÜRETİM PARTİSİ</span><div>
                  {[['1','1 adet'],['5','5 adet'],['10','10 adet'],['max','Maks.']].map(([value,label]) => <button type="button" key={value} className={String(productionBatch) === value ? 'active' : ''} onClick={() => setProductionBatch(value)}>{label}</button>)}
                </div></div>
                <button className="stock-button production-primary-action" onClick={stockBusiness} disabled={!canProduce}>{pending ? 'KUYRUĞA ' + (productionBatch === 'max' ? 'MAKS.' : productionBatch) + ' ADET EKLE' : (productionBatch === 'max' ? 'MAKSİMUM ÜRET' : productionBatch + ' ADET ÜRET')}</button>
                {!canProduce && <p className="production-action-hint">{missing.length ? 'Üretime başlamak için eksik hammaddeleri tedarik et.' : 'Hazır ürün deposu dolu. Önce satış bekle veya depoyu genişlet.'}</p>}
                <details className="production-details">
                  <summary>İşletme raporu ve stok ayrıntıları</summary>
                  <div className="production-detail-body">
                    <div className="storage-upgrade-panel"><div><span>DEPO SEVİYESİ {Number(businessStats[active.id]?.stockCapacityLevel) || 1}/15</span><strong>Ürün başına {getStockCapacity(active.id)} adet kapasite</strong><small>İşletme seviyesi {level} · sonraki kademe için satış yap.</small></div><button className="stock-button" onClick={() => upgradeBusinessStorage(active.id)} disabled={(Number(businessStats[active.id]?.stockCapacityLevel) || 1) >= 15 || level < (Number(businessStats[active.id]?.stockCapacityLevel) || 1) + 1}>GENİŞLET · ₺{STOCK_UPGRADE_COST_BY_LEVEL[(Number(businessStats[active.id]?.stockCapacityLevel) || 1) + 1] || '—'}</button></div>
                    {(() => { const stats = businessStats[active.id] || { unitsSold: 0, revenue: 0, stockInvested: 0 }; const masteryBonus = (level - 1) * 3; const reputation = Math.min(100, Math.floor(stats.unitsSold * 1.5)); const reputationLabel = reputation >= 75 ? 'Mahallenin sevilen yeri' : reputation >= 40 ? 'Düzenli müşteri kitlesi' : reputation >= 10 ? 'Adı duyulmaya başladı' : 'Müşteri kazanıyor'; const ratio = level >= 5 ? 100 : Math.min(100, Math.round(stats.unitsSold / nextTarget * 100)); return <div className="mastery-panel"><div className="mastery-head"><span className="card-label">İŞLETME USTALIĞI</span><strong>SEV. {level} · +%{masteryBonus} SATIŞ</strong></div><div className="mastery-name">{['Yeni açıldı', 'Mahalle esnafı', 'Tanıdık dükkan', 'Yerleşik işletme', 'Mahallenin gözdesi'][level - 1]}</div><div className="mastery-meter"><span style={{width: ratio + '%'}} /></div><div className="mastery-foot"><span>{stats.unitsSold} ürün satıldı</span><span>{level >= 5 ? 'En yüksek ustalık' : nextTarget + ' satışa ilerle'}</span></div><div className="reputation-row"><div><span>MAHALLE İTİBARI</span><strong>{reputation}/100 · {reputationLabel}</strong></div><b>+{Math.round(reputation * 0.12)} puan satış fırsatı</b></div><div className="reputation-meter"><span style={{width: reputation + '%'}} /></div><div className="mastery-stats"><div><span>Toplam hasılat</span><strong>₺{stats.revenue.toLocaleString('tr-TR', {maximumFractionDigits: 2})}</strong></div><div><span>Stok yatırımı</span><strong>₺{stats.stockInvested.toLocaleString('tr-TR', {maximumFractionDigits: 2})}</strong></div><div><span>Hasılat − stok</span><strong>₺{(stats.revenue - stats.stockInvested).toLocaleString('tr-TR', {maximumFractionDigits: 2})}</strong></div></div></div>; })()}
                    <div className="product-sales-panel"><div className="card-label">ÜRÜN BAZINDA STOK VE SATIŞ</div>{availableProducts.map(product => { const soldUnits = Number(businessStats[active.id]?.productUnitsSold?.[product.id]?.units) || 0; const stock = getProductStock(active.id, product.id); const queued = pendingProductions[active.id + ':' + product.id]; return <div className="stock-line product-inventory-row" key={product.id}><span>{product.name}<small className="product-stock-meta">Hazır {stock} · Üretimde {queued?.units || 0} · Satılan {soldUnits}</small></span></div>; })}</div>
                  </div>
                </details>
              </>;
            })()}
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
    {zReport && (
      <div role="dialog" aria-modal="false" aria-labelledby="z-report-title" style={{ position:'fixed', inset:0, zIndex:99990, display:'flex', alignItems:'center', justifyContent:'center', padding:18, pointerEvents:'none' }}>
        <div style={{ pointerEvents:'auto', width:'min(560px, 100%)', maxHeight:'78vh', overflow:'auto', borderRadius:16, background:'#f7f2e8', color:'#29251f', border:'2px solid #8c754d', boxShadow:'0 18px 70px rgba(0,0,0,.42)' }}>
          <div style={{ padding:'18px 22px', background:'#303c32', color:'#f8f1df', display:'flex', justifyContent:'space-between', gap:12, alignItems:'center' }}>
            <div><div style={{fontSize:11,letterSpacing:2,opacity:.8}}>MAHALLE DEFTERİ · GÜN SONU</div><h2 id="z-report-title" style={{margin:'5px 0 0',fontSize:25}}>Z Raporu</h2><div style={{fontSize:12,opacity:.8}}>{zReport.date} günü kapanışı</div></div>
            <button onClick={() => setZReport(null)} style={{background:'transparent',border:'1px solid #cfc5ad',color:'inherit',borderRadius:8,padding:'7px 10px',cursor:'pointer'}}>Kapat</button>
          </div>
          <div style={{padding:'16px 22px'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:8,marginBottom:14}}>
              <div style={{background:'#e8e1d2',padding:12,borderRadius:10}}><div style={{fontSize:11,opacity:.7}}>İŞLETME GELİRİ</div><strong style={{fontSize:20}}>₺{Number(zReport.totalRevenue).toLocaleString('tr-TR',{maximumFractionDigits:2})}</strong></div>
              <div style={{background:'#e8e1d2',padding:12,borderRadius:10}}><div style={{fontSize:11,opacity:.7}}>GÜNÜN NETİ</div><strong style={{fontSize:20,color:zReport.net>=0?'#286142':'#9d332b'}}>₺{Number(zReport.net).toLocaleString('tr-TR',{maximumFractionDigits:2})}</strong></div>
            </div>
            <div style={{fontWeight:700,marginBottom:8}}>Satış dökümü</div>
            {zReport.rows.length ? <div style={{maxHeight:230,overflowY:'auto',fontSize:13,lineHeight:1.55}}>{zReport.rows.map((row,i)=><div key={i} style={{padding:'6px 0',borderBottom:'1px solid #ddd3c1'}}>{typeof row==='string'?row:row.text}</div>)}</div> : <div style={{padding:12,background:'#eee7d9',borderRadius:8,fontSize:13}}>Bugün kaydedilmiş satış yok.</div>}
            <div style={{display:'flex',justifyContent:'space-between',gap:12,marginTop:14,fontSize:12,opacity:.75}}><span>15 saniye sonra kapanır</span><span>Oyun akışı engellenmez</span></div>
          </div>
        </div>
      </div>
    )}
    {activeHudPanel === 'university' && <div role="dialog" aria-modal="false" style={{position:'fixed',zIndex:99980,top:76,right:18,width:'min(540px,calc(100vw - 36px))',maxHeight:'78vh',overflowY:'auto',background:'#f7f2e8',color:'#29251f',border:'2px solid #8c754d',borderRadius:14,boxShadow:'0 18px 60px rgba(0,0,0,.35)',padding:18}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><div><div style={{fontSize:11,letterSpacing:2}}>BEYOĞLU · MESLEK EĞİTİMİ</div><h2 style={{margin:'5px 0'}}>Ticaret ve Meslek Mektebi</h2></div><button onClick={()=>setActiveHudPanel(null)}>Kapat</button></div><p>Her dal 10 seviyeden oluşur. Bir seviyeyi tamamlayınca aynı dalın sonraki seviyesi açılır. Ücret ve ders süresi kademeli artar; her sertifika mesleki itibar ve kalıcı saatlik kazanç bonusu sağlar.</p><div style={{padding:10,background:'#e8e1d2',borderRadius:8,marginBottom:12}}>Mesleki itibar <strong>{careerReputation}/100</strong> · Sertifikalar <strong>{certificates.length}</strong>/60 · Kalıcı kazanç bonusu <strong>+%{(certificates.reduce((sum,c)=>sum+(Number(c.wageBonus)||0.005),0)*100).toLocaleString('tr-TR',{maximumFractionDigits:1})}</strong></div>{enrolledCourse && <div style={{padding:12,border:'1px solid #8c754d',borderRadius:8,marginBottom:12}}><strong>Devam eden: {enrolledCourse.name}</strong><p>{Math.max(0,enrolledCourse.endsAt-gameHourIndex())} oyun saati kaldı</p><button onClick={claimUniversityCertificate} disabled={gameHourIndex()<enrolledCourse.endsAt}>SERTİFİKAYI AL</button></div>}{universityCourseBranches.map(branch=><section key={branch.id} style={{marginBottom:16,padding:12,border:'1px solid #d6c9b3',borderRadius:10,background:'#fbf8f1'}}><h3 style={{fontSize:16,margin:'0 0 8px'}}>{branch.name}</h3><div style={{display:'grid',gridTemplateColumns:'repeat(5,minmax(0,1fr))',gap:4,marginBottom:10}}>{Array.from({length:10},(_,i)=>{const course=universityCourses.find(c=>c.id===(i===0?branch.id:branch.id+'-level-'+(i+1)));const done=certificates.some(c=>c.id===course.id);const open=!course.previousId||certificates.some(c=>c.id===course.previousId);return <div key={course.id} title={course.name} style={{textAlign:'center',padding:'6px 2px',borderRadius:6,background:done?'#d5e4d1':open?'#eadbb9':'#e5e0d8',fontSize:11,fontWeight:700,color:'#302b23'}}>{done?'✓':open?'AÇIK':'🔒'}<br/>Sv. {course.level}</div>})}</div>{universityCourses.filter(c=>c.branchId===branch.id).map(course=>{const done=certificates.some(c=>c.id===course.id);const previousLocked=Boolean(course.previousId&&!certificates.some(c=>c.id===course.previousId));const requirementsLocked=careerHours<(course.requiredHours||0)||careerReputation<(course.requiredRep||0);const locked=previousLocked||requirementsLocked;return <details key={course.id} style={{padding:'8px 0',borderTop:'1px solid #e3dacb'}} open={course.level===1&&!certificates.some(c=>c.id===branch.id)}><summary style={{cursor:'pointer',fontWeight:700,fontSize:13}}>{done?'✓ ':locked?'🔒 ':'○ '}{course.name} <span style={{fontWeight:400,opacity:.75}}>· ₺{course.cost.toLocaleString('tr-TR')}</span></summary><p style={{fontSize:12,margin:'6px 0'}}>{course.detail}</p><div style={{fontSize:12,marginBottom:7}}>Süre: {course.hours} oyun saati · Ücret: ₺{course.cost.toLocaleString('tr-TR')} · İtibar: +{course.rep} · Saatlik kazanç: +%0,5</div>{locked&&<p style={{fontSize:12,margin:'4px 0 8px',color:'#805b31'}}>{previousLocked?'Önce aynı dalın bir önceki seviyesini tamamla. ':''}{requirementsLocked?'Koşul: '+course.requiredHours+' meslek saati ve '+course.requiredRep+' itibar. Mevcut: '+careerHours+' saat, '+careerReputation+' itibar.':''}</p>}<button disabled={done||locked||Boolean(enrolledCourse)||cash<course.cost} onClick={()=>startUniversityCourse(course)}>{done?'SERTİFİKA ALINDI':previousLocked?'ÖNCEKİ SEVİYE GEREKLİ':requirementsLocked?'ÖN KOŞULLAR EKSİK':enrolledCourse?'EĞİTİMDE':cash<course.cost?'YETERSİZ SERMAYE':'EĞİTİME KAYDOL'}</button></details>})}</section>)}</div>}
    {businessAlert && (
      <div role="dialog" aria-modal="true" aria-labelledby="business-alert-title" onClick={() => setBusinessAlert(null)} style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(12, 16, 22, 0.78)', backdropFilter: 'blur(5px)' }}>
        <div onClick={event => event.stopPropagation()} style={{ position: 'relative', width: 'min(440px, 100%)', borderRadius: 18, overflow: 'hidden', background: '#f7f2e8', color: '#27231f', boxShadow: '0 24px 90px rgba(0,0,0,.5)', border: businessAlert.type === 'raid' ? '2px solid #a52d26' : '2px solid #b28a3c' }}>
          <div style={{ padding: '22px 24px 18px', background: businessAlert.type === 'raid' ? 'linear-gradient(135deg,#651f1b,#b83a2d)' : 'linear-gradient(135deg,#54401d,#b58a35)', color: '#fff8e9' }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: .85 }}>{businessAlert.type === 'raid' ? 'DENETİM OLAYI' : 'GİZLİ İŞLETME OLAYI'}</div>
            <div id="business-alert-title" style={{ marginTop: 8, fontSize: 25, lineHeight: 1.15, fontWeight: 900 }}>{businessAlert.title}</div>
            <div style={{ marginTop: 8, fontSize: 13, opacity: .9 }}>Pera Buharlı Kuru Temizleme</div>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 15, lineHeight: 1.55 }}>{businessAlert.message}</div>
            <div style={{ margin: '18px 0 22px', padding: '16px 18px', borderRadius: 12, background: businessAlert.type === 'raid' ? '#f6dfdc' : '#eee4ca', border: '1px solid rgba(60,45,25,.12)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', opacity: .7 }}>{businessAlert.type === 'raid' ? 'CEZA VE EL KOYMA' : 'KASAYA EKLENEN NAKİT'}</div>
              <div style={{ marginTop: 4, fontSize: 30, lineHeight: 1.1, fontWeight: 900, color: businessAlert.type === 'raid' ? '#a52d26' : '#48652c' }}>{businessAlert.amount > 0 ? '+' : '−'}₺{Math.abs(businessAlert.amount).toLocaleString('tr-TR')}</div>
            </div>
            <button type="button" onClick={() => setBusinessAlert(null)} style={{ width: '100%', padding: '13px 16px', border: 0, borderRadius: 10, background: businessAlert.type === 'raid' ? '#8e2d25' : '#655027', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>ANLADIM, DEVAM ET</button>
          </div>
        </div>
      </div>
    )}
  </main>;
}

export default App;