import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const imageData = [
    "https://via.placeholder.com/400x200/FFB6C1/000000?text=Slide+1",
    "https://via.placeholder.com/400x200/87CEFA/000000?text=Slide+2",
    "https://via.placeholder.com/400x200/90EE90/000000?text=Slide+3",
  ];

  const handleDismissAll = () => {
    router.dismissTo("/");
  };

  const progressValue = useSharedValue(0);
  return (
    <SafeAreaView style={styles.containerArea}>
      <ScrollView style={{ paddingTop: StatusBar.currentHeight }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <FontAwesome
              name="search"
              size={18}
              color="grey"
              style={styles.icon}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="grey"
              style={styles.input}
            />
            <TouchableOpacity onPress={() => console.log("Filter pressed")}>
              <FontAwesome name="filter" size={18} color="grey" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <View style={{ gap: 5, marginLeft: 20 }}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 2,
                }}
              >
                Hi, Arron Hore Malohaloha
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <FontAwesome name="map-marker" size={14} color="#FFB900" />
                <Text style={{ color: "white", fontSize: 12 }}>
                  Wisma BNI 46
                </Text>
              </View>
            </View>

            <View
              style={{
                borderColor: "#272835",
                borderWidth: 0.1,
                borderRadius: "100%",
                padding: 15,
                backgroundColor: "#1A1B25",
                marginRight: 20,
              }}
            >
              <FontAwesome name="bell" size={18} color="white" />
            </View>
          </View>

          <TouchableOpacity style={styles.floatingBox}>
            <Text style={{ color: "white", fontSize: 12 }}>
              POINT : 50.000.000
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: "center", marginTop: 50 }}>
          <Carousel
            width={width}
            height={200}
            data={imageData}
            scrollAnimationDuration={1000}
            autoPlay
            autoPlayInterval={3000}
            pagingEnabled
            onProgressChange={(_, absoluteProgress) =>
              (progressValue.value = absoluteProgress)
            }
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#ccc",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 10,
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </View>
        <View style={styles.indicatorContainer}>
          {imageData.map((_, i) => (
            <IndicatorDot key={i} index={i} progressValue={progressValue} />
          ))}
        </View>

        <View style={styles.containerCategory}>
          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <FontAwesome name="facebook-official" size={18} color="#FFB900" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11 }}>Face</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <FontAwesome name="automobile" size={18} color="#FFB900" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11 }}>Body</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <FontAwesome name="shopping-bag" size={18} color="#FFB900" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11 }}>Product</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <FontAwesome name="files-o" size={18} color="#FFB900" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11 }}>More</Text>
          </View>
        </View>

        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Upcoming Appointments
            </Text>
            <Text
              style={{ fontSize: 14, fontWeight: "bold", color: "#FFB900" }}
            >
              See All
            </Text>
          </View>
        </View>

        <View>
          <View>
            <Text>June 22, 2025</Text>
            <View>
              <Text>Remind Me</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const IndicatorDot = ({ index, progressValue }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3],
      "clamp"
    );
    const scale = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [1, 1.5, 1],
      "clamp"
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    minHeight: 160,
    color: "white",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#333",
    marginHorizontal: 5,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // marginTop: 10,
  },
  containerArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  floatingBox: {
    backgroundColor: "#1A1B25",
    padding: 15,
    position: "absolute",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F9A000",
    width: "90%",
    top: 145,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1B25",
    width: "90%",
    marginBottom: 10,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#272835",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
  },
  containerCategory: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  iconCategory: {
    alignItems: "center",
  },
  buttonIconCategory: {
    borderWidth: 0.1,
    borderRadius: "100%",
    padding: 20,
    backgroundColor: "#FFF8E6",
    marginBottom: 5,
  },
});
