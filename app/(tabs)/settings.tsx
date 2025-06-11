import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* <Text>Details</Text> */}
      <Link href="/">INI ADALAH SETTING SCREEN</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
