export interface Theme {
  colors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    warning: string;
    danger: string;
    border: string;
    gradient: string[];
    modern?: {
      gaugeBackground: string;
      needle: string;
      textPrimary: string;
      textSecondary: string;
      rpmGradient: string[];
      speedGradient: string[];
      powerGradient: string[]; // New gradient for power gauge
    }
  };
  statusBarStyle: 'light-content' | 'dark-content';
}

export type ThemeType = 
  | 'modern-futuristic'
  | 'honda-freed';

export const themes: Record<ThemeType, Theme> = {
  'modern-futuristic': {
    colors: {
      background: '#000000',
      primary: '#FFFFFF',
      secondary: '#A0A0A0',
      accent: '#00FFFF',
      warning: '#FFD700',
      danger: '#FF4500',
      border: '#222222',
      gradient: ['#050505', '#101010', '#000000'],
      modern: {
        gaugeBackground: '#101010',
        needle: '#FFFFFF',
        textPrimary: '#FFFFFF',
        textSecondary: '#A0A0A0',
        rpmGradient: ['#8A2BE2', '#FF1493'],
        speedGradient: ['#00BFFF', '#00FF7F'],
        powerGradient: ['#32CD32', '#ADFF2F'],
      }
    },
    statusBarStyle: 'light-content',
  },
  'honda-freed': {
    colors: {
      background: '#0A0A0A',
      primary: '#FFA500',
      secondary: '#E0E0E0',
      accent: '#FF8C00',
      warning: '#FFD700',
      danger: '#FF4500',
      border: '#333333',
      gradient: ['#0A0A0A', '#1A1A1A', '#0A0A0A'],
    },
    statusBarStyle: 'light-content',
  },
};
