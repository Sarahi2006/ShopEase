import axios, {isAxiosError} from "axios";
import {API_URL} from "@/api/ApiClient";

export interface CategoryResponse {
    id: number;
    name: string;
    description?: string;
    createdAt:string;
    updatedAt:string;
}


export const CategoryService = {
    createcategory:async(
        name: string,
        description: string,
        token: string
    ):Promise<CategoryResponse> => {
        console.log("TOKEN SERVICE");
        console.log(token)
        try {
            const authTokenHeader = token.startsWith("Bearer ")? token : `Bearer ${token}`;

            const response = await axios.post(
                `${API_URL}/categories/create`,
                {
                    name,
                    description,
                    token
                },
                {
                    headers: {
                        Authorization:authTokenHeader,
                        "Content-Type": "application/json"
                    }
                }
            )

            console.log("RESPUESTA",response.data);
            return response.data;
        } catch (error){
            if (isAxiosError(error) && error.response) {
                console.log("ERROR RESPONSE:", error.response.data);
                throw new Error(error.response.data?.Message || "Error to save category");
            }
            throw new Error("Server error");
        }
    }
}