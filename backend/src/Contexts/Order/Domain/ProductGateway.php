<?php

namespace App\Contexts\Order\Domain;

interface ProductGateway
{
    public function findProductById(string $id): ?ProductData;
}
