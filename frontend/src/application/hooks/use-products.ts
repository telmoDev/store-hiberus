import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/infrastructure/api/product-api";
import { Product } from "@/domain/entities";

// Query key factory
export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    list: (filters: {
        search?: string;
        page?: number;
        limit?: number;
        sort?: string;
    }) => [...productKeys.lists(), filters] as const,
};

// Hook to fetch products with filters
export function useProducts(params: {
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
} = {}) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => productApi.getProducts(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Hook to create a product
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (product: Omit<Product, "id" | "createdAt">) =>
            productApi.createProduct(product),
        onSuccess: () => {
            // Invalidate all product queries to refetch
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}
