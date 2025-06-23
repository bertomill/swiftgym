import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Dashboard from './components/Dashboard';
import SplashScreen from './components/SplashScreen';

type AppState = 'splash' | 'dashboard' | 'login' | 'signup';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppState>('splash');

  const handleLogin = () => {
    // For now, navigate to dashboard - you can implement proper login later
    setCurrentScreen('dashboard');
  };

  const handleCreateAccount = () => {
    // For now, navigate to dashboard - you can implement proper signup later
    setCurrentScreen('dashboard');
  };

  const handleContinueAsGuest = () => {
    setCurrentScreen('dashboard');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onLogin={handleLogin}
            onCreateAccount={handleCreateAccount}
            onContinueAsGuest={handleContinueAsGuest}
          />
        );
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {renderCurrentScreen()}
      <StatusBar style="light" />
    </>
  );
}
