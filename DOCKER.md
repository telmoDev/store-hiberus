# Docker Deployment Guide

## Prerequisites
- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)

## Quick Start

### 1. Configure Environment Variables
```bash
cp .env.docker .env
# Edit .env with your configuration
```

### 2. Build and Start Services
```bash
docker-compose up -d --build
```

### 3. Run Database Migrations
```bash
docker-compose exec backend php bin/console doctrine:migrations:migrate
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Database**: localhost:5432

## Services

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| frontend | store_frontend | 3000 | Next.js application |
| backend | store_backend | 9000 | Symfony API (PHP-FPM) |
| nginx | store_nginx | 8000 | Nginx reverse proxy for backend |
| db | store_db | 5432 | PostgreSQL database |

## Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes
```bash
docker-compose down -v
```

### Rebuild Specific Service
```bash
docker-compose up -d --build frontend
```

### Execute Commands in Containers
```bash
# Backend console
docker-compose exec backend php bin/console

# Database access
docker-compose exec db psql -U postgres -d store
```

## Development vs Production

### Development
The current setup mounts volumes for hot-reload:
```yaml
volumes:
  - ./backend:/var/www/html
```

### Production
For production, remove volume mounts and use built images only.

## Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` in frontend environment
- Ensure nginx service is running: `docker-compose ps`

### Database connection errors
- Wait for database health check: `docker-compose logs db`
- Verify DATABASE_URL in backend environment

### Permission issues
```bash
docker-compose exec backend chown -R www-data:www-data /var/www/html/var
```

## Network Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌──────────┐  ┌──────────┐
│ Frontend │  │  Nginx   │
│  :3000   │  │  :8000   │
└──────────┘  └─────┬────┘
                    │
                    ▼
              ┌──────────┐
              │ Backend  │
              │ PHP-FPM  │
              └─────┬────┘
                    │
                    ▼
              ┌──────────┐
              │    DB    │
              │  :5432   │
              └──────────┘
```

## Health Checks

All services include health checks:
- **Database**: PostgreSQL ready check
- **Backend**: PHP-FPM process check
- **Frontend**: HTTP response check

## Data Persistence

Volumes for persistent data:
- `postgres_data`: Database files
- `backend_var`: Symfony cache and logs
