import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { themes, ThemeType } from '../utils/themes';
import { VehicleData, getRealisticData } from '../utils/mockData';
import ModernDashboard from '../components/ModernDashboard';

export default function HomeScreen() {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('modern-futuristic');
  const [vehicleData, setVehicleData] = useState<VehicleData>(getRealisticData());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleData(prevData => getRealisticData(prevData));
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  const theme = themes[currentTheme];

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor="transparent" translucent />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LinearGradient
          colors={theme.colors.gradient}
          style={StyleSheet.absoluteFillObject}
        />
        <ModernDashboard 
          theme={theme}
          vehicleData={vehicleData}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
