# Splash Screen Setup Guide

## Adding Your Background Image

To complete your splash screen setup, you need to add your background image:

### Steps:
1. **Add your background image** to the `assets/` folder
2. **Name it** `splash.png` (or update the filename in the code)
3. **Update the SplashScreen component** to use the ImageBackground

### To Update the Component:
In `components/SplashScreen.tsx`, replace the current background setup:

```tsx
// Replace this:
<View style={styles.backgroundFallback}>

// With this:
<ImageBackground
  source={require('../assets/splash.png')}
  style={styles.backgroundImage}
  resizeMode="cover"
>
```

And at the end, replace:
```tsx
// Replace this:
</View>

// With this:
</ImageBackground>
```

### Image Recommendations:
- **Format**: JPG or PNG
- **Resolution**: 1080x1920 or higher (mobile-optimized)
- **Content**: High-quality gym/fitness photo
- **Contrast**: Ensure good contrast for white text overlay

### Customization Options:
- **Brand Name**: Currently set to "SWIFTGYM" - update in the component
- **Tagline**: Currently "Your Fitness Journey Starts Here"
- **Colors**: Modify button colors in the styles object
- **Overlay**: Adjust the overlay opacity for better text readability

The splash screen is now active and will show when your app launches! 