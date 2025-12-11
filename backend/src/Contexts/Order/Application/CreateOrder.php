<?php

namespace App\Contexts\Order\Application;

use App\Contexts\Order\Application\DTO\CreateOrderRequest;
use App\Contexts\Order\Domain\Order;
use App\Contexts\Order\Domain\OrderItem;
use App\Contexts\Order\Domain\OrderRepository;
use App\Contexts\Order\Domain\ProductGateway;

class CreateOrder
{
    public function __construct(
        private OrderRepository $orderRepository,
        private ProductGateway $productGateway
    ) {}

    public function __invoke(CreateOrderRequest $request): Order
    {
        $order = new Order($request->getClientId());

        foreach ($request->getItems() as $itemRequest) {
            $productId = $itemRequest->getProductId();
            $quantity = $itemRequest->getQuantity();

            if ($quantity <= 0) {
                continue; 
            }
            
            $productData = $this->productGateway->findProductById($productId);
            if (!$productData) {
                throw new \InvalidArgumentException("Producto {$productId} no encontrado");
            }

            if ($productData->getStock() < $quantity) {
                throw new \DomainException(
                    "Stock insuficiente para el producto {$productData->getName()}. " .
                    "Disponible: {$productData->getStock()}, Solicitado: {$quantity}"
                );
            }

            $orderItem = new OrderItem(
                $productData->getId(),
                $productData->getName(),
                $productData->getPrice(),
                $quantity
            );
            $order->addItem($orderItem);

            $this->productGateway->decreaseStock($productId, $quantity);
        }
        
        $this->orderRepository->save($order);
        
        return $order;
    }
}
