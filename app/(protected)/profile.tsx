import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput, Alert, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useAuth} from "@/app/src/context/AuthContext";
import { useEffect, useState } from "react";
import {AuthService} from "@/app/src/auth/services/auth.service";

export default function ProfileScreen() {
    const router = useRouter();
    const { user,token,updateUserSession } = useAuth();

    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);


    useEffect(() => {
        if(user){
            setName(user.name || "");
            setLastname(user.lastName || "");
            setPhone(user.phone || "");
        }
    }, [user])

    const handleUpdateUser = async () => {

        if(!name.trim() || !lastname.trim() || !phone.trim()){
            Alert.alert("campos incompletos", "Por favor llenar los campos")
            return;
        }
        if(!user?.id || !token){
            Alert.alert("Error de session", "No se encontro el usuario")
            return;
        }
        setIsUpdating(true)
        try {
            const updataUser = await AuthService.updateUser(
                user.id,
                name,
                lastname,
                phone,
                token,
            )
            await updateUserSession(updataUser)
            Alert.alert(
                "Excelente",
                "Tu informacion a sido actualizada con exito en el servidor"
                )
        } catch (error:any) {
            const message = error instanceof Error ? error.message : "No se pudo actualizar";
            Alert.alert("Error de registro", error.mesage || "No se puede actualizar");
        }finally{
            setIsUpdating(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{headerShown: false}}/>
            <View style={styles.header}>

                <TouchableOpacity onPress={()=> {router.replace("/(protected)/dashboard");}}
                >
                    <Ionicons name="arrow-back-outline" size={26} />
                </TouchableOpacity>
                <Text style={styles.logoText}>ShopEase</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileCard}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjoN6L0ARAWPndgoAV_xsnlaBIrPs0P_lLWMsbucZ7wQ&s=10" }}
                            style={styles.profileAvatar}
                        />
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Ionicons name="camera" size={16} color="#FFF"/>
                        </TouchableOpacity>

                    </View>
                    <Text style={styles.profileName}>Itamar Sarahi Medrano Martinez</Text>
                    <Text style={styles.profileSubtitle}>Full Stack Developer</Text>

                    */CARD POINTS/*
                    <View style={styles.cardPoints}>
                        <View style={[styles.cardPoinBox,styles.cardOrderColor]}>
                            <Text style={styles.cardBoxLabel}>Orders</Text>
                            <Text style={styles.cardBoxValue}>24</Text>
                        </View>
                        <View style={[styles.cardPoinBox,styles.cardPointsColor]}>
                            <Text style={styles.cardBoxLabel}>Points</Text>
                            <Text style={styles.cardBoxValue}>1250</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.sectionCard}>
                    <Text style={styles.personalHeader}>Personal Information</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Name</Text>
                        <View style={styles.inputWraper}>
                            <Ionicons style={styles.inputIcon} name="person-outline" size={20}/>
                            <TextInput
                                placeholder="Full name"
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>LAS NAME</Text>
                        <View style={styles.inputWraper}>
                            <Ionicons style={styles.inputIcon} name="person-outline" size={20}/>
                            <TextInput
                                placeholder="Lastname"
                                style={styles.input}
                                value={lastname}
                                onChangeText={setLastname}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                        <View style={styles.inputWraper}>
                            <Ionicons style={styles.inputIcon} name="call-outline" size={20}/>
                            <TextInput
                                placeholder="Full name"
                                keyboardType="phone-pad"
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdateUser}
                    disabled={isUpdating}
                >
                    {isUpdating ? (
                        <ActivityIndicator color="#FFF" size="small"/>
                    ):(
                        <>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{marginRight:8}}/>
                            <Text style={styles.updateButtonTex}>Save Changes</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: "#F3F4F6",
    },
    logoText:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#005C3A",
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: "#FFF",
        borderRadius:16,
        alignItems: "center",
        paddingVertical: 24,
        paddingHorizontal: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 2
    },
    imageWrapper:{
        position: "relative",
        marginBottom:14
    },
    profileAvatar:{
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraBtn:{
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#005C3A",
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        borderWidth:2,
        borderColor: "#FFF",
    },
    profileName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    profileSubtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 20,
    },
    cardPoints: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    cardPoinBox:{
        flex: 1,
        height: 64,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6,
    },
    cardOrderColor:{
        backgroundColor: "#DDEAFE",
    },
    cardPointsColor:{
        backgroundColor: "#E2F0FC",
    },
    cardBoxLabel: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#4B5563",
        letterSpacing: 1,
        marginBottom: 4,
    },
    cardBoxValue:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#047857",
    },
    sectionCard:{
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2
    },
    personalHeader: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 18,
    },
    inputGroup:{
        marginBottom: 14,
    },
    inputLabel:{
        fontSize: 10,
        fontWeight: "bold",
        color: "#4B5563",
        letterSpacing: 1,
        marginBottom: 6,
    },
    inputWraper:{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        backgroundColor: "#FFF",
    },
    input:{
        flex: 1,
        fontSize: 15,
        color: "#1F2937",
        paddingVertical: 0,
    },
    inputIcon: {
        marginRight: 10,
    },
    updateButton: {
        flexDirection: "row",
        backgroundColor: "#005C3A",
        borderRadius: 12,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
    },
    updateButtonTex: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    }
})







