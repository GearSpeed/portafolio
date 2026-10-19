---
titulo: Una vez más · Gestión
subtitulo: Inventario, ventas y finanzas para un negocio real de repostería
cliente: Negocio de galletas y repostería en México
tipo: propio
rol: Product Owner y Full-Stack Developer
periodo: Sep 2026 – hoy
estado: En producción · uso diario
categoria: negocio
sector: Retail · Repostería
orden: 5
destacado: false
resumen: Un negocio real operaba compras, inventario y ventas en un Excel. Lo llevé en pocas semanas a un sistema web en producción que usan a diario el dueño y sus vendedoras.
problema: Todo vivía en un Excel sin usuarios ni permisos. No se sabía cuánta mercancía traía cada vendedora y la utilidad real no se veía.
solucion: Monorepo tipado (Angular 22, NestJS, Drizzle, PostgreSQL 18) con un paquete compartido que hace todas las cuentas de dinero con decimal exacto.
resultado: Inventario por ubicación, punto de venta móvil y reportes financieros en producción, con más de 300 pruebas y WCAG 2.1 AA en cada pantalla.
cifras:
  - valor: 300+
    etiqueta: pruebas automatizadas (170+ de integración y 88 E2E)
  - valor: ~17,500
    etiqueta: líneas de TypeScript sin contar pruebas
  - valor: '27'
    etiqueta: migraciones de base de datos con permisos escritos a mano
stack:
  - Angular 22
  - NestJS
  - Drizzle ORM
  - PostgreSQL 18
  - Zod
  - big.js
  - Docker Compose
  - Cloudflare Tunnel
  - Cloudflare Access
  - Cloudflare R2
  - GitHub Actions
  - Vitest
  - Testcontainers
  - Playwright
portada: ../../assets/proyectos/una-vez-mas.webp
portadaAlt: Pantalla de inicio del sistema de gestión de Una vez más, con accesos rápidos, resumen de ventas y productos por agotarse; las cifras están ocultas.
descripcionSeo: Caso de estudio de Una vez más, un sistema de inventario, ventas y finanzas en producción para un negocio real de repostería. Angular 22, NestJS, PostgreSQL y Cloudflare.
---

## Contexto

**Una vez más** es un negocio real de galletas y repostería en México. Llevaba compras, inventario y ventas en un Excel: no había usuarios ni permisos, no se sabía cuánta mercancía traía cada vendedora y la utilidad real no se veía.

Lo diseñé, construí, desplegué y lo opero. El primer commit es del 21 de septiembre de 2026, y en pocas semanas el sistema ya estaba **en producción**, usado a diario por el dueño y sus vendedoras. Conserva las reglas de cálculo del Excel, como la gasolina de cada compra repartida entre las piezas, y agrega lo que faltaba.

## Funcionalidades

- **Compras**: cada compra es un viaje a un proveedor, con el costo de la gasolina prorrateado por pieza.
- **Inventario por ubicación**: el almacén y una ubicación por vendedora, con traspasos, mermas, ajustes, conteo físico y un **kardex inmutable** de movimientos.
- **Costo promedio ponderado móvil** por producto: la utilidad de cada venta se calcula con el costo que tenía el producto en ese momento.
- **Punto de venta móvil**: la vendedora cobra desde su celular, solo con la mercancía que trae, con pagos mixtos (efectivo, transferencia y tarjeta). La comisión de la terminal se calcula sola.
- **Cobro por transferencia**: la CLABE se valida con su dígito verificador y la vendedora puede mostrar el QR bancario en pantalla.
- **Devoluciones** con reembolso parcial, incluida la parte de la comisión que regresa la terminal.
- **Comisiones de vendedoras** sobre la utilidad, con saldo por pagar y registro de pagos.
- **Finanzas**: gastos por categoría, aportaciones y retiros de socios contados aparte de la utilidad, estado de resultados y «Dónde está el dinero», el saldo por bolsa.
- **Reportes** por día, producto, vendedora, canal y método de pago; corte de caja; simulador de precio; exportación a CSV y a Excel con gráficas.
- **Catálogo con IA**: fotos procesadas en el servidor (redimensionadas y sin metadatos GPS) y fichas de producto generadas con la API de OpenAI.
- **[Sitio web público](/proyectos/una-vez-mas-sitio-web/)** alimentado por una API de solo lectura y cacheada, que publica la disponibilidad (disponible, últimas piezas, agotado), nunca las existencias exactas.

## Un modelo contable correcto

Lo más delicado del proyecto no es la interfaz sino que los números cuadren. El modelo cubre el costo promedio ponderado, el prorrateo de gasolina, las comisiones de terminal y de vendedoras, las devoluciones parciales, el capital de socios separado de la utilidad y los saldos por bolsa de dinero.

Todas las cuentas de dinero viven en un **paquete compartido** y se hacen con **decimal exacto** (big.js, nunca `number`). La API y el frontend llaman a las mismas funciones, así que siempre dan el mismo número. El modelo está probado contra los números del Excel original.

## Arquitectura

- **Monorepo** con npm workspaces y TypeScript estricto de punta a punta.
- **Backend**: NestJS, Drizzle ORM y PostgreSQL 18, con validación con Zod, errores estructurados en español e **idempotencia** en todos los documentos (ventas, compras y gastos).
- **Frontend**: Angular 22 con componentes standalone, signals, `httpResource` y OnPush, y Angular Material 3 con tema propio. Está pensado primero para el celular.
- **Infraestructura**: Docker Compose en un VPS. **Cloudflare Tunnel** evita que la app abra puertos a internet, **Cloudflare Access** hace de login (la API valida su JWT) y **R2** guarda las imágenes y los respaldos.
- **CI/CD**: GitHub Actions corre lint y pruebas y construye una imagen etiquetada por commit en GHCR. Se despliega por **SHA exacto**, nunca `latest`, con migraciones automáticas al arrancar.

## Seguridad y datos

- **Defensa en capas**: Cloudflare Access para entrar y permisos por rol con un guard que **niega por omisión** toda ruta que no declare su permiso. La API filtra costos y márgenes según el rol: un vendedor nunca los recibe.
- **Tres roles de Postgres separados** (dueño, app y lectura del sitio). La app no puede borrar ni reescribir el kardex, y los permisos van en migraciones escritas a mano.
- **El sitio público nunca toca la base de datos.** Descarté a propósito exponer Postgres por el túnel.
- **Respaldos diarios** con `pg_dump`, cifrados con rclone crypt en un bucket con retención bloqueada, y con un procedimiento de restauración probado.
- **Bitácora de auditoría** de los cambios sensibles y servidor endurecido: SSH solo con llave, fail2ban y firewall que niega por omisión.

## Calidad

| Tipo | Herramienta | Alcance |
| --- | --- | --- |
| Unitarias | Vitest | Los tres paquetes del monorepo |
| Integración | Testcontainers | 170+ pruebas de la API contra PostgreSQL 18 real |
| End-to-end | Playwright | 88 pruebas, en escritorio y celular |
| Accesibilidad | axe | WCAG 2.1 AA en cada pantalla, como requisito |

## Cómo lo trabajé

Soy el dueño del producto: decido qué se construye y en qué orden. Desarrollo con apoyo de un agente de IA (Claude Code) y apruebo cada paso a producción.
