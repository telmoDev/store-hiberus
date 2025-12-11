<?php

namespace App\Contexts\Payment\Domain;

use Symfony\Component\Uid\Uuid;

class OrderData
{
    public function __construct(
        private Uuid $id,
        private string $clientId,
        private string $status,
        private float $total
    ) {}

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getClientId(): string
    {
        return $this->clientId;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getTotal(): float
    {
        return $this->total;
    }
}
