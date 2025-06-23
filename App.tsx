import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppWithNavigation from './components/AppWithNavigation';
import SplashScreen from './components/SplashScreen';
import ModernAuthScreen from './components/ModernAuthScreen';
import { AuthUser } from './services/auth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

type AppState = 'splash' | 'dashboard' | 'auth';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppState>('splash');

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  // If user is authenticated, show dashboard with navigation
  if (user) {
    return <AppWithNavigation />;
  }

  const handleLogin = () => {
    setCurrentScreen('auth');
  };

  const handleCreateAccount = () => {
    setCurrentScreen('auth');
  };

  const handleContinueAsGuest = () => {
    setCurrentScreen('dashboard');
  };

  const handleAuthSuccess = (user: AuthUser) => {
    // User is now authenticated, the useAuth hook will automatically
    // detect this and show the dashboard
    setCurrentScreen('dashboard');
  };

  const handleGoBack = () => {
    setCurrentScreen('splash');
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
      case 'auth':
        return (
          <ModernAuthScreen
            onAuthSuccess={handleAuthSuccess}
            onGoBack={handleGoBack}
          />
        );
      case 'dashboard':
      default:
        return <AppWithNavigation />;
    }
  };

  return (
    <>
      {renderCurrentScreen()}
      <StatusBar style="light" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

