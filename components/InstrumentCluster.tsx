import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Speedometer from './Speedometer';
import RPMMeter from './RPMMeter';
import EnergyCell from './EnergyCell';
import WarningLights from './WarningLights';
import GearIndicator from './GearIndicator';
import { Theme } from '../utils/themes';
import { VehicleData } from '../utils/mockData';
import { Fuel, Thermometer } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Props {
  theme: Theme;
  vehicleData: VehicleData;
}

const InstrumentCluster: React.FC<Props> = ({ theme, vehicleData }) => {
  return (
    <View style={styles.container}>
      <EnergyCell 
        theme={theme} 
        value={vehicleData.fuelLevel}
        maxValue={100}
        Icon={Fuel}
        unit="%"
        isWarning={vehicleData.fuelLevel < 20}
      />
      
      <View style={styles.centerColumn}>
        <WarningLights theme={theme} vehicleData={vehicleData} />
        
        <View style={styles.gaugeContainer}>
          <RPMMeter 
            theme={theme} 
            rpm={vehicleData.rpm}
            maxRpm={8000}
          />
          <Speedometer 
            theme={theme} 
            speed={vehicleData.speed}
            maxSpeed={200}
          />
        </View>

        <GearIndicator theme={theme} gear={vehicleData.gear} />
      </View>

      <EnergyCell 
        theme={theme} 
        value={vehicleData.engineTemp}
        maxValue={120}
        Icon={Thermometer}
        unit="°"
        isWarning={vehicleData.engineTemp > 100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  centerColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  gaugeContainer: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});

export default InstrumentCluster;
