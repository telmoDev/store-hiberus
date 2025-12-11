<?php

namespace App\Contexts\Order\Domain;

interface OrderRepository
{
    public function save(Order $order): void;
    public function findById(string $id): ?Order;
}
