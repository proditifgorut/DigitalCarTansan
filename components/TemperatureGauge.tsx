import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Thermometer } from 'lucide-react-native';
import { Theme } from '../utils/themes';
import { BlurView } from 'expo-blur';

interface Props {
  theme: Theme;
  temperature: number; // 0-120°C
}

const TemperatureGauge: React.FC<Props> = ({ theme, temperature }) => {
  const animatedTemp = useSharedValue(0);
  const warningOpacity = useSharedValue(1);
  
  const gaugeHeight = 180;

  useEffect(() => {
    animatedTemp.value = withTiming(temperature / 120, { duration: 1000 });
    
    if (temperature > 100) {
      warningOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        true
      );
    } else {
      warningOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [temperature]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      height: `${animatedTemp.value * 100}%`,
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: warningOpacity.value,
  }));

  const isHot = temperature > 100;
  const color = isHot ? theme.colors.danger : theme.colors.accent;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
       <BlurView intensity={80} style={styles.blurView}>
        <View style={[styles.gaugeBackground, { borderColor: `${theme.colors.border}40` }]}>
          <Animated.View style={[styles.progressContainer, progressStyle]}>
            <LinearGradient
              colors={[`${color}99`, color]}
              style={styles.progressGradient}
            />
          </Animated.View>
        </View>
        <View style={styles.info}>
          <Thermometer color={color} size={22} />
          <Text style={[styles.value, { color }]}>
            {Math.round(temperature)}°
          </Text>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 250,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  blurView: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  gaugeBackground: {
    width: 18,
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 9,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  progressContainer: {
    width: '100%',
  },
  progressGradient: {
    flex: 1,
  },
  info: {
    marginTop: 15,
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default TemperatureGauge;
