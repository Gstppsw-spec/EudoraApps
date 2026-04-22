import {
  usePrepaidBalanceInvoicePackages,
  usePrepaidBalanceInvoiceTreatment,
} from "@/api/prepaid_balance/queries";
import ErrorView from "@/app/component/errorView";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useStore from "../../../store/useStore";

const YourTreatmentAndPackageScreen = () => {
  const [selectedTab, setSelectedTab] = useState("treatments");
  const customerId = useStore((state) => state.customerid);

  const {
    data: treatmentsData,
    isLoading: isLoadingTreatments,
    error: treatmentsError,
    refetch: refetchTreatments,
  } = usePrepaidBalanceInvoiceTreatment(customerId);

  const {
    data: packagesData,
    isLoading: isLoadingPackages,
    error: packagesError,
    refetch: refetchPackages,
  } = usePrepaidBalanceInvoicePackages(customerId);

  const onRefresh = () => {
    refetchTreatments();
    refetchPackages();
  };

  // Extract data
  const treatments = treatmentsData?.treatment || [];
  const packages = packagesData?.membership || [];

  console.log(treatments);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "treatments" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("treatments")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "treatments" && styles.activeTabText,
            ]}
          >
            TREATMENTS
          </Text>
          {selectedTab === "treatments" && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "packages" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("packages")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "packages" && styles.activeTabText,
            ]}
          >
            PACKAGES
          </Text>
          {selectedTab === "packages" && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingTreatments || isLoadingPackages}
            onRefresh={onRefresh}
            tintColor="#B0174C"
            colors={["#B0174C"]}
          />
        }
      >
        {selectedTab === "treatments" && (
          <>
            {isLoadingTreatments ? (
              <View style={styles.loadingContainer}>
                <Ionicons
                  name="refresh-circle"
                  size={50}
                  color="#B0174C"
                  style={styles.loadingIcon}
                />
                <Text style={styles.loadingText}>Loading Treatments...</Text>
              </View>
            ) : treatmentsError ? (
              <ErrorView onRetry={onRefresh} />
            ) : treatments.length > 0 ? (
              treatments.map((treatment: any, index: number) => (
                <View style={styles.card} key={index}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.invoiceNumber}>
                      #{treatment.INVOICENO || "N/A"}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {treatment.REMAINING > 0 && !treatment.ISEXPIRED ? (
                        <TouchableOpacity
                          style={styles.statusBadgeBook}
                          onPress={() =>
                            router.push("/bookappointment/booking")
                          }
                        >
                          <Text style={styles.statusTextBook}>Book</Text>
                        </TouchableOpacity>
                      ) : treatment.ISEXPIRED ? (
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>Expired</Text>
                        </View>
                      ) : treatment.REMAINING === 0 ? (
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>Used up</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Text style={styles.treatmentName}>
                    {treatment.TREATMENTNAME || "N/A"}
                  </Text>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${
                              ((treatment.USEDTIMES || 0) /
                                (treatment.TOTALTREATMENTS || 1)) *
                              100
                            }%`,
                            backgroundColor:
                              treatment.REMAINING > 0 ? "#B0174C" : "#4CAF50",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {treatment.USEDTIMES || 0} of{" "}
                      {treatment.TOTALTREATMENTS || 0} used
                    </Text>
                  </View>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar" size={16} color="#888" />
                      <Text style={styles.detailText}>Purchase date:</Text>
                      <Text style={styles.detailText}>
                        {treatment.INVOICEDATE
                          ? new Date(treatment.INVOICEDATE).toLocaleDateString()
                          : "No Date"}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={16}
                        color="#888"
                      />

                      <Text style={styles.detailText}>Expired date:</Text>
                      <Text style={styles.detailText}>
                        {treatment.EXPIREDDATE
                          ? new Date(treatment.EXPIREDDATE).toLocaleDateString()
                          : "No Date"}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="pricetag" size={16} color="#888" />
                      <Text style={styles.detailText}>
                        Remaining:{" "}
                        <Text style={styles.remainingValue}>
                          {treatment.REMAINING || "0"}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="medkit-outline" size={60} color="#E0E0E0" />
                <Text style={styles.emptyTitle}>No treatments found</Text>
                <Text style={styles.emptySubtitle}>
                  You don't have any treatments yet
                </Text>
              </View>
            )}
          </>
        )}

        {selectedTab === "packages" && (
          <>
            {isLoadingPackages ? (
              <View style={styles.loadingContainer}>
                <Ionicons
                  name="refresh-circle"
                  size={50}
                  color="#B0174C"
                  style={styles.loadingIcon}
                />
                <Text style={styles.loadingText}>Loading Packages...</Text>
              </View>
            ) : packagesError ? (
              <ErrorView onRetry={onRefresh} />
            ) : packages.length > 0 ? (
              packages.map((packageItem: any, index: number) => (
                <View style={styles.card} key={index}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.invoiceNumber}>
                      #{packageItem.INVOICENO || "N/A"}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {packageItem.REMAINING > 0 && !packageItem.ISEXPIRED ? (
                        <TouchableOpacity
                          style={styles.statusBadgeBook}
                          onPress={() =>
                            router.push("/bookappointment/booking")
                          }
                        >
                          <Text style={styles.statusTextBook}>Book</Text>
                        </TouchableOpacity>
                      ) : packageItem.ISEXPIRED ? (
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>Expired</Text>
                        </View>
                      ) : packageItem.REMAINING === 0 ? (
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>Used Up</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Text style={styles.packageName}>
                    {packageItem.MEMBERSHIPNAME || "N/A"}
                  </Text>
                  <Text style={styles.treatmentName}>
                    {packageItem.TREATMENTNAME || "N/A"}
                  </Text>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${
                              ((packageItem.USEDTIMES || 0) /
                                (packageItem.TOTALTREATMENTS || 1)) *
                              100
                            }%`,
                            backgroundColor:
                              packageItem.REMAINING > 0 ? "#B0174C" : "#4CAF50",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {packageItem.USEDTIMES || 0} of{" "}
                      {packageItem.TOTALTREATMENTS || 0} used
                    </Text>
                  </View>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar" size={16} color="#888" />
                      <Text style={styles.detailText}>Purchase date:</Text>
                      <Text style={styles.detailText}>
                        {packageItem.INVOICEDATE
                          ? new Date(
                              packageItem.INVOICEDATE,
                            ).toLocaleDateString()
                          : "No Date"}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={16}
                        color="#888"
                      />

                      <Text style={styles.detailText}>Expired date:</Text>
                      <Text style={styles.detailText}>
                        {packageItem.EXPIREDDATE
                          ? new Date(
                              packageItem.EXPIREDDATE,
                            ).toLocaleDateString()
                          : "No Date"}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="pricetag" size={16} color="#888" />
                      <Text style={styles.detailText}>
                        Remaining:{" "}
                        <Text style={styles.remainingValue}>
                          {packageItem.REMAINING || "0"}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="cube-outline" size={60} color="#E0E0E0" />
                <Text style={styles.emptyTitle}>No packages found</Text>
                <Text style={styles.emptySubtitle}>
                  You don't have any packages yet
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Pure white background
  },
  backButton: {
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  headerRightPlaceholder: {
    width: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingTop: StatusBar.currentHeight,
  },
  tabButton: {
    padding: 16,
    flex: 1,
    alignItems: "center",
    position: "relative",
  },

  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888",
  },

  activeTabText: {
    color: "#B0174C",
    fontWeight: "600",
  },
  tabIndicator: {},
  content: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statusBadge: {
    backgroundColor: "#B0174C", // Light yellow background
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFE082",
  },

  statusBadgeBook: {
    backgroundColor: "green", // Light yellow background
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "green",
  },
  statusText: {
    fontSize: 12,
    color: "#FFA000", // Darker yellow
    fontWeight: "500",
    marginHorizontal: 10,
  },
  statusTextBook: {
    fontSize: 12,
    color: "white", // Darker yellow
    fontWeight: "500",
    marginHorizontal: 10,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  packageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#EEE",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  detailsContainer: {
    marginVertical: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  remainingValue: {
    fontWeight: "600",
    color: "#B0174C",
  },
  actionButton: {
    backgroundColor: "#B0174C",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  actionButtonText: {
    color: "#FFA000",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
  },
  loadingIcon: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 18,
    color: "#FF6B6B",
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  errorSubText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#B0174C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
  },
  emptyTitle: {
    fontSize: 18,
    color: "#555",
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFB900",
  },
});

export default YourTreatmentAndPackageScreen;
