# Modelo de Datos - Sistema de E-commerce

Este documento describe el modelo de datos utilizado en el proyecto, incluyendo entidades, relaciones y esquema de base de datos.

## 📊 Diagrama Entidad-Relación

```
┌─────────────────┐
│     Product     │
│─────────────────│
│ id (UUID)       │
│ name            │
│ description     │
│ price           │
│ stock           │
│ createdAt       │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│   OrderItem     │
│─────────────────│
│ id (UUID)       │
│ productId       │◄──┐
│ productName     │   │ Snapshot
│ price           │   │ del producto
│ quantity        │   │ al momento
│ orderId         │   │ de la compra
└────────┬────────┘   │
         │            │
         │ N:1        │
         │            │
┌────────▼────────┐   │
│     Order       │   │
│─────────────────│   │
│ id (UUID)       │   │
│ clientId        │   │
│ status          │   │
│ total           │   │
│ createdAt       │   │
└─────────────────┘   │
                      │
                      │
         ┌────────────┘
         │
         │ Referencia
         │
┌────────▼────────┐
│  User (Memory)  │
│─────────────────│
│ username        │
│ password        │
│ roles[]         │
└─────────────────┘
```

## 🗃️ Entidades

### 1. Product

**Descripción**: Representa un producto en el catálogo.

**Tabla**: `products`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `name` | VARCHAR(255) | NOT NULL | Nombre del producto |
| `description` | TEXT | NOT NULL | Descripción detallada |
| `price` | DECIMAL(10,2) | NOT NULL | Precio unitario |
| `stock` | INTEGER | NOT NULL | Cantidad disponible |
| `created_at` | TIMESTAMP | NOT NULL | Fecha de creación |

**Índices**:
- PRIMARY KEY: `id`
- INDEX: `name` (para búsquedas)

**Ejemplo**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Laptop Gaming",
  "description": "Laptop de alto rendimiento para gaming",
  "price": 1299.99,
  "stock": 10,
  "createdAt": "2025-12-11T10:00:00Z"
}
```

---

### 2. Order

**Descripción**: Representa un pedido realizado por un cliente.

**Tabla**: `orders`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `client_id` | VARCHAR(255) | NOT NULL | Username del cliente |
| `status` | VARCHAR(50) | NOT NULL | Estado del pedido |
| `total` | DECIMAL(10,2) | NOT NULL | Total del pedido |
| `created_at` | TIMESTAMP | NOT NULL | Fecha de creación |

**Estados posibles**:
- `PENDING`: Pedido creado, pendiente de pago
- `PAID`: Pedido pagado exitosamente

**Índices**:
- PRIMARY KEY: `id`
- INDEX: `client_id` (para consultas por usuario)
- INDEX: `status` (para filtros)

**Ejemplo**:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "clientId": "client",
  "status": "PAID",
  "total": 2599.98,
  "createdAt": "2025-12-11T11:30:00Z"
}
```

---

### 3. OrderItem

**Descripción**: Representa un producto dentro de un pedido (línea de pedido).

**Tabla**: `order_items`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `order_id` | UUID | FK, NOT NULL | Referencia al pedido |
| `product_id` | UUID | NOT NULL | ID del producto |
| `product_name` | VARCHAR(255) | NOT NULL | Nombre del producto (snapshot) |
| `price` | DECIMAL(10,2) | NOT NULL | Precio unitario (snapshot) |
| `quantity` | INTEGER | NOT NULL | Cantidad comprada |

**Relaciones**:
- `order_id` → `orders.id` (ON DELETE CASCADE)

**Índices**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `order_id`
- INDEX: `product_id`

**Ejemplo**:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "orderId": "660e8400-e29b-41d4-a716-446655440001",
  "productId": "550e8400-e29b-41d4-a716-446655440000",
  "productName": "Laptop Gaming",
  "price": 1299.99,
  "quantity": 2
}
```

> **Nota**: `product_name` y `price` son snapshots (copias) del producto al momento de la compra, para mantener el historial incluso si el producto cambia o se elimina.

---

### 4. User (In-Memory)

**Descripción**: Representa un usuario del sistema. **No persiste en base de datos**, está en memoria.

**Ubicación**: `InMemoryUserRepository.php`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `username` | string | Identificador único del usuario |
| `password` | string | Contraseña (texto plano en demo) |
| `roles` | array | Roles del usuario |

**Roles disponibles**:
- `ROLE_USER`: Rol base (todos los usuarios)
- `ROLE_CLIENT`: Cliente que puede comprar
- `ROLE_ADMIN`: Administrador con permisos especiales

**Usuarios predefinidos**:
```php
[
    'admin' => new User('admin', 'admin123', ['ROLE_ADMIN']),
    'client' => new User('client', 'client123', ['ROLE_CLIENT'])
]
```

---

## 🔗 Relaciones

### Order ↔ OrderItem (1:N)

- Un pedido puede tener múltiples items
- Cada item pertenece a un solo pedido
- Relación bidireccional en Doctrine

```php
// Order.php
#[ORM\OneToMany(targetEntity: OrderItem::class, mappedBy: 'order', cascade: ['persist'])]
private Collection $items;

