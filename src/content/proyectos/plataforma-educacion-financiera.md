---
titulo: Plataforma de educación financiera
subtitulo: Capa pública, entorno local y despliegue en dos países · México y Guatemala
cliente: Banco Azteca · Grupo Salinas
tipo: cliente
rol: Líder técnico e-learning · desarrollador principal y responsable de despliegue
periodo: Ago 2025 – hoy
estado: En producción
categoria: web
sector: Banco Azteca · Fintech
orden: 1
destacado: true
resumen: La plataforma gratuita de educación financiera de Banco Azteca. Soy su desarrollador principal en México y Guatemala. Rehíce la capa pública, monté el entorno local y la desplegué en un segundo país.
problema: El sitio no se podía levantar fuera del servidor del cliente, los banners se deformaban en móvil, la navegación entre lecciones saltaba de sesión y faltaba desplegar Guatemala.
solucion: Capa pública administrable y responsive, entorno local con Docker Compose, arreglo de las URLs firmadas detrás del balanceador en AWS y despliegue de Guatemala.
resultado: Dos instalaciones en producción, Guatemala puesta en marcha en un servidor compartido sin afectar el servicio, y un proyecto que ya se levanta en local.
cifras:
  - valor: 140 / 184
    etiqueta: commits del repositorio de México son míos
  - valor: '2'
    etiqueta: instalaciones en producción, México y Guatemala
stack:
  - Laravel 11
  - PHP 8.5
  - MySQL 8
  - Blade
  - Bootstrap 5
  - Vite
  - AWS
  - Cloudflare
  - Docker Compose
portada: ../../assets/proyectos/plataforma-educacion-financiera.webp
portadaAlt: Portada pública de la plataforma de educación financiera de Banco Azteca en México, con la invitación a registrarse al diplomado.
descripcionSeo: Caso de estudio de la plataforma de educación financiera de Banco Azteca. Capa pública, entorno local, AWS y despliegue en Guatemala.
---

## Contexto

Es la **plataforma gratuita de educación financiera de Banco Azteca**: cursos en línea con módulos, sesiones, lecciones en video, seguimiento de avance y certificados. Soy el desarrollador principal de la plataforma y de sus instalaciones en **México y Guatemala**, ambas en producción. La tercera, Honduras, tiene [su propio caso de estudio](/proyectos/plataforma-educacion-financiera-honduras/).

Es trabajo de cliente dentro de Grupo Salinas: la plataforma ya existía como sitio de cursos. Lo que le faltaba para operarse y medirse, el panel administrativo, tiene [su propio caso](/proyectos/administracion-educacion-financiera/).

## Lo que construí

### Capa pública

Carrusel del hero administrable (imagen o video), banners por curso, **módulos demo** abiertos a visitantes con registro para continuar, y banners rehechos para que no se deformaran en móvil. También corregí la navegación entre lecciones, que saltaba de sesión en vez de avanzar a la lección siguiente, y el cálculo de avance, que no contemplaba el total de lecciones del módulo.

### Infraestructura y despliegue

- Monté un **entorno local con Docker Compose** que antes no existía, con README y carga del dump. También quité una dependencia del servidor del cliente que impedía levantar el proyecto en local.
- **México en AWS**: diagnostiqué y arreglé un fallo en las URLs firmadas detrás del balanceador de carga. Participé en la arquitectura de desarrollo y producción (load balancer y S3) y en la certificación de la aplicación en **IEECO**, la plataforma interna de certificación de Grupo Salinas.
- **Guatemala a producción**, en un servidor compartido y sin documentación: verifiqué la configuración que servía el sitio antes de tocar nada y lo desplegué sin afectar el servicio. Resolví un bloqueo de `composer` por techos de versión de PHP después de verificar en el histórico que esas dependencias ya estaban instaladas así.

## Cómo lo trabajé

Desarrollo con apoyo de un agente de IA (Claude Code). Yo dirijo cada decisión técnica, reviso los resultados y apruebo cada paso a producción.
