// Repository Interfaces - Contracts for data access (to be implemented in infrastructure layer)

import { User, Product, Order, Payment } from "./entities";

// Auth Repository Interface
export interface IAuthRepository {
    login(username: string, password: string): Promise<User>;
}

// Product Repository Interface
export interface IProductRepository {
    getProducts(params: {
        search?: string;
        page?: number;
        limit?: number;
        sort?: string;
    }): Promise<Product[]>;
    createProduct(product: Omit<Product, "id" | "createdAt">): Promise<void>;
}

// Order Repository Interface
export interface IOrderRepository {
    createOrder(userId: string, items: { productId: string; quantity: number }[]): Promise<Order>;
    getOrder(orderId: string): Promise<Order>;
}

// Payment Repository Interface
export interface IPaymentRepository {
    processPayment(orderId: string, token: string): Promise<void>;
}
