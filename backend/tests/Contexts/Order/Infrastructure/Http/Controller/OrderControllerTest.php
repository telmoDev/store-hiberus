<?php

namespace App\Tests\Contexts\Order\Infrastructure\Http\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class OrderControllerTest extends WebTestCase
{
    private function getAuthToken($client): string
    {
        $client->request('POST', '/api/v1/auth/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'client',
            'password' => 'client123',
        ]));
        
        $data = json_decode($client->getResponse()->getContent(), true);
        return $data['token'];
    }

    public function testCreateOrder(): void
    {
        $client = static::createClient();
        $token = $this->getAuthToken($client);

        // Seed a product
        $container = static::getContainer();
        $em = $container->get('doctrine')->getManager();
        
        $product = new \App\Contexts\Product\Domain\Product('Test Product Utils', 50.0, 'Description', 100);
        $em->persist($product);
        $em->flush();

        $client->request('POST', '/api/v1/orders', [], [], 
            ['CONTENT_TYPE' => 'application/json', 'HTTP_AUTHORIZATION' => 'Bearer ' . $token], 
            json_encode([
                'items' => [
                    ['productId' => $product->getId()->toRfc4122(), 'quantity' => 2]
                ]
            ])
        );

        $this->assertResponseStatusCodeSame(201);
    }
}
