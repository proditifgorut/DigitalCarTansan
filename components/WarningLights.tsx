import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated';
import { 
  ShieldAlert,
  Settings,
  ParkingSquare,
  User,
  Sun,
  Moon
} from 'lucide-react-native';
import { Theme } from '../utils/themes';
import { VehicleData } from '../utils/mockData';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  theme: Theme;
  vehicleData: VehicleData;
}

const WarningIcon: React.FC<{
  Icon: React.ElementType;
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
  isBlinking?: boolean;
}> = ({ Icon, isActive, activeColor, inactiveColor, isBlinking = false }) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    if (isActive && isBlinking) {
      animation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.4, { duration: 500 })
        ), -1, true);
    } else {
      animation.value = withTiming(isActive ? 1 : 0.15, { duration: 300 });
    }
  }, [isActive, isBlinking]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [{ scale: isActive ? 1 : 0.8 }]
  }));

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
      <Icon color={isActive ? activeColor : inactiveColor} size={28} />
    </Animated.View>
  );
};

const HeadlightIcon: React.FC<{
  theme: Theme;
  highBeam: boolean;
  lowBeam: boolean;
}> = ({ theme, highBeam, lowBeam }) => {
  const animation = useSharedValue(0);
  const isActive = highBeam || lowBeam;

  useEffect(() => {
    animation.value = withTiming(isActive ? 1 : 0.15, { duration: 300 });
  }, [isActive]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [{ scale: isActive ? 1 : 0.8 }]
  }));

  const color = highBeam ? '#4FC3F7' : theme.colors.accent;

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
      {isActive ? (
        <Sun color={color} size={28} strokeWidth={highBeam ? 3 : 2} />
      ) : (
        <Moon color={theme.colors.border} size={28} />
      )}
    </Animated.View>
  );
};


const WarningLights: React.FC<Props> = ({ theme, vehicleData }) => {
  return (
    <BlurView intensity={70} style={styles.container}>
      <LinearGradient
        colors={[`${theme.colors.border}1A`, `${theme.colors.background}4D`]}
        style={styles.gradient}
      >
        <WarningIcon 
          Icon={ShieldAlert} 
          isActive={vehicleData.hazardLights}
          activeColor="#FFA500"
          inactiveColor={theme.colors.border}
          isBlinking
        />
        <WarningIcon 
          Icon={Settings} 
          isActive={vehicleData.engineCheck}
          activeColor={theme.colors.danger}
          inactiveColor={theme.colors.border}
          isBlinking
        />
        <HeadlightIcon 
          theme={theme}
          highBeam={vehicleData.highBeam}
          lowBeam={vehicleData.lowBeam}
        />
        <WarningIcon 
          Icon={ParkingSquare} 
          isActive={vehicleData.handBrake}
          activeColor={theme.colors.danger}
          inactiveColor={theme.colors.border}
        />
        <WarningIcon 
          Icon={User} 
          isActive={!vehicleData.seatbelt}
          activeColor={theme.colors.danger}
          inactiveColor={theme.colors.border}
        />
      </LinearGradient>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 20,
  },
  iconContainer: {
    // Individual icon styling if needed
  },
});

export default WarningLights;
