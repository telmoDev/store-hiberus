import httpClient from "../http/http-client";
import { IAuthRepository } from "@/domain/repositories";
import { User } from "@/domain/entities";

export class AuthApiRepository implements IAuthRepository {
    async login(username: string, password: string): Promise<User> {
        const response = await httpClient.post<{
            token: string;
            user: {
                username: string;
                roles: string[];
            };
        }>("/api/v1/auth/login", {
            username,
            password,
        });

        const { token, user } = response.data;

        // Store token and user in localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", token);
            localStorage.setItem("auth_user", JSON.stringify(user));
        }

        return {
            username: user.username,
            roles: user.roles,
            token,
        };
    }
}

export const authApi = new AuthApiRepository();
