import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Theme } from '../utils/themes';

interface Props {
  theme: Theme;
}

const Clock: React.FC<Props> = ({ theme }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <Text style={[styles.timeText, { color: theme.colors.modern?.textSecondary }]}>
      {format(time, 'HH:mm')}
    </Text>
  );
};

const styles = StyleSheet.create({
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Clock;
