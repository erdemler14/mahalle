import React, { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from './supabaseClient.js';

const fieldStyle = { width: '100%', boxSizing: 'border-box', padding: '12px 13px', border: '1px solid #d5d0c4', borderRadius: 8, background: '#fffdf8', color: '#28342d', fontSize: 14 };
const buttonStyle = { width: '100%', padding: '12px 14px', border: 0, borderRadius: 8, background: '#314d3d', color: '#fffaf0', fontWeight: 700, cursor: 'pointer', fontSize: 13 };

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

  if (!supabaseConfigured) {
    return <>{children({ session: null, supabase: null, authConfigured: false })}</>;
  }
  if (loading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#e8e6de', color: '#314d3d', fontFamily: 'sans-serif' }}>Mahalle hesabı kontrol ediliyor…</div>;
  if (session) return <>{children({ session, supabase, authConfigured: true })}</>;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true); setMessage('');
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: displayName.trim().slice(0, 24) || email.trim().split('@')[0] } }
        });
        if (error) throw error;
        if (!data.session) setMessage('Kayıt oluşturuldu. E-posta doğrulamasını tamamladıktan sonra giriş yap.');
        else setMessage('Hesabın oluşturuldu.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (error) {
      setMessage(error?.message || 'İşlem tamamlanamadı. Bilgilerini kontrol et.');
    } finally { setBusy(false); }
  };

  return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20, boxSizing: 'border-box', background: 'radial-gradient(circle at 20% 10%, #f5eddd 0, #e8e6de 42%, #d6d6cc 100%)', fontFamily: "'Space Grotesk', system-ui, sans-serif", color: '#28342d' }}>
    <section style={{ width: '100%', maxWidth: 420, boxSizing: 'border-box', padding: 28, border: '1px solid #c9c7bb', borderRadius: 18, background: 'rgba(255,253,248,.94)', boxShadow: '0 18px 55px #243b2b18' }}>
      <div style={{ fontSize: 12, letterSpacing: 3, fontWeight: 800, color: '#59735e' }}>MAHALLE · BEYOĞLU 1923</div>
      <h1 style={{ margin: '12px 0 8px', fontSize: 30, lineHeight: 1.1 }}>{mode === 'signup' ? 'Mahalleye katıl' : 'Mahallene dön'}</h1>
      <p style={{ margin: '0 0 22px', color: '#687269', fontSize: 14, lineHeight: 1.5 }}>Hesabınla giriş yap; herkesin aynı şehirde mülk aldığı ortak dünyaya katıl.</p>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        {mode === 'signup' && <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 700 }}>OYUNCU ADI<input style={fieldStyle} value={displayName} onChange={e => setDisplayName(e.target.value.slice(0, 24))} placeholder="Mahallede görünecek adın" maxLength={24} autoComplete="nickname" /></label>}
        <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 700 }}>E-POSTA<input style={fieldStyle} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="sen@ornek.com" autoComplete="email" /></label>
        <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 700 }}>ŞİFRE<input style={fieldStyle} type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="En az 6 karakter" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} /></label>
        <button style={{ ...buttonStyle, opacity: busy ? .65 : 1 }} disabled={busy}>{busy ? 'İŞLENİYOR…' : mode === 'signup' ? 'HESAP OLUŞTUR' : 'GİRİŞ YAP'}</button>
      </form>
      {message && <p role="status" style={{ margin: '14px 0 0', padding: 10, borderRadius: 8, background: '#edf1e8', fontSize: 13, lineHeight: 1.5, overflowWrap: 'anywhere' }}>{message}</p>}
      <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }} style={{ marginTop: 14, width: '100%', border: '1px solid #d5d0c4', borderRadius: 8, padding: 11, background: 'transparent', color: '#314d3d', fontWeight: 700, cursor: 'pointer' }}>{mode === 'login' ? 'İlk kez mi geliyorsun? Hesap oluştur' : 'Zaten hesabın var mı? Giriş yap'}</button>
      <p style={{ margin: '18px 0 0', color: '#878a80', fontSize: 11, lineHeight: 1.5 }}>Bu ortak şehir için her oyuncu kendi hesabını kullanır. Parola yalnızca Supabase Auth tarafından yönetilir.</p>
    </section>
  </main>;
}
