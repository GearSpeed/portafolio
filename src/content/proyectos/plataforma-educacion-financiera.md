---
titulo: Plataforma de educación financiera
subtitulo: Panel administrativo, métricas e informes · México y Guatemala
cliente: Banco Azteca · Grupo Salinas
tipo: cliente
rol: Líder técnico e-learning · desarrollador principal y responsable de despliegue
periodo: Ago 2025 – hoy
estado: En producción
categoria: web
sector: Banco Azteca · Fintech
orden: 1
destacado: true
resumen: La plataforma gratuita de educación financiera de Banco Azteca no tenía administración de contenidos ni métricas. Construí su panel administrativo, su sistema de informes y la desplegué en un segundo país.
problema: No había panel ni métricas. Publicar un curso, cambiar un banner o saber cuánta gente estudiaba pasaba por un desarrollador y por la base de datos a mano.
solucion: Panel administrativo desde cero en Filament 5 con permisos por rol, dashboard navegable y exportación a Excel en streaming sobre una sola regla de conteo.
resultado: El cliente opera su propio contenido, panel e informe no pueden contradecirse, y Guatemala quedó en producción en un servidor compartido sin afectar el servicio.
cifras:
  - valor: 140 / 184
    etiqueta: commits del repositorio de México son míos
  - valor: 127 de 307
    etiqueta: inscripciones huérfanas detectadas en Guatemala
  - valor: '0'
    etiqueta: filas borradas en producción al corregir las cifras infladas
stack:
  - Laravel 11
  - Filament 5
  - PHP 8.5
  - MySQL 8
  - Livewire
  - Blade
  - OpenSpout
  - spatie/laravel-permission
  - AWS
  - Cloudflare
  - Docker Compose
portada: ../../assets/proyectos/plataforma-educacion-financiera.webp
portadaAlt: Portada pública de la plataforma de educación financiera de Banco Azteca en México, con la invitación a registrarse al diplomado.
descripcionSeo: Caso de estudio de la plataforma de educación financiera de Banco Azteca. Panel administrativo en Filament, métricas, informes y despliegue en Guatemala.
---

## Contexto

Es la **plataforma gratuita de educación financiera de Banco Azteca**: cursos en línea con módulos, sesiones, lecciones en video, seguimiento de avance y certificados. Soy el desarrollador principal de la plataforma y de sus instalaciones en **México y Guatemala**, ambas en producción. La tercera, Honduras, tiene [su propio caso de estudio](/proyectos/plataforma-educacion-financiera-honduras/) porque su panel es otro sistema.

Es trabajo de cliente dentro de Grupo Salinas: la plataforma ya existía como sitio de cursos. Lo mío fue lo que le faltaba para operarse y medirse.

## El problema

El sitio tenía el área del alumno y unas pantallas de configuración heredadas y dispersas, pero **no tenía administración de contenidos**. Publicar un curso, cambiar el banner del home o saber cuánta gente estudiaba requería a un desarrollador y consultas a mano en la base de datos.

## Lo que construí

### Panel administrativo (Filament 5)

Un panel administrativo con **roles y permisos** administrables desde el propio panel. Tiene recursos completos para cursos, módulos, sesiones y lecciones, alumnos, usuarios, certificados, preguntas frecuentes y el carrusel del home. Además hice páginas de configuración a medida (banner de bienvenida, redes sociales) que escriben sobre la tabla que ya consumía el frontend.

- **Ordenar módulos y sesiones arrastrando**, en vez de teclear números de secuencia.
- **Subida de imágenes con validación y medidas recomendadas** en cada campo. Nació de un problema real: los banners se subían con la proporción equivocada y salían deformados en móvil.

### Métricas e informes

- **Escritorio con widgets**: alumnos inscritos, inscripciones a módulos, alumnos con módulos completados, certificados emitidos, inscripciones por año y avance por curso y módulo con el porcentaje de terminación coloreado por umbrales.
- Cada tarjeta es **navegable**: lleva al listado de las personas detrás del número.
- **Exportación a Excel en streaming** con OpenSpout: el informe no se carga en memoria. Es un libro con resumen, base general y una hoja por año.
- La regla «quién cuenta como alumno» vive **en un solo lugar**, compartida por los widgets, el detalle y el exportador, para que el panel y el Excel no puedan contradecirse.

### Capa pública

Carrusel del hero administrable (imagen o video), banners por curso, **módulos demo** abiertos a visitantes con registro para continuar, y banners rehechos para que no se deformaran en móvil. También corregí la navegación entre lecciones, que saltaba de sesión en vez de avanzar a la lección siguiente, y el cálculo de avance, que no contemplaba el total de lecciones del módulo.

### Infraestructura y despliegue

- Monté un **entorno local con Docker Compose** que antes no existía, con README y carga del dump. También quité una dependencia del servidor del cliente que impedía levantar el proyecto en local.
- **México en AWS**: diagnostiqué y arreglé un fallo en las URLs firmadas detrás del balanceador de carga. Participé en la arquitectura de desarrollo y producción (load balancer y S3) y en la certificación de la aplicación en **IEECO**, la plataforma interna de certificación de Grupo Salinas.
- **Guatemala a producción**, en un servidor compartido y sin documentación: verifiqué la configuración que servía el sitio antes de tocar nada y lo desplegué sin afectar el servicio. Resolví un bloqueo de `composer` por techos de versión de PHP después de verificar en el histórico que esas dependencias ya estaban instaladas así.

## El informe tenía razón

Ya en producción, el panel de Guatemala decía **69 alumnos y 125 inscritos**, pero el Excel sacaba **3 filas**. No ajusté el número para que cuadrara: fui a buscar por qué.

La base arrastraba **filas huérfanas**: inscripciones, certificados y roles que apuntaban a usuarios borrados físicamente sin limpiar sus tablas relacionadas. Los widgets contaban sobre las tablas pivote sin comprobar que la persona existiera y sumaban fantasmas. El informe pasaba por la tabla de usuarios y por eso solo veía a los reales.

| Tabla | Total | Huérfanas |
| --- | --- | --- |
| Inscripciones | 307 | 127 |
| Certificados | 42 | 20 |

Había además un problema de fondo: **solo 3 de 94 usuarios tenían rol asignado** mientras 79 estaban inscritos. Cualquier informe filtrado por rol saldría vacío por diseño.

Lo resolví centralizando la regla de conteo **sin borrar nada en producción**: las filas huérfanas se ignoran, no se eliminan. Verifiqué cada cifra contra SQL directo antes de desplegar, y llevé al cliente las dos causas de raíz (nadie asigna el rol y se borran usuarios sin limpiar sus datos) en vez de dejarlas tapadas por el arreglo.

## Cómo lo trabajé

Desarrollo con apoyo de un agente de IA (Claude Code). Yo dirijo cada decisión técnica, reviso los resultados y apruebo cada paso a producción.
