import React, { useState } from 'react';
// View is a fundamental React Native component that serves as a container
// It's similar to a <div> in web development and is used to:
// 1. Group and layout other components
// 2. Apply styles and flexbox
// 3. Handle touch events and gestures
// 4. Create scrollable content when nested
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Dashboard from './Dashboard';
import BottomNavigation from './BottomNavigation';

export default function AppWithNavigation() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard activeTab={activeTab} />;
      case 'explore':
        // You can add other screens here
        return <Dashboard activeTab={activeTab} />; // Placeholder for now
      case 'bookings':
        // You can add other screens here
        return <Dashboard activeTab={activeTab} />; // Placeholder for now
      case 'profile':
        return <Dashboard activeTab={activeTab} />;
      default:
        return <Dashboard activeTab={activeTab} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderContent()}
        <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
}); 