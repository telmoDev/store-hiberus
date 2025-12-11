<?php

namespace App\Contexts\Product\Application;

use App\Contexts\Product\Domain\ProductRepository;

class ListProducts
{
    public function __construct(private ProductRepository $productRepository)
    {
    }

    public function __invoke(?string $search = null, int $page = 1, int $limit = 10, ?string $sort = null): array
    {
        return $this->productRepository->searchAll($search, $page, $limit, $sort);
    }
}
