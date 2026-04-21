import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 24) / 2;

const getVideoContentApps = async () => {
  const res = await fetch(`${apiUrl}/getVideoContentApps`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const FeedItem = ({ item, isActive }: any) => {
  const player = useVideoPlayer(item.video_url, (p) => {
    p.muted = true;
    p.loop = isActive;
    if (isActive) p.play();
    else p.pause();
  });

  const handlePress = () => {
    try {
      if (player) {
        player.pause();
      }
      router.push({
        pathname: "/tabs/feeds/video_content",
        params: { item: JSON.stringify(item) },
      });
    } catch (error) {
      console.error("Error pausing before navigation:", error);
    }
  };

  return (
    <View style={styles.videoContainer}>
      <Pressable style={styles.videoWrapper} onPress={handlePress}>
        {isActive ? (
          <VideoView
            player={player}
            style={styles.video}
            contentFit="cover"
            allowsFullscreen={false}
            nativeControls={false}
            allowsPictureInPicture={false}
          />
        ) : (
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
      </Pressable>
      <View style={styles.captionContainer}>
        <Text numberOfLines={2} style={styles.videoTitle}>
          {item.title}
        </Text>
      </View>
    </View>
  );
};

export default function FeedsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: video,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getVideoContentApps"],
    queryFn: getVideoContentApps,
  });

  const minId = Math.min(
    ...(video?.data?.map((v: any) => Number(v.id)) || [0])
  );

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([refetch()]);
    } catch (error) {
      console.log("Error refreshing:", error);
    }
    setRefreshing(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#B0174C" />
          <Text style={styles.statusText}>Loading feeds...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.statusText}>Failed to load feeds 😔</Text>
          <Text style={styles.subText}>{(error as Error).message}</Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    if (!video?.data?.length) {
      return (
        <View style={styles.centered}>
          <Text style={styles.statusText}>No videos available 📭</Text>
        </View>
      );
    }

    return (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={video.data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        renderItem={({ item }) => (
          <FeedItem item={item} isActive={Number(item.id) === minId} />
        )}
        contentContainerStyle={{ padding: 8, paddingTop: 100, flexGrow: 1 }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={["#000000b0", "#00000060", "#00000000"]}
        style={styles.gradientHeader}
      >
        <Text style={styles.headerTitle}>Feeds</Text>
      </LinearGradient>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  gradientHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 120 : 100,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 10,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  videoContainer: {
    width: ITEM_WIDTH,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  videoWrapper: { flex: 1 },
  video: { width: "100%", height: "100%" },
  thumbnail: { width: "100%", height: "100%" },
  captionContainer: {
    position: "absolute",
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  videoTitle: { color: "#fff", fontSize: 11, fontWeight: "500" },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    color: "#333",
    fontSize: 14,
    marginTop: 8,
  },
  subText: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: "#B0174C",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
