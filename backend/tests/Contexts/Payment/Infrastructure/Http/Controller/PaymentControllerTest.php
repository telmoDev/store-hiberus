<?php

namespace App\Tests\Contexts\Payment\Infrastructure\Http\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class PaymentControllerTest extends WebTestCase
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

    public function testCheckout(): void
    {
        $client = static::createClient();
        $token = $this->getAuthToken($client);

        // Seed an Order
        $container = static::getContainer();
        $em = $container->get('doctrine')->getManager();
        
        // Ensure we use the same user as the token ('client')
        $order = new \App\Contexts\Order\Domain\Order('client');
        // Add a dummy item
        $item = new \App\Contexts\Order\Domain\OrderItem(\Symfony\Component\Uid\Uuid::v4(), 'Prod', 100.0, 1);
        $order->addItem($item); // This cascades persist? Order entity said cascade=['persist'] on items mapping? Yes.
        
        $em->persist($order);
        // If cascade persist is ensuring items are saved, great.
        // But OrderItem -> Order relation is owning side?
        // OrderItem: #[ORM\ManyToOne(targetEntity: Order::class, inversedBy: 'items')] 
        // inversedBy means Order is inverse side. OrderItem is owning side.
        // So we need to setOrder on Item?
        // Order->addItem does $item->setOrder($this). So we are good.
        
        $em->flush();

        $client->request('POST', '/api/v1/orders/' . $order->getId()->toRfc4122() . '/checkout', [], [], 
            ['CONTENT_TYPE' => 'application/json', 'HTTP_AUTHORIZATION' => 'Bearer ' . $token], 
            json_encode([
                'token' => 'payment-token-123'
            ])
        );

        $this->assertResponseIsSuccessful();
    }
}
