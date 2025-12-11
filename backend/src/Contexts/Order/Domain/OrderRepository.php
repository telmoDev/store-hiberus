<?php

namespace App\Contexts\Order\Domain;

interface OrderRepository
{
    public function save(Order $order): void;
    public function findById(string $id): ?Order;
    public function search(?string $userId = null, ?string $search = null, int $page = 1, int $limit = 10, ?string $sort = null): array;
}
