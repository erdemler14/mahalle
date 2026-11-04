# Mahalle ortak şehir / şehir ekonomisi kurulumu (4 Kasım 2026)

## Aktif özellikler
- Mülk satın alma, satış teklifi ve devirler için \`supabase/migrations/202611040001_shared_offers_purchases_and_beta_fund.sql\` dosyasındaki satın alma ve teklif tabloları gerekir.
- **₺70.000 test fonu kaldırılmıştır.** İlk migration, geçmiş kurulumlarda fonu içerir; işlemi kapatmak için hemen ardından \`supabase/migrations/202611040002_retire_beta_credit.sql\` çalıştırılmalıdır.
- İkinci migration fonu veren RPC'yi ve davet tablosunu siler; geçmiş işlemlerin muhasebe kaydı korunur. Daha önce verilmiş parayı otomatik silmez, çünkü sonradan yapılan gerçek oyun işlemleriyle iç içe olabilir.
- Yaşayan Şehir, hikâyeler, NPC günlük programları, tedarik ve mahalle itibarı mevcut oyuncu oyun kaydında (\`neighborhood\`) saklanır; ayrı bir migration gerekmez.

## Canlıya hazırlama
1. Doğru Supabase projesini SQL Editor'de aç.
2. İlk SQL dosyası daha önce uygulanmadıysa uygula.
3. İkinci kaldırma migration'ını uygula.
4. İki ayrı oturumla mülk satın alma, teklif, kabul ve ret akışını kontrol et.
5. Şehir menüsünü aç, hikâye seçiminin bir kez uygulandığını ve mahalle itibarını etkilediğini doğrula.
6. Dükkân sahibiysen müşteri yoğunluğunun satış oranına, tedarik koşullarının hammadde harcamalarına etkisini gözlemle.

## Güvenlik ve oyun dengesi
- Kesinleşmiş satın alma ve devirler server tarafında nakit ve mülkiyet denetimiyle yürütülür.
- Tarihî olay tarihlerinin kaynağı resmî 1923 kronolojisi ve İstanbul şehir kronolojisidir. Günlük karakter öyküleri açıkça oyun kurgusudur.
- Ekonomik çarpanlar gerçek 1923 fiyatlarına dair iddia değildir; oyuncuların özel ekonomi dengesinin parçasıdır.
