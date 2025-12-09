import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // ✅ Use Expo's LinearGradient
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const BlacksfitWelcome = ({ navigation }: { navigation: any }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Slide up animation
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Scale animation
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Rotate animation for logo
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleGetStarted = () => {
    // Add button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to Signup
      navigation.navigate('Login');
      // MainDrawer
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#2d2d2d']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={styles.patternContainer}>
          {[...Array(20)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.patternDot,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.3],
                  }),
                },
              ]}
            />
          ))}
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Animated Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotateInterpolate },
                ],
              },
            ]}
          >
            <MaterialCommunityIcons name="tshirt-crew" size={80} color="#FFD700" />
          </Animated.View>

          {/* Brand Name */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Text style={styles.brandName}>BLACKSFIT</Text>
            <View style={styles.underline} />
          </Animated.View>

          {/* Tagline */}
          <Animated.View
            style={[
              styles.taglineContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Text style={styles.tagline}>
              African Elegance, Modern Style
            </Text>
            <Text style={styles.subTagline}>
              Embrace your heritage with contemporary fashion
            </Text>
          </Animated.View>

          {/* Get Started Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF8C00']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>GET STARTED</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={20}
                  color="#000"
                  style={styles.buttonIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Features */}
          <Animated.View
            style={[
              styles.featuresContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.featureText}>Premium Quality</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="palette" size={16} color="#FFD700" />
              <Text style={styles.featureText}>Authentic Designs</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="earth" size={16} color="#FFD700" />
              <Text style={styles.featureText}>African Heritage</Text>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  patternDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  underline: {
    width: 100,
    height: 3,
    backgroundColor: '#FFD700',
    marginTop: 10,
    borderRadius: 2,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  tagline: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTagline: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
  },
});

export default BlacksfitWelcome;