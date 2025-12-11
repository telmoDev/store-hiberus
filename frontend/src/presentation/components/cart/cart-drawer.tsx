"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/application/stores/use-cart";
import { useAuthStore } from "@/application/stores/use-auth";
import { useCreateOrder } from "@/application/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CartDrawer() {
    const router = useRouter();
    const { items, totalPrice, updateQuantity, removeItem, clearCart } =
        useCartStore();
    const { user } = useAuthStore();
    const createOrder = useCreateOrder();
    const { toast } = useToast();

    const handleCheckout = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "Debes iniciar sesión para realizar el pedido",
                variant: "destructive",
            });
            return;
        }

        if (items.length === 0) {
            toast({
                title: "Error",
                description: "Tu carrito está vacío",
                variant: "destructive",
            });
            return;
        }

        try {
            const orderItems = items.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
            }));

            const order = await createOrder.mutateAsync({
                userId: user.username,
                items: orderItems,
            });

            clearCart();
            toast({
                title: "Success",
                description: "Pedido realizado correctamente",
            });
            router.push(`/checkout?orderId=${order.id}`);
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error ? error.message : "Error al crear el pedido",
                variant: "destructive",
            });
        }
    };

    if (items.length === 0) {
        return (
            <div className="container max-w-4xl py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Carrito de Compras</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground py-8">
                            Tu carrito está vacío
                        </p>
                        <Button onClick={() => router.push("/")} className="w-full">
                            Seguir comprando
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Carrito de Compras ({items.length} items)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.product.id}
                            className="flex items-center gap-4 border-b pb-4 last:border-0"
                        >
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    ${item.product.price.toFixed(2)} cada uno
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        updateQuantity(item.product.id, item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        updateQuantity(item.product.id, item.quantity + 1)
                                    }
                                    disabled={item.quantity >= item.product.stock}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="w-24 text-right font-semibold">
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.product.id)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}

                    <div className="pt-4 space-y-4">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/")}
                                className="flex-1"
                            >
                                Seguir comprando
                            </Button>
                            <Button
                                onClick={handleCheckout}
                                disabled={createOrder.isPending}
                                className="flex-1"
                            >
                                {createOrder.isPending ? "Processing..." : "Proceed to Checkout"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
