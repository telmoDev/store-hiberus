import httpClient from "../http/http-client";
import { IOrderRepository } from "@/domain/repositories";
import { Order } from "@/domain/entities";

export class OrderApiRepository implements IOrderRepository {
    async createOrder(
        userId: string,
        items: { productId: string; quantity: number }[]
    ): Promise<Order> {
        const response = await httpClient.post<Order>("/api/v1/orders", {
            items,
        });

        return response.data;
    }

    async getOrder(orderId: string): Promise<Order> {
        const response = await httpClient.get<Order>(`/api/v1/orders/${orderId}`);
        return response.data;
    }

    async getOrders(params: {
        search?: string;
        page?: number;
        limit?: number;
        sort?: string;
    } = {}): Promise<Order[]> {
        const response = await httpClient.get<Order[]>("/api/v1/orders", { params });
        return response.data;
    }
}

export const orderApi = new OrderApiRepository();
