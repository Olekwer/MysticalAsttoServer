import React from 'react';
import { useAuthStore } from './stores/authStore';
import LoginForm from './components/LoginForm';
import NatalChart from './components/NatalChart';
import ApiStatus from './components/ApiStatus';

function App() {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <>
        <ApiStatus />
        <LoginForm />
      </>
    );
  }

  return (
    <>
      <ApiStatus />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)' }}>
        {/* Header */}
        <header style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1 className="mystical-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                  Mystical Astro
                </h1>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={logout}
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <NatalChart />
        </main>
      </div>
    </>
  );
}

export default App;
