/**
 * Contenido de la página principal.
 *
 * Regla del proyecto: cada cifra de este archivo sale del CV o de los documentos de
 * contexto de cada proyecto. Nada se toma del maquetado de Stitch, que traía datos de
 * relleno (SLA, latencias, porcentajes) sin respaldo.
 */

export const perfil = {
  nombre: 'Omar Dev Sampayo',
  nombreCorto: 'Omar Dev',
  rol: 'Full-Stack Developer',
  rolIA: 'Automatización con IA',
  cargo: 'Líder técnico e-learning',
  ubicacion: 'Ciudad de México',
  disponibilidad: 'Disponible para remoto · Ciudad de México',
  lema: 'Construyo software de punta a punta, modernizo sistemas heredados y automatizo procesos con IA para resolver problemas reales de negocio con claridad y estabilidad.',
  descripcion:
    'Full-stack developer y líder técnico de la plataforma de educación financiera de Banco Azteca en México, Guatemala y Honduras. Tomo sistemas heredados y los vuelvo operables, medibles y confiables.',
  correo: 'omar.1993.ds@hotmail.com',
  github: 'https://github.com/GearSpeed',
  githubUsuario: 'GearSpeed',
  linkedin: 'https://www.linkedin.com/in/omar-d-sampayo/',
  linkedinUsuario: 'omar-d-sampayo',
  cv: '/docs/CV_Omar_Deseusa_Sampayo.pdf',
} as const;

export const navegacion = [
  { href: '/#impacto', texto: 'Impacto' },
  { href: '/#proyectos', texto: 'Proyectos' },
  { href: '/#experiencia', texto: 'Experiencia' },
  { href: '/#sobre-mi', texto: 'Sobre mí' },
  { href: '/#contacto', texto: 'Contacto' },
] as const;

export const metricas: {
  etiqueta: string;
  valor: string;
  unidad?: string;
  detalle: string;
  pie: { etiqueta: string; valor: string };
  href: string;
}[] = [
  {
    etiqueta: 'Diagnóstico',
    valor: '95 s → 0.17 s',
    detalle: 'Recuperación de contraseña que no podía terminar desde 2020. La medí, encontré la causa y hoy responde al instante.',
    pie: { etiqueta: 'Rota desde', valor: '2020' },
    href: '/proyectos/plataforma-educacion-financiera-honduras/',
  },
  {
    etiqueta: 'Alcance internacional',
    valor: '3 países',
    detalle: 'Plataforma de educación financiera de Banco Azteca en México, Guatemala y Honduras.',
    pie: { etiqueta: 'Estado', valor: 'En producción' },
    href: '/proyectos/plataforma-educacion-financiera/',
  },
  {
    etiqueta: 'Calidad',
    valor: '300+',
    unidad: 'pruebas',
    detalle: 'Pruebas automatizadas en un sistema de ventas en uso diario: 170+ de integración contra PostgreSQL real y 88 E2E.',
    pie: { etiqueta: 'Accesibilidad', valor: 'WCAG 2.1 AA' },
    href: '/proyectos/una-vez-mas/',
  },
  {
    etiqueta: 'Automatización',
    valor: '~2 USD',
    unidad: 'por video',
    detalle: 'Pipeline con IA que investiga, narra, ilustra, renderiza y publica videos de divulgación histórica.',
    pie: { etiqueta: 'Capacidad diaria', valor: '1 video + 3 Shorts' },
    href: '/proyectos/retazos-de-historia/',
  },
];

/** Filtros de la sección de proyectos; cada caso declara su `categoria` en el Markdown. */
export const categoriasProyecto = {
  web: 'Plataformas web',
  negocio: 'Sistemas de negocio',
  ia: 'Inteligencia artificial',
} as const;

export type Puesto = {
  empresa: string;
  puesto: string;
  periodo: string;
  actual?: boolean;
  contexto?: string;
  logros: string[];
  otros?: { titulo: string; texto: string };
  stack: string[];
};

