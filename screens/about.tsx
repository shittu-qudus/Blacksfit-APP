import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ChevronDown, Users, Heart, Target, Globe } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const features = [
  {
    Icon: Users,
    title: 'Community Unity',
    desc: "Built on Ubuntu — together we rise.",
  },
  {
    Icon: Heart,
    title: 'Cultural Heritage',
    desc: 'Designs inspired by 250+ Nigerian traditions.',
  },
  {
    Icon: Target,
    title: 'Purposeful Design',
    desc: 'Function-first apparel for modern lives.',
  },
  {
    Icon: Globe,
    title: 'African Excellence',
    desc: 'Quality, crafted for the continent — worn everywhere.',
  },
];

const BlacksfitAboutProfessional: React.FC = () => {
  const navigation = useNavigation<any>();

  // Scroll parallax value
  const scrollY = useRef(new Animated.Value(0)).current;

  // Entrance animations (staged)
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(18)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(20)).current;
  const featuresOpacity = useRef(new Animated.Value(0)).current;
  const featuresTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // simple staged entrance
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(heroTranslate, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(120),
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslate, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(120),
      Animated.parallel([
        Animated.timing(featuresOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(featuresTranslate, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const parallax = (multiplier: number) =>
    scrollY.interpolate({
      inputRange: [0, height],
      outputRange: [0, height * multiplier],
      extrapolate: 'clamp',
    });

  return (
    <ScrollView>
      <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Hero */}
        <Animated.View style={[styles.heroSection, { transform: [{ translateY: parallax(0.03) }] }]}>
          <View style={styles.backgroundContainer}>
            <Animated.View style={[styles.backgroundCircle1, { transform: [{ translateY: parallax(0.1) }] }]} />
            <Animated.View style={[styles.backgroundCircle2, { transform: [{ translateY: parallax(-0.08) }] }]} />
            <Animated.View style={[styles.backgroundCircle3, { transform: [{ translateY: parallax(0.14) }] }]} />
          </View>

          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: heroOpacity,
                transform: [{ translateY: heroTranslate }],
              },
            ]}
          >
            <Text style={styles.brand}>BLACKSFIT</Text>
            <View style={styles.brandDivider} />
            <Text style={styles.tagline}>Heritage-driven apparel · Contemporary fit</Text>
            <Text style={styles.lead}>
              Premium clothing rooted in African craft and modern performance — designed to move with you.
            </Text>

            <View style={styles.chevBox}>
              <ChevronDown size={26} color="rgba(209, 213, 219, 0.95)" />
            </View>
          </Animated.View>
        </Animated.View>

        {/* Body content */}
        <Animated.ScrollView
          style={styles.body}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.section,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslate }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Our Story</Text>
            <View style={styles.sectionDivider} />

            <Text style={styles.paragraph}>
              BLACKSFIT began with a simple conviction — great clothing should celebrate culture and perform
              impeccably. We collaborate with local craftspeople, study traditional motifs, and reimagine them
              into refined, wearable collections.
            </Text>

            <View style={styles.visualCard}>
              <View style={styles.visualInner}>
                <View style={styles.rowDots}>
                  <View style={styles.dotSmall} />
                  <View style={[styles.dotSmall, styles.dotOutline]} />
                  <View style={styles.dotSmall} />
                </View>
                <Text style={styles.visualNumber}>250+</Text>
                <Text style={styles.visualLabel}>Ethnic influences reinterpreted</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.section,
              styles.featuresWrap,
              {
                opacity: featuresOpacity,
                transform: [{ translateY: featuresTranslate }],
              },
            ]}
          >
            <Text style={styles.sectionTitleDark}>Design Principles</Text>
            <View style={[styles.sectionDivider, styles.sectionDividerDark]} />

            <View style={styles.featuresGrid}>
              {features.map((f, i) => {
                const Icon = f.Icon;
                return (
                  <View key={i} style={styles.card}>
                    <View style={styles.cardTop}>
                      <View style={styles.iconWrap}>
                        <Icon size={22} color="#111827" />
                      </View>
                      <Text style={styles.cardTitle}>{f.title}</Text>
                    </View>
                    <Text style={styles.cardDesc}>{f.desc}</Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          <View style={[styles.section, styles.missionSection]}>
            <Text style={styles.sectionTitleDark}>Mission</Text>
            <View style={[styles.sectionDivider, styles.sectionDividerDark]} />
            <Text style={styles.paragraph}>
              To craft premium garments that honor African legacy while delivering contemporary comfort and durability.
            </Text>

            <View style={styles.missionGrid}>
              <View style={styles.missionCard}>
                <Text style={styles.missionTitle}>Sustainable Craft</Text>
                <Text style={styles.missionText}>Partnering with artisans & using responsible materials.</Text>
              </View>
              <View style={styles.missionCard}>
                <Text style={styles.missionTitle}>Designed for Life</Text>
                <Text style={styles.missionText}>Versatile pieces for the city, the studio, and travel.</Text>
              </View>
            </View>
          </View>

          <View style={[styles.section, styles.ctaWrap]}>
            <Text style={styles.sectionTitleDark}>Join BLACKSFIT</Text>
            <View style={[styles.sectionDivider, styles.sectionDividerDark]} />
            <Text style={styles.paragraph}>Discover collections that fuse heritage and performance.</Text>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Shop' as never)}
            >
              <Text style={styles.ctaText}>Shop the Collection</Text>
            </TouchableOpacity>

            <Text style={styles.muted}>Taxes & shipping calculated at checkout • Free returns within 14 days</Text>
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* HERO */
  heroSection: {
    height: Math.round(height * 0.72),
    backgroundColor: '#0B0B0B',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundCircle1: {
    position: 'absolute',
    top: height * 0.18,
    left: width * 0.12,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#fff',
    opacity: 0.04,
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: height * 0.08,
    right: width * 0.06,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#D1D5DB',
    opacity: 0.03,
  },
  backgroundCircle3: {
    position: 'absolute',
    bottom: height * 0.25,
    left: width * 0.33,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#9CA3AF',
    opacity: 0.03,
  },

  heroContent: {
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: '#fff',
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  brandDivider: {
    width: 84,
    height: 2,
    backgroundColor: '#fff',
    marginVertical: 18,
  },
  tagline: {
    color: 'rgba(209,213,219,0.95)',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  lead: {
    color: 'rgba(209,213,219,0.95)',
    fontSize: 15,
    maxWidth: width * 0.82,
    textAlign: 'center',
    lineHeight: 22,
  },
  chevBox: {
    marginTop: 28,
  },

  /* BODY */
  body: {
    backgroundColor: '#fff',
  },
  section: {
    paddingVertical: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitleDark: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B1220',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionDivider: {
    width: 72,
    height: 2,
    backgroundColor: '#111827',
    marginBottom: 18,
  },
  sectionDividerDark: {
    backgroundColor: '#111827',
  },
  paragraph: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 860,
    marginBottom: 18,
  },

  /* Visual card */
  visualCard: {
    marginTop: 22,
    alignSelf: 'center',
    width: Math.min(width * 0.86, 760),
  },
  visualInner: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 26,
    alignItems: 'center',
  },
  rowDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dotSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  dotOutline: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#fff',
  },
  visualNumber: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  visualLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
  },

  /* Features Grid */
  featuresWrap: {
    backgroundColor: '#FAFAFB',
  },
  featuresGrid: {
    width: '100%',
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: width >= 720 ? '48%' : '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6E7EA',
    shadowColor: '#000',
    shadowOpacity: Platform.select({ ios: 0.04, android: 0.06 }),
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardDesc: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },

  /* mission */
  missionSection: {
    backgroundColor: '#fff',
  },
  missionGrid: {
    marginTop: 18,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  missionCard: {
    width: width >= 720 ? '48%' : '100%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  missionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },

  /* CTA */
  ctaWrap: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  ctaButton: {
    marginTop: 18,
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 6,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  muted: {
    marginTop: 12,
    color: '#9CA3AF',
    fontSize: 12,
  },
});

export default BlacksfitAboutProfessional;
