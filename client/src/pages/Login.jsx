import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Sparkles, Eye, EyeOff } from 'lucide-react';

const C = {
  pink: '#FF6B9D', purple: '#A855F7', green: '#06D6A0',
  ink: '#1A1A2E', white: '#FFFFFF',
  blush: '#FFD6E7', lavender: '#E8D5FF',
};

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin]   = useState(true);
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setError('Please fill all fields'); return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      paddingTop: 64, minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5F8 0%, #F5F0FF 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: C.pink + '18', borderRadius: '50%', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: -100, right: -100, width: 300, height: 300, background: C.purple + '18', borderRadius: '50%', filter: 'blur(80px)' }} />

      <div style={{
        background: C.white, borderRadius: 28,
        padding: '2.5rem', width: '100%', maxWidth: 420,
        boxShadow: '0 40px 80px rgba(255,107,157,0.15)',
        border: '1.5px solid rgba(255,107,157,0.2)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64,
          background: 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
          borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem', boxShadow: '0 8px 32px rgba(255,107,157,0.4)',
        }}>
          <Sparkles size={28} color={C.white} />
        </div>

        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: C.ink, textAlign: 'center', margin: '0 0 6px' }}>
          {isLogin ? 'Welcome back! 👋' : 'Join FrameOnyx 🌸'}
        </h1>
        <p style={{ fontFamily: 'DM Sans', color: '#aaa', fontSize: 13, textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Sign in to view your orders' : 'Create an account to get started'}
        </p>

        {/* Toggle */}
        <div style={{ display: 'flex', background: '#f5f0ff', borderRadius: 14, padding: 4, marginBottom: '1.5rem' }}>
          {['Login', 'Register'].map((t, i) => (
            <button key={t} onClick={() => { setIsLogin(i === 0); setError(''); }} style={{
              flex: 1, padding: '10px', borderRadius: 10, border: 'none',
              background: (isLogin ? i === 0 : i === 1)
                ? 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')'
                : 'transparent',
              color: (isLogin ? i === 0 : i === 1) ? C.white : '#aaa',
              fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: (isLogin ? i === 0 : i === 1) ? '0 4px 12px rgba(255,107,157,0.3)' : 'none',
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Full name"
                style={{ width: '100%', padding: '13px 14px 13px 40px', border: '1.5px solid #f0f0f0', borderRadius: 14, fontFamily: 'DM Sans', fontSize: 14, outline: 'none', background: '#fafafa', boxSizing: 'border-box', transition: 'all 0.2s' }}
                onFocus={e => { e.target.style.borderColor = C.pink; e.target.style.background = '#FFF5F8'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,157,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="Email address"
              style={{ width: '100%', padding: '13px 14px 13px 40px', border: '1.5px solid #f0f0f0', borderRadius: 14, fontFamily: 'DM Sans', fontSize: 14, outline: 'none', background: '#fafafa', boxSizing: 'border-box', transition: 'all 0.2s' }}
              onFocus={e => { e.target.style.borderColor = C.pink; e.target.style.background = '#FFF5F8'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,157,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ccc' }} />
            <input name="password" type={showPass ? 'text' : 'password'} value={form.password}
              onChange={handleChange} placeholder="Password"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '13px 42px 13px 40px', border: '1.5px solid #f0f0f0', borderRadius: 14, fontFamily: 'DM Sans', fontSize: 14, outline: 'none', background: '#fafafa', boxSizing: 'border-box', transition: 'all 0.2s' }}
              onFocus={e => { e.target.style.borderColor = C.pink; e.target.style.background = '#FFF5F8'; e.target.style.boxShadow = '0 0 0 4px rgba(255,107,157,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
            />
            <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#ccc' }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div style={{ background: '#fff0f0', border: '1.5px solid #ffcccc', borderRadius: 12, padding: '10px 14px', fontFamily: 'DM Sans', fontSize: 13, color: '#c0392b' }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            padding: '14px', border: 'none', borderRadius: 14,
            background: loading ? '#e0e0e0' : 'linear-gradient(135deg, ' + C.pink + ', ' + C.purple + ')',
            color: loading ? '#aaa' : C.white,
            fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 32px rgba(255,107,157,0.35)',
            transition: 'all 0.2s', marginTop: 4,
          }}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
          </button>
        </div>

        <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: '1.5rem' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ background: 'none', border: 'none', color: C.pink, fontFamily: 'Syne', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}