<?php

namespace App\Contexts\Order\Infrastructure\Persistence;

use App\Contexts\Order\Domain\Order;
use App\Contexts\Order\Domain\OrderRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class DoctrineOrderRepository extends ServiceEntityRepository implements OrderRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Order::class);
    }

    public function save(Order $order): void
    {
        $this->getEntityManager()->persist($order);
        $this->getEntityManager()->flush();
    }

    public function findById(string $id): ?Order
    {
        return $this->find($id);
    }
}
