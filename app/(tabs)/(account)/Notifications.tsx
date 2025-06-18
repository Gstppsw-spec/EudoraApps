import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Appointment Reminder',
      time: '08:23 AM',
      message: 'Hi Aaron, just a friendly reminder about your appointment.',
      description: 'Full appointment details here',
      date: 'Today'
    },
    {
      id: '2',
      title: 'Special Offer',
      time: '09:15 AM',
      message: '20% discount on all services this week!',
      description: 'Discount valid until Sunday',
      date: 'Today'
    }
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification) => (
          <Link
            key={notification.id}
            href={{
              pathname: '/NotificationDetail',
              params: {
                ...notification,
                setNotifications: JSON.stringify(setNotifications)
              }
            }}
            asChild
          >
            <TouchableOpacity style={styles.notificationItem}>
              <View style={styles.notificationIcon}>
                <Ionicons name="notifications" size={24} color="#FFB900" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.message} numberOfLines={1}>
                  {notification.message}
                </Text>
                <Text style={styles.time}>{notification.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  notificationIcon: {
    backgroundColor: '#FFF8E6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999999',
  },
});

export default NotificationsScreen;