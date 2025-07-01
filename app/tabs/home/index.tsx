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
    mutation.mutate({
      bookingId: bookingId,
    });
  };

  const onRefresh = () => {
    refetch();
  };

  // Sample point data - replace with actual data from your API
  const pointData = {
    normal: 1267500,
    medis: 6500000,
    nonMedis: 13000000,
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

        {/* Header Container with increased height */}
        <View style={styles.headerContainer}>
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

          <View style={styles.userInfoContainer}>
            <View style={{ gap: 5, marginLeft: 20 }}>
              <Text style={styles.userName}>
                {customerDetail?.detailcustomer?.[0]?.FIRSTNAME}{" "}
                {customerDetail?.detailcustomer?.[0]?.LASTNAME}
              </Text>
              <View style={styles.locationContainer}>
                <FontAwesome name="map-marker" size={14} color="#FFB900" />
                <Text style={styles.addressText}>
                  {customerDetail?.detailcustomer?.[0]?.ADDRESS
                    ? customerDetail?.detailcustomer?.[0]?.ADDRESS
                    : "-"}
                </Text>
              </View>
            </View>

            <View style={styles.notificationIcon}>
              <Link href={"/notification"}>
                <FontAwesome name="bell" size={18} color="white" />
              </Link>
            </View>
          </View>

          {/* Points Section with proper spacing */}
          <View style={styles.pointsCard}>
            <Link href="/Point/point" style={styles.pointItem}>
              <View style={styles.pointContent}>
                <Text style={styles.pointLabel}>NORMAL</Text>
                <Text style={styles.pointValue}>
                  {pointData.normal.toLocaleString("id-ID")}
                </Text>
              </View>
            </Link>
            <View style={styles.dividerVertical} />
            <Link href="/Point/point" style={styles.pointItem}>
              <View style={styles.pointContent}>
                <Text style={styles.pointLabel}>MEDIS</Text>
                <Text style={styles.pointValue}>
                  {pointData.medis.toLocaleString("id-ID")}
                </Text>
              </View>
            </Link>
            <View style={styles.dividerVertical} />
            <Link href="/Point/point" style={styles.pointItem}>
              <View style={styles.pointContent}>
                <Text style={styles.pointLabel}>NON MEDIS</Text>
                <Text style={styles.pointValue}>
                  {pointData.nonMedis.toLocaleString("id-ID")}
                </Text>
              </View>
            </Link>
          </View>
        </View>

        {/* Carousel Section */}
        <View style={styles.carouselContainer}>
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
              <View style={styles.carouselItem}>
                <Image
                  source={{ uri: item }}
                  style={styles.carouselImage}
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

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <Link href="/kategori/face" asChild>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <FontAwesome name="facebook-official" size={24} color="#FFB900" />
              </View>
              <Text style={styles.categoryText}>Face</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/kategori/body" asChild>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <FontAwesome name="automobile" size={24} color="#FFB900" />
              </View>
              <Text style={styles.categoryText}>Body</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/kategori/product" asChild>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <FontAwesome name="shopping-bag" size={24} color="#FFB900" />
              </View>
              <Text style={styles.categoryText}>Product</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/kategori/more" asChild>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <FontAwesome name="files-o" size={24} color="#FFB900" />
              </View>
              <Text style={styles.categoryText}>More</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.appointmentsContainer}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text>Error..</Text>
          ) : data?.customerbooking?.length > 0 ? (
            data.customerbooking
              .slice(0, 3)
              .map((booking: any, index: number) => (
                <AppointmentCard 
                  key={index}
                  booking={booking}
                  index={index}
                  switchStates={switchStates}
                  toggleSwitch={toggleSwitch}
                  handleCanceledBooking={handleCanceledBooking}
                />
              ))
          ) : (
            <Text>Tidak ada data...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const AppointmentCard = ({ booking, index, switchStates, toggleSwitch, handleCanceledBooking }) => {
  const formattedDate = new Date(
    booking.TREATMENTDATE.replace(" ", "T")
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingContainer}>
        <View style={styles.bookingHeader}>
          <Text style={styles.dateText}>
            {formattedDate} ({booking.TIME})
          </Text>
          <View style={styles.remindButton}>
            <Text style={styles.remindText}>Remind me</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#ccc", true: "#FFB900" }}
              thumbColor="#fff"
              ios_backgroundColor="#ccc"
              onValueChange={() => toggleSwitch(index)}
              value={switchStates[index]}
            />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.bookingContent}>
          <Image
            source={{
              uri: `https://sys.eudoraclinic.com:84/apieudora/upload/${booking.IMAGE}`,
            }}
            style={styles.clinicImage}
          />
          <View style={styles.bookingDetails}>
            <Text style={styles.clinicName}>{booking.LOCATIONNAME}</Text>
            <Text style={styles.clinicAddress}>{booking.ADDRESS}</Text>
            <Text style={styles.servicesTitle}>Services:</Text>
            <Text style={styles.servicesText}>{booking.SERVICE}</Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCanceledBooking(booking.BOOKINGID)}
          >
            <Text style={styles.cancelText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
  containerArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    backgroundColor: "black",
    minHeight: 240,
    paddingBottom: 20,
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1B25",
    width: "90%",
    marginTop: 15,
    paddingHorizontal: 13,
    paddingVertical: 8,
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
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  userName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addressText: {
    color: "white",
    fontSize: 12,
  },
  notificationIcon: {
    borderColor: "#272835",
    borderWidth: 0.1,
    borderRadius: 100,
    padding: 15,
    backgroundColor: "#1A1B25",
    marginRight: 20,
  },
  pointsCard: {
    backgroundColor: "#1A1B25",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F9A000",
    width: "90%",
    marginTop: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pointContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#1A1B25",
    borderRadius: 10,
    width: "100%",
    height: "100%",
  },
  pointLabel: {
    color: "#FFB900",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pointValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  dividerVertical: {
    width: 1,
    height: "60%",
    backgroundColor: "#FFB900",
    opacity: 0.5,
  },
  carouselContainer: {
    justifyContent: "center",
    marginTop: 20,
  },
  carouselItem: {
    flex: 1,
    backgroundColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#333",
    marginHorizontal: 5,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    borderWidth: 0.1,
    borderRadius: 100,
    padding: 20,
    backgroundColor: "#FFF8E6",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    width: 60,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFB900",
  },
  appointmentsContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  bookingCard: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: "#ECEFF3",
    marginBottom: 15,
  },
  bookingContainer: {
    paddingVertical: 15,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
  },
  remindButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  remindText: {
    color: "#A4ACB9",
    fontSize: 14,
  },
  switch: {
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  bookingContent: {
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
    width: "100%",
  },
  cancelText: {
    color: "#ff5252",
    fontWeight: "bold",
    textAlign: "center",
  },
});

