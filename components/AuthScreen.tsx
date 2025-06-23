import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,

  // Component Import Explanations:
  // View - Basic container component, like a <div> in web
  // Text - For displaying text content
  // StyleSheet - Provides a way to create and manage styles
  // TouchableOpacity - Pressable component that dims opacity when pressed
  // SafeAreaView - Container that respects device safe areas (notches, home bars)
  // TextInput - Input field for text entry
  // Alert - Shows native alert/dialog boxes
  // ActivityIndicator - Loading spinner
  // KeyboardAvoidingView - Prevents keyboard from covering inputs
  // Platform - Provides platform-specific code branching
  // ScrollView - Scrollable container for content
} from 'react-native';
import { authService, AuthUser } from '../services/auth';
import { GoogleIcon } from './icons/GoogleIcon';
import { AppleIcon } from './icons/AppleIcon';

/*
What is AuthScreenProps?
AuthScreenProps is a TypeScript interface that defines the props (properties) passed to the AuthScreen component.
It specifies two required callback functions:

1. onAuthSuccess: A callback function that:
   - Takes a successfully authenticated user as a parameter
   - Is called when authentication succeeds
   - Allows the parent component to handle the authenticated user
   - Type safety ensures it receives an AuthUser object

2. onGoBack: A callback function that:
   - Takes no parameters and returns nothing (void)
   - Is called when user wants to go back/cancel
   - Allows navigation control from parent component
   
Why structure it this way?
1. Type Safety - TypeScript interface ensures props are passed correctly
2. Clear Contract - Explicitly defines required props for the component
3. Callback Pattern - Parent components control auth flow via callbacks
4. Separation of Concerns - Auth component handles auth UI/logic only
5. Reusability - Component can be used anywhere with these props
*/
interface AuthScreenProps {
  onAuthSuccess: (user: AuthUser) => void;
  onGoBack: () => void;
}

export default function AuthScreen({ onAuthSuccess, onGoBack }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = isSignUp 
        ? await authService.createAccountWithEmail(email, password)
        : await authService.signInWithEmail(email, password);

      if (response.success && response.user) {
        onAuthSuccess(response.user);
      } else {
        Alert.alert('Authentication Error', response.error || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const response = await authService.signInWithGoogle();
      
      if (response.success && response.user) {
        onAuthSuccess(response.user);
      } else {
        Alert.alert('Google Sign-in Error', response.error || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderInitialOptions = () => (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onGoBack}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Log in or sign up</Text>
        </View>

        {/* Email Input */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.emailInput}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {email.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setEmail('')}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={() => setShowEmailForm(true)}
            disabled={!email.trim()}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          {/* Social Login Options */}
          <TouchableOpacity 
            style={styles.socialButton} 
            onPress={handleGoogleAuth}
            disabled={loading}
          >
            <GoogleIcon size={20} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderEmailForm = () => (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowEmailForm(false)}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            {isSignUp 
              ? 'Create your account to get started' 
              : 'Enter your password to continue'
            }
          </Text>

          {/* Email Display */}
          <View style={styles.emailDisplayContainer}>
            <Text style={styles.emailDisplay}>{email}</Text>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Auth Toggle */}
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.toggleButtonText}>
              {isSignUp 
                ? 'Already have an account? Log in' 
                : "Don't have an account? Sign up"
              }
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, (!password.trim() || loading) && styles.submitButtonDisabled]} 
            onPress={handleEmailAuth}
            disabled={!password.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isSignUp ? 'Create Account' : 'Log In'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );

  return showEmailForm ? renderEmailForm() : renderInitialOptions();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 32,
  },
  closeButton: {
    padding: 8,
    marginRight: 16,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Compensate for close button
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  emailInput: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    paddingRight: 50,
  },
  passwordInput: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
  },
  emailDisplayContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  emailDisplay: {
    fontSize: 16,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    flex: 1,
    textAlign: 'center',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
}); 