---
titulo: Retazos de Historia
subtitulo: Automated AI video pipeline
cliente: History YouTube channel
tipo: propio
rol: Creator and developer
periodo: Oct 2026 – present
estado: Publishing
categoria: ia
sector: AI · Automation
orden: 7
resumen: A YouTube channel about historical curiosities produced almost entirely automatically. I designed the pipeline that researches, narrates, illustrates, renders and publishes.
problema: Publishing one long video and three Shorts a day, well researched and sourced, without spending hours editing or a large budget.
solucion: Claude researches and writes the script as validated JSON; ElevenLabs narrates; OpenAI illustrates; Remotion renders; the YouTube Data API schedules publishing.
resultado: My daily involvement comes down to choosing a topic from my phone, at a cost of 1.50 to 2 USD per video.
cifras:
  - valor: ~2 USD
    etiqueta: cost per video, with narration and images
  - valor: 1 + 3
    etiqueta: long video and Shorts per day, designed capacity
  - valor: 70–100
    etiqueta: scenes and images per video
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
portada: ../../assets/proyectos/retazos-de-historia.webp
portadaAlt: The Retazos de Historia YouTube channel, with its banner and latest videos.
descripcionSeo: Case study of Retazos de Historia, an AI video pipeline that orchestrates Claude, ElevenLabs, OpenAI, n8n, Remotion and the YouTube Data API.
---

## Context

**Retazos de Historia** is a Spanish-language YouTube channel about curiosities and events from ancient, medieval, modern and contemporary history. Each video runs 8 to 11 minutes and is cut into 3 Shorts. The goal is to grow and monetize the channel with original, well-researched content, at a pace of **one video a day**.

I designed and built the whole system. The first tests date from October 10, 2026, and the first videos (the Vikings in America in 1021 and the Emu War) are already published, with their Shorts scheduled.

## How it works

1. **Ideas.** A scheduled Claude task runs at 6:00 (Mexico City time), researches the web and proposes 5 verified topics with sources, varied in era and region and without repeating past topics.
2. **Script.** I choose a topic from my phone. Claude researches it with at least 4 sources and returns a JSON with the narration (1,300 to 1,700 words across 70 to 100 scenes, each with its image prompt), the YouTube metadata, the thumbnail, the music and the 3 Shorts segments. A Python script **validates it automatically**.
3. **Audio in n8n.** I save the JSON to OneDrive. An n8n workflow on a VPS generates the narration with ElevenLabs, with **word-level alignment** to get each scene's timing, plus the background music. If the audio already exists, it resumes without paying for it again.
4. **Images and rendering on my PC.** A systemd service checks every 3 minutes. It generates the images with the OpenAI API, and **Remotion** (React) renders the video with a Ken Burns effect, transitions, title, watermark, faded music and a subscribe call to action.
5. **Publishing.** The video is uploaded scheduled for 18:00 with its thumbnail. Then 3 vertical 1080×1920 Shorts are cut with an on-screen hook and **word-by-word animated subtitles**, scheduled for 12:00, 15:00 and 20:00.
6. **Monitoring.** An alerts workflow checks every 15 minutes and sends an email if there are errors, stuck steps, a script pending for too long or a low ElevenLabs balance.

## Engineering problems solved

### Executions hanging without an error

When generating about 80 images in a single execution, n8n's external Python task runner shut down for inactivity and the execution hung without warning. I fixed the runner version and the shutdown timeout, but n8n was still unreliable with large workloads, so I **redesigned the architecture**: n8n now only handles audio, and images moved to a local service.

### Image generation resilient to failures and costs

- Each image is saved **atomically** (a temporary file, then renamed), so the process is **resumable** after an interruption.
- It **rate-limits** to 3 concurrent requests and at most 15 per minute.
- It **retries with exponential backoff** on 429, 5xx and timeout errors.
- If moderation rejects an image, it uses the neighboring one and logs it.
- It stops immediately if there is no balance or the key is invalid.
- If more than 15 % of the images are missing, it **does not publish an incomplete video**.

A test suite with a mocked OpenAI server validates retries, interruptions and errors without spending credit.

### Idempotency and duplicate prevention

The OneDrive client on Linux reverted a state file that was rewritten several times within a few seconds. I moved the record of uploaded Shorts out of OneDrive, it is now written only once, and before uploading the 50 most recent videos on the channel are checked.

### Cost control

| Item | Approximate cost |
| --- | --- |
| Narration and music (ElevenLabs) | 1.00 to 1.50 USD |
| Images (OpenAI, ~0.0055 USD each) | ~0.45 USD |
| Shorts (cut from the already rendered video) | 0 USD |
| Music track reused from the library | 0 USD (a new one costs ~0.90) |

## Content quality

The scripts cite verifiable sources and explicitly flag when something is a legend or doubtful. The JSON validation checks word and scene ranges, character limits and that the Shorts do not overlap.
