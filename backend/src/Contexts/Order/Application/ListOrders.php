<?php

namespace App\Contexts\Order\Application;

use App\Contexts\Order\Domain\OrderRepository;

class ListOrders
{
    public function __construct(
        private OrderRepository $orderRepository
    ) {}

    public function __invoke(
        ?string $userId,
        bool $isAdmin,
        ?string $search = null,
        int $page = 1,
        int $limit = 10,
        ?string $sort = null
    ): array {
        $filterUserId = $userId;
        
        if ($isAdmin) {
            $filterUserId = null;
        } else {
            if (!$userId) {
                throw new \InvalidArgumentException("User ID required for non-admins");
            }
            $filterUserId = $userId;
        }

        return $this->orderRepository->search($filterUserId, $search, $page, $limit, $sort);
    }
}
