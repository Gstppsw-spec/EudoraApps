import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const notificationsData = [
  {
    date: "Today",
    notifications: [
      {
        id: '1',
        title: 'Appointment Reminder',
        time: '08:23 AM',
        message: 'Hi Aaron, just a friendly reminder that your appointment with [Barber] is coming up tomorrow at [Time]. We lo...',
        icon: 'calendar',
      },
      {
        id: '2',
        title: 'Special Offer Alert',
        time: '08:23 AM',
        message: 'Don\'t miss out! We\'re offering 20% off all grooming products this week. Visit [Barbershop Name] to stock up on yo...',
        icon: 'pricetag',
      },
      {
        id: '3',
        title: 'New Clinic Introduction',
        time: '08:23 AM',
        message: 'Exciting news! Please welcome our newest Clinic Eudora Aeon Jakarta Garden City, Book your appointment t...',
        icon: 'business',
      },
    ]
  },
  {
    date: "Yesterday",
    notifications: [
      {
        id: '4',
        title: 'Exclusive Event Invitation',
        time: '08:23 AM',
        message: 'You\'re invited! Join us for our exclusive customer appreciation event this Saturday from 4-7 PM. Enjoy free refr...',
        icon: 'gift',
      },
      {
        id: '5',
        title: 'Feedback Request',
        time: '08:23 AM',
        message: '',
        icon: 'chatbox',
      },
    ]
  }
];

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Notifications</Text>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notificationsData.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionHeader}>{section.date}</Text>
            
            <View style={styles.notificationsContainer}>
              {section.notifications.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.notificationContainer}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={20} color="#FFB900" />
                  </View>
                  
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>{item.title}</Text>
                      <Text style={styles.notificationTime}>{item.time}</Text>
                    </View>
                    
                    {item.message ? (
                      <Text style={styles.notificationMessage}>{item.message}</Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        {/* Add extra space at the bottom */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40, // Added more padding at the top
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30, // Extra space at the bottom
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
    color: '#333',
  },
  notificationsContainer: {
    backgroundColor: '#fff',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 2, // Align icon with title
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 30,
  },
});

export default Notifications;