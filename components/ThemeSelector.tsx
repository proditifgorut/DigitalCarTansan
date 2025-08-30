import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import Animated, { 
  useSharedValue, 
  withSpring, 
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { themes, ThemeType, themeNames } from '../utils/themes';

const { width, height } = Dimensions.get('window');

interface Props {
  currentTheme: ThemeType;
  onThemeSelect: (theme: ThemeType) => void;
  onClose: () => void;
}

const ThemeSelector: React.FC<Props> = ({ currentTheme, onThemeSelect, onClose }) => {
  const slideAnimation = useSharedValue(0);
  const scaleAnimation = useSharedValue(0);

  useEffect(() => {
    slideAnimation.value = withSpring(1, { damping: 20, stiffness: 90 });
    scaleAnimation.value = withTiming(1, { duration: 300 });
  }, []);

  const handleClose = () => {
    slideAnimation.value = withTiming(0, { duration: 300 });
    scaleAnimation.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onClose)();
    });
  };

  const containerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      slideAnimation.value,
      [0, 1],
      [height, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: slideAnimation.value * 0.8,
  }));

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Animated.View style={[StyleSheet.absoluteFillObject, overlayStyle]}>
        <BlurView intensity={50} style={StyleSheet.absoluteFillObject}>
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
            style={StyleSheet.absoluteFillObject}
          />
        </BlurView>
      </Animated.View>

      <Animated.View style={[styles.container, containerStyle]}>
        <BlurView intensity={100} style={styles.contentBlur}>
          <LinearGradient
            colors={['rgba(13,17,23,0.95)', 'rgba(22,27,34,0.95)']}
            style={styles.contentGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <BlurView intensity={80} style={styles.headerBlur}>
                <LinearGradient
                  colors={['rgba(88,166,255,0.2)', 'rgba(0,212,170,0.1)']}
                  style={styles.headerGradient}
                >
                  <Text style={styles.title}>🎨 THEME SELECTOR</Text>
                  <Text style={styles.subtitle}>Choose your perfect dashboard style</Text>
                </LinearGradient>
              </BlurView>
              
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <BlurView intensity={80} style={styles.closeBlur}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    style={styles.closeGradient}
                  >
                    <Text style={styles.closeText}>✕</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </View>
            
            {/* Themes Grid */}
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.themesGrid}>
                {Object.entries(themes).map(([key, theme], index) => (
                  <ThemeCard
                    key={key}
                    themeKey={key as ThemeType}
                    theme={theme}
                    isSelected={currentTheme === key}
                    onPress={() => onThemeSelect(key as ThemeType)}
                    index={index}
                  />
                ))}
              </View>
            </ScrollView>
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </View>
  );
};

interface ThemeCardProps {
  themeKey: ThemeType;
  theme: any;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ themeKey, theme, isSelected, onPress, index }) => {
  const animationValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    animationValue.value = withTiming(1, { 
      duration: 500,
      delay: index * 50 
    });
  }, []);

  const cardStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationValue.value,
      [0, 1],
      [50, 0],
      Extrapolation.CLAMP
    );
    
    const opacity = interpolate(
      animationValue.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale: scaleValue.value }
      ],
      opacity,
    };
  });

  const handlePress = () => {
    scaleValue.value = withSpring(0.95, { duration: 100 }, () => {
      scaleValue.value = withSpring(1, { duration: 100 });
    });
    onPress();
  };

  return (
    <Animated.View style={[styles.themeCard, cardStyle]}>
      <TouchableOpacity onPress={handlePress}>
        <BlurView intensity={60} style={styles.cardBlur}>
          <LinearGradient
            colors={isSelected ? 
              ['rgba(0,188,212,0.4)', 'rgba(0,188,212,0.2)'] :
              ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={[styles.cardGradient, isSelected && styles.selectedCard]}
          >
            {/* Theme Preview */}
            <View style={styles.themePreview}>
              <LinearGradient
                colors={theme.colors.gradient}
                style={styles.previewGradient}
              >
                <View style={styles.previewContent}>
                  {/* Mini Speedometer */}
                  <View style={[styles.miniSpeedometer, { borderColor: theme.colors.border }]}>
                    <View style={[styles.miniNeedle, { backgroundColor: theme.colors.accent }]} />
                    <View style={[styles.miniCenter, { backgroundColor: theme.colors.accent }]} />
                  </View>
                  
                  {/* Mini Indicators */}
                  <View style={styles.miniIndicators}>
                    <View style={[styles.miniIndicator, { backgroundColor: theme.colors.accent }]} />
                    <View style={[styles.miniIndicator, { backgroundColor: theme.colors.primary }]} />
                  </View>
                </View>
              </LinearGradient>
            </View>
            
            {/* Theme Name */}
            <View style={styles.themeInfo}>
              <Text style={[styles.themeName, { color: theme.colors.primary }]}>
                {themeNames[themeKey]}
              </Text>
              {isSelected && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedText}>✓ ACTIVE</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
  },
  contentBlur: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  contentGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },
  headerBlur: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
  },
  headerGradient: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#58A6FF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#8B949E',
    marginTop: 5,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 50,
    height: 50,
  },
  closeBlur: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  closeGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  themeCard: {
    width: (width - 45) / 2,
    marginBottom: 15,
  },
  cardBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  selectedCard: {
    borderColor: '#00BCD4',
    borderWidth: 2,
  },
  themePreview: {
    height: 100,
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  previewGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    alignItems: 'center',
  },
  miniSpeedometer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  miniNeedle: {
    width: 1.5,
    height: 20,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  miniCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  miniIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  miniIndicator: {
    width: 20,
    height: 4,
    borderRadius: 2,
  },
  themeInfo: {
    padding: 15,
    alignItems: 'center',
  },
  themeName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  selectedBadge: {
    backgroundColor: 'rgba(0,188,212,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  selectedText: {
    color: '#00BCD4',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ThemeSelector;
