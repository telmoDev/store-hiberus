<?php

namespace App\Contexts\Order\Domain;

use Symfony\Component\Uid\Uuid;

class ProductData
{
    public function __construct(
        private Uuid $id,
        private string $name,
        private float $price,
        private int $stock
    ) {}

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function getStock(): int
    {
        return $this->stock;
    }
}
