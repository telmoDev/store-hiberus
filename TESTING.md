# 🧪 Guía de Testing

Esta guía detalla cómo ejecutar y evaluar los tests del proyecto.

## Backend Tests (PHPUnit)

### Ejecutar Todos los Tests

```bash
# Con Docker
docker-compose exec backend php bin/phpunit

# Sin Docker
cd backend
php bin/phpunit
```

### Tests por Contexto

```bash
# Tests de Products
docker-compose exec backend php bin/phpunit tests/Contexts/Product

# Tests de Orders
docker-compose exec backend php bin/phpunit tests/Contexts/Order

# Tests de Payment
docker-compose exec backend php bin/phpunit tests/Contexts/Payment
```

### Tests Específicos

```bash
# Un archivo específico
docker-compose exec backend php bin/phpunit tests/Contexts/Product/Application/CreateProductTest.php

# Un método específico
docker-compose exec backend php bin/phpunit --filter testCreateProductSuccessfully
```

### Coverage Report

```bash
# Generar reporte HTML (requiere xdebug)
docker-compose exec backend php bin/phpunit --coverage-html coverage

# Ver reporte
open backend/coverage/index.html
```

## Tests Disponibles

### ✅ Unit Tests

- **CreateProductTest**: Validación de creación de productos
- **CreateOrderTest**: Validación de creación de órdenes con stock
- **ProcessPaymentTest**: Validación de procesamiento de pagos

### ✅ Functional Tests

- **ProductControllerTest**: Endpoints de productos
- **OrderControllerTest**: Endpoints de órdenes

## Salida Esperada

```
PHPUnit 12.5.0

Testing Product Context
.....                                                      5 / 5 (100%)

Testing Order Context  
...                                                        3 / 3 (100%)

Time: 00:01.234, Memory: 18.00 MB

OK (8 tests, 24 assertions)
```

## Casos de Prueba Importantes

### 1. Validación de Stock
```php
// CreateOrderTest.php
testInsufficientStock() // Debe lanzar DomainException
```

### 2. Validación de Roles
```php
// ProductControllerTest.php
testOnlyAdminCanCreateProducts() // Debe retornar 403 para clientes
```

### 3. Validación de Pertenencia
```php
// OrderControllerTest.php
testUserCanOnlyViewOwnOrders() // Debe retornar 403 para órdenes ajenas
```

## Debugging Tests

```bash
# Modo verbose
docker-compose exec backend php bin/phpunit -v

# Modo muy verbose
docker-compose exec backend php bin/phpunit -vv

# Con stack trace completo
docker-compose exec backend php bin/phpunit --debug
```

## CI/CD

Los tests se ejecutan automáticamente en cada push (si tienes GitHub Actions configurado).

Ver archivo `.github/workflows/tests.yml` para más detalles.
