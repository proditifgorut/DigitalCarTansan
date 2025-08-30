import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Theme } from '../../utils/themes';
import { VehicleData } from '../../utils/mockData';

interface Props {
  theme: Theme;
  vehicleData: VehicleData;
}

const DoorIndicator: React.FC<Props> = ({ theme, vehicleData }) => {
  const activeColor = theme.colors.danger;
  const inactiveColor = theme.colors.honda?.iconInactive || '#444';

  const { doorFL, doorFR, doorRL, doorRR, trunk } = vehicleData;

  return (
    <View style={styles.container}>
      <Svg width="80" height="120" viewBox="0 0 100 180">
        {/* Car body */}
        <Path
          d="M20,10 Q50,0 80,10 L95,70 Q100,90 95,110 L80,170 Q50,180 20,170 L5,110 Q0,90 5,70 Z"
          fill={inactiveColor}
          stroke={theme.colors.border}
          strokeWidth="2"
        />
        {/* Windows */}
        <Path d="M25,15 L75,15 L85,60 L15,60 Z" fill="#222" />

        {/* Doors */}
        <Path d="M5,70 L48,70 L48,110 L5,110 Z" fill={doorFL ? activeColor : 'transparent'} />
        <Path d="M52,70 L95,70 L95,110 L52,110 Z" fill={doorFR ? activeColor : 'transparent'} />
        <Path d="M5,112 L48,112 L48,160 L5,160 Z" fill={doorRL ? activeColor : 'transparent'} />
        <Path d="M52,112 L95,112 L95,160 L52,160 Z" fill={doorRR ? activeColor : 'transparent'} />

        {/* Trunk */}
        <Path d="M20,170 Q50,180 80,170 L80,165 Q50,175 20,165 Z" fill={trunk ? activeColor : 'transparent'} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DoorIndicator;
