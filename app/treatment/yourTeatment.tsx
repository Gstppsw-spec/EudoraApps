import React from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';

// Function to fetch treatment data from the API
const fetchTreatments = async ({ queryKey }) => {
  const [, customerId] = queryKey; // Destructure customer ID from query key
  const res = await fetch(`https://sys.eudoraclinic.com:84/apieudora/getDetailTransactionTreatment/${customerId}`);
  if (!res.ok) throw new Error("Network error"); // Handle network errors
  const data = await res.json(); // Parse JSON response
  console.log("Fetched Data:", data); // Log the fetched data for debugging
  return data;
};

const YourTreatmentScreen = () => {
  const customerId = 5; // Replace with your customer ID if needed

  // Use React Query to handle data fetching
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['getDetailTransactionTreatment', customerId],
    queryFn: fetchTreatments,
        enabled: !!customerId,
  });

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>Invoice No:</Text>
        <Text style={styles.value}>{item.invoiceNo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Treatment:</Text>
        <Text style={[styles.value, styles.treatment]}>{item.treatment}</Text>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>{item.total}</Text>
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Used</Text>
          <Text style={styles.detailValue}>{item.used}</Text>
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Exchange</Text>
          <Text style={styles.detailValue}>{item.exchange}</Text>
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Remaining</Text>
          <Text style={styles.detailValue}>{item.remaining}</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text style={[
          styles.statusText,
          item.status === 'Ready' ? styles.readyStatus : styles.usedStatus,
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  const onRefresh = () => {
    refetch(); // Trigger a refetch of data
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Treatment Vouchers</Text>
      <FlatList
        data={data?.customerBooking || []} // Access data safely
        renderItem={renderItem}
        keyExtractor={(item) => item.invoiceNo}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No treatments available.</Text>}
      />
      {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>Error loading treatments. Please try again.</Text>}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
    color: '#555',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  treatment: {
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  detailColumn: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  statusText: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  readyStatus: {
    backgroundColor: '#e0f7fa',
    color: '#00acc1',
  },
  usedStatus: {
    backgroundColor: '#ffebee',
    color: '#f44336',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaaaaa',
    marginTop: 30,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: "#333",
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
});

export default YourTreatmentScreen;