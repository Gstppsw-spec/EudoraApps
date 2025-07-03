// app/splash.tsx

import React, { useEffect, useState } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0);
  const router = useRouter();
  const [navigated, setNavigated] = useState(false); // State to manage navigation

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // Duration of the fade-in animation
      useNativeDriver: true,
    }).start();

    // Navigate to otpWhatsapp after 5 seconds
    const timer = setTimeout(() => {
      if (!navigated) { // Only navigate if we haven't done so already
        setNavigated(true); // Set navigated to true
        router.push('/authentication/onboarding'); // Navigate to otpWhatsapp
      }
    }, 5000); // 5 seconds delay

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, [fadeAnim, router, navigated]); // Add navigated to the dependency array

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.logoContainer, opacity: fadeAnim }}>
        <Image
          source={require('@/assets/images/logo.jpg')} // Use relative path
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Background color
  },
  logo: {
    width: 200, // Adjust size as needed
    height: 200,
  },
});

export default SplashScreen;