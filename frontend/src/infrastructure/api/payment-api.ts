import httpClient from "../http/http-client";
import { IPaymentRepository } from "@/domain/repositories";

export class PaymentApiRepository implements IPaymentRepository {
    async processPayment(orderId: string, token: string): Promise<void> {
        await httpClient.post(`/api/v1/orders/${orderId}/checkout`, {
            token,
        });
    }
}

export const paymentApi = new PaymentApiRepository();
