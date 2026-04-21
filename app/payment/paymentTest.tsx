import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Animated,
  Easing,
  LayoutAnimation,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import HeaderWithBack from "../component/headerWithBack";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
  OVO: ["#5f259f", "#7e3dba"],
  DANA: ["#1a73e8", "#4285f4"],
  GOPAY: ["#00aa13", "#00c853"],
  QRIS: ["#e53935", "#ff5252"],
  CARD: ["#0b62d6", "#2196f3"],
  VA: ["#6b7280", "#9ca3af"],
  DEFAULT: ["#3b82f6", "#60a5fa"],
};

const GROUPS = [
  {
    id: "EWALLET",
    title: "E-Wallet",
    icon: "wallet-outline",
    isactive: true,
    methods: [
      {
        id: "ID_OVO",
        title: "OVO",
        icon: "cellphone",
        requireNumber: true,
        isactive: true,
      },
      { id: "ID_DANA", title: "DANA", icon: "wallet", isactive: false },
      { id: "ID_GOPAY", title: "GoPay", icon: "google", isactive: false },
      { id: "ASTRAPAY", title: "ASTRAPAY", icon: "wallet", isactive: true },
    ],
  },
  {
    id: "VA",
    title: "Virtual Account",
    icon: "credit-card-outline",
    isactive: true,
    methods: [
      { id: "VA_BCA", title: "BCA VA", icon: "bank", isactive: true },
      { id: "VA_BNI", title: "BNI VA", icon: "bank", isactive: true },
      { id: "VA_MANDIRI", title: "Mandiri VA", icon: "bank", isactive: true },
    ],
  },
  {
    id: "CARD",
    title: "Credit / Debit Card",
    icon: "card-outline",
    isactive: true,
    methods: [
      {
        id: "CARD",
        title: "Credit / Debit Card",
        icon: "credit-card",
        isactive: true,
      },
    ],
  },
  {
    id: "QR",
    title: "QR Code",
    icon: "qrcode-scan",
    isactive: true,
    methods: [{ id: "QRIS", title: "QRIS", icon: "qrcode", isactive: true }],
  },
];

export default function PaymentScreen() {
  const [expanded, setExpanded] = useState(GROUPS.map((g) => g.id));
  const [selected, setSelected] = useState(null);
  const [phone, setPhone] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const total = 100000;

  const toggleGroup = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expanded.includes(id)) {
      setExpanded(expanded.filter((x) => x !== id));
    } else {
      setExpanded([...expanded, id]);
    }
  };

  const handleSelectMethod = (id) => {
    if (id === selected) {
      setSelected(null);
    } else {
      setSelected(id);
    }

    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePay = () => {
    const chosenMethod = GROUPS.flatMap((g) => g.methods).find(
      (m) => m.id === selected
    );
    if (chosenMethod?.requireNumber && !phone) {
      alert("Mohon isi nomor HP terlebih dahulu");
      return;
    }
    setShowConfirm(true);
  };

  const getColor = (id) => {
    if (id.includes("OVO")) return COLORS.OVO;
    if (id.includes("DANA")) return COLORS.DANA;
    if (id.includes("GOPAY")) return COLORS.GOPAY;
    if (id.includes("QR")) return COLORS.QRIS;
    if (id.includes("CARD")) return COLORS.CARD;
    return COLORS.VA;
  };

  const buttonScale = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.05, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <HeaderWithBack title="Detail Pembelian" useGoBack />
        <Text style={styles.headerSubtitle}>Ringkasan belanja Anda</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {GROUPS.map((group) => (
          <View key={group.id} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => toggleGroup(group.id)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.cardTitle}> {group.title}</Text>
              </View>
              <Ionicons
                name={
                  expanded.includes(group.id) ? "chevron-up" : "chevron-down"
                }
                size={20}
                color="#3b82f6"
              />
            </TouchableOpacity>

            {expanded.includes(group.id) && (
              <View style={styles.methodList}>
                {group.methods.map((m) => {
                  const active = m.id === selected;
                  const color = getColor(m.id);

                  return (
                    <TouchableOpacity
                      key={m.id}
                      style={[styles.methodItem]}
                      onPress={() => handleSelectMethod(m.id)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.methodIcon,
                          { backgroundColor: active ? color[0] : "#9ca3af" },
                        ]}
                      >
                        <Image
                          source={require("../../assets/images/payment-method/ovo-logo.svg")}
                          style={{
                            width: 26,
                            height: 26,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                      <Text
                        style={[
                          styles.methodText,
                          active && { color: color[0], fontWeight: "700" },
                        ]}
                      >
                        {m.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <Animated.View
        style={[
          styles.payButtonContainer,
          { transform: [{ scale: buttonScale }] },
        ]}
      >
        <TouchableOpacity
          style={[styles.payButton, !selected && { opacity: 0.6 }]}
          disabled={!selected}
          onPress={handlePay}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={selected ? getColor(selected) : COLORS.DEFAULT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.payButtonText}>
              {selected ? "Bayar Sekarang" : "Pilih Metode"}
            </Text>
            {selected && (
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Konfirmasi Pembayaran</Text>
              <View style={styles.modalIcon}>
                <Ionicons name="card" size={24} color="#0b62d6" />
              </View>
            </View>
            <Text style={styles.modalDesc}>
              Anda akan membayar{" "}
              <Text style={styles.highlight}>
                Rp {total.toLocaleString("id-ID")}
              </Text>{" "}
              via{" "}
              <Text style={styles.highlight}>
                {
                  GROUPS.flatMap((g) => g.methods).find(
                    (m) => m.id === selected
                  )?.title
                }
              </Text>
              {phone ? ` ke nomor ${phone}` : ""}.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowConfirm(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={() => {
                  setShowConfirm(false);
                  alert("Pembayaran diproses 🚀");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnConfirmText}>Lanjutkan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 10,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
    marginLeft: 4,
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
    color: "#1e293b",
    textAlign: "center",
  },
  divider: {
    height: 3,
    width: 60,
    backgroundColor: "#3b82f6",
    borderRadius: 2,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // elevation: 5,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  groupIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  methodList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: 8,
    gap: 10,
  },

  methodItem: {
    aspectRatio: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  methodIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  methodText: {
    fontSize: 10,
    color: "#334155",
    // fontWeight: "600",
    textAlign: "center",
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    marginTop: 8,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  label: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  summary: {
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0b62d6",
  },
  payButtonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  payButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradient: {
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    width: "100%",
    maxWidth: 340,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
  },
  modalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },
  modalDesc: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
  },
  highlight: {
    fontWeight: "700",
    color: "#0b62d6",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnCancel: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  modalBtnCancelText: {
    color: "#64748b",
    fontWeight: "600",
  },
  modalBtnConfirm: {
    backgroundColor: "#0b62d6",
    shadowColor: "#0b62d6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modalBtnConfirmText: {
    color: "#fff",
    fontWeight: "700",
  },
});
