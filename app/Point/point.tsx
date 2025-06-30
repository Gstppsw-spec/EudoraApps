import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

const pointsData = {
  normal: [
    {
      date: "11 April 2025",
      description: "Point Transaksi Teman Kamu",
      transactionPoints: 0,
      referralPoints: 400000,
      pointsUsed: 0,
      total: 400000,
    },
    {
      date: "10 April 2025",
      description: "Bonus Registrasi",
      transactionPoints: 0,
      referralPoints: 200000,
      pointsUsed: 0,
      total: 200000,
    },
  ],
  medis: [
    {
      date: "22 April 2025",
      description: "Point Transaksi Medis",
      transactionPoints: 400000,
      referralPoints: 0,
      pointsUsed: 0,
      total: 400000,
    },
    {
      date: "15 April 2025",
      description: "Point Pembelian Paket",
      transactionPoints: 600000,
      referralPoints: 0,
      pointsUsed: 0,
      total: 600000,
    },
  ],
  nonMedis: [
    {
      date: "22 April 2025",
      description: "Point Terpakai",
      transactionPoints: 0,
      referralPoints: 980000,
      pointsUsed: 220000,
      total: 780000,
    },
    {
      date: "18 April 2025",
      description: "Point Pembelian Produk",
      transactionPoints: 500000,
      referralPoints: 0,
      pointsUsed: 0,
      total: 500000,
    },
  ],
};

export default function PointsDetail() {
  const [activeTab, setActiveTab] = useState('normal');

  const renderPoints = () => {
    return pointsData[activeTab].map((item, index) => (
      <View key={index} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{item.date}</Text>
          <View style={styles.pointBadge}>
            <Text style={styles.pointBadgeText}>+{item.total.toLocaleString('id-ID')}</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.pointDetails}>
          <View style={styles.pointRow}>
            <Text style={styles.pointLabel}>Point Transaksi:</Text>
            <Text style={styles.pointValue}>{item.transactionPoints.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.pointRow}>
            <Text style={styles.pointLabel}>Point Referral:</Text>
            <Text style={styles.pointValue}>{item.referralPoints.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.pointRow}>
            <Text style={styles.pointLabel}>Penggunaan Point:</Text>
            <Text style={[styles.pointValue, { color: item.pointsUsed > 0 ? '#FF5252' : '#4CAF50' }]}>
              {item.pointsUsed > 0 ? '-' : ''}{item.pointsUsed.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with combined navigation */}
        <View style={styles.header}>
          <View style={styles.navContainer}>
            <Link href="/tabs/home" asChild>
              <TouchableOpacity style={styles.navButton}>
                <FontAwesome name="chevron-left" size={20} color="#000000" />
              </TouchableOpacity>
            </Link>
          
          </View>
          
          <Text style={styles.title}>Riwayat Poin</Text>
          
          <View style={styles.headerRight} />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {Object.keys(pointsData).map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'normal' ? 'REGULER' : tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <ScrollView style={styles.content}>
            {pointsData[activeTab].length > 0 ? (
              renderPoints()
            ) : (
              <View style={styles.emptyState}>
                <FontAwesome name="file-text-o" size={50} color="#E0E0E0" />
                <Text style={styles.emptyText}>Tidak ada riwayat poin</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  navButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#333',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  headerRight: {
    width: 60,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFB900',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  activeTabText: {
    color: '#FFB900',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 15,
  },
  content: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
  pointBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 10,
  },
  pointDetails: {
    marginTop: 5,
  },
  pointRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pointLabel: {
    fontSize: 14,
    color: '#666',
  },
  pointValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 15,
  },
});