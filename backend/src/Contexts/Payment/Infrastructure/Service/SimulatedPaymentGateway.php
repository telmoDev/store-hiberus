<?php

namespace App\Contexts\Payment\Infrastructure\Service;

use App\Contexts\Payment\Domain\PaymentGateway;

class SimulatedPaymentGateway implements PaymentGateway
{
    public function charge(float $amount, string $token): bool
    {
        return true;
    }
}
