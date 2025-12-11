<?php

namespace App\Contexts\Order\Domain;

interface ProductGateway
{
    public function findProductById(string $id): ?ProductData;
    public function decreaseStock(string $id, int $quantity): void;
}
