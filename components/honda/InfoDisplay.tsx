import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../utils/themes';
import { VehicleData } from '../../utils/mockData';
import ArcGauge from './ArcGauge';

interface Props {
  theme: Theme;
  vehicleData: VehicleData;
  showOdometer: boolean;
  onToggleDisplay: () => void;
  isLeft?: boolean;
}

const InfoDisplay: React.FC<Props> = ({ theme, vehicleData, showOdometer, onToggleDisplay, isLeft = false }) => {
  const amber = theme.colors.honda?.amber || theme.colors.primary;

  const fuelSegments = Math.round((vehicleData.fuelLevel / 100) * 10);
  const tempSegments = Math.round((vehicleData.engineTemp / 120) * 10);

  if (isLeft) {
    return (
      <ArcGauge
        theme={theme}
        value={fuelSegments}
        segments={10}
        size={120}
        strokeWidth={12}
        labels={['E', 'F']}
        startAngle={-135}
        endAngle={-45}
        isWarning={vehicleData.fuelLevel < 20}
      />
    );
  }

  if (!isLeft && !showOdometer) {
     return (
      <ArcGauge
        theme={theme}
        value={tempSegments}
        segments={10}
        size={120}
        strokeWidth={12}
        labels={['C', 'H']}
        startAngle={45}
        endAngle={135}
        isWarning={vehicleData.engineTemp > 100}
      />
    );
  }

  return (
    <View style={styles.odometerContainer}>
      <TouchableOpacity onPress={onToggleDisplay} style={[styles.odometerBox, {backgroundColor: theme.colors.honda?.gaugeBackground}]}>
        <Text style={[styles.odometerValue, { color: amber }]}>
          {showOdometer 
            ? Math.round(vehicleData.odometer).toString().padStart(6, '0')
            : vehicleData.tripmeter.toFixed(1)
          }
        </Text>
        <Text style={[styles.odometerLabel, { color: amber }]}>
          {showOdometer ? 'km' : 'TRIP A'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  odometerContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  odometerBox: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333'
  },
  odometerValue: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  odometerLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default InfoDisplay;
