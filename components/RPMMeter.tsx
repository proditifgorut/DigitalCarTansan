import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  withSpring, 
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop, G, Line } from 'react-native-svg';
import { Theme } from '../utils/themes';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width } = Dimensions.get('window');

interface Props {
  theme: Theme;
  rpm: number;
  maxRpm: number;
}

const RPMMeter: React.FC<Props> = ({ theme, rpm, maxRpm }) => {
  const animatedRpm = useSharedValue(0);
  const redlineAnimation = useSharedValue(1);
  
  const size = width * 0.7;
  const strokeWidth = 25;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const redlineThreshold = maxRpm * 0.85;
  const warningThreshold = maxRpm * 0.65;
  const angleRange = 270;
  const startAngle = 135;

  useEffect(() => {
    animatedRpm.value = withSpring(rpm, { damping: 15, stiffness: 150 });
    
    if (rpm > redlineThreshold) {
      redlineAnimation.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 200 }),
          withTiming(1, { duration: 200 })
        ),
        -1,
        true
      );
    } else {
      redlineAnimation.value = withTiming(1, { duration: 300 });
    }
  }, [rpm]);

  const progressProps = useAnimatedProps(() => {
    const progress = (animatedRpm.value / maxRpm);
    return {
      strokeDashoffset: circumference * (1 - progress * (angleRange / 360)),
    };
  });
  
  const containerStyle = useAnimatedProps(() => ({
    transform: [{ scale: redlineAnimation.value }]
  }));

  const getRpmColor = () => {
    if (rpm > redlineThreshold) return theme.colors.danger;
    if (rpm > warningThreshold) return theme.colors.warning;
    return theme.colors.accent;
  };
  const progressColor = getRpmColor();

  const renderTicks = () => {
    const ticks = [];
    const numTicks = 40; // 8 major ticks (for every 1000 RPM), 32 minor
    for (let i = 0; i <= numTicks; i++) {
      const angle = startAngle + (i / numTicks) * angleRange;
      const isMajorTick = i % 5 === 0;
      const tickLength = isMajorTick ? 12 : 6;
      const tickColor = isMajorTick ? theme.colors.secondary : theme.colors.border;
      const tickOpacity = isMajorTick ? 0.8 : 0.5;

      const x1 = size / 2 + (radius - strokeWidth / 2 - tickLength) * Math.cos((angle - 90) * (Math.PI / 180));
      const y1 = size / 2 + (radius - strokeWidth / 2 - tickLength) * Math.sin((angle - 90) * (Math.PI / 180));
      const x2 = size / 2 + (radius - strokeWidth / 2) * Math.cos((angle - 90) * (Math.PI / 180));
      const y2 = size / 2 + (radius - strokeWidth / 2) * Math.sin((angle - 90) * (Math.PI / 180));
      
      ticks.push(
        <Line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={tickColor}
          strokeWidth={isMajorTick ? 2 : 1}
          strokeOpacity={tickOpacity}
        />
      );
    }
    return ticks;
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="rpmGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={progressColor} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={progressColor} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="redlineGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={`${theme.colors.danger}00`} />
            <Stop offset="100%" stopColor={`${theme.colors.danger}99`} />
          </LinearGradient>
        </Defs>
        
        {renderTicks()}

        <G transform={`rotate(${startAngle} ${size/2} ${size/2})`}>
          {/* Background Arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`${theme.colors.border}20`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - angleRange / 360)}
          />
          
          {/* Redline Zone */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#redlineGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference * (angleRange / 360) * 0.15} ${circumference}`}
            strokeDashoffset={-circumference * (angleRange / 360) * 0.85}
          />

          {/* Progress Arc */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#rpmGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
            animatedProps={progressProps}
          />
        </G>
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RPMMeter;
