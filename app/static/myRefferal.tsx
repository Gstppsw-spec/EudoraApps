import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DateRangeFilter from "../component/dateRangeFilter";
import ErrorView from "../component/errorView";
import HeaderWithBack from "../component/headerWithBack";
import LoadingView from "../component/loadingView";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchRefferalCustomer = async ({ queryKey }: any) => {
  const [, customerId, dateStartFilter, dateEndFilter, filterType] = queryKey;
  const res = await fetch(
    `${apiUrl}/getListRefferalFriend/${customerId}?dateStart=${dateStartFilter}&dateEnd=${dateEndFilter}&filterType=${filterType}`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const MyRefferalScreen = () => {
  const { t } = useTranslation();
  const today = new Date();
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const [dateStart, setDateStart] = React.useState<Date>(today);
  const [dateEnd, setDateEnd] = React.useState<Date>(today);

  const [filterType, setFilterType] = React.useState("show");

  const dateStartFilter = dateStart.toISOString().split("T")[0];
  const dateEndFilter = dateEnd.toISOString().split("T")[0];

  const { data, isLoading, refetch, isRefetching, isError } = useQuery({
    queryKey: [
      "getListRefferalFriend",
      customerId,
      dateStartFilter,
      dateEndFilter,
      filterType,
    ],
    queryFn: fetchRefferalCustomer,
    enabled:
      !!customerId || !!dateStartFilter || !!dateEndFilter || !!filterType,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithBack title={t("myReferral")} useGoBack />
        <DateRangeFilter
          t={t}
          onChange={({ filterType, dateStart, dateEnd }) => {
            setDateEnd(dateEnd);
            setDateStart(dateStart);
            setFilterType(filterType);
          }}
        />

        <LoadingView />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithBack title={t("myReferral")} useGoBack />
        <DateRangeFilter
          t={t}
          onChange={({ filterType, dateStart, dateEnd }) => {
            setDateEnd(dateEnd);
            setDateStart(dateStart);
            setFilterType(filterType);
          }}
        />
        <ErrorView onRetry={onRefresh} />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons
        name="person-circle-outline"
        size={40}
        color="#007AFF"
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.refferalname}</Text>
        <Text style={styles.detail}>
          {t("registerDate")} :{" "}
          <Text style={styles.detailValue}>{item.registerdate}</Text>
        </Text>
        <Text style={styles.detail}>
          First Show :{"  "}
          <Text style={styles.detailValue}>
            {item.first_treatment_date
              ? item.first_treatment_date
              : "Not Yet Show"}
          </Text>
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title={t("myReferral")} useGoBack />
      <DateRangeFilter
        t={t}
        onChange={({ filterType, dateStart, dateEnd }) => {
          setDateEnd(dateEnd);
          setDateStart(dateStart);
          setFilterType(filterType);
        }}
      />

      {data?.listRefferalFriend?.length > 0 ? (
        <FlatList
          data={data?.listRefferalFriend || []}
          keyExtractor={(item) => item.cellphonenumber.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 12 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={80} color="#D0D0D0" />
          <Text style={styles.emptyTitle}>{t("noReferralYet")}</Text>
          <Text style={styles.emptySubtitle}>
            {t("noReferralDesc") || "You don't have any referral yet"}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    flex: 1,
    marginHorizontal: 4,
  },

  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },

  detail: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },

  detailValue: {
    color: "#007AFF",
    fontWeight: "500",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  filterWrapper: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 6,
    flex: 1,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#FF3B30",
    fontWeight: "500",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
  },
  dateLabel: {
    fontSize: 12,
    color: "#888",
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  segmentWrapper: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 2,
  },
  segmentButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: "#007AFF",
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#555",
  },
  segmentTextActive: {
    color: "#fff",
  },
});

export default MyRefferalScreen;
