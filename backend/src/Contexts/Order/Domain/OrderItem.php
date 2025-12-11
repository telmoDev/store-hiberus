<?php

namespace App\Contexts\Order\Domain;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
#[ORM\Table(name: 'order_items')]
class OrderItem
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private Uuid $id;

    #[ORM\ManyToOne(targetEntity: Order::class, inversedBy: 'items')]
    #[ORM\JoinColumn(nullable: false)]
    private Order $order;

    #[ORM\Column(type: 'uuid')]
    private Uuid $productId;

    #[ORM\Column(type: 'string', length: 255)]
    private string $productName;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private float $price;

    #[ORM\Column(type: 'integer')]
    private int $quantity;

    public function __construct(Uuid $productId, string $productName, float $price, int $quantity)
    {
        $this->id = Uuid::v4();
        $this->productId = $productId;
        $this->productName = $productName;
        $this->price = $price;
        $this->quantity = $quantity;
    }

    public function setOrder(Order $order): void
    {
        $this->order = $order;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    public function getId(): Uuid
    {
        return $this->id;
    }
    
    public function getProductId(): Uuid
    {
        return $this->productId;
    }
    
    public function getProductName(): string
    {
        return $this->productName;
    }
}
