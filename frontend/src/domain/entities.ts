// Domain Entities - Pure business objects with no external dependencies

export interface User {
    username: string;
    roles: string[];
    token?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    createdAt?: string;
}

export interface OrderItem {
    productId: string;
    productName?: string;
    quantity: number;
    price?: number;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: string;
}

export enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELLED = "CANCELLED",
}

export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    status: PaymentStatus;
    token: string;
    createdAt: string;
}

export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

// Cart Item (client-side only)
export interface CartItem {
    product: Product;
    quantity: number;
}
