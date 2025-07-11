import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Constants from 'expo-constants';
import React, { useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import useStore from "../../store/useStore";
import HeaderWithBack from "../component/headerWithBack";

const apiUrl = Constants.expoConfig?.extra?.apiUrl || Constants.manifest?.extra?.apiUrl;


const fetchListTreatments = async ({queryKey}: any) => {
  const [, customerId] = queryKey;
  const response = await fetch(
    `${apiUrl}/getDetailTransactionTreatment/${customerId}`
  );
  if (!response.ok) {
    throw new Error("Network error: " + response.statusText);
  }
  return response.json();
};

const fetchListPackages = async ({queryKey}: any) => {
  const [, customerId] = queryKey;
  const response = await fetch(
    `${apiUrl}/getDetailTransactionMembership/${customerId}`
  );
  if (!response.ok) {
    throw new Error("Network error: " + response.statusText);
  }
  return response.json();
};

const YourTreatmentAndPackageScreen = () => {
  const [selectedTab, setSelectedTab] = useState("treatments");
  const customerId = useStore((state) => state.customerid);

  
console.log(apiUrl);

  const {
    data: treatmentsData,
    isLoading: isLoadingTreatments,
    error: treatmentsError,
    refetch: refetchTreatments,
  } = useQuery({
    queryKey: ["treatments", customerId],
    queryFn: fetchListTreatments,
    enabled: !!customerId
  });

  // Fetch packages
  const {
    data: packagesData,
    isLoading: isLoadingPackages,
    error: packagesError,
    refetch: refetchPackages,
  } = useQuery({
    queryKey: ["packages", customerId],
    queryFn: fetchListPackages,
    enabled: !!customerId
  });

  // Handle refresh action
  const onRefresh = () => {
    refetchTreatments();
    refetchPackages();
  };

  // Extract data
  const treatments = treatmentsData?.treatment || [];
  const packages = packagesData?.membership || [];

  return (
    <SafeAreaView style={styles.container}>
      
      <HeaderWithBack
        title="My Treatments & Packages"
        backHref="/tabs/account"
      />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Tab selection */}
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
            Treatments
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
            Packages
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
              <View style={styles.errorContainer}>
                <Ionicons name="warning" size={40} color="#FF6B6B" />
                <Text style={styles.errorText}>Failed to load treatments</Text>
                <Text style={styles.errorSubText}>
                  {treatmentsError.message}
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={refetchTreatments}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : treatments.length > 0 ? (
              treatments.map((treatment, index) => (
                <View style={styles.card} key={index}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.invoiceNumber}>
                      #{treatment.INVOICENO || "N/A"}
                    </Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>Active</Text>
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
                              ((treatment.TERPAKAI || 0) /
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
                      <Text style={styles.detailText}>
                        {treatment.INVOICEDATE
                          ? new Date(treatment.INVOICEDATE).toLocaleDateString()
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
              <View style={styles.errorContainer}>
                <Ionicons name="warning" size={40} color="#FF6B6B" />
                <Text style={styles.errorText}>Failed to load packages</Text>
                <Text style={styles.errorSubText}>{packagesError.message}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={refetchPackages}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : packages.length > 0 ? (
              packages.map((packageItem, index) => (
                <View style={styles.card} key={index}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.invoiceNumber}>
                      #{packageItem.INVOICENO || "N/A"}
                    </Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>Active</Text>
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
                      <Text style={styles.detailText}>
                        {packageItem.INVOICEDATE
                          ? new Date(
                              packageItem.INVOICEDATE
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
    color: "#B0174C", // Yellow for active tab
    fontWeight: "600",
  },
  tabIndicator: {

  },
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
    backgroundColor: "#FFE5F8", // Light yellow background
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  statusText: {
    fontSize: 12,
    color: "#FFA000", // Darker yellow
    fontWeight: "500",
  },
  treatmentName: {
    fontSize: 18,
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
    backgroundColor: "#FFE5F8",
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
