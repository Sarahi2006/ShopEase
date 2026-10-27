import { useRouter } from "expo-router";
import { useAuth } from "@/app/src/context/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductService } from "@/app/src/products/services/product.service";
import { Alert } from "react-native";
import { CategoryResponse, CategoryService } from "@/app/src/categories/services/category.service";
import { ProductItem } from "@/app/src/products/models/product.model";

const DEFAULT_CATEGORY_ID = 1;

export function useCreateProduct() {
    const router = useRouter();
    const { token } = useAuth();

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState<null | number>(null);
    const [sku, setSku] = useState("");
    const [description, setDescription] = useState("");
    const [regularPrice, setRegularPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [initialStock, setInitialStock] = useState("");
    const [minStockAlert, setMinStockAlert] = useState("");
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Estados para selector de categorías
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isCategoriesShowModal, setIsCategoriesShowModal] = useState(false);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");

    // Estados para listado y búsqueda de productos
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<null | number>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const showError = (message: string) => {
        setErrorMessage(message);
        Alert.alert("Error", message);
    };

    const fetchCategories = useCallback(async () => {
        if (!token) return;
        try {
            setIsLoadingCategories(true);
            const data = await CategoryService.getCategories(token);
            setCategories(data);
        } catch (error: any) {
            console.log("Error al cargar las categorías:", error?.message);
        } finally {
            setIsLoadingCategories(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const fetchProducts = useCallback(async () => {
        if (!token) return;
        try {
            setIsLoadingProducts(true);
            const data = await ProductService._getProductsByCategoryId(
                selectedCategoryId ?? DEFAULT_CATEGORY_ID,
                token
            );
            setProducts(data);
        } catch (error: any) {
            console.log("Error al traer los productos:", error?.message);
            setProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    }, [token, selectedCategoryId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const submitProduct = async () => {
        if (!name.trim() || !sku.trim() || !regularPrice.trim() || !initialStock.trim()) {
            showError("Por favor completa los campos obligatorios");
            return;
        }

        if (!categoryId) {
            showError("Por favor selecciona una categoría");
            return;
        }

        if (!token) {
            showError("Sesion no valida");
            return;
        }

        const parsedRegularPrice = parseFloat(regularPrice);
        const parsedOfferPrice = offerPrice.trim() ? parseFloat(offerPrice) : undefined;
        const parsedStock = parseInt(initialStock, 10);
        const parsedMinStock = minStockAlert.trim() ? parseInt(minStockAlert, 10) : 0;

        if (isNaN(parsedRegularPrice) || parsedRegularPrice <= 0) {
            showError("El precio regular debe ser un número mayor a 0");
            return;
        }

        if (parsedOfferPrice !== undefined && (isNaN(parsedOfferPrice) || parsedOfferPrice >= parsedRegularPrice)) {
            showError("El precio de oferta debe ser menor al precio regular");
            return;
        }

        if (isNaN(parsedStock) || parsedStock < 0 || isNaN(parsedMinStock) || parsedMinStock < 0) {
            showError("El stock debe ser un número válido");
            return;
        }

        setErrorMessage(null);
        setIsLoadingProduct(true);

        try {
            await ProductService.createProduct(
                {
                    name: name.trim(),
                    categoryId: Number(categoryId),
                    sku: sku.trim(),
                    description: description.trim(),
                    regularPrice: parsedRegularPrice,
                    offerPrice: parsedOfferPrice,
                    initialStock: parsedStock,
                    minStockAlert: parsedMinStock,
                },
                token
            );

            Alert.alert("Éxito", "Producto creado correctamente", [
                {
                    text: "OK",
                    onPress: () => router.replace("/(protected)/dashboard"),
                },
            ]);
        } catch (error: any) {
            showError(error?.message || "Error al crear el producto");
        } finally {
            setIsLoadingProduct(false);
        }
    };

    const filteredProducts = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return products;

        return products.filter((p) =>
            p.name.toLowerCase().includes(query) ||
            (p.description ?? "").toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    return {
        name,
        setName,
        categoryId,
        setCategoryId,
        sku,
        setSku,
        description,
        setDescription,
        regularPrice,
        setRegularPrice,
        offerPrice,
        setOfferPrice,
        initialStock,
        setInitialStock,
        minStockAlert,
        setMinStockAlert,
        isLoadingProduct,
        errorMessage,
        submitProduct,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        selectedCategoryName,
        setSelectedCategoryName,
        fetchCategories,
        products: filteredProducts,
        isLoadingProducts,
        searchQuery,
        setSearchQuery,
        refreshProduct: fetchProducts,
        selectedCategoryId,
        setSelectedCategoryId,
    };
}