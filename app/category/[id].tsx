import useStore from "@/store/useStore";
import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import HeaderWithCart from "../component/headerWithCart";

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 16;
const GAP = 12;
const CARD_MIN_WIDTH = 140;
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchCategoryProduct = async ({ queryKey }: any) => {
  const [, categoryId] = queryKey;
  const res = await fetch(
    `${apiUrl}/getListCategoryByProductByIdApps/${categoryId}`
  );
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

const ProductList = () => {
  const [numColumns, setNumColumns] = useState(2);
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const [categoryId, setCategoryId] = useState<number>(id);
  const bottomSheetRef = useRef(null);
  const [typeId, setTypeId] = useState(1);
  const [modal, setModal] = useState<number>(0);
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const customerDetails = useStore((state) => state.customerDetails);

  const typeList = [
    { id: 1, name: "Treatment" },
    { id: 2, name: "Package" },
    { id: 3, name: "Product" },
  ];

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getListCategoryByProductByIdApps", categoryId],
    queryFn: fetchCategoryProduct,
    enabled: !!categoryId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (id == 10) {
      setTypeId(2);
    }
  }, [id]);

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

  const handleOpenFilter = () => {
    setModal(2);
    bottomSheetRef.current?.present();
  };

  const handleOpenFilterType = () => {
    setModal(1);
    bottomSheetRef.current?.present();
  };

  const handleSelectCategory = (id: number) => {
    setCategoryId(id);
    refetch();
    bottomSheetRef.current?.dismiss();
  };

  const handleSelectType = (id: number) => {
    setTypeId(id);
    bottomSheetRef.current?.dismiss();
  };

  const selectedCategoryName = category?.listCategory?.find(
    (c) => c.id == categoryId
  )?.name;

  const selectedTypeName = typeList.find((c) => c.id == typeId)?.name;

  useEffect(() => {
    const columns = Math.floor(
      (width - HORIZONTAL_PADDING * 2 + GAP) / (CARD_MIN_WIDTH + GAP)
    );
    setNumColumns(columns > 0 ? columns : 1);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    refetchcategory();
    setRefreshing(false);
  };

  const formatRupiah = (number: number) => {
    return "Rp " + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const CARD_WIDTH =
    (width - HORIZONTAL_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  const renderItem = ({ item, index }: any) => {
    if (item.empty)
      return <View style={{ width: CARD_WIDTH, marginBottom: GAP }} />;
    const isLastInRow = (index + 1) % numColumns === 0;

    return (
      <View
        style={{
          width: CARD_WIDTH,
          marginBottom: GAP,
          marginRight: isLastInRow ? 0 : GAP,
        }}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/category/detail/[id]",
              params: {
                productid: item.productid,
                producttypeid: item.producttypeid,
              },
            })
          }
        >
          <Image
            source={{ uri: item.image }}
            defaultSource={require("../../assets/images/doc.png")}
            style={styles.image}
          />
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {item.productname}
            </Text>
            <Text style={styles.price}>{formatRupiah(item.price)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithCart title="Eudora Services" useGoBack />
      <View style={styles.containerfilter}>
        <TouchableOpacity onPress={handleOpenFilterType} style={styles.button}>
          <View style={styles.content}>
            <Text style={styles.text}>{selectedTypeName}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOpenFilter} style={styles.button}>
          <View style={styles.content}>
            <Text style={styles.text}>{selectedCategoryName}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={
          typeId == 1
            ? data?.listCategoryByTreatment
            : typeId == 2
            ? data?.listCategoryByPackage
            : data?.listCategoryByRetail
        }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={{
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING,
          paddingBottom: 20,
        }}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <Text style={{ fontSize: 16, color: "#999" }}>
              Tidak ada data tersedia
            </Text>
          </View>
        )}
      />

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["50%"]}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {modal == 1 ? "Pilih Section" : "Pilih Category"}
          </Text>

          {isLoadingcategory || isRefetchingcategory ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={modal == 1 ? typeList || [] : category?.listCategory || []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                  }}
                  onPress={
                    modal == 1
                      ? () => handleSelectType(item.id)
                      : () => handleSelectCategory(item.id)
                  }
                >
                  {modal == 1 ? (
                    <Text
                      style={{
                        fontSize: 16,
                        color: item.id == typeId ? "#B0174C" : "#333", // biru kalau terpilih, abu kalau tidak
                        fontWeight: item.id == typeId ? "bold" : "normal", // bold kalau terpilih
                      }}
                    >
                      {item.name}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        color: item.id == categoryId ? "#B0174C" : "#333", // biru kalau terpilih, abu kalau tidak
                        fontWeight: item.id == categoryId ? "bold" : "normal", // bold kalau terpilih
                      }}
                    >
                      {item.name}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    backgroundColor: "#F5F5F5", // placeholder loading
  },
  info: { padding: 10 },
  name: { fontSize: 13, fontWeight: "500", color: "#333" },
  price: { fontSize: 13, fontWeight: "bold", color: "#B0174C", marginTop: 4 },
  containerfilter: {
    flexDirection: "row", // tampilkan tombol secara horizontal
    justifyContent: "space-between", // jarak merata antar tombol
    marginVertical: 10,
  },
  button: {
    flex: 1, // agar tombol menyesuaikan lebar
    marginHorizontal: 10, // jarak antar tombol
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 15,
    backgroundColor: "#FF6B81",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default ProductList;
