"use client";

import { useState } from "react";
import { useProducts } from "@/application/hooks/use-products";
import { ProductCard } from "./product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

export function ProductList() {
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sort, setSort] = useState<string>("");

    const { data: products, isLoading, error } = useProducts({
        search: searchQuery,
        sort,
        limit: 50,
    });

    const handleSearch = () => {
        setSearchQuery(search);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive">
                    Error loading products: {error.message}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                    />
                    <Button onClick={handleSearch} size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                    <option value="">Sort by</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                </select>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {/* Products Grid */}
            {!isLoading && products && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && products && products.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        No products found. Try adjusting your search.
                    </p>
                </div>
            )}
        </div>
    );
}
