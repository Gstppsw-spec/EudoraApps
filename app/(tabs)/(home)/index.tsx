import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const handleDismissAll = () => {
    router.dismissTo("/");
  };
  return (
    <SafeAreaView style={styles.containerArea}>
      <ScrollView style={{ paddingTop: StatusBar.currentHeight }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <View
            style={{
              backgroundColor: "#1A1B25",
              width: "90%",
              marginBottom: 10,
              padding: 13,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#272835",
            }}
          >
            <FontAwesome name="search" size={18} color="grey" />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
              gap: 130,
              alignItems: "center",
            }}
          >
            <View style={{ gap: 5 }}>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                Hi, Arron Hore
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <FontAwesome name="map-marker" size={10} color="#FFB900" />
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
              }}
            >
              <FontAwesome name="bell" size={18} color="white" />
            </View>
          </View>

          <View style={styles.floatingBox}>
            <Text style={{ color: "white" }}></Text>
          </View>
        </View>

        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    minHeight: 160,
    color: "white",
  },
  containerArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
   floatingBox: {
    backgroundColor: '#1A1B25',
    padding: 15,
    position: 'absolute',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F9A000',
    width: '90%',
    top: 145,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
