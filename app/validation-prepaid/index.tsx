import { useDataPrepaidToValidation } from "@/api/prepaid_validation";
import { useValidationPrepaidMutation } from "@/api/prepaid_validation/mutation";
import useStore from "@/store/useStore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import HeaderWithBack from "../component/headerWithBack";
import StateHandler from "../component/stateHandler";

const TreatmentVerificationScreen = () => {
  const [validating, setValidating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const customerId = useStore((state) => state.customerid);

  const { mutate, isPending } = useValidationPrepaidMutation();

  const {
    data: list,
    isLoading,
    error,
    refetch,
  } = useDataPrepaidToValidation(customerId);

  const data = list ?? [];

  // ✅ RELOAD HANDLER
  const handleReload = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (err) {
      console.log("Reload error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleValidateAll = () => {
    setShowConfirmModal(true);
  };

  const confirmValidation = () => {
    setShowConfirmModal(false);
    mutate(customerId, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text2: "Semua pemotongan berhasil divalidasi",
        });
      },
      onError: () => {
        Toast.show({
          type: "error",
          text2: "Gagal validasi",
        });
      },
    });
  };

  const cancelValidation = () => {
    setShowConfirmModal(false);
  };

  const renderTreatmentItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Pending</Text>
        </View>
      </View>
      <Text style={styles.treatmentName}>{item.treatment_name}</Text>
      <View style={styles.footer}>
        <Text style={styles.qtyLabel}>Qty</Text>
        <Text style={styles.qty}>{item.qty}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Validasi Pemotongan" useGoBack />
      {/* STATS */}
      {!isLoading && !error && data?.length > 0 && (
        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{data?.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: "#FF6B6B" }]}>
              {data?.length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      )}

      {/* STATE HANDLER */}
      <StateHandler
        loading={isLoading && !refreshing}
        error={error}
        empty={!isLoading && data?.length === 0}
        onRetry={handleReload}
        retryLoading={refreshing}
        emptyMessage="No treatments to verify"
      />

      {/* LIST */}
      {!isLoading && !error && data?.length > 0 && (
        <>
          <FlatList
            data={data}
            renderItem={renderTreatmentItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ padding: 16 }}
            refreshing={refreshing}
            onRefresh={handleReload}
          />

          <View style={styles.bottom}>
            <TouchableOpacity
              onPress={handleValidateAll}
              disabled={isPending}
              style={styles.button}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>✔ Validate All</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* CONFIRMATION MODAL */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelValidation}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIcon}>
              <Text style={styles.modalIconText}>⚠️</Text>
            </View>

            <Text style={styles.modalTitle}>Konfirmasi Validasi</Text>

            <Text style={styles.modalMessage}>
              Apakah Anda yakin ingin memvalidasi semua pemotongan?
            </Text>

            <Text style={styles.modalSubMessage}>
              Total {data?.length} pemotongan akan divalidasi
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={cancelValidation}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmValidation}
                style={[styles.modalButton, styles.confirmButton]}
              >
                <Text style={styles.confirmButtonText}>Ya, Validasi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TreatmentVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  stats: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  statBox: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A00E0",
  },

  statLabel: {
    fontSize: 12,
    color: "#999",
  },

  statDivider: {
    width: 1,
    backgroundColor: "#eee",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  badge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "#FB8C00",
    fontSize: 12,
    fontWeight: "600",
  },

  treatmentName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },

  qtyLabel: {
    color: "#999",
  },

  qty: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4A00E0",
  },

  bottom: {
    padding: 16,
  },

  button: {
    backgroundColor: "#4A00E0",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "85%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  modalIconText: {
    fontSize: 32,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },

  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },

  modalSubMessage: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
  },

  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#F5F5F5",
  },

  confirmButton: {
    backgroundColor: "#4A00E0",
  },

  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },

  confirmButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
