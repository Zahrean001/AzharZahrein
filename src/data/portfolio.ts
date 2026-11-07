export interface NavItem {
  href: string;
  label: string;
  i18nKey:
    | 'nav.karya'
    | 'nav.sijagung'
    | 'nav.desain'
    | 'nav.tentang'
    | 'nav.pengalaman'
    | 'nav.pendidikan'
    | 'nav.keahlian'
    | 'nav.kontak';
}

export interface FeaturedWork {
  title: string;
  summary: string;
  href: string;
  delayMs: number;
  i18nTitleKey: 'workIntro.sijagungTitle' | 'workIntro.kemasanTitle';
  i18nSummaryKey: 'workIntro.sijagungSummary' | 'workIntro.kemasanSummary';
}

export interface SkillCategoryGroup {
  id: string;
  titleId: string;
  titleEn: string;
  skills: { name: string; status: 'active' | 'learning' }[];
}

export interface ToolItem {
  id: string;
  name: string;
  category: 'mobile' | 'languages' | 'backend' | 'web' | 'design' | 'tools' | 'cloud' | 'database';
  status: 'active' | 'learning';
  lane: 1 | 2 | 3;
  topColor: string;
  leftColor: string;
  rightColor: string;
  glyph: string;
}

export interface SijagungScreen {
  id: number;
  title: string;
  caption: string;
  alt: string;
  positionClass: 'phone-fan-center' | 'phone-fan-left' | 'phone-fan-right';
}

export const navItems: NavItem[] = [
  { href: '#tentang', label: 'Tentang Saya', i18nKey: 'nav.tentang' },
  { href: '#pengalaman', label: 'Pengalaman', i18nKey: 'nav.pengalaman' },
  { href: '#karya', label: 'Proyek', i18nKey: 'nav.karya' },
  { href: '#pendidikan', label: 'Pendidikan', i18nKey: 'nav.pendidikan' },
  { href: '#tools', label: 'Keahlian', i18nKey: 'nav.keahlian' },
  { href: '#kontak', label: 'Kontak', i18nKey: 'nav.kontak' },
];

export const featuredWorks: FeaturedWork[] = [
  {
    title: 'SIJAGUNG',
    summary: 'Aplikasi mobile pemantauan pertanian jagung Desa Kelubir',
    href: '#sijagung',
    delayMs: 140,
    i18nTitleKey: 'workIntro.sijagungTitle',
    i18nSummaryKey: 'workIntro.sijagungSummary',
  },
  {
    title: 'Desain Kemasan Komersial',
    summary: 'Standing pouch berstandar ritel untuk UMKM binaan CSR',
    href: '#kemasan',
    delayMs: 220,
    i18nTitleKey: 'workIntro.kemasanTitle',
    i18nSummaryKey: 'workIntro.kemasanSummary',
  },
];

export const sijagungScreens: SijagungScreen[] = [
  {
    id: 0,
    title: 'Dashboard',
    caption: '“Ringkasan data lapangan dan statistik panen secara real-time.”',
    alt: 'Tampilan antarmuka Dashboard SIJAGUNG',
    positionClass: 'phone-fan-center',
  },
  {
    id: 1,
    title: 'Data Petani',
    caption: '“Pencatatan profil dan luas lahan petani secara offline di perkebunan.”',
    alt: 'Tampilan antarmuka Data Petani SIJAGUNG',
    positionClass: 'phone-fan-left',
  },
  {
    id: 2,
    title: 'Data Panen',
    caption: '“Pencatatan hasil tonase panen dengan validasi komoditas.”',
    alt: 'Tampilan antarmuka Data Panen SIJAGUNG',
    positionClass: 'phone-fan-right',
  },
];

export const certifications: { name: string; issuer: string; code?: string }[] = [
  {
    name: 'AWS Academy Graduate — AWS Academy Cloud Developing',
    issuer: 'Amazon Web Services (AWS)',
  },
  {
    name: 'TOEFL (Test of English as a Foreign Language) — Score: 483',
    issuer: 'High Intermediate Proficiency',
  },
];

