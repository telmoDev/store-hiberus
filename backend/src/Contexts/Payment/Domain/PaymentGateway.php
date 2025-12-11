<?php

namespace App\Contexts\Payment\Domain;

interface PaymentGateway
{
    public function charge(float $amount, string $token): bool;
}
