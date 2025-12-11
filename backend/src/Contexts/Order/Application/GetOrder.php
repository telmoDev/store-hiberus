<?php

namespace App\Contexts\Order\Application;

use App\Contexts\Order\Domain\Order;
use App\Contexts\Order\Domain\OrderRepository;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class GetOrder
{
    public function __construct(
        private OrderRepository $orderRepository
    ) {}

    public function __invoke(string $orderId, string $clientId): ?Order
    {
        $order = $this->orderRepository->findById($orderId);

        if (!$order) {
            return null;
        }

        if ($order->getClientId() !== $clientId) {
            throw new AccessDeniedException('No tienes permiso para ver esta orden.');
        }

        return $order;
    }
}
