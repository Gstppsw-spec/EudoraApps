import { FontAwesome } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
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
import useStore from "../../../store/useStore";

const { width } = Dimensions.get("window");

const fetchAvailableTime = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(
    `https://sys.eudoraclinic.com:84/apieudora/getListBooking/${customerId}/1`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchDetailCustomer = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(
    `https://sys.eudoraclinic.com:84/apieudora/getDetailCustomer/${customerId}`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const canceledBooking = async (formData: any) => {
  const response = await axios.post(
    "https://sys.eudoraclinic.com:84/apieudora/canceledBooking",
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export default function HomeScreen() {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  console.log(customerId);

  const [isEnabled, setIsEnabled] = useState(false);
  const [switchStates, setSwitchStates] = useState<boolean[]>([]);
  // const customerId = 64685;
  const queryClient = useQueryClient();
  const imageData = [
    "https://via.placeholder.com/400x200/FFB6C1/000000?text=Slide+1",
    "https://via.placeholder.com/400x200/87CEFA/000000?text=Slide+2",
    "https://via.placeholder.com/400x200/90EE90/000000?text=Slide+3",
  ];
  const progressValue = useSharedValue(0);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["getListBooking", customerId],
    queryFn: fetchAvailableTime,
    enabled: !!customerId,
  });

  const { data: customerDetail, isLoading: isLoadingCustomerDetail } = useQuery(
    {
      queryKey: ["getDetailCustomer", customerId],
      queryFn: fetchDetailCustomer,
      enabled: !!customerId,
    }
  );

  const mutation = useMutation({
    mutationFn: canceledBooking,
    onSuccess: (data) => {
      // setModalVisible(true);
      queryClient.invalidateQueries(["getListBooking", customerId]);
    },
    onError: (error) => {
      console.error("Error posting data:", error);
    },
  });

  useEffect(() => {
    if (data?.customerbooking) {
      setSwitchStates(data.customerbooking.map(() => false));
    }
  }, [data]);

  const toggleSwitch = (index: number) => {
    setSwitchStates((prevState) => {
      const updated = [...prevState];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleCanceledBooking = (bookingId: number) => {
    // console.log(bookingId);

    mutation.mutate({
      bookingId: bookingId,
    });
  };

  const onRefresh = () => {
    refetch();
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
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <FontAwesome
              name="search"
              size={18}
              color="grey"
              style={styles.icon}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="grey"
              style={styles.input}
            />
            <TouchableOpacity onPress={() => console.log("Filter pressed")}>
              <FontAwesome name="filter" size={18} color="grey" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <View style={{ gap: 5, marginLeft: 20 }}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 2,
                }}
              >
                {customerDetail?.detailcustomer?.[0]?.FIRSTNAME}{" "}
                {customerDetail?.detailcustomer?.[0]?.LASTNAME}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <FontAwesome name="map-marker" size={14} color="#FFB900" />
                <Text style={{ color: "white", fontSize: 12 }}>
                  {customerDetail?.detailcustomer?.[0]?.ADDRESS
                    ? customerDetail?.detailcustomer?.[0]?.ADDRESS
                    : "-"}
                </Text>
              </View>
            </View>

            <View
              style={{
                borderColor: "#272835",
                borderWidth: 0.1,
                borderRadius: "100%",
                padding: 15,
                backgroundColor: "#1A1B25",
                marginRight: 20,
              }}
            >
              <Link href={"/notification"}>
                <FontAwesome name="bell" size={18} color="white" />
              </Link>
            </View>
          </View>

          <TouchableOpacity style={styles.floatingBox}>
            <Text style={{ color: "white", fontSize: 12 }}>
              POINT :{" "}
              {Number(
                customerDetail?.detailcustomer?.[0]?.TOTALPOINT || 0
              ).toLocaleString("id-ID")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: "center", marginTop: 50 }}>
          <Carousel
            width={width}
            height={200}
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
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 10,
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </View>
        <View style={styles.indicatorContainer}>
          {imageData.map((_, i) => (
            <IndicatorDot key={i} index={i} progressValue={progressValue} />
          ))}
        </View>

        <View style={styles.containerCategory}>
          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <FontAwesome name="facebook-official" size={18} color="#FFB900" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11 }}>Face</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <FontAwesome name="automobile" size={18} color="#FFB900" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11 }}>Body</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <FontAwesome name="shopping-bag" size={18} color="#FFB900" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11 }}>Product</Text>
          </View>

          <View style={styles.iconCategory}>
            <TouchableOpacity style={styles.buttonIconCategory}>
              <FontAwesome name="files-o" size={18} color="#FFB900" />
            </TouchableOpacity>
            <Text style={{ fontSize: 11 }}>More</Text>
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
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Upcoming Appointments
            </Text>
            <Link href={"/mybooking/mybooking"} asChild>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", color: "#FFB900" }}
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
            <Text>Loading...</Text>
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
                            uri: `https://sys.eudoraclinic.com:84/apieudora/upload/${booking.IMAGE}`,
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
                          onPress={() =>
                            handleCanceledBooking(booking.BOOKINGID)
                          }
                        >
                          <Text style={styles.cancelText}>Cancel Booking</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
          ) : (
            <Text>Tidak ada data...</Text>
          )}
        </View>
      </ScrollView>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    minHeight: 160,
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
    backgroundColor: "#1A1B25",
    width: "90%",
    marginBottom: 10,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#272835",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
  },
  containerCategory: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  switch: {
    marginLeft: 2,
  },
  iconCategory: {
    alignItems: "center",
  },
  buttonIconCategory: {
    borderWidth: 0.1,
    borderRadius: "100%",
    padding: 20,
    backgroundColor: "#FFF8E6",
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
});