export const categorizedSkills: SkillCategoryGroup[] = [
  {
    id: 'mobile',
    titleId: 'Pengembangan Mobile',
    titleEn: 'Mobile Development',
    skills: [
      { name: 'Flutter SDK', status: 'active' },
      { name: 'Dart', status: 'active' },
      { name: 'State Management (Provider / BLoC)', status: 'active' },
      { name: 'Mobile REST API Integration', status: 'active' },
      { name: 'Kotlin (Android Native)', status: 'learning' },
      { name: 'Swift (iOS Native)', status: 'learning' },
    ],
  },
  {
    id: 'web',
    titleId: 'Web & Frontend',
    titleEn: 'Web & Frontend',
    skills: [
      { name: 'HTML5 & CSS3', status: 'active' },
      { name: 'Tailwind CSS', status: 'active' },
      { name: 'Bootstrap', status: 'active' },
      { name: 'Responsive Web Design', status: 'active' },
      { name: 'React', status: 'learning' },
      { name: 'Vue.js', status: 'learning' },
      { name: 'Next.js', status: 'learning' },
      { name: 'Astro', status: 'learning' },
      { name: 'Vite', status: 'learning' },
      { name: 'Sass / SCSS', status: 'learning' },
    ],
  },
  {
    id: 'backend',
    titleId: 'Backend & Arsitektur API',
    titleEn: 'Backend & API Architecture',
    skills: [
      { name: 'Laravel 10', status: 'active' },
      { name: 'PHP', status: 'active' },
      { name: 'RESTful API Architecture', status: 'active' },
      { name: 'Node.js', status: 'learning' },
      { name: 'Express.js', status: 'learning' },
      { name: 'GraphQL', status: 'learning' },
    ],
  },
  {
    id: 'database',
    titleId: 'Basis Data & Penyimpanan',
    titleEn: 'Databases & Storage',
    skills: [
      { name: 'MySQL Database', status: 'active' },
      { name: 'SQL Query Optimization', status: 'active' },
      { name: 'SQLite (Offline Cache)', status: 'learning' },
      { name: 'PostgreSQL', status: 'learning' },
      { name: 'Redis (Cache / Store)', status: 'learning' },
      { name: 'MongoDB (NoSQL)', status: 'learning' },
      { name: 'Supabase', status: 'learning' },
    ],
  },
  {
    id: 'languages',
    titleId: 'Bahasa Pemrograman',
    titleEn: 'Programming Languages',
    skills: [
      { name: 'Dart', status: 'active' },
      { name: 'PHP', status: 'active' },
      { name: 'HTML5 & CSS3', status: 'active' },
      { name: 'SQL', status: 'active' },
      { name: 'TypeScript', status: 'learning' },
      { name: 'JavaScript', status: 'learning' },
      { name: 'Python', status: 'learning' },
    ],
  },
  {
    id: 'design',
    titleId: 'UI/UX & Desain Produk',
    titleEn: 'UI/UX & Product Design',
    skills: [
      { name: 'Figma (UI/UX Prototyping)', status: 'active' },
      { name: 'Canva', status: 'active' },
      { name: 'Desain Kemasan Komersial UMKM', status: 'active' },
      { name: 'Design Systems & Wireframing', status: 'active' },
      { name: 'Adobe Photoshop', status: 'learning' },
      { name: 'Adobe Illustrator', status: 'learning' },
      { name: 'CorelDRAW', status: 'learning' },
    ],
  },
  {
    id: 'tools',
    titleId: 'DevOps & Tooling Pengembang',
    titleEn: 'DevOps & Developer Tooling',
    skills: [
      { name: 'Git & GitHub', status: 'active' },
      { name: 'AWS Cloud Services', status: 'active' },
      { name: 'Postman (API Testing)', status: 'active' },
      { name: 'Vercel Platform', status: 'active' },
      { name: 'Docker', status: 'learning' },
      { name: 'Kubernetes', status: 'learning' },
      { name: 'Linux Terminal', status: 'learning' },
      { name: 'Nginx', status: 'learning' },
    ],
  },
];

/* 
 * 3 PARALLEL ISOMETRIC CONVEYOR LANES
 * Mastered (15 Tools): Colors ACTIVE
 *   - flutter, dart, html, css, tailwind, bootstrap
 *   - laravel, php, restapi, mysql
 *   - git, github, aws, figma, canva
 * Unmastered: Colors DEACTIVATED (muted dark zinc/slate grayscale)
 */
export const lane1Tools: ToolItem[] = [
  {
    id: 'flutter',
    name: 'Flutter',
    category: 'mobile',
    status: 'active',
    lane: 1,
    topColor: '#38bdf8',
    leftColor: '#0284c7',
    rightColor: '#0369a1',
    glyph: 'flutter',
  },
  {
    id: 'dart',
    name: 'Dart',
    category: 'languages',
    status: 'active',
    lane: 1,
    topColor: '#2dd4bf',
    leftColor: '#0d9488',
    rightColor: '#115e59',
    glyph: 'dart',
  },
  {
    id: 'html',
    name: 'HTML5',
    category: 'web',
    status: 'active',
    lane: 1,
    topColor: '#f97316',
    leftColor: '#ea580c',
    rightColor: '#c2410c',
    glyph: 'html',
  },
  {
    id: 'css',
    name: 'CSS3',
    category: 'web',
    status: 'active',
    lane: 1,
    topColor: '#38bdf8',
    leftColor: '#2563eb',
    rightColor: '#1d4ed8',
    glyph: 'css',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'web',
    status: 'active',
    lane: 1,
    topColor: '#38bdf8',
    leftColor: '#0891b2',
    rightColor: '#0e7490',
    glyph: 'tailwind',
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    category: 'web',
    status: 'active',
    lane: 1,
    topColor: '#a855f7',
    leftColor: '#7e22ce',
    rightColor: '#581c87',
    glyph: 'bootstrap',
  },
  {
    id: 'react',
    name: 'React',
    category: 'web',
    status: 'learning',
    lane: 1,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'react',
  },
  {
    id: 'vue',
    name: 'Vue.js',
    category: 'web',
    status: 'learning',
    lane: 1,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'vue',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'web',
    status: 'learning',
    lane: 1,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'nextjs',
  },
  {
    id: 'astro',
    name: 'Astro',
    category: 'web',
    status: 'learning',
    lane: 1,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'astro',
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'web',
    status: 'learning',
    lane: 1,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'vite',
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    category: 'mobile',
    status: 'learning',
    lane: 1,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'kotlin',
  },
  {
    id: 'swift',
    name: 'Swift',
    category: 'mobile',
    status: 'learning',
    lane: 1,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'swift',
  },
  {
    id: 'sass',
    name: 'Sass / SCSS',
    category: 'web',
    status: 'learning',
    lane: 1,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'sass',
  },
];

