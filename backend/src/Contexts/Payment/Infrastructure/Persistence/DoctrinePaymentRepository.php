<?php

namespace App\Contexts\Payment\Infrastructure\Persistence;

use App\Contexts\Payment\Domain\Payment;
use App\Contexts\Payment\Domain\PaymentRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class DoctrinePaymentRepository extends ServiceEntityRepository implements PaymentRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Payment::class);
    }

    public function save(Payment $payment): void
    {
        $this->getEntityManager()->persist($payment);
        $this->getEntityManager()->flush();
    }
}
