<?php

namespace App\Contexts\Product\Infrastructure\Persistence;

use App\Contexts\Product\Domain\Product;
use App\Contexts\Product\Domain\ProductRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class DoctrineProductRepository extends ServiceEntityRepository implements ProductRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function save(Product $product): void
    {
        $this->getEntityManager()->persist($product);
        $this->getEntityManager()->flush();
    }

    public function searchAll(?string $search = null, int $page = 1, int $limit = 10, ?string $sort = null): array
    {
        $qb = $this->createQueryBuilder('p');

        if ($search) {
            $qb->andWhere('LOWER(p.name) LIKE LOWER(:search) OR LOWER(p.description) LIKE LOWER(:search)')
               ->setParameter('search', '%' . $search . '%');
        }

        if ($sort) {
            $parts = explode('_', $sort);
            if (count($parts) === 2) {
                $field = $parts[0];
                $direction = strtoupper($parts[1]);
                
                if (in_array($field, ['name', 'price']) && in_array($direction, ['ASC', 'DESC'])) {
                    $qb->orderBy('p.' . $field, $direction);
                }
            }
        }

        $qb->setFirstResult(($page - 1) * $limit)
           ->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }

    public function findById(string $id): ?Product
    {
        return $this->find($id);
    }
}
