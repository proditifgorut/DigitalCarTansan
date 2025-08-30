import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../utils/themes';
import { VehicleData } from '../utils/mockData';
import { Fuel, Thermometer } from 'lucide-react-native';
import Clock from './Clock';

interface BarGaugeProps {
  theme: Theme;
  value: number;
  maxValue: number;
}

const BarGauge: React.FC<BarGaugeProps> = ({ theme, value, maxValue }) => {
  const modernTheme = theme.colors.modern;
  const progress = (value / maxValue) * 100;
  return (
    <View style={[styles.barContainer, {backgroundColor: modernTheme?.gaugeBackground}]}>
      <View style={[styles.barProgress, { width: `${progress}%`, backgroundColor: modernTheme?.needle }]} />
    </View>
  );
};

const BottomInfoBar: React.FC<{ theme: Theme; vehicleData: VehicleData }> = ({ theme, vehicleData }) => {
  const modernTheme = theme.colors.modern;
  if (!modernTheme) return null;

  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <Text style={[styles.infoText, { color: modernTheme.textSecondary }]}>
          ODO {Math.round(vehicleData.odometer)} km
        </Text>
        <Text style={[styles.infoText, { color: modernTheme.textPrimary, fontWeight: 'bold' }]}>
          Range {Math.round(vehicleData.range)} km
        </Text>
      </View>
      
      <View style={styles.centerSection}>
        <Text style={[styles.gearText, { color: theme.colors.primary }]}>{vehicleData.gear}</Text>
        <Clock theme={theme} />
      </View>

      <View style={[styles.infoSection, { justifyContent: 'flex-end' }]}>
        <View style={styles.gaugeWrapper}>
          <Fuel color={modernTheme.textSecondary} size={16} />
          <BarGauge theme={theme} value={vehicleData.fuelLevel} maxValue={100} />
        </View>
        <View style={styles.gaugeWrapper}>
          <Thermometer color={modernTheme.textSecondary} size={16} />
          <BarGauge theme={theme} value={vehicleData.engineTemp} maxValue={120} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(16, 16, 16, 0.7)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoSection: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
  },
  centerSection: {
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gearText: {
    fontSize: 28,
    fontWeight: '900',
  },
  gaugeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barContainer: {
    width: 60,
    height: 6,
    borderRadius: 3,
  },
  barProgress: {
    height: '100%',
    borderRadius: 3,
  },
});

export default BottomInfoBar;
