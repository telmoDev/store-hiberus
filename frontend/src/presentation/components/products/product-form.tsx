"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateProduct } from "@/application/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(0.01, "Price must be greater than 0"),
    description: z.string().min(1, "Description is required"),
    stock: z.coerce.number().int().min(0, "Stock must be 0 or greater"),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm() {
    const router = useRouter();
    const { toast } = useToast();
    const createProduct = useCreateProduct();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            stock: 0,
        },
    });

    const onSubmit = async (data: ProductFormData) => {
        try {
            await createProduct.mutateAsync(data);
            toast({
                title: "Success",
                description: "Producto creado exitosamente",
            });
            reset();
            router.push("/");
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error ? error.message : "Error al crear el producto",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Crear Nuevo Producto</CardTitle>
                <CardDescription>
                    Añade un nuevo producto al catálogo (Admin only)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Producto</Label>
                        <Input
                            id="name"
                            placeholder="Introduce el nombre del producto"
                            {...register("name")}
                            disabled={createProduct.isPending}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register("price")}
                                disabled={createProduct.isPending}
                            />
                            {errors.price && (
                                <p className="text-sm text-destructive">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                placeholder="0"
                                {...register("stock")}
                                disabled={createProduct.isPending}
                            />
                            {errors.stock && (
                                <p className="text-sm text-destructive">
                                    {errors.stock.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <textarea
                            id="description"
                            placeholder="Introduce la descripción del producto"
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            {...register("description")}
                            disabled={createProduct.isPending}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={createProduct.isPending}
                        >
                            {createProduct.isPending ? "Creando..." : "Crear Producto"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/")}
                            disabled={createProduct.isPending}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
