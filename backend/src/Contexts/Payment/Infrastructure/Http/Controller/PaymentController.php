<?php

namespace App\Contexts\Payment\Infrastructure\Http\Controller;

use App\Contexts\Payment\Application\ProcessPayment;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class PaymentController extends AbstractController
{
    public function __construct(
        private ProcessPayment $processPayment
    ) {}

    #[Route('/api/v1/orders/{id}/checkout', name: 'order_checkout', methods: ['POST'])]
    public function checkout(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'] ?? 'fake-token';
        
        $user = $this->getUser();
        if (!$user) {
             return $this->json(['error' => 'No autenticado'], 401);
        }

        try {
            ($this->processPayment)($id, $token, $user->getUserIdentifier());
            
            return $this->json(['status' => 'Pago procesado correctamente']);
        } catch (AccessDeniedException $e) {
             return $this->json(['error' => $e->getMessage()], 403);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }
}
