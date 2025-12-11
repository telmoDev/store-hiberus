<?php

namespace App\Contexts\Payment\Infrastructure\Gateway;

use App\Contexts\Order\Domain\OrderRepository;
use App\Contexts\Payment\Domain\OrderData;
use App\Contexts\Payment\Domain\OrderGateway;

class OrderGatewayAdapter implements OrderGateway
{
    public function __construct(
        private OrderRepository $orderRepository
    ) {}

    public function findOrderById(string $id): ?OrderData
    {
        $order = $this->orderRepository->findById($id);
        
        if (!$order) {
            return null;
        }

        return new OrderData(
            $order->getId(),
            $order->getClientId(),
            $order->getStatus(),
            $order->getTotal()
        );
    }

    public function markOrderAsPaid(string $id): void
    {
        $order = $this->orderRepository->findById($id);
        
        if ($order) {
            $order->markAsPaid();
            $this->orderRepository->save($order);
        }
    }
}
