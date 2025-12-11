"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/application/stores/use-auth";

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
}

export function AuthGuard({
    children,
    requireAuth = true,
    requireAdmin = false,
}: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated, user, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (requireAuth && !isAuthenticated) {
            router.push("/login");
            return;
        }

        if (requireAdmin && user && !user.roles.includes("ROLE_ADMIN")) {
            router.push("/");
            return;
        }
    }, [isAuthenticated, user, requireAuth, requireAdmin, router]);

    if (requireAuth && !isAuthenticated) {
        return null;
    }

    if (requireAdmin && user && !user.roles.includes("ROLE_ADMIN")) {
        return null;
    }

    return <>{children}</>;
}
