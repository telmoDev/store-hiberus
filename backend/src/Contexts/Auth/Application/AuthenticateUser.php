<?php

namespace App\Contexts\Auth\Application;

use App\Contexts\Auth\Domain\UserRepository;
use App\Contexts\Auth\Domain\User;

class AuthenticateUser
{
    public function __construct(private UserRepository $userRepository)
    {
    }

    public function __invoke(string $username, string $password): ?User
    {
        $user = $this->userRepository->findByUsername($username);

        if (!$user) {
            return null;
        }

        if ($user->getPassword() !== $password) {
            return null;
        }

        return $user;
    }
}
