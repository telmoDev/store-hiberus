"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/presentation/components/layout/header";
import { CheckoutForm } from "@/presentation/components/payment/checkout-form";
import { AuthGuard } from "@/presentation/components/auth-guard";

export default function CheckoutPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container max-w-6xl py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
                        <p className="text-muted-foreground mt-2">
                            Complete tu pedido y pago
                        </p>
                    </div>
                    <CheckoutForm />
                </main>
            </div>
        </AuthGuard>
    );
}
