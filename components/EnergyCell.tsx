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
import { Theme } from '../utils/themes';
import { BlurView } from 'expo-blur';

interface Props {
  theme: Theme;
  value: number;
  maxValue: number;
  Icon: React.ElementType;
  unit: string;
  isWarning: boolean;
}

const EnergyCell: React.FC<Props> = ({ theme, value, maxValue, Icon, unit, isWarning }) => {
  const animatedValue = useSharedValue(0);
  const warningOpacity = useSharedValue(1);

  useEffect(() => {
    animatedValue.value = withTiming(value / maxValue, { duration: 1000 });
    
    if (isWarning) {
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
  }, [value, isWarning]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      height: `${animatedValue.value * 100}%`,
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: warningOpacity.value,
  }));

  const color = isWarning ? theme.colors.danger : theme.colors.accent;

  const renderSegments = () => {
    const segments = [];
    const numSegments = 10;
    for (let i = 1; i < numSegments; i++) {
      segments.push(
        <View 
          key={i} 
          style={[
            styles.segment, 
            { 
              bottom: `${(i / numSegments) * 100}%`,
              backgroundColor: `${theme.colors.border}50`
            }
          ]}
        />
      );
    }
    return segments;
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <BlurView intensity={80} style={styles.blurView}>
        <View style={[styles.gaugeBackground, { borderColor: `${theme.colors.border}40` }]}>
          {renderSegments()}
          <Animated.View style={[styles.progressContainer, progressStyle]}>
            <LinearGradient
              colors={[`${color}99`, color]}
              style={styles.progressGradient}
            />
          </Animated.View>
        </View>
        <View style={styles.info}>
          <Icon color={color} size={24} />
          <Text style={[styles.value, { color }]}>
            {Math.round(value)}{unit}
          </Text>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurView: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  gaugeBackground: {
    width: 20,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  progressContainer: {
    width: '100%',
  },
  progressGradient: {
    flex: 1,
  },
  info: {
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  segment: {
    position: 'absolute',
    width: '100%',
    height: 1,
  }
});

export default EnergyCell;
