import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../utils/themes';
import { VehicleData } from '../../utils/mockData';

import Tachometer from './Tachometer';
import InfoDisplay from './InfoDisplay';
import IndicatorPanel from './IndicatorPanel';
import DoorIndicator from './DoorIndicator';
import Speedometer from './Speedometer';

const { width } = Dimensions.get('window');

interface Props {
  theme: Theme;
  vehicleData: VehicleData;
}

const HondaFreedDashboard: React.FC<Props> = ({ theme, vehicleData }) => {
  const [showOdometer, setShowOdometer] = useState(true);

  return (
    <View style={styles.container}>
      <Tachometer theme={theme} rpm={vehicleData.rpm} maxRpm={7000} />
      
      <View style={styles.middleRow}>
        <InfoDisplay 
          theme={theme}
          vehicleData={vehicleData}
          showOdometer={showOdometer}
          onToggleDisplay={() => setShowOdometer(prev => !prev)}
          isLeft
        />
        <Speedometer theme={theme} speed={vehicleData.speed} />
        <InfoDisplay 
          theme={theme}
          vehicleData={vehicleData}
          showOdometer={showOdometer}
          onToggleDisplay={() => setShowOdometer(prev => !prev)}
        />
      </View>
      
      <View style={styles.bottomRow}>
        <DoorIndicator theme={theme} vehicleData={vehicleData} />
        <IndicatorPanel theme={theme} vehicleData={vehicleData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: -20, // Overlap with tachometer for integrated look
  },
  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
});

export default HondaFreedDashboard;
