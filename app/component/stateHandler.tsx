import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

type Props = {
  loading?: boolean;
  error?: any;
  empty?: boolean;
  onRetry?: () => void;
  retryLoading?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  errorMessage?: string;
};

const StateHandler: React.FC<Props> = ({
  loading,
  error,
  empty,
  onRetry,
  retryLoading,
  emptyMessage = "Data kosong",
  emptySubMessage = "Belum ada data yang tersedia",
  errorMessage = "Terjadi kesalahan saat memuat data",
}) => {
  // LOADING
  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C4EFF" />
          <View style={styles.loadingTextContainer}>
            <Text style={styles.loadingTitle}>Memuat Data</Text>
            <Text style={styles.loadingSubtitle}>Mohon tunggu sebentar...</Text>
          </View>
        </View>
      </View>
    );
  }

  // ERROR
  if (error) {
    return (
      <View style={styles.center}>
        <View style={styles.errorContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
          </View>
          <Text style={styles.errorTitle}>Oops! Ada Masalah</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          {error?.message && (
            <Text style={styles.errorDetail}>{error.message}</Text>
          )}
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={styles.retryButton}
              activeOpacity={0.8}
              disabled={retryLoading}
            >
              {retryLoading ? (
                <ActivityIndicator color="#6C4EFF" size="small" />
              ) : (
                <Text style={styles.retryButtonText}>🔄 Coba Lagi</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // EMPTY
  if (empty) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
          </View>
          <Text style={styles.emptyTitle}>{emptyMessage}</Text>
          <Text style={styles.emptyMessage}>{emptySubMessage}</Text>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={styles.reloadButton}
              activeOpacity={0.8}
              disabled={retryLoading}
            >
              {retryLoading ? (
                <ActivityIndicator color="#6C4EFF" size="small" />
              ) : (
                <Text style={styles.reloadButtonText}>⟳ Refresh</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return null;
};

export default StateHandler;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FC",
  },

  // Loading Styles
  loadingContainer: {
    alignItems: "center",
    padding: 24,
  },
  loadingTextContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
  },

  // Error Styles
  errorContainer: {
    alignItems: "center",
    padding: 28,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    maxWidth: width - 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF3E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  errorIcon: {
    fontSize: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E74C3C",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 20,
  },
  errorDetail: {
    fontSize: 12,
    color: "#95A5A6",
    textAlign: "center",
    marginBottom: 24,
    fontStyle: "italic",
  },
  retryButton: {
    backgroundColor: "#6C4EFF",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 140,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Empty Styles
  emptyContainer: {
    alignItems: "center",
    padding: 28,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    maxWidth: width - 40,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  reloadButton: {
    backgroundColor: "#6C4EFF",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 140,
    alignItems: "center",
  },
  reloadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
