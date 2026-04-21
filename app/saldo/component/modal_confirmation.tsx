import React from "react";
import {
    GestureResponderEvent,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  onConfirm: (event?: GestureResponderEvent) => void;
  onCancel: (event?: GestureResponderEvent) => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = "Konfirmasi Penyimpanan",
  message = "Apakah Anda yakin ingin menyimpan rekening berikut?",
  confirmText = "Ya, Simpan",
  cancelText = "Batal",
  bankName,
  accountHolder,
  accountNumber,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Detail rekening */}
          <View style={styles.detailBox}>
            {bankName && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>🏦 Bank</Text>
                <Text style={styles.detailValue}>{bankName}</Text>
              </View>
            )}

            {accountHolder && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>👤 Nama Akun</Text>
                <Text style={styles.detailValue}>{accountHolder}</Text>
              </View>
            )}

            {accountNumber && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>💳 Nomor Rekening</Text>
                <Text style={[styles.detailValue, styles.mono]}>
                  {accountNumber}
                </Text>
              </View>
            )}
          </View>

          {/* Tombol aksi */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "justify",
    marginBottom: 16,
  },
  detailBox: {
    // backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 4,
  },
  detailValue: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 15,
  },
  mono: {
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
    }),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
  },
  confirmButton: {
    backgroundColor: "#B0174C", // hijau lembut
  },
  cancelText: {
    color: "#111827",
    fontWeight: "600",
  },
  confirmText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
