import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Theme } from '../../utils/themes';
import ArcGauge from './ArcGauge';

interface Props {
  theme: Theme;
  rpm: number;
  maxRpm: number;
}

const Tachometer: React.FC<Props> = ({ theme, rpm, maxRpm }) => {
  const amber = theme.colors.honda?.amber || theme.colors.primary;
  
  const value = Math.round((rpm / maxRpm) * 10); // Convert RPM to 0-10 scale for gauge
  const labels = Array.from({ length: 8 }, (_, i) => i.toString()); // 0-7 for x1000 RPM

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: amber }]}>RPM x1000</Text>
      <ArcGauge
        theme={theme}
        value={value}
        segments={10}
        size={300}
        strokeWidth={15}
        labels={labels}
        startAngle={-120}
        endAngle={120}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 0,
    color: '#FFA500',
  },
});

export default Tachometer;