// OrderItem.php
#[ORM\ManyToOne(targetEntity: Order::class, inversedBy: 'items')]
#[ORM\JoinColumn(nullable: false)]
private Order $order;
```

### Product ↔ OrderItem (Referencia)

- Un producto puede estar en múltiples items de pedidos
- **No hay relación directa en base de datos**
- Se guarda el `product_id` como referencia
- Se hace snapshot de `name` y `price` para historial

---

## 📐 Esquema SQL

### Tabla: products

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_name ON products(name);
```

### Tabla: orders

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### Tabla: order_items

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    CONSTRAINT fk_order_items_order 
        FOREIGN KEY (order_id) 
        REFERENCES orders(id) 
        ON DELETE CASCADE
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

---

## 🎯 Decisiones de Diseño

### 1. UUIDs como Primary Keys

**Ventajas**:
- Únicos globalmente
- No revelan información de secuencia
- Fácil distribución/replicación
- Mejor para microservicios

**Implementación**:
```php
use Symfony\Component\Uid\Uuid;

#[ORM\Id]
#[ORM\Column(type: 'uuid', unique: true)]
private Uuid $id;

public function __construct() {
    $this->id = Uuid::v4();
}
```

### 2. Snapshot Pattern en OrderItem

**Problema**: Si un producto cambia de precio o se elimina, ¿cómo mantener el historial?

**Solución**: Guardar copia de `name` y `price` al momento de la compra.

```php
public function __construct(Uuid $productId, string $productName, float $price, int $quantity)
{
    $this->id = Uuid::v4();
    $this->productId = $productId;
    $this->productName = $productName; // Snapshot
    $this->price = $price;             // Snapshot
    $this->quantity = $quantity;
}
```

### 3. Cálculo de Total en Order

El total se calcula sumando todos los items:

```php
public function getTotal(): float
{
    return array_reduce(
        $this->items->toArray(),
        fn($carry, $item) => $carry + ($item->getPrice() * $item->getQuantity()),
        0.0
    );
}
```

### 4. Soft Deletes (No implementado)

Actualmente no hay soft deletes. En producción se podría agregar:

```php
#[ORM\Column(type: 'datetime', nullable: true)]
private ?\DateTimeInterface $deletedAt = null;
```

---

## 🔄 Migraciones

Las migraciones se encuentran en `backend/migrations/`:

1. **Version20251210211005**: Tabla `products`
2. **Version20251210212442**: Tabla `orders`
3. **Version20251210213003**: Tabla `order_items`
4. **Version20251210213807**: Ajustes de relaciones
5. **Version20251211023152**: Últimos ajustes

**Ejecutar migraciones**:
```bash
docker-compose exec backend php bin/console doctrine:migrations:migrate
```

---

## 📊 Datos de Ejemplo

### Producto
```json
{
  "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
  "name": "Mouse Gamer RGB",
  "description": "Mouse ergonómico con iluminación RGB",
  "price": 49.99,
  "stock": 25,
  "createdAt": "2025-12-11T10:00:00Z"
}
```

### Pedido Completo
```json
{
  "id": "f1e2d3c4-b5a6-4c7d-8e9f-0a1b2c3d4e5f",
  "clientId": "client",
  "status": "PAID",
  "total": 149.97,
  "createdAt": "2025-12-11T12:00:00Z",
  "items": [
    {
      "id": "1a2b3c4d-5e6f-4a5b-8c9d-0e1f2a3b4c5d",
      "productId": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      "productName": "Mouse Gamer RGB",
      "price": 49.99,
      "quantity": 3
    }
  ]
}
```

---

## 🔍 Consultas Comunes

### Obtener productos con stock disponible
```sql
SELECT * FROM products WHERE stock > 0 ORDER BY name;
```

### Obtener pedidos de un cliente
```sql
SELECT * FROM orders WHERE client_id = 'client' ORDER BY created_at DESC;
```

### Obtener items de un pedido
```sql
SELECT * FROM order_items WHERE order_id = 'f1e2d3c4-b5a6-4c7d-8e9f-0a1b2c3d4e5f';
```

### Productos más vendidos
```sql
SELECT 
    oi.product_id,
    oi.product_name,
    SUM(oi.quantity) as total_sold
FROM order_items oi
GROUP BY oi.product_id, oi.product_name
ORDER BY total_sold DESC
LIMIT 10;
```

---

## 🎓 Notas Técnicas

### Doctrine ORM

El proyecto usa Doctrine ORM para mapear entidades a tablas:

- **Annotations/Attributes**: PHP 8 attributes para metadata
- **Repository Pattern**: Cada entidad tiene su repositorio
- **Unit of Work**: Doctrine gestiona el ciclo de vida
- **Lazy Loading**: Relaciones se cargan bajo demanda

### Validaciones

- **Stock**: Se valida antes de crear pedido
- **Precios**: Siempre DECIMAL(10,2) para precisión
- **UUIDs**: Validación automática por Symfony
- **Estados**: Enum-like con strings validados

---

**Última actualización**: 2025-12-11
