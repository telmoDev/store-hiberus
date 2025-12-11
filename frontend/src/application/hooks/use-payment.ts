import { useMutation } from "@tanstack/react-query";
import { paymentApi } from "@/infrastructure/api/payment-api";

// Hook to process payment
export function useProcessPayment() {
    return useMutation({
        mutationFn: ({ orderId, token }: { orderId: string; token: string }) =>
            paymentApi.processPayment(orderId, token),
    });
}
