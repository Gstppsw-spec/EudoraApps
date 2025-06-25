import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "../../../store/useStore";


const getMessages = async ({ queryKey }: any) => {
  const [, customerId, employeeId] = queryKey;
  const res = await fetch(
    `https://sys.eudoraclinic.com:84/apieudora/getMessages?sender_id=${employeeId}&sender_type=employee&receiver_id=${customerId}&receiver_type=userapps`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const sendMessages = async (formData: any) => {
  const response = await axios.post(
    "https://sys.eudoraclinic.com:84/apieudora/sendMessages",
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const ChatScreen = () => {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
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
      queryClient.invalidateQueries(["getMessages", customerId, employeeId]);
    },
    onError: (error) => {
      console.error("Error posting data:", error);
    },
  });


  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);

  const tabBarHeight = useBottomTabBarHeight();

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      sender_id: customerId,
      sender_type: 'userapps',
      receiver_id: employeeId,
      receiver_type: 'employee',
      message: newMessage,
      type: 'text'
    };

    mutation.mutate(newMsg)

    setNewMessage("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ offset: 0, animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: any) => (
    <View
      style={[
        styles.messageContainer,
        item.receiver_type == 'employee' ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      {!item.employee && (
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
          style={styles.avatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          item.receiver_type == 'employee' ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        <Text style={item.receiver_type == 'employee' ? styles.sentMessageText : styles.messageText}>
          {item.message}
        </Text>
        <Text style={styles.messageTime}>{item.created_at}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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
                uri: "https://randomuser.me/api/portraits/women/44.jpg",
              }}
              style={styles.headerAvatar}
            />
            <View style={styles.headerText}>
              <Text style={styles.headerName}>Doctor</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={data?.data}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachmentButton}>
            <Ionicons name="attach-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={newMessage.trim() === ""}
          >
            <Ionicons
              name="send"
              size={24}
              color={newMessage.trim() === "" ? "#ccc" : "#FFB900"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    // paddingTop: Platform.OS === "ios" ? 50 : 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    backgroundColor: "#FFECB3",
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
  },
  attachmentButton: {
    padding: 8,
  },
  sendButton: {
    padding: 8,
  },
});

export default ChatScreen;
