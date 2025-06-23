import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onLogin: () => void;
  onCreateAccount: () => void;
  onContinueAsGuest: () => void;
}

export default function SplashScreen({ onLogin, onCreateAccount, onContinueAsGuest }: SplashScreenProps) {
  // For now, we'll use a gradient-like background color
  // You can replace this with an ImageBackground once you add your image
  return (
    <View style={styles.container}>
      {/* TODO: Replace this View with ImageBackground once you add your image:
          <ImageBackground
            source={require('../assets/splash-bg.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
          > */}
      <View style={styles.backgroundFallback}>
        {/* Dark overlay for better text readability */}
        <View style={styles.overlay} />
        
        <SafeAreaView style={styles.content}>
          {/* Logo/Brand Section */}
          <View style={styles.logoContainer}>
            <Text style={styles.brandName}>SWIFTGYM</Text>
            <Text style={styles.tagline}>Your Fitness Journey Starts Here</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
              <Text style={styles.loginButtonText}>LOG IN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createAccountButton} onPress={onCreateAccount}>
              <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestButton} onPress={onContinueAsGuest}>
              <Text style={styles.guestButtonText}>Continue as guest</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      {/* </ImageBackground> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  backgroundFallback: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark gym-like background
    // You can also use a gradient here if you prefer
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Subtle overlay for text contrast
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '400',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionsContainer: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  createAccountButton: {
    backgroundColor: '#000000',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createAccountButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 