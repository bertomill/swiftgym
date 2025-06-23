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

export default app; 