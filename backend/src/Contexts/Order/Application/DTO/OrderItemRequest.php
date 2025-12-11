<?php

namespace App\Contexts\Order\Application\DTO;

class OrderItemRequest
{
    public function __construct(
        private string $productId,
        private int $quantity
    ) {}

    public function getProductId(): string
    {
        return $this->productId;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }
}
