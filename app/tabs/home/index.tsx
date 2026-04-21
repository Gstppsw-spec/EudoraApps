import HeaderActions from "@/app/component/headerWithSearchCartNotification";
import PopUpModal from "@/app/component/popUpModal";
import PopUpUpdate from "@/app/component/popUpUpdate";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { Link, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
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

const getEvent = async () => {
  const res = await fetch(`${apiUrl}/getListEvent`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const getAds = async () => {
  const res = await fetch(`${apiUrl}/getListAds`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const getCategory = async ({ queryKey }: any) => {
  const [, customerId, token] = queryKey;
  const res = await fetch(`${apiUrl}/getListCategoryApps`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      auth_token_customer: `${token}`,
      customerid: `${customerId}`,
    },
  });
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
  const { t } = useTranslation();
  const customerDetails = useStore((state) => state.customerDetails);

  const handlePresentModalPress = useCallback((bookingId: any) => {
    setCurrentBooking(bookingId);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCancel = () => {
    setCurrentBooking(null);
    bottomSheetModalRef.current?.dismiss();
  };

  const [refreshing, setRefreshing] = useState(false);
  const progressValue = useSharedValue(0);
  const { addReminder, removeReminder } = useStore();

  const [currentBooking, setCurrentBooking] = useState(null);

  const {
    data: event,
    isLoading: isLoadingEvent,
    refetch: refetchEvent,
    isRefetching: isRefetchingEvent,
  } = useQuery({
    queryKey: ["getListEvent"],
    queryFn: getEvent,
  });

  const {
    data: ads,
    isLoading: isLoadingads,
    refetch: refetchads,
    isRefetching: isRefetchingads,
  } = useQuery({
    queryKey: ["getListAds"],
    queryFn: getAds,
  });

  const {
    data: category,
    isLoading: isLoadingcategory,
    refetch: refetchcategory,
    isRefetching: isRefetchingcategory,
  } = useQuery({
    queryKey: ["getListCategoryApps", customerId, customerDetails?.token],
    queryFn: getCategory,
    enabled: !!customerId || customerDetails?.token,
  });

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

  const confirmCanceledBooking = () => {
    mutation.mutate({
      bookingId: currentBooking,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([
        refetch(),
        refetchEvent(),
        refetchads(),
        refectCustomerDetail(),
        refetchcategory(),
      ]);
    } catch (error) {
      console.log("Error refreshing:", error);
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.containerArea}>
      <PopUpModal status={customerDetail?.detailcustomer[0]?.ISNEWCUSTOMER} />
      <PopUpUpdate />
      
      <ScrollView
        style={{ paddingTop: StatusBar.currentHeight }}
        showsVerticalScrollIndicator={false}
        
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <Carousel
            width={width}
            height={320}
            data={ads?.data}
            scrollAnimationDuration={1000}
            autoPlay
            autoPlayInterval={3000}
            pagingEnabled
            onProgressChange={(_, absoluteProgress) =>
              (progressValue.value = absoluteProgress)
            }
            renderItem={({ item }) => {
              const startX = useRef(0);
              const startY = useRef(0);
              let moved = false;
              return (
                <Pressable
                  onPress={() => {
                    if (!moved) {
                      WebBrowser.openBrowserAsync(
                        item?.link_url ??
                          "https://eudoraclinic.com/2024/01/29/rekomendasi-basic-skincare-untuk-pemula",
                        {
                          enableBarCollapsing: true,
                          showTitle: true,
                        }
                      );
                    }
                  }}
                  onPressIn={(e) => {
                    startX.current = e.nativeEvent.pageX;
                    startY.current = e.nativeEvent.pageY;
                    moved = false;
                  }}
                  onPressOut={(e) => {
                    const dx = Math.abs(e.nativeEvent.pageX - startX.current);
                    const dy = Math.abs(e.nativeEvent.pageY - startY.current);
                    if (dx > 10 || dy > 10) {
                      moved = true;
                    }
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: `${apiUrl}/${item?.image}`,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </Pressable>
              );
            }}
          />
          <View style={styles.indicatorContainer}>
            {ads?.data?.map((_, i) => (
              <IndicatorDot key={i} index={i} progressValue={progressValue} />
            ))}
          </View>

          <LinearGradient
            colors={["#FFFFFF", "#FFFFFF", "#B0174C"]}
            locations={[0, 0.9, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.pointsCard}
          >
            <Link href="/Point/point" style={styles.pointItem}>
              <View style={styles.pointContent}>
                <FontAwesome
                  name="gift"
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
              <Text style={styles.referralLabel}>{t("home.refferal")}</Text>
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
                        text2: t("home.copySuccess"),
                        position: "top",
                        visibilityTime: 2000,
                      });
                    } else {
                      Toast.show({
                        type: "success",
                        text2: t("home.copySuccess"),
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
                      const message = t("home.referralMessage", { code });

                      await Share.share({ message });
                    } catch (error) {
                      Toast.show({
                        type: "error",
                        text2: t("home.failedShare"),
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
        <HeaderActions  />
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
              {customerDetail?.detailcustomer?.[0]?.LASTNAME}, {t("home.hello")}
            </Text>
          </View>
        </View>
        {category?.listCategory?.length > 0 && (
          <View style={styles.containerCategory}>
            {category?.listCategory
              .slice(0, 3)
              .map((category: any, index: any) => {
                return (
                  <View style={styles.iconCategory} key={index}>
                    <TouchableOpacity
                      style={styles.buttonIconCategory}
                      onPress={() => router.push(`/category/${category.id}`)}
                    >
                      <Image
                        source={{ uri: category.icon_image }}
                        style={{ width: 60, height: 60, resizeMode: "contain" }}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: 2,
                      }}
                    >
                      {category.name}
                    </Text>
                  </View>
                );
              })}

            <View style={styles.iconCategory}>
              <TouchableOpacity
                style={styles.buttonIconCategory}
                onPress={() => router.push("/category")}
              >
                <FontAwesome name="ellipsis-h" size={20} color="#B0174C" />
              </TouchableOpacity>
              <Text style={{ fontSize: 11, fontWeight: "bold", marginTop: 1 }}>
                More
              </Text>
            </View>
          </View>
        )}

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
              {t("home.upcomingAppointment")}
            </Text>
            <Link href={"/mybooking/myBooking"} asChild>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", color: "#B0174C" }}
                >
                  {t("home.seeAll")}
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
                          <Text style={styles.remindText}>
                            {t("home.remindMe")}
                          </Text>
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
                            uri: `${apiUrl}/${booking.IMAGE}`,
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
                          <Text style={styles.servicesTitle}>
                            {t("home.services")}:
                          </Text>
                          <Text style={styles.servicesText}>
                            {booking.SERVICE}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() =>
                            handlePresentModalPress(booking.BOOKINGID)
                          }
                        >
                          <Text style={styles.cancelText}>
                            {t("home.cancelBooking")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="medkit-outline" size={40} color="#E0E0E0" />
              <Text style={styles.emptyTitle}>{t("home.noHistoryFound")}</Text>
              <Text style={styles.emptySubtitle}>
                {t("home.noUpcomingAppointments")}
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
                {t("home.ourBeautyEvent")}
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
            height={250}
            data={event?.data}
            scrollAnimationDuration={1000}
            autoPlay
            autoPlayInterval={3000}
            pagingEnabled
            onProgressChange={(_, absoluteProgress) =>
              (progressValue.value = absoluteProgress)
            }
            renderItem={({ item }) => {
              const startX = useRef(0);
              const startY = useRef(0);
              let moved = false;

              return (
                <Pressable
                  onPress={() => {
                    if (!moved) {
                      WebBrowser.openBrowserAsync(
                        item?.link_url ??
                          "https://eudoraclinic.com/2024/01/29/rekomendasi-basic-skincare-untuk-pemula",
                        {
                          enableBarCollapsing: true,
                          showTitle: true,
                        }
                      );
                    }
                  }}
                  onPressIn={(e) => {
                    startX.current = e.nativeEvent.pageX;
                    startY.current = e.nativeEvent.pageY;
                    moved = false;
                  }}
                  onPressOut={(e) => {
                    const dx = Math.abs(e.nativeEvent.pageX - startX.current);
                    const dy = Math.abs(e.nativeEvent.pageY - startY.current);
                    if (dx > 10 || dy > 10) {
                      moved = true;
                    }
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "#ccc",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 10,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: `${apiUrl}/${item.image}` }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </Pressable>
              );
            }}
          />
          <View style={styles.indicatorContainer}>
            {event?.data?.map((_, i) => (
              <IndicatorDot key={i} index={i} progressValue={progressValue} />
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 80 }} />
      </ScrollView>

      <View style={styles.container}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundStyle={{ borderRadius: 20, backgroundColor: "#fff" }}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              pressBehavior="close"
            />
          )}
        >
          <BottomSheetView style={styles.modalContent}>
            <Text style={styles.modalTitle}> {t("home.cancelBooking")}</Text>
            <Text style={styles.modalMessage}>
              {t("home.confirmCancelBooking")}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>{t("home.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#f87171" }]}
                onPress={confirmCanceledBooking}
              >
                <Text style={[styles.modalButtonText, { color: "white" }]}>
                  {t("home.confirm")}
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
    letterSpacing: 2,
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
    justifyContent: "center",
    margin: 8,
  },
  buttonIconCategory: {
    backgroundColor: "#FDECEF", // warna background soft pink
    borderRadius: 50, // bikin bulat
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3, // shadow android
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
