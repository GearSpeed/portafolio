/**
 * Contenido de la página principal en inglés. Es la traducción de sitio.ts: mismas
 * exportaciones, mismas cifras. Al cambiar un dato en un idioma, cámbialo también aquí.
 */
import type * as Es from './sitio';

export const perfil: Record<keyof typeof Es.perfil, string> = {
  nombre: 'Omar Dev Sampayo',
  nombreCorto: 'Omar Dev',
  rol: 'Full-Stack Developer',
  rolIA: 'AI Automation',
  ubicacion: 'Mexico City',
  disponibilidad: 'Available for remote work · Mexico City',
  lema: 'I build software end to end and automate processes with AI: from pipelines that research, produce and publish content almost on their own to legacy systems I make operable and measurable.',
  descripcion:
    'Full-stack developer specialized in AI automation. I build software end to end, run AI pipelines in production and modernize legacy systems, such as a banking platform in three countries.',
  correo: 'contacto@omarsampayo.dev',
  github: 'https://github.com/GearSpeed',
  githubUsuario: 'GearSpeed',
  linkedin: 'https://www.linkedin.com/in/omar-d-sampayo/',
  linkedinUsuario: 'omar-d-sampayo',
};

export const navegacion: typeof Es.navegacion = [
  { href: '/en/#impacto', texto: 'Impact' },
  { href: '/en/#proyectos', texto: 'Projects' },
  { href: '/en/#experiencia', texto: 'Experience' },
  { href: '/en/#sobre-mi', texto: 'About' },
  { href: '/en/#contacto', texto: 'Contact' },
];

export const metricas: typeof Es.metricas = [
  {
    etiqueta: 'Diagnosis',
    valor: '95 s → 0.17 s',
    detalle: 'A password recovery flow that could not finish since 2020. I measured it, found the cause and today it responds instantly.',
    pie: { etiqueta: 'Broken since', valor: '2020' },
    href: '/en/projects/plataforma-educacion-financiera-honduras/',
  },
  {
    etiqueta: 'International reach',
    valor: '3 countries',
    detalle: "Banco Azteca's financial education platform in Mexico, Guatemala and Honduras.",
    pie: { etiqueta: 'Status', valor: 'In production' },
    href: '/en/projects/plataforma-educacion-financiera/',
  },
  {
    etiqueta: 'Quality',
    valor: '300+',
    unidad: 'tests',
    detalle: 'Automated tests in a sales system in daily use: 170+ integration tests against real PostgreSQL and 88 E2E.',
    pie: { etiqueta: 'Accessibility', valor: 'WCAG 2.1 AA' },
    href: '/en/projects/una-vez-mas/',
  },
  {
    etiqueta: 'Automation',
    valor: '~2 USD',
    unidad: 'per video',
    detalle: 'AI pipeline that researches, narrates, illustrates, renders and publishes history videos.',
    pie: { etiqueta: 'Daily output', valor: '1 video + 3 Shorts' },
    href: '/en/projects/retazos-de-historia/',
  },
];

export const categoriasProyecto: Record<keyof typeof Es.categoriasProyecto, string> = {
  web: 'Web platforms',
  negocio: 'Business systems',
  ia: 'Artificial intelligence',
};

