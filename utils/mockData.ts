export interface VehicleData {
  speed: number;
  rpm: number;
  powerOutput: number; // New property for the power gauge
  fuelLevel: number;
  engineTemp: number;
  gear: string;
  hazardLights: boolean;
  engineCheck: boolean;
  handBrake: boolean;
  seatbelt: boolean;
  highBeam: boolean;
  lowBeam: boolean;
  turnSignalLeft: boolean;
  turnSignalRight: boolean;
  odometer: number;
  tripmeter: number;
  range: number;
  outsideTemp: number;
  doorFL: boolean;
  doorFR: boolean;
  doorRL: boolean;
  doorRR: boolean;
  trunk: boolean;
}

const gears = ['P', 'R', 'N', 'D', '1', '2', '3', '4'];

const initialData: VehicleData = {
  speed: 0,
  rpm: 800,
  powerOutput: 0,
  fuelLevel: 75,
  engineTemp: 90,
  gear: 'P',
  hazardLights: false,
  engineCheck: false,
  handBrake: true,
  seatbelt: false,
  highBeam: false,
  lowBeam: false,
  turnSignalLeft: false,
  turnSignalRight: false,
  odometer: 123456,
  tripmeter: 123.4,
  range: 450,
  outsideTemp: 10,
  doorFL: false,
  doorFR: false,
  doorRL: false,
  doorRR: false,
  trunk: false,
};

export const getRealisticData = (currentData: VehicleData = initialData): VehicleData => {
  let { speed, rpm, gear, handBrake, fuelLevel, engineTemp, odometer, tripmeter, range, powerOutput } = currentData;
  
  if (handBrake || ['P', 'N'].includes(gear)) {
    speed = Math.max(0, speed - 10);
  } else {
    const speedChange = (Math.random() - 0.4) * 15;
    speed += speedChange;
  }
  speed = Math.max(0, Math.min(220, speed));

  if (speed > 5) {
    rpm = 900 + (speed / 220) * 6000 + (Math.random() - 0.5) * 400;
  } else {
    rpm = 800 + (Math.random() - 0.5) * 100;
  }
  rpm = Math.max(800, Math.min(8000, rpm));
  
  // Calculate power output based on RPM and speed
  powerOutput = (rpm / 8000) * (speed / 220) * 100 + Math.random() * 5;
  powerOutput = Math.max(0, Math.min(100, powerOutput));
  if (speed < 5) powerOutput = 0;

  const distanceTraveled = speed / 3600 * 1.5; // distance in km for 1.5 seconds interval
  odometer += distanceTraveled;
  tripmeter += distanceTraveled;
  range -= distanceTraveled * 1.2; // Assume less efficient driving
  range = Math.max(0, range);

  fuelLevel -= 0.02;
  fuelLevel = Math.max(0, fuelLevel);

  engineTemp += (speed > 80 ? 0.2 : -0.1) * Math.random();
  engineTemp = Math.max(70, Math.min(120, engineTemp));

  return {
    ...currentData,
    speed,
    rpm,
    powerOutput,
    fuelLevel,
    engineTemp,
    odometer,
    tripmeter,
    range,
    engineCheck: Math.random() > 0.998,
    handBrake: speed < 1 ? currentData.handBrake : false,
    seatbelt: currentData.seatbelt,
    highBeam: Math.random() > 0.99 ? !currentData.highBeam : currentData.highBeam,
    lowBeam: !currentData.highBeam && (Math.random() > 0.98 ? !currentData.lowBeam : currentData.lowBeam),
  };
};
