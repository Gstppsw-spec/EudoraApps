import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const AboutApp = () => {
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Link href=".." asChild>
          <View style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFB900" />
          </View>
        </Link>
        <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* App Title with Top Padding */}
        <View style={styles.titleContainer}>
          <Text style={styles.appName}>Eudora Aesthetic Clinic</Text>
          <Text style={styles.version}>Versi 1.2.0</Text>
        </View>

        {/* App Description */}
        <Section title="Tentang Kami">
          <Paragraph>
            Eudora Aesthetic Clinic adalah aplikasi manajemen klinik kecantikan terintegrasi yang menyediakan solusi lengkap untuk perawatan kulit, tubuh, dan wajah. Aplikasi ini dirancang untuk memberikan pengalaman terbaik baik bagi pasien maupun staf klinik.
          </Paragraph>
        </Section>

        {/* Features */}
        <Section title="Fitur Utama">
          <FeatureItem icon="calendar-clock" text="Booking online 24 jam" />
          <FeatureItem icon="face-woman-profile" text="Konsultasi virtual dengan dokter" />
          <FeatureItem icon="chart-areaspline" text="Tracking progress perawatan" />
          <FeatureItem icon="credit-card-check" text="Pembayaran digital terintegrasi" />
          <FeatureItem icon="bell-badge" text="Pengingat jadwal perawatan" />
          <FeatureItem icon="medical-bag" text="Katalog perawatan lengkap" />
        </Section>

        {/* Contact */}
        <Section title="Kontak Kami">
          <ContactItem 
            icon="email" 
            text="info@eudora-aesthetic.com" 
            link="mailto:info@eudora-aesthetic.com" 
          />
          <ContactItem 
            icon="phone" 
            text="(021) 5567-8899" 
            link="tel:+622155678899" 
          />
          <ContactItem 
            icon="map-marker" 
            text="Eudora Tower Lt. 5, Jl. Aesthetic No. 88, Jakarta" 
            link="https://maps.app.goo.gl/eudora" 
          />
        </Section>

        {/* Social Media */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Media Sosial</Text>
          <View style={styles.socialIcons}>
            <SocialIcon name="instagram" link="https://instagram.com/eudoraaesthetic" />
            <SocialIcon name="whatsapp" link="https://wa.me/628118888222" />
            <SocialIcon name="facebook" link="https://facebook.com/eudoraaesthetic" />
            <SocialIcon name="youtube-play" link="https://youtube.com/eudoraaesthetic" />
          </View>
        </View>

        <Text style={styles.footer}>
          © {new Date().getFullYear()} Eudora Aesthetic Clinic. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
};

// Reusable Components
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Paragraph = ({ children }) => (
  <Text style={styles.paragraph}>{children}</Text>
);

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <MaterialCommunityIcons name={icon} size={20} color="#FFB900" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const ContactItem = ({ icon, text, link }) => (
  <Link href={link} style={styles.contactLink}>
    <View style={styles.contactItem}>
      <MaterialCommunityIcons name={icon} size={20} color="#FFB900" />
      <Text style={styles.contactText}>{text}</Text>
    </View>
  </Link>
);

const SocialIcon = ({ name, link }) => (
  <Link href={link} style={styles.socialLink}>
    <FontAwesome name={name} size={24} color="#FFB900" />
  </Link>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40, // Added padding at top
    borderBottomWidth: 1,
    borderBottomColor: '#FFF3E0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20, // Reduced top padding
    paddingBottom: 40,
  },
  titleContainer: {
    marginBottom: 30,
    paddingTop: 10, // Added padding
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#9e9e9e',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 30, // Increased spacing
    backgroundColor: '#FFFDF6',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#616161',
  },
  contactLink: {
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#616161',
  },
  socialSection: {
    marginTop: 25,
    marginBottom: 35,
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 15,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 25,
    marginTop: 10,
  },
  socialLink: {
    padding: 10,
  },
  footer: {
    fontSize: 13,
    color: '#9e9e9e',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
});

export default AboutApp;