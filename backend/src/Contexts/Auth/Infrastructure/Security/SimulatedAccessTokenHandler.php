<?php

namespace App\Contexts\Auth\Infrastructure\Security;

use App\Contexts\Auth\Domain\User;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class SimulatedAccessTokenHandler implements AccessTokenHandlerInterface
{
    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        if ($accessToken === 'admin-token') {
            return new UserBadge('admin');
        }

        if ($accessToken === 'client-token') {
            return new UserBadge('client');
        }

        throw new \Exception('Invalid token');
    }
}