export const experiencia: Es.Puesto[] = [
  {
    empresa: 'Grupo Salinas',
    puesto: 'E-learning Technical Lead / Full-Stack Developer',
    periodo: 'Mar 2025 – Present',
    actual: true,
    contexto: "Banco Azteca's financial education platform (Mexico, Guatemala and Honduras)",
    logros: [
      'Built the administrative panel from scratch in **Laravel 11 + Filament 5** (courses, modules, lessons, students, certificates, roles and permissions): the client now runs its own content without depending on development.',
      'Built a second panel for Honduras in **NestJS 11 + Angular 21** on top of a legacy database I could not modify: 8 screens and least-privilege access.',
      'Designed the **metrics and reporting** system that did not exist: a dashboard with drill-down widgets and streaming Excel export, with a single source of truth for panel and report.',
      'Delivered end to end a requirement from the Honduran banking regulator (**CNBS**): questionnaire audit, 3-step mobile wizard, server-side diploma locking and an email campaign to 151 graduates without a single failure.',
      'Fixed the password recovery flow, broken since 2020: from **95 s to 0.17 s**, removing a linear bcrypt scan over every row.',
      'Deployed the Guatemala installation on a shared, undocumented server with no service impact.',
      'Participated in the development and production architecture on **AWS** (load balancer and S3) and in certifying the application at IEECO, the internal certification platform of Grupo Salinas.',
      'Top contributor to the Mexico repository (**140 of 184 commits**) and sole author of the administrative panel in all three countries.',
    ],
    otros: {
      titulo: 'Other group projects',
      texto: 'Components and features in React for Portal CoE 2.0 and in Angular for other projects; API consumption, MySQL databases and GitLab.',
    },
    stack: ['Laravel 11', 'Filament 5', 'NestJS 11', 'Angular 21', 'MySQL', 'MariaDB', 'AWS', 'Cloudflare', 'Docker'],
  },
  {
    empresa: 'Proyecto Stimate',
    puesto: 'Full-Stack Developer',
    periodo: 'Sep 2024 – Jan 2025',
    logros: [
      'Developed front-end features with Next.js, React and Tailwind, and REST APIs deployed on AWS.',
      'Designed the login and hero UX/UI in Figma; coordinated tasks with Scrum and Trello, with a Git branching workflow on GitHub.',
    ],
    stack: ['Next.js', 'React', 'Tailwind', 'REST', 'AWS', 'Figma'],
  },
  {
    empresa: 'Qodinc',
    puesto: 'Front-End Developer',
    periodo: 'Jul 2023 – Jul 2024',
    logros: ['Developed archetypes and reusable components for several projects in Angular, Next.js and Laravel.'],
    stack: ['Angular', 'Next.js', 'Laravel'],
  },
  {
    empresa: 'Krolls Telcomm de México',
    puesto: 'Support and NOC Engineer',
    periodo: 'Aug 2019 – Sep 2022',
    contexto: 'Client: Nacional Monte de Piedad',
    logros: ['Took part in the nationwide technology refresh with Cisco Catalyst equipment; network monitoring at the NOC and ticket resolution.'],
    stack: ['Cisco Catalyst', 'NOC', 'Networking'],
  },
];

export const principios: typeof Es.principios = [
  {
    titulo: 'Measure before fixing',
    texto: 'I reproduce the problem and back it with logs, SQL or measured timings before communicating a cause.',
  },
  {
    titulo: 'No deletions in production',
    texto: 'When the data is wrong, I fix how it is read and bring the root cause to the client instead of hiding it.',
  },
  {
    titulo: 'Document and communicate',
    texto: 'I deliver sizing studies, diagnoses and proposals as PDFs ready to circulate, not just code.',
  },
  {
    titulo: 'AI as a multiplier',
    texto: 'I work with agents (Claude Code). I set the approach, question the results and approve every production change.',
  },
];

export const habilidades: typeof Es.habilidades = [
  {
    grupo: 'Frontend',
    items: ['Angular (signals, standalone)', 'React', 'Next.js', 'Angular Material', 'Tailwind', 'Bootstrap', 'Blade', 'Livewire'],
  },
  {
    grupo: 'Backend',
    items: ['Laravel 11', 'Filament', 'NestJS', 'Node.js', 'REST', 'JWT', 'RBAC'],
  },
  {
    grupo: 'Data',
    items: ['PostgreSQL', 'MySQL', 'MariaDB', 'MongoDB', 'Drizzle', 'TypeORM', 'Eloquent'],
  },
  {
    grupo: 'Infrastructure',
    items: ['Docker', 'AWS (EC2, ALB, WAF, S3)', 'Cloudflare (Tunnel, Access, R2)', 'Linux', 'Apache', 'GitHub Actions', 'CI/CD'],
  },
  {
    grupo: 'Quality and accessibility',
    items: ['Vitest', 'Playwright', 'Testcontainers', 'WCAG 2.1 AA'],
  },
  {
    grupo: 'AI and automation',
    items: ['Claude / Claude Code', 'OpenAI API', 'ElevenLabs', 'n8n', 'Remotion', 'YouTube Data API'],
  },
];

export const lenguajes: typeof Es.lenguajes = ['TypeScript', 'JavaScript', 'PHP 8', 'Python', 'Bash', 'SQL', 'HTML', 'CSS/Sass'];
export const metodologia: typeof Es.metodologia = ['Scrum', 'Git', 'GitHub', 'GitLab', 'Figma', 'Trello'];

export const educacion: typeof Es.educacion = {
  titulo: 'Information and Communications Technologies Engineering',
  institucion: 'Instituto Tecnológico de Tláhuac II',
  lugar: 'Mexico City',
  periodo: '2013 – 2019',
};

export const certificaciones: typeof Es.certificaciones = [
  { titulo: 'Full Stack Jr Web Developer JavaScript' },
  { titulo: 'Scrum Fundamentals Certified' },
  { titulo: 'Becoming a Cloud Practitioner', emisor: 'AWS Skills Centers' },
];

export const idiomas: typeof Es.idiomas = [
  { idioma: 'Spanish', nivel: 'Native' },
  { idioma: 'English', nivel: 'A2 · reading technical documentation' },
];
