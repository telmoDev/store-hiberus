# Credenciales y Configuración

## 🔑 Usuarios de Prueba

### Administrador
```
Username: admin
Password: admin123
Roles: ROLE_ADMIN, ROLE_USER
```

**Puede:**
- ✅ Ver catálogo de productos
- ✅ Crear nuevos productos
- ✅ Realizar compras
- ✅ Ver sus propios pedidos

### Cliente
```
Username: client
Password: client123
Roles: ROLE_CLIENT, ROLE_USER
```

**Puede:**
- ✅ Ver catálogo de productos
- ✅ Realizar compras
- ✅ Ver sus propios pedidos
- ❌ Crear productos (solo admin)

## 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Aplicación web |
| **Backend API** | http://localhost:8000 | API REST |
| **PostgreSQL** | localhost:5432 | Base de datos |

## 🔧 Variables de Entorno

### Backend (.env.local)

```env
APP_ENV=prod
APP_SECRET=changeme
DATABASE_URL=postgresql://postgres:postgres@db:5432/store
CORS_ALLOW_ORIGIN=^http://localhost:3000$
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🗄️ Base de Datos

### Conexión Directa

```bash
# Usando Docker
docker-compose exec db psql -U postgres -d store

# Desde host (si tienes psql instalado)
psql -h localhost -U postgres -d store
# Password: postgres
```

### Credenciales PostgreSQL

```
Host: localhost
Port: 5432
Database: store
Username: postgres
Password: postgres
```

## 📊 Datos de Prueba

Al iniciar el proyecto, la base de datos se crea automáticamente con las migraciones.

Los usuarios `admin` y `client` están hardcodeados en memoria (InMemoryUserRepository).

## 🔒 Tokens de Autenticación

Los tokens son simulados para facilitar las pruebas:

```
admin-token  -> Usuario admin
client-token -> Usuario client
```

**Ejemplo de uso:**

```bash
curl -H "Authorization: Bearer admin-token" \
  http://localhost:8000/api/v1/products
```

## 🧪 Tokens de Pago (Simulados)

Cualquier string funciona como token de pago:

```
test-token-123
payment-success
demo-payment
```

El gateway de pago siempre retorna éxito.

## ⚠️ Notas Importantes

> **Proyecto de Demostración**: Las credenciales y tokens están simplificados para facilitar la evaluación. En producción se usarían:
> - JWT real (LexikJWTAuthenticationBundle)
> - Password hashing (Symfony PasswordHasher)
> - Usuarios en base de datos (Doctrine)
> - Gateway de pago real (Stripe, PayPal, etc.)
