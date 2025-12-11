"use client";

import Link from "next/link";
import { useAuthStore } from "@/application/stores/use-auth";
import { useCartStore } from "@/application/stores/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut, User, Package } from "lucide-react";

export function Header() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const { totalItems } = useCartStore();

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between mx-auto">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <Package className="h-6 w-6" />
                        <span className="font-bold text-xl">Store</span>
                    </Link>

                    {isAuthenticated && (
                        <nav className="flex items-center gap-4">
                            <Link href="/" className="text-sm font-medium hover:underline">
                                Productos
                            </Link>
                            <Link href="/orders" className="text-sm font-medium hover:underline">
                                Mis Pedidos
                            </Link>
                            {user?.roles.includes("ROLE_ADMIN") && (
                                <Link
                                    href="/admin/products/new"
                                    className="text-sm font-medium hover:underline"
                                >
                                    Añadir Producto
                                </Link>
                            )}
                        </nav>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link href="/cart">
                                <Button variant="outline" size="icon" className="relative">
                                    <ShoppingCart className="h-5 w-5" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="text-sm font-medium">{user?.username}</span>
                            </div>

                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Cerrar sesión
                            </Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button>Entrar</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
