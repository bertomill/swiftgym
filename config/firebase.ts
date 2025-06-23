/*
Q: What is a config file and why do you need a config file for Firebase?
A: A config file is a centralized place to store important configuration settings and 
initialization code that will be used throughout an application. For Firebase specifically, 
a config file is needed to:
1. Store Firebase credentials and connection details securely in one place
2. Initialize the Firebase app and services (Auth, Firestore, etc.)
3. Export initialized services to be imported by other parts of the app
4. Keep sensitive configuration data separate from business logic
5. Make it easier to switch between different Firebase projects (dev/prod)

Q: Should config files be added to .gitignore when pushed to GitHub?
A: For Firebase specifically, the config file containing API keys and project IDs can be 
public since Firebase uses additional security measures like:
1. App restrictions (domain/IP whitelisting)
2. Security rules in Firebase Console
3. API key restrictions
However, it's still considered best practice to:
1. Use environment variables for sensitive values
2. Have separate configs for development and production
3. Restrict API key usage where possible
4. Never expose admin SDK credentials
*/

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// SwiftGym Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXoI3Cf1CijODsbppbjjQzUdx-yBX9ujU",
  authDomain: "swiftgym-6d5ca.firebaseapp.com",
  projectId: "swiftgym-6d5ca",
  storageBucket: "swiftgym-6d5ca.firebasestorage.app",
  messagingSenderId: "815902613445",
  appId: "1:815902613445:web:0ee784af1b43c6bab775ac",
  measurementId: "G-WWVG0SW4LV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure Auth for production domain
if (typeof window !== 'undefined') {
  // Ensure auth works on both localhost and production
  const currentDomain = window.location.hostname;
  console.log('🔥 Firebase Auth initialized for domain:', currentDomain);
  
  // Production domain verification
  if (currentDomain === 'swiftgym.vercel.app') {
    console.log('✅ Production environment detected - Firebase Auth ready');
  } else if (currentDomain === 'localhost') {
    console.log('🛠️ Development environment detected - Firebase Auth ready');
  }
}

export default app;