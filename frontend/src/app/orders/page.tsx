"use client";

import { AuthGuard } from "@/presentation/components/auth-guard";
import { OrderList } from "@/presentation/components/orders/order-list";
import { Header } from "@/presentation/components/layout/header";

export default function OrdersPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">Historial de pedidos</h1>
                    </div>

                    <OrderList />
                </div>
            </div>
        </AuthGuard>
    );
}
