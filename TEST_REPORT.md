# Reporte de Ejecución de Pruebas Unitarias

**Fecha:** 2025-12-11
**Estado:** ✅ Exitoso

## 🛠️ Entorno de Pruebas

- **PHP Version:** 8.3.28
- **PHPUnit Version:** 12.5.3
- **Framework:** Symfony 7.4
- **Database:** PostgreSQL 16 (Base de datos `store_test`)

## 📊 Resumen de Resultados

| Suite | Tests | Assertions | Estado |
|-------|-------|------------|--------|
| Auth Controller | 2 | 2 | ✅ PASSED |
| Order Controller | 1 | 2 | ✅ PASSED |
| Payment Controller | 1 | 2 | ✅ PASSED |
| Product Controller | 3 | 5 | ✅ PASSED |
| **BATERÍA TOTAL** | **7** | **11** | **✅ 100% PASS** |

## 📝 Detalle de Ejecución

```bash
PHPUnit 12.5.3 by Sebastian Bergmann and contributors.

Runtime:       PHP 8.3.28
Configuration: /var/www/html/phpunit.dist.xml

Auth Controller (App\Tests\Contexts\Auth\Infrastructure\Http\Controller\AuthController)
 ✔ Login success
 ✔ Login failure

Order Controller (App\Tests\Contexts\Order\Infrastructure\Http\Controller\OrderController)
 ✔ Create order

Payment Controller (App\Tests\Contexts\Payment\Infrastructure\Http\Controller\PaymentController)
 ✔ Checkout

Product Controller (App\Tests\Contexts\Product\Infrastructure\Http\Controller\ProductController)
 ✔ Create product
 ✔ Create product without admin role
 ✔ List products

OK (7 tests, 11 assertions)
```


---

Este reporte certifica que el núcleo de la aplicación (Autenticación, Productos, Pedidos, Pagos) funciona correctamente bajo las condiciones probadas.
