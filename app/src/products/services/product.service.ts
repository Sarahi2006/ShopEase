import {
    CreateProductRequest,
    CreateProductResponse, ProductItem,
} from "@/app/src/products/models/product.model";
import {API_URL} from "@/api/ApiClient";
import axios, {isAxiosError} from "axios";

export const ProductService = {
    createProduct: async (
        producRequest: CreateProductRequest,
        token: string,
    ): Promise<CreateProductResponse> => {
        try {
            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`
            const response = await axios.post<CreateProductResponse>(
                `${API_URL}/products/create`,
                producRequest,
                { headers: { Authorization: authTokenHeader, "Content-Type": "application/json" } }
            )

            console.log("RESPUESTA API:", JSON.stringify(response.data, null, 2));

            return response.data
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                console.log("ERROR RESPONSE:", error.response.data);
                throw new Error(
                    error.response.data?.message ||
                    error.response.data?.error ||
                    "Error al crear el producto"
                );
            }
            throw new Error("Server error");
        }
    },

    _getProductsByCategoryId:async(categoryId:number, token: string):Promise<ProductItem[]>=>{
        try {
            const authTokenHeader = token.startsWith("Bearer ")? token : `Bearer ${token}`
            const response = await axios.get<ProductItem[]>(
                `${API_URL}/products/category/${categoryId}`,
                {
                    headers: {
                        Authorization: authTokenHeader
                    }
                }
            )
            return response.data
        } catch (error){
            if (isAxiosError(error) && error.response) {
                console.log("ERROR RESPONSE:", error.response.data);
                throw new Error(
                    error.response.data?.message ||
                    error.response.data?.error ||
                    "Error al crear el producto"
                );
            }
            throw new Error("Server error");
        }
    }
}