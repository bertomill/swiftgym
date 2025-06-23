/*
What is index.ts?
index.ts is the entry point file for React Native/Expo applications. It serves as the main
bootstrapping file that initializes and starts the application.

Why is it helpful?
1. Entry Point - Provides a clear starting point for the application
2. App Registration - Registers the root component with React Native's app registry
3. Environment Setup - Ensures proper setup for both Expo Go and native builds
4. Initialization - Can contain any necessary app startup/initialization code
5. Consistency - Follows React Native/Expo conventions for app structure
6. Cross-Platform - Works consistently across iOS and Android platforms
*/

import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
