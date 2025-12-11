import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/domain/entities";
import { authApi } from "@/infrastructure/api/auth-api";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (username: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const user = await authApi.login(username, password);
                    set({
                        user,
                        token: user.token || null,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Login failed";
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: message,
                    });
                    throw error;
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            checkAuth: () => {
                // State is automatically rehydrated by persist middleware
                const { token } = get();
                if (token) {
                    set({ isAuthenticated: true });
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
