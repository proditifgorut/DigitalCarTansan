import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

interface Props {
  theme: Theme;
  speed: number;
}

const Speedometer: React.FC<Props> = ({ theme, speed }) => {
  const amber = theme.colors.honda?.amber || theme.colors.primary;
  const glow = theme.colors.honda?.amberGlow || theme.colors.primary + '30';

  return (
    <View style={styles.container}>
      <Text style={[styles.speedText, { color: amber, textShadowColor: glow }]}>
        {Math.round(speed)}
      </Text>
      <Text style={[styles.unitText, { color: amber }]}>km/h</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  speedText: {
    fontSize: 120,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  unitText: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'sans-serif-light',
    letterSpacing: 1,
    marginTop: -10,
  },
});

export default Speedometer;
