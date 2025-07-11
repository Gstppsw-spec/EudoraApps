import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { Link, router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import Toast from "react-native-toast-message";
import useStore from "../../../store/useStore";

const { width } = Dimensions.get("window");
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchAvailableTime = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getListBooking/${customerId}/1`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchDetailCustomer = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getDetailCustomer/${customerId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const canceledBooking = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/canceledBooking`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export default function HomeScreen() {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const [isEnabled, setIsEnabled] = useState(false);
  const [switchStates, setSwitchStates] = useState<boolean[]>([]);
  const queryClient = useQueryClient();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%", "50%"], []);

  const handlePresentModalPress = useCallback((bookingId) => {
    setCurrentBooking(bookingId);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCancel = () => {
    setCurrentBooking(null);
    bottomSheetModalRef.current?.dismiss();
  };

  const imageData = [
    `${apiUrl}/uploads/iklan/carousel4.jpg`,
    `${apiUrl}/uploads/iklan/carousel.jpg`,
  ];

  const imageDataEvent = [
    `${apiUrl}/uploads/iklan/promo779k.png`,
    `${apiUrl}/uploads/iklan/1rupiah.png`,
  ];

  const progressValue = useSharedValue(0);
  const { addReminder, removeReminder } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["getListBooking", customerId],
    queryFn: fetchAvailableTime,
    enabled: !!customerId,
  });

  const {
    data: customerDetail,
    isLoading: isLoadingCustomerDetail,
    refetch: refectCustomerDetail,
  } = useQuery({
    queryKey: ["getDetailCustomer", customerId],
    queryFn: fetchDetailCustomer,
    enabled: !!customerId,
  });

  const mutation = useMutation({
    mutationFn: canceledBooking,
    onSuccess: (data) => {
      setCurrentBooking(null);
      bottomSheetModalRef.current?.dismiss();
      Toast.show({
        type: "success",
        text2: "Appointment berhsil dicancel!",
        position: "top",
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries(["getListBooking", customerId]);
    },
    onError: (error) => {
      setCurrentBooking(null);
      bottomSheetModalRef.current?.dismiss();
      Toast.show({
        type: "error",
        text2: "Appointment gagal dicancel!",
        position: "top",
        visibilityTime: 2000,
      });
      console.error("Error posting data:", error);
    },
  });

  useEffect(() => {
    if (!data?.customerbooking) return;
    const { isReminderActive } = useStore.getState();
    const newSwitchStates = data.customerbooking.map(
      (booking: { BOOKINGID: any }) => isReminderActive(booking.BOOKINGID)
    );

    setSwitchStates(newSwitchStates);
  }, [data]);

  const toggleSwitch = (index: number) => {
    if (!data?.customerbooking) return;

    const booking = data.customerbooking[index];
    const wasEnabled = switchStates[index];
    const willBeEnabled = !wasEnabled;
    setSwitchStates((prevState) => {
      const updated = [...prevState];
      updated[index] = willBeEnabled;

      return updated;
    });
    if (willBeEnabled) {
      const dateOnly = new Date(booking.TREATMENTDATE.split(" ")[0]);
      dateOnly.setHours(0, 0, 0, 0);
      const bookingDateTime = new Date(
        booking.TREATMENTDATE.replace(" ", "T").split("T")[0] +
          "T" +
          booking.TIME +
          ":00"
      );
      const twoHoursBefore = new Date(
        bookingDateTime.getTime() - 2 * 60 * 60 * 1000
      );

      const now = new Date();
      if (dateOnly > now) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Hari ini kamu ada booking!",
            body: `${booking.SERVICE} di ${booking.LOCATIONNAME}`,
            sound: true,
          },
          trigger: { type: "date", date: dateOnly },
        });
      }

      if (twoHoursBefore > now) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Booking 2 jam lagi!",
            body: `${booking.SERVICE} jam ${booking.TIME} di ${booking.LOCATIONNAME}`,
            sound: true,
          },
          trigger: { type: "date", date: twoHoursBefore },
        });
      }

      addReminder(booking.BOOKINGID);
    } else {
      removeReminder(booking.BOOKINGID);
    }
  };

  const cancelModal = () => {
    setModalVisible(false);
    setCurrentBooking(null);
  };


  const confirmCanceledBooking = () => {
    mutation.mutate({
      bookingId: currentBooking,
    });
    
  };

  const onRefresh = () => {
    refetch();
    refectCustomerDetail();
  };

  return (
    <SafeAreaView style={styles.containerArea}>
      <ScrollView
        style={{ paddingTop: StatusBar.currentHeight }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <Carousel
            width={width}
            height={320}
            data={imageData}
            scrollAnimationDuration={1000}
            autoPlay
            autoPlayInterval={3000}
            pagingEnabled
            onProgressChange={(_, absoluteProgress) =>
              (progressValue.value = absoluteProgress)
            }
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="repeat"
                />
              </View>
            )}
          />
          <View style={styles.indicatorContainer}>
            {imageData.map((_, i) => (
              <IndicatorDot key={i} index={i} progressValue={progressValue} />
            ))}
          </View>

          <LinearGradient
            colors={["#FFFFFF", "#FFFFFF", "#B0174C"]} // putih dominan, oranye sedikit
            locations={[0, 0.85, 1]} // oranye hanya di 5% bagian bawah
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.pointsCard}
          >
            <Link href="/Point/point" style={styles.pointItem}>
              <View style={styles.pointContent}>
                <FontAwesome
                  name="gift" // bisa diganti "gift", "diamond", "trophy", dll
                  size={18}
                  color="#B0174C"
                  style={{ marginLeft: 6 }}
                />
                <Text style={styles.pointValue}>
                  {customerDetail?.detailcustomer[0]?.TOTALPOINT
                    ? parseInt(
                        customerDetail.detailcustomer[0].TOTALPOINT
                      ).toLocaleString("id-ID")
                    : "0"}{" "}
                  POINTS
                </Text>
              </View>
            </Link>
            <View style={styles.divider} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginHorizontal: 10,
              }}
            >
              <Text style={styles.referralLabel}>
                Dapatkan point dengan undang teman kamu
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginRight: 5,
                }}
              >
                <TouchableOpacity
                  style={styles.referralContainer}
                  onPress={() => {
                    const code =
                      customerDetail?.detailcustomer[0]?.REFERRALCODE ||
                      "UNKNOWN";
                    Clipboard.setStringAsync(code);
                    if (Platform.OS === "android") {
                      Toast.show({
                        type: "success",
                        text2: "Refferal code berhasil dicopy!",
                        position: "top",
                        visibilityTime: 2000,
                      });
                    } else {
                      Toast.show({
                        type: "success",
                        text2: "Refferal code berhasil dicopy!",
                        position: "top",
                        visibilityTime: 2000,
                      });
                    }
                  }}
                >
                  <Feather name="copy" size={20} color="#B0174C" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      const code =
                        customerDetail?.detailcustomer[0]?.REFERRALCODE ||
                        "UNKNOWN";
                      const message = `Gunakan kode referral saya: ${code} untuk daftar di Eudora Clinic! ✨`;

                      await Share.share({ message });
                    } catch (error) {
                      Toast.show({
                        type: "error",
                        text2: "Gagal share refferal code!",
                        position: "top",
                        visibilityTime: 2000,
                      });
                    }
                  }}
                >
                  <FontAwesome name="share-alt" size={20} color="#B0174C" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            position: "absolute",
            top: 10,
            alignItems: "center",
          }}
        >
          <BlurView intensity={30} tint="dark" style={styles.searchContainer}>
            <FontAwesome
              name="search"
              size={15}
              color="#fff"
              style={styles.icon}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="white"
              style={styles.input}
            />
            <TouchableOpacity>
              <FontAwesome name="filter" size={15} color="#fff" />
            </TouchableOpacity>
          </BlurView>
          <View
            style={{
              borderColor: "#272835",
              borderWidth: 0.1,
              borderRadius: "100%",
              padding: 15,
              backgroundColor: "#1A1B25",
              marginRight: 10,
              alignItems: "center",
            }}
          >
            <Link href={"/notification"}>
              <FontAwesome name="bell" size={15} color="white" />
            </Link>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            marginTop: 70,
            marginBottom: 10,
          }}
        >
          <View style={{ gap: 5, marginLeft: 20 }}>
            <Text
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: 16,
                marginBottom: 2,
              }}
            >
              {" "}
              Hi {customerDetail?.detailcustomer?.[0]?.FIRSTNAME}{" "}
              {customerDetail?.detailcustomer?.[0]?.LASTNAME}, siap menjadi
              cantik?
            </Text>
          </View>
        </View>

        <View style={styles.containerCategory}>
          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <MaterialCommunityIcons
                name="face-woman-shimmer"
                size={24}
                color="#B0174C"
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>Face</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <FontAwesome name="female" size={20} color="#B0174C" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>Body</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <FontAwesome name="shopping-bag" size={20} color="#B0174C" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>Product</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity
              style={styles.buttonIconCategory}
              onPress={() => router.push("/category/more-category")}
            >
              <FontAwesome name="ellipsis-h" size={20} color="#B0174C" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>More</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Upcoming Appointments
            </Text>
            <Link href={"/mybooking/myBooking"} asChild>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", color: "#B0174C" }}
                >
                  See All
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            marginBottom: 30,
            paddingHorizontal: 20,
            marginTop: 10,
          }}
        >
          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" />
            </View>
          ) : error ? (
            <Text>Error..</Text>
          ) : data?.customerbooking?.length > 0 ? (
            data.customerbooking
              .slice(0, 3)
              .map((booking: any, index: number) => {
                const formattedDate = new Date(
                  booking.TREATMENTDATE.replace(" ", "T")
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                return (
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      borderColor: "#ECEFF3",
                      marginBottom: 10,
                    }}
                    key={index}
                  >
                    <View style={styles.bookingContainer}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.dateText}>
                          {formattedDate} ({booking.TIME})
                        </Text>
                        <View style={styles.remindButton}>
                          <Text style={styles.remindText}>Remind me</Text>
                          <Switch
                            style={styles.switch}
                            trackColor={{ false: "#ccc", true: "#FFB900" }}
                            thumbColor={isEnabled ? "#fff" : "#fff"}
                            ios_backgroundColor="#ccc"
                            onValueChange={() => toggleSwitch(index)}
                            value={switchStates[index]}
                          />
                        </View>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.row}>
                        <Image
                          source={{
                            uri: `${apiUrl}/upload/${booking.IMAGE}`,
                          }}
                          style={styles.clinicImage}
                        />
                        <View style={styles.bookingDetails}>
                          <Text style={styles.clinicName}>
                            {booking.LOCATIONNAME}
                          </Text>
                          <Text style={styles.clinicAddress}>
                            {booking.ADDRESS}
                          </Text>
                          <Text style={styles.servicesTitle}>Services:</Text>
                          <Text style={styles.servicesText}>
                            {booking.SERVICE}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => handlePresentModalPress(booking.BOOKINGID)}
                        >
                          <Text style={styles.cancelText}>Cancel Booking</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="medkit-outline" size={40} color="#E0E0E0" />
              <Text style={styles.emptyTitle}>No History found</Text>
              <Text style={styles.emptySubtitle}>
                You don't have any upcoming appointment yet
              </Text>
            </View>
          )}
        </View>

        <View>
          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                Our Beauty Event,
              </Text>

              <TouchableOpacity>
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", color: "#FFB900" }}
                ></Text>
              </TouchableOpacity>
            </View>
          </View>

          <Carousel
            width={width}
            height={200}
            data={imageDataEvent}
            scrollAnimationDuration={1000}
            autoPlay
            autoPlayInterval={3000}
            pagingEnabled
            onProgressChange={(_, absoluteProgress) =>
              (progressValue.value = absoluteProgress)
            }
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#ccc",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 10,
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: "100%", height: "100%", borderRadius: 10 }}
                  resizeMode="cover"
                />
              </View>
            )}
          />
          <View style={styles.indicatorContainer}>
            {imageData.map((_, i) => (
              <IndicatorDot key={i} index={i} progressValue={progressValue} />
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 80 }} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelModal} // Close on back button
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to cancel this booking?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={cancelModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmCanceledBooking()}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
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
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#f87171" }]}
                onPress={confirmCanceledBooking}
              >
                <Text style={[styles.modalButtonText, { color: "white" }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </SafeAreaView>
  );
}

