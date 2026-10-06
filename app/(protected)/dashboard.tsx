import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import Drawer from "expo-router/drawer";
import {Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDrawer } from "../src/admin/viewmodels/use-drawer";
import { useState, useMemo } from "react";
import { useNavigation, useRouter } from "expo-router";

const {width} = Dimensions.get("window");
const CARD_WIDTH = (width-44)/2 //(Ancho total - margenes laterales)/2
interface Product {
    id:string
    title:string
    description:string
    price:number
    image:string
    isNew?:boolean
    category:string
}
const CATEGORIES = ["All categories", "Electronics", "Fashions", "VideoGames"];
const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        title: "Premium Audio",
        description: "Wireless Noise Cancelling",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
        isNew: true,
        category: "Electronics",
    },
    {
        id: "2",
        title: "Eon Classic Wrist",
        description: "Genuine Leather Strap",
        price: 145.00,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
        category: "Fashions",
    },
    {
        id: "3",
        title: "Velocity Running",
        description: "Peak Performance Gear",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
        category: "Fashions",
    },
    {
        id: "4",
        title: "Insta-Capture",
        description: "Vintage Aesthetics",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop",
        category: "Electronics",
    },
    {
        id: "5",
        title: "Console Controller",
        description: "Built for Next-Gen Gaming",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
        isNew: true,
        category: "VideoGames",
    }
];



export default function DashboardScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    const { profile } = useDrawer();
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [searchQuery, setSearchQuery] = useState("");

    const openMenu = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    //FILTAR DINAMICAMENTE LOS PRODUCTOS SEGUN LA CATEGORIA
    const filteredProductsByCategory = useMemo(() => {
        return MOCK_PRODUCTS.filter((product) => {
            const matchCategory =
                selectedCategory === "All Products" || product.category === selectedCategory

            const matchSearch =
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())

            return matchCategory && matchSearch
        })
    }, [selectedCategory, searchQuery])
    return (
        <SafeAreaView style={styles.container}>
            {/**Omitir el drawer por defecto */}
            <Drawer.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={openMenu} style={{ padding: 15 }}>
                    <Ionicons name="menu-outline" size={30} color="#005C3A" />
                </TouchableOpacity>

                <Text style={styles.logoText}>ShopEase</Text>
                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={() => router.push("/(protected)/profile")}
                >
                    <Image
                        source={{ uri: profile.avatarUrl }}
                        style={styles.avatarImage}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search products"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/**CATEGORIES**/}
            <View style={styles.categoriesWrapper}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={CATEGORIES}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.categoriesList}
                    renderItem={({ item }) => {
                        const isSelected = item === selectedCategory;
                        return (
                            <TouchableOpacity
                                onPress={() => setSelectedCategory(item)}
                                style={[
                                    styles.categoryItem,
                                    isSelected && styles.categoryItemSelected
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    isSelected && styles.categoryTextSelected
                                ]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            {/**PRODUCTS CARD**/}
            <FlatList
                data={filteredProductsByCategory}
                keyExtractor={(item)=>item.id}
                numColumns={2}
                columnWrapperStyle={styles.gridRowSpace}
                contentContainerStyle={styles.productList}
                showsVerticalScrollIndicator={false}
                renderItem={({item})=>(
                    <View style={styles.cardContainer}>
                        <View style={styles.imageWrapper}>
                            <Image source={{uri:item.image}} style={styles.productImage}/>
                            {item.isNew && (
                                <View style={styles.newBadge}>
                                    <Text style={styles.newBadgeText}>NEW</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.productInfo}>
                            <Text style={styles.productTitle}>{item.title}</Text>
                            <Text style={styles.productDescription}>{item.description}</Text>
                            <View style={styles.priceRow}>
                                <Text>${item.price.toFixed(2)}</Text>
                                <TouchableOpacity style={styles.cardBtn}>
                                    <Ionicons name="cart-outline" size={16} color="#FFF"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 14
    },
    logoText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#005C3A"
    },
    profileContainer: {
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1
    },
    avatarImage: {
        width: 40,
        height: 40
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 20,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 14
    },
    searchIcon: {
        marginRight: 10
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#1F2937",
        padding: 0
    },
    categoriesWrapper: {
        maxHeight: 50,
        marginBottom: 16
    },
    categoriesList: {
        paddingHorizontal: 16,
        alignItems: "center"
    },
    categoryItem: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: "#E5E7EB",
        borderRadius: 24,
        marginRight: 10
    },
    categoryItemSelected: {
        backgroundColor: "#005C3A"
    },
    categoryText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#374151"
    },
    categoryTextSelected: {
        color: "#FFF"
    },
    /***ESTILOS PARA LAS TARJETAS */
    productList:{
        paddingHorizontal:16,
        paddingBottom:24
    },
    gridRowSpace:{
        justifyContent:"space-between"
    },
    cardContainer:{
        width:CARD_WIDTH,
        backgroundColor:"#FFF",
        borderRadius:16,
        marginBottom:16,
        overflow:"hidden",
        shadowColor:"#000",
        shadowOffset:{width:0,height:1},
        shadowOpacity:0.05,
        shadowRadius:5,
        elevation:2
    },
    imageWrapper:{
        height:140,
        width:"100%",
        backgroundColor:"#F3F4F6",
        position:"relative"
    },
    productImage:{
        width:"100%",
        height:"100%",
        resizeMode:"cover"
    },
    newBadge:{
        position:"absolute",
        top:10,
        left:10,
        backgroundColor:"#005C3A",
        paddingHorizontal:8,
        paddingVertical:4,
        borderRadius:6,
    },
    newBadgeText:{
      color:"#FFF",
      fontSize:10,
      fontWeight:"bold",
    },
    productInfo:{
        padding: 12
    },
    productTitle:{
        fontSize:14,
        fontWeight:"bold",
        color: "#1F2937",
        marginBottom:2
    },
    productDescription:{
        fontSize:11,
        color: "#6B7280",
        marginBottom:8
    },
    priceRow:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    cardBtn:{
        backgroundColor:"#00B074",
        width:30,
        height:30,
        justifyContent:"center",
        borderRadius:15,
        alignItems:"center"
    }
});