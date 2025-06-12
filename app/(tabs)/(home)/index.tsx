import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const handleDismissAll = () => {
    router.dismissTo("/");
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View></View>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: 'space-around', width: '100%', gap: 20 }}>
          <View>
            <Text style={{ color: "white" }}>Hi, Arron Hore</Text>
            <Text style={{ color: "white" }}>Wisma BNI 46</Text>
          </View>

          <View>
            <Text style={{ color: "white" }}>Notification</Text>
          </View>
        </View>
      </View>

      <View></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    minHeight: 100,
    color: "white",
  },
});
