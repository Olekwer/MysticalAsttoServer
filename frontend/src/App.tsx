import React from 'react';
import { useAuthStore } from './stores/authStore';
import LoginForm from './components/LoginForm';
import PersonalDashboard from './components/PersonalDashboard';
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
      <PersonalDashboard />
    </>
  );
}

export default App;
