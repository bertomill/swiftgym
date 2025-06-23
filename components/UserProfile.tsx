import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 
             user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>
            {user.displayName || 'User'}
          </Text>
          <Text style={styles.email}>
            {user.email}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); // Styles defined inline with component

/*
Regarding styles organization in React Native:

Both approaches (inline styles vs separate files) are valid and have their tradeoffs:

Inline styles (current approach):
+ Easier to find styles since they're in the same file
+ Better for smaller components
+ Clear component-style relationship
- Can make files longer
- Styles aren't reusable between components

Separate styles folder:
+ Better organization for large apps
+ Enables style reuse across components
+ Cleaner component files
- Have to switch between files more often
- Requires more initial setup

For this app's current size, inline styles are fine. As the app grows,
consider moving to a separate styles folder if you need to:
- Share styles between components
- Maintain theme consistency
- Keep components more focused
*/