import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomNavigation, { paddingBottom: insets.bottom + 12 }]}>
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]}
        onPress={() => onTabPress('home')}
      >
        <Ionicons 
          name={activeTab === 'home' ? 'home' : 'home-outline'} 
          size={24} 
          color={activeTab === 'home' ? '#FF6B35' : '#999'} 
        />
        <Text style={[styles.navLabel, activeTab === 'home' && styles.activeNavLabel]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'explore' && styles.activeNavItem]}
        onPress={() => onTabPress('explore')}
      >
        <Feather 
          name="search" 
          size={24} 
          color={activeTab === 'explore' ? '#FF6B35' : '#999'} 
        />
        <Text style={[styles.navLabel, activeTab === 'explore' && styles.activeNavLabel]}>Explore</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'bookings' && styles.activeNavItem]}
        onPress={() => onTabPress('bookings')}
      >
        <MaterialIcons 
          name={activeTab === 'bookings' ? 'event' : 'event-note'} 
          size={24} 
          color={activeTab === 'bookings' ? '#FF6B35' : '#999'} 
        />
        <Text style={[styles.navLabel, activeTab === 'bookings' && styles.activeNavLabel]}>Bookings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]}
        onPress={() => onTabPress('profile')}
      >
        <Ionicons 
          name={activeTab === 'profile' ? 'person' : 'person-outline'} 
          size={24} 
          color={activeTab === 'profile' ? '#FF6B35' : '#999'} 
        />
        <Text style={[styles.navLabel, activeTab === 'profile' && styles.activeNavLabel]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 1000,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  activeNavItem: {
    backgroundColor: '#FFF5F0',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#FF6B35',
    fontWeight: '700',
  },
}); 