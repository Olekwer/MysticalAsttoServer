import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { API_CONFIG } from '../config/api';

const ApiStatus: React.FC = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const healthy = await apiService.healthCheck();
      setIsHealthy(healthy);
    } catch (error) {
      setIsHealthy(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem'
    }}>
      <span style={{ color: 'white' }}>API:</span>
      <span style={{
        color: isHealthy === null ? 'yellow' : isHealthy ? 'green' : 'red',
        fontWeight: 'bold'
      }}>
        {isHealthy === null ? '?' : isHealthy ? '✓' : '✗'}
      </span>
      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        {API_CONFIG.BASE_URL}
      </span>
      <button
        onClick={checkHealth}
        disabled={isChecking}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          cursor: 'pointer',
          fontSize: '0.75rem',
          padding: '0.25rem',
          borderRadius: '0.25rem',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        {isChecking ? '⟳' : '↻'}
      </button>
    </div>
  );
};

export default ApiStatus;
