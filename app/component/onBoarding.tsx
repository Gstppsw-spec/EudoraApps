import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import useStore from "../../store/useStore";

const { width, height } = Dimensions.get('window');

const onboardingSlides = [
  {
    id: '1',
    title: 'EUDORA Treatment',
    description: 'Discover effective skin & body treatments that suits with your wellness\' needs. Explore a range of advanced solutions from our experts and professional teams.',
    bgImage: require('@/assets/images/banner4.jpg'),
  },
  {
    id: '2',
    title: 'Schedule Your Beauty Appointments',
    description: 'Easily book your appointments and check your skin & body progress - all in one click away',
    bgImage: require('@/assets/images/banner2.jpg'),
  },
  {
    id: '3',
    title: 'EUDORA Skincare & Bodycare',
    description: 'Find best skincare & bodycare products from EUDORA. You can also consult with our expert doctor for your skincare & bodycare solutions.',
    bgImage: require('@/assets/images/banner3.jpg'),
  }
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();
  const setHasOnboarding = useStore((state) => state.setHasOnboarding);

  const goToNextSlide = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < onboardingSlides.length) {
      slidesRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      router.replace('/authentication/otpWhatsapp');
      setHasOnboarding(true)
    }
  };

  const goToPreviousSlide = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      slidesRef.current?.scrollToIndex({ index: prevIndex });
      setCurrentIndex(prevIndex);
    }
  };

  const skipOnboarding = () => {
    router.replace('/authentication/otpWhatsapp');
    setHasOnboarding(true)
  };

  const renderItem = ({ item }: { item: typeof onboardingSlides[0] }) => (
    <View style={styles.slideContainer}>
      <ImageBackground 
        source={item.bgImage} 
        style={styles.slideBackground}
        resizeMode="cover"
      >
        {/* White gradient shadow at the bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.8)']}
          locations={[0.6, 1]}
          style={styles.gradientOverlay}
        />
      </ImageBackground>
      
      {/* Text content floating above the image */}
      <View style={styles.textContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={skipOnboarding}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={slidesRef}
        data={onboardingSlides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        {renderDots()}
        
        <View style={styles.navigationButtons}>
          {currentIndex > 0 && (
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={goToPreviousSlide}
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>←</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={goToNextSlide}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingSlides.length - 1 ? 'Get Started' : '→'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slideContainer: {
    width,
    height,
    position: 'relative',
  },
  slideBackground: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  textContent: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    lineHeight: 24,
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  skipButton: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 30,
  },
  navButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#B0174C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});