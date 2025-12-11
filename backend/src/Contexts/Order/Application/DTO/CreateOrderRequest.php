<?php

namespace App\Contexts\Order\Application\DTO;

class CreateOrderRequest
{
    /**
     * @param OrderItemRequest[] $items
     */
    public function __construct(
        private string $clientId,
        private array $items
    ) {}

    public function getClientId(): string
    {
        return $this->clientId;
    }

    /**
     * @return OrderItemRequest[]
     */
    public function getItems(): array
    {
        return $this->items;
    }
}
