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
  Pressable,
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
import { useTranslation } from "react-i18next"; // Translation hook

const { width } = Dimensions.get("window");
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchAvailableTime = async ({ queryKey }) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getListBooking/${customerId}/1`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchDetailCustomer = async ({ queryKey }) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getDetailCustomer/${customerId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const canceledBooking = async (formData) => {
  const response = await axios.post(`${apiUrl}/canceledBooking`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const fetchNotificationCustomerNotRead = async ({ queryKey }) => {
  const [, customerId] = queryKey;
  const res = await fetch(
    `${apiUrl}/get_user_notification_not_read/${customerId}`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

export default function HomeScreen() {
  const { t } = useTranslation(); // Initialize translation hook
  const customerId = useStore((state) => state.customerid);
  const [isEnabled, setIsEnabled] = useState(false);
  const [switchStates, setSwitchStates] = useState<boolean[]>([]);
  const [likedItemsCount, setLikedItemsCount] = useState(0);
  const queryClient = useQueryClient();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%", "50%"], []);
  const imageData = [
    `${apiUrl}/uploads/iklan/carousel4.jpg`,
    `${apiUrl}/uploads/iklan/carousel.jpg`,
  ];
  const imageDataEvent = [
    `${apiUrl}/uploads/iklan/promo779k.png`,
    `${apiUrl}/uploads/iklan/1rupiah.png`,
  ];

  const handlePresentModalPress = useCallback((bookingId) => {
    setCurrentBooking(bookingId);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCancel = () => {
    setCurrentBooking(null);
    bottomSheetModalRef.current?.dismiss();
  };

  const progressValue = useSharedValue(0);
  const { addReminder, removeReminder } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["getListBooking", customerId],
    queryFn: fetchAvailableTime,
    enabled: !!customerId,
  });

  const { data: notificaton, refetch: refetchNotification } = useQuery({
    queryKey: ["get_user_notification_not_read", customerId],
    queryFn: fetchNotificationCustomerNotRead,
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
        text1: t("successTitle"),
        text2: t("bookingCancelSuccess"),
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
        text1: t("errorTitle"),
        text2: t("bookingCancelFailed"),
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
            title: t("notification.bookingTodayTitle"),
            body: t("notification.bookingTodayBody", {
              service: booking.SERVICE,
              location: booking.LOCATIONNAME
            }),
            sound: true,
          },
          trigger: { type: "date", date: dateOnly },
        });
      }

      if (twoHoursBefore > now) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: t("notification.bookingReminderTitle"),
            body: t("notification.bookingReminderBody", {
              service: booking.SERVICE,
              time: booking.TIME,
              location: booking.LOCATIONNAME
            }),
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
    refetchNotification();
  };

  const toggleFavorite = () => {
    setLikedItemsCount((prevCount) => (prevCount + 1));
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
        {/* Header with Search and Icons */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            position: "absolute",
            top: 10,
            alignItems: "center",
            paddingHorizontal: 20,
            zIndex: 100,
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
              placeholder={t("search")}
              placeholderTextColor="white"
              style={styles.input}
            />
            <TouchableOpacity>
              <FontAwesome name="filter" size={15} color="#fff" />
            </TouchableOpacity>
          </BlurView>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              style={{
                borderColor: "#272835",
                borderWidth: 0.1,
                borderRadius: 100,
                padding: 15,
                backgroundColor: "#1A1B25",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                toggleFavorite();
                router.push('/category/Favorites');
              }}
            >
              <FontAwesome name="heart" size={15} color="white" />
              {likedItemsCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    backgroundColor: "red",
                    borderRadius: 8,
                    width: 20,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
                    {likedItemsCount}
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              style={{
                borderColor: "#272835",
                borderWidth: 0.1,
                borderRadius: 100,
                padding: 15,
                backgroundColor: "#1A1B25",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => router.push('/notification')}
            >
              <View>
                <FontAwesome name="bell" size={15} color="white" />
                {notificaton?.count > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      backgroundColor: "red",
                      borderRadius: 8,
                      width: 10,
                      height: 10,
                    }}
                  />
                )}
              </View>
            </Pressable>
          </View>
        </View>

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
            colors={["#FFFFFF", "#FFFFFF", "#B0174C"]}
            locations={[0, 0.85, 1]}
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
                  {t("points")}
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
                {t("getPointsByReferring")}
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
                    Toast.show({
                      type: "success",
                      text1: t("successTitle"),
                      text2: t("referralCodeCopied"),
                      position: "top",
                      visibilityTime: 2000,
                    });
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
                      const message = t("referralShareMessage", { code });

                      await Share.share({ message });
                    } catch (error) {
                      Toast.show({
                        type: "error",
                        text1: t("errorTitle"),
                        text2: t("referralShareFailed"),
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
              {t("greeting", { 
                firstName: customerDetail?.detailcustomer?.[0]?.FIRSTNAME,
                lastName: customerDetail?.detailcustomer?.[0]?.LASTNAME 
              })}
            </Text>
          </View>
        </View>

        <View style={styles.containerCategory}>
          <View style={styles.iconCategory}>
            <TouchableOpacity 
              style={styles.buttonIconCategory}
              onPress={() => router.push("/category/face")}
            >
              <MaterialCommunityIcons
                name="face-woman-shimmer"
                size={24}
                color="#B0174C"
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>{t("face")}</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity 
              style={styles.buttonIconCategory}
              onPress={() => router.push("/category/body")}
            >
              <FontAwesome name="female" size={20} color="#B0174C" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>{t("body")}</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity 
              style={styles.buttonIconCategory}
              onPress={() => router.push("/category/product")}
            >
              <FontAwesome name="shopping-bag" size={20} color="#B0174C" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>{t("product")}</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity
              style={styles.buttonIconCategory}
              onPress={() => router.push("/category/more-category")}
            >
              <FontAwesome name="ellipsis-h" size={20} color="#B0174C" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>{t("more")}</Text>
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
              {t("upcomingAppointments")}
            </Text>
            <Link href={"/mybooking/myBooking"} asChild>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", color: "#B0174C" }}
                >
                  {t("seeAll")}
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
            <Text>{t("errorLoading")}</Text>
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
                          <Text style={styles.remindText}>{t("remindMe")}</Text>
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
                          <Text style={styles.servicesTitle}>
                            {t("services")}:
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
                            {t("cancelBooking")}
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
              <Text style={styles.emptyTitle}>{t("noHistoryFound")}</Text>
              <Text style={styles.emptySubtitle}>
                {t("noUpcomingAppointments")}
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
                {t("ourBeautyEvent")}
              </Text>
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
        onRequestClose={cancelModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("cancelBooking")}</Text>
            <Text style={styles.modalMessage}>
              {t("confirmCancelBooking")}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={cancelModal}
              >
                <Text style={styles.modalButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmCanceledBooking()}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>{t("confirm")}</Text>
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
            <Text style={styles.modalTitle}>{t("cancelBooking")}</Text>
            <Text style={styles.modalMessage}>
              {t("confirmCancelBooking")}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#f87171" }]}
                onPress={confirmCanceledBooking}
              >
                <Text style={[styles.modalButtonText, { color: "white" }]}>
                  {t("confirm")}
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </SafeAreaView>
  );
}

const IndicatorDot = ({ index, progressValue }) => {
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
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 13,
    paddingVertical: Platform.OS === "ios" ? 12 : 0,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
    overflow: "hidden",
    marginRight: 10,
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
    borderRadius: 30,
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
  },
  remindButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  remindText: {
    color: "#A4ACB9",
    fontSize: 14,
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
  pointValue: {
    color: "black",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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

export default HomeScreen;