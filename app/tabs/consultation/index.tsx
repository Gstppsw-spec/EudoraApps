import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { io } from "socket.io-client";
import useStore from "../../../store/useStore";
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const socket = io("https://sys.eudoraclinic.com:3001");

const getDoctorClinic = async ({ queryKey }: any) => {
  const [, locationId] = queryKey;
  const res = await fetch(`${apiUrl}/getDoctorByLocationId/${locationId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const getMessages = async ({ queryKey }: any) => {
  const [, customerId, employeeId] = queryKey;
  const res = await fetch(
    `${apiUrl}/getMessages?sender_id=${employeeId}&sender_type=employee&receiver_id=${customerId}&receiver_type=userapps`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const sendMessages = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/sendMessages`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const sendMessagesImages = async ({
  receiver_id,
  sender_id,
  imageUri,
}: any) => {
  const formData = new FormData();
  formData.append("sender_id", sender_id);
  formData.append("sender_type", "userapps");
  formData.append("receiver_id", receiver_id);
  formData.append("receiver_type", "employee");
  formData.append("type", "image");
  formData.append("message", "");

  if (imageUri) {
    const filename = imageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("image", {
      uri: imageUri,
      name: filename,
      type,
    } as any);
  }

  const res = await fetch(`${apiUrl}/sendMessagesByCustomerApps`, {
    method: "POST",
    body: formData,
  });

  console.log(res);

  const text = await res.text(); // ambil raw response

  try {
    const json = JSON.parse(text);
    if (!res.ok || json.status !== "success") {
      throw new Error(json.message || "Gagal mengirim pesan");
    }
    return json;
  } catch (err) {
    const json = JSON.parse(text);
    Alert.alert("Gagal", "Ukuran foto terlalu besar, maks 2MB");
  }
};

const ChatScreen = () => {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const customerDetails = useStore((state) => state.customerDetails);

  const {
    data: doctorData,
    isLoading: isLoadingDoctor,
    error: errorDoctor,
    refetch: refetchDoctor,
    isRefetching: isRefetchingDoctor,
  } = useQuery({
    queryKey: [
      "getDoctorByLocationId",
      customerDetails?.locationCustomerRegister,
    ],
    queryFn: getDoctorClinic,
    enabled: !!customerDetails?.locationCustomerRegister,
  });

  const employeeId = 10;
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["getMessages", customerId, employeeId],
    queryFn: getMessages,
    enabled: !!customerId || !!employeeId,
  });

  const mutation = useMutation({
    mutationFn: sendMessages,
    onSuccess: (data) => {
      refetch();
    },
    onError: (error) => {
      console.error("Error posting data:", error);
    },
  });

  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (data?.data?.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 300);
    }
  }, [data]);

  const tabBarHeight = useBottomTabBarHeight();

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      sender_id: customerId,
      sender_type: "userapps",
      receiver_id: employeeId,
      receiver_type: "employee",
      message: newMessage,
      type: "text",
      is_read: 0,
    };

    mutation.mutate(newMsg);

    setNewMessage("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ offset: 0, animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: any) => (
    <View
      style={[
        styles.messageContainer,
        item.receiver_type == "employee"
          ? styles.sentMessage
          : styles.receivedMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.receiver_type == "employee"
            ? styles.sentBubble
            : styles.receivedBubble,
        ]}
      >
        {item.type === "image" ? (
          <TouchableOpacity
            onPress={() => {
              setPreviewUri(`${apiUrl}/${item.message}`);
              setPreviewVisible(true);
            }}
          >
            <Image
              source={{
                uri: `${apiUrl}/${item.message}`,
              }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                resizeMode: "cover",
              }}
            />
          </TouchableOpacity>
        ) : (
          <Text
            style={
              item.receiver_type === "employee"
                ? styles.sentMessageText
                : styles.messageText
            }
          >
            {item.message}
          </Text>
        )}

        <Text style={styles.messageTime}>{item.created_at}</Text>
      </View>
      <Modal visible={previewVisible} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
            onPress={() => setPreviewVisible(false)}
          >
            <Text style={{ color: "white", fontSize: 30 }}>×</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: previewUri }}
            style={{ width: "90%", height: "80%", resizeMode: "contain" }}
          />
        </View>
      </Modal>
    </View>
  );

  const onRefresh = () => {
    refetch();
  };

  const pickImage = async () => {
    // Meminta izin akses gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your photos to upload images"
      );
      return;
    }

    // Membuka image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
    setShowImagePreview(true);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
    setShowImagePreview(true);
  };

  const removeImage = () => {
    setImageUri(null);
  };

  const handleAttachmentPress = () => {
    Alert.alert(
      "Upload Gambar",
      "Pilih sumber gambar:",
      [
        {
          text: "Kamera",
          onPress: () => takePhoto(),
        },
        {
          text: "Galeri",
          onPress: () => pickImage(),
        },
        {
          text: "Batal",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const mutationImages = useMutation({
    mutationFn: sendMessagesImages,
    onSuccess: async (data) => {
      await refetch();
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300); // delay kecil agar data sempat masuk
      setShowImagePreview(false);
      removeImage();
    },
    onError: (error) => {
      console.error("Error posting data:", error);
      Alert.alert("Gagal", error.message);
    },
  });

  const sendImageMessage = () => {
    mutationImages.mutate({
      sender_id: customerId,
      receiver_id: employeeId,
      imageUri: imageUri,
    });
  };

  useEffect(() => {
    socket.emit("joinRoom", `userapps_${customerId}`);
    socket.on("newMessage", (message) => {
      console.log("New message received", message);
      queryClient.invalidateQueries(["getMessage", customerId]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [customerId]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error loading messages: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={tabBarHeight}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              source={{
                uri: `${apiUrl}/uploads/${doctorData?.doctorEuodora[0]?.image}`,
              }}
              style={styles.headerAvatar}
            />
            <View style={styles.headerText}>
              <Text style={styles.headerName}>
                {doctorData?.doctorEuodora[0]?.name}
              </Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onRefresh()}
            style={{ marginRight: 10 }}
          >
            <FontAwesome name="refresh" size={20} color="#B0174C" />
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={data?.data}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={handleAttachmentPress}
          >
            <Ionicons name="attach-outline" size={24} color="#666" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            placeholderTextColor={"black"}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={newMessage.trim() === ""}
          >
            <Ionicons
              name="send"
              size={24}
              color={newMessage.trim() === "" ? "#ccc" : "#B0174C"}
            />
          </TouchableOpacity>
        </View>

        <Modal
          visible={showImagePreview}
          transparent={true}
          onRequestClose={() => removeImage()}
        >
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => removeImage()}>
              <View style={styles.modalBackground} />
            </TouchableWithoutFeedback>

            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.fullSizeImage}
                resizeMode="contain"
              />

              {/* Tombol Tutup */}
              <TouchableOpacity
                style={styles.closePreviewButton}
                onPress={() => setShowImagePreview(false)}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>

              {/* ✅ Tombol Kirim */}
              <TouchableOpacity
                style={styles.sendImageButton}
                onPress={sendImageMessage}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sendImageButton: {
    marginTop: 20,
    backgroundColor: "#0d6efd",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },

  thumbnailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  removeImageButton: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  imageContainer: {
    width: "90%",
    height: "70%",
    position: "relative",
  },
  fullSizeImage: {
    width: "100%",
    height: "100%",
  },
  closePreviewButton: {
    position: "absolute",
    top: -40,
    right: -10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 16,
    marginRight: 12,
  },
  headerText: {
    justifyContent: "center",
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  headerStatus: {
    fontSize: 12,
    color: "#4CAF50",
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  sentMessage: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    marginLeft: 50,
  },
  receivedMessage: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginRight: 50,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  sentBubble: {
    backgroundColor: "#FFE5F8",
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  sentMessageText: {
    fontSize: 16,
    color: "#333",
  },
  messageTime: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    // paddingBottom: Platform.OS === "ios" ? 25 : 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginHorizontal: 8,
    fontSize: 16,
    color: "black",
  },
  attachmentButton: {
    padding: 8,
  },
  sendButton: {
    padding: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
