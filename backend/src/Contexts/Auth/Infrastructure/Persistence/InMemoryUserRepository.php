<?php

namespace App\Contexts\Auth\Infrastructure\Persistence;

use App\Contexts\Auth\Domain\User;
use App\Contexts\Auth\Domain\UserRepository;

class InMemoryUserRepository implements UserRepository
{
    private array $users = [];

    public function __construct()
    {
        $this->users['admin'] = new User('admin', 'admin123', ['ROLE_ADMIN']);
        $this->users['client'] = new User('client', 'client123', ['ROLE_CLIENT']);
    }

    public function findByUsername(string $username): ?User
    {
        return $this->users[$username] ?? null;
    }
}
