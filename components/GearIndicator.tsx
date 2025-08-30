import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { Theme } from '../utils/themes';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  theme: Theme;
  gear: string;
}

const GearIndicator: React.FC<Props> = ({ theme, gear }) => {
  const [displayedGear, setDisplayedGear] = useState(gear);
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withTiming(0, { duration: 150 }, (finished) => {
      if (finished) {
        setDisplayedGear(gear);
        animation.value = withTiming(1, { duration: 150 });
      }
    });
  }, [gear]);

  useEffect(() => {
    animation.value = 1;
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animation.value, [0, 1], [10, 0]);
    return {
      opacity: animation.value,
      transform: [{ translateY }],
    };
  });

  const isReverse = gear === 'R';
  const isPark = gear === 'P';
  const activeColor = isReverse ? theme.colors.danger : isPark ? theme.colors.accent : theme.colors.primary;

  return (
    <View>
      <BlurView intensity={70} style={styles.container}>
        <LinearGradient
          colors={[`${activeColor}1A`, `${theme.colors.background}33`]}
          style={styles.gradient}
        >
          <Animated.View style={[animatedStyle]}>
            <Text style={[styles.gearText, { color: activeColor, textShadowColor: activeColor+'50' }]}>
              {displayedGear}
            </Text>
          </Animated.View>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    paddingHorizontal: 35,
    paddingVertical: 12,
  },
  gearText: {
    fontSize: 72,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-condensed',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
});

export default GearIndicator;
