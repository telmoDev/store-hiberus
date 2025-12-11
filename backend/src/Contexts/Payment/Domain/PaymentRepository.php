<?php

namespace App\Contexts\Payment\Domain;

interface PaymentRepository
{
    public function save(Payment $payment): void;
}