export const lane2Tools: ToolItem[] = [
  {
    id: 'laravel',
    name: 'Laravel',
    category: 'backend',
    status: 'active',
    lane: 2,
    topColor: '#f87171',
    leftColor: '#dc2626',
    rightColor: '#991b1b',
    glyph: 'laravel',
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'languages',
    status: 'active',
    lane: 2,
    topColor: '#818cf8',
    leftColor: '#4f46e5',
    rightColor: '#3730a3',
    glyph: 'php',
  },
  {
    id: 'rest-api',
    name: 'REST API',
    category: 'backend',
    status: 'active',
    lane: 2,
    topColor: '#34d399',
    leftColor: '#059669',
    rightColor: '#065f46',
    glyph: 'api',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'database',
    status: 'active',
    lane: 2,
    topColor: '#fbbf24',
    leftColor: '#d97706',
    rightColor: '#92400e',
    glyph: 'mysql',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    status: 'learning',
    lane: 2,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'nodejs',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'languages',
    status: 'learning',
    lane: 2,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'python',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'languages',
    status: 'learning',
    lane: 2,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'ts',
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'backend',
    status: 'learning',
    lane: 2,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'express',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    status: 'learning',
    lane: 2,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'postgresql',
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    category: 'database',
    status: 'learning',
    lane: 2,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'sqlite',
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'database',
    status: 'learning',
    lane: 2,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'redis',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
    status: 'learning',
    lane: 2,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'mongodb',
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'backend',
    status: 'learning',
    lane: 2,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'graphql',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'database',
    status: 'learning',
    lane: 2,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'supabase',
  },
];

export const lane3Tools: ToolItem[] = [
  {
    id: 'git',
    name: 'Git',
    category: 'tools',
    status: 'active',
    lane: 3,
    topColor: '#fb923c',
    leftColor: '#ea580c',
    rightColor: '#9a3412',
    glyph: 'git',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'tools',
    status: 'active',
    lane: 3,
    topColor: '#f4f4f5',
    leftColor: '#52525b',
    rightColor: '#27272a',
    glyph: 'github',
  },
  {
    id: 'aws-cloud',
    name: 'AWS Cloud',
    category: 'cloud',
    status: 'active',
    lane: 3,
    topColor: '#fbbf24',
    leftColor: '#d97706',
    rightColor: '#78350f',
    glyph: 'aws',
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'design',
    status: 'active',
    lane: 3,
    topColor: '#c084fc',
    leftColor: '#9333ea',
    rightColor: '#6b21a8',
    glyph: 'figma',
  },
  {
    id: 'canva',
    name: 'Canva',
    category: 'design',
    status: 'active',
    lane: 3,
    topColor: '#22d3ee',
    leftColor: '#06b6d4',
    rightColor: '#0e7490',
    glyph: 'canva',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'cloud',
    status: 'learning',
    lane: 3,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'docker',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'cloud',
    status: 'learning',
    lane: 3,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'kubernetes',
  },
  {
    id: 'linux',
    name: 'Linux Terminal',
    category: 'tools',
    status: 'learning',
    lane: 3,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'linux',
  },
  {
    id: 'postman',
    name: 'Postman',
    category: 'tools',
    status: 'active',
    lane: 3,
    topColor: '#fb923c',
    leftColor: '#ea580c',
    rightColor: '#c2410c',
    glyph: 'postman',
  },
  {
    id: 'vercel',
    name: 'Vercel Platform',
    category: 'cloud',
    status: 'active',
    lane: 3,
    topColor: '#27272a',
    leftColor: '#18181b',
    rightColor: '#09090b',
    glyph: 'vercel',
  },
  {
    id: 'ps',
    name: 'Photoshop',
    category: 'design',
    status: 'learning',
    lane: 3,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'ps',
  },
  {
    id: 'ai',
    name: 'Illustrator',
    category: 'design',
    status: 'learning',
    lane: 3,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'ai',
  },
  {
    id: 'coreldraw',
    name: 'CorelDRAW',
    category: 'design',
    status: 'learning',
    lane: 3,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'coreldraw',
  },
  {
    id: 'nginx',
    name: 'Nginx',
    category: 'cloud',
    status: 'learning',
    lane: 3,
    topColor: '#3f3f46',
    leftColor: '#27272a',
    rightColor: '#18181b',
    glyph: 'nginx',
  },
];

export const toolItems: ToolItem[] = [...lane1Tools, ...lane2Tools, ...lane3Tools];
