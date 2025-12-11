"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/presentation/components/layout/header";
import { CartDrawer } from "@/presentation/components/cart/cart-drawer";
import { AuthGuard } from "@/presentation/components/auth-guard";

export default function CartPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <Header />
                <main className="py-8">
                    <CartDrawer />
                </main>
            </div>
        </AuthGuard>
    );
}
