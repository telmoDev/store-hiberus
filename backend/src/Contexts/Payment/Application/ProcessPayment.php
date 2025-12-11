<?php

namespace App\Contexts\Payment\Application;

use App\Contexts\Payment\Domain\OrderGateway;
use App\Contexts\Payment\Domain\Payment;
use App\Contexts\Payment\Domain\PaymentGateway;
use App\Contexts\Payment\Domain\PaymentRepository;

class ProcessPayment
{
    public function __construct(
        private OrderGateway $orderGateway,
        private PaymentRepository $paymentRepository,
        private PaymentGateway $paymentGateway
    ) {}

    public function __invoke(string $orderId, string $token, string $clientId): void
    {
        $orderData = $this->orderGateway->findOrderById($orderId);
        
        if (!$orderData) {
            throw new \InvalidArgumentException('Orden no encontrada');
        }
        
        if ($orderData->getClientId() !== $clientId) {
            throw new \Symfony\Component\Security\Core\Exception\AccessDeniedException('No tienes permiso para pagar esta orden.');
        }

        if ($orderData->getStatus() === 'PAID') {
            throw new \DomainException('Orden ya pagada');
        }

        $success = $this->paymentGateway->charge($orderData->getTotal(), $token);
        
        $paymentStatus = $success ? 'COMPLETED' : 'FAILED';
        $payment = new Payment($orderData->getId(), $orderData->getTotal(), $paymentStatus);
        
        $this->paymentRepository->save($payment);
        
        if ($success) {
            $this->orderGateway->markOrderAsPaid($orderId);
        } else {
             throw new \RuntimeException('Pago fallido');
        }
    }
}
