<?php

namespace App\Contexts\Product\Domain;

interface ProductRepository
{
    public function save(Product $product): void;
    public function searchAll(?string $search = null, int $page = 1, int $limit = 10, ?string $sort = null): array;
    public function findById(string $id): ?Product;
}
