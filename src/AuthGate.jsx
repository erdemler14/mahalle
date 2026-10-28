import React, { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from './supabaseClient.js';

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabaseConfigured));
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabaseConfigured || !supabase) return undefined;
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setMessage(error.message);
      setSession(data?.session || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setLoading(false);
    });
    return () => { active = false; listener?.subscription?.unsubscribe(); };
  }, []);

  if (!supabaseConfigured) return <>{children({ session: null, supabase: null, authConfigured: false })}</>;
  if (loading) return <main className="auth-loading"><span className="auth-spinner" />MAHALLE · HESAP KONTROL EDİLİYOR</main>;
  if (session) return <>{children({ session, supabase, authConfigured: true })}</>;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName.trim().slice(0, 24) || email.trim().split('@')[0] }
          }
        });
        if (error) throw error;
        if (!data.session) setMessage('Hesap oluşturuldu. E-posta doğrulaması isteniyorsa gelen kutunu kontrol et. Doğrulama bağlantısının açılması için Supabase Auth URL ayarlarında bu sitenin adresi izinli olmalı.');
        else setMessage('Hesabın oluşturuldu.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (error) {
      const raw = error?.message || 'İşlem tamamlanamadı. Bilgilerini kontrol et.';
      if (/invalid path specified in request url/i.test(raw)) {
        setMessage('Supabase isteği geçersiz bir adrese gidiyor. Vercel’de VITE_SUPABASE_URL değerinin Supabase Project URL olduğundan emin ol: https://....supabase.co. Dashboard adresini veya /project/... yolunu buraya koyma. Değişkeni düzelttikten sonra yeniden deploy et.');
      } else if (/redirect url not allowed|redirect_to/i.test(raw)) {
        setMessage('E-posta doğrulama adresine izin verilmemiş. Supabase → Authentication → URL Configuration bölümünde Site URL ve Redirect URLs alanlarına bu sitenin tam adresini ekle.');
      } else setMessage(raw);
    } finally {
      setBusy(false);
    }
  };

  return <main className="auth-screen">
    <div className="auth-grain" aria-hidden="true" />
    <section className="auth-card" aria-label="Mahalle hesabı">
      <header className="auth-brand">
        <span className="auth-brand-kicker">ORTAK ŞEHİR · ORTAK HİKÂYE</span>
        <div className="auth-brand-title">MAHALLE</div>
        <div className="auth-brand-subtitle"><span /> BEYOĞLU 1923 <span /></div>
      </header>
      <div className="auth-intro">
        <div className="auth-eyebrow">{mode === 'signup' ? 'YENİ BİR HAYAT KUR' : 'ŞEHİR SENİ BEKLİYOR'}</div>
        <h1>{mode === 'signup' ? 'Mahalleye katıl.' : 'Mahallene dön.'}</h1>
        <p>Tek şehir. Ayrı ekonomiler. Kendi hikâyen.</p>
      </div>
      <div className="auth-tabs" role="tablist" aria-label="Hesap işlemi">
        <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setMessage(''); }}>GİRİŞ YAP</button>
        <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setMessage(''); }}>HESAP OLUŞTUR</button>
      </div>
      <form className="auth-form" onSubmit={submit}>
        {mode === 'signup' && <label>OYUNCU ADI<input value={displayName} onChange={e => setDisplayName(e.target.value.slice(0, 24))} placeholder="Mahallede görünecek adın" maxLength={24} autoComplete="nickname" /></label>}
        <label>E-POSTA<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com" autoComplete="email" /></label>
        <label>ŞİFRE<input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="En az 6 karakter" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} /></label>
        <button className="auth-submit" disabled={busy}>{busy ? 'İŞLENİYOR…' : mode === 'signup' ? 'HESAP OLUŞTUR  ↗' : 'ŞEHRE GİR  ↗'}</button>
      </form>
      {message && <p className="auth-message" role="status">{message}</p>}
      <footer className="auth-footer"><span className="auth-lock">◆</span><p>Hesabın ve kayıtların sana özel. Kimlik doğrulaması Supabase Auth tarafından yönetilir.</p></footer>
    </section>
    <div className="auth-bottomline"><span>MAHALLE / 1923</span><span>AYNI ŞEHİRDE, AYRI HİKÂYELER</span></div>
  </main>;
}
