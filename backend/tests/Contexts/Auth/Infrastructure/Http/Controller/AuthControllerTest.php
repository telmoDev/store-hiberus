<?php

namespace App\Tests\Contexts\Auth\Infrastructure\Http\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthControllerTest extends WebTestCase
{
    public function testLoginSuccess(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/v1/auth/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'admin',
            'password' => 'admin123',
        ]));

        $this->assertResponseIsSuccessful();
        $this->assertJson($client->getResponse()->getContent());
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $data);
        $this->assertEquals('admin-token', $data['token']);
    }

    public function testLoginFailure(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/v1/auth/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'wrong',
            'password' => 'wrong',
        ]));

        $this->assertResponseStatusCodeSame(401);
    }
}
