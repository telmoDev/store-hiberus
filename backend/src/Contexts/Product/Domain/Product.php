<?php

namespace App\Contexts\Product\Domain;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
#[ORM\Table(name: 'products')]
class Product
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private Uuid $id;

    #[ORM\Column(type: 'string', length: 255)]
    private string $name;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private float $price;

    #[ORM\Column(type: 'text')]
    private string $description;

    #[ORM\Column(type: 'integer')]
    private int $stock;

    public function __construct(string $name, float $price, string $description, int $stock = 0)
    {
        $this->id = Uuid::v4();
        $this->name = $name;
        $this->price = $price;
        $this->description = $description;
        $this->stock = $stock;
    }

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

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getStock(): int
    {
        return $this->stock;
    }

    public function decreaseStock(int $quantity): void
    {
        if ($quantity > $this->stock) {
            throw new \DomainException("Insufficient stock for product {$this->name}");
        }
        $this->stock -= $quantity;
    }

    public function hasStock(int $quantity): bool
    {
        return $this->stock >= $quantity;
    }
}
