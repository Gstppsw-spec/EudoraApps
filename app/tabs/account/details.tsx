import HeaderWithBack from "@/app/component/headerWithBack";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import useStore from "../../../store/useStore";

const PersonalDataScreen = () => {
  const customerDetails = useStore((state) => state.customerDetails);
  const [tempImage, setTempImage] = useState(null);
  const profileImage = useStore((state) => state.profileImage);
  const setProfileImage = useStore((state) => state.setProfileImage);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handlePickOption = () => {
    Alert.alert("Pilih Foto", "Ambil dari kamera atau galeri?", [
      { text: "Kamera", onPress: openCamera },
      { text: "Galeri", onPress: openGallery },
      { text: "Batal", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true, // ✅ ini penting!
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const base64Img = `data:${asset.mimeType};base64,${asset.base64}`;
      setTempImage(base64Img);
      setPreviewVisible(true); // tampilkan preview
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your photos to upload images"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const base64Img = `data:${asset.mimeType};base64,${asset.base64}`;
      setTempImage(base64Img);
      setPreviewVisible(true);
    }
  };

  const confirmImage = () => {
    if (setProfileImage) {
      setProfileImage(tempImage);
    }
    setPreviewVisible(false);
    setTempImage(null);
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Personal Data" backHref="/tabs/account" />
      <ScrollView style={styles.content}>
        {/* Avatar Section */}

        <TouchableOpacity
          onPress={handlePickOption}
          style={styles.avatarContainer}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="user" size={60} color="#aaa" />
            </View>
          )}
          <Text style={styles.changeText}>Ubah Foto Profil</Text>
        </TouchableOpacity>

        {/* Full Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Full Name</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} value={customerDetails?.fullname} />
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
              value={customerDetails?.email}
              editable={false}
            />
          </View>
        </View>

        {/* Phone Number Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} value={customerDetails?.phone} />
          </View>
        </View>

        {/* Date of Birth Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date of Birth</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={customerDetails?.dateofbirth}
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
              value={customerDetails?.gender === "F" ? "FEMALE" : "MALE"}
              editable={false}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={previewVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.previewText}>Pratinjau Gambar</Text>
            {tempImage && (
              <Image source={{ uri: tempImage }} style={styles.previewImage} />
            )}
            <View style={styles.buttonGroup}>
              <Button title="Gunakan" onPress={confirmImage} />
              <Button
                title="Batal"
                color="gray"
                onPress={() => setPreviewVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  input: {
    fontSize: 16,
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "#B0174C",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginVertical: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 10
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  changeText: {
    marginTop: 10,
    color: "#007bff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  previewText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    width: "100%",
  },
});

export default PersonalDataScreen;
