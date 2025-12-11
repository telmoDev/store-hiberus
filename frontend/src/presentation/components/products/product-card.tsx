"use client";

import { Product } from "@/domain/entities";
import { useCartStore } from "@/application/stores/use-cart";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCartStore();
    const { toast } = useToast();

    const handleAddToCart = () => {
        if (product.stock <= 0) {
            toast({
                title: "Agotado",
                description: "Este producto está actualmente agotado",
                variant: "destructive",
            });
            return;
        }

        addItem(product, 1);
        toast({
            title: "Añadido al carrito",
            description: `${product.name} ha sido añadido a tu carrito`,
        });
    };

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                <CardDescription className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.description}
                </p>
                <div className="mt-4">
                    <span className="text-sm">
                        Stock:{" "}
                        <span
                            className={
                                product.stock > 0 ? "text-green-600" : "text-destructive"
                            }
                        >
                            {product.stock}
                        </span>
                    </span>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full"
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
            </CardFooter>
        </Card>
    );
}
