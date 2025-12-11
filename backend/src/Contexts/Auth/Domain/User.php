<?php

namespace App\Contexts\Auth\Domain;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserIdentifier;

class User implements UserInterface
{
    public function __construct(
        private string $username,
        private string $password,
        private array $roles = []
    ) {}

    public function getUserIdentifier(): string
    {
        return $this->username;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function eraseCredentials(): void
    {
    }
}
