import AnimatedToast from "@/app/component/animatedToast";
import HeaderWithCart from "@/app/component/headerWithCart";
import useStore from "@/store/useStore";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchCategoryProduct = async ({ queryKey }: any) => {
  const [, productid, producttypeid] = queryKey;
  const res = await fetch(
    `${apiUrl}/getListCategoyByProductId/${productid}/${producttypeid}`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchProductDetail = async ({ queryKey }: any) => {
  const [, productid, producttypeid] = queryKey;
  const res = await fetch(
    `${apiUrl}/getDetailTreatment/${productid}/${producttypeid}`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const postData = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/insertCustomerCart`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const postDataDirectBuy = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/api/transactions/insertProductDirectBuy`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
        auth_token_customer: formData.token,
        customerid: formData.customerid,
      },
    }
  );
  return response.data;
};

export default function ProductDetailScreen() {
  const { productid, producttypeid } = useLocalSearchParams();
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const queryClient = useQueryClient();
  const [showToast, setShowToast] = useState(false);
  const customerDetails = useStore((state) => state.customerDetails);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getListCategoyByProductId", productid, producttypeid],
    queryFn: fetchCategoryProduct,
    enabled: !!productid && !!producttypeid,
  });

  const {
    data: dataproduct,
    isLoading: isLoadingProduct,
    refetch: refetchProduct,
    isRefetching: isRefetchingProduct,
  } = useQuery({
    queryKey: ["getDetailTreatment", productid, producttypeid],
    queryFn: fetchProductDetail,
    enabled: !!productid && !!producttypeid,
  });

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      if (data?.status) {
        setShowToast(true);
        queryClient.invalidateQueries(["getCustomerCart", customerId]);
      } else {
        Toast.show({
          type: "error",
          text2: "Gagal menambahkan product ke keranjang!",
          position: "top",
          visibilityTime: 2000,
        });
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text2: "Gagal menambahkan product ke keranjang!",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const mutationDirectBuy = useMutation({
    mutationFn: postDataDirectBuy,
    onSuccess: (data) => {

      if (data?.status) {
        router.push("/payment/paymentDirectBuy");
      } else {
        Toast.show({
          type: "error",
          text2: `${data?.message}`,
          position: "top",
          visibilityTime: 2000,
        });
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text2: "Gagal mengalihkan ke detail pembayaran!",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const formatRupiah = (number: number) => {
    return "Rp " + number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleInsertCart = () => {
    mutation.mutate({
      productid: productid,
      producttypeid: producttypeid,
      customerid: customerId,
      qty: 1,
    });
  };

  const handleInsertDirectBuy = () => {
    mutationDirectBuy.mutate({
      productid: productid,
      producttypeid: producttypeid,
      customerid: customerId,
      qty: 1,
      token: customerDetails?.token,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), refetchProduct()]);
    } catch (error) {
      console.log("Error refreshing:", error);
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithCart title="Eudora Services" useGoBack />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image
          source={{ uri: dataproduct?.data?.image }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            marginVertical: 8,
            marginHorizontal: 10,
          }}
        >
          {data?.data?.map((category, index) => (
            <Text key={index} style={styles.category}>
              {category.name}
            </Text>
          ))}
        </View>

        <Text style={styles.name}>{dataproduct?.data?.productname}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {formatRupiah(dataproduct?.data?.price)}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi Produk</Text>
          <Text style={styles.description}>
            {dataproduct?.data?.description}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        {data?.data[0]?.categoryid !== 10 && (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => handleInsertCart()}
            disabled={mutation.isPending}
          >
            <AntDesign
              name="shoppingcart"
              size={20}
              color="#333"
              style={{ marginRight: 8 }}
            />
            {mutation.isPending ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.cartText}>+Keranjang</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.buyButton}
          disabled={mutationDirectBuy.isPending}
          onPress={() => handleInsertDirectBuy()}
        >
          <FontAwesome
            name="bolt"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          {mutationDirectBuy.isPending ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buyText}>Beli Sekarang</Text>
          )}
        </TouchableOpacity>
      </View>
      <AnimatedToast
        visible={showToast}
        message="Berhasil menambahkan product ke keranjang!"
        onHide={() => setShowToast(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mainImage: { width: "100%", height: 300 },
  thumbnail: { width: 80, height: 80, marginRight: 10, borderRadius: 8 },
  category: {
    backgroundColor: "#F5F5F5",
    color: "#B0174C",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    marginRight: 6,
    fontWeight: "500",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
    paddingHorizontal: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 16,
  },
  price: { fontSize: 20, fontWeight: "bold", color: "#FF6B81" },
  discount: { fontSize: 14, color: "#FF3B30", marginLeft: 10 },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 16,
  },
  ratingText: { marginLeft: 5, color: "#555" },
  section: { marginVertical: 10, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  description: { fontSize: 14, color: "#555", lineHeight: 20 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  cartButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row", // supaya icon + text sejajar
    justifyContent: "center",
  },
  buyButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#FF6B81",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row", // icon + text sejajar
    justifyContent: "center",
  },
  cartText: { fontWeight: "bold", color: "#333" },
  buyText: { fontWeight: "bold", color: "#fff" },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
