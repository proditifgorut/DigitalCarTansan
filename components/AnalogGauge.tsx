import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedProps } from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop, Text as SvgText, G, Line } from 'react-native-svg';
import { Theme } from '../utils/themes';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  theme: Theme;
  value: number;
  maxValue: number;
  size: number;
  unit: string;
  labels: string[];
  gradientColors: string[];
  showDigital?: boolean;
  isCenter?: boolean;
}

const AnalogGauge: React.FC<Props> = ({ 
  theme, 
  value, 
  maxValue, 
  size, 
  unit, 
  labels, 
  gradientColors,
  showDigital = true,
  isCenter = false
}) => {
  const modernTheme = theme.colors.modern;
  if (!modernTheme) return null;
  
  const animatedValue = useSharedValue(0);

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const angleRange = 240;
  const startAngle = -210;
  const endAngle = 30;

  useEffect(() => {
    animatedValue.value = withSpring(value, { damping: 12, stiffness: 80 });
  }, [value]);

  const polarToCartesian = (angle: number, r: number) => {
    const angleInRadians = ((angle) * Math.PI) / 180.0;
    return {
      x: center + r * Math.cos(angleInRadians),
      y: center + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (startAng: number, endAng: number) => {
    const start = polarToCartesian(endAng, radius);
    const end = polarToCartesian(startAng, radius);
    const largeArcFlag = endAng - startAng <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const needleProps = useAnimatedProps(() => {
    const angle = startAngle + (animatedValue.value / maxValue) * angleRange;
    const { x: x1, y: y1 } = polarToCartesian(angle, radius * 0.1);
    const { x: x2, y: y2 } = polarToCartesian(angle, radius * (isCenter ? 0.85 : 0.75));
    return {
      d: `M${x1},${y1} L${x2},${y2}`,
    };
  });

  const renderLabelsAndTicks = () => {
    return labels.map((label, i) => {
      const ratio = i / (labels.length - 1);
      const angle = startAngle + ratio * angleRange;
      const tickStart = polarToCartesian(angle, radius - strokeWidth / 2);
      const tickEnd = polarToCartesian(angle, radius + strokeWidth / 2);
      const labelPos = polarToCartesian(angle, radius - strokeWidth * 1.2);
      return (
        <G key={`label-${i}`}>
          <Line x1={tickStart.x} y1={tickStart.y} x2={tickEnd.x} y2={tickEnd.y} stroke={modernTheme.textSecondary} strokeWidth="2" />
          <SvgText
            x={labelPos.x}
            y={labelPos.y + 5}
            fill={modernTheme.textPrimary}
            fontSize={size * 0.08}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        </G>
      );
    });
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={`grad-${unit}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
        </Defs>
        <Path
          d={describeArc(startAngle, endAngle)}
          stroke={modernTheme.gaugeBackground}
          strokeWidth={strokeWidth + 4}
          fill="none"
        />
        <Path
          d={describeArc(startAngle, endAngle)}
          stroke={`url(#grad-${unit})`}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {renderLabelsAndTicks()}
        <AnimatedPath animatedProps={needleProps} stroke={modernTheme.needle} strokeWidth={isCenter ? 4 : 3} strokeLinecap="round" />
        <Path d={`M ${center- (isCenter ? 4 : 2)} ${center} A ${isCenter ? 4 : 2} ${isCenter ? 4 : 2} 0 1 1 ${center+ (isCenter ? 4 : 2)} ${center} Z`} fill={modernTheme.needle} />
      </Svg>
      {showDigital && (
        <View style={styles.digitalDisplay}>
          <Text style={[styles.digitalValue, { fontSize: size * 0.25, color: modernTheme.textPrimary }]}>
            {Math.round(value)}
          </Text>
          <Text style={[styles.digitalUnit, { fontSize: size * 0.1, color: modernTheme.textSecondary }]}>
            {unit}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  digitalDisplay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: '25%',
  },
  digitalValue: {
    fontWeight: 'bold',
  },
  digitalUnit: {
    fontWeight: '600',
  },
});

export default AnalogGauge;
