"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProcessPayment } from "@/application/hooks/use-payment";
import { useOrder } from "@/application/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const checkoutSchema = z.object({
    token: z.string().min(1, "Payment token is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const { toast } = useToast();
    const processPayment = useProcessPayment();
    const { data: order, isLoading: orderLoading } = useOrder(orderId || "");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            token: "fake-token",
        },
    });

    useEffect(() => {
        if (!orderId) {
            toast({
                title: "Error",
                description: "No ID de pedido proporcionado",
                variant: "destructive",
            });
            router.push("/");
        }
    }, [orderId, router, toast]);

    const onSubmit = async (data: CheckoutFormData) => {
        if (!orderId) return;

        try {
            await processPayment.mutateAsync({
                orderId,
                token: data.token,
            });

            toast({
                title: "Success",
                description: "Pago procesado correctamente!",
            });

            setTimeout(() => {
                router.push(`/orders/${orderId}`);
            }, 1500);
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error ? error.message : "Error al procesar el pago",
                variant: "destructive",
            });
        }
    };

    if (orderLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive">Pedido no encontrado</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                    <CardDescription>ID de Pedido: {order.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <span>
                                {item.productName || `Product ${item.productId}`} x{" "}
                                {item.quantity}
                            </span>
                            <span>${((item.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Pago</CardTitle>
                    <CardDescription>
                        Introduce los detalles del pago (simulado)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="token">Token de Pago</Label>
                            <Input
                                id="token"
                                placeholder="Introduce el token de pago"
                                {...register("token")}
                                disabled={processPayment.isPending}
                            />
                            {errors.token && (
                                <p className="text-sm text-destructive">
                                    {errors.token.message}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                This is a simulated payment. Use any token (e.g., "fake-token")
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processPayment.isPending}
                        >
                            {processPayment.isPending ? "Procesando..." : "Realizar Pago"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
