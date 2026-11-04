# 4 Kasım 2026 — Ortak şehir ticareti ve test bakiyesi

Bu dağıtım üç parça içerir: React arayüzü, GitHub/Vercel üzerinde üretim derlemesi, Supabase şemasını güncelleyen SQL migration.

## Gerekli tek seferlik kurulum

1. Supabase Dashboard → doğru Mahalle projesi → SQL Editor.
2. \`supabase/migrations/202611040001_shared_offers_purchases_and_beta_fund.sql\` içeriğini SQL Editor içine yapıştırıp **Run** ile uygula. Proje sahibi yetkileri gerekir.
3. Oyun sayfasını yeniden aç. Giriş yap ve birkaç saniye hesap kaydının yüklenmesini bekle.
4. Satılık bir mülkü satın almayı dene. Sunucu artık fiyatı ve bakiyeyi doğrudan \`world_properties\` ve \`player_saves\` üzerinden kontrol eder.
5. Başka hesaba ait bir mülke teklif gönder. **TEKLİFLER** menüsünde satıcı kabul, ret veya karşı teklif ile yanıt verebilir. Her iki oyuncunun aynı odada bulunması gerekmez.
6. Sermaye → **Kurucunun Test Kodu** alanına özel olarak verilen tek kullanımlık kodu yaz. Kodu GitHub'a, ekran görüntüsüne veya issue içine ekleme. Kod ilk doğrulayan hesapta kalıcı olarak tüketilir; o hesaba **+₺70.000** eklenir.

## Dikkat edilmesi gerekenler

- GitHub'a SQL dosyası push etmek **Supabase'e migration çalıştırmaz**. SQL Editor adımı zorunludur.
- \`purchase_property_v3\` işlemi nakdi istemciden almak yerine sunucunun kayıtlı nakdini kullanır. Mevcut eski veritabanlarında web uygulaması eski \`purchase_property_v2\` ve \`claim_property\` fonksiyonlarını denemeye devam eder; güvenli yeni akış için migration'ı uygula.
- Yeni mülkler #63–#66 sunucunun mülk tablosuna eklenir. Var olan sahiplikleri değişmez.
- \`property_offers\` teklifleri saklar. Satıcı cevap vermese de alıcı ve satıcı hesabında görünebilir; teklif 7 gerçek gün sonra geçersiz olur.
- Kabul edilen teklifin mülk devri ve iki tarafa ait nakit değişimi bir PostgreSQL transaction'ında yapılır. Bakiye yetersizse devir iptal edilir.
- ₺70.000 fon bir **oyun içi beta test kredisi** olup gerçek para değildir. Kodu ilk kullanan tek hesap alabilir. Fon mevcut bakiyeye eklenir, bakiyeyi ₺70.000'e sabitlemez.
- Sunucu güncellemesinden sonra daha önce açık kalmış oyun sekmelerini kapatıp yeniden açmak eski kayıtların üzerine yazılmasını engeller.

## Kontrol

\`npm test\` yerleşim, temel deniz sahnesi, vapur ekonomisi, işlem modeli ve migration gereksinimlerini doğrular. Ancak veritabanında uçtan uca teklif ve ödeme işleyişini doğrulamak için iki ayrı Supabase hesabıyla canlı test gerekir.

Olası hata mesajları:
- \`PGRST202\`: SQL fonksiyonu henüz uygulanmamış veya şema önbelleği güncel değil.
- \`42P01\`: teklif veya test fonu tablosu henüz oluşturulmamış.
- \`Mülk ... kayıtlı değil\`: ortak şehir tablosundaki mülk seed verisi eski.
- \`Bakiye yetersiz\`: sunucu bakiye kaydı satın alma bedelini karşılamıyor.