const IndicatorDot = ({ index, progressValue }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3],
      "clamp"
    );
    const scale = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [1, 1.5, 1],
      "clamp"
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#333",
    marginHorizontal: 5,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // marginTop: 10,
    // position: 'absolute',
    // top: 200
  },
  containerArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  floatingBox: {
    backgroundColor: "#1A1B25",
    padding: 15,
    position: "absolute",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F9A000",
    width: "90%",
    top: 145,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.15)",
    width: "80%",
    paddingHorizontal: 13,
    paddingVertical: Platform.OS === "ios" ? 12 : 0,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
    marginLeft: 10,
    alignSelf: "center",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  icon: {
    marginRight: 10,
  },
  containerCategory: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 15,
  },
  switch: {
    marginLeft: 2,
  },
  iconCategory: {
    alignItems: "center",
  },
  buttonIconCategory: {
    width: 60,
    height: 60,
    borderRadius: 30, // setengah dari width/height
    borderWidth: 1,
    borderColor: "#FFE5F8",
    backgroundColor: "#FFE5F8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },

  bookingContainer: {
    paddingVertical: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  clinicImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  bookingDetails: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    // fontWeight: "bold",
    // marginBottom: 10,
  },
  remindButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  remindText: {
    color: "#A4ACB9",
    fontSize: 14,
    // fontWeight: "bold",
  },
  clinicName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  clinicAddress: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  servicesTitle: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  servicesText: {
    fontSize: 13,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ff5252",
    borderRadius: 5,
    marginRight: 10,
    width: "100%",
  },
  cancelText: {
    color: "#ff5252",
    fontWeight: "bold",
    textAlign: "center",
  },
  receiptButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#FFB900",
    borderRadius: 5,
  },
  receiptText: {
    color: "#FFB900",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  pointsCard: {
    backgroundColor: "#1A1B25",
    borderRadius: 15,
    height: 110,
    position: "absolute",
    borderWidth: 0.2,
    borderColor: "#1A1B25",
    width: "95%",
    top: 265,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.84,
  },
  pointItem: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
  },
  pointContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#FFE5F8",
    borderRadius: 20,
    flexDirection: "row",
    gap: 10,
  },
  pointLabel: {
    color: "green",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  pointValue: {
    color: "black",
    fontSize: 12,
    fontWeight: "bold",
  },
  dividerVertical: {
    width: 1,
    height: "60%",
    backgroundColor: "#FFB900",
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
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
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  referralContainer: {
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
  },

  referralLabel: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
  },

  referralCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFA500",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
