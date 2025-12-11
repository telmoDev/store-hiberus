"use client";

export const dynamic = "force-dynamic";

import { useParams } from "next/navigation";
import { useOrder } from "@/application/hooks/use-orders";
import { Header } from "@/presentation/components/layout/header";
import { AuthGuard } from "@/presentation/components/auth-guard";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id as string;
    const { data: order, isLoading, error } = useOrder(orderId);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container max-w-4xl py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold tracking-tight">Detalles del Pedido</h1>
                        <p className="text-muted-foreground mt-2">
                            Ver tus detalles de pedido
                        </p>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {error && (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-destructive text-center">
                                    Error al cargar el pedido: {error.message}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {order && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order #{order.id}</CardTitle>
                                    <CardDescription>
                                        Status:{" "}
                                        <span
                                            className={
                                                order.status === "PAID"
                                                    ? "text-green-600 font-semibold"
                                                    : "text-yellow-600 font-semibold"
                                            }
                                        >
                                            {order.status}
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Items del Pedido</h3>
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between py-2 border-b last:border-0"
                                            >
                                                <span>
                                                    {item.productName || `Product ${item.productId}`} x{" "}
                                                    {item.quantity}
                                                </span>
                                                <span className="font-semibold">
                                                    ${((item.price || 0) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span>${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        <p>Fecha del Pedido: {new Date(order.createdAt).toLocaleString()}</p>
                                        <p>Cliente: {order.userId}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </main>
            </div>
        </AuthGuard>
    );
}
