import React, { useState } from 'react';
import { useAstroStore } from '../stores/astroStore';
import AddressAutocomplete from './AddressAutocomplete';

const NatalChart: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  
  const { fetchNatalChart, natalChart, isLoading, error } = useAstroStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (birthDate && birthTime && birthPlace) {
      await fetchNatalChart(birthDate, birthTime, birthPlace);
    }
  };

  const handleBirthPlaceSelect = (location: { latitude: number; longitude: number; address: string }) => {
    setBirthPlace(location.address);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="mystical-text" style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Natal Chart
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.25rem' }}>
            Discover the cosmic blueprint of your birth
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {/* Input Form */}
          <div className="mystical-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
              Enter Your Birth Details
            </h2>

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
                <label htmlFor="birthDate" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                  Birth Date
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mystical-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label htmlFor="birthTime" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                  Birth Time
                </label>
                <input
                  id="birthTime"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="mystical-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label htmlFor="birthPlace" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                  Birth Place
                </label>
                <AddressAutocomplete
                  value={birthPlace}
                  onChange={setBirthPlace}
                  onSelect={handleBirthPlaceSelect}
                  placeholder="City, Country"
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

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
                    Calculating...
                  </div>
                ) : (
                  'Generate Natal Chart'
                )}
              </button>
            </form>
          </div>

          {/* Chart Display */}
          <div className="mystical-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
              Your Cosmic Blueprint
            </h2>

            {natalChart ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Chart Visualization Placeholder */}
                <div style={{
                  background: 'linear-gradient(to bottom right, rgba(88, 28, 135, 0.5), rgba(147, 51, 234, 0.5))',
                  borderRadius: '0.5rem',
                  padding: '2rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>🌌</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                    Natal Chart Generated
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Your cosmic blueprint has been revealed
                  </p>
                </div>

                {/* Chart Data */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '500', color: 'white' }}>Chart Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Sun Sign:</span>
                      <span style={{ color: 'white', marginLeft: '0.5rem' }}>Aries</span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Moon Sign:</span>
                      <span style={{ color: 'white', marginLeft: '0.5rem' }}>Taurus</span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Rising Sign:</span>
                      <span style={{ color: 'white', marginLeft: '0.5rem' }}>Gemini</span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>House System:</span>
                      <span style={{ color: 'white', marginLeft: '0.5rem' }}>Placidus</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>✨</div>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '1.125rem' }}>
                  Enter your birth details to reveal your natal chart
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NatalChart;
