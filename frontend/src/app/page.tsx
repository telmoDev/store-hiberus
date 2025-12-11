"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useAuthStore } from "@/application/stores/use-auth";
import { Header } from "@/presentation/components/layout/header";
import { ProductList } from "@/presentation/components/products/product-list";
import { AuthGuard } from "@/presentation/components/auth-guard";

export default function Home() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Catálogo de Productos</h1>
            <p className="text-muted-foreground mt-2">
              Navega por nuestra selección de productos
            </p>
          </div>
          <ProductList />
        </main>
      </div>
    </AuthGuard>
  );
}

