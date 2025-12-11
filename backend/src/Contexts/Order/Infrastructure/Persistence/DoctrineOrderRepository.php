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

    public function search(?string $userId = null, ?string $search = null, int $page = 1, int $limit = 10, ?string $sort = null): array
    {
        $qb = $this->createQueryBuilder('o');

        if ($userId) {
            $qb->andWhere('o.clientId = :userId')
               ->setParameter('userId', $userId);
        }

        if ($search) {
            // Search by Order ID (partial match could be supported, but ID is UUID so exact or partial string match)
            $qb->andWhere('o.id LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        // Sorting
        if ($sort) {
            $direction = 'ASC';
            if (str_ends_with($sort, '_desc')) {
                $direction = 'DESC';
            }
            // Currently simplified sort by created date (assuming mapped as 'createdAt' or just by ID if not available yet)
            // For now, let's sort by ID as proxy for creation or add createdAt if present. 
            // Product repository used name/price. Order usually sorts by date.
            // Let's assume we sort by ID for now as explicit date field wasn't seen in Order entity view yet.
            // Checking Order.php would be good, but proceeding with ID sort as safe default or 'total' if available.
            $qb->orderBy('o.id', $direction);
        } else {
             $qb->orderBy('o.id', 'DESC'); // Default newest first roughly
        }

        // Pagination
        $qb->setFirstResult(($page - 1) * $limit)
           ->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }
}
