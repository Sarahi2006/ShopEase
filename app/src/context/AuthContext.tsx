import { createContext, useState, useEffect, useContext } from "react";
import { UserResponse } from "../auth/models/auth.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AuthService} from "@/app/src/auth/services/auth.service";

interface AuthContextType {
    token: string | null;
    user: UserResponse | null;
    isLoadingSession: boolean;
    saveSession: (token: string, user: UserResponse) => Promise<void>;
    clearSession: () => void;
    updateUserSession:(updateUser:UserResponse) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children,
                                                                      }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                //SI TENGO TOKEN GUARDADO
                const savedToken = await AsyncStorage.getItem("@auth_token");

                //SI TENGO EL USUARIO GUARDADO
                const savedUser = await AsyncStorage.getItem("@auth_user");

                if (savedToken && savedUser) {
                    try {
                        const isValid = await AuthService.validatetoken(savedToken)
                        if (isValid){
                            setToken(savedToken);
                            setUser(JSON.parse(savedUser));
                        } else {
                            await AsyncStorage.multiRemove(["@auth_token","@auth_user"]);
                        }
                    } catch (error) {
                        setToken(savedToken);
                        setUser(JSON.parse(savedUser));
                    }
                }
            } catch (error) {
                console.log("Error al cargar la sesion");
            } finally {
                setIsLoadingSession(false);
            }
        };

        loadSession();
    }, []);

    //GUARDE LA SESION
    const saveSession = async (
        newToken: string,
        newUser: UserResponse
    ) => {
        try {
            await AsyncStorage.setItem("@auth_token", newToken);
            await AsyncStorage.setItem("@auth_user", JSON.stringify(newUser));

            setToken(newToken);
            setUser(newUser);
        } catch (error) {
            console.log("Error al persistir la data", error);
        }
    };

    /*EDITE LA INFORMACION TIENE QUE CAMBIAR LA SESSION*/
    const updateUserSession= async (updateUser:UserResponse) => {
        try {
            await AsyncStorage.setItem("@auth_user", JSON.stringify(updateUser));
            setUser(updateUser);
        } catch (error) {
            console.log("Error al actualizar la data en AsyncStorage", error);
        }
    }

    //LIMPIAR SESION
    const clearSession = async () => {
        try {
            await AsyncStorage.removeItem("@auth_token");
            await AsyncStorage.removeItem("@auth_user");

            setToken(null);
            setUser(null);
        } catch (error) {
            console.log("Error al limpiar data", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isLoadingSession,
                saveSession,
                updateUserSession,
                clearSession
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

//CREAR UNA INSTANCIA CONTEXTO
export const useAuth = () => useContext(AuthContext);