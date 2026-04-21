// DoctorVideoFeedHorizontal.tsx
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import DoctorVideoItem, { DoctorVideo } from "./itemVideoComponent";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 1;
const CARD_HEIGHT = CARD_WIDTH * 0.6; // 16:9 aspect ratio
const CARD_SPACING = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

interface Props {
  videos: DoctorVideo[];
}

const DoctorVideoFeedHorizontal: React.FC<Props> = ({ videos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SNAP_INTERVAL);
      setActiveIndex(Math.min(index, videos?.length - 1));
    },
    [videos?.length]
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<DoctorVideo>) => {
      const inputRange = [
        (index - 1) * SNAP_INTERVAL,
        index * SNAP_INTERVAL,
        (index + 1) * SNAP_INTERVAL,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
        extrapolate: "clamp",
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.6, 1, 0.6],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <DoctorVideoItem
            video={item}
            isActive={index === activeIndex}
            cardWidth={CARD_WIDTH}
            cardHeight={CARD_HEIGHT}
          />
        </Animated.View>
      );
    },
    [activeIndex, scrollX]
  );

  const getItemLayout = useCallback(
    (data: DoctorVideo[] | null | undefined, index: number) => ({
      length: SNAP_INTERVAL,
      offset: SNAP_INTERVAL * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="center"
        contentContainerStyle={styles.contentContainer}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={getItemLayout}
        scrollEventThrottle={16}
      />

      {/* Indicator Dots */}
      {videos?.length > 1 && (
        <View style={styles.indicatorContainer}>
          {videos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index === activeIndex ? "#B0174C" : "#D1D1D6",
                  width: index === activeIndex ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  contentContainer: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
    paddingVertical: 8,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_SPACING,
    borderRadius: 12,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
    // backgroundColor: "white",
    overflow: "hidden",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    // transition: "all 0.3s ease",
  },
});

export default DoctorVideoFeedHorizontal;
