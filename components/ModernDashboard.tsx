import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../utils/themes';
import { VehicleData } from '../utils/mockData';

import AnalogGauge from './AnalogGauge';
import BottomInfoBar from './BottomInfoBar';
import IndicatorPanel from './IndicatorPanel';

const { width } = Dimensions.get('window');

interface Props {
  theme: Theme;
  vehicleData: VehicleData;
}

const ModernDashboard: React.FC<Props> = ({ theme, vehicleData }) => {
  const modernTheme = theme.colors.modern;
  if (!modernTheme) return null;

  return (
    <View style={styles.container}>
      <IndicatorPanel theme={theme} vehicleData={vehicleData} />
      <View style={styles.mainCluster}>
        <AnalogGauge
          theme={theme}
          value={vehicleData.rpm}
          maxValue={8000}
          size={width * 0.3}
          unit="RPM"
          labels={['0', '2', '4', '6', '8']}
          gradientColors={modernTheme.rpmGradient}
          showDigital={false}
        />
        <AnalogGauge
          theme={theme}
          value={vehicleData.speed}
          maxValue={220}
          size={width * 0.5}
          unit="km/h"
          labels={['0', '40', '80', '120', '160', '200']}
          gradientColors={modernTheme.speedGradient}
          isCenter
        />
        <AnalogGauge
          theme={theme}
          value={vehicleData.powerOutput}
          maxValue={100}
          size={width * 0.3}
          unit="PWR"
          labels={['0', '50', '100']}
          gradientColors={modernTheme.powerGradient}
          showDigital={false}
        />
      </View>
      <BottomInfoBar theme={theme} vehicleData={vehicleData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  mainCluster: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default ModernDashboard;
