<?php

namespace App\Contexts\Auth\Infrastructure\Http\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/v1/auth')]
class AuthController extends AbstractController
{
    public function __construct(
        private \App\Contexts\Auth\Application\AuthenticateUser $authenticateUser
    ) {}

    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        $user = ($this->authenticateUser)($username, $password);

        if (!$user) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        $token = in_array('ROLE_ADMIN', $user->getRoles()) ? 'admin-token' : 'client-token';

        return $this->json([
            'token' => $token,
            'user' => [
                'username' => $user->getUserIdentifier(),
                'roles' => $user->getRoles()
            ]
        ]);
    }
}
