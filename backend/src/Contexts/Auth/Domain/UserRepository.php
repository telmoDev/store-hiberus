<?php

namespace App\Contexts\Auth\Domain;

interface UserRepository
{
    public function findByUsername(string $username): ?User;
}
