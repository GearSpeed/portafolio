---
titulo: Retazos de Historia
subtitulo: Pipeline automatizado de video con IA
cliente: Canal de YouTube de divulgación histórica
tipo: propio
rol: Creador y desarrollador
periodo: Oct 2026 – hoy
estado: Publicando
categoria: ia
sector: IA · Automatización
orden: 5
destacado: false
resumen: Un canal de YouTube de curiosidades históricas producido casi por completo de forma automática. Diseñé el pipeline que investiga, narra, ilustra, renderiza y publica.
problema: Publicar un video largo y tres Shorts al día, bien investigados y con fuentes, sin dedicarle horas de edición ni un presupuesto alto.
solucion: Claude investiga y escribe el guion en JSON validado; ElevenLabs narra; OpenAI ilustra; Remotion renderiza; la YouTube Data API programa la publicación.
resultado: Mi intervención diaria se reduce a elegir un tema desde el celular, con un costo de 1.50 a 2 USD por video.
cifras:
  - valor: ~2 USD
    etiqueta: costo por video, con narración e imágenes
  - valor: 1 + 3
    etiqueta: video largo y Shorts al día, de capacidad diseñada
  - valor: 70–100
    etiqueta: escenas e imágenes por video
stack:
  - Claude
  - ElevenLabs
  - OpenAI Images
  - n8n
  - Remotion
  - React
  - TypeScript
  - Python
  - Bash
  - systemd
  - YouTube Data API
portada: ../../assets/proyectos/retazos-de-historia.png
portadaAlt: Canal de YouTube Retazos de Historia, con su portada y los videos más recientes.
descripcionSeo: Caso de estudio de Retazos de Historia, un pipeline de video con IA que orquesta Claude, ElevenLabs, OpenAI, n8n, Remotion y la YouTube Data API.
---

## Contexto

**Retazos de Historia** es un canal de YouTube en español sobre curiosidades y acontecimientos de la historia antigua, medieval, moderna y contemporánea. Cada video dura de 8 a 11 minutos y se recorta en 3 Shorts. El objetivo es crecer y monetizar el canal con contenido original y bien investigado, a un ritmo de **un video diario**.

Diseñé y monté todo el sistema. Las primeras pruebas son del 10 de octubre de 2026 y los primeros videos (los vikingos en América en 1021 y la Guerra de los Emús) ya están publicados, con sus Shorts programados.

## Cómo funciona

1. **Ideas.** Una tarea programada de Claude corre a las 6:00 (hora de CDMX), investiga en la web y propone 5 temas verificados con fuentes, variados en época y región y sin repetir el historial.
2. **Guion.** Elijo un tema desde el celular. Claude lo investiga con al menos 4 fuentes y entrega un JSON con la narración (1,300 a 1,700 palabras en 70 a 100 escenas, cada una con su prompt de imagen), los metadatos de YouTube, la miniatura, la música y los 3 tramos de Shorts. Un script de Python lo **valida automáticamente**.
3. **Audio en n8n.** Guardo el JSON en OneDrive. Un flujo de n8n en un VPS genera la narración con ElevenLabs, con **alineación por palabra** para obtener los tiempos de cada escena, y la música de fondo. Si el audio ya existe, reanuda sin volver a pagarlo.
4. **Imágenes y render en mi PC.** Un servicio systemd revisa cada 3 minutos. Genera las imágenes con la API de OpenAI y **Remotion** (React) renderiza el video con efecto Ken Burns, transiciones, título, marca de agua, música con fundido y llamada a suscribirse.
5. **Publicación.** El video sube programado a las 18:00 con su miniatura. Luego se recortan 3 Shorts verticales de 1080×1920 con gancho en pantalla y **subtítulos animados palabra por palabra**, programados a las 12:00, 15:00 y 20:00.
6. **Monitoreo.** Un flujo de alertas revisa cada 15 minutos y avisa por correo si hay errores, pasos atascados, un guion pendiente demasiado tiempo o poco saldo de ElevenLabs.

## Problemas de ingeniería resueltos

### Ejecuciones colgadas sin error

Al generar unas 80 imágenes en una sola ejecución, el *task runner* externo de Python de n8n se apagaba por inactividad y la ejecución quedaba colgada sin avisar. Corregí la versión del runner y el tiempo de apagado, pero n8n seguía siendo poco fiable con cargas grandes, así que **rediseñé la arquitectura**: n8n quedó solo para el audio y las imágenes pasaron a un servicio local.

### Generación de imágenes resistente a fallos y a costos

- Cada imagen se guarda de forma **atómica** (archivo temporal y luego renombrado), así que el proceso es **reanudable** tras un corte.
- **Limita la velocidad** a 3 peticiones simultáneas y un máximo de 15 por minuto.
- **Reintenta con espera creciente** ante errores 429, 5xx y tiempos agotados.
- Si la moderación rechaza una imagen, usa la vecina y lo registra.
- Se detiene de inmediato si no hay saldo o la clave es inválida.
- Si falta más del 15 % de las imágenes, **no publica un video incompleto**.

Una suite de pruebas con un servidor de OpenAI simulado valida reintentos, cortes y errores sin gastar saldo.

### Idempotencia y anti-duplicados

El cliente de OneDrive en Linux revirtió un archivo de estado que se reescribía varias veces en pocos segundos. Moví el registro de Shorts subidos fuera de OneDrive, ahora se escribe una sola vez, y antes de subir se revisan los 50 videos más recientes del canal.

### Control de costos

| Concepto | Costo aproximado |
| --- | --- |
| Narración y música (ElevenLabs) | 1.00 a 1.50 USD |
| Imágenes (OpenAI, ~0.0055 USD c/u) | ~0.45 USD |
| Shorts (recortados del video ya renderizado) | 0 USD |
| Pista de música reutilizada de la biblioteca | 0 USD (una nueva cuesta ~0.90) |

## Calidad del contenido

Los guiones citan fuentes verificables y avisan explícitamente cuando algo es leyenda o dudoso. La validación del JSON revisa rangos de palabras y escenas, límites de caracteres y que los Shorts no se solapen.
