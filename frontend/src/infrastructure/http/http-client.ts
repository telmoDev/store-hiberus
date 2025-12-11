import axios, { AxiosInstance, AxiosError } from "axios";
import { useAuthStore } from "@/application/stores/use-auth";

// Create axios instance with base configuration
const httpClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - Add auth token to requests
httpClient.interceptors.request.use(
    (config) => {
        // Get token from auth store
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
httpClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const data = error.response.data as any;

            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                if (typeof window !== "undefined") {
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("auth_user");
                    // Only redirect if not already on login page
                    if (window.location.pathname !== "/login") {
                        window.location.href = "/login";
                    }
                }
            }

            // Return error message from server or generic message
            const message = data?.error || data?.message || "Error al obtener datos";
            return Promise.reject(new Error(message));
        } else if (error.request) {
            // Request was made but no response received
            return Promise.reject(new Error("Error de red. Por favor, verifica tu conexión."));
        } else {
            // Something else happened
            return Promise.reject(error);
        }
    }
);

export default httpClient;
