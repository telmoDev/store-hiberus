<?php

namespace App\Contexts\Order\Infrastructure\Http\Controller;

use App\Contexts\Order\Application\CreateOrder;
use App\Contexts\Order\Application\GetOrder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[Route('/api/v1/orders')]
class OrderController extends AbstractController
{
    public function __construct(
        private CreateOrder $createOrder,
        private GetOrder $getOrder,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'order_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['items']) || !is_array($data['items'])) {
            return $this->json(['error' => 'Invalid payload. "items" array required.'], 400);
        }

        $user = $this->getUser();
        if (!$user) {
             return $this->json(['error' => 'Unauthorized'], 401);
        }

        $itemRequests = array_map(
            fn($item) => new \App\Contexts\Order\Application\DTO\OrderItemRequest(
                $item['productId'] ?? '',
                $item['quantity'] ?? 0
            ),
            $data['items']
        );

        $orderRequest = new \App\Contexts\Order\Application\DTO\CreateOrderRequest(
            $user->getUserIdentifier(),
            $itemRequests
        );

        $order = ($this->createOrder)($orderRequest);

        return new JsonResponse(
            $this->serializer->serialize($order, 'json', ['ignored_attributes' => ['order']]),
            201,
            [],
            true
        );
    }

    #[Route('/{id}', name: 'order_get', methods: ['GET'])]
    public function get(string $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
             return $this->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $order = ($this->getOrder)($id, $user->getUserIdentifier());
            
            if (!$order) {
                return $this->json(['error' => 'Order not found'], 404);
            }

            return new JsonResponse(
                $this->serializer->serialize($order, 'json', ['ignored_attributes' => ['order']]),
                200,
                [],
                true
            );
        } catch (AccessDeniedException $e) {
             return $this->json(['error' => $e->getMessage()], 403);
        }
    }
}
