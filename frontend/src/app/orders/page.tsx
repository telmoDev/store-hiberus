"use client";

import { AuthGuard } from "@/presentation/components/auth-guard";
import { OrderList } from "@/presentation/components/orders/order-list";

export default function OrdersPage() {
    return (
        <AuthGuard>
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Order History</h1>
                </div>

                <OrderList />
            </div>
        </AuthGuard>
    );
}
