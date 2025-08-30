import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  withTiming,
  useAnimatedStyle,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Theme } from '../utils/themes';

const { width } = Dimensions.get('window');
const speedometerSize = width * 0.55;

interface Props {
  theme: Theme;
  speed: number;
  maxSpeed: number;
}

const Speedometer: React.FC<Props> = ({ theme, speed, maxSpeed }) => {
  const pulseAnimation = useSharedValue(1);
  
  useEffect(() => {
    if (speed > maxSpeed * 0.8) {
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        true
      );
    } else {
      pulseAnimation.value = withTiming(1, { duration: 300 });
    }
  }, [speed]);

  const speedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const getSpeedColor = () => {
    if (speed > maxSpeed * 0.8) return theme.colors.danger;
    if (speed > maxSpeed * 0.5) return theme.colors.warning;
    return theme.colors.primary;
  };

  const textColor = getSpeedColor();

  return (
    <View style={styles.container}>
      <BlurView intensity={50} style={styles.blurView}>
        <View style={[styles.innerCircle, { backgroundColor: `${theme.colors.background}99`, borderColor: `${theme.colors.border}30` }]} />
      </BlurView>
      <Animated.View style={[styles.speedDisplay, speedTextStyle]}>
        <Text style={[styles.speedText, { color: textColor, textShadowColor: `${textColor}50` }]}>
          {Math.round(speed)}
        </Text>
        <Text style={[styles.unitText, { color: theme.colors.secondary }]}>
          km/h
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: speedometerSize,
    height: speedometerSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: speedometerSize / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: '95%',
    height: '95%',
    borderRadius: (speedometerSize * 0.95) / 2,
    borderWidth: 1.5,
  },
  speedDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    fontSize: 110,
    fontWeight: '200',
    fontFamily: 'sans-serif-thin',
    color: '#FFFFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
    includeFontPadding: false,
  },
  unitText: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 2,
    opacity: 0.8,
    marginTop: 8,
  },
});

export default Speedometer;
