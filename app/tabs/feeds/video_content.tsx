import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

const FeedItem = ({ item, isActive }: any) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);

  const player = useVideoPlayer(item.video_url, (p) => {
    p.loop = true;
    p.muted = true;
  });

  const togglePlay = async () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
      setIsManualPaused(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      player.muted = false;
      player.volume = 1;
      await player.play();
      setIsPlaying(true);
      setIsManualPaused(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    if (isActive && !isManualPaused && !isPlaying) {
      player.muted = false;
      player.volume = 1;
      player.play();
      setIsPlaying(true);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (!isActive && isPlaying) {
      player.pause();
      setIsPlaying(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive]);

  return (
    <View style={styles.videoContainer}>
      <Pressable style={styles.thumbnailOverlay} onPress={togglePlay}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          allowsFullscreen={false}
          nativeControls={false}
          allowsPictureInPicture={false}
        />
        <Animated.View
          style={[styles.thumbnailContainer, { opacity: fadeAnim }]}
        >
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={48}
            color="#FFF"
          />
        </Animated.View>
      </Pressable>

      {/* Gradients */}
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={styles.gradientTop}
      />
      <View style={styles.backContainer}>
        <TouchableOpacity
          style={styles.iconBackButton}
          onPress={() => {
            router.back()
          }}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradientBottom}
      />

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.videoTitle}>{item.title}</Text>
      </View>
    </View>
  );
};

export default function FeedsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { item } = useLocalSearchParams();
  const videos = [JSON.parse(item)];

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 80 }).current;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <FeedItem item={videos[0]} isActive={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    height,
    width,
    position: "absolute",
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  captionContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 80,
    left: 16,
    right: 80,
  },
  videoTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  actionContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 80,
    right: 16,
    alignItems: "center",
  },
  iconButton: {
    marginVertical: 12,
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 13,
    marginTop: 4,
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  thumbnailContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  navContainer: {
    left: 16,
    right: 80,
    top: 40,
    position: "absolute",
  },
  backContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 80,
    left: 20,
    top: 40,
    alignItems: "center",
  },
  iconBackButton: {
    marginVertical: 12,
    alignItems: "center",
  },
});
