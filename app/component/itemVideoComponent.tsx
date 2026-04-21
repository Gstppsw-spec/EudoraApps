import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export interface DoctorVideo {
  id: string;
  title: string;
  video_url: string;
  specialty?: string;
  thumbnail?: string;
  duration?: string;
  preview_url?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH;
const CARD_HEIGHT = CARD_WIDTH * 0.6;

interface Props {
  video: DoctorVideo;
  isActive: boolean;
  cardWidth?: number;
  cardHeight?: number;
  preload?: boolean;
}

const DoctorVideoItem: React.FC<Props> = ({
  video,
  isActive,
  cardWidth = CARD_WIDTH,
  cardHeight = CARD_HEIGHT,
  preload = false,
}) => {
  const videoUrl = video.preview_url || video.video_url;
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.muted = true;
    p.volume = 0;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const isLoadingRef = useRef(false);

  // Animasi fade in/out thumbnail
  const fadeOutThumbnail = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => setShowThumbnail(false));
  };

  const fadeInThumbnail = () => {
    setShowThumbnail(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  // Play video aman (dengan delay supaya frame pertama sempat tampil)
  const safePlay = async () => {
    if (isLoadingRef.current) return;
    try {
      isLoadingRef.current = true;
      setIsLoading(true);

      player.muted = false;
      player.volume = 1;
      await player.play();
      setTimeout(() => fadeOutThumbnail(), 600);
    } catch (error) {
      console.error("Error playing video:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  // Pause video aman
  const safePause = () => {
    try {
      player.pause();
      player.muted = true;
      player.volume = 0;
      fadeInThumbnail();
    } catch (error) {
      console.error("Error pausing video:", error);
    }
  };

  // Deteksi saat video siap diputar
  useEffect(() => {
    const handleStatusChange = (status: any) => {
      if (status === "readyToPlay") {
        setIsLoading(false);
        setVideoReady(true);
        if (preload && !isActive) player.pause();
      }
    };

    player.addListener("statusChange", handleStatusChange);

    return () => {
      player.removeListener("statusChange", handleStatusChange);
    };
  }, [player]);

  // Auto play/pause saat aktif berubah
  useEffect(() => {
    if (isActive && videoReady) {
      safePlay();
    } else if (!isActive) {
      safePause();
    }
  }, [isActive, videoReady]);

  // Pastikan thumbnail muncul di awal
  useEffect(() => {
    fadeInThumbnail();
  }, []);

  // Render thumbnail
  const renderThumbnail = () => (
    <Animated.View
      style={[
        styles.thumbnailContainer,
        {
          opacity: fadeAnim,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      ]}
    >
      {video?.thumbnail ? (
        <Image
          source={{ uri: video?.thumbnail }}
          style={styles.thumbnailImage}
          resizeMode="cover"
          onError={(e) =>
            console.log("❌ Thumbnail load error:", e.nativeEvent.error)
          }
        />
      ) : (
        <Pressable onPress={safePlay} style={styles.fallbackThumbnail}>
          <Ionicons name="videocam-outline" size={48} color="#666" />
        </Pressable>
      )}
      <Pressable onPress={safePlay} style={styles.thumbnailOverlay}>
        <Ionicons name="play-circle" size={48} color="#FFF" />
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      {hasError ? (
        renderThumbnail()
      ) : (
        <>
          {showThumbnail && renderThumbnail()}

          {!showThumbnail && (
            <VideoView
              key={video.id}
              style={styles.video}
              player={player}
              nativeControls={true}
              contentFit="cover"
              allowsFullscreen
              allowsPictureInPicture
            />
          )}
        </>
      )}

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
        style={styles.gradientOverlay}
      >
        <View style={styles.infoContainer}>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{video.title}</Text>
            {video.specialty && (
              <Text style={styles.specialty}>{video.specialty}</Text>
            )}
          </View>

          {video.duration && (
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color="#FFF" />
              <Text style={styles.durationText}>{video.duration}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default memo(DoctorVideoItem);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  thumbnailContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // penting agar tidak transparan
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  fallbackThumbnail: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 40,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  specialty: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "500",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
});
