import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);
  
  const { login, loginWithMagicLink, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isMagicLink) {
      await loginWithMagicLink(email);
    } else {
      await login(email, password);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="mystical-card" style={{ width: '100%', maxWidth: '28rem', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="mystical-text" style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Mystical Astro
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.125rem' }}>
            Discover your cosmic destiny
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mystical-input"
              style={{ width: '100%' }}
              placeholder="your@email.com"
              required
            />
          </div>

          {!isMagicLink && (
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mystical-input"
                style={{ width: '100%' }}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mystical-button"
            style={{ width: '100%', opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  animation: 'spin 1s linear infinite',
                  borderRadius: '50%',
                  height: '1.25rem',
                  width: '1.25rem',
                  border: '2px solid transparent',
                  borderTopColor: 'white',
                  marginRight: '0.5rem'
                }}></div>
                {isMagicLink ? 'Sending...' : 'Signing in...'}
              </div>
            ) : (
              isMagicLink ? 'Send Magic Link' : 'Sign In'
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setIsMagicLink(!isMagicLink)}
            style={{
              color: '#e879f9',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#d946ef'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#e879f9'}
          >
            {isMagicLink ? 'Sign in with password' : 'Sign in with magic link'}
          </button>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <button style={{
              color: '#e879f9',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#d946ef'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#e879f9'}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
