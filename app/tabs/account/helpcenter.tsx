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
            <Ionicons name="arrow-back" size={24} color="#9c27b0" />
          </View>
        </Link>
        <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* App Title */}
        <Text style={styles.appName}>Eudora Aesthetic Clinic</Text>
        <Text style={styles.version}>Versi 1.2.0</Text>

        {/* App Description */}
        <Section title="Tentang Kami">
          <Paragraph>
            Eudora Aesthetic Clinic adalah aplikasi manajemen klinik kecantikan terintegrasi yang menyediakan solusi lengkap untuk perawatan kulit, tubuh, dan wajah.
          </Paragraph>
        </Section>

        {/* Features */}
        <Section title="Fitur Utama">
          <FeatureItem icon="calendar-clock" text="Booking online 24 jam" />
          <FeatureItem icon="face-woman-profile" text="Konsultasi virtual" />
          <FeatureItem icon="chart-areaspline" text="Tracking progress" />
          <FeatureItem icon="credit-card-check" text="Pembayaran digital" />
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
        </Section>

        {/* Social Media */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Media Sosial</Text>
          <View style={styles.socialIcons}>
            <SocialIcon name="instagram" link="https://instagram.com/eudoraaesthetic" />
            <SocialIcon name="whatsapp" link="https://wa.me/628118888222" />
          </View>
        </View>

        <Text style={styles.footer}>
          © {new Date().getFullYear()} Eudora Aesthetic Clinic
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
    <MaterialCommunityIcons name={icon} size={20} color="#9c27b0" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const ContactItem = ({ icon, text, link }) => (
  <Link href={link} style={styles.contactLink}>
    <View style={styles.contactItem}>
      <MaterialCommunityIcons name={icon} size={20} color="#9c27b0" />
      <Text style={styles.contactText}>{text}</Text>
    </View>
  </Link>
);

const SocialIcon = ({ name, link }) => (
  <Link href={link} style={styles.socialLink}>
    <FontAwesome name={name} size={24} color="#9c27b0" />
  </Link>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E6', // Cream background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF8E6',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE7D6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7B1FA2',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFF8E6',
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9C27B0',
    textAlign: 'center',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7B1FA2',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#616161',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#616161',
  },
  socialSection: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7B1FA2',
    marginBottom: 12,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 24,
  },
  footer: {
    fontSize: 13,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AboutApp;