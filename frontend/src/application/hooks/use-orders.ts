import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/infrastructure/api/order-api";
import { productKeys } from "./use-products";

// Query key factory
export const orderKeys = {
    all: ["orders"] as const,
    details: () => [...orderKeys.all, "detail"] as const,
    detail: (id: string) => [...orderKeys.details(), id] as const,
};

// Hook to fetch a single order
export function useOrder(orderId: string) {
    return useQuery({
        queryKey: orderKeys.detail(orderId),
        queryFn: () => orderApi.getOrder(orderId),
        enabled: !!orderId,
    });
}

// Hook to create an order
export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            items,
        }: {
            userId: string;
            items: { productId: string; quantity: number }[];
        }) => orderApi.createOrder(userId, items),
        onSuccess: () => {
            // Invalidate order queries
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            // Invalidate product queries to update stock
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}
