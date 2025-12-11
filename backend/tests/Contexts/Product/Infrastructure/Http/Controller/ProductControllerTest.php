<?php

namespace App\Tests\Contexts\Product\Infrastructure\Http\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProductControllerTest extends WebTestCase
{
    private function getAdminToken($client): string
    {
        $client->request('POST', '/api/v1/auth/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'admin',
            'password' => 'admin123',
        ]));
        
        $data = json_decode($client->getResponse()->getContent(), true);
        return $data['token'];
    }

    public function testCreateProduct(): void
    {
        $client = static::createClient();
        $token = $this->getAdminToken($client);

        $client->request('POST', '/api/v1/products', [], [], 
            ['CONTENT_TYPE' => 'application/json', 'HTTP_AUTHORIZATION' => 'Bearer ' . $token], 
            json_encode([
                'name' => 'Test Product',
                'price' => 100.50,
                'description' => 'A test product',
                'stock' => 10,
            ])
        );

        $this->assertResponseStatusCodeSame(201);
    }

    public function testCreateProductWithoutAdminRole(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/v1/products', [], [], 
            ['CONTENT_TYPE' => 'application/json'], 
            json_encode([
                'name' => 'Test Product',
                'price' => 100.50,
                'description' => 'A test product',
            ])
        );

        $this->assertResponseStatusCodeSame(401);
    }

    public function testListProducts(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/v1/products');

        $this->assertResponseIsSuccessful();
        $this->assertJson($client->getResponse()->getContent());
    }
}
