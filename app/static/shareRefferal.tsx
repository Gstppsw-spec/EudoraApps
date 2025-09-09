import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import React from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderWithBack from "../component/headerWithBack";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchDetailCustomer = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getDetailCustomer/${customerId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const ShareRefferalScreen = () => {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getDetailCustomer", customerId],
    queryFn: fetchDetailCustomer,
    enabled: !!customerId,
  });

  const referralCode = data?.detailcustomer[0]?.REFERRALCODE;

  const shareViaWhatsApp = async () => {
    const message = `Hai! Ayo bergabung di aplikasi kami dan dapatkan manfaat spesial! 

Download aplikasinya sekarang dan gunakan kode referral saya: *${referralCode}* untuk mendapatkan bonus spesial.

Jangan lupa juga cek paket new customer offer yang sangat menguntungkan! Harga spesial hanya untuk member baru.

Download app store: https://apps.apple.com/id/app/eudora-aesthetic/id6749217761?l=id
play store : https://play.google.com/store/apps/details?id=com.anonymous.EudoraAesthetic
`;

    try {
      await Share.share({
        message: message,
        // Untuk membatasi hanya ke WhatsApp (tidak selalu bekerja di semua perangkat)
        // url: 'whatsapp://send?text=' + encodeURIComponent(message),
      });
    } catch (error) {
      Alert.alert("Error", "Gagal berbagi pesan");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <HeaderWithBack title="#EudoraToKorea" useGoBack />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Image
            source={require("../../assets/images/eudoratokorea.png")} // Ganti dengan URL gambar Anda
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.benefitsContainer}>
            <Text style={styles.sectionTitle}>
              Keuntungan Ikutan Ajak Teman #EudoraToKorea
            </Text>
            <View style={styles.benefitItem}>
              <Ionicons name="gift" size={24} color="#FF6B81" />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Cash Reward</Text>
                <Text style={styles.benefitDescription}>
                  Dapatkan 30% cash reward dari pembelian paket new customer
                  offer oleh teman yang diajak.
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons name="cash" size={24} color="#FF6B81" />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>
                  Kesempatan Jalan-jalan ke Korea
                </Text>
                <Text style={styles.benefitDescription}>
                  Khusus program Ajak Teman #EudoraToKorea, 3 orang pemenang
                  bisa mendapatkan hadiah jalan-jalan ke Korea. Ajak teman makin
                  banyak, kesempatan memenangkan undian semakin banyak!
                </Text>
              </View>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons name="trophy" size={24} color="#FF6B81" />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Hadiah Eksklusif</Text>
                <Text style={styles.benefitDescription}>
                  Nikmati hadiah spesial lainnya untuk 10 orang pemenang lain!
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.howItWorks}>
            <Text style={styles.sectionTitle}>Cara Kerjanya</Text>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Bagikan kode referral kamu ke teman
              </Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Teman mendownload app dan registrasi menggunakan kode kamu
              </Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Teman membeli paket new customer offer
              </Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>
                Kamu mendapatkan cash reward berupa saldo dan kesempatan jalan
                jalan ke korea !!!
              </Text>
            </View>
          </View>

          <View style={styles.referralCodeContainer}>
            <Text style={styles.referralLabel}>Kode Referral Anda:</Text>
            <Text style={styles.referralCode}>{referralCode}</Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.shareButton} onPress={shareViaWhatsApp}>
        <Ionicons name="share" size={24} color="white" />
        <Text style={styles.shareButtonText}>Bagikan Refferal</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#FF6B81",
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 8,
  },
  content: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 420,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  benefitsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  benefitText: {
    marginLeft: 12,
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: "#666",
  },
  howItWorks: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF6B81",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "white",
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  referralCodeContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  referralLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#666",
  },
  referralCode: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B81",
    letterSpacing: 2,
  },
  shareButton: {
    backgroundColor: "#FF6B81",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ShareRefferalScreen;