export const experiencia: Puesto[] = [
  {
    empresa: 'Grupo Salinas',
    puesto: 'Líder técnico e-learning / Full-Stack Developer',
    periodo: 'Mar 2025 – Actualidad',
    actual: true,
    contexto: 'Plataforma de educación financiera de Banco Azteca (México, Guatemala y Honduras)',
    logros: [
      'Construí desde cero el panel administrativo en **Laravel 11 + Filament 5** (cursos, módulos, lecciones, alumnos, certificados, roles y permisos): el cliente pasó a operar su contenido sin depender de desarrollo.',
      'Construí un segundo panel para Honduras en **NestJS 11 + Angular 21** sobre una base heredada que no podía modificar: 8 pantallas y acceso con privilegio mínimo.',
      'Diseñé el sistema de **métricas e informes** que no existía: dashboard con widgets navegables y exportación a Excel en streaming, con una sola fuente de verdad entre panel e informe.',
      'Implementé de punta a punta un requisito del regulador bancario hondureño (**CNBS**): auditoría del cuestionario, asistente móvil de 3 pasos, bloqueo de diplomas en servidor y campaña de correo a 151 egresados sin un solo fallo.',
      'Reparé la recuperación de contraseña, rota desde 2020: de **95 s a 0.17 s**, corrigiendo un recorrido lineal con bcrypt por fila.',
      'Desplegué la instalación de Guatemala en un servidor compartido y sin documentación, sin afectar el servicio.',
      'Participé en la arquitectura de desarrollo y producción en **AWS** (load balancer y S3) y en la certificación de la aplicación en IEECO, la plataforma interna de certificación de Grupo Salinas.',
      'Principal contribuidor del repositorio de México (**140 de 184 commits**) y único autor del panel administrativo en los tres países.',
    ],
    otros: {
      titulo: 'Otros proyectos del grupo',
      texto: 'Componentes y funcionalidades en React para Portal CoE 2.0 y en Angular para otros proyectos; consumo de APIs, bases MySQL y GitLab.',
    },
    stack: ['Laravel 11', 'Filament 5', 'NestJS 11', 'Angular 21', 'MySQL', 'MariaDB', 'AWS', 'Cloudflare', 'Docker'],
  },
  {
    empresa: 'Proyecto Stimate',
    puesto: 'Full-Stack Developer',
    periodo: 'Sep 2024 – Ene 2025',
    logros: [
      'Desarrollé funcionalidades front-end con Next.js, React y Tailwind, y APIs REST desplegadas en AWS.',
      'Diseñé en Figma la UX/UI del login y del hero; coordiné tareas con Scrum y Trello, con flujo de ramas en Git y GitHub.',
    ],
    stack: ['Next.js', 'React', 'Tailwind', 'REST', 'AWS', 'Figma'],
  },
  {
    empresa: 'Qodinc',
    puesto: 'Front-End Developer',
    periodo: 'Jul 2023 – Jul 2024',
    logros: ['Desarrollé arquetipos y componentes reutilizables para varios proyectos en Angular, Next.js y Laravel.'],
    stack: ['Angular', 'Next.js', 'Laravel'],
  },
  {
    empresa: 'Krolls Telcomm de México',
    puesto: 'Ingeniero de soporte y NOC',
    periodo: 'Ago 2019 – Sep 2022',
    contexto: 'Cliente: Nacional Monte de Piedad',
    logros: ['Participé en el refresh tecnológico nacional con equipos Cisco Catalyst; monitoreo de red en NOC y resolución de tickets.'],
    stack: ['Cisco Catalyst', 'NOC', 'Redes'],
  },
];

export const principios: { titulo: string; texto: string }[] = [
  {
    titulo: 'Medir antes de arreglar',
    texto: 'Reproduzco el problema y lo sostengo con registros, SQL o tiempos medidos antes de comunicar una causa.',
  },
  {
    titulo: 'No borrar en producción',
    texto: 'Cuando los datos están mal, corrijo cómo se leen y llevo la causa de raíz al cliente en vez de taparla.',
  },
  {
    titulo: 'Documentar y comunicar',
    texto: 'Entrego dimensionamientos, diagnósticos y propuestas en PDF, listos para circular, no solo código.',
  },
  {
    titulo: 'IA como multiplicador',
    texto: 'Trabajo con agentes (Claude Code). Yo defino el enfoque, cuestiono los resultados y apruebo cada cambio a producción.',
  },
];

export const habilidades: { grupo: string; items: string[] }[] = [
  {
    grupo: 'Frontend',
    items: ['Angular (signals, standalone)', 'React', 'Next.js', 'Angular Material', 'Tailwind', 'Bootstrap', 'Blade', 'Livewire'],
  },
  {
    grupo: 'Backend',
    items: ['Laravel 11', 'Filament', 'NestJS', 'Node.js', 'REST', 'JWT', 'RBAC'],
  },
  {
    grupo: 'Datos',
    items: ['PostgreSQL', 'MySQL', 'MariaDB', 'MongoDB', 'Drizzle', 'TypeORM', 'Eloquent'],
  },
  {
    grupo: 'Infraestructura',
    items: ['Docker', 'AWS (EC2, ALB, WAF, S3)', 'Cloudflare (Tunnel, Access, R2)', 'Linux', 'Apache', 'GitHub Actions', 'CI/CD'],
  },
  {
    grupo: 'Calidad y accesibilidad',
    items: ['Vitest', 'Playwright', 'Testcontainers', 'WCAG 2.1 AA'],
  },
  {
    grupo: 'IA y automatización',
    items: ['Claude / Claude Code', 'OpenAI API', 'ElevenLabs', 'n8n', 'Remotion', 'YouTube Data API'],
  },
];

export const lenguajes = ['TypeScript', 'JavaScript', 'PHP 8', 'Python', 'Bash', 'SQL', 'HTML', 'CSS/Sass'];
export const metodologia = ['Scrum', 'Git', 'GitHub', 'GitLab', 'Figma', 'Trello'];

export const educacion = {
  titulo: 'Ingeniería en Tecnologías de la Información y Comunicaciones',
  institucion: 'Instituto Tecnológico de Tláhuac II',
  lugar: 'Ciudad de México',
  periodo: '2013 – 2019',
};

export const certificaciones = [
  { titulo: 'Full Stack Jr Web Developer JavaScript' },
  { titulo: 'Scrum Fundamentals Certified' },
  { titulo: 'Becoming a Cloud Practitioner', emisor: 'AWS Skills Centers' },
];

export const idiomas = [
  { idioma: 'Español', nivel: 'Nativo' },
  { idioma: 'Inglés', nivel: 'A2 · lectura de documentación técnica' },
];
