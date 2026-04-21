// components/DateRangeFilter.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";

interface DateRangeFilterProps {
  t: (key: string) => string;
  onChange: (params: {
    filterType: "show" | "registration";
    dateStart: Date | null;
    dateEnd: Date | null;
  }) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ t, onChange }) => {
  const [filterType, setFilterType] = useState<"show" | "registration">("show");
  const [dateStart, setDateStart] = useState<Date | null>(new Date());
  const [dateEnd, setDateEnd] = useState<Date | null>(new Date());
  const [pickerMode, setPickerMode] = useState<"start" | "end" | null>(null);

  const handleConfirm = (selectedDate: Date) => {
    if (pickerMode === "start") {
      if (dateEnd && selectedDate > dateEnd) {
        Toast.show({
          type: "info",
          text2: "Tanggal mulai tidak boleh setelah tanggal akhir",
          position: "top",
          visibilityTime: 2000,
        });
      } else {
        setDateStart(selectedDate);
        onChange({ filterType, dateStart: selectedDate, dateEnd });
      }
    } else if (pickerMode === "end") {
      if (dateStart && selectedDate < dateStart) {
        Toast.show({
          type: "info",
          text2: "Tanggal akhir tidak boleh sebelum tanggal awal",
          position: "top",
          visibilityTime: 2000,
        });
      } else {
        setDateEnd(selectedDate);
        onChange({ filterType, dateStart, dateEnd: selectedDate });
      }
    }
    setPickerMode(null);
  };

  return (
    <View style={styles.filterWrapper}>
      <View style={styles.filterHeader}>
        <Ionicons name="funnel-outline" size={20} color="#007AFF" />
        <Text style={styles.filterTitle}>{t("filter")}</Text>

        {/* Pilihan By Show / Registration */}
        <View style={styles.segmentWrapper}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              filterType === "show" && styles.segmentActive,
            ]}
            onPress={() => {
              setFilterType("show");
              onChange({ filterType: "show", dateStart, dateEnd });
            }}
          >
            <Text
              style={[
                styles.segmentText,
                filterType === "show" && styles.segmentTextActive,
              ]}
            >
              By First Show
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              filterType === "registration" && styles.segmentActive,
            ]}
            onPress={() => {
              setFilterType("registration");
              onChange({ filterType: "registration", dateStart, dateEnd });
            }}
          >
            <Text
              style={[
                styles.segmentText,
                filterType === "registration" && styles.segmentTextActive,
              ]}
            >
              By Registration
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Row tanggal */}
      <View style={styles.filterRow}>
        {/* Start Date */}
        <TouchableOpacity
          style={styles.dateCard}
          onPress={() => setPickerMode("start")}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={18} color="#007AFF" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.dateLabel}>Start</Text>
            <Text style={styles.dateValue}>
              {dateStart ? dateStart.toISOString().split("T")[0] : t("choose")}
            </Text>
          </View>
        </TouchableOpacity>

        {/* End Date */}
        <TouchableOpacity
          style={styles.dateCard}
          onPress={() => setPickerMode("end")}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={18} color="#007AFF" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.dateLabel}>End</Text>
            <Text style={styles.dateValue}>
              {dateEnd ? dateEnd.toISOString().split("T")[0] : t("choose")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal Date Picker */}
      <DateTimePickerModal
        isVisible={pickerMode !== null}
        mode="date"
        date={pickerMode === "start" ? dateStart || new Date() : dateEnd || new Date()}
        minimumDate={pickerMode === "end" ? dateStart || new Date() : undefined}
        onConfirm={handleConfirm}
        onCancel={() => setPickerMode(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterWrapper: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  segmentWrapper: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  segmentButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: "#007AFF",
  },
  segmentText: {
    fontSize: 12,
    color: "#555",
  },
  segmentTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dateCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    marginHorizontal: 4,
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

export default DateRangeFilter;
