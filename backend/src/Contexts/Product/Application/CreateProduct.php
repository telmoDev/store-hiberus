<?php

namespace App\Contexts\Product\Application;

use App\Contexts\Product\Domain\Product;
use App\Contexts\Product\Domain\ProductRepository;

class CreateProduct
{
    public function __construct(private ProductRepository $productRepository)
    {
    }

    public function __invoke(string $name, float $price, string $description, int $stock = 0): void
    {
        $product = new Product($name, $price, $description, $stock);
        $this->productRepository->save($product);
    }
}
