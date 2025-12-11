<?php

namespace App\Contexts\Order\Infrastructure\Gateway;

use App\Contexts\Order\Domain\ProductData;
use App\Contexts\Order\Domain\ProductGateway;
use App\Contexts\Product\Domain\ProductRepository;

class ProductGatewayAdapter implements ProductGateway
{
    public function __construct(
        private ProductRepository $productRepository
    ) {}

    public function findProductById(string $id): ?ProductData
    {
        $product = $this->productRepository->findById($id);
        
        if (!$product) {
            return null;
        }

        return new ProductData(
            $product->getId(),
            $product->getName(),
            $product->getPrice(),
            $product->getStock()
        );
    }
}
