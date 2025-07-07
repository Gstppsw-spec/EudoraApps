import React from 'react';
import { ScrollView, StyleSheet, Text, View, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for the back button
import { Link } from 'expo-router'; // Use expo-router for navigation if applicable

const PrivacyPolicyScreen = () => {
  const insets = useSafeAreaInsets();
  const lastUpdated = 'July 7, 2024';

  const handleEmailPress = () => {
    Linking.openURL('mailto:privacy@yourapp.com');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section with Back Button */}
        <View style={styles.header}>
          <Link href="/tabs/account" style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#FFB900" />
          </Link>
          <Text style={styles.title}>Privacy Policy</Text>
        </View>

        <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>

        <Section title="1. Introduction">
          <Paragraph>
            We respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we handle your information when you use our app.
          </Paragraph>
        </Section>

        <Section title="2. Information We Collect">
          <Paragraph>We may collect the following types of information:</Paragraph>
          <BulletPoint>Account information (name, email, etc.)</BulletPoint>
          <BulletPoint>Device information (model, OS version)</BulletPoint>
          <BulletPoint>Usage data (feature interactions, session duration)</BulletPoint>
          <BulletPoint>Location data (if you grant permission)</BulletPoint>
        </Section>

        <Section title="3. How We Use Your Data">
          <Paragraph>Your data helps us to:</Paragraph>
          <BulletPoint>Provide and improve our services</BulletPoint>
          <BulletPoint>Personalize your experience</BulletPoint>
          <BulletPoint>Respond to your requests</BulletPoint>
          <BulletPoint>Ensure app security</BulletPoint>
        </Section>

        <Section title="4. Data Sharing">
          <Paragraph>
            We don't sell your data. We may share information with:
          </Paragraph>
          <BulletPoint>Service providers who assist our operations</BulletPoint>
          <BulletPoint>Legal authorities when required by law</BulletPoint>
        </Section>

        <Section title="5. Your Rights">
          <Paragraph>You can:</Paragraph>
          <BulletPoint>Access your personal data</BulletPoint>
          <BulletPoint>Request corrections or deletion</BulletPoint>
          <BulletPoint>Opt-out of marketing communications</BulletPoint>
          <BulletPoint>Withdraw consent where applicable</BulletPoint>
        </Section>
        
        {/* Footer Section - Optional Email for Contact */}
        <Text style={styles.footer} onPress={handleEmailPress}>
          If you have any questions, contact us at {' '}
          <Text style={styles.link}>privacy@yourapp.com</Text>
        </Text>
      </ScrollView>
    </View>
  );
};

// Reusable components
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Paragraph = ({ children }) => (
  <Text style={styles.paragraph}>{children}</Text>
);

const BulletPoint = ({ children }) => (
  <View style={styles.bulletContainer}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
    // Add any additional styling for the back button here
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 12,
  },
  bulletContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    marginRight: 8,
    color: '#444',
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  link: {
    color: '#0066cc',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 30,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default PrivacyPolicyScreen;