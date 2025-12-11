# 🛍️ Store - Sistema de E-commerce con Clean Architecture

> **Proyecto de demostración técnica** - Sistema completo de gestión de pedidos y pagos implementado con **Clean Architecture**, **Symfony 7.4** y **Next.js 16**.

[![Symfony](https://img.shields.io/badge/Symfony-7.4-000000?logo=symfony)](https://symfony.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org/)
[![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?logo=php)](https://www.php.net/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura](#️-arquitectura)
- [Inicio Rápido](#-inicio-rápido-5-minutos)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Guía de Pruebas](#-guía-de-pruebas-para-reclutadores)
- [Testing](#-testing)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## ✨ Características Principales

### Funcionalidades Implementadas

- ✅ **Autenticación y Autorización**
  - Login con roles (Admin/Cliente)
  - Control de acceso basado en roles
  - Persistencia de sesión

- ✅ **Gestión de Productos**
  - Catálogo con búsqueda y filtros
  - Ordenamiento (precio, nombre)
  - Creación de productos (solo Admin)
  - Control de stock en tiempo real

- ✅ **Carrito de Compras**
  - Agregar/eliminar productos
  - Actualizar cantidades
  - Persistencia en localStorage
  - Validación de stock disponible

- ✅ **Gestión de Pedidos**
  - Creación de pedidos desde carrito
  - Visualización de detalles
  - Estados de pedido (PENDING, PAID)
  - Validación de pertenencia

- ✅ **Procesamiento de Pagos**
  - Flujo completo de checkout
  - Simulación de gateway de pago
  - Confirmación de orden

### Aspectos Técnicos Destacados

- 🏛️ **Clean Architecture** en backend y frontend
- 🔒 **CORS** configurado correctamente
- 🐳 **Docker Compose** para deployment
- 🌐 **API REST** con Symfony
- ⚡ **Server-Side Rendering** con Next.js
- 🎨 **UI moderna** con shadcn/ui y Tailwind CSS
- 📝 **TypeScript** en todo el frontend
- 🧪 **Tests unitarios y funcionales**

---

## 🏗️ Arquitectura

### Diagrama General

```
┌─────────────────────────────────────────────────────┐
│          Frontend (Next.js 16 + TypeScript)          │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  Presentation Layer (React Components)     │    │
│  └──────────────────┬─────────────────────────┘    │
│  ┌──────────────────▼─────────────────────────┐    │
│  │  Application Layer (Stores + Hooks)        │    │
│  └──────────────────┬─────────────────────────┘    │
│  ┌──────────────────▼─────────────────────────┐    │
│  │  Infrastructure Layer (HTTP Client)        │    │
│  └──────────────────┬─────────────────────────┘    │
│  ┌──────────────────▼─────────────────────────┐    │
│  │  Domain Layer (Entities + Interfaces)      │    │
│  └────────────────────────────────────────────┘    │
└────────────────────┬─────────────────────────────┘
                     │ HTTP/REST API
┌────────────────────▼─────────────────────────────┐
│          Backend (Symfony 7.4 + PHP 8.2)          │
│                                                    │
│  Contextos Bounded (DDD):                         │
│  ┌──────────┬──────────┬──────────┬──────────┐   │
│  │   Auth   │ Product  │  Order   │ Payment  │   │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┘   │
│       │          │          │          │          │
│  ┌────▼──────────▼──────────▼──────────▼─────┐   │
│  │  Infrastructure (Controllers, Repos)      │   │
│  └────┬──────────────────────────────────────┘   │
│  ┌────▼──────────────────────────────────────┐   │
│  │  Application (Use Cases)                  │   │
│  └────┬──────────────────────────────────────┘   │
│  ┌────▼──────────────────────────────────────┐   │
│  │  Domain (Entities, Value Objects)         │   │
│  └───────────────────────────────────────────┘   │
└────────────────────┬─────────────────────────────┘
                     │ Doctrine ORM
┌────────────────────▼─────────────────────────────┐
│            PostgreSQL 16 Database                 │
└──────────────────────────────────────────────────┘
```

### Principios Aplicados

- **Clean Architecture**: Separación en capas con dependencias hacia el dominio
- **DDD**: Contextos acotados por funcionalidad de negocio
- **SOLID**: Principios de diseño orientado a objetos
- **Dependency Injection**: Inversión de control en ambos lados

---

## 🚀 Inicio Rápido (5 minutos)

### Prerrequisitos

- Docker 20.10+ y Docker Compose 2.0+
- Puertos disponibles: 3000, 8000, 5432

### Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd store

# 2. Levantar todos los servicios
docker-compose up -d --build

# 3. Esperar a que los servicios estén listos (30-60 segundos)
docker-compose logs -f backend

# 4. Cargar datos de prueba (Productos):
   ```bash
   docker-compose exec backend php bin/console doctrine:fixtures:load --no-interaction
   ```

5. ¡Listo! Accede a:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
```

### Verificación

```bash
# Ver estado de los servicios
docker-compose ps

# Deberías ver:
# ✓ store_frontend  (puerto 3000)
# ✓ store_backend   (puerto 9000)
# ✓ store_nginx     (puerto 8000)
# ✓ store_db        (puerto 5432)
```

---

## 🔑 Credenciales de Prueba

### Usuario Administrador
```
Username: admin
Password: admin123
```
**Permisos:**
- Ver catálogo de productos
- Crear nuevos productos
- Realizar compras
- Ver pedidos propios

### Usuario Cliente
```
Username: client
Password: client123
```
**Permisos:**
- Ver catálogo de productos
- Realizar compras
- Ver pedidos propios

---

## 🧪 Guía de Pruebas para Reclutadores

### Flujo Completo de Compra (Cliente)

1. **Login como Cliente**
   - Ir a http://localhost:3000
   - Click en "Entrar"
   - Usuario: `client` / Contraseña: `client123`

2. **Explorar Catálogo**
   - Ver lista de productos
   - Usar búsqueda: buscar "Product"
   - Probar ordenamiento: "Precio ascendente"

3. **Agregar al Carrito**
   - Click en "Añadir al carrito" en varios productos
   - Ver contador del carrito actualizado
   - Click en el ícono del carrito

4. **Revisar Carrito**
   - Verificar productos agregados
   - Cambiar cantidades con +/-
   - Eliminar algún producto
   - Ver total actualizado

5. **Crear Pedido**
   - Click en "Checkout"
   - Verificar resumen del pedido
   - Anotar el Order ID

6. **Procesar Pago**
   - Ingresar cualquier token (ej: "test-token-123")
   - Click en "Realizar Pago"
   - Verificar confirmación de pago exitoso

7. **Ver Detalle del Pedido**
   - Ir a la URL: http://localhost:3000/orders/{ORDER_ID}
   - Verificar items, total y estado "PAID"

### Flujo de Administración (Admin)

1. **Login como Admin**
   - Logout si estás logueado
   - Usuario: `admin` / Contraseña: `admin123`

2. **Crear Producto**
   - Click en "Añadir Producto" en el header
   - Llenar formulario:
     ```
     Nombre: Laptop Gaming
     Precio: 1299.99
     Stock: 10
     Descripción: Laptop de alto rendimiento
     ```
   - Click en "Crear Producto"
   - Verificar que aparece en el catálogo

3. **Realizar Compra como Admin**
   - Agregar productos al carrito
   - Completar flujo de checkout
   - Verificar que funciona igual que cliente
## 🔌 Pruebas de API (Postman)

Se incluye un archivo de colección de Postman listo para usar en la raíz del proyecto: `store_api.postman_collection.json`.

IMPORTANTE: Antes de usar la colección, asegúrate de crear un entorno en Postman con la variable `base_url` apuntando a `http://localhost:8000`, o utiliza las variables de colección predeterminadas.

**Endpoints incluidos:**
1.  **Auth**: Login (Admin y Client) -> Auto-guarda el token.
2.  **Products**: Listar y Crear (Admin).
3.  **Orders**: Crear y Obtener (Client).
4.  **Payment**: Procesar pago de una orden.

### Casos de Prueba Específicos

#### 🔒 Seguridad y Validaciones

**Test 1: Acceso sin autenticación**
```bash
# Intentar crear pedido sin login
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"123","quantity":1}]}'

# Esperado: 401 Unauthorized
```

**Test 2: Cliente no puede crear productos**
- Login como `client`
- Verificar que NO aparece botón "Añadir Producto"
- Intentar acceder a `/products/create` directamente
- Esperado: Redirección o mensaje de error

**Test 3: Validación de stock**
- Agregar producto con stock bajo al carrito
- Intentar agregar más cantidad que el stock disponible
- Esperado: Mensaje "Stock insuficiente"

**Test 4: Validación de pertenencia de pedidos**
```bash
# Login como client, obtener un order ID
# Logout y login como admin
# Intentar acceder al pedido del cliente
# Esperado: "No tienes permiso para ver esta orden"
```

#### 🌐 API REST

**Test 5: Listar productos con filtros**
```bash
# Búsqueda
curl "http://localhost:8000/api/v1/products?search=laptop"

# Ordenamiento
curl "http://localhost:8000/api/v1/products?sort=price_asc"

# Paginación
curl "http://localhost:8000/api/v1/products?page=1&limit=5"
```

**Test 6: CORS configurado**
```bash
# Verificar headers CORS
curl -I -X OPTIONS http://localhost:8000/api/v1/products \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET"

# Esperado: Access-Control-Allow-Origin: http://localhost:3000
```

#### 🎨 Frontend

**Test 7: Persistencia del carrito**
- Agregar productos al carrito
- Refrescar la página (F5)
- Verificar que los productos siguen en el carrito

**Test 8: Responsive design**
- Abrir DevTools (F12)
- Cambiar a vista móvil
- Verificar que la UI se adapta correctamente

**Test 9: Manejo de errores**
- Detener el backend: `docker-compose stop backend nginx`
- Intentar hacer login
- Verificar mensaje de error: "Error de red. Por favor, verifica tu conexión."
- Reiniciar: `docker-compose start backend nginx`

---

## 🧪 Testing

### Backend (Symfony + PHPUnit)

```bash
# Ejecutar todos los tests
docker-compose exec backend php bin/phpunit

# Tests específicos
docker-compose exec backend php bin/phpunit tests/Contexts/Product
docker-compose exec backend php bin/phpunit tests/Contexts/Order

# Con coverage (requiere xdebug)
docker-compose exec backend php bin/phpunit --coverage-html coverage
```

### Tests Disponibles

- ✅ **Unit Tests**: Casos de uso (CreateProduct, CreateOrder, ProcessPayment)
- ✅ **Functional Tests**: Controladores y endpoints
- ✅ **Integration Tests**: Repositorios con base de datos

### Ejemplo de Salida Esperada

```
PHPUnit 12.5.0

.....                                                      5 / 5 (100%)

Time: 00:01.234, Memory: 18.00 MB

OK (5 tests, 15 assertions)
```

---

## 🛠️ Stack Tecnológico

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **PHP** | 8.3 | Lenguaje base |
| **Symfony** | 7.4 | Framework web |
| **Doctrine ORM** | 3.5 | Persistencia |
| **PostgreSQL** | 16 | Base de datos |
| **NelmioCorsBundle** | 2.6 | Manejo de CORS |
| **PHPUnit** | 12.5 | Testing |

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 16 | Framework React |
| **TypeScript** | 5 | Tipado estático |
| **Zustand** | 5 | Estado cliente |
| **TanStack Query** | 5 | Estado servidor |
| **React Hook Form** | 7 | Formularios |
| **Zod** | 3 | Validación |
| **shadcn/ui** | - | Componentes UI |
| **Tailwind CSS** | 3 | Estilos |
| **Axios** | 1 | HTTP client |

### DevOps

- **Docker** & **Docker Compose**: Containerización
- **Nginx**: Reverse proxy para Symfony
- **Git**: Control de versiones

---

## 📁 Estructura del Proyecto

### Backend

```
backend/
├── config/
│   ├── packages/
│   │   ├── doctrine.yaml
│   │   ├── nelmio_cors.yaml
│   │   └── security.yaml
│   └── routes.yaml
├── src/
│   └── Contexts/
│       ├── Auth/
│       │   ├── Application/
│       │   │   └── AuthenticateUser.php
│       │   ├── Domain/
│       │   │   ├── User.php
│       │   │   └── UserRepository.php
│       │   └── Infrastructure/
│       │       ├── Http/Controller/
│       │       ├── Persistence/
│       │       └── Security/
│       ├── Product/
│       │   ├── Application/
│       │   │   ├── CreateProduct.php
│       │   │   └── ListProducts.php
│       │   ├── Domain/
│       │   │   ├── Product.php
│       │   │   └── ProductRepository.php
│       │   └── Infrastructure/
│       ├── Order/
│       │   ├── Application/
│       │   ├── Domain/
│       │   └── Infrastructure/
│       └── Payment/
│           ├── Application/
│           ├── Domain/
│           └── Infrastructure/
└── tests/
    └── Contexts/
```

### Frontend

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Catálogo
│   │   ├── login/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── products/
│   ├── domain/                 # Entidades y contratos
│   │   ├── entities/
│   │   └── repositories/
│   ├── infrastructure/         # Implementaciones
│   │   ├── http/
│   │   └── api/
│   ├── application/            # Lógica de negocio
│   │   ├── stores/            # Zustand stores
│   │   └── hooks/             # TanStack Query hooks
│   └── presentation/           # Componentes React
│       └── components/
│           ├── auth/
│           ├── products/
│           ├── cart/
│           ├── payment/
│           └── layout/
└── public/
```

---

## 🔧 Comandos Útiles

### Docker

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend

# Reiniciar un servicio
docker-compose restart backend

# Detener todo
docker-compose down

# Limpiar volúmenes (reset completo)
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache
```

### Backend

```bash
# Acceder a la consola de Symfony
docker-compose exec backend php bin/console

# Limpiar caché
docker-compose exec backend php bin/console cache:clear

# Ver rutas disponibles
docker-compose exec backend php bin/console debug:router

# Crear migración
docker-compose exec backend php bin/console make:migration

# Ejecutar migraciones
docker-compose exec backend php bin/console doctrine:migrations:migrate
```

### Base de Datos

```bash
# Acceder a PostgreSQL
docker-compose exec db psql -U postgres -d store

# Backup
docker-compose exec db pg_dump -U postgres store > backup.sql

# Restore
docker-compose exec -T db psql -U postgres store < backup.sql
```

---

## 📊 Métricas del Proyecto

- **Líneas de código Backend**: ~2,500
- **Líneas de código Frontend**: ~3,000
- **Tests**: 5 archivos de test
- **Cobertura de tests**: ~60%
- **Endpoints API**: 8
- **Componentes React**: 15+
- **Tiempo de desarrollo**: ~40 horas

---

## 🎯 Decisiones Técnicas

### ¿Por qué Clean Architecture?

- **Mantenibilidad**: Código organizado y fácil de entender
- **Testabilidad**: Lógica de negocio independiente de frameworks
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Profesionalismo**: Patrón reconocido en la industria

### ¿Por qué Symfony + Next.js?

- **Symfony**: Framework maduro, excelente para APIs REST
- **Next.js**: SSR, performance, developer experience
- **Separación**: Backend y frontend independientes

### Limitaciones Conocidas (Proyecto de Demostración)

- 🔒 **Autenticación simplificada**: Tokens hardcodeados (en producción usar JWT)
- 🔒 **Contraseñas**: Comparación directa (en producción usar PasswordHasher)
- 💳 **Gateway de pago**: Simulado (en producción integrar Stripe/PayPal)
- 👥 **Usuarios**: In-memory (en producción usar Doctrine)

> **Nota**: Estas simplificaciones son intencionales para facilitar la evaluación del proyecto. La arquitectura está preparada para implementar soluciones reales.

---

## 📞 Contacto

**Desarrollador**: Telmo Daniel Ramirez Lara  
**Email**: telmodanielramirez@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/telmo-ramirez-lara-803b67180/  
**GitHub**: https://github.com/telmoDev

---

## 📝 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

**¿Preguntas?** Abre un issue en el repositorio o contáctame directamente.

**¡Gracias por revisar este proyecto!** 🚀
