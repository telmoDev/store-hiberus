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
        // Access Control Logic
        $filterUserId = $userId;
        
        if ($isAdmin) {
            // Admin can see all, so if they pass a specific userId in search params (not implemented in repo yet but logically)
            // For now, if Admin, we ignore the passed $userId (which is their own ID) if we want to show ALL.
            // BUT implementation says: "If Admin, calls searchAll" (which is now search(null...)).
            // So if Admin, we set filterUserId to null to see everything.
            $filterUserId = null;
        } else {
            // If Client, they MUST filter by their own ID.
            if (!$userId) {
                throw new \InvalidArgumentException("User ID required for non-admins");
            }
            $filterUserId = $userId;
        }

        return $this->orderRepository->search($filterUserId, $search, $page, $limit, $sort);
    }
}
