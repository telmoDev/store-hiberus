import httpClient from "../http/http-client";
import { IProductRepository } from "@/domain/repositories";
import { Product } from "@/domain/entities";

export class ProductApiRepository implements IProductRepository {
    async getProducts(params: {
        search?: string;
        page?: number;
        limit?: number;
        sort?: string;
    }): Promise<Product[]> {
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append("search", params.search);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.sort) queryParams.append("sort", params.sort);

        const response = await httpClient.get<Product[]>(
            `/api/v1/products?${queryParams.toString()}`
        );

        return response.data;
    }

    async createProduct(product: Omit<Product, "id" | "createdAt">): Promise<void> {
        await httpClient.post("/api/v1/products", product);
    }
}

export const productApi = new ProductApiRepository();
