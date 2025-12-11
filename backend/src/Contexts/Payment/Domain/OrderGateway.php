<?php

namespace App\Contexts\Payment\Domain;

use Symfony\Component\Uid\Uuid;

interface OrderGateway
{
    public function findOrderById(string $id): ?OrderData;
    public function markOrderAsPaid(string $id): void;
}
