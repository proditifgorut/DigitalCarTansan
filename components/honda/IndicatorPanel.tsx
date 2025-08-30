import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Theme } from '../../utils/themes';
import { VehicleData } from '../../utils/mockData';
import { 
  ParkingCircle, 
  ArrowLeft, 
  ArrowRight, 
  ChevronUp, 
  AlertTriangle,
  User,
} from 'lucide-react-native';

interface IndicatorProps {
  Icon: React.ElementType;
  isActive: boolean;
  isBlinking?: boolean;
  activeColor: string;
  inactiveColor: string;
}

const Indicator: React.FC<IndicatorProps> = ({ Icon, isActive, isBlinking, activeColor, inactiveColor }) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      if (isBlinking) {
        animation.value = withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0.2, { duration: 500 })), -1);
      } else {
        animation.value = withTiming(1, { duration: 300 });
      }
    } else {
      animation.value = withTiming(0, { duration: 300 });
    }
  }, [isActive, isBlinking]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isActive ? animation.value : 1,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon color={isActive ? activeColor : inactiveColor} size={28} strokeWidth={2.5} />
    </Animated.View>
  );
};

interface Props {
  theme: Theme;
  vehicleData: VehicleData;
}

const IndicatorPanel: React.FC<Props> = ({ theme, vehicleData }) => {
  const amber = theme.colors.honda?.amber || theme.colors.primary;
  const inactive = theme.colors.honda?.iconInactive || '#444';
  const danger = theme.colors.danger;
  const highBeamColor = '#4FC3F7';

  return (
    <View style={styles.container}>
      <Indicator Icon={ArrowLeft} isActive={vehicleData.hazardLights || vehicleData.turnSignalLeft} isBlinking activeColor={amber} inactiveColor={inactive} />
      <Indicator Icon={User} isActive={!vehicleData.seatbelt} activeColor={danger} inactiveColor={inactive} />
      <Indicator Icon={AlertTriangle} isActive={vehicleData.engineCheck} activeColor={danger} inactiveColor={inactive} isBlinking />
      <Indicator Icon={ParkingCircle} isActive={vehicleData.handBrake} activeColor={danger} inactiveColor={inactive} />
      <Indicator Icon={ChevronUp} isActive={vehicleData.highBeam} activeColor={highBeamColor} inactiveColor={inactive} />
      <Indicator Icon={ArrowRight} isActive={vehicleData.hazardLights || vehicleData.turnSignalRight} isBlinking activeColor={amber} inactiveColor={inactive} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 20,
  },
});

export default IndicatorPanel;
