import ErrorView from "@/app/component/errorView";
import LoadingView from "@/app/component/loadingView";
import useStore from "@/store/useStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const socket = io("https://sys.eudoraclinic.com:3001");

const getChatListCustomer = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;

  const res = await fetch(
    `${apiUrl}/getChatListCustomer?user_id=${customerId}&user_type=userapps`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

export default function ChatList({ navigation }: any) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const {
    data,
    isLoading: isLoadingOutletAccess,
    error: errorOutletAccess,
    refetch: refetchOutletAccess,
    isRefetching: isRefetchingOutletAccess,
  } = useQuery({
    queryKey: ["getChatListCustomer", customerId],
    queryFn: getChatListCustomer,
    enabled: !!customerId,
  });

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("joinRoom", `userapps_${customerId}`);
    });
    socket.on("newMessage", (message) => {
      queryClient.invalidateQueries({
        queryKey: ["getChatListCustomer", customerId],
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [customerId]);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([refetchOutletAccess()]);
    } catch (error) {
      console.log("Error refreshing:", error);
    }

    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        router.push({
          pathname: "/chat/detailChat",
          params: {
            employeeId: item.chat_user_id,
            locationName: item.username,
            imageLocation: item.photo,
          },
        })
      }
    >
      <Image
        source={{ uri: `${apiUrl}/${item?.photo}` }}
        style={styles.avatar}
      />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.username}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {item.unread_count > 0 && (
              <View
                style={{
                  backgroundColor: "red",
                  borderRadius: 8,
                  width: 16,
                  height: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 6,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {item.unread_count}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.lastMessage}>{item.message}</Text>
          <Text style={styles.time}>{item.last_message_hour}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoadingOutletAccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.mainHeader}>Chat</Text>
        </View>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (errorOutletAccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.mainHeader}>Chat</Text>
        </View>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ErrorView onRetry={onRefresh} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainHeader}>Chat</Text>
      </View>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {isLoadingOutletAccess ? (
        <LoadingView />
      ) : errorOutletAccess ? (
        <ErrorView onRetry={onRefresh} />
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={(item) => item.chat_user_id}
          renderItem={renderItem}
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Pure white background
  },
  chatItem: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingTop: StatusBar.currentHeight,
  },
  headerButton: {
    padding: 8,
  },
  mainHeader: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  lastMessage: {
    fontSize: 14,
    color: "#555",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
