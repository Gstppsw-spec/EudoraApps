import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router'; // Import Link from expo-router
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PersonalDataScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Link href="/index" style={styles.backButton}> 
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Link>
        <Text style={styles.headerTitle}>Personal Data</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} // Replace with actual avatar URL
            style={styles.avatar}
          />
        </View>

        {/* Full Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Full Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              defaultValue="Aaron Ramsdale"
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Email Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              defaultValue="aaronramsdale@gmail.com"
              editable={false}
            />
          </View>
        </View>

        {/* Phone Number Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Date of Birth Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date of Birth</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              defaultValue="December 20, 1998"
              editable={false}
            />
          </View>
        </View>

        {/* Gender Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gender</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              defaultValue="Male"
              editable={false}
            />
          </View>
        </View>

        {/* Save Changes Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  input: {
    fontSize: 16,
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#FFA500',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PersonalDataScreen;