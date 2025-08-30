import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../utils/themes';
import { VehicleData } from '../utils/mockData';
import { ArrowLeft, ArrowRight, Sun, Settings } from 'lucide-react-native';

const IndicatorPanel: React.FC<Props> = ({ theme, vehicleData }) => {
  const modernTheme = theme.colors.modern;
  if (!modernTheme) return null;

  const activeColor = theme.colors.accent;
  const inactiveColor = modernTheme.textSecondary;

  return (
    <View style={styles.container}>
      <ArrowLeft color={vehicleData.turnSignalLeft ? activeColor : inactiveColor} size={24} />
      <View style={styles.centerIcons}>
        <Settings color={vehicleData.engineCheck ? theme.colors.danger : inactiveColor} size={24} />
        <Sun color={vehicleData.highBeam ? '#4FC3F7' : inactiveColor} size={24} />
      </View>
      <ArrowRight color={vehicleData.turnSignalRight ? activeColor : inactiveColor} size={24} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcons: {
    flexDirection: 'row',
    gap: 20,
    marginHorizontal: 50,
  }
});

export default IndicatorPanel;
