import React, { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from './supabaseClient.js';

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabaseConfigured));
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
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
  if (loading) return <main className="auth-loading"><span className="auth-spinner" />MAHALLE</main>;
  if (session) return <>{children({ session, supabase, authConfigured: true })}</>;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'verify') {
        const { error } = await supabase.auth.verifyOtp({
          email: email.trim(), token: verificationCode.trim(), type: 'signup'
        });
        if (error) throw error;
        setMessage('E-posta doğrulandı. Şehre giriş yapılıyor…');
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName.trim().slice(0, 24) || email.trim().split('@')[0] }
          }
        });
        if (error) throw error;
        if (!data.session) {
          setMode('verify');
          setVerificationCode('');
          setMessage('Doğrulama e-postası gönderildi. E-postadaki tek kullanımlık kodu gir. Kod görünmüyorsa Supabase e-posta şablonunda {{ .Token }} alanının bulunduğunu kontrol et.');
        } else {
          setMessage('Hesabın oluşturuldu.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (error) {
      const raw = error?.message || 'İşlem tamamlanamadı. Bilgilerini kontrol et.';
      if (/invalid token|token has expired|otp_expired|invalid otp/i.test(raw)) {
        setMessage('Kod geçersiz veya süresi dolmuş. En son gelen e-postadaki kodu kullan; gerekirse yeni kod iste.');
      } else if (/invalid path specified in request url/i.test(raw)) {
        setMessage('Supabase isteği geçersiz bir adrese gidiyor. Vercel’de VITE_SUPABASE_URL değerinin Supabase Project URL olduğundan emin ol: https://....supabase.co. Dashboard adresini veya /project/... yolunu buraya koyma. Değişkeni düzelttikten sonra yeniden deploy et.');
      } else if (/redirect url not allowed|redirect_to/i.test(raw)) {
        setMessage('E-posta doğrulama adresine izin verilmemiş. Supabase → Authentication → URL Configuration bölümünde Site URL ve Redirect URLs alanlarına bu sitenin tam adresini ekle.');
      } else {
        setMessage(raw);
      }
    } finally {
      setBusy(false);
    }
  };

  const resendCode = async () => {
    setBusy(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: { emailRedirectTo: window.location.origin }
      });
      if (error) throw error;
      setMessage('Yeni doğrulama e-postası gönderildi. Yalnızca en son gelen kodu kullan.');
    } catch (error) {
      setMessage(error?.message || 'Yeni kod gönderilemedi. Biraz bekleyip tekrar dene.');
    } finally {
      setBusy(false);
    }
  };

  return <main className="auth-screen">
    <div className="auth-grain" aria-hidden="true" />
    <section className="auth-card" aria-label="Mahalle hesabı">
      <header className="auth-brand">
        <div className="auth-brand-title">MAHALLE<span className="auth-brand-mark">+</span></div>
      </header>
      <div className="auth-intro">
        <h1>{mode === 'signup' ? 'HESAP OLUŞTUR' : mode === 'verify' ? 'E-POSTA KODU' : 'GİRİŞ YAP'}</h1>
        {mode === 'verify' && <p>{email}</p>}
      </div>
      {mode !== 'verify' && <div className="auth-tabs" role="tablist" aria-label="Hesap işlemi">
        <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setMessage(''); }}>GİRİŞ YAP</button>
        <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setMessage(''); }}>HESAP OLUŞTUR</button>
      </div>}
      <form className="auth-form" onSubmit={submit}>
        {mode === 'signup' && <label><span>OYUNCU ADI</span><input value={displayName} onChange={e => setDisplayName(e.target.value.slice(0, 24))} placeholder="Oyuncu adı" maxLength={24} autoComplete="nickname" /></label>}
        {mode !== 'verify' && <label><span>E-POSTA</span><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" autoComplete="email" /></label>}
        {mode === 'verify' && <label><span>KOD</span><input inputMode="numeric" autoComplete="one-time-code" required value={verificationCode} onChange={e => setVerificationCode(e.target.value.replace(/\s/g, '').slice(0, 12))} placeholder="Doğrulama kodu" /></label>}
        {mode !== 'verify' && <label><span>ŞİFRE</span><input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} /></label>}
        <button className="auth-submit" disabled={busy}>{busy ? 'İŞLENİYOR…' : mode === 'verify' ? 'E-POSTAYI DOĞRULA ↗' : mode === 'signup' ? 'HESAP OLUŞTUR ↗' : 'ŞEHRE GİR ↗'}</button>
      </form>
      {mode === 'verify' && <>
        <button type="button" className="auth-secondary" disabled={busy} onClick={resendCode}>YENİ KOD GÖNDER</button>
        <button type="button" className="auth-back" onClick={() => { setMode('signup'); setMessage(''); }}>KAYIT EKRANINA DÖN</button>
      </>}
      {message && <p className="auth-message" role="status">{message}</p>}
    </section>
  </main>;
}
