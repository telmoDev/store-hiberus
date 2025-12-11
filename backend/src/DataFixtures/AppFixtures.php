<?php

namespace App\DataFixtures;

use App\Contexts\Product\Domain\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $products = [
            [
                'name' => 'Laptop Gamer Pro',
                'description' => 'Laptop de alto rendimiento con procesador i9 y RTX 4080',
                'price' => 2500.00,
                'stock' => 10
            ],
            [
                'name' => 'Smartphone X',
                'description' => 'Último modelo con cámara de 200MP y pantalla OLED',
                'price' => 999.99,
                'stock' => 25
            ],
            [
                'name' => 'Auriculares Noise Cancelling',
                'description' => 'Auriculares inalámbricos con cancelación de ruido activa',
                'price' => 199.50,
                'stock' => 50
            ],
            [
                'name' => 'Monitor 4K Ultra',
                'description' => 'Monitor de 32 pulgadas IPS con resolución 4K HDR',
                'price' => 450.00,
                'stock' => 15
            ],
            [
                'name' => 'Teclado Mecánico RGB',
                'description' => 'Teclado mecánico switches cherry blue con iluminación RGB',
                'price' => 120.00,
                'stock' => 30
            ]
        ];

        foreach ($products as $data) {
            $product = new Product(
                $data['name'],
                $data['price'],
                $data['description'],
                $data['stock']
            );
            $manager->persist($product);
        }

        $manager->flush();
    }
}
