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

    public function testListOrders(): void
    {
        $client = static::createClient();
        $token = $this->getAuthToken($client);
        
        // Ensure at least one order exists (reuse logic or rely on separate run, but better to be self-contained if DB cleared)
        // For simplicity in this functional test environment, we assume persistence or create one.
        // Let's create one first to be safe.
        $container = static::getContainer();
        $em = $container->get('doctrine')->getManager();
        $product = new \App\Contexts\Product\Domain\Product('List Test Product', 10.0, 'Description', 100);
        $em->persist($product);
        $em->flush();

        $client->request('POST', '/api/v1/orders', [], [], 
            ['CONTENT_TYPE' => 'application/json', 'HTTP_AUTHORIZATION' => 'Bearer ' . $token], 
            json_encode([
                'items' => [
                    ['productId' => $product->getId()->toRfc4122(), 'quantity' => 1]
                ]
            ])
        ); 
        
        // NOW list
        $client->request('GET', '/api/v1/orders', [], [], 
            ['CONTENT_TYPE' => 'application/json', 'HTTP_AUTHORIZATION' => 'Bearer ' . $token]
        );

        $this->assertResponseStatusCodeSame(200);
        $content = $client->getResponse()->getContent();
        $this->assertJson($content);
        $data = json_decode($content, true);
        $this->assertIsArray($data);
        $this->assertGreaterThanOrEqual(1, count($data));
        $this->assertArrayHasKey('id', $data[0]);
        $this->assertArrayHasKey('total', $data[0]);
        $this->assertArrayHasKey('status', $data[0]);
    }
}
