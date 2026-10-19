---
titulo: Plataforma de educación financiera · Honduras
subtitulo: Diagnóstico de un sistema heredado y un requisito de la CNBS
cliente: Banco Azteca Honduras · UCENM y UCRISH
tipo: cliente
rol: Desarrollador único y responsable de despliegue
periodo: 2026 – hoy
estado: En producción
categoria: web
sector: Banco Azteca Honduras · Fintech
orden: 3
destacado: true
resumen: La instalación hondureña de la plataforma, un diplomado para alumnos de UCENM y UCRISH. Reparé fallas que llevaban años sin detectarse e implementé un requisito de la CNBS.
problema: Un sistema heredado sin pruebas, con fallas que llevaban años ocultas y un requisito nuevo del regulador bancario hondureño (CNBS).
solucion: Diagnóstico medido de cada falla antes de tocar código y una Evaluación de Impacto con candado en el servidor, pensada para el celular.
resultado: Recuperación de contraseña operativa de nuevo y 151 egresados invitados a la evaluación sin un solo fallo.
cifras:
  - valor: 95 s → 0.17 s
    etiqueta: recuperación de contraseña, rota desde 2020
  - valor: '151'
    etiqueta: egresados invitados a la evaluación de la CNBS, sin fallos
  - valor: 8 → 2 vCPU
    etiqueta: servidor recomendado tras medir quince días de registros
stack:
  - Laravel 11
  - PHP 8.5
  - Blade
  - MariaDB
  - AWS EC2
  - Apache
portada: ../../assets/proyectos/plataforma-educacion-financiera-honduras.webp
portadaAlt: Portada pública de la plataforma de educación financiera en Honduras, con su oferta de cursos de finanzas personales en línea.
descripcionSeo: Plataforma de educación financiera de Banco Azteca en Honduras. Diagnóstico de un sistema heredado y un requisito de la CNBS implementado de principio a fin.
---

## Contexto

Honduras es la tercera instalación de la [plataforma de educación financiera de Banco Azteca](/proyectos/plataforma-educacion-financiera/): un diplomado en línea de educación financiera para alumnos de universidades locales (**UCENM** y **UCRISH**), con módulos, lecciones, constancias por módulo y diploma final. Tiene unas 500 cuentas. Soy el **único desarrollador** del sitio.

Es un sistema heredado: código con años encima, sin pruebas, con fragmentos comentados y decisiones acumuladas de varios autores. El trabajo se reparte en tres frentes: reparar fallas reales, construir el panel que no existía e implementar requisitos del regulador. El panel, hecho desde cero en NestJS y Angular, tiene [su propio caso de estudio](/proyectos/administracion-educacion-financiera-honduras/).

## Evaluación de Impacto: un requisito de la CNBS

La Comisión Nacional de Bancos y Seguros exige medir el impacto del programa. Implementé el cuestionario completo de 14 preguntas como un **asistente de tres pasos a pantalla completa**, pensado para el celular, que es donde estudia la mayoría. Guarda el avance en cada paso para que nadie pierda lo contestado.

- **El candado vive en el servidor, no en la pantalla.** Sin evaluación contestada no se emite el diploma. Una ventana se cierra con Escape; una condición en la emisión del diploma no. Los tres puntos del código que emiten diplomas consultan la misma verificación.
- **Se activa por curso** con una columna de configuración, no con un identificador escrito en el código.
- El cuestionario vive **en un solo archivo**, del que salen la pantalla, la validación de cada paso y la exportación.
- **Antes de programarlo, audité el instrumento** que envió la institución. Encontré rangos de edad traslapados, un hueco entre dos rangos de ingreso y una pregunta cuya escala no correspondía a lo que preguntaba. Los documenté, propuse las correcciones y la institución las aceptó.

Para alcanzar a los **151 egresados** anteriores a la evaluación, a quienes el candado ya no alcanzaba, escribí un comando de invitación por correo con modo de simulación, envío de prueba y registro de a quién se invitó, para que repetirlo no duplique mensajes. Los 151 correos salieron sin un solo fallo.

## Diagnóstico sobre un sistema heredado

### La recuperación de contraseña, rota desde 2020

El enlace del correo devolvía un error 500. La búsqueda del token recorría **todas las filas** de la tabla aplicando bcrypt a cada una. Medido en el servidor: **72 ms por fila × 1,313 filas = 95 segundos**, contra un límite de ejecución de PHP de 30. No es que a veces fallara: no podía terminar nunca.

Lo reproduje, lo medí y lo dejé en **0.17 s**. Los registros contaban la historia: los intentos de recuperación por año, desde 2020, fueron 608, 473, 195, 25 y 2. Era la gente rindiéndose.

### Otras fallas

- **Columna faltante en producción**: existía en la base local pero nunca llegó al servidor, porque se había agregado a mano. La resolví con una migración con guarda, para que corra en ambos entornos.
- **Mensajes de validación en crudo**: el archivo de idioma español tenía dos mensajes de veintitantos; el resto se mostraba al usuario como `validation.between.numeric`.

## El 403 que no era nuestro

Reportaron que una alumna no podía terminar el diplomado por un error **403 Forbidden** en algunas lecciones. Antes de aceptar el reporte, lo verifiqué por capas:

1. La aplicación **no genera ninguna respuesta 403** en todo su código.
2. En catorce días de registros, las **968 respuestas 403** correspondían todas a rastreadores automatizados sondeando rutas inexistentes. Ninguna a una página real.
3. Busqué a la alumna por correo, documento de identidad, matrícula y nombre, incluidas cuentas dadas de baja y la base del país vecino. No existía. Tampoco el registro de auditoría tenía rastro de su correo.

La captura de pantalla que pedí cerró el caso: la barra de direcciones mostraba **otro dominio y otra plataforma**. El error nunca estuvo en el sistema que me reportaban.

> No dar por buena la descripción de un problema, y sostener la conclusión con evidencia reproducible antes de comunicarla al cliente.

## Dimensionamiento medido, no estimado

Ante una migración de servidor separé por dominio quince días de registros del servidor web para aislar la huella de cada sitio. El servidor de entonces (**8 vCPU y 31 GB**) estaba al **2.9 % de memoria y con carga 0.00**, y el pico real era de **una petición por segundo**. Recomendé **2 vCPU y 4 GB**. También detecté que de los 35 GB ocupados, 27 eran copias antiguas que no había que migrar.

Entrego estos análisis como documentos en PDF con gráficas, listos para circular con el cliente.

## Cómo lo trabajé

Desarrollo con apoyo de un agente de IA (Claude Code). Yo defino el enfoque, cuestiono los resultados y autorizo expresamente cada cambio a producción, con la regla de probar antes en local.
