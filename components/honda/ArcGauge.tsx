import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { Theme } from '../../utils/themes';

interface Props {
  theme: Theme;
  value: number; // Current number of active segments
  segments: number;
  size: number;
  strokeWidth: number;
  labels: string[];
  startAngle: number;
  endAngle: number;
  isWarning?: boolean;
}

const ArcGauge: React.FC<Props> = ({
  theme,
  value,
  segments,
  size,
  strokeWidth,
  labels,
  startAngle,
  endAngle,
  isWarning = false,
}) => {
  const animatedValue = useSharedValue(0);
  const amber = theme.colors.honda?.amber || theme.colors.primary;
  const inactiveColor = theme.colors.honda?.gaugeBackground || '#1A1A1A';
  const dangerColor = theme.colors.danger;
  const activeColor = isWarning ? dangerColor : amber;

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 500 });
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const angleRange = endAngle - startAngle;

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startAng: number, endAng: number) => {
    const start = polarToCartesian(x, y, r, endAng);
    const end = polarToCartesian(x, y, r, startAng);
    const largeArcFlag = endAng - startAng <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const renderSegments = () => {
    return Array.from({ length: segments }).map((_, i) => {
      const segmentAngle = angleRange / segments;
      const segmentStartAngle = startAngle + i * segmentAngle;
      const segmentEndAngle = segmentStartAngle + segmentAngle * 0.8; // Add gap

      const animatedStyle = useAnimatedStyle(() => {
        const isActive = animatedValue.value > i;
        return {
          opacity: withTiming(isActive ? 1 : 0.4, { duration: 200 }),
        };
      });

      return (
        <Animated.View key={i} style={animatedStyle}>
          <Path
            d={describeArc(center, center, radius, segmentStartAngle, segmentEndAngle)}
            stroke={i < value ? activeColor : inactiveColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Animated.View>
      );
    });
  };

  const renderLabels = () => {
    return labels.map((label, i) => {
      const angle = startAngle + (i / (labels.length - 1)) * angleRange;
      const pos = polarToCartesian(center, center, radius - strokeWidth, angle);
      return (
        <SvgText
          key={label}
          x={pos.x}
          y={pos.y}
          fill={amber}
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {label}
        </SvgText>
      );
    });
  };

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {renderSegments()}
        {renderLabels()}
      </Svg>
    </View>
  );
};

export default ArcGauge;
