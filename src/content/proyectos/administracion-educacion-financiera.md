---
titulo: Panel administrativo · México y Guatemala
subtitulo: Contenidos, métricas e informes de la plataforma de educación financiera
cliente: Banco Azteca · Grupo Salinas
tipo: cliente
rol: Autor único del panel en ambos países
periodo: Ago 2025 – hoy
estado: En producción
categoria: negocio
sector: Banco Azteca · Fintech
orden: 2
resumen: El panel con el que Banco Azteca opera su plataforma de educación financiera en México y Guatemala. Lo construí desde cero en Filament 5 y lo llevé al segundo país.
problema: Publicar un curso, cambiar un banner o saber cuánta gente estudiaba pasaba por un desarrollador y por consultas a mano en la base de datos.
solucion: Panel en Filament 5 con roles y permisos administrables, escritorio de métricas navegable y exportación a Excel en streaming sobre una sola regla de conteo.
resultado: El cliente opera su propio contenido, y el panel y el Excel no pueden contradecirse. Así salieron a la luz 127 inscripciones huérfanas en Guatemala.
cifras:
  - valor: '~74'
    etiqueta: clases PHP en el panel, todas de mi autoría
  - valor: '114'
    etiqueta: archivos (~6,900 líneas) para llevarlo a Guatemala
  - valor: 127 de 307
    etiqueta: inscripciones huérfanas detectadas en Guatemala
  - valor: '0'
    etiqueta: filas borradas en producción al corregir las cifras infladas
stack:
  - Filament 5
  - Laravel 11
  - PHP 8.5
  - Livewire
  - MySQL 8
  - OpenSpout
  - spatie/laravel-permission
portada: ../../assets/proyectos/administracion-educacion-financiera.webp
portadaAlt: Escritorio del panel administrativo en Filament, con el menú de contenidos, las tarjetas de métricas y la gráfica de inscripciones por año, con las cifras ocultas.
descripcionSeo: Panel administrativo en Filament 5 de la plataforma de educación financiera de Banco Azteca en México y Guatemala. Contenidos, métricas e informes en Excel.
---

## Contexto

Es el panel de la [plataforma de educación financiera de Banco Azteca](/proyectos/plataforma-educacion-financiera/) en **México y Guatemala**, ambas instalaciones en producción. La plataforma ya existía como sitio de cursos; el panel no. Soy el **único autor** del panel en los dos países. Honduras tiene [otro panel](/proyectos/administracion-educacion-financiera-honduras/), construido desde cero con otra tecnología.

## El problema

El sitio tenía el área del alumno y unas pantallas de configuración heredadas y dispersas, pero **no tenía administración de contenidos**. Publicar un curso, cambiar el banner del home o saber cuánta gente estudiaba requería a un desarrollador y consultas a mano en la base de datos.

## Lo que construí

### Administración de contenidos (Filament 5)

Un panel administrativo con **roles y permisos** administrables desde el propio panel. Tiene recursos completos para cursos, módulos, sesiones y lecciones, alumnos, usuarios, certificados, preguntas frecuentes y el carrusel del home. Además hice páginas de configuración a medida (banner de bienvenida, redes sociales) que escriben sobre la tabla que ya consumía el frontend.

- **Ordenar módulos y sesiones arrastrando**, en vez de teclear números de secuencia.
- **Subida de imágenes con validación y medidas recomendadas** en cada campo. Nació de un problema real: los banners se subían con la proporción equivocada y salían deformados en móvil.

### Métricas e informes

- **Escritorio con widgets**: alumnos inscritos, inscripciones a módulos, alumnos con módulos completados, certificados emitidos, inscripciones por año y avance por curso y módulo con el porcentaje de terminación coloreado por umbrales.
- Cada tarjeta es **navegable**: lleva al listado de las personas detrás del número.
- **Exportación a Excel en streaming** con OpenSpout: el informe no se carga en memoria. Es un libro con resumen, base general y una hoja por año.
- La regla «quién cuenta como alumno» vive **en un solo lugar**, compartida por los widgets, el detalle y el exportador, para que el panel y el Excel no puedan contradecirse.

### Llevarlo a Guatemala

México y Guatemala comparten base de código. Porté el panel completo a la instalación de Guatemala: **114 archivos y unas 6,900 líneas**, ya en producción.

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
