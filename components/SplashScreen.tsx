import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onLogin: () => void;
  onCreateAccount: () => void;
  onContinueAsGuest: () => void;
}

export default function SplashScreen({ onLogin, onCreateAccount, onContinueAsGuest }: SplashScreenProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate the content in after image loads
    if (imageLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [imageLoaded, fadeAnim]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <View style={styles.container}>
      {/* Loading state with solid background color while image loads */}
      {!imageLoaded && (
        <View style={styles.loadingContainer}>
          <Text style={styles.brandNameLoading}>SWIFTGYM</Text>
          <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
          <Text style={styles.loadingText}>Loading your fitness journey...</Text>
        </View>
      )}

      <ImageBackground
        source={require('../assets/splash.png')}
        style={[styles.backgroundImage, { opacity: imageLoaded ? 1 : 0 }]}
        resizeMode="cover"
        onLoad={handleImageLoad}
        // Add performance optimizations
        fadeDuration={0}
        blurRadius={imageLoaded ? 0 : 10}
      >
        {/* Dark overlay for better text readability */}
        <View style={styles.overlay} />
        
        <SafeAreaView style={styles.content}>
          <Animated.View style={[styles.animatedContent, { opacity: fadeAnim }]}>
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
          </Animated.View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a', // Dark background similar to gym atmosphere
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  brandNameLoading: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for better text contrast
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  animatedContent: {
    flex: 1,
    justifyContent: 'space-between',
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
    gap: 16,
    marginHorizontal: 20,
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