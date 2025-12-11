<?php

namespace App\Contexts\Product\Infrastructure\Http\Controller;

use App\Contexts\Product\Application\CreateProduct;
use App\Contexts\Product\Application\ListProducts;
use App\Contexts\Product\Domain\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/v1/products')]
class ProductController extends AbstractController
{
    public function __construct(
        private CreateProduct $createProduct,
        private ListProducts $listProducts,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'product_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        if (!in_array('ROLE_ADMIN', $user->getRoles())) {
            return $this->json(['error' => 'No tienes permiso para crear productos.'], 403);
        }

        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['name'], $data['price'], $data['description'])) {
            return $this->json(['error' => 'Faltan campos obligatorios'], 400);
        }

        $stock = $data['stock'] ?? 0;

        ($this->createProduct)(
            $data['name'], 
            (float)$data['price'], 
            $data['description'],
            (int)$stock
        );

        return $this->json(['status' => 'Producto creado'], 201);
    }

    #[Route('', name: 'product_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
         $search = $request->query->get('search');
         $page = $request->query->getInt('page', 1);
         $sort = $request->query->get('sort');
         $limit = $request->query->getInt('limit', 10);

         $products = ($this->listProducts)($search, $page, $limit, $sort);
         
         $json = $this->serializer->serialize($products, 'json');
         
         return new JsonResponse($json, 200, [], true);
    }
}
