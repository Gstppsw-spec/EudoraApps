import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const useBottomSheetModal = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
 const snapPoints = useMemo(() => ["35%", "50%"], []);

  const open = useCallback((bookingId: any) => {
    bottomSheetRef.current?.present();
  }, []);

  const close = () => {
    bottomSheetRef.current?.dismiss();
  };

  const Sheet = () => (
    <View style={styles.container}>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ borderRadius: 20, backgroundColor: "#fff" }}
      >
        <BottomSheetView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cancel Booking</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to cancel this booking?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={close}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#f87171" }]}
              onPress={() => {
                close();
              }}
            >
              <Text style={[styles.modalButtonText, { color: "white" }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );

  return { open, close, Sheet };
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
});
