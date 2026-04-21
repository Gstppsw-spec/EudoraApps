import { useDataEreceiptDoing } from "@/api/ereceipt_prepaid";
import { useJwtShortLiveMutation } from "@/api/ereceipt_prepaid/mutation";
import useStore from "@/store/useStore";
import Constants from "expo-constants";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderWithBack from "../component/headerWithBack";
import StateHandler from "../component/stateHandler";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface Customer {
  id: number;
  name: string;
  no: string;
  code: string;
}

interface TreatmentDetail {
  detail_id: number;
  invoice: string;
  treatment_name: string;
  qty: number;
  doing_by: string;
  assist_by: string | null;
  validated: number; // 1 = validated, 0 = not validated
}

interface ReceiptData {
  receipt_id: string;
  no_receipt: string;
  doing_date: string;
  branch_outlet: string;
  start_treatment: string;
  created_at: string;
  customer: Customer;
  staff: string;
  details: TreatmentDetail[];
}

interface ApiResponse {
  status: string;
  message: string;
  data: ReceiptData[];
}

// ==================== COMPONENT ====================
const EreceiptDoingScreen: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const customerId = useStore((state) => state.customerid);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: list,
    isLoading,
    error,
    refetch,
  } = useDataEreceiptDoing(customerId);

  const { mutate, isPending } = useJwtShortLiveMutation();

  const responseData = list ?? [];

  const renderStatusBadge = (): React.JSX.Element => {
    const statusColor =
      responseData.status === "success" ? "#10b981" : "#ef4444";
    return (
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>
          {responseData.status.toUpperCase()}
        </Text>
      </View>
    );
  };

  const renderCustomerInfo = (customer: Customer): React.JSX.Element => (
    <View style={styles.customerSection}>
      <Text style={styles.sectionTitle}>👤 Data Customer</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{customer.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>No. HP</Text>
        <Text style={styles.value}>+{customer.no}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Kode</Text>
        <Text style={styles.value}>{customer.code}</Text>
      </View>
    </View>
  );

  const renderTreatmentDetails = (
    details: TreatmentDetail[],
  ): React.JSX.Element => (
    <View style={styles.detailsSection}>
      <Text style={styles.sectionTitle}>💆‍♀️ Detail Perawatan</Text>
      {details.map((detail) => (
        <View key={detail.detail_id} style={styles.treatmentCard}>
          <View style={styles.treatmentHeader}>
            <Text style={styles.treatmentName}>{detail.treatment_name}</Text>
            {detail.validated === 1 && (
              <View style={styles.validatedBadge}>
                <Text style={styles.validatedText}>✓ Validated</Text>
              </View>
            )}
          </View>
          <View style={styles.treatmentRow}>
            <Text style={styles.treatmentLabel}>Invoice:</Text>
            <Text style={styles.treatmentValue}>{detail.invoice}</Text>
          </View>
          <View style={styles.treatmentRow}>
            <Text style={styles.treatmentLabel}>Qty:</Text>
            <Text style={styles.treatmentValue}>{detail.qty}</Text>
          </View>
          <View style={styles.treatmentRow}>
            <Text style={styles.treatmentLabel}>Dilakukan oleh:</Text>
            <Text style={styles.treatmentValue}>{detail.doing_by}</Text>
          </View>
          {detail.assist_by && (
            <View style={styles.treatmentRow}>
              <Text style={styles.treatmentLabel}>Dibantu oleh:</Text>
              <Text style={styles.treatmentValue}>{detail.assist_by}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderReceiptCard = (item: ReceiptData): React.JSX.Element => (
    <View key={item.receipt_id} style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.receiptNo}>{item.no_receipt}</Text>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{item.doing_date}</Text>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        {/* Info Umum */}
        <View style={styles.generalInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>🏢 Outlet</Text>
            <Text style={styles.value}>{item.branch_outlet}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>⏰ Waktu Treatment</Text>
            <Text style={styles.value}>
              {item.start_treatment.split(".")[0]}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📅 Dibuat</Text>
            <Text style={styles.value}>{item.created_at}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>👩‍⚕️ Staff</Text>
            <Text style={styles.value}>{item.staff}</Text>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Customer Info */}
        {renderCustomerInfo(item.customer)}

        {/* Separator */}
        <View style={styles.separator} />

        {/* Treatment Details */}
        {renderTreatmentDetails(item.details)}

        {/* Download Button */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownloadReceipt(item)}
          disabled={downloadingId === item.receipt_id}
        >
          {downloadingId === item.receipt_id ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text style={styles.downloadButtonText}>
                📥 Download E-Receipt
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

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

  const handleDownloadReceipt = async (item: ReceiptData) => {
    try {
      mutate(item.no_receipt, {
        onSuccess: async (data) => {
          const token = data?.data?.token;

          if (!token) {
            console.log("Token tidak ditemukan");
            return;
          }

          const url = `${apiUrl}/api/Ereceipt/download_pdf/${item.no_receipt}?token=${token}`;

          const supported = await Linking.canOpenURL(url);

          if (supported) {
            await Linking.openURL(url);
          } else {
            console.log("Tidak bisa buka URL:", url);
          }
        },
        onError: (error) => {
          console.log("Error get token:", error);
        },
      });
    } catch (error) {
      console.log("Error open URL:", error);
    }
  };

  // console.log(responseData);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithBack title="E-Receipt Pemotongan" useGoBack />

      <StateHandler
        loading={isLoading && !refreshing}
        error={error}
        empty={!isLoading && responseData?.data?.length === 0}
        onRetry={handleReload}
        retryLoading={refreshing}
        emptyMessage="No data available for e-receipt"
      />

      {!isLoading && !error && responseData?.data?.length > 0 && (
        <FlatList
          data={responseData?.data || []}
          keyExtractor={(item) => item.receipt_id}
          refreshing={refreshing}
          onRefresh={handleReload}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>📋 Data Perawatan</Text>
              {renderStatusBadge()}
              <Text style={styles.totalData}>
                Total {responseData?.data?.length || 0} transaksi
              </Text>
            </View>
          }
          renderItem={({ item }) => renderReceiptCard(item)}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  statusText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  totalData: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    backgroundColor: "#667eea",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  receiptNo: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  cardBody: {
    padding: 15,
  },
  generalInfo: {
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 13,
    color: "#333",
    fontWeight: "400",
    flex: 1,
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  customerSection: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  detailsSection: {
    marginTop: 5,
  },
  treatmentCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#667eea",
  },
  treatmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  treatmentName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  validatedBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  validatedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  treatmentRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  treatmentLabel: {
    fontSize: 12,
    color: "#888",
    width: 100,
  },
  treatmentValue: {
    fontSize: 12,
    color: "#555",
    flex: 1,
  },
  downloadButton: {
    backgroundColor: "#667eea",
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  downloadButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default EreceiptDoingScreen;
