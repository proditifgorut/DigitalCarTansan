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
import { Fuel } from 'lucide-react-native';
import { Theme } from '../utils/themes';
import { BlurView } from 'expo-blur';

interface Props {
  theme: Theme;
  level: number; // 0-100
}

const FuelGauge: React.FC<Props> = ({ theme, level }) => {
  const animatedLevel = useSharedValue(0);
  const warningOpacity = useSharedValue(1);
  
  const gaugeHeight = 180;

  useEffect(() => {
    animatedLevel.value = withTiming(level / 100, { duration: 1000 });
    
    if (level < 20) {
      warningOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      warningOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [level]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      height: `${animatedLevel.value * 100}%`,
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: warningOpacity.value,
  }));

  const isLow = level < 20;
  const color = isLow ? theme.colors.danger : theme.colors.accent;

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
          <Fuel color={color} size={22} />
          <Text style={[styles.value, { color }]}>
            {Math.round(level)}%
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

export default FuelGauge;
