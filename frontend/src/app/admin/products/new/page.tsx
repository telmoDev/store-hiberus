"use client";

export const dynamic = "force-dynamic";

import { Header } from "@/presentation/components/layout/header";
import { ProductForm } from "@/presentation/components/products/product-form";
import { AuthGuard } from "@/presentation/components/auth-guard";

export default function NewProductPage() {
    return (
        <AuthGuard requireAdmin={true}>
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container flex justify-center py-8">
                    <ProductForm />
                </main>
            </div>
        </AuthGuard>
    );
}
