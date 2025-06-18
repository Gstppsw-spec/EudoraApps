import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  Alert,
  Animated,
  Easing
} from 'react-native';

const NotificationDetail = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const {
    title,
    time,
    message,
    description,
    id,
    setNotifications: setNotificationsString
  } = params;

  const setNotifications = React.useCallback((updater) => {
    try {
      const fn = new Function('return ' + setNotificationsString)();
      if (typeof fn === 'function') {
        fn(updater);
      }
    } catch (error) {
      console.error('Error reconstructing setNotifications:', error);
    }
  }, [setNotificationsString]);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDelete = () => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete", 
          onPress: () => {
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setNotifications(prev => prev.filter(n => n.id !== id));
              router.back();
            });
          }
        }
      ]
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>

      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={32} color="#FFB900" />
          </View>

          <Text style={styles.title}>{title}</Text>
          
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color="#888888" />
            <Text style={styles.time}>{time}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </Animated.ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Delete Notification</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  iconContainer: {
    alignSelf: 'center',
    backgroundColor: '#FFF8E6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  time: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 20,
  },
  message: {
    fontSize: 16,
    color: '#444444',
    marginBottom: 20,
    lineHeight: 24,
  },
  descriptionContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default NotificationDetail;