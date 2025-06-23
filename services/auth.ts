/*
What is an Auth Service?
An Auth Service is a centralized class that handles all authentication-related operations in an application.
It acts as a wrapper around the authentication provider (in this case Firebase Auth) to provide a clean,
consistent interface for authentication tasks.

Why do we need an Auth Service?
1. Abstraction - Hides complex authentication logic from components
2. Reusability - Authentication methods can be reused across the app
3. Maintainability - Authentication changes only need to be made in one place
4. Consistency - Ensures authentication is handled the same way everywhere
5. Type Safety - Provides TypeScript interfaces for auth-related data
6. Error Handling - Centralizes error handling for auth operations

What does it help with?
1. User sign-in/sign-up (email, Google, etc.)
2. User sign-out
3. Error message formatting
4. User state management
5. Type conversion between Firebase User and app's User type
6. Authentication state monitoring
*/
/*
Q: Does every app need an auth service?
A: No, not every app needs an auth service. An auth service is necessary when:
1. The app requires user authentication/authorization
2. The app needs to protect certain resources or features
3. The app stores user-specific data
4. The app has different user roles/permissions

Apps that don't need auth services include:
1. Static informational websites
2. Public content-only apps
3. Simple utility apps without user data
4. Demo/prototype apps

Q: Why is this a TypeScript file?
A: This auth service uses TypeScript because:
1. Type Safety - TypeScript catches auth-related type errors at compile time
2. Better IDE Support - Provides autocomplete and inline documentation
3. Interface Definitions - Clearly defines auth data structures (e.g. AuthUser)
4. Code Maintainability - Types make the code more self-documenting
5. Refactoring - TypeScript makes it safer to change auth-related code
6. Integration - Firebase has built-in TypeScript support
*/

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

class AuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  // Convert Firebase User to our AuthUser interface
  private formatUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }

  // Sign in with email and password
  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: this.formatUser(result.user),
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  // Create account with email and password
  async createAccountWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: this.formatUser(result.user),
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      return {
        success: true,
        user: this.formatUser(result.user),
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    await signOut(auth);
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  }

  // Helper method to format error messages
  private getErrorMessage(error: AuthError): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      case 'auth/popup-blocked':
        return 'Pop-up was blocked. Please allow pop-ups and try again.';
      default:
        return error.message || 'An error occurred during authentication.';
    }
  }
}

export const authService = new AuthService(); 